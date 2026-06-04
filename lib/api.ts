import axios from 'axios';

const isServer = typeof window === 'undefined';
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

const API_BASE_URL = isServer ? `${BACKEND_URL}${API_PREFIX}` : API_PREFIX;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.NEXT_PUBLIC_BACKEND_API_KEY,
    },
});

api.interceptors.request.use(
    async (config) => {
        let token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

        // Fallback to cookie if localStorage is empty (Next.js middleware uses cookies)
        if (!token) {
            if (typeof document !== 'undefined') {
                const matches = document.cookie.match(/admin_access_token=([^;]+)/);
                if (matches) token = matches[1];
            } else if (isServer) {
                try {
                    const { cookies } = await import('next/headers');
                    const cookieStore = await cookies();
                    token = cookieStore.get('admin_access_token')?.value || null;
                } catch (e) {
                    // next/headers might not be available in all contexts
                    console.debug('next/headers not available for token retrieval');
                }
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refresh_token: refreshToken,
                    });
                    const { access_token } = response.data;
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('access_token', access_token);
                    }
                    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                    originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

                    processQueue(null, access_token);
                    isRefreshing = false;

                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    isRefreshing = false;
                    console.error('Token refresh failed:', refreshError);
                }
            } else {
                processQueue(new Error('No refresh token'), null);
                isRefreshing = false;
            }

            // If no refresh token or refresh failed, clear local storage but DO NOT redirect.
            // Redirection should be handled by the UI/Hooks (e.g. useRequireAuth) only when necessary.
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                // Removed window.location.href redirect to prevent unintended redirects on public pages
            }
        }
        return Promise.reject(error);
    }
);

export default api;

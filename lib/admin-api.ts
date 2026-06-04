import api from './api';
import type {
    WPUserRead as WPUser,
    WCOrderRead as WCOrder,
    LPCourse,
    LPSection,
    LPItem,
    LPCurriculum,
    LPQuiz,
    LPQuestion,
    LPCourseCreate,
    LPCourseUpdate,
    LPSectionCreate,
    LPSectionUpdate,
    LPItemCreate,
    LPItemUpdate,
    LPQuestionCreate,
    LPQuestionUpdate,
    WCProductRead,
    WCProductCreate,
    WCProductUpdate,
    WCProductFullRead,
    WCProductVariationRead,
    WCProductVariationCreate,
    WCProductVariationUpdate,
    WPTerm,
    WPPostFull,
    WCOrderCreate,
    WCOrderUpdate,
    WCOrderFull,
    LPLearner,
    LPQuizSubmissionRead,
    LPCourseStats,
    WPCommentRead,
    WPCommentUpdate,
    WPPostRead,
    WPPostCreate,
    WPPostUpdate,
    DynamicSignal,
    DynamicSignalCreate,
    DynamicTradingTool,
    DynamicTradingToolCreate,
    DynamicBook,
    DynamicBookCreate,
    DynamicVideo,
    DynamicVideoCreate,
    TradingToolPagination,
    BookPagination,
    SignalPagination,
    WCCoupon,
    WCCouponUpdate
} from './types';

export type {
    WPUser,
    WCOrder,
    LPCourse,
    LPSection,
    LPItem,
    LPCurriculum,
    LPQuiz,
    LPQuestion,
    LPCourseCreate,
    LPCourseUpdate,
    LPSectionCreate,
    LPSectionUpdate,
    LPItemCreate,
    LPItemUpdate,
    LPQuestionCreate,
    LPQuestionUpdate,
    WCProductRead,
    WCProductCreate,
    WCProductUpdate,
    WCProductFullRead,
    WCProductVariationRead,
    WCProductVariationCreate,
    WCProductVariationUpdate,
    WPTerm,
    WPPostFull,
    WCOrderCreate,
    WCOrderUpdate,
    WCOrderFull,
    LPLearner,
    LPQuizSubmissionRead,
    LPCourseStats,
    WPCommentRead,
    WPCommentUpdate,
    WPPostRead,
    WPPostCreate,
    WPPostUpdate,
    DynamicSignal,
    DynamicSignalCreate,
    DynamicTradingTool,
    DynamicTradingToolCreate,
    DynamicBook,
    DynamicBookCreate,
    DynamicVideo,
    DynamicVideoCreate,
    BookPagination,
    SignalPagination,
    WCCoupon,
    WCCouponUpdate
};

// Stats Service
export const adminStatsService = {
    // Since there is no dedicated stats endpoint, we might need to fetch lists or create a custom aggregator.
    // user said "connect it to backend", so we will fetch basic lists for now.
    getUsers: async (page = 1, per_page = 100) => {
        const response = await api.get<WPUser[]>('/wordpress/users/', { params: { page, per_page } });
        return response.data;
    },

    getOrders: async (limit = 100) => {
        const response = await api.get<WCOrder[]>('/wordpress/wc/orders', { params: { limit } });
        return response.data;
    },

    getCourses: async (limit = 100) => {
        // Admin endpoint for courses
        const response = await api.get<LPCourse[]>('/admin/learnpress/courses', { params: { limit } });
        return response.data;
    },

    // Aggregated dashboard stats
    getDashboardSummary: async () => {
        try {
            const [users, orders, courses] = await Promise.all([
                api.get<WPUser[]>('/wordpress/users/', { params: { per_page: 500 } }),
                api.get<WCOrder[]>('/wordpress/wc/orders/', { params: { limit: 500 } }),
                api.get<LPCourse[]>('/admin/learnpress/courses', { params: { limit: 500 } })
            ]);

            const completedOrders = orders.data.filter(o => o.status === 'completed' || o.status === 'processing');
            const totalRevenue = completedOrders.reduce((acc, order) => acc + (parseFloat(order.total_amount || '0')), 0);

            // Group revenue by month (last 12 months)
            const monthlyRevenue: Record<string, number> = {};
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            // Initialize last 6 months at minimum for the chart
            const now = new Date();
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                monthlyRevenue[months[d.getMonth()]] = 0;
            }

            completedOrders.forEach(order => {
                if (order.date_created_gmt) {
                    const date = new Date(order.date_created_gmt);
                    const month = months[date.getMonth()];
                    if (monthlyRevenue[month] !== undefined) {
                        monthlyRevenue[month] += parseFloat(order.total_amount || '0');
                    }
                }
            });

            const revenueChartData = Object.entries(monthlyRevenue).map(([name, revenue]) => ({
                name,
                revenue
            }));

            // Status distribution
            const statusCounts: Record<string, number> = {};
            orders.data.forEach(order => {
                const s = order.status || 'unknown';
                statusCounts[s] = (statusCounts[s] || 0) + 1;
            });

            const statusData = Object.entries(statusCounts).map(([name, value]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                value,
                color: name === 'completed' ? '#10B981' : name === 'pending' ? '#F59E0B' : name === 'failed' ? '#EF4444' : '#6B7280'
            }));

            return {
                users: users.data.length,
                orders: orders.data.length,
                courses: courses.data.length,
                revenue: totalRevenue,
                recentOrders: orders.data.slice(0, 6),
                revenueTrend: revenueChartData,
                statusDistribution: statusData
            };
        } catch (error) {
            console.error("Dashboard summary fetch failed", error);
            throw error;
        }
    }
};

export const adminLearnPressService = {
    // Courses
    getCourses: async (status: string = 'publish', limit = 50, offset = 0) => {
        const response = await api.get<LPCourse[]>('/admin/learnpress/courses', { params: { status, limit, offset } });
        return response.data;
    },
    getCourse: async (courseId: number) => {
        const response = await api.get<LPCourse>(`/admin/learnpress/courses/${courseId}`);
        return response.data;
    },
    createCourse: async (data: LPCourseCreate) => {
        const response = await api.post<LPCourse>('/admin/learnpress/courses', data);
        return response.data;
    },
    updateCourse: async (courseId: number, data: LPCourseUpdate) => {
        const response = await api.put<LPCourse>(`/admin/learnpress/courses/${courseId}`, data);
        return response.data;
    },
    deleteCourse: async (courseId: number, force: boolean = false) => {
        await api.delete(`/admin/learnpress/courses/${courseId}`, { params: { force } });
    },

    // Curriculum
    getCurriculum: async (courseId: number) => {
        const response = await api.get<LPCurriculum>(`/admin/learnpress/courses/${courseId}/curriculum`);
        return response.data;
    },

    // Sections
    createSection: async (courseId: number, data: LPSectionCreate) => {
        const response = await api.post<LPSection>(`/admin/learnpress/courses/${courseId}/sections`, data);
        return response.data;
    },
    updateSection: async (sectionId: number, data: LPSectionUpdate) => {
        const response = await api.put<LPSection>(`/admin/learnpress/sections/${sectionId}`, data);
        return response.data;
    },
    deleteSection: async (sectionId: number) => {
        await api.delete(`/admin/learnpress/sections/${sectionId}`);
    },

    // Items (Lessons/Quizzes)
    createItem: async (sectionId: number, data: LPItemCreate) => {
        const response = await api.post<LPItem>(`/admin/learnpress/sections/${sectionId}/items`, data);
        return response.data;
    },
    updateItem: async (itemId: number, data: LPItemUpdate) => {
        const response = await api.put<LPItem>(`/admin/learnpress/items/${itemId}`, data);
        return response.data;
    },
    deleteItem: async (itemId: number) => {
        await api.delete(`/admin/learnpress/items/${itemId}`);
    },

    // Quizzes
    getQuiz: async (quizId: number) => {
        const response = await api.get<LPQuiz>(`/admin/learnpress/quizzes/${quizId}`);
        return response.data;
    },
    addQuestion: async (quizId: number, data: LPQuestionCreate) => {
        const response = await api.post<LPQuestion>(`/admin/learnpress/quizzes/${quizId}/questions`, data);
        return response.data;
    },
    updateQuestion: async (questionId: number, data: LPQuestionUpdate) => {
        const response = await api.put<LPQuestion>(`/admin/learnpress/questions/${questionId}`, data);
        return response.data;
    },
    deleteQuestion: async (questionId: number) => {
        await api.delete(`/admin/learnpress/questions/${questionId}`);
    },

    // Admin Reporting
    getCourseLearners: async (courseId: number) => {
        const response = await api.get<LPLearner[]>(`/admin/lp/courses/${courseId}/learners`);
        return response.data;
    },
    getCourseStats: async (courseId: number) => {
        const response = await api.get<LPCourseStats>(`/admin/lp/courses/${courseId}/stats`);
        return response.data;
    },
    getQuizSubmissions: async (quizId: number) => {
        const response = await api.get<LPQuizSubmissionRead[]>(`/admin/lp/quizzes/${quizId}/submissions`);
        return response.data;
    },
    getSubmission: async (submissionId: number) => {
        const response = await api.get<LPQuizSubmissionRead>(`/admin/lp/submissions/${submissionId}`);
        return response.data;
    }
};

// Media Service
export interface WPMediaItem {
    id: number;
    title: { rendered: string } | string;
    url: string;
    mime_type: string;
    date_created?: string;
    date_modified?: string;
    date?: string; // Standard WP
    slug?: string;
    alt_text?: string;
    description?: string;
    caption?: string;
    author?: number;
    sizes?: Record<string, string>; // e.g. "full": "http://..."
    guid?: { rendered: string }; // Standard WP
    source_url?: string; // Standard WP
    media_details?: {
        width?: number;
        height?: number;
        file?: string;
        sizes?: Record<string, { source_url: string; width: number; height: number; mime_type: string }>;
    };
}

export const adminMediaService = {
    getAll: async (search: string = '') => {
        const response = await api.get<WPMediaItem[]>('/wordpress/media', {
            params: { search, media_type: 'image' }
        });
        return response.data;
    },
    get: async (id: number) => {
        const response = await api.get<WPMediaItem>(`/wordpress/media/${id}`);
        return response.data;
    },
    upload: async (formData: FormData) => {
        const response = await api.post<WPMediaItem>('/wordpress/media', formData, {
            headers: { 'Content-Type': undefined } // Allow browser to set multipart/form-data with boundary
        });
        return response.data;
    },
    update: async (id: number, data: any) => {
        const response = await api.put<WPMediaItem>(`/wordpress/media/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/wordpress/media/${id}`, { params: { force: true } });
    }
};

// Links Service
export interface WPLink {
    link_id: number;
    link_url: string;
    link_name: string;
    link_image?: string;
    link_target?: string;
    link_description?: string;
    link_visible: string;
    link_owner?: number;
    link_rel?: string;
}

export interface CreateLinkRequest {
    url: string;
    name: string;
    description?: string;
    target?: string;
    rel?: string;
    visible?: string; // 'Y' or 'N'
}

export const adminLinkService = {
    getAll: async (params: { visible_only?: boolean, limit?: number, offset?: number } = {}) => {
        const response = await api.get<WPLink[]>('/wordpress/links', { params });
        return response.data;
    },
    get: async (id: number) => {
        const response = await api.get<WPLink>(`/wordpress/links/${id}`);
        return response.data;
    },
    create: async (data: CreateLinkRequest) => {
        const response = await api.post<WPLink>('/wordpress/links', data);
        return response.data;
    },
    update: async (id: number, data: Partial<CreateLinkRequest>) => {
        const response = await api.put<WPLink>(`/wordpress/links/${id}`, data);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/wordpress/links/${id}`);
    }
};

export const adminUserService = {
    getAll: async (page = 1, per_page = 100) => {
        const response = await api.get<WPUser[]>('/wordpress/users', { params: { page, per_page } });
        return response.data;
    },
    get: async (id: number) => {
        const response = await api.get<WPUser>(`/wordpress/users/${id}`);
        return response.data;
    },
    create: async (userData: any) => {
        const response = await api.post('/wordpress/users', userData);
        return response.data;
    },
    update: async (id: number, userData: any) => {
        const response = await api.put(`/wordpress/users/${id}`, userData);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/wordpress/users/${id}`);
    },
    getRoles: async (id: number) => {
        const response = await api.get(`/wordpress/users/${id}/roles`);
        return response.data;
    },
    updateRoles: async (id: number, roles: string[]) => {
        const response = await api.put(`/wordpress/users/${id}/roles`, roles);
        return response.data;
    }
};

export const adminOrderService = {
    getAll: async (status?: string, limit = 100, skip = 0) => {
        const response = await api.get<WCOrder[]>('/wordpress/wc/orders/', { params: { status, limit, skip } });
        return response.data;
    },
    get: async (id: number) => {
        const response = await api.get<WCOrderFull>(`/wordpress/wc/orders/${id}`);
        return response.data;
    },
    create: async (data: WCOrderCreate) => {
        const response = await api.post<WCOrderFull>('/wordpress/wc/orders', data);
        return response.data;
    },
    update: async (id: number, data: WCOrderUpdate) => {
        const response = await api.put<WCOrderFull>(`/wordpress/wc/orders/${id}`, data);
        return response.data;
    },
    delete: async (id: number, force: boolean = false) => {
        await api.delete(`/wordpress/wc/orders/${id}`, { params: { force } });
    }
};

export const adminProductService = {
    getAll: async (status: string = 'any', limit = 100, offset = 0) => {
        const response = await api.get<WCProductRead[]>('/wordpress/wc/products', { params: { status, limit, offset } });
        return response.data;
    },

    get: async (id: number) => {
        const response = await api.get<WCProductRead>(`/wordpress/wc/products/${id}`);
        return response.data;
    },

    create: async (data: WCProductCreate) => {
        const response = await api.post<WCProductRead>('/wordpress/wc/products', data);
        return response.data;
    },

    update: async (id: number, data: WCProductUpdate) => {
        const response = await api.put<WCProductRead>(`/wordpress/wc/products/${id}`, data);
        return response.data;
    },

    delete: async (id: number, force: boolean = false) => {
        await api.delete(`/wordpress/wc/products/${id}`, { params: { force } });
    },

    // Gallery Support
    getProductImages: async (productId: number) => {
        const response = await api.get<{ featured_image: any, gallery_images: any[] }>(`/wordpress/wc/products/${productId}/images`);
        return response.data;
    },
    updateGallery: async (productId: number, galleryImageIds: number[]) => {
        const response = await api.put(`/wordpress/wc/products/${productId}/gallery`, {
            image_ids: galleryImageIds
        });
        return response.data;
    },
    addToGallery: async (productId: number, imageId: number) => {
        const response = await api.post(`/wordpress/wc/products/${productId}/gallery`, {
            attachment_id: imageId
        });
        return response.data;
    },
    removeFromGallery: async (productId: number, imageId: number) => {
        await api.delete(`/wordpress/wc/products/${productId}/gallery/${imageId}`);
    },

    // Featured Image Support
    updateFeaturedImage: async (productId: number, imageId: number) => {
        const response = await api.put(`/wordpress/wc/products/${productId}/featured-image`, {
            attachment_id: imageId
        });
        return response.data;
    },

    // Terms Support
    getProductFull: async (productId: number) => {
        const response = await api.get<WCProductFullRead>(`/wordpress/wc/products/${productId}/full`);
        return response.data;
    },
    assignTerms: async (productId: number, termIds: number[]) => {
        const response = await api.post(`/wordpress/wc/products/${productId}/terms`, termIds);
        return response.data;
    },
    removeTerms: async (productId: number, termIds: number[]) => {
        const response = await api.delete(`/wordpress/wc/products/${productId}/terms`, {
            data: termIds
        });
        return response.data;
    },

    // Variation CRUD
    getVariations: async (productId: number) => {
        const response = await api.get<WCProductVariationRead[]>(`/wordpress/wc/products/${productId}/variations`);
        return response.data;
    },
    createVariation: async (productId: number, data: WCProductVariationCreate) => {
        const response = await api.post<WCProductVariationRead>(`/wordpress/wc/products/${productId}/variations`, data);
        return response.data;
    },
    updateVariation: async (productId: number, variationId: number, data: WCProductVariationUpdate) => {
        const response = await api.put<WCProductVariationRead>(`/wordpress/wc/products/${productId}/variations/${variationId}`, data);
        return response.data;
    },
    deleteVariation: async (productId: number, variationId: number) => {
        await api.delete(`/wordpress/wc/products/${productId}/variations/${variationId}`);
    }
};

// Pages Service
export interface WPPage {
    ID: number;
    post_title: string;
    post_content: string;
    post_excerpt: string;
    post_status: string;
    post_type: string;
    post_name: string; // slug
    post_parent: number;
    menu_order: number;
    comment_status: string;
    ping_status: string;
    post_date: string;
    post_modified: string;
    featured_media?: number; // Optional
    featured_image?: {
        id: number;
        title: string;
        url: string;
        alt_text: string;
        caption: string;
        mime_type: string;
        date_created: string;
    } | null;
    featured_image_url?: string; // Optional helper
}

export interface WPPageCreate {
    post_title: string;
    post_content?: string;
    post_excerpt?: string;
    post_status?: string;
    post_type?: string;
    post_parent?: number;
    menu_order?: number;
    post_name?: string;
}

export interface WPPageUpdateArgs {
    post_title?: string;
    post_content?: string;
    post_excerpt?: string;
    post_status?: string;
    post_name?: string;
    post_parent?: number;
    menu_order?: number;
    comment_status?: string;
    ping_status?: string;
}

export const adminPagesService = {
    getAll: async (status = 'any', limit = 10, offset = 0) => {
        const response = await api.get<WPPage[]>('/wordpress/pages', {
            params: { status, limit, offset }
        });
        return response.data;
    },
    get: async (id: number) => {
        const response = await api.get<WPPage>(`/wordpress/pages/${id}`);
        return response.data;
    },
    create: async (data: WPPageCreate) => {
        const response = await api.post<WPPage>('/wordpress/pages', data);
        return response.data;
    },
    update: async (id: number, data: WPPageUpdateArgs) => {
        const response = await api.put<WPPage>(`/wordpress/pages/${id}`, data);
        return response.data;
    },
    delete: async (id: number, force = false) => {
        await api.delete(`/wordpress/pages/${id}`, { params: { force } });
    },
    updateFeaturedImage: async (pageId: number, mediaId: number) => {
        const response = await api.put<WPPage>(`/wordpress/pages/${pageId}/featured-image`, {
            attachment_id: mediaId
        });
        return response.data;
    }
};

// Term Service (Categories & Tags)
export const adminTermService = {
    getCategories: async () => {
        const response = await api.get<WPTerm[]>('/wordpress/categories');
        return response.data;
    },
    getTags: async () => {
        const response = await api.get<WPTerm[]>('/wordpress/tags');
        return response.data;
    },
    createCategory: async (data: { name: string; slug?: string; description?: string; parent?: number }) => {
        const response = await api.post<WPTerm>('/wordpress/categories', null, {
            params: data
        });
        return response.data;
    },
    createTag: async (data: { name: string; slug?: string; description?: string }) => {
        const response = await api.post<WPTerm>('/wordpress/tags', null, {
            params: data
        });
        return response.data;
    },
    updateCategory: async (id: number, data: { name?: string; slug?: string; description?: string; parent?: number }) => {
        const response = await api.put<WPTerm>(`/wordpress/categories/${id}`, null, {
            params: data
        });
        return response.data;
    },
    deleteCategory: async (id: number) => {
        const response = await api.delete(`/wordpress/categories/${id}`);
        return response.data;
    },
    updateTag: async (id: number, data: { name?: string; slug?: string; description?: string }) => {
        const response = await api.put<WPTerm>(`/wordpress/tags/${id}`, null, {
            params: data
        });
        return response.data;
    },
    deleteTag: async (id: number) => {
        const response = await api.delete(`/wordpress/tags/${id}`);
        return response.data;
    },
    // Management
    getPostWithTerms: async (postId: number) => {
        const response = await api.get<WPPostFull>(`/wordpress/posts/${postId}/full`);
        return response.data;
    },
    assignTerms: async (postId: number, termIds: number[]) => {
        const response = await api.post(`/wordpress/posts/${postId}/terms`, termIds);
        return response.data;
    },
    removeTerms: async (postId: number, termIds: number[]) => {
        const response = await api.delete(`/wordpress/posts/${postId}/terms`, {
            data: termIds
        });
        return response.data;
    }
};

// Comment Moderation Service
export const adminCommentService = {
    getAll: async (status: string = 'approve', limit: number = 50, offset: number = 0) => {
        const response = await api.get<WPCommentRead[]>('/admin/comments', {
            params: { status, limit, offset }
        });
        return response.data;
    },
    update: async (commentId: number, data: WPCommentUpdate) => {
        const response = await api.put<WPCommentRead>(`/admin/comments/${commentId}`, data);
        return response.data;
    },
    delete: async (commentId: number, force: boolean = false) => {
        const response = await api.delete(`/admin/comments/${commentId}`, {
            params: { force }
        });
        return response.data;
    }
};

// Form Management Service
export const adminFormService = {
    getAll: async (limit: number = 50, offset: number = 0) => {
        const response = await api.get<any[]>('/admin/forms', {
            params: { limit, offset }
        });
        return response.data;
    },
    create: async (data: { title: string; content?: string }) => {
        const response = await api.post<any>('/admin/forms', data);
        return response.data;
    },
    getById: async (formId: number) => {
        const response = await api.get<any>(`/admin/forms/${formId}`);
        return response.data;
    },
    update: async (formId: number, data: { title: string; content?: string }) => {
        const response = await api.put<any>(`/admin/forms/${formId}`, data);
        return response.data;
    },
    getEntries: async (formId: number) => {
        const response = await api.get<any[]>(`/admin/forms/${formId}/entries`);
        return response.data;
    },
    getEntry: async (entryId: number) => {
        const response = await api.get<any>(`/admin/forms/entries/${entryId}`);
        return response.data;
    }
};

// Post Management Service
export const adminPostService = {
    getAll: async (status: string = 'publish', limit: number = 10, offset: number = 0) => {
        const response = await api.get<WPPostRead[]>('/wordpress/posts', {
            params: { status, limit, offset },
        });
        return response.data;
    },
    get: async (postId: number) => {
        const response = await api.get<WPPostRead>(`/wordpress/posts/${postId}`);
        return response.data;
    },
    create: async (data: WPPostCreate) => {
        const response = await api.post<WPPostRead>('/wordpress/posts', data);
        return response.data;
    },
    update: async (postId: number, data: WPPostUpdate) => {
        const response = await api.put<WPPostRead>(`/wordpress/posts/${postId}`, data);
        return response.data;
    },
    delete: async (postId: number, force: boolean = false) => {
        await api.delete(`/wordpress/posts/${postId}`, {
            params: { force },
        });
    }
};

// Dynamic Pages Service
export const adminDynamicService = {
    // Signals
    getSignals: async (type?: 'vip' | 'free', limit = 20, offset = 0) => {
        const response = await api.get<SignalPagination>('/signals', { params: { type, limit, offset } });
        return response.data;
    },
    createSignal: async (data: DynamicSignalCreate) => {
        const response = await api.post<DynamicSignal>('/admin/signals', data);
        return response.data;
    },
    updateSignal: async (id: number, data: Partial<DynamicSignalCreate>) => {
        const response = await api.put<DynamicSignal>(`/admin/signals/${id}`, data);
        return response.data;
    },
    deleteSignal: async (id: number) => {
        await api.delete(`/admin/signals/${id}`);
    },

    // Trading Tools (Bots & Indicators)
    getTradingTools: async (type?: 'bot' | 'indicator', category?: 'vip' | 'free', limit: number = 20, offset: number = 0) => {
        const response = await api.get<TradingToolPagination>('/trading-tools', { params: { type, category, limit, offset } });
        return response.data;
    },
    createTradingTool: async (data: DynamicTradingToolCreate) => {
        const response = await api.post<DynamicTradingTool>('/admin/trading-tools', data);
        return response.data;
    },
    updateTradingTool: async (id: number, data: Partial<DynamicTradingToolCreate>) => {
        const response = await api.put<DynamicTradingTool>(`/admin/trading-tools/${id}`, data);
        return response.data;
    },
    deleteTradingTool: async (id: number) => {
        await api.delete(`/admin/trading-tools/${id}`);
    },

    // Forex Books
    getBooks: async (is_free?: boolean, limit = 100, offset = 0) => {
        const response = await api.get<BookPagination>('/books', { params: { is_free, limit, offset } });
        return response.data;
    },
    createBook: async (data: DynamicBookCreate) => {
        const response = await api.post<DynamicBook>('/admin/books', data);
        return response.data;
    },
    updateBook: async (id: number, data: Partial<DynamicBookCreate>) => {
        const response = await api.put<DynamicBook>(`/admin/books/${id}`, data);
        return response.data;
    },
    deleteBook: async (id: number) => {
        await api.delete(`/admin/books/${id}`);
    },

    // Trading Videos
    getVideos: async (limit = 10) => {
        const response = await api.get<DynamicVideo[]>('/videos/trading', { params: { limit } });
        return response.data;
    },
    createVideo: async (data: DynamicVideoCreate) => {
        const response = await api.post<DynamicVideo>('/admin/videos', data);
        return response.data;
    },
    updateVideo: async (id: string, data: Partial<DynamicVideoCreate>) => {
        const response = await api.put<DynamicVideo>(`/admin/videos/${id}`, data);
        return response.data;
    },
    deleteVideo: async (id: string) => {
        await api.delete(`/admin/videos/${id}`);
    }
};

// Coupon Management Service
export const adminCouponService = {
    getAll: async (params: { page?: number, per_page?: number, search?: string } = {}) => {
        const response = await api.get<WCCoupon[]>('/wordpress/wc/coupons', { params });
        return response.data;
    },
    get: async (id: number) => {
        const response = await api.get<WCCoupon>(`/wordpress/wc/coupons/${id}`);
        return response.data;
    },
    create: async (data: WCCouponUpdate) => {
        const response = await api.post<WCCoupon>('/wordpress/wc/coupons', data);
        return response.data;
    },
    update: async (id: number, data: WCCouponUpdate) => {
        const response = await api.put<WCCoupon>(`/wordpress/wc/coupons/${id}`, data);
        return response.data;
    },
    delete: async (id: number, force: boolean = true) => {
        await api.delete(`/wordpress/wc/coupons/${id}`, { params: { force } });
    }
};

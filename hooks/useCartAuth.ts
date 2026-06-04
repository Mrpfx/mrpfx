import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/auth';

export type PendingCartAction = {
    type: 'ADD_TO_CART';
    productId: number;
    quantity: number;
    variationId?: number;
    customFields?: Record<string, string>;
    timestamp: number;
};

const PENDING_ACTION_KEY = 'mrp_pending_cart_action';
const ACTION_EXPIRY_MS = 1000 * 60 * 10; // 10 minutes

export const useCartAuth = () => {
    const router = useRouter();
    const pathname = usePathname();

    const isAuthenticated = () => {
        return !!authService.getUserFromToken();
    };

    const savePendingAction = (action: Omit<PendingCartAction, 'timestamp'>) => {
        const pendingAction: PendingCartAction = {
            ...action,
            timestamp: Date.now(),
        };
        sessionStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(pendingAction));
    };

    const getPendingAction = (): PendingCartAction | null => {
        const data = sessionStorage.getItem(PENDING_ACTION_KEY);
        if (!data) return null;

        try {
            const action: PendingCartAction = JSON.parse(data);
            if (Date.now() - action.timestamp > ACTION_EXPIRY_MS) {
                sessionStorage.removeItem(PENDING_ACTION_KEY);
                return null;
            }
            return action;
        } catch (e) {
            console.error('Failed to parse pending cart action', e);
            return null;
        }
    };

    const clearPendingAction = () => {
        sessionStorage.removeItem(PENDING_ACTION_KEY);
    };

    const redirectToLogin = () => {
        const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
    };

    return {
        isAuthenticated,
        savePendingAction,
        getPendingAction,
        clearPendingAction,
        redirectToLogin,
    };
};

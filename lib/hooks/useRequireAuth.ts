import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/auth';

export const useRequireAuth = (onResumeAction?: (key: string, data: any) => void) => {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const pendingJson = sessionStorage.getItem('pending_action');
        if (pendingJson) {
            try {
                const pending = JSON.parse(pendingJson);
                // Only resume if we are on the correct path and it's fresh (e.g. within 10 minutes)
                if (pending.path === pathname && Date.now() - pending.timestamp < 600000) {
                    sessionStorage.removeItem('pending_action');
                    if (onResumeAction) {
                        onResumeAction(pending.key, pending.data);
                    }
                }
            } catch (e) {
                console.error('Failed to parse pending action:', e);
                sessionStorage.removeItem('pending_action');
            }
        }
    }, [pathname, onResumeAction]);

    const withAuth = (action: () => void, actionMetadata?: { key: string; data?: any }) => {
        const user = authService.getUserFromToken();
        if (!user) {
            if (actionMetadata) {
                sessionStorage.setItem('pending_action', JSON.stringify({
                    ...actionMetadata,
                    path: pathname,
                    timestamp: Date.now()
                }));
            }
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }
        action();
    };

    return { withAuth };
};

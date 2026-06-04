import { Suspense } from 'react';
import LoginPage from '@/components/auth/LoginPage';

export default function LoginRoute() {
    return (
        <main>
            <Suspense fallback={<div />}>
                <LoginPage />
            </Suspense>
        </main>
    );
}

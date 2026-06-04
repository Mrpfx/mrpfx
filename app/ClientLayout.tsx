'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GlobalCheckoutModal from "@/components/checkout/GlobalCheckoutModal";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <div className="flex-grow flex flex-col bg-white text-black">
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </div>
            <GlobalCheckoutModal />
        </>
    );
}

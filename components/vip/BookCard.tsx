'use client';

import { useRouter } from 'next/navigation';
import { Star, Download, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { cartService } from '@/lib/cart';
import { getMediaUrl, truncateWords } from '@/lib/utils';
import { authService } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';

interface BookCardProps {
    id: number;
    title: string;
    subtitle?: string;
    description: string;
    price?: string;
    isFree?: boolean;
    rating?: number;
    buyUrl?: string;
    downloadUrl?: string;
    imageSrc?: string;
}

const BookCard = ({
    id,
    title,
    subtitle = "The Complete Guide",
    description,
    price = "$39",
    isFree = false,
    rating = 5,
    buyUrl = "#",
    downloadUrl = "#",
    imageSrc
}: BookCardProps) => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const { withAuth } = useRequireAuth();

    useEffect(() => {
        setIsLoggedIn(!!authService.getUserFromToken());
        const handleAuthChange = () => setIsLoggedIn(!!authService.getUserFromToken());
        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    const handleAction = (e: React.MouseEvent) => {
        e.stopPropagation();

        setIsDownloading(true);
        setTimeout(() => {
            router.push(`/book/${id}`);
        }, 300);
    };
    return (
        <div
            onClick={handleAction}
            className="bg-white rounded-2xl md:rounded-[24px] overflow-hidden border border-slate-100 flex flex-col h-full shadow-[0_10px_30px_rgba(0,0,0,0.04)] group hover:border-blue-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 max-w-[400px] mx-auto w-full cursor-pointer"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                {imageSrc ? (
                    <Image
                        src={getMediaUrl(imageSrc) || ""}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white flex items-center justify-center p-6 md:p-8">
                        <div className="text-center">
                            <h3 className="text-slate-900 text-xl md:text-2xl font-black uppercase tracking-tighter leading-none mb-2">{title}</h3>
                            <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">{subtitle}</p>
                        </div>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-30">
                    <span className={`text-white text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded shadow-lg uppercase tracking-wider ${isFree ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                        {isFree ? 'FREE' : 'PAID'}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 md:p-8 flex flex-col flex-grow bg-white">
                <h4 className="text-[#0f172a] font-black text-sm md:text-lg mb-2 md:mb-3 tracking-tight group-hover:text-blue-600 transition-colors uppercase truncate">
                    {title}
                </h4>
                <p className="text-slate-500 text-[11px] md:text-sm font-medium mb-4 md:mb-8 leading-relaxed line-clamp-2 md:line-clamp-3">
                    {truncateWords(description, 25)}
                </p>

                <div className="mt-auto flex flex-col items-center gap-2 md:gap-3">
                    {isFree ? (
                        <button
                            onClick={handleAction}
                            disabled={isDownloading}
                            className={`w-full bg-[#1e293b] hover:bg-slate-800 text-white font-black py-2 md:py-3.5 px-4 rounded-xl active:scale-95 transition-all duration-300 shadow-lg shadow-slate-200 block text-center uppercase tracking-tighter text-xs md:text-lg ${isDownloading ? 'opacity-80 cursor-not-allowed' : ''}`}
                        >
                            {isDownloading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                'Free Download'
                            )}
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleAction}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2 md:py-3.5 px-4 rounded-xl active:scale-95 transition-all duration-300 shadow-lg shadow-blue-100 block text-center uppercase tracking-tighter text-sm md:text-xl"
                            >
                                BUY NOW
                            </button>
                            <span className="text-slate-400 font-bold text-[10px] md:text-sm tracking-widest">
                                {price}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookCard;

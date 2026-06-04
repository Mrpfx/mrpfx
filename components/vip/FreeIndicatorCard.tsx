'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, Download } from 'lucide-react';
import { cartService } from '@/lib/cart';
import { getMediaUrl, truncateWords } from '@/lib/utils';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { authService } from '@/lib/auth';
import { useState, useEffect } from 'react';

interface FreeIndicatorCardProps {
    id: number;
    name: string;
    description?: string;
    features: string[];
    imageSrc: string;
    downloadUrl?: string;
    platforms?: string; // e.g. "MT4 / MT5"
}

const FreeIndicatorCard = ({ id, name, description = "", features = [], imageSrc, downloadUrl = "#", platforms = "MT4 / MT5" }: FreeIndicatorCardProps) => {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!authService.getUserFromToken());
        const handleAuthChange = () => setIsLoggedIn(!!authService.getUserFromToken());
        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    const { withAuth } = useRequireAuth();

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();

        setIsDownloading(true);
        setTimeout(() => {
            router.push(`/trading-tool/${id}`);
        }, 300);
    };
    return (
        <div
            onClick={handleDownload}
            className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100 flex flex-col h-full group hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 cursor-pointer"
        >
            {/* Image Section */}
            <div className="relative aspect-square sm:aspect-[16/10] overflow-hidden bg-gradient-to-b from-[#f0fdf4] to-white">
                <Image
                    src={getMediaUrl(imageSrc) || "/assets/indicators/chart-tablet.png"}
                    alt={name}
                    fill
                    className="object-contain p-4 md:p-6 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#1e293b]/90 backdrop-blur-sm px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-white/10 shadow-sm hidden sm:block max-w-[85%]">
                    <h3 className="text-white text-[10px] md:text-sm font-bold tracking-tight truncate mb-0.5 leading-tight">
                        {truncateWords(name, 3)}
                    </h3>
                    <div className="inline-block bg-blue-500/20 text-blue-300 text-[7px] md:text-[9px] font-bold px-1.5 md:px-2 py-0.5 rounded border border-blue-400/30">
                        {platforms}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-3 md:p-6 flex flex-col flex-grow">
                <h4 className="text-xs md:text-lg font-black text-[#1e293b] mb-1 md:mb-2 uppercase truncate">{name}</h4>
                <p className="text-gray-500 text-[10px] md:text-xs mb-3 md:mb-4 leading-relaxed line-clamp-2">
                    {truncateWords(description, 20)}
                </p>
                {/* Features List */}
                <ul className="space-y-1.5 md:space-y-3 mb-4 md:mb-6 flex-grow">
                    {(features || []).slice(0, 2).map((feature, index) => (
                        <li key={index} className="flex items-start gap-1.5 md:gap-2 text-[10px] md:text-sm text-gray-700 font-medium italic truncate">
                            <div className="bg-green-100 p-0.5 rounded-full shrink-0">
                                <Check className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-green-600 stroke-[3]" />
                            </div>
                            <span className="leading-tight">{feature}</span>
                        </li>
                    ))}
                </ul>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto pt-2">
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Price</span>
                        <span className="text-xl md:text-2xl font-black text-emerald-600 leading-none">FREE</span>
                    </div>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`w-full sm:w-auto flex items-center justify-center gap-1.5 md:gap-2 font-bold py-3 md:py-4 px-4 md:px-8 rounded-xl shadow-lg transition-all duration-300 active:scale-95 text-xs md:text-base uppercase tracking-tight ${isLoggedIn
                            ? "bg-gradient-to-r from-[#106b52] to-[#147b62] hover:from-[#147b62] hover:to-[#188c72] text-white"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                            } ${isDownloading ? 'opacity-80 cursor-not-allowed' : ''}`}
                    >
                        {isDownloading ? (
                            <>
                                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
                                {isLoggedIn ? 'Download' : 'Login to Download'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FreeIndicatorCard;

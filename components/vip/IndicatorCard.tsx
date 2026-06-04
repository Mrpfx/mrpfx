'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { cartService } from '@/lib/cart';
import { getMediaUrl, truncateWords } from '@/lib/utils';

interface IndicatorCardProps {
    id: number;
    name: string;
    price: string;
    description: string;
    features: string[];
    imageSrc: string;
    productUrl?: string;
    platforms?: string; // e.g. "MT4 / MT5"
}

const IndicatorCard = ({ id, name, price, description, features = [], imageSrc, productUrl = "#", platforms = "MT4 / MT5" }: IndicatorCardProps) => {
    const router = useRouter();

    const handleAddToCart = () => {
        router.push(`/trading-tool/${id}`);
    };
    return (
        <div
            onClick={handleAddToCart}
            className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100 flex flex-col h-full group hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 cursor-pointer"
        >
            {/* Image Section */}
            <div className="relative aspect-square sm:aspect-[16/10] overflow-hidden bg-gradient-to-b from-[#f0f9ff] to-white">
                <Image
                    src={getMediaUrl(imageSrc) || "/assets/indicators/chart-tablet.png"}
                    alt={name}
                    fill
                    className="object-contain p-4 md:p-6 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#1e293b]/90 backdrop-blur-sm px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-white/10 hidden sm:block max-w-[85%] shadow-sm">
                    <h3 className="text-white text-[10px] md:text-sm font-bold tracking-tight truncate mb-0.5 leading-tight">
                        {truncateWords(name, 3)}
                    </h3>
                    <div className="inline-block bg-blue-500/20 text-blue-300 text-[7px] md:text-[9px] font-bold px-1.5 md:px-2 py-0.5 rounded border border-blue-400/30 line-height-none">
                        {platforms}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-3 md:p-6 flex flex-col flex-grow">
                <h4 className="text-xs md:text-lg font-black text-[#1e293b] mb-1 md:mb-2 uppercase truncate">{name}</h4>
                <p className="text-gray-500 text-[10px] md:text-sm mb-4 md:mb-6 leading-relaxed line-clamp-2 md:line-clamp-3">
                    {truncateWords(description, 25)}
                </p>
                {/* Features List */}
                <ul className="space-y-1.5 md:space-y-3 mb-4 md:mb-6">
                    {(features || []).slice(0, 2).map((feature, index) => (
                        <li key={index} className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm text-gray-700 font-medium italic truncate">
                            <div className="bg-green-100 p-0.5 rounded-full shrink-0">
                                <Check className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-green-600 stroke-[3]" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>

                <div className="mt-auto pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:mb-2">
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Price</span>
                            <span className="text-xl md:text-3xl font-black text-[#1e293b] leading-none">
                                ${price}
                            </span>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="w-full sm:w-auto bg-gradient-to-r from-[#FFD700] to-[#FFC000] hover:from-[#FFC000] hover:to-[#FFB000] text-[#1e293b] font-bold py-3 md:py-3.5 px-5 md:px-8 rounded-lg md:rounded-xl shadow-md transition-all duration-300 active:scale-95 text-xs md:text-base uppercase"
                        >
                            Get Access
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndicatorCard;

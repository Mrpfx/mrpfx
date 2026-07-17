'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tradingToolsService } from '@/lib/trading-tools';
import { Loader2, Package, Check, Download, ShoppingCart, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { getMediaUrl } from '@/lib/utils';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { authService } from '@/lib/auth';
import { cartService } from '@/lib/cart';

export default function TradingToolPage() {
    const params = useParams();
    const id = parseInt(params.id as string, 10);
    const router = useRouter();

    const [tool, setTool] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    const { withAuth } = useRequireAuth();

    useEffect(() => {
        setIsLoggedIn(!!authService.getUserFromToken());
        const handleAuthChange = () => setIsLoggedIn(!!authService.getUserFromToken());
        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    const fetchData = useCallback(async () => {
        if (!id || isNaN(id)) {
            setError(true);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(false);
        try {
            const found = await tradingToolsService.getTool(id);
            if (found) {
                setTool(found);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Trading Tool Page Error:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAction = async () => {
        const isFree = tool.category === 'free';

        if (isFree) {
            withAuth(async () => {
                try {
                    setAddingToCart(true);

                    // 1. Trigger download if available
                    if (tool.download_url && tool.download_url !== "#") {
                        window.open(tool.download_url, '_blank');
                    }

                    // 2. Add to cart and open checkout to create an order
                    await cartService.addToCart(tool.id, 1);
                    window.dispatchEvent(new CustomEvent('open-checkout', {
                        detail: { sellerLink: tool.seller_payment_link }
                    }));
                } catch (error) {
                    console.error("Failed to process free tool:", error);
                } finally {
                    setAddingToCart(false);
                }
            }, { key: 'download-tool' });
        } else {
            withAuth(async () => {
                setAddingToCart(true);
                try {
                    await cartService.addToCart(tool.id, 1);
                    window.dispatchEvent(new CustomEvent('open-checkout', {
                        detail: { sellerLink: tool.seller_payment_link }
                    }));
                } catch (error) {
                    console.error("Failed to add to cart:", error);
                    if (tool.purchase_url && tool.purchase_url !== "#") {
                        window.location.href = tool.purchase_url;
                    }
                } finally {
                    setAddingToCart(false);
                }
            }, { key: 'purchase-tool' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
        );
    }

    if (error || !tool) {
        return (
            <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center text-center px-4">
                <div>
                    <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-white">Resource not found</h2>
                    <p className="text-gray-400 text-sm mt-2">The resource you are looking for might have been moved or deleted.</p>
                    <button onClick={() => router.back()} className="text-blue-400 hover:text-blue-300 text-sm mt-5 inline-block font-medium">
                        ← Go Back
                    </button>
                </div>
            </div>
        );
    }

    const features = tool.description ? tool.description.split('\n').filter((l: string) => l.trim().length > 0) : [];
    const isFree = tool.category === 'free';

    return (
        <div className="min-h-screen bg-[#0a0e17] sm:pt-32 pt-4 pb-12 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-purple-600/[0.04] blur-[120px] pointer-events-none" />
            <div className="absolute top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/[0.03] blur-[100px] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-6 z-10">
                <button onClick={() => router.back()} className="hidden sm:flex text-gray-400 hover:text-white font-medium mb-8 items-center gap-2 transition-colors">
                    ← Back to resources
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                    {/* Left: Image Panel */}
                    <div className="lg:col-span-5 w-full bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-8 flex items-center justify-center relative group overflow-hidden shadow-2xl min-h-[250px] sm:min-h-[400px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="relative w-full aspect-square max-w-sm transform group-hover:scale-105 transition-transform duration-500">
                            <Image
                                src={getMediaUrl(tool.image_url) || "/assets/indicators/chart-tablet.png"}
                                alt={tool.title}
                                fill
                                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right: Content Panel */}
                    <div className="lg:col-span-7 flex flex-col">
                        <div className="mb-4 sm:mb-6">
                            <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-5">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase border ${isFree ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                    {tool.type}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-white/5 text-gray-300 border border-white/10">
                                    {tool.category}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4 sm:mb-6 leading-tight">
                                {tool.title}
                            </h1>
                            {!isFree && (
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 sm:mb-8 flex items-center gap-4">
                                    ${tool.price || '0.00'}
                                    <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider bg-white/5 px-2 sm:px-3 py-1 rounded-lg">Lifetime Access</span>
                                </div>
                            )}
                        </div>

                        {features.length > 0 && (
                            <div className="flex-grow bg-[#111827]/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                                <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                                    </span>
                                    Resource Details
                                </h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {features.map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                                            <div className="bg-emerald-500/20 p-1 rounded-full shrink-0 mt-0.5 border border-emerald-500/30">
                                                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                                            </div>
                                            <span className="leading-relaxed text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {!isFree && (tool.whop_payment_link || tool.seller_payment_link) && (
                            <div className="space-y-3 mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-white/[0.06]"></div>
                                    </div>
                                    <div className="relative flex justify-center text-[10px] uppercase">
                                        <span className="bg-[#0a0e17] px-2 text-gray-500 font-bold tracking-widest">Alternative Checkout</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {false && tool.whop_payment_link && (
                                        <button
                                            onClick={() => withAuth(() => window.open(tool.whop_payment_link, '_blank'), { key: 'whop-checkout' })}
                                            className="flex items-center justify-center gap-2 py-3 bg-[#FC440F]/10 hover:bg-[#FC440F]/20 border border-[#FC440F]/20 text-[#FC440F] rounded-xl text-xs font-bold transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Buy on Whop
                                        </button>
                                    )}
                                    {tool.seller_payment_link && (
                                        <button
                                            onClick={() => withAuth(() => window.open(tool.seller_payment_link, '_blank'), { key: 'selar-checkout' })}
                                            className="flex items-center justify-center gap-2 py-3 bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/20 text-cyan-400 rounded-xl text-xs font-bold transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Buy on Selar
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-auto">
                            <button
                                onClick={handleAction}
                                disabled={addingToCart}
                                className={`group w-full flex items-center justify-center gap-3 font-bold py-5 px-8 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 text-lg uppercase tracking-wider relative overflow-hidden ${isFree
                                    ? (isLoggedIn
                                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-emerald-500/25"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25")
                                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-500/25"
                                    }`}
                            >
                                {/* Shine effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />

                                {addingToCart ? (
                                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                                ) : isFree ? (
                                    <>
                                        <Download className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                                        {isLoggedIn ? 'Download Now' : 'Login to Download'}
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                                        Get Instant Access
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-4 font-medium">
                                {isFree ? 'Instantly available after download.' : 'Secure, one-time payment. Instant delivery.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

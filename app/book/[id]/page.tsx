'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tradingToolsService } from '@/lib/trading-tools';
import { Loader2, BookOpen, Check, Download, ShoppingCart, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { getMediaUrl } from '@/lib/utils';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { authService } from '@/lib/auth';
import { cartService } from '@/lib/cart';

export default function BookPage() {
    const params = useParams();
    const id = parseInt(params.id as string, 10);
    const router = useRouter();

    const [book, setBook] = useState<any>(null);
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
            const found = await tradingToolsService.getBook(id);
            if (found) {
                setBook(found);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Book Page Error:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAction = async () => {
        const isFree = book.is_free;

        if (isFree) {
            withAuth(async () => {
                try {
                    setAddingToCart(true);

                    // 1. Trigger download if available
                    if (book.download_url && book.download_url !== "#") {
                        window.open(book.download_url, '_blank');
                    }

                    // 2. Add to cart and open checkout to create an order
                    await cartService.addToCart(book.id, 1);
                    window.dispatchEvent(new CustomEvent('open-checkout', {
                        detail: { sellerLink: book.seller_payment_link || book.buy_url }
                    }));
                } catch (error) {
                    console.error("Failed to process free book:", error);
                } finally {
                    setAddingToCart(false);
                }
            }, { key: 'download-book' });
        } else {
            // Premium
            try {
                setAddingToCart(true);
                await cartService.addToCart(book.id, 1);
                window.dispatchEvent(new CustomEvent('open-checkout', {
                    detail: { sellerLink: book.seller_payment_link || book.buy_url }
                }));
            } catch (error) {
                console.error("Failed to add to cart:", error);
                if (book.buy_url && book.buy_url !== "#") {
                    window.location.href = book.buy_url;
                }
            } finally {
                setAddingToCart(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center text-center px-4">
                <div>
                    <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-white">Book not found</h2>
                    <p className="text-gray-400 text-sm mt-2">The book you are looking for might have been moved or deleted.</p>
                    <button onClick={() => router.back()} className="text-blue-400 hover:text-blue-300 text-sm mt-5 inline-block font-medium">
                        ← Go Back
                    </button>
                </div>
            </div>
        );
    }

    const features = book.description ? book.description.split('\n').filter((l: string) => l.trim().length > 0) : [];
    const isFree = book.is_free;

    return (
        <div className="min-h-screen bg-[#0a0e17] sm:pt-32 pt-4 pb-12 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/[0.04] blur-[120px] pointer-events-none" />
            <div className="absolute top-60 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/[0.03] blur-[100px] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-6 z-10">
                <button onClick={() => router.back()} className="hidden sm:flex text-gray-400 hover:text-white font-medium mb-8 items-center gap-2 transition-colors">
                    ← Back to books
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                    {/* Left: Image Panel */}
                    <div className="lg:col-span-5 w-full bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-8 flex items-center justify-center relative group overflow-hidden shadow-2xl min-h-[250px] sm:min-h-[450px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="relative w-full aspect-[3/4] max-w-sm rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform duration-500 border border-white/5">
                            {book.image_url ? (
                                <Image
                                    src={getMediaUrl(book.image_url) || ""}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-8">
                                    <div className="text-center">
                                        <h3 className="text-white text-2xl font-black uppercase tracking-tighter leading-none mb-2">{book.title}</h3>
                                        <p className="text-purple-400 text-xs font-bold uppercase tracking-widest">{book.subtitle || "Forex Book"}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Content Panel */}
                    <div className="lg:col-span-7 flex flex-col h-full">
                        <div className="mb-4 sm:mb-6">
                            <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-5">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase border ${isFree ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                                    {isFree ? 'FREE BOOK' : 'PREMIUM BOOK'}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 sm:mb-4 leading-tight">
                                {book.title}
                            </h1>
                            {book.subtitle && (
                                <p className="text-lg sm:text-2xl font-medium text-purple-400 mb-4 sm:mb-6">{book.subtitle}</p>
                            )}
                            {!isFree && (
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 sm:mb-8 flex items-center gap-4">
                                    ${book.price || '0.00'}
                                    <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider bg-white/5 px-2 sm:px-3 py-1 rounded-lg">Lifetime Access</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-grow bg-[#111827]/50 backdrop-blur-md border border-white/5 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                            <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                                </span>
                                Book Description
                            </h3>
                            <div className="space-y-4 text-gray-300 leading-relaxed font-medium text-sm">
                                {features.map((paragraph: string, idx: number) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        {/* Alternative Checkout Methods - Moving to Checkout Modal for a cleaner experience */}
                        {false && !isFree && (book.whop_payment_link || book.seller_payment_link) && (
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
                                    {book.whop_payment_link && (
                                        <button
                                            onClick={() => window.open(book.whop_payment_link, '_blank')}
                                            className="flex items-center justify-center gap-2 py-3 bg-[#FC440F]/10 hover:bg-[#FC440F]/20 border border-[#FC440F]/20 text-[#FC440F] rounded-xl text-xs font-bold transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Buy on Whop
                                        </button>
                                    )}
                                    {book.seller_payment_link && (
                                        <button
                                            onClick={() => window.open(book.seller_payment_link, '_blank')}
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
                                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-blue-500/25")
                                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/25"
                                    }`}
                            >
                                {/* Shine effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />

                                {addingToCart ? (
                                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                                ) : isFree ? (
                                    <>
                                        <Download className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                                        {isLoggedIn ? 'Free Download' : 'Login to Download'}
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                                        Buy Now
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-4 font-medium">
                                {isFree ? 'Instantly available after download.' : 'Secure, one-time payment. Instant access.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

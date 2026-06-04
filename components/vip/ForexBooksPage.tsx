'use client';

import { Star, Download, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import BookCard from './BookCard';
import NewsletterSection from '@/components/shared/NewsletterSection';
import { tradingToolsService } from '@/lib/trading-tools';
import { useDataWithFallback } from '@/lib/hooks/useDataWithFallback';
import { TradingTool } from '@/lib/types';
import { getMediaUrl } from '@/lib/utils';

// Removed FALLBACK_PAID_BOOKS and FALLBACK_FREE_BOOKS
const ForexBooksPage = () => {
    const { data: paidBooksSource, isLoading: isLoadingPaid } = useDataWithFallback(
        tradingToolsService.getTools,
        { items: [], total: 0, page: 1, pageSize: 3 },
        'book',
        'vip',
        3
    );

    const { data: freeBooksSource, isLoading: isLoadingFree } = useDataWithFallback(
        tradingToolsService.getTools,
        { items: [], total: 0, page: 1, pageSize: 3 },
        'book',
        'free',
        3
    );

    // Map data to BookCard props with sensible defaults
    const mapToBookProps = (item: any, index: number) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: (item.price !== undefined && item.price !== null) ?
            (typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : `$${item.price.toString().replace('$', '')}`) :
            (item.is_free ? "FREE" : "$39"),
        isFree: item.is_free ?? true,
        imageSrc: (item.image_url?.startsWith('/assets/') ? item.image_url : getMediaUrl(item.image_url)) || item.thumbnail || `/assets/forex-books/book-cover-${(index % 6) + 1}.png`,
        buyUrl: item.purchase_url,
        downloadUrl: item.download_url
    });

    const allBooks = [
        ...(paidBooksSource?.items || []).map((book: any, i: number) => mapToBookProps(book, i)),
        ...(freeBooksSource?.items || []).map((book: any, i: number) => mapToBookProps(book, i + 3))
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-blue-500/30">
            <div className="relative z-10">
                {/* New Hero Section */}
                <section className="relative pt-24 md:pt-32 pb-16 bg-white">
                    <div className="max-w-[1280px] mx-auto px-6 text-center relative z-10">
                        <h1 className="text-4xl md:text-7xl font-black text-[#0f172a] tracking-tight mb-4 leading-[1.1]">
                            Master Forex Trading — <br className="hidden md:block" />
                            Even If You're Starting From Zero
                        </h1>
                        <p className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 font-medium">
                            Learn the exact strategies, risk management, and psychology I use to trade profitably.
                        </p>

                        <div className="w-full max-w-[850px] mx-auto relative z-10 mb-12">
                            <img
                                src="/assets/forex-books/hero-forex-books-transparent.png"
                                alt="Forex Trading Books Hero"
                                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                            />
                        </div>

                        {/* Feature Bar */}
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 bg-slate-50 border border-slate-200 p-2 md:p-3 rounded-2xl w-fit mx-auto shadow-sm">
                            <div className="px-6 py-2 rounded-xl bg-[#1e293b] text-white font-bold text-sm md:text-base whitespace-nowrap">
                                Beginner — Advanced
                            </div>
                            <div className="h-6 w-px bg-slate-300 hidden md:block" />
                            <div className="px-4 py-2 text-slate-700 font-bold text-sm md:text-base whitespace-nowrap flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Proven Strategies Inside
                            </div>
                            <div className="h-6 w-px bg-slate-300 hidden md:block" />
                            <div className="px-4 py-2 text-[#1e293b] font-black text-sm md:text-base whitespace-nowrap bg-blue-50/50 border border-blue-100/50 rounded-xl">
                                Step-by-Step System
                            </div>
                        </div>
                    </div>
                </section>

                {/* All Books Grid - Unified Section */}
                <section className="py-20 md:py-24 relative bg-white border-t border-slate-100">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-10">
                            {(isLoadingPaid || isLoadingFree) ? (
                                [1, 2, 3].map((_, i) => (
                                    <div key={i} className="bg-slate-200 animate-pulse rounded-2xl h-[400px]"></div>
                                ))
                            ) : allBooks.length === 0 ? (
                                <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                    <p className="text-slate-500 font-medium text-lg">Files will be uploaded soon.</p>
                                </div>
                            ) : (
                                allBooks.map((book, i) => (
                                    <BookCard key={i} {...book} />
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* Newsletter Wrapper (Clean light end section) */}
                <div className="pb-40 pt-20 bg-slate-50 border-t border-slate-200">
                    <NewsletterSection />
                </div>
            </div>
        </div>
    );
};

export default ForexBooksPage;

'use client';

import Image from 'next/image';
import { Check, ShieldCheck, TrendingUp, BarChart3, Target, Download } from 'lucide-react';
import FreeIndicatorCard from './FreeIndicatorCard';
import NewsletterSection from '@/components/shared/NewsletterSection';
import { tradingToolsService } from '@/lib/trading-tools';
import { useDataWithFallback } from '@/lib/hooks/useDataWithFallback';
import { TradingTool } from '@/lib/types';
import { getMediaUrl } from '@/lib/utils';

// Removed FALLBACK_INDICATORS
const FreeTradingIndicatorsPage = () => {
    const { data, isLoading } = useDataWithFallback(
        tradingToolsService.getTools,
        { items: [], total: 0, page: 1, pageSize: 20 },
        'indicator',
        'free',
        50
    );

    const indicators = data?.items || [];

    // Group indicators by category
    const groupedCategories = indicators.reduce((acc: any[], indicator: any) => {
        const catTitle = indicator.category || "General Indicators";
        let category = acc.find(c => c.title === catTitle);
        if (!category) {
            category = { title: catTitle, indicators: [] };
            acc.push(category);
        }
        category.indicators.push({
            id: indicator.id,
            name: indicator.title,
            features: indicator.description.split('\n').filter((l: string) => l.trim().length > 0).slice(0, 3),
            imageSrc: getMediaUrl(indicator.image_url) || "/assets/indicators/chart-tablet.png",
            downloadUrl: indicator.download_url
        });
        return acc;
    }, []);

    const categories = groupedCategories;

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative bg-[#3b82f6] pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
                {/* Background Pattern/Glow */}
                <div className="absolute inset-0 bg-[url('/assets/grid-light.svg')] bg-center opacity-20" />
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/20 blur-[150px] rounded-full" />
                <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-900/20 blur-[130px] rounded-full" />

                <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                        {/* Hero Content */}
                        <div className="flex-[1.2] text-center lg:text-left">
                            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 uppercase tracking-tight leading-none drop-shadow-md">
                                Free Trading Indicators
                            </h1>
                            <h2 className="text-xl md:text-3xl font-bold text-white/90 mb-8 max-w-2xl">
                                Premium Indicator Tools<br className="hidden md:block" />
                                <span className="text-white/70 font-medium">for Forex, Gold & Indices</span>
                            </h2>

                            <ul className="flex flex-col gap-5 mb-12 items-center lg:items-start text-white/90 font-bold">
                                {[
                                    "Works on MT4 / MT5",
                                    "Analyze Forex, Gold & Indices",
                                    "Simple Buy/Sell Signals"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 group">
                                        <div className="bg-green-500 rounded-full p-1 shadow-[0_0_20px_rgba(34,197,94,0.5)] group-hover:scale-110 transition-transform duration-300 border border-white/20">
                                            <Check className="w-4 h-4 text-white stroke-[4]" />
                                        </div>
                                        <span className="text-lg md:text-xl tracking-tight">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Hero Image */}
                        <div className="flex-[0.8] w-full max-w-[550px] relative">
                            <div className="relative z-10 drop-shadow-[0_25px_60px_rgba(0,0,0,0.4)] border-4 border-white/20 rounded-3xl overflow-hidden">
                                <Image
                                    src="/assets/free-indicators/hero-free.png"
                                    alt="Free Trading Indicators"
                                    width={600}
                                    height={500}
                                    className="w-full h-auto object-contain"
                                    priority
                                />
                            </div>
                            {/* Decorative glow */}
                            <div className="absolute -inset-10 bg-blue-400/30 blur-3xl rounded-full -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="py-24 bg-slate-50 relative">
                <div className="max-w-[1280px] mx-auto px-6">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="bg-slate-200 animate-pulse rounded-2xl h-[400px]"></div>
                            ))}
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                            <p className="text-slate-500 font-medium text-lg">Files will be uploaded soon.</p>
                        </div>
                    ) : (
                        categories.map((category: any, catIndex: number) => (
                            <div key={catIndex} className={catIndex > 0 ? "mt-24" : ""}>
                                {/* Category Header */}
                                <div className="flex items-center gap-6 mb-12">
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 whitespace-nowrap tracking-tight">
                                        {category.title}
                                    </h2>
                                    <div className="h-px w-full bg-slate-200 shadow-sm" />
                                </div>

                                {/* Indicators Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                                    {category.indicators.map((indicator: any, indIndex: number) => (
                                        <FreeIndicatorCard
                                            key={indIndex}
                                            {...indicator}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Why Join Section */}
            <section className="py-24 bg-white">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 italic uppercase tracking-tighter">Why Use Our Free Indicators?</h2>
                        <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { icon: ShieldCheck, title: "100% Free", desc: "No hidden costs, no subscriptions. Just pure value." },
                            { icon: TrendingUp, title: "Proven Accuracy", desc: "Built with the same core logic as our VIP tools." },
                            { icon: Target, title: "Precise Data", desc: "Real-time analysis optimized for low-latency." },
                            { icon: Download, title: "Instant Download", desc: "Get your files immediately after clicking." }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-3">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-[200px]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <div className="bg-slate-50 pb-32 pt-24 border-t border-slate-100">
                <NewsletterSection />
            </div>
        </div>
    );
};

export default FreeTradingIndicatorsPage;

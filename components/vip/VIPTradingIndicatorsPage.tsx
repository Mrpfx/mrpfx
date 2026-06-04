'use client';

import Image from 'next/image';
import { Check, ShieldCheck, TrendingUp, BarChart3, Target } from 'lucide-react';
import IndicatorCard from './IndicatorCard';
import NewsletterSection from '@/components/shared/NewsletterSection';
import { tradingToolsService } from '@/lib/trading-tools';
import { useDataWithFallback } from '@/lib/hooks/useDataWithFallback';
import { TradingTool } from '@/lib/types';
import { getMediaUrl } from '@/lib/utils';

const VIPTradingIndicatorsPage = () => {
    const { data, isLoading } = useDataWithFallback(
        tradingToolsService.getTools,
        { items: [], total: 0, page: 1, pageSize: 20 },
        'indicator',
        'vip',
        50
    );

    const indicators = data?.items || [];

    // Group indicators by category
    const groupedCategories = indicators.reduce((acc: any[], indicator: any) => {
        const catTitle = indicator.category || "Premium Indicators";
        let category = acc.find(c => c.title === catTitle);
        if (!category) {
            category = { title: catTitle, items: [] };
            acc.push(category);
        }
        category.items.push({
            id: indicator.id,
            name: indicator.title,
            description: indicator.description,
            features: indicator.description.split('\n').filter((l: string) => l.trim().length > 0).slice(0, 3),
            imageSrc: getMediaUrl(indicator.image_url) || "/assets/indicators/chart-tablet.png",
            purchaseUrl: indicator.purchase_url,
            price: indicator.price
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
                                VIP Trading Indicators
                            </h1>
                            <h2 className="text-xl md:text-3xl font-bold text-white/90 mb-8 max-w-2xl">
                                Advanced Market Analysis Tools<br className="hidden md:block" />
                                <span className="text-white/70 font-medium whitespace-nowrap lg:whitespace-normal">for Professional Edge</span>
                            </h2>

                            <ul className="flex flex-col gap-5 mb-12 items-center lg:items-start text-white/90 font-bold">
                                {[
                                    "Institutional Level Analysis",
                                    "Non-Repaint Visual Signals",
                                    "Multiple Timeframe Scanning"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 group">
                                        <div className="bg-white rounded-full p-1 shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-300">
                                            <Check className="w-4 h-4 text-blue-600 stroke-[4]" />
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
                                    src="/assets/indicators/hero-indicator.png"
                                    alt="VIP Trading Indicators"
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
            <section className="py-20 bg-[#f8fafc]">
                <div className="max-w-[1280px] mx-auto px-6">
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-10">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="bg-slate-200 animate-pulse rounded-2xl h-[400px]"></div>
                            ))}
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                            <p className="text-slate-500 font-medium text-lg">New VIP indicators coming soon!</p>
                        </div>
                    ) : (
                        categories.map((category: any, catIndex: number) => (
                            <div key={catIndex} className={catIndex > 0 ? "mt-24" : ""}>
                                {/* Category Header */}
                                <div className="flex items-center gap-4 mb-10">
                                    <h2 className="text-2xl md:text-3xl font-black text-[#0f172a] whitespace-nowrap">
                                        {category.title}
                                    </h2>
                                    <div className="h-[2px] w-full bg-gradient-to-r from-blue-100 to-transparent" />
                                </div>

                                {/* Indicators Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-10">
                                    {category.items.map((indicator: any, indIndex: number) => (
                                        <IndicatorCard
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

            {/* Why Choose Section */}
            <section className="py-20 bg-white">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-4">Why Professional Traders Choose Us</h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">Get access to professional tools designed for accurate market analysis.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Target, title: "Precision Entries", desc: "Identify exact reversal and breakout points." },
                            { icon: TrendingUp, title: "Trend Strength", desc: "Know exactly when a trend is strong or fading." },
                            { icon: ShieldCheck, title: "Reliability", desc: "Backtested algorithms for consistent results." },
                            { icon: BarChart3, title: "Multi-Asset", desc: "Optimized for Gold, US30, and major pairs." }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-[24px] bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                                <div className="bg-white p-4 rounded-2xl shadow-sm inline-block mb-6 group-hover:scale-110 group-hover:text-blue-600 transition-all">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1e293b] mb-3">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <div className="bg-white pb-20">
                <NewsletterSection />
            </div>
        </div>
    );
};

export default VIPTradingIndicatorsPage;

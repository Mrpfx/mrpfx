'use client';

import Image from 'next/image';
import { Check, Bot, Zap, Globe, Cpu, Activity } from 'lucide-react';
import RobotCard from './RobotCard';
import NewsletterSection from '@/components/shared/NewsletterSection';
import { tradingToolsService } from '@/lib/trading-tools';
import { useDataWithFallback } from '@/lib/hooks/useDataWithFallback';
import { TradingTool } from '@/lib/types';
import { getMediaUrl } from '@/lib/utils';

// Removed FALLBACK_BOTS
const VIPTradingBotsPage = () => {
    const { data, isLoading } = useDataWithFallback(
        tradingToolsService.getTools,
        { items: [], total: 0, page: 1, pageSize: 20 },
        'bot',
        'vip',
        50
    );

    const bots = data?.items || [];

    // Group robots by category
    const groupedCategories = bots.reduce((acc: any[], robot: any) => {
        const catTitle = robot.category || "Premium Robots";
        let category = acc.find(c => c.title === catTitle);
        if (!category) {
            category = { title: catTitle, robots: [] };
            acc.push(category);
        }
        category.robots.push({
            id: robot.id,
            name: robot.title,
            description: robot.description,
            features: robot.description.split('\n').filter((l: string) => l.trim().length > 0).slice(0, 3),
            imageSrc: getMediaUrl(robot.image_url) || "/assets/vip/robot-combat.png",
            purchaseUrl: robot.purchase_url,
            price: robot.price
        });
        return acc;
    }, []);

    const categories = groupedCategories;

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative bg-[#0f172a] pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
                {/* Background Pattern/Glow */}
                <div className="absolute inset-0 bg-[url('/assets/grid.svg')] bg-center opacity-20" />
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full" />

                <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                        {/* Hero Content */}
                        <div className="flex-[1.2] text-center lg:text-left">
                            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 uppercase tracking-tight leading-none drop-shadow-xl">
                                VIP Trading Robots
                            </h1>
                            <h2 className="text-xl md:text-3xl font-bold text-blue-400 mb-8 max-w-2xl italic">
                                High-Frequency Algorithmic Systems<br className="hidden md:block" />
                                <span className="text-white/70 font-medium not-italic">Engineered for consistent growth</span>
                            </h2>

                            <ul className="flex flex-col gap-5 mb-12 items-center lg:items-start text-white/90 font-bold">
                                {[
                                    "Fully Automated Strategies",
                                    "Built-in Risk Management",
                                    "Lifetime Regular Updates"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 group">
                                        <div className="bg-blue-600 rounded-full p-1 shadow-[0_0_20px_rgba(37,99,235,0.5)] group-hover:scale-110 transition-transform duration-300 border border-white/20">
                                            <Check className="w-4 h-4 text-white stroke-[4]" />
                                        </div>
                                        <span className="text-lg md:text-xl tracking-tight">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Hero Image */}
                        <div className="flex-[0.8] w-full max-w-[550px] relative">
                            <div className="relative z-10 drop-shadow-[0_25px_60px_rgba(0,0,0,0.5)] border-4 border-white/10 rounded-[40px] overflow-hidden">
                                <Image
                                    src="/assets/vip/hero-robot.png"
                                    alt="VIP Trading Robots"
                                    width={600}
                                    height={600}
                                    className="w-full h-auto object-contain"
                                    priority
                                />
                            </div>
                            {/* Floating badges */}
                            <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-2xl z-20 hidden md:block animate-bounce-slow">
                                <Activity className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes bounce-slow {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                    .animate-bounce-slow {
                        animation: bounce-slow 4s ease-in-out infinite;
                    }
                `}</style>
            </section>

            {/* Categories & Robots Section */}
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
                            <p className="text-slate-500 font-medium text-lg">Files will be uploaded soon.</p>
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

                                {/* Robots Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-10">
                                    {category.robots.map((robot: any, robIndex: number) => (
                                        <RobotCard
                                            key={robIndex}
                                            {...robot}
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
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">Get access to the same technology used by institutional traders.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Bot, title: "High Win Rate", desc: "Optimized strategies with high precision entries." },
                            { icon: Zap, title: "Lightning Fast", desc: "No delays in execution, catching every opportunity." },
                            { icon: Globe, title: "Global Access", desc: "Works on any broker supporting MetaTrader 5." },
                            { icon: Cpu, title: "Smart Risk", desc: "Built-in drawdown protection and risk management." }
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

export default VIPTradingBotsPage;

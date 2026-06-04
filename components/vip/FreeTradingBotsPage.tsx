'use client';

import Image from 'next/image';
import { Check, Cpu, Zap, Activity, Globe, Download } from 'lucide-react';
import FreeRobotCard from './FreeRobotCard';
import NewsletterSection from '@/components/shared/NewsletterSection';

import { useState, useEffect } from 'react';
import { tradingToolsService } from '@/lib/trading-tools';
import { TradingTool } from '@/lib/types';
import { getMediaUrl } from '@/lib/utils';

const FreeTradingBotsPage = () => {
    const [bots, setBots] = useState<TradingTool[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBots = async () => {
            try {
                const response = await tradingToolsService.getTools('bot', 'free', 50);
                setBots(response.items || []);
            } catch (error) {
                console.error("Failed to fetch free bots:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBots();
    }, []);

    // Helper to get image based on title or type
    const getBotImage = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes('synthetic') || t.includes('boom') || t.includes('crash')) return "/assets/free-robots/synthetic-bot.png";
        if (t.includes('ai') || t.includes('neural')) return "/assets/free-robots/ai-bot.png";
        return "/assets/free-robots/forex-bot.png";
    };

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative bg-[#064e3b] pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
                {/* Background Pattern/Glow */}
                <div className="absolute inset-0 bg-[url('/assets/grid-light.svg')] bg-center opacity-10" />
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/20 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-teal-600/20 blur-[130px] rounded-full" />

                <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                        {/* Hero Content */}
                        <div className="flex-[1.2] text-center lg:text-left">
                            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 uppercase tracking-tight leading-none drop-shadow-lg">
                                Free Trading Bots
                            </h1>
                            <h2 className="text-xl md:text-3xl font-bold text-emerald-400 mb-8 max-w-2xl italic">
                                Professional Automated Systems<br className="hidden md:block" />
                                <span className="text-white/70 font-medium not-italic">at zero cost to you</span>
                            </h2>

                            <ul className="flex flex-col gap-5 mb-12 items-center lg:items-start text-white/90 font-bold">
                                {[
                                    "Plug & Play Setup",
                                    "Forex, Indices & Synthetic",
                                    "No Monthly Subscriptions"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 group">
                                        <div className="bg-emerald-500 rounded-full p-1 shadow-[0_0_20px_rgba(16,185,129,0.5)] group-hover:scale-110 transition-transform duration-300 border border-white/20">
                                            <Check className="w-4 h-4 text-white stroke-[4]" />
                                        </div>
                                        <span className="text-lg md:text-xl tracking-tight">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Hero Image */}
                        <div className="flex-[0.8] w-full max-w-[550px] relative">
                            <div className="relative z-10 drop-shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
                                <Image
                                    src="/assets/free-robots/hero-free-robots.png"
                                    alt="Free Trading Robots"
                                    width={700}
                                    height={700}
                                    className="w-full h-auto object-contain animate-float"
                                    priority
                                />
                            </div>
                            {/* Decorative element behind robot */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/20 blur-[70px] rounded-full scale-110 -z-0" />
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(1deg); }
                    }
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                `}</style>
            </section>

            {/* Main Content Grid */}
            <section className="py-24 bg-slate-50 relative min-h-[400px]">
                <div className="max-w-[1280px] mx-auto px-6">
                    {/* Category Header */}
                    <div className="flex items-center gap-6 mb-12">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 whitespace-nowrap tracking-tight uppercase">
                            Available Free Bots
                        </h2>
                        <div className="h-px w-full bg-slate-200 shadow-sm" />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-[20px] h-[400px] animate-pulse" />
                            ))}
                        </div>
                    ) : bots.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                            <p className="text-slate-500 text-lg font-medium">Files will be uploaded soon.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {bots.map((bot) => (
                                <FreeRobotCard
                                    key={bot.id}
                                    id={bot.id}
                                    name={bot.title}
                                    description={bot.description}
                                    features={bot.description.split('\n').filter(l => l.trim().length > 0).slice(0, 3)}
                                    imageSrc={getMediaUrl(bot.image_url) || getBotImage(bot.title)}
                                    downloadUrl={bot.download_url}
                                    category={bot.title.includes('Synthetic') ? 'Synthetic' : 'Forex'}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Features/Stats Section */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        {[
                            { icon: Cpu, title: "Advanced Logic", desc: "Complex algorithms simplified for free access." },
                            { icon: Zap, title: "High Speed", desc: "No delay execution on major trading platforms." },
                            { icon: Activity, title: "Reliability", desc: "Stable performance monitored by our expert team." },
                            { icon: Globe, title: "Global Assets", desc: "Bots for every market, from FX to Synthetic." }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center group">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 group-hover:rotate-12">
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
            <div className="bg-slate-50 pb-32 pt-24">
                <NewsletterSection />
            </div>
        </div>
    );
};

export default FreeTradingBotsPage;

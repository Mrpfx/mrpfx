'use client';

import Image from 'next/image';
import NewsletterSection from '@/components/shared/NewsletterSection';
import { signalsService } from '@/lib/signals';
import { useDataWithFallback } from '@/lib/hooks/useDataWithFallback';
import { CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';

const FALLBACK_FREE_SIGNALS = {
    items: [
        {
            id: 1,
            title: 'EUR/USD Buy',
            status: 'active',
            signal_type: 'free' as const,
            instrument: 'EUR/USD',
            type: 'buy',
            entry: '1.08500',
            sl: '1.08000',
            tp1: '1.09200',
            date: new Date().toISOString(),
        },
        {
            id: 2,
            title: 'XAU/USD Sell',
            status: 'active',
            signal_type: 'free' as const,
            instrument: 'XAU/USD (GOLD)',
            type: 'sell',
            entry: '2350.00',
            sl: '2365.00',
            tp1: '2320.00',
            date: new Date().toISOString(),
        }
    ],
    total: 2,
    page: 1,
    pageSize: 5
};

const FreeSignalsGroupPage = () => {
    const { data } = useDataWithFallback(
        signalsService.getSignals,
        FALLBACK_FREE_SIGNALS,
        'free',
        5
    );
    const signals = data?.items || [];
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="max-w-[1140px] mx-auto px-5 pt-20 pb-10 md:pt-32 md:pb-20">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20">

                    {/* Left Column: Text Content */}
                    <div className="flex-1 flex flex-col items-start text-left">

                        {/* Free Badge */}
                        <div className="bg-[#bbf7d0] text-[#15803d] px-6 py-2 rounded-lg font-bold text-xl mb-6 font-['DM_Sans']">
                            Free
                        </div>

                        {/* Heading */}
                        <h1 className="text-black font-bold text-5xl md:text-6xl mb-6 font-['DM_Sans'] leading-tight">
                            Signals Group
                        </h1>

                        {/* Description */}
                        <p className="text-gray-500 text-lg mb-8 max-w-lg font-['DM_Sans'] leading-relaxed">
                            Mr P FX Group proudly offers traders an exclusive opportunity to join our Free VIP Signal Group. A premium channel designed to help you stay ahead in the fast-paced world of Forex trading.
                        </p>

                        {/* CTA Button */}
                        <a
                            href="https://t.me/mrpfxuniversity"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-4 px-8 rounded-lg text-sm tracking-wider transition-colors font-['DM_Sans']"
                        >
                            GAIN ACCESS
                        </a>
                    </div>

                    {/* Right Column: Image */}
                    <div className="flex-1 w-full flex justify-center md:justify-end">
                        <div className="relative w-full max-w-[600px] aspect-[4/3]">
                            <Image
                                src="/assets/free-signals/telegram-card.png"
                                alt="Free Signals Group Telegram"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Dynamic Signals Section */}
            <div className="bg-slate-50 py-20 border-t border-slate-100">
                <div className="max-w-[1140px] mx-auto px-5">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 font-['DM_Sans']">Recent Free Signals</h2>
                        <a href="https://t.me/mrpfxuniversity" target="_blank" className="text-blue-600 font-bold flex items-center gap-2 hover:underline">
                            View All on Telegram <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {signals.map((signal: any) => (
                            <div key={signal.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
                                        <TrendingUp className={`w-5 h-5 ${signal.type === 'buy' ? 'text-green-500' : 'text-red-500'}`} />
                                        {signal.instrument}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${signal.type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {signal.type}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Entry Price:</span>
                                        <span className="text-slate-900 font-bold">{signal.entry}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Stop Loss:</span>
                                        <span className="text-slate-900 font-bold">{signal.sl || 'TBA'}</span>
                                    </div>
                                    <div className="flex justify-between text-base border-t border-slate-100 pt-3">
                                        <span className="text-slate-500 font-medium italic">Take Profit:</span>
                                        <span className="text-blue-600 font-black">{signal.tp1}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="pb-20 bg-slate-50">
                <NewsletterSection />
            </div>
        </div>
    );
};

export default FreeSignalsGroupPage;

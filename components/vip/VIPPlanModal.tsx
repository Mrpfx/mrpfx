'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

interface VIPPlan {
    badge: string;
    title: string;
    price: string;
    buttonText: string;
    highlight: boolean;
    topBadge?: string;
    slug?: string;
}

interface VIPPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    planSlugs?: {
        oneMonth: string;
        twelveMonths: string;
        unlimited: string;
    };
    onSelectPlan: (slug: string) => Promise<void>;
    isProcessing?: boolean;
}

const VIPPlanModal: React.FC<VIPPlanModalProps> = ({ isOpen, onClose, planSlugs, onSelectPlan, isProcessing }) => {
    const [localProcessingSlug, setLocalProcessingSlug] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) setLocalProcessingSlug(null);
    }, [isOpen]);

    if (!isOpen) return null;

    const plans: VIPPlan[] = [
        {
            badge: 'STARTER',
            title: '1 Month',
            price: '$199',
            buttonText: 'Get 1 Month Access',
            highlight: false,
            slug: planSlugs?.oneMonth
        },
        {
            badge: 'BEST VALUE',
            title: '12 Months',
            price: '$299',
            buttonText: 'Get 12 Months Access',
            highlight: true,
            topBadge: 'MOST POPULAR',
            slug: planSlugs?.twelveMonths
        },
        {
            badge: 'BEST DEAL',
            title: 'Unlimited',
            price: '$499',
            buttonText: 'Get Lifetime Access',
            highlight: false,
            slug: planSlugs?.unlimited
        }
    ];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[95dvh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Scrollable content inside modal */}
                <div className="overflow-y-auto flex-1 px-5 pt-6 pb-5 sm:px-8 sm:pt-8 sm:pb-6 hide-scrollbar">
                    {/* Header */}
                    <div className="text-center mb-4 sm:mb-6 pr-6">
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2A2A72] mb-1 sm:mb-2 tracking-tight">Join VIP Signals</h2>
                        <p className="text-gray-400 text-base sm:text-xl font-medium">Choose your access plan</p>
                    </div>

                    {/* Plans */}
                    <div className="space-y-2.5 sm:space-y-4">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl border ${plan.highlight
                                    ? 'border-[#F6E05E] bg-[#FFFEF0] shadow-[0_0_20px_rgba(250,204,21,0.2)]'
                                    : 'border-gray-100 bg-white'
                                    }`}
                            >
                                {plan.topBadge && (
                                    <div className="absolute top-3 right-4 sm:top-4 sm:right-6 text-[#D4AF37] font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                                        {plan.topBadge}
                                    </div>
                                )}

                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex flex-col gap-0.5 sm:gap-1">
                                        <span className={`inline-block w-fit px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-black tracking-widest uppercase ${plan.highlight ? 'bg-[#FCEBA7] text-[#856404]' : 'bg-[#D4AF37] text-white'}`}>
                                            {plan.badge}
                                        </span>
                                        <h3 className="text-xl sm:text-2xl font-black text-[#1e293b] mt-1">{plan.title}</h3>
                                        <p className="text-xl sm:text-2xl font-bold text-[#4B5563]">{plan.price}</p>
                                    </div>

                                    <div className="shrink-0">
                                        <button
                                            onClick={async () => {
                                                if (plan.slug) {
                                                    setLocalProcessingSlug(plan.slug);
                                                    try {
                                                        await onSelectPlan(plan.slug);
                                                    } catch (e) {
                                                        setLocalProcessingSlug(null);
                                                    }
                                                }
                                            }}
                                            disabled={isProcessing || !plan.slug}
                                            className="block py-2.5 px-4 sm:py-3 sm:px-6 bg-gradient-to-b from-[#f3e5ab] via-[#d4af37] to-[#b8860b] text-[#1e293b] font-black text-xs sm:text-sm uppercase rounded shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-center whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
                                        >
                                            {isProcessing && localProcessingSlug === plan.slug ? <Loader2 className="w-4 h-4 animate-spin" /> : plan.buttonText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 sm:mt-6 text-center text-gray-400 font-bold tracking-wide text-sm sm:text-base">
                        Instant access after payment.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VIPPlanModal;

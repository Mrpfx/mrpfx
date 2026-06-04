'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, ShieldCheck, TrendingUp, MonitorPlay, Settings2, Search, Zap, Eye, HelpCircle } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function TradersSelectionModal({ isOpen, onClose }: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const steps = [
        {
            title: "Strategy Review",
            description: "Each trader is first reviewed based on their overall trading approach.",
            icon: Search,
            color: "text-blue-600",
            bg: "bg-blue-50",
            items: [
                "Market understanding",
                "Entry and exit structure",
                "Risk-to-reward logic",
                "Stop loss discipline",
                "Trade management behavior",
                "Consistency of execution"
            ],
            footer: "We look for traders who follow a repeatable process, not gamblers chasing random profits."
        },
        {
            title: "Risk Management Assessment",
            description: "Before any trader can be considered, risk control must be clear and proven. We review whether the trader demonstrates:",
            icon: ShieldCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            items: [
                "Controlled lot sizing",
                "Defined stop loss placement",
                "Capital preservation mindset",
                "Ability to avoid revenge trading",
                "Stable drawdown behavior",
                "Discipline during losing periods"
            ],
            footer: "A trader may produce strong profits, but without proper risk control, they are not suitable for client account management."
        },
        {
            title: "Performance Vetting",
            description: "Past performance is reviewed with attention to quality, not just profit size.",
            icon: TrendingUp,
            color: "text-purple-600",
            bg: "bg-purple-50",
            items: [
                "Win consistency over time",
                "Drawdown behavior",
                "Execution under different market conditions",
                "Risk-adjusted returns",
                "Trade frequency and stability",
                "Ability to preserve gains"
            ],
            footer: "We do not prioritize reckless high-return trading. We prioritize measured, repeatable performance."
        },
        {
            title: "Live Behavior Monitoring",
            description: "A trader is not selected based on theory alone. We monitor how they behave in live conditions, including:",
            icon: MonitorPlay,
            color: "text-amber-600",
            bg: "bg-amber-50",
            items: [
                "Patience before entries",
                "Reaction to volatility",
                "Discipline around stop losses",
                "Overtrading tendencies",
                "Consistency in following plan",
                "Emotional stability during drawdown"
            ],
            footer: "This helps filter out traders who look good on paper but trade poorly under real pressure."
        },
        {
            title: "Operational Standards Check",
            description: "Beyond trading skill, we also review professionalism and account handling discipline. This includes:",
            icon: Settings2,
            color: "text-slate-600",
            bg: "bg-slate-50",
            items: [
                "Respect for defined trading limits",
                "Proper communication and reporting behavior",
                "Stable execution process",
                "No reckless deviation from approved structure",
                "Consistency in following capital protection rules"
            ],
            footer: "Only traders who meet both trading and operational standards move forward."
        }
    ];

    const modalContent = (
        <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-4xl max-h-[92vh] md:max-h-[90vh] bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-40 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all font-bold"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Main Scrollable Area Wrapper */}
                <div className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row custom-scrollbar">

                    {/* Left Sidebar - Intro (Scrolls with content on mobile) */}
                    <div className="w-full md:w-[35%] bg-[#F8FAFC] p-6 md:p-10 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-center shrink-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-[10px] md:text-xs font-bold rounded-full mb-3 md:mb-4 w-fit">
                            <Zap className="w-3 h-3" />
                            INTERNAL PROCESS
                        </div>
                        <h2 className="text-xl md:text-3xl font-black text-slate-900 mb-2 md:mb-6 leading-tight font-dm-sans">
                            See How <span className="text-blue-600">Traders</span> are Selected
                        </h2>
                        <p className="text-slate-800 font-bold leading-relaxed mb-1 md:mb-2 text-[13px] md:text-sm block">
                            We do not allow just anyone to manage client-linked accounts.
                        </p>
                        <p className="text-slate-600 font-medium leading-relaxed mb-2 md:mb-4 text-[13px] md:text-base block">
                            Trade Management Built on Screening, Structure, and Control.
                        </p>
                        <p className="text-slate-500 text-xs md:text-sm leading-relaxed block mt-1 md:mt-2">
                            Every verified manager goes through a strict internal screening process focused on trading discipline, risk control, execution consistency, and account safety behavior.
                        </p>
                        <div className="mt-3 md:mt-8 p-3 md:p-4 bg-emerald-50 rounded-xl md:rounded-2xl border border-emerald-100 block">
                            <p className="text-emerald-700 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Our Core Goal</p>
                            <p className="text-emerald-900 text-[12px] md:text-sm font-semibold">Protect client capital first, then pursue performance through controlled execution.</p>
                        </div>
                    </div>

                    {/* Right Content - Scrollable Steps (Nested scroll only on desktop) */}
                    <div className="flex-1 md:overflow-y-auto p-6 md:p-10 custom-scrollbar bg-white min-h-0">
                        <div className="space-y-12">
                            <div className="border-b border-gray-100 pb-8">
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Our Selection Process</h3>
                                <p className="text-slate-500 text-sm font-medium">A rigorous framework designed to maintain the highest standards of professional trading.</p>
                            </div>

                            {steps.map((step, index) => (
                                <div key={index} className="relative">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-12 h-12 ${step.bg} rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-black/5`}>
                                            <step.icon className={`w-6 h-6 ${step.color}`} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Step {index + 1}</div>
                                            <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                                            <p className="text-slate-500 text-sm mt-1 font-medium">{step.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 ml-0 md:ml-16">
                                        {step.items.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100 group hover:bg-white hover:border-blue-100 transition-all">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                                <span className="text-sm text-slate-700 font-bold">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <blockquote className={`ml-0 md:ml-16 pl-4 border-l-4 border-slate-100 py-1 italic text-slate-500 text-sm font-medium`}>
                                        "{step.footer}"
                                    </blockquote>
                                </div>
                            ))}

                            {/* Ongoing Monitoring Section */}
                            <div className="pt-8 border-t border-gray-100 relative">
                                <div className="absolute -top-3 left-0 bg-white pr-4 text-[10px] font-bold text-blue-600 uppercase tracking-widest">Post-Selection</div>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                                        <Eye className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">Ongoing Monitoring Matters</h3>
                                        <p className="text-slate-500 text-sm mt-1 font-medium">Selection is not a one-time event. Verified managers are continuously observed for:</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-0 md:ml-16">
                                    {[
                                        "Execution consistency",
                                        "Risk adherence",
                                        "Drawdown control",
                                        "Stability of results",
                                        "Compliance with approved structure"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-blue-50/30 p-3 rounded-xl border border-blue-50">
                                            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                                            <span className="text-sm text-slate-800 font-bold">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-6 ml-0 md:ml-16 text-sm text-slate-500 font-medium leading-relaxed">
                                    This helps maintain quality over time and ensures that standards remain high.
                                </p>
                            </div>

                            {/* Why This Process Exists */}
                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-4 opacity-5">
                                    <HelpCircle className="w-24 h-24 text-slate-900" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-blue-600" />
                                    Why This Process Exists
                                </h3>
                                <p className="text-slate-600 text-sm mb-6 font-medium">We built this process to focus on what matters most:</p>
                                <ul className="space-y-3">
                                    {[
                                        "Filtering out reckless traders",
                                        "Improving trust",
                                        "Maintaining a professional standard",
                                        "Giving clients a more structured path to account management"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-800 font-bold">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* What We Look For Section */}
                            <div className="pt-8 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    What We Look For in a Verified Manager
                                </h3>
                                <p className="text-slate-500 text-sm mb-4 font-medium">Our preferred traders are those who demonstrate:</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {[
                                        "Discipline over hype",
                                        "Consistency over randomness",
                                        "Risk control over aggression",
                                        "Patience over impulsive trading",
                                        "Structured execution over emotional decisions"
                                    ].map((t, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500 italic font-medium leading-relaxed">
                                    The selection standard is not based on who can make the biggest profit in one day. It is based on who can manage capital with a professional mindset.
                                </p>
                            </div>

                            {/* What We Reject Section */}
                            <div className="p-6 bg-red-50 rounded-[1.5rem] border border-red-100 relative">
                                <div className="absolute top-4 right-6 text-red-100">
                                    <ShieldCheck className="w-12 h-12" />
                                </div>
                                <h3 className="text-lg font-bold text-red-900 mb-1">What We Reject</h3>
                                <p className="text-red-700/70 text-xs font-bold mb-4 uppercase tracking-wider">Zero Tolerance Policy</p>
                                <p className="text-red-800 text-sm mb-4 font-medium">A trader will not be approved if they show signs of:</p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                    {[
                                        "Overleveraging",
                                        "No stop loss discipline",
                                        "Martingale-style risk exposure",
                                        "Revenge trading",
                                        "Random lot size increases",
                                        "Inconsistent execution",
                                        "Poor drawdown control",
                                        "Emotional trading behavior"
                                    ].map((t, i) => (
                                        <li key={i} className="text-xs text-red-700 flex items-center gap-2 font-bold bg-white/40 p-2 rounded-lg border border-red-100/50">
                                            <X className="w-3 h-3 text-red-500" />
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-4 text-xs text-red-700/80 font-medium italic">
                                    This process is designed to reduce unnecessary risk and improve the quality of traders allowed into the system.
                                </p>
                            </div>

                            {/* Important Notice */}
                            <div className="bg-slate-900 text-white p-8 rounded-[1.5rem] relative overflow-hidden">
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                                <h3 className="text-xl font-bold mb-2 relative z-10">Important Notice</h3>
                                <div className="space-y-4 text-slate-300 text-sm leading-relaxed relative z-10 font-medium">
                                    <p>Account management involves risk. Even vetted traders can experience losing trades or periods of drawdown.</p>
                                    <p>Verification does not mean guaranteed profit. It means the trader has passed internal standards for structured execution, discipline, and risk-aware behavior.</p>

                                    <div className="bg-white/5 p-5 rounded-xl border border-white/10 mt-6 backdrop-blur-sm">
                                        <p className="text-xs font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-blue-400" />
                                            Client Acknowledgement
                                        </p>
                                        <p className="text-slate-300 mb-3 text-xs md:text-sm">Clients should only proceed if they understand that:</p>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3 text-xs md:text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                                                <span>Trading results are never guaranteed</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-xs md:text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                                                <span>Losses can occur</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-xs md:text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                                                <span>Capital remains exposed to market risk at all times</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
            `}} />
        </div>
    );

    return createPortal(modalContent, document.body);
}

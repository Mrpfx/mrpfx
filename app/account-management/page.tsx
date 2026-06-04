'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import AccountManagementForm from '@/components/account-management/AccountManagementForm';
import { Database, ShieldCheck, BadgeCheck } from 'lucide-react';
import TradersSelectionModal from '@/components/checkout/TradersSelectionModal';

export default function AccountManagementPage() {
    const [showSelectionModal, setShowSelectionModal] = useState(false);

    return (
        <div className="bg-[#f0f4ff] min-h-screen pt-[100px] md:pt-[130px] pb-24 font-dm-sans overflow-hidden relative">

            {/* Background Image Container */}
            <div className="absolute top-0 right-0 w-full md:w-[65%] h-[500px] md:h-[900px] z-0 pointer-events-none">
                <div
                    className="absolute inset-0 z-10 hidden md:block"
                    style={{
                        background: 'linear-gradient(to right, #f0f4ff 0%, rgba(244, 247, 255, 0.8) 20%, transparent 50%)'
                    }}
                />
                <div
                    className="absolute inset-0 z-10 block md:hidden"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(240, 244, 255, 0.4) 0%, rgba(240, 244, 255, 0.7) 40%, rgba(240, 244, 255, 1) 90%)'
                    }}
                />
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        background: 'radial-gradient(circle at 30% 50%, rgba(244,247,255,0.4) 0%, transparent 60%)'
                    }}
                />
                <Image
                    src="/account-management-hero.png"
                    alt="Professional Trading Desk"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center right' }}
                    priority
                    className="opacity-90 md:opacity-100"
                />
                <div
                    className="absolute bottom-0 left-0 right-0 h-[300px] z-10"
                    style={{
                        background: 'linear-gradient(to top, #f0f4ff 0%, transparent 100%)'
                    }}
                />
            </div>

            <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 relative z-20">

                <div className="w-full lg:w-[50%] text-[#1a1a1a] pb-4 md:pb-8 pt-4 md:pt-[60px] lg:pt-[80px] z-20 text-left min-h-0 md:min-h-[400px] lg:min-h-[500px]">
                    <h1 className="text-[36px] md:text-[46px] lg:text-[52px] font-bold leading-[1.1] text-[#1c2331] mb-2 md:mb-1 mt-6 md:mt-0">
                        Account Management
                    </h1>
                    <h2 className="text-[22px] md:text-[32px] lg:text-[36px] text-[#1E3A8A] font-medium mb-4 md:mb-6 font-dm-sans">
                        by Verified Professionals
                    </h2>

                    <p className="text-[16px] md:text-[18px] text-[#334155] leading-relaxed mb-4 md:mb-6 font-medium max-w-[480px]">
                        Have your trading account managed by experienced, performance-vetted traders while you focus on other priorities.
                    </p>
                    <p className="text-[16px] md:text-[18px] text-[#334155] leading-relaxed mb-8 md:mb-10 max-w-[480px]">
                        Each strategy follows strict risk controls and monitored execution.
                    </p>

                    <ul className="space-y-4 md:space-y-5 text-left max-w-sm">
                        {[
                            "Trades executed by vetted professionals",
                            "Risk-adjusted lot sizing based on your capital",
                            "Every trade includes SL & TP levels",
                            "Continuous monitoring and management"
                        ].map((feature, idx) => (
                            <li key={idx} className="flex items-center text-[#1e293b] font-medium text-[15px] md:text-[17px]">
                                <svg className="h-[20px] w-[20px] text-[#1E3A8A] mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-full z-30 relative mt-4 md:mt-8 flex flex-col items-center">
                    <div className="w-full">
                        <AccountManagementForm />
                    </div>

                    <div className="w-full flex flex-col items-start justify-start text-[#1e293b] text-[15px] md:text-[16px] font-medium space-y-3 mt-8 pl-2 sm:pl-4 max-w-2xl mx-auto lg:max-w-none lg:mx-0 lg:ml-0 xl:ml-0 w-full">
                        <div className="flex items-center">
                            <ShieldCheck className="h-[20px] w-[20px] mr-4 text-[#1E3A8A] stroke-[2.5]" />
                            <span>Your funds remain in your broker account</span>
                        </div>
                        <div className="flex items-center">
                            <Database className="h-[20px] w-[20px] mr-4 text-[#1E3A8A] stroke-[2.5]" />
                            <span>No withdrawal access is granted</span>
                        </div>
                        <div className="flex items-center">
                            <BadgeCheck className="h-[20px] w-[20px] mr-4 text-[#1E3A8A] stroke-[2.5]" />
                            <span>You can stop the service anytime</span>
                        </div>
                    </div>

                    <div className="w-full flex justify-center mt-10">
                        <button
                            onClick={() => setShowSelectionModal(true)}
                            className="px-6 md:px-10 py-[14px] bg-transparent border-[1.5px] border-[#cbd5e1] text-[#1E3A8A] font-bold rounded-full hover:bg-white hover:shadow-sm transition-all font-dm-sans text-[14px] md:text-[16px] shadow-sm whitespace-nowrap"
                        >
                            See How Traders Are Selected
                        </button>
                    </div>
                </div>

                <TradersSelectionModal
                    isOpen={showSelectionModal}
                    onClose={() => setShowSelectionModal(false)}
                />

                <div className="w-full flex justify-center mt-12 md:mt-16 pt-8 border-t border-gray-200/60 pb-8">
                    <p className="text-[11px] md:text-[12px] text-center text-[#475569] max-w-[900px] leading-[1.6]">
                        Trading involves risk. Account management is provided through partnerships with independent, performance-vetted traders. MR P FX does not manage accounts directly and only takes a commission for participating traders. We strongly advise reviewing each trader's performance history after proceeding.
                    </p>
                </div>
            </div>
        </div>
    );
}

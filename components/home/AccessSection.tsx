import React from 'react';
import Link from 'next/link';
// Custom SVG icons — carefully matched to the reference screenshot
const CustomIcons = {
    // 1. Copy Trading — two curved arrows forming a cycle inside a dark navy circle
    CopyTrading: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            <circle cx="24" cy="24" r="23" fill="#1C3278" />
            {/* Top arrow curving right */}
            <path d="M28 16l4 4-4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 24c0-4.42 3.58-8 8-8h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            {/* Bottom arrow curving left */}
            <path d="M20 32l-4-4 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M32 24c0 4.42-3.58 8-8 8h-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    ),

    // 2. Pass Funded Accounts — graduation cap inside a dark navy circle
    PassFunded: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            <circle cx="24" cy="24" r="23" fill="#1C3278" />
            {/* Cap top */}
            <path d="M24 14L10 21l14 7 14-7-14-7z" fill="white" />
            {/* Tassel string */}
            <path d="M38 21v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="38" cy="30" r="1.5" fill="white" />
            {/* Cap body */}
            <path d="M16 23v6c0 2 3.5 5 8 5s8-3 8-5v-6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
    ),

    // 3. Dr. Trade AI Trading — cartoon robot head with antenna inside a blue circle
    AITrading: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            <circle cx="24" cy="24" r="23" fill="#2563EB" />
            {/* Antenna */}
            <line x1="24" y1="14" x2="24" y2="10" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
            <circle cx="24" cy="9" r="2" fill="#93C5FD" />
            {/* Head */}
            <rect x="14" y="14" width="20" height="16" rx="4" fill="white" />
            {/* Eyes */}
            <rect x="17" y="19" width="5" height="5" rx="1" fill="#2563EB" />
            <rect x="26" y="19" width="5" height="5" rx="1" fill="#2563EB" />
            {/* Mouth */}
            <rect x="19" y="27" width="10" height="2" rx="1" fill="#93C5FD" />
            {/* Ears */}
            <rect x="10" y="19" width="4" height="6" rx="2" fill="#93C5FD" />
            <rect x="34" y="19" width="4" height="6" rx="2" fill="#93C5FD" />
            {/* Body hint */}
            <path d="M18 30h12v4a2 2 0 01-2 2H20a2 2 0 01-2-2v-4z" fill="#DBEAFE" />
        </svg>
    ),

    // 4. Account Management — laptop screen showing a chart, light blue bg circle
    AccountMgmt: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            <circle cx="24" cy="24" r="23" fill="#DBEAFE" />
            {/* Laptop screen */}
            <rect x="10" y="12" width="28" height="18" rx="2" fill="#1C3278" />
            {/* Screen border inner */}
            <rect x="13" y="15" width="22" height="12" rx="1" fill="#0F172A" />
            {/* Chart line on screen */}
            <polyline points="15,23 19,20 22,22 27,17 31,19 33,16" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <polyline points="15,23 19,20 22,22 27,17 31,19 33,16" stroke="#60A5FA" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="0" />
            {/* Stand */}
            <path d="M18 30h12v2H18v-2z" fill="#94A3B8" />
            <path d="M20 32h8v2H20v-2z" fill="#CBD5E1" />
        </svg>
    ),

    // 5. VIP Signals — golden crown on dark navy circle
    VIPSignals: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            <circle cx="24" cy="24" r="23" fill="#1C3278" />
            {/* Crown */}
            <path d="M12 30l3-12 5 6 4-8 4 8 5-6 3 12H12z" fill="#F59E0B" />
            <rect x="12" y="30" width="24" height="4" rx="1" fill="#F59E0B" />
            {/* Crown gems */}
            <circle cx="18" cy="32" r="1" fill="#1C3278" />
            <circle cx="24" cy="32" r="1" fill="#1C3278" />
            <circle cx="30" cy="32" r="1" fill="#1C3278" />
        </svg>
    ),

    // 6. Free Signals — white paper airplane on blue circle (like Telegram)
    FreeSignals: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            <circle cx="24" cy="24" r="23" fill="#2563EB" />
            {/* Paper airplane */}
            <path d="M12 24l26-12-8 28-6-10-12-6z" fill="white" />
            <path d="M24 30l-6-6 20-12-8 28-6-10z" fill="#DBEAFE" />
        </svg>
    ),

    // 7. Risk Calculator — flat calculator with display and buttons grid
    RiskCalc: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            {/* Calculator body */}
            <rect x="12" y="6" width="24" height="36" rx="3" fill="#1C3278" />
            {/* Display */}
            <rect x="15" y="9" width="18" height="8" rx="1.5" fill="#93C5FD" />
            {/* Buttons row 1 */}
            <rect x="15" y="20" width="5" height="4" rx="1" fill="#3B82F6" />
            <rect x="21.5" y="20" width="5" height="4" rx="1" fill="#3B82F6" />
            <rect x="28" y="20" width="5" height="4" rx="1" fill="#3B82F6" />
            {/* Buttons row 2 */}
            <rect x="15" y="26" width="5" height="4" rx="1" fill="#3B82F6" />
            <rect x="21.5" y="26" width="5" height="4" rx="1" fill="#3B82F6" />
            <rect x="28" y="26" width="5" height="4" rx="1" fill="#3B82F6" />
            {/* Buttons row 3 */}
            <rect x="15" y="32" width="5" height="4" rx="1" fill="#3B82F6" />
            <rect x="21.5" y="32" width="5" height="4" rx="1" fill="#3B82F6" />
            <rect x="28" y="32" width="5" height="4" rx="1" fill="#60A5FA" />
        </svg>
    ),

    // 8. Trade Journal — clipboard/notepad with horizontal lines
    TradeJournal: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            {/* Clipboard body */}
            <rect x="10" y="8" width="28" height="34" rx="3" fill="#1C3278" />
            {/* Clipboard clip */}
            <rect x="18" y="5" width="12" height="6" rx="2" fill="#3B82F6" />
            {/* Lines */}
            <rect x="16" y="18" width="16" height="2" rx="1" fill="white" opacity="0.8" />
            <rect x="16" y="23" width="16" height="2" rx="1" fill="white" opacity="0.8" />
            <rect x="16" y="28" width="12" height="2" rx="1" fill="white" opacity="0.8" />
            <rect x="16" y="33" width="8" height="2" rx="1" fill="white" opacity="0.5" />
        </svg>
    ),

    // 9. VIP Bots — robot face with antenna, square eyes, inside a navy circle
    VIPBots: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            <circle cx="24" cy="24" r="23" fill="#1C3278" />
            {/* Antenna */}
            <line x1="24" y1="13" x2="24" y2="9" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
            <circle cx="24" cy="8" r="2" fill="#60A5FA" />
            {/* Robot head */}
            <rect x="14" y="13" width="20" height="14" rx="3" fill="white" />
            {/* Eyes */}
            <circle cx="19" cy="20" r="3" fill="#2563EB" />
            <circle cx="29" cy="20" r="3" fill="#2563EB" />
            <circle cx="19" cy="19.5" r="1" fill="white" />
            <circle cx="29" cy="19.5" r="1" fill="white" />
            {/* Mouth */}
            <path d="M19 25h10" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
            {/* Body */}
            <rect x="16" y="27" width="16" height="8" rx="2" fill="white" opacity="0.6" />
            <rect x="19" y="29" width="3" height="3" rx="0.5" fill="#2563EB" />
            <rect x="26" y="29" width="3" height="3" rx="0.5" fill="#2563EB" />
        </svg>
    ),

    // 10. Free Bots — small tank-treaded robot, mechanical style
    FreeBots: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            {/* Robot body */}
            <rect x="14" y="14" width="20" height="14" rx="3" fill="#1C3278" />
            {/* Robot head visor */}
            <rect x="18" y="17" width="12" height="5" rx="2" fill="#93C5FD" />
            {/* Eyes on visor */}
            <circle cx="21" cy="19.5" r="1.5" fill="#1C3278" />
            <circle cx="27" cy="19.5" r="1.5" fill="#1C3278" />
            {/* Antenna left right */}
            <line x1="17" y1="14" x2="15" y2="10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            <line x1="31" y1="14" x2="33" y2="10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            <circle cx="15" cy="9" r="1.5" fill="#3B82F6" />
            <circle cx="33" cy="9" r="1.5" fill="#3B82F6" />
            {/* Chest panel */}
            <rect x="20" y="24" width="8" height="3" rx="1" fill="#3B82F6" />
            {/* Tank treads */}
            <rect x="10" y="28" width="12" height="6" rx="3" fill="#334155" />
            <rect x="26" y="28" width="12" height="6" rx="3" fill="#334155" />
            {/* Tread details */}
            <line x1="13" y1="29" x2="13" y2="33" stroke="#64748B" strokeWidth="1" />
            <line x1="16" y1="29" x2="16" y2="33" stroke="#64748B" strokeWidth="1" />
            <line x1="19" y1="29" x2="19" y2="33" stroke="#64748B" strokeWidth="1" />
            <line x1="29" y1="29" x2="29" y2="33" stroke="#64748B" strokeWidth="1" />
            <line x1="32" y1="29" x2="32" y2="33" stroke="#64748B" strokeWidth="1" />
            <line x1="35" y1="29" x2="35" y2="33" stroke="#64748B" strokeWidth="1" />
        </svg>
    ),

    // 11. Paid Indicators — chart trending up with plus badge, blue circle
    PaidIndicators: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            <circle cx="24" cy="24" r="23" fill="#2563EB" />
            {/* Upward trend line */}
            <polyline points="10,34 18,26 24,30 34,16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Arrow head */}
            <path d="M30 14h6v6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Plus badge */}
            <circle cx="36" cy="34" r="6" fill="white" />
            <path d="M36 31v6M33 34h6" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),

    // 12. Free Indicators — bar chart columns growing taller with trend line
    FreeIndicators: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            {/* Bars */}
            <rect x="8" y="28" width="7" height="12" rx="1.5" fill="#93C5FD" />
            <rect x="17" y="22" width="7" height="18" rx="1.5" fill="#3B82F6" />
            <rect x="26" y="16" width="7" height="24" rx="1.5" fill="#2563EB" />
            <rect x="35" y="10" width="7" height="30" rx="1.5" fill="#1C3278" />
            {/* Trend line */}
            <polyline points="11,26 20,20 29,14 38,8" stroke="#1C3278" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Arrow tip */}
            <path d="M35 8h4v4" stroke="#1C3278" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    ),

    // 13. Forex Books — stacked books, dark blue and blue layers
    ForexBooks: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            {/* Bottom book */}
            <rect x="10" y="30" width="28" height="6" rx="1.5" fill="#1C3278" />
            <rect x="12" y="31" width="2" height="4" rx="0.5" fill="#93C5FD" />
            {/* Middle book */}
            <rect x="12" y="23" width="24" height="6" rx="1.5" fill="#3B82F6" />
            <rect x="14" y="24" width="2" height="4" rx="0.5" fill="#DBEAFE" />
            {/* Top book */}
            <rect x="11" y="16" width="26" height="6" rx="1.5" fill="#1C3278" />
            <rect x="13" y="17" width="2" height="4" rx="0.5" fill="#93C5FD" />
            {/* Bookmark ribbon */}
            <path d="M32 16v-6l2 2 2-2v6" fill="#F59E0B" />
        </svg>
    ),

    // 14. Recommended Broker — bank/institutional building with columns
    Broker: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            {/* Roof triangle */}
            <path d="M24 8L8 20h32L24 8z" fill="#1C3278" />
            {/* Roof beam */}
            <rect x="8" y="20" width="32" height="3" rx="1" fill="#2563EB" />
            {/* Columns */}
            <rect x="13" y="23" width="4" height="14" rx="1" fill="#3B82F6" />
            <rect x="22" y="23" width="4" height="14" rx="1" fill="#3B82F6" />
            <rect x="31" y="23" width="4" height="14" rx="1" fill="#3B82F6" />
            {/* Base */}
            <rect x="8" y="37" width="32" height="3" rx="1" fill="#1C3278" />
            {/* Door */}
            <rect x="20" y="30" width="8" height="7" rx="1" fill="#DBEAFE" />
        </svg>
    ),

    // 15. Mentorship Course — Video play button inside a screen
    MentorshipCourse: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-12 sm:h-12" fill="none">
            <circle cx="24" cy="24" r="23" fill="#2563EB" />
            <rect x="12" y="14" width="24" height="20" rx="3" fill="white" />
            <polygon points="20,19 20,29 29,24" fill="#2563EB" />
        </svg>
    )
};

interface AccessItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    iconBg: string;
    href: string;
    buttonStyle: "dark" | "light";
    buttonText?: string;
    onClick?: () => void;
    onTradeJournalClick?: () => void;
}

const getAccessItems = (onMentorshipClick?: () => void, onTradeJournalClick?: () => void): AccessItem[] => [
    {
        title: "VIP Signals",
        description: "Get elite trade setups & VIP signals.",
        icon: <CustomIcons.VIPSignals />,
        iconBg: "bg-transparent",
        href: "/vip-signals-group",
        buttonStyle: "dark"
    },
    {
        title: "Free Signals",
        description: "Access winning trades for free.",
        icon: <CustomIcons.FreeSignals />,
        iconBg: "bg-transparent",
        href: "https://t.me/mrpfxuniversity",
        buttonStyle: "light"
    },
    {
        title: "Mentorship Course",
        description: "Learn to trade like a professional.",
        icon: <CustomIcons.MentorshipCourse />,
        iconBg: "bg-transparent",
        href: "#",
        buttonStyle: "dark",
        onClick: onMentorshipClick
    },
    {
        title: "Account Management",
        description: "Manage multiple trading accounts in one place.",
        icon: <CustomIcons.AccountMgmt />,
        iconBg: "bg-transparent",
        href: "/account-management",
        buttonStyle: "dark"
    },
    {
        title: "Copy Trading",
        description: "Automate profitable trades from top traders.",
        icon: <CustomIcons.CopyTrading />,
        iconBg: "bg-transparent",
        href: "/copy-trading",
        buttonStyle: "dark"
    },
    {
        title: "Pass Funded Accounts",
        description: "System helps you pass prop firm challenges.",
        icon: <CustomIcons.PassFunded />,
        iconBg: "bg-transparent",
        href: "/pass-funded-accounts",
        buttonStyle: "dark"
    },
    {
        title: "VIP Bots",
        description: "Automate your trades with premium robots.",
        icon: <CustomIcons.VIPBots />,
        iconBg: "bg-transparent",
        href: "/vip-trading-bots",
        buttonStyle: "dark"
    },
    {
        title: "VIP Indicators",
        description: "Professional tools for Forex, Gold & Indices.",
        icon: <CustomIcons.PaidIndicators />,
        iconBg: "bg-transparent",
        href: "/vip-trading-indicators",
        buttonStyle: "dark"
    },
    {
        title: "Free Bots",
        description: "Use free bots for automate trading.",
        icon: <CustomIcons.FreeBots />,
        iconBg: "bg-transparent",
        href: "/free-robots",
        buttonStyle: "light"
    },
    {
        title: "Free Indicators",
        description: "Premium custom indicators + locators.",
        icon: <CustomIcons.FreeIndicators />,
        iconBg: "bg-transparent",
        href: "/free-trading-indicators",
        buttonStyle: "light"
    },
    {
        title: "Forex Books",
        description: "Improve your knowledge with our curated guides.",
        icon: <CustomIcons.ForexBooks />,
        iconBg: "bg-transparent",
        href: "/forex-books",
        buttonStyle: "light",
        buttonText: "Get Started"
    },
    {
        title: "Trade Journal",
        description: "Track and analyze your trades.",
        icon: <CustomIcons.TradeJournal />,
        iconBg: "bg-transparent",
        href: "/",
        buttonStyle: "dark",
        onClick: onTradeJournalClick
    },
    {
        title: "Risk Calculator",
        description: "Calculate exact lot size plus risk management.",
        icon: <CustomIcons.RiskCalc />,
        iconBg: "bg-transparent",
        href: "/risk-calculator",
        buttonStyle: "light"
    },
    {
        title: "Dr. Trade AI",
        description: "Level up with AI-boosted trading management.",
        icon: <CustomIcons.AITrading />,
        iconBg: "bg-transparent",
        href: "https://www.drtradepro.com",
        buttonStyle: "light"
    },
    {
        title: "Recommended Broker",
        description: "Trade with top-rated brokers and exclusive offers.",
        icon: <CustomIcons.Broker />,
        iconBg: "bg-transparent",
        href: "https://one.exnessonelink.com/a/0z72b5esoc",
        buttonStyle: "light",
        buttonText: "Get Started"
    }
];

interface AccessSectionProps {
    onMentorshipClick?: () => void;
    onTradeJournalClick?: () => void;
}

export default function AccessSection({ onMentorshipClick, onTradeJournalClick }: AccessSectionProps) {
    const accessItems = getAccessItems(onMentorshipClick, onTradeJournalClick);

    return (
        <section className="bg-[#f8f9fc] py-16 lg:py-24">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#1a1a1a]">
                        Everything You Can Access Inside Mr P Fx
                    </h2>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-6">
                    {accessItems.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-[12px] sm:rounded-[20px] p-2.5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col items-center sm:items-start h-full hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow duration-300"
                            >
                                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-4 mb-2 sm:mb-4 w-full">
                                    <div className={`flex items-center justify-center shrink-0 ${item.iconBg}`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="font-bold text-[#1a1a1a] text-[11px] max-[360px]:text-[10px] sm:text-[17px] leading-tight flex-1 text-center sm:text-left">
                                        {item.title}
                                    </h3>
                                </div>

                                <p className="text-gray-500 text-[10px] max-[360px]:text-[9px] sm:text-sm mb-3 sm:mb-6 flex-1 text-center sm:text-left sm:pr-2 leading-snug">
                                    {item.description}
                                </p>

                                <Link href={item.href} className="w-full mt-auto block" onClick={(e) => {
                                    if (item.onClick) {
                                        e.preventDefault();
                                        item.onClick();
                                    }
                                }}>
                                    <button
                                        className={`w-full py-1.5 sm:py-2.5 rounded-md sm:rounded-lg font-semibold text-[10px] max-[360px]:text-[9px] sm:text-sm transition-colors duration-200 ${item.buttonStyle === 'dark'
                                            ? 'bg-[#1e3aa0] text-white hover:bg-[#152a7a]'
                                            : 'bg-[#eef2fc] text-[#1e3aa0] hover:bg-[#dfe6f7]'
                                            }`}
                                    >
                                        {item.buttonText || "Access"}
                                    </button>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

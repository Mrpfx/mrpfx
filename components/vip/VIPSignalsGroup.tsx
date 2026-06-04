'use client';

import Link from 'next/link';

import Image from 'next/image';
import NewsletterSection from '../shared/NewsletterSection';
import { Check, X, Lock } from 'lucide-react';
import { signalsService } from '@/lib/signals';
import { useDataWithFallback } from '@/lib/hooks/useDataWithFallback';
import { Signal, TradingVideo, WCProductRead, SignalPagination } from '@/lib/types';
import { productsService } from '@/lib/products';
import { useState, useEffect, useCallback } from 'react';
import { getMediaUrl } from '@/lib/utils';
import VIPPlanModal from './VIPPlanModal';
import { getVIPSettings } from '@/app/actions/vip-settings';
import { useRouter } from 'next/navigation';
import { cartService } from '@/lib/cart';
import { useCartAuth } from '@/hooks/useCartAuth';
import { Loader2 } from 'lucide-react';


const FALLBACK_VIDEOS: TradingVideo[] = [
    {
        id: 'ZhgT9W0g3K0',
        title: 'LIVE TRADING GOLD, NASDAQ, US30, EURUSD, GBPUSD, BTCUSD',
        thumbnail: 'https://i.ytimg.com/vi/ZhgT9W0g3K0/sddefault.jpg'
    },
    {
        id: 'yPJSje5NzYg',
        title: 'My Trading Focus Moving Forward (2026)',
        thumbnail: 'https://i.ytimg.com/vi/yPJSje5NzYg/sddefault.jpg'
    },
    {
        id: 'jpVgMjM0hWE',
        title: 'A Real Day in the Life of a 28-Year-Old Day Trader in Cape Town, South Africa',
        thumbnail: 'https://i.ytimg.com/vi/jpVgMjM0hWE/sddefault.jpg'
    }
];

const FALLBACK_SIGNALS = {
    items: [
        {
            id: 101,
            title: 'EURUSD BUY Update',
            date: '2026-03-25',
            status: 'active',
            instrument: 'EURUSD',
            signal_type: 'vip',
            entry: '1.0850',
            sl: '1.0790',
            tp1: '1.0900',
            type: 'buy'
        },
        {
            id: 102,
            title: 'EURUSD BUY Update 2',
            date: '2026-03-25',
            status: 'active',
            instrument: 'EURUSD',
            signal_type: 'vip',
            entry: '1.0850',
            sl: '1.0800',
            tp1: '1.0900',
            type: 'buy'
        },
        {
            id: 103,
            title: 'EURUSD BUY Update 3',
            date: '2026-03-25',
            status: 'active',
            instrument: 'EURUSD',
            signal_type: 'vip',
            entry: '1.0850',
            sl: '1.0800',
            tp1: '1.0900',
            type: 'buy'
        }
    ],
    total: 3,
    page: 1,
    pageSize: 3
} as unknown as SignalPagination;

const VIPSignalsGroup = () => {
    const [isMobile, setIsMobile] = useState(true); // Start as true to use fallback

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { data: youtubeVideos } = useDataWithFallback(
        signalsService.getVideos,
        FALLBACK_VIDEOS,
        3
    );

    const signals = FALLBACK_SIGNALS;

    const [vipProduct, setVipProduct] = useState<WCProductRead | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [planSlugs, setPlanSlugs] = useState<{
        oneMonth: string;
        twelveMonths: string;
        unlimited: string;
    }>({ oneMonth: '', twelveMonths: '', unlimited: '' });
    const [registrationOpenDate, setRegistrationOpenDate] = useState<string | null>(null);
    const [groupPageLink, setGroupPageLink] = useState<string>('');
    const [isLocked, setIsLocked] = useState(false);
    const [unlockDate, setUnlockDate] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const { isAuthenticated, savePendingAction, getPendingAction, clearPendingAction, redirectToLogin } = useCartAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchVipProduct = async () => {
            try {
                const product = await productsService.getProductBySlug('vip-membership');
                setVipProduct(product);
            } catch (error) {
                console.error('Failed to fetch VIP product:', error);
            }
        };
        const fetchVipSettings = async () => {
            try {
                const settings = await getVIPSettings();
                setPlanSlugs({
                    oneMonth: settings.plans.oneMonth.slug,
                    twelveMonths: settings.plans.twelveMonths.slug,
                    unlimited: settings.plans.unlimited.slug,
                });
                setRegistrationOpenDate(settings.registrationOpenDate);
                setGroupPageLink(settings.groupPageLink);

                if (settings.registrationOpenDate) {
                    const target = new Date(settings.registrationOpenDate).getTime();
                    const now = new Date().getTime();
                    if (target > now) {
                        setIsLocked(true);
                        setUnlockDate(new Date(settings.registrationOpenDate).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch VIP settings:', error);
            }
        };
        fetchVipProduct();
        fetchVipSettings();
    }, []);

    useEffect(() => {
        // Execute Pending Cart Action if exists
        const pendingAction = getPendingAction();

        if (pendingAction && isAuthenticated()) {
            (async () => {
                setAddingToCart(true);
                try {
                    await cartService.addToCart(
                        pendingAction.productId,
                        pendingAction.quantity,
                        pendingAction.variationId,
                        pendingAction.customFields
                    );
                    window.dispatchEvent(new CustomEvent('open-checkout', {
                        detail: { method: 'seller' }
                    }));
                } catch (e) {
                    console.error('Failed to execute pending cart action', e);
                } finally {
                    setAddingToCart(false);
                    clearPendingAction();
                }
            })();
        }
    }, [isAuthenticated]);

    const handleAddToCart = async () => {
        // If groupPageLink is an external URL (starts with http), navigate directly
        if (groupPageLink.startsWith('http')) {
            window.location.href = groupPageLink;
            return;
        }

        // Otherwise treat as product slug
        const slug = groupPageLink || 'vip-membership';
        await handlePlanSelect(slug);
    };

    const handlePlanSelect = async (slug: string) => {
        setAddingToCart(true);
        try {
            const product = await productsService.getProductBySlug(slug);
            if (!product) throw new Error('Product not found');

            if (!isAuthenticated()) {
                savePendingAction({
                    type: 'ADD_TO_CART',
                    productId: product.id,
                    quantity: 1
                });
                redirectToLogin();
                return;
            }

            await cartService.addToCart(product.id, 1);
            window.dispatchEvent(new CustomEvent('open-checkout', {
                detail: {
                    sellerLink: product.seller_payment_link,
                    method: 'seller'
                }
            }));
        } catch (error) {
            console.error('Failed to add VIP to cart:', error);
            // Fallback to manual checkout with params if needed
            window.dispatchEvent(new CustomEvent('open-checkout', {
                detail: { method: 'seller' }
            }));
        } finally {
            setAddingToCart(false);
        }
    };

    const displayPrice = vipProduct?.price || '199';
    const regularPrice = vipProduct?.regular_price || '199';
    const hasSale = vipProduct?.sale_price && vipProduct.sale_price !== vipProduct.regular_price;

    const CheckIcon = () => (
        <svg className="w-4 h-4 text-[#eab308] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );

    const CrossIcon = () => (
        <X className="w-5 h-5 text-[#ef4444] mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
    );

    if (isLocked) {
        return (
            <div className="min-h-screen bg-[#e6e9f5] text-black font-dm-sans flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <Image
                        src="/images/vip-bg-city.jpg"
                        alt="City Background"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="relative z-10 flex flex-col items-center max-w-2xl bg-white/40 backdrop-blur-md p-8 sm:p-12 rounded-[2rem] border border-white/50 shadow-xl">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                        <Lock className="w-10 h-10 text-[#d4af37]" />
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-[#1e293b] mb-4 uppercase tracking-tighter">Registration Closed</h1>
                    <p className="text-lg sm:text-xl text-gray-600 mb-8 font-medium">
                        VIP Signals Group registration is currently closed. The next registration window will open on <strong className="text-[#1e293b]">{unlockDate}</strong>.
                    </p>
                    <Link href="/">
                        <button className="px-10 py-4 bg-gradient-to-b from-[#f3e5ab] via-[#d4af37] to-[#b8860b] text-[#1e293b] font-black rounded shadow-lg transition-all uppercase tracking-widest hover:scale-105">
                            Return Home
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const getSignalIcon = (instrument: string) => {
        if (instrument.includes('GOLD')) return '🪙';
        if (instrument.includes('EUR') || instrument.includes('GBP')) return '📈';
        if (instrument.includes('US100') || instrument.includes('NASDAQ')) return '🎫';
        return '📊';
    };

    return (
        <div className="bg-[#e6e9f5] text-black font-dm-sans overflow-hidden">
            {/* Top Background Wrapper for Hero & Benefits */}
            <div className="relative">
                {/* Background Details */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/vip-bg-city.jpg"
                            alt="City Background"
                            fill
                            priority
                            quality={60}
                            className="object-cover object-center opacity-60 mix-blend-overlay"
                        />
                    </div>
                    {/* Gradients for blending - Blue Chart Look */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b]/20 via-[#3b82f6]/10 to-[#1e293b]/30 z-0" />
                    <div className="absolute inset-0 bg-[#e8eaf6]/40 backdrop-blur-[2px] z-0" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-0" />
                </div>

                {/* Header / Hero Section */}
                <div className="relative pt-[40px] md:pt-[120px] pb-12 z-10">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        {/* Title Section - Top Aligned */}
                        <div className="mb-6 md:mb-12">
                            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-[#1e293b] mb-1 font-palanquin-dark tracking-tighter leading-tight">
                                VIP Trading Signals
                            </h1>
                            <div className="text-xl sm:text-2xl md:text-3xl text-[#2A2A72] font-semibold">
                                Private Signals Channel For Serious Traders
                            </div>
                        </div>

                        <div className="flex flex-row items-start gap-4 md:gap-12">
                            {/* Left Column Text */}
                            <div className="flex-[1.5] text-left">
                                <p className="text-[13px] sm:text-base md:text-[18px] text-[#4b5563] font-medium leading-relaxed mb-6 md:mb-10 max-w-lg">
                                    Receive <span className="font-bold text-[#1e293b]">high-probability</span> Forex & Index trade signals <span className="font-bold text-[#1e293b]">weekly</span>, with clear entry, stop loss, and <span className="font-bold text-[#1e293b]">take profit levels</span>—designed for traders who want precision, discipline, and consistent market opportunities.
                                </p>

                                <div className="flex flex-col items-start">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="relative group inline-flex items-center justify-center bg-gradient-to-b from-[#f3e5ab] via-[#d4af37] to-[#b8860b] text-[#1e293b] font-black text-[11px] sm:text-lg md:text-2xl uppercase tracking-tighter px-4 sm:px-10 py-3 sm:py-5 rounded shadow-[0_8px_20px_rgba(184,134,11,0.4)] hover:shadow-[0_12px_30px_rgba(184,134,11,0.6)] hover:-translate-y-0.5 transition-all duration-300 border border-[#b8860b]/30"
                                    >
                                        <span className="relative z-10 flex items-center gap-2 sm:gap-4">
                                            JOIN VIP SIGNALS NOW <span className="text-xl sm:text-4xl leading-none">&raquo;</span>
                                        </span>
                                    </button>
                                    <p className="text-[10px] sm:text-sm text-[#64748b] mt-3 font-bold tracking-wide">Instant access after payment.</p>
                                </div>

                            </div>

                            {/* Right Column Phone Mockup */}
                            <div className="flex-1 flex justify-end max-w-[140px] sm:max-w-[340px] lg:max-w-[420px] preserve-3d perspective-1000">
                                {/* CSS Phone Frame */}
                                <div className="relative w-full aspect-[1/2.1] bg-[#1a1a1a] rounded-[1.2rem] sm:rounded-[2.5rem] p-1.5 sm:p-3 shadow-2xl border-2 sm:border-4 border-gray-800 rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 shadow-[15px_15px_40px_rgba(0,0,0,0.5)] transition-transform duration-500">
                                    {/* Notch */}
                                    <div className="absolute top-0 inset-x-0 h-4 sm:h-6 flex justify-center z-20">
                                        <div className="w-1/3 h-[10px] sm:h-[18px] bg-[#1a1a1a] rounded-b-md sm:rounded-b-xl border-x-[1px] border-b-[1px] border-gray-700"></div>
                                    </div>

                                    {/* Screen content */}
                                    <div className="relative w-full h-full bg-[#e8eaf6] rounded-[0.9rem] sm:rounded-[2rem] overflow-hidden flex flex-col font-sans">
                                        {/* App Header */}
                                        <div className="bg-[#1e293b] px-1 sm:px-3 pt-4 sm:pt-9 pb-1 sm:pb-2 flex items-center justify-between text-white shadow-md relative z-10">
                                            <div className="flex items-center gap-1 sm:gap-1.5">
                                                <span className="text-yellow-400 font-bold text-[8px] sm:text-base mr-1">&lt; ...</span>
                                            </div>
                                            <div className="font-bold text-[6px] sm:text-[11px] tracking-widest uppercase truncate ml-1">VIP SIGNAL UPDATE</div>
                                            <div className="w-2 sm:w-4"></div>
                                        </div>

                                        {/* App Content */}
                                        <div className="flex-1 overflow-y-auto p-1.5 sm:p-4 space-y-2 sm:space-y-5 bg-gradient-to-b from-[#334155]/10 to-[#1e293b]/20 hide-scrollbar pb-3 sm:pb-6">
                                            {(!signals?.items || signals.items.length === 0) ? (
                                                <div className="bg-white/95 backdrop-blur rounded-lg sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center min-h-[100px] gap-2">
                                                    <span className="text-[10px] sm:text-[13px] font-bold text-gray-400">Loading signals...</span>
                                                </div>
                                            ) : (
                                                signals.items.map((signal: any, index: number) => (
                                                    <div key={signal.id} className="bg-white/95 backdrop-blur rounded-lg sm:rounded-2xl p-2 sm:p-5 shadow-sm border border-gray-200">
                                                        <div className="flex items-center gap-1 sm:gap-2 font-black text-[#1e293b] text-[8px] sm:text-[15px] mb-1 sm:mb-4 truncate">
                                                            <span>{getSignalIcon(signal.instrument)}</span> {signal.instrument} - <span className={signal.type?.toLowerCase() === 'buy' ? 'text-green-500' : 'text-red-500'}>{(signal.type || 'buy').toUpperCase()}</span>
                                                        </div>
                                                        <ul className="space-y-1 sm:space-y-2 text-[7px] sm:text-[13px] text-gray-800 font-bold">
                                                            <li className="flex items-center gap-1"><CheckIcon /> Entry: {signal.entry}</li>
                                                            <li className="flex items-center gap-1"><CheckIcon /> SL: {signal.sl}</li>
                                                            <li className="flex items-center gap-1"><CheckIcon /> TP1: {signal.tp1}</li>
                                                        </ul>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* WHAT YOU RECEIVE SECTION */}
                <div className="relative z-10 py-12 bg-white/30 border-y border-white/50 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8">
                        <div className="flex flex-col items-start mb-8 text-left">
                            <h2 className="text-xl sm:text-3xl font-black text-[#1e293b] uppercase tracking-tighter mb-1">
                                WHAT YOU RECEIVE
                            </h2>
                            <div className="w-12 sm:w-24 h-1 sm:h-1.5 bg-[#d4af37] rounded-full"></div>
                        </div>

                        <div className="flex flex-row gap-4 sm:gap-24 items-start">
                            {/* Benefits List */}
                            <div className="flex-[1.2] space-y-4 sm:space-y-10">
                                {[
                                    { title: "Multiple Premium Signals Weekly", desc: "Forex, Gold, NASDAQ and major markets." },
                                    { title: "Precise Entry Levels", desc: "Clear Buy/Sell zones with structured execution." },
                                    { title: "Stop Loss & Take Profit Levels", desc: "Risk-controlled setups with multiple targets." },
                                    { title: "Professional Market Analysis", desc: "Understand the reasoning behind each trade." },
                                    { title: "Private VIP Telegram Channel", desc: "Signals delivered instantly in real time." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-2 sm:gap-6 group">
                                        <div className="flex-shrink-0 w-4 h-4 sm:w-8 sm:h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform">
                                            <Check className="w-2.5 h-2.5 sm:w-5 sm:h-5 text-[#d4af37]" strokeWidth={4} />
                                        </div>
                                        <div>
                                            <h3 className="text-[12px] sm:text-xl font-bold text-[#1e293b] mb-0.5 sm:mb-1.5 leading-tight">{item.title}</h3>
                                            <p className="text-[#64748b] text-[10px] sm:text-[16px] font-medium leading-tight sm:leading-normal">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Dialogue Block (VIP Signal Update) */}
                            <div className="flex-1 flex justify-end">
                                <div className="w-full max-w-[440px] bg-white rounded-xl sm:rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
                                    {/* Card Header */}
                                    <div className="bg-[#f1f5f9] px-2 sm:px-6 py-2 sm:py-5 border-b border-gray-200 flex items-center gap-1 sm:gap-3">
                                        <span className="text-xs sm:text-2xl filter drop-shadow-sm">🔔</span>
                                        <span className="font-extrabold text-[#334155] tracking-tight text-[8px] sm:text-lg">VIP SIGNAL UPDATE</span>
                                    </div>
                                    {/* Card Content */}
                                    <div className="divide-y divide-gray-100">
                                        {(!signals?.items || signals.items.length === 0) ? (
                                            <div className="p-8 text-center bg-gray-50/50">
                                                <span className="text-sm font-bold text-gray-400">Loading signals...</span>
                                            </div>
                                        ) : (
                                            signals.items.slice(0, 2).map((signal: any, index: number) => (
                                                <div key={signal.id} className="p-2 sm:p-8 hover:bg-slate-50/50 transition-colors">
                                                    <div className="flex items-center gap-1 sm:gap-2 font-black text-[#1e293b] text-[10px] sm:text-xl mb-1 sm:mb-4">
                                                        <span>{getSignalIcon(signal.instrument)}</span> {signal.instrument.split(' ')[0]} - <span className={signal.type?.toLowerCase() === 'buy' ? 'text-green-500' : 'text-red-500'}>{(signal.type || 'buy').toUpperCase()}</span>
                                                    </div>
                                                    <ul className="grid grid-cols-1 gap-y-1 sm:gap-y-3">
                                                        <li className="flex items-center text-[#4b5563] font-bold text-[8px] sm:text-base"><CheckIcon /> Entry: {signal.entry}</li>
                                                        <li className="flex items-center text-[#4b5563] font-bold text-[8px] sm:text-base"><CheckIcon /> TP 1: {signal.tp1}</li>
                                                    </ul>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End of top background wrapper */}
            </div>

            {/* HOW IT WORKS & WHY JOIN SECTION */}
            <div className="py-12 pb-16 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-xl sm:rounded-3xl shadow-xl border border-white/80 bg-white/40 backdrop-blur-sm">
                        {/* How Signals Work */}
                        <div className="p-4 sm:p-12 border-r border-gray-200">
                            <h2 className="text-[12px] sm:text-2xl font-black text-[#1e293b] uppercase tracking-tighter sm:tracking-tight mb-4 sm:mb-8">
                                HOW THE SIGNALS WORK
                            </h2>
                            <p className="text-[#64748b] mb-4 sm:mb-8 font-semibold text-[10px] sm:text-lg">Each signal includes:</p>
                            <ul className="space-y-2 sm:space-y-5">
                                {[
                                    { label: "Instrument", value: "", bold: true },
                                    { label: "Entry Price", value: "" },
                                    { label: "Stop Loss", value: "" },
                                    { label: "Take Profit Targets", value: "" }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center text-[#1e293b] font-bold text-[9px] sm:text-lg">
                                        <div className="mr-1 sm:mr-3 p-0.5"><CheckIcon /></div>
                                        {item.label}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Why Traders Join */}
                        <div className="p-4 sm:p-12">
                            <h2 className="text-[12px] sm:text-2xl font-black text-[#1e293b] uppercase tracking-tighter sm:tracking-tight mb-4 sm:mb-8">
                                WHY TRADERS JOIN
                            </h2>
                            <p className="text-[#64748b] mb-4 sm:mb-8 font-semibold text-[10px] sm:text-lg">Common mistakes:</p>
                            <ul className="space-y-2 sm:space-y-6">
                                {[
                                    "Enter trades randomly",
                                    "No risk management",
                                    "Enter too early/late",
                                    "No clear structure"
                                ].map((reason, idx) => (
                                    <li key={idx} className="flex items-center text-[#1e293b] font-bold text-[9px] sm:text-lg">
                                        <div className="mr-1 sm:mr-3 p-0.5"><CrossIcon /></div>
                                        <span className="truncate">{reason}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-16 flex flex-col items-center text-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="relative group inline-flex items-center justify-center bg-gradient-to-b from-[#f3e5ab] via-[#d4af37] to-[#b8860b] text-[#1e293b] font-black text-lg md:text-2xl uppercase tracking-widest px-10 md:px-16 py-5 rounded-md shadow-[0_15px_40px_rgba(184,134,11,0.3)] hover:shadow-[0_20px_50px_rgba(184,134,11,0.5)] transition-all duration-300 border-2 border-[#b8860b]/30 mb-12"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                JOIN VIP SIGNALS NOW <span className="text-3xl leading-none">&raquo;</span>
                            </span>
                        </button>


                        <div className="max-w-4xl p-8 bg-white/40 border border-white/60 rounded-2xl backdrop-blur-sm">
                            <p className="text-[#334155] text-base md:text-lg font-bold leading-relaxed">
                                To maintain signal quality and proper trade management, VIP access is limited. <br className="hidden md:block" />
                                Once the VIP capacity is reached, new registrations will close.
                            </p>
                        </div>
                    </div>
                </div>
            </div >

            {/* Trading Strategy / Videos Section */}
            {/* NewsLetter Section */}
            {/* <NewsletterSection /> */}

            <VIPPlanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                planSlugs={planSlugs}
                onSelectPlan={handlePlanSelect}
                isProcessing={addingToCart}
            />
        </div>
    );
};


export default VIPSignalsGroup;

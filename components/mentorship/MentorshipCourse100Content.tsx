'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { productsService } from '@/lib/products';
import { cartService } from '@/lib/cart';
import { useCartAuth } from '@/hooks/useCartAuth';
import { WCProductRead } from '@/lib/types';
import { Loader2, X } from 'lucide-react';

interface MentorshipCourse100ContentProps {
    settings: any;
}

export default function MentorshipCourse100Content({ settings }: MentorshipCourse100ContentProps) {
    const productSlug = settings?.productSlug || 'mentorship-100';
    const heroVideoUrl = settings?.heroVideoUrl || '';
    const router = useRouter();
    const [product, setProduct] = useState<WCProductRead | null>(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, savePendingAction, getPendingAction, clearPendingAction, redirectToLogin } = useCartAuth();
    const [addingToCart, setAddingToCart] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const getYoutubeEmbedUrl = (url: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
            /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
            /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
        ];
        for (const p of patterns) {
            const match = url.match(p);
            if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
        }
        return null;
    };

    const handleHeroClick = () => {
        if (heroVideoUrl) {
            const embedUrl = getYoutubeEmbedUrl(heroVideoUrl);
            if (embedUrl) {
                setShowVideoModal(true);
            } else {
                window.open(heroVideoUrl, '_blank');
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productData = await productsService.getProductBySlug(productSlug);
                setProduct(productData);
            } catch (error) {
                console.error('Failed to fetch mentorship data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [productSlug]);

    useEffect(() => {
        const pendingAction = getPendingAction();
        if (pendingAction && product && product.id === pendingAction.productId && isAuthenticated()) {
            (async () => {
                try {
                    await cartService.addToCart(
                        pendingAction.productId,
                        pendingAction.quantity,
                        pendingAction.variationId,
                        pendingAction.customFields
                    );
                    window.dispatchEvent(new CustomEvent('open-checkout'));
                } catch (e) {
                    console.error('Failed to execute pending action', e);
                } finally {
                    clearPendingAction();
                }
            })();
        }
    }, [product, isAuthenticated, getPendingAction, clearPendingAction]);

    const handleAddToCart = async () => {
        if (!product) return;

        if (!isAuthenticated()) {
            savePendingAction({
                type: 'ADD_TO_CART',
                productId: product.id,
                quantity: 1
            });
            redirectToLogin();
            return;
        }

        setAddingToCart(true);
        try {
            await cartService.addToCart(product.id, 1);
            window.dispatchEvent(new CustomEvent('open-checkout'));
        } catch (error) {
            console.error('Failed to add to cart:', error);
            window.dispatchEvent(new CustomEvent('open-checkout'));
        } finally {
            setAddingToCart(false);
        }
    };

    const displayPrice = product?.sale_price || '399';
    const regularPrice = product?.regular_price || '1,000';
    const hasSale = product?.sale_price && product.sale_price !== product.regular_price;

    const heroTitle1 = settings?.heroTitle1 || 'Live One-On-One';
    const heroTitle2 = settings?.heroTitle2 || 'Trading Mentorship';
    const heroSubtitle = settings?.heroSubtitle || 'With Mr P';
    const heroImage = settings?.heroImage || '/images/home/trading_mentor_preview.png';
    const courseDateText = settings?.courseDateText || 'March 2nd – 10th, 2026';
    const heroDescription = settings?.heroDescription || 'During this program, Mr P will personally teach <strong class="text-[#F8CD5C]">LIVE</strong> through Zoom, guiding you step-by-step through <strong class="text-white">real market execution</strong> and advanced chart mastery.';
    const pinnedNote = settings?.pinnedNote || 'All classes will be recorded and sent to the <strong class="text-white underline decoration-[#D4AF37]/50">private group</strong> after each session in case you miss any live class.';
    const primaryCtaText = settings?.primaryCtaText || 'RESERVE YOUR SEAT NOW';
    const secondaryCtaText = settings?.secondaryCtaText || 'JOIN NOW – LIMITED SPOTS!';
    const secondaryCtaLink = settings?.secondaryCtaLink || '';
    const limitedAdmissionTitle = settings?.limitedAdmissionTitle || 'Limited Admission';
    const limitedAdmissionPoints = settings?.limitedAdmissionPoints || [
        'To maintain real interaction during the Zoom sessions, <strong class="text-[#F8CD5C] drop-shadow-sm font-bold">only 100 TRADERS</strong> will be accepted into this mentorship program.',
        'Once the seats are filled, registration will permanently close.'
    ];
    const whatYouWillLearnTitle = settings?.whatYouWillLearnTitle || 'What You Will Learn';
    const whatYouWillLearnPoints = settings?.whatYouWillLearnPoints || [
        'Full basics and foundations of Forex trading and Indices',
        'Complete intermediate-level trading systems',
        'Extremely advanced-level trading execution',
        'Real-time LIVE trading practice',
        'Advanced market structure analysis',
        'Prop firm challenge strategies',
        'Mentorship competition analysis',
        'Funding opportunity up to $10,000',
        'Private LIVE trading with Mr P'
    ];
    const transformationText1 = settings?.transformationText1 || 'This Is <span class="text-[#D4AF37] italic font-serif">Not a Normal Forex Class</span> &mdash;';
    const transformationText2 = settings?.transformationText2 || 'This is a <span class="text-[#D4AF37] italic font-serif">Trading Transformation</span>';
    const detailsTitle = settings?.detailsTitle || 'Registration Details';
    const detailsDateRange = settings?.detailsDateRange || 'March 2nd-10th';
    const detailsInclusions = settings?.detailsInclusions || [
        '12 months VIP group',
        'Access to VIP tools',
        'Private live sessions',
        'Recorded classes'
    ];
    const bottomCtaText = settings?.bottomCtaText || 'JOIN NOW – LIMITED!';

    return (
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            {/* Hero Layout Grid */}
            <div className="grid grid-cols-[1fr_150px] sm:grid-cols-[1fr_220px] lg:grid-cols-[1.2fr_1fr] gap-x-4 sm:gap-x-12 lg:gap-x-16 gap-y-6 sm:gap-y-8 items-start w-full">

                {/* 1. Hero Titles */}
                <div className="col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-1 w-full">
                    <div className="inline-flex items-center gap-1 sm:gap-2 border border-[#B68C36]/30 bg-[#2A1C0F]/50 px-2 sm:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-sm mb-4">
                        <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="20" x2="12" y2="10"></line>
                            <line x1="18" y1="20" x2="18" y2="4"></line>
                            <line x1="6" y1="20" x2="6" y2="16"></line>
                        </svg>
                        <span className="text-white text-[10px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-widest uppercase">
                            Mentorship Course <span className="text-[#D4AF37]">100</span>
                        </span>
                    </div>

                    <div className="space-y-0.5 sm:space-y-2">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-tight sm:leading-[1.1] tracking-tight">
                            {heroTitle1}
                        </h1>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] italic text-[#D4AF37] font-serif leading-tight sm:leading-[1.1] tracking-tight">
                            {heroTitle2}
                        </h2>
                        <div className="flex items-center gap-2 sm:gap-4 mt-1 lg:mt-3">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/50 max-w-[60px] sm:max-w-[100px]"></div>
                            <h3 className="text-base sm:text-2xl md:text-3xl text-gray-300 font-light tracking-wide whitespace-nowrap">
                                {heroSubtitle}
                            </h3>
                            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/50 max-w-[60px] sm:max-w-[100px]"></div>
                        </div>
                    </div>
                </div>

                {/* 2. Hero Content (Date & Description) */}
                <div className="col-span-1 lg:col-span-1 lg:col-start-1 lg:row-start-2 w-full space-y-4 sm:space-y-8 lg:mt-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#2A1C0F] rounded-lg flex items-center justify-center border border-[#D4AF37]/30 shadow-lg">
                            <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#D4AF37] text-[10px] sm:text-xs font-bold uppercase tracking-wider">Course Duration</span>
                            <span className="text-[#EBEBEB] font-bold text-sm sm:text-lg md:text-2xl">
                                {courseDateText}
                            </span>
                        </div>
                    </div>

                    <div>
                        <p className="text-gray-300 leading-snug sm:leading-relaxed text-[13px] sm:text-lg font-medium max-w-xl" dangerouslySetInnerHTML={{ __html: heroDescription }} />
                    </div>
                </div>

                {/* 3. Hero Video/Image */}
                <div className="col-span-1 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:row-span-3 relative w-full lg:-mt-[-90px]">
                    <div
                        onClick={handleHeroClick}
                        className="relative aspect-[4/5] sm:aspect-[4/3] w-full group cursor-pointer overflow-hidden rounded-lg sm:rounded-none"
                    >
                        <div className="absolute inset-0 rounded-lg sm:rounded-none shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] z-10 pointer-events-none"></div>

                        <Image
                            src={heroImage}
                            alt="Mentorship Video Preview"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-lighten opacity-95"
                        />

                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="w-12 h-12 sm:w-24 sm:h-24 bg-gradient-to-br from-[#FFDE55] to-[#B68C36] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.6)] group-hover:scale-110 transition-all duration-300">
                                <svg className="w-6 h-6 sm:w-10 sm:h-10 ml-1.5 sm:ml-3" viewBox="0 0 24 24" fill="#110905">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                            </div>
                        </div>

                        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#110905] to-transparent z-10"></div>
                        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#110905] to-transparent z-10"></div>
                        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#110905] to-transparent z-10"></div>
                        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#110905] to-transparent z-10"></div>
                    </div>
                </div>

                {/* 4. Pinned Note */}
                <div className="col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-3 w-full lg:mt-4">
                    <div className="flex gap-3 bg-[#1A110A]/80 p-3 sm:p-5 rounded-xl border border-[#D4AF37]/20 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="mt-0.5 shrink-0">
                            <div className="p-1 sm:p-1.5 bg-[#D4AF37]/10 rounded-full">
                                <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="#D4AF37" stroke="none">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3" fill="#110905"></circle>
                                </svg>
                            </div>
                        </div>
                        <p className="text-[11px] sm:text-[16px] text-gray-200 leading-snug sm:leading-relaxed font-semibold" dangerouslySetInnerHTML={{ __html: pinnedNote }} />
                    </div>
                </div>
            </div>

            {/* Bottom Buttons Row */}
            <div className="mt-8 sm:mt-16 flex flex-col items-center gap-4">
                <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || loading}
                    className="w-full max-w-[340px] sm:max-w-md relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] via-[#FFDF73] to-[#B68C36] rounded-md blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative w-full bg-gradient-to-r from-[#E6B94A] via-[#F8CD5C] to-[#D6AB40] hover:from-[#F0C55A] hover:to-[#E0B54A] text-[#110905] font-black text-sm sm:text-xl py-4 sm:py-5 px-6 rounded shadow-xl flex items-center justify-center gap-2 border-b-4 border-[#A37B24] transition-all transform active:translate-y-1 active:border-b-0 uppercase tracking-widest">
                        {addingToCart ? <Loader2 className="w-6 h-6 animate-spin" /> : primaryCtaText}
                        {!addingToCart && <svg className="w-5 h-5 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>}
                    </div>
                </button>

                <button
                    onClick={secondaryCtaLink ? () => window.open(secondaryCtaLink, '_blank') : handleAddToCart}
                    disabled={addingToCart || loading}
                    className="flex items-center gap-2 text-[#D4AF37] hover:text-[#F8CD5C] transition-colors font-bold text-xs sm:text-lg uppercase tracking-widest group"
                >
                    <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    <span className="border-b-2 border-transparent group-hover:border-[#F8CD5C]">{secondaryCtaText}</span>
                </button>
            </div>

            {/* Limited Admission Section */}
            <div className="mt-12 sm:mt-16 md:mt-24 w-full bg-[#1A110A]/40 p-4 sm:p-8 rounded-2xl border border-[#D4AF37]/10 backdrop-blur-sm shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] rounded-full"></div>
                <h3 className="text-[#D4AF37] text-xl sm:text-2xl md:text-3xl font-bold mb-6 border-b border-[#D4AF37]/20 pb-4 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                    {limitedAdmissionTitle}
                </h3>

                <ul className="space-y-4 md:space-y-6 text-gray-300 text-[14px] sm:text-[18px] md:text-xl font-medium">
                    {limitedAdmissionPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 sm:gap-4 transition-transform hover:translate-x-1 duration-300">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <p className="leading-tight sm:leading-relaxed" dangerouslySetInnerHTML={{ __html: point }} />
                        </li>
                    ))}
                </ul>
            </div>

            {/* What You Will Learn Section */}
            <div className="mt-8 md:mt-24 w-full">
                <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
                    <h3 className="text-[#D4AF37] text-lg sm:text-3xl font-bold whitespace-nowrap">
                        {whatYouWillLearnTitle}
                    </h3>
                    <div className="h-[1px] w-full max-w-sm bg-gradient-to-r from-[#D4AF37]/50 to-transparent"></div>
                </div>

                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                    <div className="absolute inset-0 bg-[#EBEBEB] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-5 border-t border-white/20 pointer-events-none"></div>

                    <div className="relative z-10 bg-[#251A10]/40 backdrop-blur-sm flex flex-row min-h-[200px] sm:min-h-[400px]">
                        <div className="p-3 sm:p-10 flex-[1.5]">
                            <ul className="grid grid-cols-1 sm:grid-cols-1 gap-2 sm:gap-5 text-[10px] sm:text-lg text-gray-200">
                                {whatYouWillLearnPoints.map((point: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-1.5 sm:gap-4 group">
                                        <div className="mt-1 sm:mt-2.5 shrink-0 flex items-center justify-center w-2 h-2 sm:w-3 sm:h-3">
                                            <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#1A110A] border-[1px] sm:border-2 border-gray-400 group-hover:border-[#D4AF37]"></div>
                                        </div>
                                        <p className="leading-tight sm:leading-relaxed truncate sm:whitespace-normal" dangerouslySetInnerHTML={{ __html: point }} />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex-1 relative shrink-0">
                            <div className="absolute inset-y-0 left-0 w-8 sm:w-24 bg-gradient-to-r from-[#241a10] to-transparent z-10 pointer-events-none" />
                            <Image
                                src="/images/home/trader_looking_at_monitors.png"
                                alt="Trader studying charts"
                                fill
                                className="object-cover object-left opacity-80 mix-blend-lighten"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transformation Banner */}
            <div className="mt-16 md:mt-24 w-full flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl lg:text-4xl text-white font-semibold" dangerouslySetInnerHTML={{ __html: transformationText1 }} />
                <h3 className="text-2xl md:text-3xl lg:text-4xl text-white font-semibold mt-1 md:mt-0" dangerouslySetInnerHTML={{ __html: transformationText2 }} />
            </div>

            {/* Registration Details Section */}
            <div className="mt-12 md:mt-24 w-full mb-16">
                <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-10 w-full mx-auto max-w-2xl px-2">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
                    <h3 className="text-[#EBEBEB] text-sm sm:text-3xl font-bold tracking-wide whitespace-nowrap">
                        {detailsTitle}
                    </h3>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
                </div>

                <div className="relative rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-white/10 mx-auto max-w-4xl">
                    <div className="absolute inset-0 bg-[#EBEBEB] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent opacity-10 pointer-events-none border-t border-white/20"></div>

                    <div className="relative z-10 p-4 sm:p-10 bg-[#251A10]/60 backdrop-blur-md">
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-12 text-[9px] sm:text-base text-gray-200">
                            {/* Left Column: Key Details */}
                            <div className="space-y-3 sm:space-y-6">
                                <div className="flex items-center gap-2 sm:gap-4 border-b border-white/10 pb-2 sm:pb-4">
                                    <div className="text-[#D4AF37] p-1 sm:p-2 bg-[#1A110A] rounded shrink-0">
                                        <svg className="w-3 h-3 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    </div>
                                    <div>
                                        <span className="font-bold text-white block sm:inline">Fee:</span>
                                        <span className="font-bold text-base sm:text-2xl text-[#D4AF37]">
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin inline ml-1" /> : `$${displayPrice}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-4 border-b border-white/10 pb-2 sm:pb-4">
                                    <div className="text-[#D4AF37] p-1 sm:p-2 bg-[#1A110A] rounded shrink-0">
                                        <svg className="w-3 h-3 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    </div>
                                    <div>
                                        <span className="font-bold text-white block sm:inline">Date:</span>
                                        <span className="truncate block">{detailsDateRange}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Inclusions */}
                            <div className="space-y-3 sm:space-y-5 sm:pl-6 sm:border-l border-white/10">
                                {detailsInclusions.map((point: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="bg-[#2ECC71] text-[#110905] rounded-sm p-0.5 shrink-0">
                                            <svg className="w-2.5 h-2.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <p className="leading-snug truncate" dangerouslySetInnerHTML={{ __html: point }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-8 sm:mt-12 flex justify-center w-full max-w-md mx-auto px-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={addingToCart || loading}
                        className="w-full relative group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] via-[#FFDF73] to-[#B68C36] rounded-md blur opacity-20 group-hover:opacity-40"></div>
                        <div className="relative w-full bg-gradient-to-r from-[#E6B94A] via-[#F8CD5C] to-[#D6AB40] hover:from-[#F0C55A] hover:to-[#E0B54A] text-[#110905] font-black text-xs sm:text-lg py-3 sm:py-4 px-4 sm:px-6 rounded shadow-xl flex items-center justify-center gap-2 border-b-2 sm:border-b-4 border-[#A37B24] uppercase tracking-wide">
                            {addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : bottomCtaText}
                            {!addingToCart && <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>}
                        </div>
                    </button>
                </div>
            </div>

            {/* Video Modal */}
            {showVideoModal && heroVideoUrl && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
                    onClick={() => setShowVideoModal(false)}
                >
                    <div
                        className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowVideoModal(false)}
                            className="absolute -top-10 right-0 z-30 text-white/80 hover:text-white transition-colors p-1"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <iframe
                            src={getYoutubeEmbedUrl(heroVideoUrl)!}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

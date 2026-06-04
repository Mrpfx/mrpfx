"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ShieldCheck, PlayCircle, MapPin, X, ArrowRight, Loader2 } from 'lucide-react';
import { productsService } from '@/lib/products';
import { cartService } from '@/lib/cart';
import { getPhysicalClassesSettings } from '@/app/actions/physical-classes-settings';
import { useCartAuth } from '@/hooks/useCartAuth';

export default function PhysicalClassesPage() {
    const [selectedPackage, setSelectedPackage] = useState<'standard' | 'private' | null>(null);
    const [showFloorPopup, setShowFloorPopup] = useState<'Abuja' | 'Lagos' | null>(null);
    const [showGuideText, setShowGuideText] = useState(false);
    const [addingToCart, setAddingToCart] = useState<'standard' | 'private' | null>(null);
    const [settings, setSettings] = useState<{ classASlug: string, classBSlug: string } | null>(null);
    const floorsRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated, savePendingAction, getPendingAction, clearPendingAction, redirectToLogin } = useCartAuth();

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await getPhysicalClassesSettings();
            setSettings(data);
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const checkPendingAction = async () => {
            const pendingAction = getPendingAction();
            if (pendingAction && isAuthenticated()) {
                // If we have a pending action, it means they just logged in after clicking enroll
                // We need to find which package they were trying to enroll in based on the product ID
                // But it's easier to just let them click it again or we can re-execute if we had the slug
                // For now, let's just clear it and if they click again it works.
                // Alternatively, if we know the product ID matches one of our slugs...
                if (settings) {
                    const classA = await productsService.getProductBySlug(settings.classASlug);
                    const classB = await productsService.getProductBySlug(settings.classBSlug);

                    if (pendingAction.productId === classA.id) {
                        handleEnroll('standard', true);
                    } else if (pendingAction.productId === classB.id) {
                        handleEnroll('private', true);
                    }
                }
                clearPendingAction();
            }
        };
        if (settings) checkPendingAction();
    }, [settings, isAuthenticated]);

    const handleEnroll = async (pkg: 'standard' | 'private', skipAuthCheck = false) => {
        if (!settings) return;

        const slug = pkg === 'standard' ? settings.classASlug : settings.classBSlug;

        try {
            setAddingToCart(pkg);
            const product = await productsService.getProductBySlug(slug);

            if (!skipAuthCheck && !isAuthenticated()) {
                savePendingAction({
                    type: 'ADD_TO_CART',
                    productId: product.id,
                    quantity: 1
                });
                redirectToLogin();
                return;
            }

            await cartService.addToCart(product.id, 1);

            // If they are on the popup, we open the checkout directly.
            // If they are not (clicked from main cards), we scroll to floors first.
            if (showFloorPopup) {
                window.dispatchEvent(new CustomEvent('open-checkout'));
            } else {
                scrollToFloors(pkg);
            }
        } catch (error) {
            console.error('Enrollment failed:', error);
        } finally {
            setAddingToCart(null);
        }
    };

    const features = [
        "Beginner \u2192 Advanced Curriculum",
        "Intensive One Month Program",
        "Live Trading Experience",
        "Access to Premium Video Course",
        "Students Private Community",
        "Prop Firm Challenge Preparation",
        "Earn a professional trading certificate"
    ];

    const scrollToFloors = (pkg: 'standard' | 'private') => {
        setSelectedPackage(pkg);
        setShowGuideText(true);
        floorsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const packageDetails = {
        standard: { name: 'Physical Class Mentorship', price: '₦200,000' },
        private: { name: 'Private Physical Class Mentorship', price: '₦300,000' }
    };

    const floorDetails = {
        Abuja: {
            address: "Suite B5, no. 1 Omotayo Eremiye Crescent, Arab Road, Abuja",
            map: "https://maps.google.com/?q=Arab+Road+Abuja"
        },
        Lagos: {
            address: "(The Place Restaurant) Ikota KM 14, Lekki-Epe Expressway, Lagos, Eti-Osa, Lekki 105101, Lagos, Nigeria",
            map: "https://maps.google.com/?q=The+Place+Restaurant+Ikota+Lekki"
        }
    };

    return (
        <div className="min-h-screen font-sans font-dm-sans bg-[#EFF3F9] relative overflow-hidden flex flex-col items-left">

            {/* Global Page Background Effect */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 w-full h-[800px] bg-gradient-to-b from-[#D4DCF1] via-[#E4EAF5] to-transparent opacity-80" />
                <div className="absolute top-[30%] left-[-10%] w-[600px] h-[600px] bg-blue-300/20 blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />
                <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-indigo-300/20 blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
            </div>

            {/* Hero Section */}
            <div className="relative w-full overflow-hidden pt-28 pb-4 md:pt-36 md:pb-12 z-10 flex flex-col justify-left min-h-[500px] md:min-h-[650px]">
                {/* Hero Top Texture / Image */}
                <div className="absolute top-0 inset-x-0 h-full z-0 overflow-hidden">
                    <Image
                        src="/images/home/physical_class_mentorship_hero.png"
                        alt="Real Trading Floor"
                        fill
                        className="object-cover object-[80%_top] md:object-right"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#EFF3F9]/95 via-[#EFF3F9]/60 to-transparent w-full md:w-[70%]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#EFF3F9]/30 to-[#EFF3F9]" />
                </div>

                <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 md:gap-16 items-start mt-[-60px] md:mt-0">
                    <div className="flex-1 max-w-2xl text-left">
                        <h1 className="text-[32px] md:text-[52px] lg:text-[64px] font-bold text-[#141E46] leading-[1.1] tracking-tight mb-4 md:mb-6 font-palanquin-dark drop-shadow-sm">
                            <span className="opacity-90">Trade Like a Professional</span><br />
                            <span className="text-[#1A255C] font-black">on a Real Trading Floor</span>
                        </h1>

                        <p className="text-[#3B4A6B] text-[14px] md:text-[18px] leading-relaxed mb-4 md:mb-6 max-w-xl font-medium">
                            Join our <strong className="text-[#141E46] font-bold">1-Month Intensive Physical Trading Program</strong> and learn Forex and <strong className="text-[#141E46] font-bold">Synthetic Indices</strong> directly from <strong className="text-[#141E46] font-bold">professional traders.</strong>
                        </p>

                        <p className="text-[#516182] text-[13px] md:text-[17px] mb-6 md:mb-8 font-medium">
                            From <strong className="text-[#141E46]">Beginner</strong> to <strong className="text-[#141E46]">Masterclass level</strong><br />
                            with real market execution.
                        </p>

                        <button
                            onClick={() => floorsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            className="relative group overflow-hidden bg-gradient-to-r from-[#B9812A] via-[#E2B75A] to-[#B9812A] text-white font-bold py-3 md:py-4 px-8 md:px-10 rounded-xl shadow-[0_10px_30px_rgba(185,129,42,0.4)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 w-fit"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                            <span className="relative z-10 tracking-widest uppercase text-[13px] md:text-[15px] drop-shadow-md">Reserve Your Seat Now</span>
                        </button>
                    </div>

                    <div className="h-[280px] md:h-[400px] w-full flex-1"></div>
                </div>
            </div>

            {/* Pricing / Packages Section */}
            <div className="relative z-20 w-full max-w-6xl mx-auto px-2 md:px-6 lg:px-8 mt-[-20px] md:-mt-12 mb-6 md:mb-16 flex flex-row gap-2 md:gap-8 items-stretch justify-center">

                {/* Regular Physical Mentorship (Left Card) */}
                <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white rounded-[1rem] md:rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col min-w-0">
                    <div className="p-3 md:p-10 flex flex-col h-full bg-gradient-to-b from-white/90 to-transparent">
                        <div className="mb-3 md:mb-6">
                            <h3 className="text-[#2B3563] text-[13px] md:text-2xl font-bold mb-1 md:mb-3 tracking-tight leading-tight">Physical Class Mentorship</h3>
                            <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-3 flex-wrap">
                                <span className="text-[17px] md:text-3xl text-[#B9812A] font-black drop-shadow-sm leading-none">₦200,000 / $150</span>
                                <span className="text-[#64748B] text-[9px] md:text-[13px] font-semibold tracking-wide">(All charges included)</span>
                            </div>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-gray-200 via-gray-300 to-transparent mb-3 md:mb-6"></div>

                        <h4 className="text-[#1A255C] text-[11px] md:text-lg font-bold mb-2 md:mb-4 tracking-wide">Topics Covered</h4>

                        <ul className="space-y-2 md:space-y-4 mb-4 md:mb-8 flex-1">
                            <li className="flex items-start gap-1 md:gap-4">
                                <div className="mt-[2px] md:mt-1 bg-gray-100 p-[1px] md:p-0.5 rounded-full shrink-0">
                                    <svg className="w-2 md:w-3.5 h-2 md:h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </div>
                                <span className="text-gray-400 line-through decoration-gray-300 text-[9px] md:text-[15px] leading-tight">Exclusive one-on-one sessions</span>
                            </li>
                            {features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-1 md:gap-3">
                                    <div className="mt-[2px] md:mt-1 shrink-0">
                                        <Check className="w-3 md:w-5 h-3 md:h-5 text-[#10B981] drop-shadow-sm" strokeWidth={3} />
                                    </div>
                                    <span className="text-[#3F4B66] font-medium text-[9px] md:text-[15px] leading-tight">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="space-y-1.5 md:space-y-4 bg-gray-50/80 rounded-xl md:rounded-2xl p-2 md:p-5 border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-start gap-0.5 md:gap-3">
                                <span className="font-bold text-[#1A255C] text-[9px] md:text-[14px] min-w-[90px]">Duration</span>
                                <span className="text-[#4B5563] text-[9px] md:text-[14px] leading-tight flex-1">1 month of intensive Training</span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-start gap-0.5 md:gap-3 mt-1.5">
                                <span className="font-bold text-[#1A255C] text-[9px] md:text-[14px] min-w-[90px]">Certification</span>
                                <span className="text-[#4B5563] text-[9px] md:text-[14px] leading-tight flex-1">Achieve a professional trading Certificate.</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-3 md:pt-6 border-t border-gray-100">
                            <button
                                onClick={() => handleEnroll('standard')}
                                disabled={addingToCart === 'standard'}
                                className="w-full relative group overflow-hidden bg-[#1E3A8A] hover:bg-[#1A255C] text-white font-bold py-2 md:py-4 rounded-lg md:rounded-xl shadow-md transition-all duration-300 flex items-center justify-center"
                            >
                                {addingToCart === 'standard' ? (
                                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                                ) : (
                                    <span className="relative z-10 tracking-wider text-[8px] md:text-[14px] uppercase block truncate">ENROLL NOW</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Private Physical Mentorship (Right Card) */}
                <div className="flex-1 bg-white/70 backdrop-blur-xl border-[1.5px] border-[#A8B4E5]/50 rounded-[1rem] md:rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(42,53,99,0.12)] overflow-hidden flex flex-col relative transform md:-translate-y-4 min-w-0">
                    <div className="absolute top-0 left-0 w-full h-[4px] md:h-2 bg-gradient-to-r from-[#2B3563] to-[#4F62A3]"></div>

                    <div className="p-3 md:p-10 flex flex-col h-full bg-gradient-to-bl from-indigo-50/50 to-transparent">
                        <div className="mb-3 md:mb-6">
                            <h3 className="text-[#1E293B] text-[13px] md:text-2xl font-bold mb-1 md:mb-3 tracking-tight leading-tight">Private Physical Mentorship</h3>
                            <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 md:gap-3">
                                <span className="text-[17px] md:text-3xl text-[#059669] font-black drop-shadow-sm leading-none">₦300,000 / $220</span>
                            </div>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-[#CBD5E1] via-[#E2E8F0] to-transparent mb-3 md:mb-6"></div>

                        <h4 className="text-[#1E293B] text-[11px] md:text-lg font-bold mb-2 md:mb-4 tracking-wide">Features</h4>

                        <ul className="space-y-2 md:space-y-4 mb-4 md:mb-10 flex-1">
                            <li className="flex items-start gap-1 md:gap-3 bg-gradient-to-r from-emerald-50 to-transparent p-1.5 md:p-2.5 -mx-1.5 md:-mx-2.5 rounded-lg border-l-2 md:border-l-4 border-[#10B981]">
                                <div className="mt-[1px] md:mt-0.5 shrink-0">
                                    <Check className="w-3 md:w-5 h-3 md:h-5 text-[#10B981]" strokeWidth={3} />
                                </div>
                                <span className="text-[#065F46] font-bold text-[9px] md:text-[15px] leading-tight">Exclusive one-on-one sessions</span>
                            </li>
                            {features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-1 md:gap-3 pl-1 md:pl-1.5">
                                    <div className="mt-[2px] md:mt-1 shrink-0">
                                        <Check className="w-2.5 md:w-4 h-2.5 md:h-4 text-[#10B981] opacity-80" strokeWidth={3} />
                                    </div>
                                    <span className="text-[#3F4B66] font-medium text-[9px] md:text-[15px] leading-tight">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto">
                            <button
                                onClick={() => handleEnroll('private')}
                                disabled={addingToCart === 'private'}
                                className="w-full relative group overflow-hidden bg-gradient-to-r from-[#B9812A] via-[#E2B75A] to-[#B9812A] text-[#111] font-bold py-2 md:py-4 rounded-lg md:rounded-xl shadow-[0_10px_25px_rgba(185,129,42,0.3)] transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                {addingToCart === 'private' ? (
                                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                                ) : (
                                    <span className="relative z-10 tracking-wider text-[8px] md:text-[14px] uppercase drop-shadow-sm block truncate px-1">ENROLL NOW</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Info Section */}
            <div ref={floorsRef} className="relative z-20 w-full max-w-6xl mx-auto px-4 md:px-8 pb-16 md:pb-24">

                {/* TOP ROW: Locations & Certificate */}
                <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.1fr] gap-8 md:gap-12 items-stretch mb-12 md:mb-20">

                    {/* Left Column: Locations */}
                    <div className="flex flex-col justify-center py-4 md:py-8">
                        {showGuideText && (
                            <div className="mb-6 animate-bounce">
                                <div className="bg-[#1A255C] text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 w-fit">
                                    <ArrowRight className="w-5 h-5 text-[#B9812A] rotate-90" />
                                    <span className="font-bold text-sm md:text-base">Please select one of the two locations below to continue</span>
                                </div>
                            </div>
                        )}
                        <h3 className="text-[#1A255C] text-2xl md:text-3xl font-bold mb-3 tracking-tight leading-tight">Select Your Trading Floor</h3>
                        <p className="text-[#4B5563] text-[15px] md:text-[17px] mb-8 font-medium">Select the location closest to you:</p>

                        <div className="flex flex-row gap-4 md:gap-6 mb-10">
                            {/* Abuja */}
                            <div
                                onClick={() => setShowFloorPopup('Abuja')}
                                className="relative flex-1 aspect-[1.6/1] rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer shadow-lg border-2 border-transparent hover:border-[#1A255C] transition-all duration-300"
                            >
                                <Image src="/images/mentorship/abuja_physical.jpg" alt="Abuja" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#141E46]/90 via-[#141E46]/40 to-transparent"></div>
                                <div className="absolute bottom-4 left-5 text-white font-bold text-lg md:text-xl flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-[#D4AF37]" /> Abuja
                                </div>
                            </div>
                            {/* Lagos */}
                            <div
                                onClick={() => setShowFloorPopup('Lagos')}
                                className="relative flex-1 aspect-[1.6/1] rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer shadow-lg border-2 border-transparent hover:border-[#1A255C] transition-all duration-300"
                            >
                                <Image src="/images/mentorship/lagos_physical.jpg" alt="Lagos" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#141E46]/90 via-[#141E46]/40 to-transparent"></div>
                                <div className="absolute bottom-4 left-5 text-white font-bold text-lg md:text-xl flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-[#D4AF37]" /> Lagos
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/50 backdrop-blur-sm border border-[#A8B4E5]/30 rounded-2xl p-6 md:p-8">
                            <h4 className="text-[#1A255C] text-lg md:text-xl font-bold mb-3 tracking-tight">Important Information</h4>
                            <p className="text-[#4B5563] text-[14px] md:text-[16px] leading-relaxed mb-4">
                                Please choose a Trading Floor closest to your location for better learning experience.
                            </p>
                            <p className="text-[#4B5563] text-[14px] md:text-[16px] leading-relaxed">
                                If you cannot attend physically, you may enroll in the{' '}
                                <Link href="/mentorship-course" className="text-[#10B981] font-bold hover:text-[#059669] hover:underline decoration-2 underline-offset-4 transition-colors">
                                    Online Mentorship Program
                                </Link>
                                {' '}instead.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Certificate */}
                    <div className="relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white min-h-[400px] flex items-center justify-center p-6 md:p-12">
                        <Image
                            src="/images/mentorship/cityscape_night_bg.png"
                            alt="Cityscape Night"
                            fill
                            className="object-cover opacity-100"
                        />
                        <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent"></div>

                        <div className="relative w-full max-w-[420px] aspect-[1.414/1] bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-1 transform rotate-1 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                            <div className="absolute inset-2 border-[1px] border-[#D4AF37]/60 pointer-events-none"></div>

                            <div className="w-full h-full flex flex-col items-center justify-between py-6 px-4 text-center">
                                <div className="absolute top-4 right-6 w-16 h-16 opacity-10 pointer-events-none grayscale">
                                    <Image src="/assets/home/mrpfxlogo.png" alt="Logo Watermark" fill className="object-contain" />
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="relative w-8 h-8">
                                            <Image src="/assets/home/mrpfxlogo.png" alt="Logo" fill className="object-contain" />
                                        </div>
                                        <span className="text-[#1A255C] font-black text-sm tracking-tighter">MRPFX</span>
                                    </div>
                                    <div className="h-px w-12 bg-[#D4AF37] mb-3"></div>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center py-2">
                                    <h5 className="font-serif text-[#1A255C] text-xl md:text-2xl font-bold tracking-widest uppercase mb-1">Masterclass Trading</h5>
                                    <p className="text-[#B9812A] text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase mb-4">Certificate of Completion</p>

                                    <div className="w-4/5 border-b border-gray-300 mb-1"></div>
                                    <p className="text-gray-400 text-[10px] md:text-[13px] italic font-medium mb-4">[Student Name]</p>

                                    <p className="text-[#4B5563] text-[9px] leading-tight max-w-[200px] opacity-80">For successfully completing the one-month intensive physical training on Forex & Synthetic Indices.</p>
                                </div>

                                <div className="w-full flex justify-between items-end px-6 md:px-10 pb-2">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 border-b border-gray-400 mb-1"></div>
                                        <p className="text-[7px] uppercase font-bold text-gray-500">Instructor</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50/50">
                                        <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 border-b border-gray-400 mb-1 text-[10px] font-serif italic text-gray-800">MRPFX</div>
                                        <p className="text-[7px] uppercase font-bold text-gray-500">Seal of Excellence</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM ROW: Enrollment CTA (Centered) */}
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto pt-8 border-t border-gray-200/50">
                    <h3 className="text-[#1A255C] text-2xl md:text-4xl font-bold mb-6 tracking-tight drop-shadow-sm leading-tight flex flex-col md:block">
                        Enroll Now <span className="text-[#1A255C]/70 font-medium md:ml-2">To Reserve Your Seat</span>
                    </h3>

                    <button
                        onClick={() => floorsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full max-w-md relative group overflow-hidden bg-gradient-to-r from-[#B9812A] via-[#E2B75A] to-[#B9812A] text-[#111] font-extrabold py-4 md:py-5 rounded-xl md:rounded-2xl shadow-[0_15px_40px_-10px_rgba(185,129,42,0.5)] transform hover:scale-[1.03] active:scale-95 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                        <span className="relative z-10 tracking-[0.1em] text-[13px] md:text-[16px] uppercase drop-shadow-sm">Enroll Now To Reserve Your Seat</span>
                    </button>
                </div>

            </div>

            {/* Trading Floor Popup Modal */}
            {showFloorPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
                        onClick={() => setShowFloorPopup(null)}
                    />

                    <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="bg-[#1A255C] p-6 md:p-8 text-white relative">
                            <button
                                onClick={() => setShowFloorPopup(null)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <MapPin className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight">{showFloorPopup} Trading Floor</h3>
                            </div>
                            <p className="text-blue-100/80 text-sm font-medium">Physical Study Center</p>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 md:p-8 space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Address</h4>
                                <p className="text-lg font-bold text-[#1A255C] leading-snug">
                                    {floorDetails[showFloorPopup].address}
                                </p>
                            </div>

                            <a
                                href={floorDetails[showFloorPopup].map}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                View on Google Maps <ArrowRight className="ml-1.5 w-4 h-4" />
                            </a>

                            <div className="h-px bg-gray-100" />

                            {selectedPackage ? (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Selected Package</p>
                                                <p className="text-lg font-bold text-[#1A255C]">{packageDetails[selectedPackage].name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price</p>
                                                <p className="text-xl font-bold text-[#B9812A]">
                                                    {selectedPackage === 'standard' ? '₦200,000 / $150' : '₦300,000 / $220'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleEnroll(selectedPackage!)}
                                        disabled={!!addingToCart}
                                        className="w-full font-bold flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all shadow-lg shadow-purple-500/25 disabled:opacity-70"
                                    >
                                        {addingToCart ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>Proceed to Secure Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowFloorPopup(null);
                                            window.scrollTo({ top: 400, behavior: 'smooth' });
                                        }}
                                        className="w-full text-sm font-bold text-gray-400 hover:text-[#1A255C] transition-colors"
                                    >
                                        Change Mentorship Package
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 text-center">
                                    <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                                        <p className="text-[#92400E] font-bold text-sm leading-relaxed">
                                            Please select a mentorship package first to proceed with your enrollment at the {showFloorPopup} center.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowFloorPopup(null);
                                            window.scrollTo({ top: 400, behavior: 'smooth' });
                                        }}
                                        className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-[#1A255C] text-[#1A255C] font-bold py-4 rounded-xl transition-all"
                                    >
                                        Select Package First <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getPrivateMentorshipSettings } from '@/app/actions/private-mentorship-settings';
import { productsService } from '@/lib/products';
import { cartService } from '@/lib/cart';
import { WCProductRead } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useCartAuth } from '@/hooks/useCartAuth';

const PrivateMentorshipPage = () => {
    const router = useRouter();
    const [selectedClassName, setSelectedClassName] = useState('Class A (10 Days)');
    const [telegramUsername, setTelegramUsername] = useState('');
    const [productA, setProductA] = useState<WCProductRead | null>(null);
    const [productB, setProductB] = useState<WCProductRead | null>(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const { isAuthenticated, savePendingAction, getPendingAction, clearPendingAction, redirectToLogin } = useCartAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const settings = await getPrivateMentorshipSettings();
                const slugA = settings?.classASlug || 'private-mentorship-class-a';
                const slugB = settings?.classBSlug || 'private-mentorship-class-b';

                const [dataA, dataB] = await Promise.all([
                    productsService.getProductBySlug(slugA),
                    productsService.getProductBySlug(slugB)
                ]);

                setProductA(dataA);
                setProductB(dataB);

                setSelectedClassName('Class A (10 Days)');
            } catch (error) {
                console.error('Failed to fetch private mentorship data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Execute Pending Cart Action if exists
        const pendingAction = getPendingAction();
        // For Private Mentorship, we need to match either class A or class B
        const relevantProduct = (productA?.id === pendingAction?.productId) ? productA : (productB?.id === pendingAction?.productId) ? productB : null;

        if (pendingAction && relevantProduct && isAuthenticated()) {
            (async () => {
                setAddingToCart(true);
                try {
                    await cartService.addToCart(
                        pendingAction.productId,
                        pendingAction.quantity,
                        pendingAction.variationId,
                        pendingAction.customFields
                    );
                    window.dispatchEvent(new CustomEvent('open-checkout'));
                } catch (e) {
                    console.error('Failed to execute pending cart action', e);
                } finally {
                    setAddingToCart(false);
                    clearPendingAction();
                }
            })();
        }
    }, [productA, productB, isAuthenticated]);

    const handleClassChange = (className: string) => {
        setSelectedClassName(className);
    };

    const handleAddToCart = async () => {
        const activeProduct = selectedClassName.includes('Class A') ? productA : productB;
        if (!activeProduct) return;

        if (!isAuthenticated()) {
            savePendingAction({
                type: 'ADD_TO_CART',
                productId: activeProduct.id,
                quantity: 1,
                customFields: {
                    'Telegram Username': telegramUsername
                }
            });
            redirectToLogin();
            return;
        }

        setAddingToCart(true);
        try {
            await cartService.addToCart(activeProduct.id, 1, undefined, {
                'Telegram Username': telegramUsername
            });
            window.dispatchEvent(new CustomEvent('open-checkout'));
        } catch (error) {
            console.error('Failed to add to cart:', error);
            window.dispatchEvent(new CustomEvent('open-checkout'));
        } finally {
            setAddingToCart(false);
        }
    };

    const activeProduct = selectedClassName.includes('Class A') ? productA : productB;
    const displayPrice = activeProduct?.sale_price || activeProduct?.price || '499.00';
    const regularPrice = activeProduct?.regular_price || '1000.00';
    const hasSale = activeProduct?.sale_price && activeProduct.sale_price !== activeProduct.regular_price;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9fe]">
                <Loader2 className="w-8 h-8 animate-spin text-[#0052cc]" />
            </div>
        );
    }

    return (
        <div className="bg-[#f8f9fe] min-h-screen font-dm-sans pb-24">

            {/* Hero Section */}
            <section className="relative w-full overflow-hidden bg-[#000a1f]">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0 bg-[#000a1f]">
                    <div className="absolute inset-0 lg:left-[25%] lg:w-[75%]">
                        <Image
                            src="/assets/home/hero-car.jpg"
                            alt="Private Mentorship Background"
                            fill
                            className="object-cover object-[85%_20%] lg:object-[center_30%] opacity-90 lg:opacity-100"
                            priority
                        />
                        {/* More intense dark overlay for mobile to make text pop */}
                        <div className="absolute inset-0 bg-black/40 lg:bg-black/10"></div>
                    </div>

                    {/* Diagonal Blue Gradient Overlay (Left side) */}
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-[#0c2f74] via-[#0c2f74] to-[#124194] hidden lg:block border-r border-[#3399ff]/20 z-[1]"
                        style={{ clipPath: 'polygon(0 0, 50% 0, 42% 100%, 0% 100%)' }}
                    >
                        {/* Subtle inner flare */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-[#3399ff]/10 to-transparent"></div>
                    </div>

                    {/* Mobile Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0c2f74]/95 via-[#0c2f74]/80 to-transparent/20 lg:hidden"></div>
                    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#000a1f] via-[#000a1f]/95 to-transparent lg:hidden"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-[160px] md:pb-24 lg:py-32 flex flex-col items-start min-h-[600px] md:min-h-[500px] lg:min-h-[600px] justify-center">

                    <h1 className="text-[42px] sm:text-4xl md:text-5xl lg:text-[64px] font-[900] text-white leading-[0.85] mb-6 max-w-2xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] font-sans tracking-tight uppercase">
                        <span className="text-[#3399ff]">PRIVATE</span> 1-ON-1<br />
                        MENTORSHIP<br />
                        <span className="text-[#3399ff]">WITH MR P</span>
                    </h1>

                    <p className="text-white text-[17px] md:text-[20px] font-medium mb-10 lg:mb-12 max-w-[300px] sm:max-w-xl opacity-100 drop-shadow-md leading-tight">
                        Learn the Deep Secrets of Trading<br />
                        Directly From a Professional Trader
                    </p>

                    <div className="space-y-3 sm:space-y-4 w-full max-w-[340px] sm:max-w-[420px]">
                        <div className="bg-[#0a1c3e]/95 border border-[#2b88ff]/30 rounded-full px-5 py-3 flex items-center gap-4 shadow-xl backdrop-blur-lg">
                            <div className="w-9 h-9 rounded-full bg-[#1b3d82] flex items-center justify-center shrink-0 border border-[#2b88ff]/20">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2b88ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                            </div>
                            <span className="text-white font-bold text-[15px] sm:text-[16px] tracking-tight">7-10 Days Video Sessions</span>
                        </div>
                        <div className="bg-[#0a1c3e]/95 border border-[#2b88ff]/30 rounded-full px-5 py-3 flex items-center gap-4 shadow-xl backdrop-blur-lg">
                            <div className="w-9 h-9 rounded-full bg-[#1b3d82] flex items-center justify-center shrink-0 border border-[#2b88ff]/20">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2b88ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                            </div>
                            <span className="text-white font-bold text-[15px] sm:text-[16px] tracking-tight">Forex & Synthetic Indices</span>
                        </div>
                        <div className="bg-[#0a1c3e]/95 border border-[#2b88ff]/30 rounded-full px-5 py-3 flex items-center gap-4 shadow-xl backdrop-blur-lg">
                            <div className="w-9 h-9 rounded-full bg-[#1b3d82] flex items-center justify-center shrink-0 border border-[#2b88ff]/20">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2b88ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                            </div>
                            <span className="text-white font-bold text-[15px] sm:text-[16px] tracking-tight">VIP Bot + VIP Indicator</span>
                        </div>
                    </div>

                    {/* Floating Badge (Desktop Right) */}
                    <div className="absolute right-4 md:right-12 bottom-[30px] md:bottom-8 lg:bottom-24 w-[115px] h-[115px] md:w-[150px] md:h-[150px] rounded-full border-2 border-[#2b88ff]/40 bg-[#0c2f74]/95 backdrop-blur-lg flex flex-col items-center justify-center text-center p-3 md:p-4 shadow-[0_0_40px_rgba(43,136,255,0.3)] z-20 hover:scale-105 transition-transform cursor-default">
                        <div className="text-[#3399ff] font-bold text-[10px] md:text-[11px] tracking-[0.25em] leading-none mb-1 md:mb-2 uppercase">LIMITED</div>
                        <div className="text-white font-[900] text-[16px] md:text-[22px] leading-tight font-sans">PRIVATE<br />SLOTS</div>
                        <div className="flex gap-1.5 mt-2.5">
                            <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#fff]"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What You Will Learn Grid */}
            <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
                <h2 className="text-center text-3xl font-bold text-[#1a1a1a] mb-8">
                    What You Will <span className="text-[#0052cc]">Learn:</span>
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-white rounded-[24px] p-6 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="text-[#0052cc] mb-4">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="18" y="3" width="4" height="18"></rect><rect x="10" y="8" width="4" height="13"></rect><rect x="2" y="13" width="4" height="8"></rect><polyline points="22 8 16 12 10 9 2 15"></polyline></svg>
                        </div>
                        <div className="font-bold text-[#1a1a1a] leading-snug">Market Behavior<br />& Patterns</div>
                    </div>
                    <div className="bg-white rounded-[24px] p-6 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="text-[#0052cc] mb-4">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line><line x1="8" y1="6" x2="8.01" y2="6"></line><line x1="16" y1="6" x2="16.01" y2="6"></line><line x1="8" y1="10" x2="8.01" y2="10"></line><line x1="16" y1="10" x2="16.01" y2="10"></line><line x1="8" y1="14" x2="8.01" y2="14"></line><line x1="16" y1="14" x2="16.01" y2="14"></line></svg>
                        </div>
                        <div className="font-bold text-[#1a1a1a] leading-snug">Institutional<br />Trading Secrets</div>
                    </div>
                    <div className="bg-white rounded-[24px] p-6 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="text-[#0052cc] mb-4">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle><line x1="6.34" y1="6.34" x2="17.66" y2="17.66"></line><line x1="17.66" y1="6.34" x2="6.34" y2="17.66"></line></svg>
                        </div>
                        <div className="font-bold text-[#1a1a1a] leading-snug">High Probability<br />Entries</div>
                    </div>
                    <div className="bg-white rounded-[24px] p-6 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="text-[#0052cc] mb-4">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </div>
                        <div className="font-bold text-[#1a1a1a] leading-snug">Chart Repetition<br />& Strategy</div>
                    </div>
                </div>
            </section>

            {/* Main Content (Curriculum & Pricing) */}
            <section className="px-4 md:px-8 pb-12">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Left: Curriculum */}
                    <div className="flex-1 bg-white rounded-[32px] p-6 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50">
                        <h3 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-8">
                            Mentorship <span className="text-[#0052cc]">Curriculum</span>
                        </h3>

                        <div className="space-y-4 mb-10">
                            {/* Class B Box */}
                            <div
                                onClick={() => handleClassChange('Class B (10 Days)')}
                                className={`border rounded-[20px] p-5 flex items-center gap-4 shadow-sm cursor-pointer transition-colors relative ${selectedClassName.includes('Class B') ? 'bg-blue-50 border-[#0052cc]' : 'bg-white border-gray-200 hover:border-[#0052cc]'}`}
                            >
                                <div className="w-12 h-12 bg-[#0052cc] rounded-xl flex items-center justify-center text-white shrink-0">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-[#1a1a1a] text-lg">Class B – 10 Days</h4>
                                    <p className="text-gray-600 text-sm">Real Deep Secrets of Retail Trading</p>
                                </div>
                                {selectedClassName.includes('Class B') && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0052cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </div>

                            {/* Class A Box */}
                            <div
                                onClick={() => handleClassChange('Class A (10 Days)')}
                                className={`border rounded-[20px] p-5 flex items-center gap-4 shadow-sm cursor-pointer transition-colors relative ${selectedClassName.includes('Class A') ? 'bg-[#fcf8e3] border-[#e6d080] shadow-[0_0_15px_rgba(230,208,128,0.3)]' : 'bg-white border-gray-200 hover:border-[#e6d080]'}`}
                            >
                                <div className="w-12 h-12 bg-[#b38b1e] rounded-xl flex items-center justify-center text-white shrink-0">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-[#b38b1e] text-lg">Class A – 10 Days</h4>
                                    <p className="text-[#8c6d18] text-sm">Institutions & Banks Pattern (Advanced)</p>
                                </div>
                                {selectedClassName.includes('Class A') && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b38b1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </div>
                        </div>

                        {/* Checkmarks Checklist */}
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4 text-[#1a1a1a] font-medium text-[15px]">
                                <div className="w-5 h-5 rounded-full bg-[#0052cc] flex items-center justify-center text-white shrink-0 shadow-sm">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                Private 1-on-1 Video Sessions
                            </li>
                            <li className="flex items-center gap-4 text-[#1a1a1a] font-medium text-[15px]">
                                <div className="w-5 h-5 rounded-full bg-[#0052cc] flex items-center justify-center text-white shrink-0 shadow-sm">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                Direct Q&A With Mr P
                            </li>
                            <li className="flex items-center gap-4 text-[#1a1a1a] font-medium text-[15px]">
                                <div className="w-5 h-5 rounded-full bg-[#0052cc] flex items-center justify-center text-white shrink-0 shadow-sm">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                VIP Bot + VIP Indicator Included
                            </li>
                            <li className="flex items-center gap-4 text-[#1a1a1a] font-medium text-[15px]">
                                <div className="w-5 h-5 rounded-full bg-[#0052cc] flex items-center justify-center text-white shrink-0 shadow-sm">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                Telegram Communication Access
                            </li>
                        </ul>
                    </div>

                    {/* Right: Pricing */}
                    <div className="w-full lg:w-[420px] shrink-0">
                        <div className="bg-white rounded-[32px] p-8 shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col items-center">
                            <h4 className="text-[17px] font-bold text-[#1a1a1a] mb-2">Mentorship for 10 Days</h4>
                            <div className="w-12 h-1 bg-[#0052cc] mb-6 rounded-full"></div>

                            <div className="text-2xl text-gray-400 line-through font-medium tracking-tight mb-1">${Number(regularPrice).toLocaleString()}</div>
                            <div className="text-[52px] font-black text-[#0052cc] tracking-tight mb-8 leading-none">${Number(displayPrice).toLocaleString()}</div>

                            <ul className="space-y-3 w-full mb-8">
                                <li className="flex items-center gap-3 text-[15px] font-medium text-[#1a1a1a] bg-[#f8f9fe] p-3 rounded-lg">
                                    <div className="w-[18px] h-[18px] rounded-full bg-[#eef2fc] flex items-center justify-center text-[#0052cc] shrink-0 border border-[#0052cc]/20"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                                    1-on-1 Private Mentorship
                                </li>
                                <li className="flex items-center gap-3 text-[15px] font-medium text-[#1a1a1a] bg-[#f8f9fe] p-3 rounded-lg">
                                    <div className="w-[18px] h-[18px] rounded-full bg-[#eef2fc] flex items-center justify-center text-[#0052cc] shrink-0 border border-[#0052cc]/20"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                                    Trading Strategy & Plan
                                </li>
                                <li className="flex items-center gap-3 text-[15px] font-medium text-[#1a1a1a] bg-[#f8f9fe] p-3 rounded-lg">
                                    <div className="w-[18px] h-[18px] rounded-full bg-[#eef2fc] flex items-center justify-center text-[#0052cc] shrink-0 border border-[#0052cc]/20"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                                    VIP Tools Included
                                </li>
                                <li className="flex items-center gap-3 text-[15px] font-medium text-[#1a1a1a] bg-[#f8f9fe] p-3 rounded-lg">
                                    <div className="w-[18px] h-[18px] rounded-full bg-[#eef2fc] flex items-center justify-center text-[#0052cc] shrink-0 border border-[#0052cc]/20"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                                    Direct Access to Mr P
                                </li>
                            </ul>

                            <button
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                className="w-full bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold text-lg py-4 rounded-[14px] transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,82,204,0.3)] mb-4 disabled:opacity-50"
                            >
                                {addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply For Mentorship'}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </button>

                            <div className="flex items-center gap-2 text-sm text-[#e6a800] font-medium bg-[#fcf8e3] py-2 px-4 rounded-full">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Only Limited Slots Available!
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Physical Study Centers Section */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto pb-12">
                <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_15px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">Physical Study <span className="text-[#0052cc]">Centers</span></h2>
                            <p className="text-gray-600 font-medium">Join our intensive physical trading program in person</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                <span className="text-[#0052cc] font-bold text-sm tracking-wide uppercase">Open for Enrollment</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Abuja Center */}
                        <div className="bg-[#f8f9fe] rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#0052cc]/10 flex items-center justify-center text-[#0052cc] shrink-0 group-hover:bg-[#0052cc] group-hover:text-white transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-[#1a1a1a] mb-2">Abuja Center</h4>
                                    <p className="text-gray-600 font-medium leading-relaxed">
                                        Suite B5, no. 1 Omotayo Eremiye Crescent, Arab Road, Abuja
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Lagos Center */}
                        <div className="bg-[#f8f9fe] rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#0052cc]/10 flex items-center justify-center text-[#0052cc] shrink-0 group-hover:bg-[#0052cc] group-hover:text-white transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-[#1a1a1a] mb-2">Lagos Center</h4>
                                    <p className="text-gray-600 font-medium leading-relaxed">
                                        (The Place Restaurant) Ikota KM 14, Lekki-Epe Expressway, Lagos, Eti-Osa, Lekki 105101, Lagos, Nigeria
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Stats */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto pb-12">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 md:divide-x divide-gray-300">
                    <div className="flex flex-col items-center text-center px-6">
                        <h4 className="text-[26px] font-black text-[#1a1a1a]">10,000+</h4>
                        <p className="text-gray-600 font-medium">Students Mentored</p>
                    </div>
                    <div className="flex flex-col items-center text-center px-6">
                        <div className="flex items-center gap-2 text-[26px] font-black text-[#1a1a1a]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            4.9/5
                        </div>
                        <p className="text-gray-600 font-medium">(1200+ Reviews)</p>
                    </div>
                    <div className="flex items-center gap-4 px-6 text-left">
                        <div className="w-12 h-12 rounded-full bg-[#0052cc]/10 flex items-center justify-center shrink-0">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0052cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-[#1a1a1a]">30-Day</h4>
                            <p className="text-gray-600 font-medium text-sm leading-tight">Money-Back Guarantee</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50 p-4 md:px-8">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-4">
                    <h4 className="font-bold text-[#1a1a1a] text-sm md:text-[15px] whitespace-nowrap hidden md:block">Choose Your Mentorship Level & Apply Now</h4>

                    <div className="flex flex-col sm:flex-row w-full gap-3 flex-1">
                        <div className="relative flex-1 md:max-w-[200px]">
                            <select
                                value={selectedClassName}
                                onChange={(e) => handleClassChange(e.target.value)}
                                className="w-full appearance-none bg-white border border-gray-300 rounded-xl py-3 pl-4 pr-10 text-[15px] font-medium text-[#1a1a1a] focus:outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] shadow-sm"
                            >
                                <option value="Class A (10 Days)">Class A (10 Days)</option>
                                <option value="Class B (10 Days)">Class B (10 Days)</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </div>

                        <div className="relative flex-1 text-sm bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden flex items-center pr-3">
                            <input
                                type="text"
                                value={telegramUsername}
                                onChange={(e) => setTelegramUsername(e.target.value)}
                                placeholder="Telegram Username"
                                className="w-full py-3 px-4 focus:outline-none bg-transparent"
                            />
                            {/* Only display small green check if not empty */}
                            {telegramUsername.length > 0 && (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            )}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold py-3 px-6 md:px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                        >
                            {addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply Now'}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PrivateMentorshipPage;

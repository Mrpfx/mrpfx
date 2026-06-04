'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMentorshipSettings } from '@/app/actions/mentorship-settings';
import { productsService } from '@/lib/products';
import { cartService } from '@/lib/cart';
import { useCartAuth } from '@/hooks/useCartAuth';
import { WCProductRead } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const MentorshipCourse = () => {
  const router = useRouter();
  const [productSlug, setProductSlug] = useState('standard-mentorship');
  const [product, setProduct] = useState<WCProductRead | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, savePendingAction, getPendingAction, clearPendingAction, redirectToLogin } = useCartAuth();
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settings = await getMentorshipSettings();
        const slug = settings?.productSlug || 'standard-mentorship';
        setProductSlug(slug);

        const productData = await productsService.getProductBySlug(slug);
        setProduct(productData);
      } catch (error) {
        console.error('Failed to fetch mentorship data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  // Pricing logic
  const displayPrice = product?.sale_price || '499.99';
  const regularPrice = product?.regular_price || '1,590';
  const hasSale = product?.sale_price && product.sale_price !== product.regular_price;
  return (
    <div className="bg-white min-h-screen font-dm-sans overflow-x-hidden relative">
      {/* Background Image/Overlay */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0">
        <Image
          src="/images/vip-bg-city.jpg"
          alt="city background"
          fill
          className="object-cover object-top opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/80 to-white" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 pt-2 lg:pt-16">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 items-start">

          {/* Left Column - Content */}
          <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start text-center sm:text-left pt-2 lg:pt-0">
            {/* Title Section */}
            <div className="mb-2 lg:mb-8">
              <h1 className="text-[26px] sm:text-5xl lg:text-[64px] font-bold text-[#1e2e6b] leading-[1.1] tracking-tight mb-2">
                Standard Mentorship
              </h1>
              <p className="text-[15px] sm:text-xl lg:text-[24px] text-[#1a1a1a] font-semibold leading-tight max-w-2xl mb-1.5">
                Learn to trade with structure, clarity, and confidence.
              </p>
              <p className="text-[12px] sm:text-lg lg:text-[20px] text-[#555] leading-relaxed max-w-2xl font-medium">
                Get immediate access to intensive recorded sessions that break down the principles, chart behavior, and execution logic needed to grow from beginner level to more professional trading.
              </p>
            </div>

            {/* CTA Buttons - Mobile Flow */}
            <div className="flex flex-col gap-2 mb-4 w-full sm:w-max">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full sm:w-[340px] bg-[#1e4ced] hover:bg-[#1a41cc] text-white font-bold text-[15px] lg:text-[18px] py-3 lg:py-4 px-8 rounded-lg transition-all flex items-center justify-center shadow-[0_8px_25px_rgba(30,76,237,0.3)] disabled:opacity-70"
              >
                {addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get Instant Access Now'}
              </button>

              <button className="w-full sm:w-[340px] flex items-center justify-center gap-2 text-[#2a2a2a] font-bold text-[14px] bg-white border border-gray-100 py-2.5 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:bg-gray-50 transition-colors">
                <div className="w-5 h-5 rounded-full bg-[#1e4ced] flex items-center justify-center text-white shrink-0">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
                Watch Preview
              </button>
            </div>

            {/* Key Features Icons Pair */}
            <div className="grid grid-cols-2 gap-2 mb-4 lg:hidden w-full max-w-[400px]">
              <div className="bg-white border border-gray-50 p-2.5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.04)] flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-[#ebf2ff] flex items-center justify-center text-[#1e4ced] mb-1.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"></path><rect x="3" y="6" width="12" height="12" rx="2" ry="2"></rect></svg>
                </div>
                <div className="text-[10px] font-bold text-[#1a1a1a] leading-tight mb-0.5">10+ Intensive</div>
                <div className="text-[9px] text-gray-500 font-medium leading-tight">Recorded Sessions</div>
              </div>
              <div className="bg-white border border-gray-50 p-2.5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.04)] flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-[#ebf2ff] flex items-center justify-center text-[#1e4ced] mb-1.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16" stroke="white" strokeWidth="3"></line><line x1="8" y1="12" x2="8" y2="16" stroke="white" strokeWidth="3"></line><line x1="16" y1="14" x2="16" y2="16" stroke="white" strokeWidth="3"></line></svg>
                </div>
                <div className="text-[10px] font-bold text-[#1a1a1a] leading-tight mb-0.5">Beginner to</div>
                <div className="text-[9px] text-gray-500 font-medium leading-tight">Pro-Level Breakdown</div>
              </div>
            </div>

            {/* Desktop Features Row (Hidden on Mobile) */}
            <div className="hidden lg:grid grid-cols-4 gap-4 mb-12">
              {[
                { label: "10+ Intensive", sub: "Recorded Sessions", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"></path><rect x="3" y="6" width="12" height="12" rx="2" ry="2"></rect></svg> },
                { label: "Beginner to", sub: "Pro-Level Breakdown", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16" stroke="white" strokeWidth="3"></line><line x1="8" y1="12" x2="8" y2="16" stroke="white" strokeWidth="3"></line><line x1="16" y1="14" x2="16" y2="16" stroke="white" strokeWidth="3"></line></svg> },
                { label: "Chart Analysis", sub: "& Strategies", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },
                { label: "Lifetime", sub: "Full Access", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white/50 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#ebf2ff] flex items-center justify-center text-[#1e4ced] shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-[#1a1a1a]">{item.label}</span>
                    <span className="text-[13px] text-gray-500">{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Pricing Card */}
          <div className="w-full lg:w-[440px] shrink-0 pt-0 pb-6 lg:pb-0">
            <div className="bg-white rounded-2xl p-4 lg:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-100 relative overflow-hidden">
              {/* Card Content */}
              <h3 className="text-[18px] lg:text-[24px] font-bold text-[#1e2e6b] mb-0.5">Standard Mentorship</h3>
              <p className="text-[11px] text-gray-500 font-medium mb-4">Immediate access to recorded sessions</p>

              <div className="flex items-center gap-3 mb-4">
                {hasSale && (
                  <span className="text-[14px] text-red-500 line-through font-medium opacity-40">${regularPrice}</span>
                )}
                <span className="text-[32px] font-black text-[#1a4a38] leading-none">${displayPrice}</span>
              </div>

              {/* Features List with Checkmarks */}
              <div className="flex flex-col gap-2.5 mb-6 z-10 relative">
                {[
                  "One-time payment",
                  "Instant access after purchase",
                  "Learn on your own schedule"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-[16px] h-[16px] rounded-full bg-[#ebf2ff] flex items-center justify-center text-[#1e4ced] shrink-0">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="text-[12.5px] text-[#444] font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Background Chart Graphic (Faded visual) */}
              <div className="absolute right-[-45px] bottom-[110px] w-64 h-40 opacity-[0.03] pointer-events-none transform -rotate-6">
                <div className="w-full h-full relative">
                  <div className="absolute bottom-4 left-4 w-1.5 h-16 bg-blue-600 rounded-sm"></div>
                  <div className="absolute bottom-4 left-10 w-1.5 h-10 bg-blue-600 rounded-sm"></div>
                  <div className="absolute bottom-8 left-16 w-1.5 h-20 bg-red-500 rounded-sm"></div>
                  <div className="absolute bottom-6 left-22 w-1.5 h-24 bg-blue-600 rounded-sm"></div>
                  <div className="absolute bottom-16 left-28 w-1.5 h-14 bg-red-500 rounded-sm"></div>
                  <div className="absolute bottom-12 left-34 w-1.5 h-28 bg-blue-600 rounded-sm"></div>
                  <div className="absolute bottom-20 left-40 w-1.5 h-18 bg-blue-600 rounded-sm"></div>
                  <div className="absolute bottom-12 left-46 w-1.5 h-32 bg-blue-600 rounded-sm"></div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-[#1e4ced] hover:bg-[#1a41cc] text-white font-bold text-[15px] py-3.5 rounded-xl transition-all flex items-center justify-center relative z-10 shadow-[0_8px_20px_rgba(30,76,237,0.2)] disabled:opacity-70"
              >
                {addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get Instant Access Now'}
              </button>
            </div>

            {/* Social Proof (Students and Reviews) */}
            <div className="mt-8 flex flex-col items-center sm:items-start gap-4 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3 shrink-0">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-9 h-9 rounded-full bg-gray-200 border-2 border-white overflow-hidden relative">
                      <div className="absolute inset-0 bg-[#1e4ced]/10" />
                    </div>
                  ))}
                </div>
                <div className="text-[#1a1a1a] text-[14px] font-bold">
                  10k+ <span className="text-gray-500 font-medium">Students Enrolled</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5 text-[#fbbf24] shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  ))}
                </div>
                <div className="text-[#1a1a1a] text-[14px] font-bold">
                  4.9/5 <span className="text-gray-500 font-medium">(1,200+ Reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - What You'll Learn Inside */}
        <div className="mt-2 lg:mt-24 pb-8">
          <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
            <h2 className="text-[18px] sm:text-3xl lg:text-4xl font-bold text-[#1e2e6b]">See What You'll Learn Inside</h2>
            <div className="h-[2px] flex-1 w-full bg-gradient-to-r from-gray-100 to-transparent hidden md:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {[
              "10+ Intensive Recorded Sessions",
              "Beginner to Pro-Level Breakdown",
              "Learn at Your Own Pace"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-50/30 border border-gray-100/30 p-2.5 rounded-xl">
                <div className="w-4.5 h-4.5 rounded-full bg-[#ebf2ff] flex items-center justify-center text-[#1e4ced] shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-[#444] font-bold text-[13px]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipCourse;

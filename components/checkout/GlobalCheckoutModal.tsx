'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    ShoppingCart,
    CreditCard,
    Loader2,
    CheckCircle2,
    ShoppingBag,
    AlertCircle,
    ExternalLink,
    X,
    Trash2,
    RefreshCcw,
    Tag,
    Info
} from 'lucide-react';
import { cartService } from '@/lib/cart';
import { checkoutService } from '@/lib/checkout';
import { productsService } from '@/lib/products';
import { tradingToolsService } from '@/lib/trading-tools';
import { authService } from '@/lib/auth';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import type { WCCart, WCAddress, WCProductRead } from '@/lib/types';

export default function GlobalCheckoutModal() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const [cart, setCart] = useState<WCCart | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('crypto');

    const [pendingOrderId, setPendingOrderId] = useState<string>('');
    const [showExternalModal, setShowExternalModal] = useState(false);
    const [externalRedirectUrl, setExternalRedirectUrl] = useState<string | null>(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [productDetails, setProductDetails] = useState<WCProductRead | null>(null);

    const [couponCode, setCouponCode] = useState('');
    const [applyingCoupon, setApplyingCoupon] = useState(false);
    const [couponMessage, setCouponMessage] = useState<{ text: string, isError: boolean } | null>(null);

    const { withAuth } = useRequireAuth();

    const fetchCart = useCallback(async () => {
        try {
            const data = await cartService.getCart(paymentMethod);
            setCart(data);
        } catch (err) {
            console.error('Failed to fetch cart', err);
        }
    }, [paymentMethod]);

    useEffect(() => {
        const handleOpen = async (event: Event) => {
            setIsOpen(true);
            setLoading(true);
            setError('');
            setShowExternalModal(false);
            setSubmitting(false);

            try {
                const data = await cartService.getCart(paymentMethod);
                setCart(data);

                let initialMethod = 'crypto';
                const customEvent = event as CustomEvent;
                if (customEvent.detail?.method) {
                    initialMethod = customEvent.detail.method;
                }

                if (data && data.items && data.items.length > 0) {
                    try {
                        const firstItem = data.items[0];
                        let details = await productsService.getProductFull(firstItem.product_id);

                        const eventSellerLink = (event as CustomEvent).detail?.sellerLink;
                        if (eventSellerLink) {
                            details = { ...details, seller_payment_link: eventSellerLink };
                            initialMethod = 'seller';
                        }

                        if (!details.seller_payment_link) {
                            try {
                                const tool = await tradingToolsService.getTool(firstItem.product_id);
                                if (tool && tool.seller_payment_link) {
                                    details = { ...details, seller_payment_link: tool.seller_payment_link };
                                } else {
                                    const book = await tradingToolsService.getBook(firstItem.product_id);
                                    if (book && (book.seller_payment_link || book.buy_url)) {
                                        details = { ...details, seller_payment_link: book.seller_payment_link || book.buy_url };
                                    }
                                }
                            } catch (e) { }
                        }

                        setProductDetails(details);

                        if (details.seller_payment_link && !((event as CustomEvent).detail?.method)) {
                            initialMethod = 'seller';
                        }

                        if (initialMethod === 'seller' && !details.seller_payment_link) {
                            initialMethod = 'crypto';
                        }
                    } catch (e) {
                        console.error('Failed to fetch product details', e);
                    }
                }

                setPaymentMethod(initialMethod);
            } catch (err) {
                console.error('Failed to load cart', err);
                setError('Failed to load cart. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        window.addEventListener('open-checkout', handleOpen);
        window.addEventListener('cart-updated', fetchCart);
        return () => {
            window.removeEventListener('open-checkout', handleOpen);
            window.removeEventListener('cart-updated', fetchCart);
        };
    }, [paymentMethod, fetchCart]);

    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen, paymentMethod, fetchCart]);

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => setSubmitting(false), 300);
    };

    const handleRemoveItem = async (productId: number, variationId?: number | null) => {
        try {
            const updatedCart = await cartService.removeFromCart(productId, variationId || undefined);
            setCart(updatedCart);
        } catch (err) {
            console.error('Failed to remove item', err);
            setError('Could not remove item.');
        }
    };

    const handleClearCart = async () => {
        setShowClearConfirm(true);
    };

    const confirmClearCart = async () => {
        try {
            const updatedCart = await cartService.clearCart(paymentMethod);
            setCart(updatedCart);
            setShowClearConfirm(false);
        } catch (err) {
            console.error('Failed to clear cart', err);
            setError('Could not clear cart.');
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setApplyingCoupon(true);
        setCouponMessage(null);
        try {
            await cartService.applyCoupon(couponCode, paymentMethod);
            await fetchCart();
            setCouponCode('');
            setCouponMessage({ text: 'Coupon applied successfully!', isError: false });
        } catch (err: any) {
            console.error('Failed to apply coupon', err);
            const errorMsg = err.response?.data?.detail || err.response?.data?.message || 'Invalid coupon code.';
            setCouponMessage({ text: errorMsg, isError: true });
        } finally {
            setApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = async (code: string) => {
        try {
            const updatedCart = await cartService.removeCoupon(code, paymentMethod);
            setCart(updatedCart);
            setCouponMessage({ text: 'Coupon removed.', isError: false });
        } catch (err) {
            console.error('Failed to remove coupon', err);
            setError('Could not remove coupon.');
        }
    };

    const handlePlaceOrder = async () => {
        withAuth(async () => {
            setSubmitting(true);
            setError('');
            try {
                const user = authService.getUserFromToken();
                const userNameStr = user?.display_name || user?.user_login || 'Member User';
                const userName = userNameStr.split(' ');
                const billing: WCAddress = {
                    first_name: userName[0] || 'Member',
                    last_name: userName.slice(1).join(' ') || 'User',
                    email: user?.user_email || 'user@example.com',
                    address_1: 'N/A', city: 'N/A', state: 'N/A', postcode: '00000', country: 'NG', phone: '0000000000'
                };

                const aggregatedCustomFields: Record<string, string> = {};
                if (cart?.items) {
                    cart.items.forEach(item => {
                        if (item.custom_fields) Object.assign(aggregatedCustomFields, item.custom_fields);
                    });
                }

                const finalPaymentMethod = cart?.total === 0 ? 'free' : paymentMethod;
                const finalPaymentMethodTitle = cart?.total === 0 ? 'Free Checkout' : (
                    paymentMethod === 'whop' ? 'Whop Checkout' :
                        paymentMethod === 'seller' ? 'Seller Payment' :
                            paymentMethod === 'crypto' ? 'Pay with Crypto' : 'Bank Transfer'
                );

                const request = checkoutService.buildCheckoutRequest(
                    billing,
                    finalPaymentMethod,
                    {
                        customerNote: '',
                        paymentMethodTitle: finalPaymentMethodTitle,
                        customFields: Object.keys(aggregatedCustomFields).length > 0 ? aggregatedCustomFields : undefined
                    }
                );

                const response = await checkoutService.checkout(request);

                if (cart?.total === 0) {
                    setIsOpen(false);
                    router.push(`/my-orders/${response.order_id}`);
                    return;
                }

                let chosenExternalUrl = response.payment_url || response.redirect_url || null;

                if (paymentMethod === 'whop' && !chosenExternalUrl && cart) {
                    const firstProduct = cart.items[0];
                    if (firstProduct) {
                        const fullProduct = await productsService.getProductFull(firstProduct.product_id);
                        if (fullProduct.whop_payment_link) chosenExternalUrl = fullProduct.whop_payment_link;
                    }
                }

                if (paymentMethod === 'seller' && !chosenExternalUrl && cart) {
                    const firstProduct = cart.items[0];
                    if (firstProduct) {
                        if (productDetails?.id === firstProduct.product_id && productDetails.seller_payment_link) {
                            chosenExternalUrl = productDetails.seller_payment_link;
                        } else {
                            const fullProduct = await productsService.getProductFull(firstProduct.product_id);
                            if (fullProduct.seller_payment_link) {
                                chosenExternalUrl = fullProduct.seller_payment_link;
                            } else {
                                const tool = await tradingToolsService.getTool(firstProduct.product_id);
                                if (tool?.seller_payment_link) chosenExternalUrl = tool.seller_payment_link;
                            }
                        }
                    }
                }

                if (chosenExternalUrl) {
                    setPendingOrderId(response.order_id?.toString() || '');
                    setSubmitting(false);
                    window.location.href = chosenExternalUrl;
                    return;
                }

                setSubmitting(false);
                setIsOpen(false);
                router.push(`/my-orders/${response.order_id}`);
            } catch (err: any) {
                const axiosError = err as any;
                const detail = axiosError?.response?.data?.detail;
                setError(typeof detail === 'string' ? detail : 'An error occurred during checkout.');
                setSubmitting(false);
            }
        }, { key: 'place-order-modal' });
    };

    const formatPrice = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden sm:overflow-visible transition-all duration-300">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={handleClose} />

            <div className="relative w-full sm:max-w-4xl bg-[#0a0e17] rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden border-t sm:border border-white/10 flex flex-col sm:flex-row h-[90dvh] sm:h-auto sm:max-h-[85vh] animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white/70 hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>

                {loading ? (
                    <div className="w-full h-64 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    </div>
                ) : (!cart || cart.items.length === 0) ? (
                    <div className="w-full h-64 flex flex-col items-center justify-center p-8 text-center text-white">
                        <ShoppingBag className="w-12 h-12 text-gray-600 mb-4" />
                        <h2 className="text-xl font-bold mb-2">Checkout Failed</h2>
                        <p className="text-gray-500 text-sm mb-6">Your cart is empty.</p>
                        <button onClick={handleClose} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold">Close</button>
                    </div>
                ) : (
                    <>
                        {/* Summary */}
                        <div className="w-full sm:w-5/12 bg-[#111827] p-6 lg:p-8 flex flex-col border-b sm:border-b-0 sm:border-r border-white/5 overflow-y-auto shrink-0 sm:shrink max-h-[45dvh] sm:max-h-full scrollbar-none">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-emerald-400" /> Order Summary
                                </h3>
                                <button onClick={handleClearCart} className="text-[10px] uppercase tracking-widest font-bold text-red-400/70 hover:text-red-400 flex items-center gap-1">
                                    <RefreshCcw className="w-3 h-3" /> Clear Cart
                                </button>
                            </div>

                            <div className="space-y-4 mb-6 flex-grow">
                                {cart.items.map(item => (
                                    <div key={item.product_id} className="text-sm bg-white/5 rounded-xl p-3 border border-white/5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 pr-3">
                                                <div className="font-medium text-gray-200 line-clamp-2">{item.product_name}</div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                                    <button onClick={() => handleRemoveItem(item.product_id, item.variation_id)} className="text-gray-600 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </div>
                                            <span className="text-white font-bold shrink-0">{formatPrice(Number(item.line_total))}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-3 mt-auto">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-gray-300">{formatPrice(Number(cart.subtotal))}</span>
                                </div>
                                {Number(cart.discount_total) > 0 && (
                                    <div className="flex justify-between text-sm text-emerald-400 font-bold">
                                        <span>Discount</span>
                                        <span>-{formatPrice(Number(cart.discount_total))}</span>
                                    </div>
                                )}

                                <div className="pt-2">
                                    {cart.coupon_codes?.length > 0 && (
                                        <div className="space-y-2 mb-3">
                                            {cart.coupon_codes.map(code => (
                                                <div key={code} className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="w-3.5 h-3.5 text-emerald-400" />
                                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-tight">{code}</span>
                                                    </div>
                                                    <button onClick={() => handleRemoveCoupon(code)} className="text-gray-500 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Coupon Code"
                                            className="grow bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase"
                                            value={couponCode}
                                            onChange={e => setCouponCode(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                                        />
                                        <button onClick={handleApplyCoupon} disabled={applyingCoupon || !couponCode.trim()} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shrink-0">
                                            {applyingCoupon ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
                                        </button>
                                    </div>
                                    {couponMessage && (
                                        <p className={`text-[10px] mt-1.5 font-medium px-1 ${couponMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {couponMessage.text}
                                        </p>
                                    )}
                                    <p className="text-[10px] text-amber-400/60 mt-2 flex items-center gap-1 px-1">
                                        <Info className="w-2.5 h-2.5 shrink-0" />
                                        <span>Discount only applies to crypto payments</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border-t border-white/10 pt-3">
                                <span className="text-white font-semibold">Total</span>
                                <span className="text-2xl font-black text-white">{formatPrice(Number(cart.total))}</span>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="w-full sm:w-7/12 p-6 lg:p-10 flex flex-col justify-start sm:justify-center overflow-y-auto scrollbar-none pb-10">
                            <div className="mb-6 sm:mb-8">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Complete Checkout</h2>
                                <p className="text-gray-400 text-sm">Select your payment method.</p>
                            </div>

                            {Number(cart.total) > 0 ? (
                                <div className="space-y-3 mb-8">
                                    {[
                                        { id: 'seller', label: 'Credit Card', badge: 'Selar', badgeColor: 'bg-blue-500/20 text-blue-400', show: !!productDetails?.seller_payment_link },
                                        { id: 'crypto', label: 'Pay with Crypto', badge: 'NOWPayments', badgeColor: 'bg-purple-500/20 text-purple-400', show: true },
                                    ].filter(m => m.show).map(method => (
                                        <button
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${paymentMethod === method.id ? 'bg-purple-500/10 border-purple-500/30 ring-1 ring-purple-500 text-white' : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06] text-gray-300'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === method.id ? 'border-purple-400 bg-purple-500' : 'border-gray-600'}`}>
                                                {paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                            <div className="flex-1 font-semibold text-sm text-left">{method.label}</div>
                                            <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-widest ${method.badgeColor}`}>{method.badge}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center text-center gap-3 mb-8">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-8 h-8 text-emerald-400" /></div>
                                    <h3 className="text-white font-bold text-lg">Free Order</h3>
                                    <p className="text-emerald-400/80 text-sm">No payment required.</p>
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-red-400 text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handlePlaceOrder}
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-base font-bold shadow-lg disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                                {submitting ? 'Processing...' : (cart.total === 0 ? 'Complete Order' : `Pay ${formatPrice(Number(cart.total))}`)}
                            </button>
                        </div>
                    </>
                )}
            </div>

            {showClearConfirm && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowClearConfirm(false)} />
                    <div className="relative bg-[#111827] border border-white/10 rounded-3xl p-8 shadow-2xl text-center max-w-sm">
                        <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-white font-bold text-xl mb-2">Clear Cart?</h3>
                        <p className="text-gray-400 text-sm mb-6">This will remove all items from your order.</p>
                        <div className="flex flex-col gap-2">
                            <button onClick={confirmClearCart} className="w-full py-3 bg-red-600 text-white rounded-xl font-bold">Yes, Clear</button>
                            <button onClick={() => setShowClearConfirm(false)} className="w-full py-3 bg-white/5 text-gray-400 rounded-xl">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    );
}

'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ShoppingCart,
    CreditCard,
    MapPin,
    Loader2,
    CheckCircle2,
    ArrowLeft,
    ShoppingBag,
    AlertCircle,
    ExternalLink
} from 'lucide-react';
import { cartService } from '@/lib/cart';
import { checkoutService } from '@/lib/checkout';
import { productsService } from '@/lib/products';
import { authService } from '@/lib/auth';
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import CryptoPaymentModal from '@/components/checkout/CryptoPaymentModal';
import type { WCCart, WCAddress, WCProductRead } from '@/lib/types';

export const dynamic = 'force-dynamic';

function CheckoutPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [cart, setCart] = useState<WCCart | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('crypto');

    const { withAuth } = useRequireAuth();

    const [showCryptoModal, setShowCryptoModal] = useState(false);
    const [pendingOrderId, setPendingOrderId] = useState<string>('');
    const [showExternalModal, setShowExternalModal] = useState(false);
    const [externalRedirectUrl, setExternalRedirectUrl] = useState<string | null>(null);
    const [productDetails, setProductDetails] = useState<WCProductRead | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await cartService.getCart();
                setCart(data);

                // Auto-select method from URL if present
                const method = searchParams.get('method');
                let initialMethod = method && ['whop', 'seller', 'crypto', 'bank'].includes(method) ? method : 'crypto';

                // Fetch full info for the item to check payment links
                if (data && data.items && data.items.length > 0) {
                    try {
                        const firstItem = data.items[0];
                        const details = await productsService.getProductFull(firstItem.product_id);
                        setProductDetails(details);

                        // Force crypto if Selar link is absent but seller was requested
                        if (initialMethod === 'seller' && !details.seller_payment_link) {
                            initialMethod = 'crypto';
                        }
                    } catch (e) {
                        console.error('Failed fetching product details', e);
                    }
                }

                setPaymentMethod(initialMethod);
                setSubmitting(false);
            } catch (err) {
                console.error('Failed to load cart', err);
            } finally {
                setLoading(false);
            }
        })();
        const handleRefresh = async () => {
            try {
                const refreshedData = await cartService.getCart();
                setCart(refreshedData);
            } catch (err) {
                console.error('Cart refresh error', err);
            }
        };

        window.addEventListener('cart-updated', handleRefresh);
        return () => window.removeEventListener('cart-updated', handleRefresh);
    }, [searchParams]);

    const handlePlaceOrder = async () => {
        withAuth(async () => {
            setSubmitting(true);
            setError('');
            try {
                // Aggregate all custom fields from cart items
                const aggregatedCustomFields: Record<string, string> = {};
                if (cart && cart.items) {
                    cart.items.forEach(item => {
                        if (item.custom_fields) {
                            Object.assign(aggregatedCustomFields, item.custom_fields);
                        }
                    });
                }

                const finalPaymentMethod = cart?.total === 0 ? 'free' : paymentMethod;
                const finalPaymentMethodTitle = cart?.total === 0 ? 'Free Checkout' : (
                    paymentMethod === 'whop' ? 'Whop Checkout' :
                        paymentMethod === 'seller' ? 'Seller Payment' :
                            paymentMethod === 'crypto' ? 'Pay with Crypto' : 'Bank Transfer'
                );

                const user = authService.getUserFromToken();
                const userNameStr = user?.display_name || user?.user_login || 'Member User';
                const userName = userNameStr.split(' ');
                const billing: WCAddress = {
                    first_name: userName[0] || 'Member',
                    last_name: userName.slice(1).join(' ') || 'User',
                    email: user?.user_email || 'user@example.com',
                    address_1: 'N/A',
                    city: 'N/A',
                    state: 'N/A',
                    postcode: '00000',
                    country: 'NG',
                    phone: '0000000000'
                };

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

                // Handle free orders (total 0)
                if (cart?.total === 0) {
                    router.push(`/my-orders/${response.order_id}`);
                    return;
                }

                // Handle crypto payment method
                if (paymentMethod === 'crypto') {
                    setPendingOrderId(response.order_id.toString());
                    setShowCryptoModal(true);
                    setSubmitting(false);
                    return;
                }

                let chosenExternalUrl = response.payment_url || response.redirect_url || null;

                if (paymentMethod === 'whop' && !chosenExternalUrl && cart) {
                    try {
                        const firstProduct = cart.items[0];
                        if (firstProduct) {
                            const fullProduct = await productsService.getProductFull(firstProduct.product_id);
                            if (fullProduct.whop_payment_link) chosenExternalUrl = fullProduct.whop_payment_link;
                        }
                    } catch (err) {
                        console.error('Failed to get whop link:', err);
                    }
                }

                if (paymentMethod === 'seller' && !chosenExternalUrl && cart) {
                    try {
                        const firstProduct = cart.items[0];
                        if (firstProduct) {
                            const fullProduct = await productsService.getProductFull(firstProduct.product_id);
                            if (fullProduct.seller_payment_link) chosenExternalUrl = fullProduct.seller_payment_link;
                        }
                    } catch (err) {
                        console.error('Failed to get seller link:', err);
                    }
                }

                if (chosenExternalUrl) {
                    setPendingOrderId(response.order_id?.toString() || '');
                    setSubmitting(false);
                    window.location.href = chosenExternalUrl;
                    return;
                }

                setSubmitting(false);
                router.push(`/my-orders/${response.order_id}`);
            } catch (err: unknown) {
                const axiosError = err as any;
                const detail = axiosError?.response?.data?.detail;
                let errorMsg = 'An error occurred during checkout. Please try again.';
                if (typeof detail === 'string') errorMsg = detail;
                setError(errorMsg);
                setSubmitting(false);
            }
        }, { key: 'place-order' });
    };

    const formatPrice = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
        );
    }

    const isEmpty = !cart || cart.items.length === 0;

    if (isEmpty) {
        return (
            <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center px-4">
                <div className="text-center">
                    <ShoppingBag className="w-14 h-14 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 text-sm mb-6">Add items to your cart before checkout.</p>
                    <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold">
                        Browse Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0e17]">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/[0.03] blur-[120px]" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Cart
                </Link>

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Payment</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Billing & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Payment Method - Only show if total > 0 */}
                        {cart?.total && cart.total > 0 ? (
                            <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
                                <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-5">
                                    <CreditCard className="w-4 h-4 text-amber-400" /> Payment Method
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        // { id: 'whop', label: 'Whop Checkout', icon: ExternalLink, badge: 'Direct', badgeColor: 'bg-orange-500/20 text-orange-400' },
                                        { id: 'seller', label: 'Seller Payment', icon: ExternalLink, badge: 'External', badgeColor: 'bg-cyan-500/20 text-cyan-400', show: !!productDetails?.seller_payment_link },
                                        { id: 'crypto', label: 'Pay with Crypto', icon: CreditCard, badge: 'NOWPayments', badgeColor: 'bg-purple-500/20 text-purple-400', show: true },
                                        // { id: 'bank', label: 'Bank Transfer', icon: CreditCard, badge: 'Nigerians Only', badgeColor: 'bg-emerald-500/20 text-emerald-400' },
                                    ].filter(m => m.show).map(method => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${paymentMethod === method.id
                                                ? 'bg-purple-500/10 border-purple-500/30'
                                                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === method.id ? 'border-purple-400 bg-purple-500' : 'border-gray-600'
                                                }`}>
                                                {paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                            <method.icon className={`w-4 h-4 ${paymentMethod === method.id ? 'text-white' : 'text-gray-500'}`} />
                                            <span className="text-white text-sm font-medium">{method.label}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${method.badgeColor}`}>
                                                {method.badge}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-emerald-500/5 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-base">Free Order</h3>
                                    <p className="text-emerald-400/70 text-sm">No payment required for this item.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Order Summary */}
                    <div>
                        <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 sticky top-8">
                            <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-5">
                                <ShoppingCart className="w-4 h-4 text-emerald-400" /> Order Summary
                            </h3>

                            {/* Items */}
                            <div className="space-y-3 mb-4">
                                {cart!.items.map(item => (
                                    <div key={item.product_id} className="text-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <span className="text-gray-300 truncate">{item.product_name}</span>
                                                <span className="text-gray-600 shrink-0">×{item.quantity}</span>
                                            </div>
                                            <span className="text-white font-medium ml-3">{formatPrice(item.line_total)}</span>
                                        </div>
                                        {item.custom_fields && Object.keys(item.custom_fields).length > 0 && (
                                            <div className="mt-1 pl-1">
                                                {Object.entries(item.custom_fields).map(([key, val]) => (
                                                    <p key={key} className="text-xs text-gray-400">
                                                        <span className="text-gray-500">{key}:</span> {val}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/[0.06] pt-3 space-y-2">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-white">{formatPrice(cart!.subtotal)}</span>
                                </div>
                                {cart!.discount_total > 0 && (
                                    <div className="flex justify-between text-sm text-emerald-400">
                                        <span>Discount</span>
                                        <span>-{formatPrice(cart!.discount_total)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm border-t border-white/[0.06] pt-2">
                                    <span className="text-white font-semibold">Total</span>
                                    <span className="text-xl font-bold text-white">{formatPrice(cart!.total)}</span>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-red-400 text-xs">{error}</p>
                                </div>
                            )}

                            {/* Place Order */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 mt-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                ) : (
                                    <>{cart?.total === 0 ? <CheckCircle2 className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />} {cart?.total === 0 ? 'Complete Free Order' : 'Place Order'}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Crypto Payment Modal */}
            {showCryptoModal && (
                <CryptoPaymentModal
                    orderAmount={cart!.total}
                    orderId={pendingOrderId}
                    onClose={() => setShowCryptoModal(false)}
                    onSuccess={() => {
                        setShowCryptoModal(false);
                        router.push('/my-orders');
                    }}
                />
            )}

            {/* External Payment Confirmation Modal (Whop / Seller / Bank) */}
            {showExternalModal && externalRedirectUrl && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0a0e17]/80 backdrop-blur-md" onClick={() => setShowExternalModal(false)} />

                    <div className="relative w-full max-w-md bg-[#111827] border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-3">Continue to external payment</h3>
                        <p className="text-sm text-gray-300 mb-4">Your order has been created. Click the button below to continue to the external payment page.</p>

                        <div className="mb-4 text-sm">
                            <div className="text-xs text-gray-400">Payment link</div>
                            <div className="mt-1 break-words text-sm text-white">{externalRedirectUrl}</div>
                        </div>

                        <div className="flex items-center gap-3 justify-end">
                            <button
                                onClick={() => {
                                    // If user cancels, go to their order details page
                                    setShowExternalModal(false);
                                    if (pendingOrderId) router.push(`/my-orders/${pendingOrderId}`);
                                }}
                                className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-gray-300 hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // Proceed to external payment (same-tab redirect)
                                    window.location.href = externalRedirectUrl!;
                                }}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold"
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0a0e17] flex items-center justify-center"><Loader2 className="w-8 h-8 text-purple-400 animate-spin" /></div>}>
            <CheckoutPageContent />
        </Suspense>
    );
}

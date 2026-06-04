'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    Tag,
    Loader2,
    ArrowLeft,
    ArrowRight,
    ShoppingBag,
    X,
    TicketPercent
} from 'lucide-react';
import { cartService } from '@/lib/cart';
import type { WCCart } from '@/lib/types';

export default function CartPage() {
    const [cart, setCart] = useState<WCCart | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');

    const fetchCart = async () => {
        try {
            const data = await cartService.getCart();
            setCart(data);
        } catch (err) {
            console.error('Failed to load cart', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    const updateQty = async (productId: number, newQty: number, variationId?: number) => {
        setUpdating(productId);
        try {
            if (newQty <= 0) {
                const updated = await cartService.removeFromCart(productId, variationId);
                setCart(updated);
            } else {
                const updated = await cartService.updateCartItem(productId, newQty, variationId);
                setCart(updated);
            }
        } catch (err) {
            console.error('Failed to update cart', err);
        } finally {
            setUpdating(null);
        }
    };

    const removeItem = async (productId: number, variationId?: number) => {
        setUpdating(productId);
        try {
            const updated = await cartService.removeFromCart(productId, variationId);
            setCart(updated);
        } catch (err) {
            console.error('Failed to remove item', err);
        } finally {
            setUpdating(null);
        }
    };

    const clearCart = async () => {
        setLoading(true);
        try {
            const updated = await cartService.clearCart();
            setCart(updated);
        } catch (err) {
            console.error('Failed to clear cart', err);
        } finally {
            setLoading(false);
        }
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const updated = await cartService.applyCoupon(couponCode.trim());
            setCart(updated);
            setCouponCode('');
        } catch (err: any) {
            setCouponError(err?.response?.data?.detail || 'Invalid coupon code');
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = async (code: string) => {
        try {
            const updated = await cartService.removeCoupon(code);
            setCart(updated);
        } catch (err) {
            console.error('Failed to remove coupon', err);
        }
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

    return (
        <div className="min-h-screen bg-[#0a0e17]">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-600/[0.03] blur-[120px]" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Shopping</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Your Cart</h1>
                    </div>
                    <Link href="/shop" className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Continue Shopping
                    </Link>
                </div>

                {/* Empty Cart */}
                {isEmpty && (
                    <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-16 text-center">
                        <ShoppingBag className="w-14 h-14 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 text-sm mb-6">Browse our shop and add some products!</p>
                        <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30">
                            Browse Products <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}

                {/* Cart Items */}
                {!isEmpty && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart!.items.map(item => (
                                <div
                                    key={item.product_id}
                                    className="bg-[#111827]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 hover:border-white/[0.12] transition-all"
                                >
                                    {/* Image */}
                                    <div className="w-20 h-20 rounded-xl bg-gray-900/50 overflow-hidden shrink-0">
                                        {item.product_image ? (
                                            <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-8 h-8 text-gray-700" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold text-sm truncate">{item.product_name}</h3>
                                        <p className="text-gray-500 text-xs mt-0.5">{formatPrice(item.product_price)} each</p>

                                        {/* Display Custom Fields */}
                                        {item.custom_fields && Object.keys(item.custom_fields).length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {Object.entries(item.custom_fields).map(([key, val]) => (
                                                    <p key={key} className="text-xs text-gray-400">
                                                        <span className="font-medium text-gray-300">{key}:</span> {val}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Quantity */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQty(item.product_id, item.quantity - 1, item.variation_id ?? undefined)}
                                            disabled={updating === item.product_id}
                                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 transition-all disabled:opacity-30"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="w-8 text-center text-white text-sm font-semibold">
                                            {updating === item.product_id ? (
                                                <Loader2 className="w-4 h-4 animate-spin mx-auto text-purple-400" />
                                            ) : (
                                                item.quantity
                                            )}
                                        </span>
                                        <button
                                            onClick={() => updateQty(item.product_id, item.quantity + 1, item.variation_id ?? undefined)}
                                            disabled={updating === item.product_id}
                                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 transition-all disabled:opacity-30"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Line Total */}
                                    <div className="text-right w-24 shrink-0">
                                        <p className="text-white font-bold text-sm">{formatPrice(item.line_total)}</p>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeItem(item.product_id, item.variation_id ?? undefined)}
                                        disabled={updating === item.product_id}
                                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-all disabled:opacity-30"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}

                            {/* Clear Cart */}
                            <button
                                onClick={clearCart}
                                className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
                            >
                                <X className="w-3 h-3" /> Clear entire cart
                            </button>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="space-y-4">
                            {/* Coupon */}
                            <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
                                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                    <TicketPercent className="w-4 h-4 text-amber-400" /> Coupon Code
                                </h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={e => setCouponCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/30"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        disabled={couponLoading}
                                        className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
                                    >
                                        {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                    </button>
                                </div>
                                {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
                                {cart!.coupon_codes.length > 0 && (
                                    <div className="mt-3 space-y-1">
                                        {cart!.coupon_codes.map(code => (
                                            <div key={code} className="flex items-center justify-between bg-emerald-500/10 rounded-lg px-3 py-1.5">
                                                <span className="text-emerald-400 text-xs font-medium uppercase">{code}</span>
                                                <button onClick={() => removeCoupon(code)} className="text-gray-500 hover:text-red-400 transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Summary */}
                            <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
                                <h3 className="text-white font-semibold text-sm mb-4">Order Summary</h3>
                                <div className="space-y-2.5 text-sm">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal ({cart!.item_count} items)</span>
                                        <span className="text-white">{formatPrice(cart!.subtotal)}</span>
                                    </div>
                                    {cart!.discount_total > 0 && (
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-emerald-400">
                                                <span>Discount</span>
                                                <span>-{formatPrice(cart!.discount_total)}</span>
                                            </div>
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
                                                <TicketPercent className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                <p className="text-[10px] font-bold text-emerald-400 leading-tight uppercase tracking-widest">
                                                    Discount is active only when crypto payment is selected
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {cart!.shipping_total > 0 && (
                                        <div className="flex justify-between text-gray-400">
                                            <span>Shipping</span>
                                            <span className="text-white">{formatPrice(cart!.shipping_total)}</span>
                                        </div>
                                    )}
                                    {cart!.tax_total > 0 && (
                                        <div className="flex justify-between text-gray-400">
                                            <span>Tax</span>
                                            <span className="text-white">{formatPrice(cart!.tax_total)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-white/[0.06] pt-2.5 flex justify-between">
                                        <span className="text-white font-semibold">Total</span>
                                        <span className="text-xl font-bold text-white">{formatPrice(cart!.total)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-checkout'))}
                                    className="w-full flex items-center justify-center gap-2 mt-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-500/20"
                                >
                                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

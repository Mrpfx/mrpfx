'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    ShoppingCart,
    Star,
    Check,
    ExternalLink,
    Calendar,
    Clock,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Package,
    Send,
    MessageSquare,
    User
} from 'lucide-react';
import { cartService } from '@/lib/cart';
import { productsService, type ProductReview } from '@/lib/products';
import type { WCProductFullRead, WCProductVariationRead, WCProductRead } from '@/lib/types';
import { useCartAuth } from '@/hooks/useCartAuth';

interface SingleProductPageProps {
    product: WCProductFullRead;
    relatedProducts?: WCProductRead[];
}

const formatCurrency = (amount: string | number | null | undefined): string => {
    if (!amount) return 'Free';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

const SingleProductPage: React.FC<SingleProductPageProps> = ({ product, relatedProducts = [] }) => {
    // 1. New State for Cart Count
    const [cartCount, setCartCount] = useState(0);

    const [addingToCart, setAddingToCart] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState<(ProductReview & { id?: number; reviewer?: string; rating?: number; review?: string; date_created?: string })[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);

    // Variation state
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [selectedVariation, setSelectedVariation] = useState<WCProductVariationRead | null>(null);

    // Addons state
    const [customFields, setCustomFields] = useState<Record<string, string>>({});

    // Review form
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);

    const { isAuthenticated, savePendingAction, getPendingAction, clearPendingAction, redirectToLogin } = useCartAuth();

    const images = product.images && product.images.length > 0
        ? product.images
        : product.featured_image?.url
            ? [{ id: 0, src: product.featured_image.url, name: product.name, alt: product.name }]
            : [];

    const hasDiscount = product.sale_price && product.regular_price &&
        parseFloat(product.sale_price) < parseFloat(product.regular_price);

    const discount = hasDiscount
        ? Math.round(((parseFloat(product.regular_price!) - parseFloat(product.sale_price!)) / parseFloat(product.regular_price!)) * 100)
        : 0;

    // 2. Fetch Initial Cart Count and Reviews
    useEffect(() => {
        // Fetch Reviews
        (async () => {
            try {
                const data = await productsService.getProductReviews(product.id);
                setReviews(data as any);
            } catch { /* silent */ }
            finally { setReviewsLoading(false); }
        })();

        // Fetch Cart Count
        (async () => {
            try {
                const cartData = await cartService.getCart();
                if (cartData && cartData.items) {
                    const count = cartData.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
                    setCartCount(count);
                }
            } catch (err) {
                console.error("Failed to load cart count", err);
            }
        })();
        // Execute Pending Cart Action if exists
        const pendingAction = getPendingAction();
        if (pendingAction && pendingAction.productId === product.id && isAuthenticated()) {
            if (pendingAction.type === 'DIRECT_CHECKOUT') {
                const url = pendingAction.paymentUrl;
                if (url) {
                    window.location.href = url;
                }
                clearPendingAction();
            } else {
                (async () => {
                    setAddingToCart(true);
                    try {
                        await cartService.addToCart(
                            pendingAction.productId,
                            pendingAction.quantity,
                            pendingAction.variationId,
                            pendingAction.customFields
                        );
                        setCartCount(prev => prev + pendingAction.quantity);
                        setAddedToCart(true);
                        setTimeout(() => setAddedToCart(false), 3000);
                    } catch (e) {
                        console.error('Failed to execute pending cart action', e);
                    } finally {
                        setAddingToCart(false);
                        clearPendingAction();
                    }
                })();
            }
        }
    }, [product.id, isAuthenticated]);

    // Initialize selected attributes from the first available variation
    useEffect(() => {
        if ((product.type === 'variable' || product.type === 'variable-subscription')) {
            if (product.variations && product.variations.length > 0) {
                const firstVar = product.variations[0];
                const initial: Record<string, string> = {};

                // Map variation attributes back to parent attribute names
                firstVar.attributes.forEach(vAttr => {
                    const parentAttr = product.attributes.find(
                        a => slugify(a.name) === slugify(vAttr.name)
                    );
                    if (parentAttr) {
                        initial[parentAttr.name] = vAttr.option;
                    }
                });

                // Fill in any missing attributes from their first options (fallback)
                product.attributes.forEach(attr => {
                    if (attr.variation && !initial[attr.name] && attr.options.length > 0) {
                        initial[attr.name] = attr.options[0];
                    }
                });
                setSelectedAttributes(initial);
            } else if (product.attributes) {
                const initial: Record<string, string> = {};
                product.attributes.forEach(attr => {
                    if (attr.variation && attr.options.length > 0) {
                        initial[attr.name] = attr.options[0];
                    }
                });
                setSelectedAttributes(initial);
            }
        }
    }, [product.id, product.type, product.attributes, product.variations]);

    // Helper to slugify attribute names for comparison
    const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Update selected variation when attributes change
    useEffect(() => {
        if ((product.type === 'variable' || product.type === 'variable-subscription') && product.variations) {
            const match = product.variations.find(v => {
                return v.attributes.every(attr => {
                    // Find matching key by slugifying both sides
                    const matchingKey = Object.keys(selectedAttributes).find(
                        key => slugify(key) === slugify(attr.name)
                    );
                    if (!matchingKey) return false;

                    const selectedValue = selectedAttributes[matchingKey];
                    return selectedValue === attr.option;
                });
            });
            setSelectedVariation(match || null);
        }
    }, [selectedAttributes, product.variations, product.type]);

    // Derive available options from variations to only show valid selectable items
    const availableOptions = useMemo(() => {
        const map: Record<string, Set<string>> = {};
        if (product.variations) {
            product.variations.forEach(v => {
                v.attributes.forEach(vAttr => {
                    const slugName = slugify(vAttr.name);
                    if (!map[slugName]) map[slugName] = new Set();
                    map[slugName].add(vAttr.option);
                });
            });
        }
        return map;
    }, [product.variations]);

    // Initialize custom fields
    useEffect(() => {
        if (product.addons && product.addons.length > 0) {
            const initial: Record<string, string> = {};
            product.addons.forEach(addon => {
                initial[addon.name] = '';
            });
            setCustomFields(initial);
        }
    }, [product.addons]);

    const handleAddToCart = async () => {
        if ((product.type === 'variable' || product.type === 'variable-subscription') && !selectedVariation) return;

        // Validate required custom fields
        for (const addon of product.addons || []) {
            if (addon.required && !customFields[addon.name]) {
                alert(`${addon.name} is required`);
                return;
            }
        }

        if (!isAuthenticated()) {
            savePendingAction({
                type: 'ADD_TO_CART',
                productId: product.id,
                quantity,
                variationId: (product.type === 'variable' || product.type === 'variable-subscription') ? selectedVariation?.id : undefined,
                customFields
            });
            redirectToLogin();
            return;
        }

        setAddingToCart(true);
        try {
            await cartService.addToCart(
                product.id,
                quantity,
                (product.type === 'variable' || product.type === 'variable-subscription') ? selectedVariation?.id : undefined,
                customFields
            );

            // 3. Increment Cart Count by the selected Quantity
            setCartCount(prev => prev + quantity);

            // If it's a VIP item with a seller/whop link, trigger the checkout modal immediately
            if (product.seller_payment_link || product.whop_payment_link) {
                window.dispatchEvent(new CustomEvent('open-checkout', {
                    detail: {
                        sellerLink: product.seller_payment_link,
                        whopLink: product.whop_payment_link,
                        method: product.seller_payment_link ? 'seller' : 'whop'
                    }
                }));
            } else {
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 3000);
            }
        } catch (err) {
            console.error('Failed to add to cart', err);
        } finally {
            setAddingToCart(false);
        }
    };

    const handleDirectCheckout = async (method: 'whop' | 'seller') => {
        // Validate required custom fields
        for (const addon of product.addons || []) {
            if (addon.required && !customFields[addon.name]) {
                alert(`${addon.name} is required`);
                return;
            }
        }

        if (!isAuthenticated()) {
            const directUrl = method === 'whop' ? product.whop_payment_link : product.seller_payment_link;
            savePendingAction({
                type: 'DIRECT_CHECKOUT',
                productId: product.id,
                quantity,
                method,
                paymentUrl: directUrl ?? undefined,
                variationId: (product.type === 'variable' || product.type === 'variable-subscription') ? selectedVariation?.id : undefined,
                customFields
            });
            redirectToLogin();
            return;
        }

        setAddingToCart(true);
        try {
            const url = method === 'whop' ? product.whop_payment_link : product.seller_payment_link;
            if (url) {
                window.location.href = url;
            } else {
                alert('Payment link not available');
                setAddingToCart(false);
            }
        } catch (err) {
            console.error('Failed to initiate direct checkout', err);
            setAddingToCart(false);
        }
    };

    const handleSubmitReview = async () => {
        setSubmittingReview(true);
        try {
            await productsService.createProductReview(product.id, reviewRating, reviewText);
            setReviewText('');
            setReviewSuccess(true);
            setTimeout(() => setReviewSuccess(false), 3000);
            // Refresh reviews
            const data = await productsService.getProductReviews(product.id);
            setReviews(data as any);
        } catch (err) {
            console.error('Failed to submit review', err);
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0e17]">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-purple-600/[0.03] blur-[120px]" />
            </div>

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* 4. Updated Top Bar: Flex container for Back Link + Cart Icon */}
                <div className="flex items-center justify-between mb-6">
                    <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Back to Shop
                    </Link>

                    {/* Cart Icon with Badge */}
                    <Link
                        href="/cart"
                        className="relative group p-2.5 bg-[#111827]/80 border border-white/[0.1] rounded-xl hover:bg-gray-800 transition-all hover:border-purple-500/50"
                    >
                        <ShoppingCart className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-[#0a0e17] animate-in zoom-in duration-300">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Gallery */}
                    <div>
                        <div className="relative bg-[#111827]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden aspect-square">
                            {images.length > 0 ? (
                                <img
                                    src={images[currentImage]?.src}
                                    alt={images[currentImage]?.alt || product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-16 h-16 text-gray-700" />
                                </div>
                            )}

                            {hasDiscount && (
                                <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                    {discount}% OFF
                                </span>
                            )}

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentImage(prev => (prev - 1 + images.length) % images.length)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImage(prev => (prev + 1) % images.length)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                                {images.map((img, i) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setCurrentImage(i)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${i === currentImage ? 'border-purple-500' : 'border-white/[0.06] hover:border-white/20'
                                            }`}
                                    >
                                        <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">{product.name}</h1>

                        {/* Rating */}
                        {product.average_rating && parseFloat(product.average_rating) > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star
                                            key={s}
                                            className={`w-4 h-4 ${s <= Math.round(parseFloat(product.average_rating!)) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-400">
                                    {product.average_rating} ({product.rating_count || 0} reviews)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6">
                            {(product.type === 'variable' || product.type === 'variable-subscription') && selectedVariation ? (
                                <>
                                    {selectedVariation.sale_price && selectedVariation.regular_price &&
                                        parseFloat(selectedVariation.sale_price) < parseFloat(selectedVariation.regular_price) && (
                                            <span className="text-gray-500 line-through text-lg">
                                                {formatCurrency(selectedVariation.regular_price)}
                                            </span>
                                        )}
                                    <span className="text-3xl font-bold text-white">
                                        {formatCurrency(selectedVariation.price)}
                                    </span>
                                </>
                            ) : (
                                <>
                                    {hasDiscount && (
                                        <span className="text-gray-500 line-through text-lg">
                                            {formatCurrency(product.regular_price)}
                                        </span>
                                    )}
                                    <span className="text-3xl font-bold text-white">
                                        {(product.type === 'variable' || product.type === 'variable-subscription')
                                            ? `${formatCurrency(product.regular_price)} - ${formatCurrency(product.price)}`
                                            : formatCurrency(product.price)}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Attribute Selectors for Variable Products */}
                        {(product.type === 'variable' || product.type === 'variable-subscription') && product.attributes && (
                            <div className="space-y-4 mb-8">
                                {product.attributes.filter(a => a.variation).map(attr => (
                                    <div key={attr.id} className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {attr.name}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {attr.options.filter(opt => {
                                                const slugName = slugify(attr.name);
                                                return availableOptions[slugName]?.has(opt);
                                            }).map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => setSelectedAttributes(prev => ({ ...prev, [attr.name]: opt }))}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selectedAttributes[attr.name] === opt
                                                        ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                                                        : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:border-white/20'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Short Description */}
                        {product.short_description && (
                            <div
                                className="text-gray-400 text-sm mb-6 prose prose-invert prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: product.short_description }}
                            />
                        )}

                        {/* Stock */}
                        <div className="flex items-center gap-2 mb-6">
                            {(product.type === 'variable' || product.type === 'variable-subscription') ? (
                                selectedVariation ? (
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${selectedVariation.stock_status === 'outofstock'
                                        ? 'bg-red-500/10 text-red-400'
                                        : 'bg-emerald-500/10 text-emerald-400'
                                        }`}>
                                        {selectedVariation.stock_status === 'outofstock' ? 'Out of Stock' : 'In Stock'}
                                    </span>
                                ) : (
                                    <span className="text-xs text-amber-400">Please select options</span>
                                )
                            ) : (
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${product.stock_status === 'outofstock'
                                    ? 'bg-red-500/10 text-red-400'
                                    : 'bg-emerald-500/10 text-emerald-400'
                                    }`}>
                                    {product.stock_status === 'outofstock' ? 'Out of Stock' : 'In Stock'}
                                </span>
                            )}
                            {(selectedVariation?.sku || product.sku) && (
                                <span className="text-xs text-gray-600">
                                    SKU: {selectedVariation?.sku || product.sku}
                                </span>
                            )}
                        </div>

                        {/* Custom Addon Fields */}
                        {product.addons && product.addons.length > 0 && (
                            <div className="space-y-4 mb-6">
                                {product.addons.map(addon => (
                                    <div key={addon.name} className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {addon.name} {addon.required && <span className="text-red-400">*</span>}
                                        </label>
                                        {addon.type === 'select' ? (
                                            <select
                                                value={customFields[addon.name] || ''}
                                                onChange={e => setCustomFields({ ...customFields, [addon.name]: e.target.value })}
                                                className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-purple-500/30 transition-colors appearance-none"
                                            >
                                                <option value="">Select...</option>
                                                {addon.options.map(opt => (
                                                    <option key={opt} value={opt} className="bg-[#111827] text-white">
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : addon.type === 'textarea' ? (
                                            <textarea
                                                rows={3}
                                                placeholder={addon.placeholder || ''}
                                                maxLength={addon.max_length || undefined}
                                                required={addon.required}
                                                value={customFields[addon.name] || ''}
                                                onChange={e => setCustomFields({ ...customFields, [addon.name]: e.target.value })}
                                                className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/30 transition-colors resize-none"
                                            />
                                        ) : (
                                            <input
                                                type={addon.type || 'text'}
                                                placeholder={addon.placeholder || ''}
                                                maxLength={addon.max_length || undefined}
                                                required={addon.required}
                                                value={customFields[addon.name] || ''}
                                                onChange={e => setCustomFields({ ...customFields, [addon.name]: e.target.value })}
                                                className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/30 transition-colors"
                                            />
                                        )}
                                        {addon.description && <p className="text-xs text-gray-500">{addon.description}</p>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Quantity + Add to Cart */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center border border-white/[0.06] rounded-xl bg-white/[0.03]">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2.5 text-gray-400 hover:text-white transition-colors">-</button>
                                <span className="px-4 py-2.5 text-white font-semibold text-sm">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2.5 text-gray-400 hover:text-white transition-colors">+</button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={addingToCart || product.stock_status === 'outofstock'}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-500/10 disabled:opacity-40"
                            >
                                {addingToCart ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : addedToCart ? (
                                    <><Check className="w-4 h-4" /> Added to Cart!</>
                                ) : (
                                    <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                                )}
                            </button>
                        </div>

                        {/* View Cart link */}
                        {addedToCart && (
                            <Link href="/cart" className="flex items-center justify-center gap-2 py-3 bg-[#111827]/80 border border-white/[0.1] text-white rounded-xl text-sm font-semibold transition-all mb-4">
                                View Cart →
                            </Link>
                        )}

                        {(product.whop_payment_link || product.seller_payment_link) && (
                            <div className="space-y-3 mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-white/[0.06]"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-[#0a0e17] px-2 text-gray-500 font-bold tracking-widest">Alternative Checkout</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {false && product.whop_payment_link && (
                                        <button
                                            onClick={() => handleDirectCheckout('whop')}
                                            className="flex items-center justify-center gap-2 py-3 bg-[#FC440F]/10 hover:bg-[#FC440F]/20 border border-[#FC440F]/20 text-[#FC440F] rounded-xl text-sm font-bold transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Buy on Whop
                                        </button>
                                    )}
                                    {product.seller_payment_link && (
                                        <button
                                            onClick={() => handleDirectCheckout('seller')}
                                            className="flex items-center justify-center gap-2 py-3 bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/20 text-cyan-400 rounded-xl text-sm font-bold transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Buy on Seller
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Full Description */}
                        {product.description && (
                            <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 mt-4">
                                <h3 className="text-white font-semibold text-sm mb-3">Description</h3>
                                <div
                                    className="text-gray-400 text-sm prose prose-invert prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-amber-400" />
                        Reviews ({reviews.length})
                    </h2>

                    {reviewsLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {reviews.length > 0 && (
                                <div className="grid gap-4 mb-8">
                                    {reviews.map((review, i) => (
                                        <div key={review.id || i} className="bg-[#111827]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-white" />
                                                    </div>
                                                    <span className="text-white text-sm font-semibold">{review.reviewer || 'Customer'}</span>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star
                                                            key={s}
                                                            className={`w-3.5 h-3.5 ${s <= (review.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: review.review || '' }} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Review Form */}
                            <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
                                <h3 className="text-white font-semibold text-sm mb-4">Write a Review</h3>
                                <div className="flex items-center gap-1 mb-3">
                                    <span className="text-xs text-gray-500 mr-2">Rating:</span>
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button key={s} onClick={() => setReviewRating(s)}>
                                            <Star className={`w-5 h-5 transition-colors ${s <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-gray-600 hover:text-amber-300'}`} />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    rows={3}
                                    placeholder="Share your experience..."
                                    value={reviewText}
                                    onChange={e => setReviewText(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/30 transition-colors resize-none mb-3"
                                />
                                {reviewSuccess && (
                                    <p className="text-emerald-400 text-xs mb-3">Review submitted successfully!</p>
                                )}
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={submittingReview || !reviewText.trim()}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40"
                                >
                                    {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Submit Review
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-xl font-bold text-white mb-6">Related Products</h2>
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                            {relatedProducts.map(rp => (
                                <Link
                                    key={rp.id}
                                    href={`/product/${rp.slug}`}
                                    className="bg-[#111827]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all group"
                                >
                                    <div className="aspect-square bg-gray-900/50 overflow-hidden">
                                        {rp.featured_image?.url || (rp.images && rp.images[0]) ? (
                                            <img src={rp.featured_image?.url || rp.images![0].src} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-gray-700" /></div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-white text-sm font-semibold truncate mb-1 group-hover:text-purple-400 transition-colors">{rp.name}</h3>
                                        <p className="text-white font-bold text-sm">{formatCurrency(rp.price)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleProductPage;

/**
 * WooCommerce Cart Service
 * Handles shopping cart operations
 */

import api from './api';
import type {
    WCAddToCartRequest,
    WCUpdateCartItemRequest,
    WCApplyCouponRequest,
    WCCart,
} from './types';

export type { WCCart };

export const cartService = {
    getCart: async (paymentMethod?: string): Promise<WCCart> => {
        const params = paymentMethod ? { payment_method: paymentMethod } : {};
        const response = await api.get<WCCart>('/wordpress/wc/cart', { params });
        return response.data;
    },

    /**
     * Add a product to the cart
     */
    addToCart: async (
        productId: number,
        quantity: number = 1,
        variationId?: number,
        customFields?: Record<string, string>
    ): Promise<WCCart> => {
        // Enforce single-item cart limit by auto-clearing previous items
        try {
            const currentCartResponse = await api.get<WCCart>('/wordpress/wc/cart');
            const currentCart = currentCartResponse.data;
            if (currentCart && currentCart.items && currentCart.items.length > 0) {
                await api.delete('/wordpress/wc/cart/clear');
            }
        } catch (e) {
            console.error('Failed to pre-clear cart for single-item enforcement', e);
        }

        const data: WCAddToCartRequest = {
            product_id: productId,
            quantity,
            variation_id: variationId,
            custom_fields: customFields,
        };
        const response = await api.post<WCCart>('/wordpress/wc/cart/add', data);

        // Dispatch event so UI components (Header, Modals) stay in sync
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cart-updated'));
        }

        return response.data;
    },

    /**
     * Update cart item quantity
     */
    updateCartItem: async (
        productId: number,
        quantity: number,
        variationId?: number
    ): Promise<WCCart> => {
        const data: WCUpdateCartItemRequest = {
            product_id: productId,
            quantity,
            variation_id: variationId,
        };
        const response = await api.put<WCCart>('/wordpress/wc/cart/update', data);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cart-updated'));
        }
        return response.data;
    },

    /**
     * Remove an item from the cart
     */
    removeFromCart: async (
        productId: number,
        variationId?: number
    ): Promise<WCCart> => {
        const params: { variation_id?: number } = {};
        if (variationId) {
            params.variation_id = variationId;
        }
        const response = await api.delete<WCCart>(
            `/wordpress/wc/cart/remove/${productId}`,
            { params }
        );
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cart-updated'));
        }
        return response.data;
    },

    /**
     * Clear all items from the cart
     */
    clearCart: async (paymentMethod?: string): Promise<WCCart> => {
        const params = paymentMethod ? { payment_method: paymentMethod } : {};
        const response = await api.delete<WCCart>('/wordpress/wc/cart/clear', { params });
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cart-updated'));
        }
        return response.data;
    },

    /**
     * Apply a coupon code to the cart
     */
    applyCoupon: async (couponCode: string, paymentMethod?: string): Promise<WCCart> => {
        const data: WCApplyCouponRequest = {
            coupon_code: couponCode,
        };
        const params = paymentMethod ? { payment_method: paymentMethod } : {};
        const response = await api.post<WCCart>(
            '/wordpress/wc/cart/coupon',
            data,
            { params }
        );
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cart-updated'));
        }
        return response.data;
    },

    /**
     * Remove a coupon from the cart
     */
    removeCoupon: async (couponCode: string, paymentMethod?: string): Promise<WCCart> => {
        const params = paymentMethod ? { payment_method: paymentMethod } : {};
        const response = await api.delete<WCCart>(
            `/wordpress/wc/cart/coupon/${couponCode}`,
            { params }
        );
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cart-updated'));
        }
        return response.data;
    },
};

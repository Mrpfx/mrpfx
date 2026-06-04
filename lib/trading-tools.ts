import api from './api';
import { TradingToolPagination, BookPagination } from './types';

export const tradingToolsService = {
    /**
     * Get trading tools (bots, indicators, etc.)
     */
    getTools: async (type?: 'bot' | 'indicator' | 'book', category?: 'vip' | 'free', limit: number = 20, offset: number = 0): Promise<any> => {
        try {
            if (type === 'book') {
                const isFree = category === 'free';
                const response = await api.get<BookPagination>('/books', {
                    params: { is_free: isFree, limit, offset }
                });
                return response.data;
            }

            const response = await api.get<TradingToolPagination>('/trading-tools', {
                params: { type, category, limit, offset }
            });
            return response.data;
        } catch (error) {
            console.warn(`Failed to fetch ${type || 'all'} tools for category ${category || 'all'}:`, error);
            throw error;
        }
    },

    /**
     * Get a single trading tool by ID
     */
    getTool: async (id: number): Promise<any> => {
        const response = await api.get(`/trading-tools/${id}`);
        return response.data;
    },

    /**
     * Get a single book by ID
     */
    getBook: async (id: number): Promise<any> => {
        const response = await api.get(`/books/${id}`);
        return response.data;
    }
};

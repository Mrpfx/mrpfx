import api from './api';
import { Signal, TradingVideo, SignalPagination } from './types';

export const signalsService = {
    /**
     * Get recent signals
     */
    getSignals: async (type: 'vip' | 'free', limit: number = 10): Promise<SignalPagination> => {
        try {
            const response = await api.get<SignalPagination>('/signals', { params: { type, limit } });
            return response.data;
        } catch (error) {
            console.warn(`Failed to fetch signals for type ${type}:`, error);
            throw error; // Let the component handle the fallback
        }
    },

    /**
     * Get trading-related YouTube videos
     */
    getVideos: async (limit: number = 3): Promise<TradingVideo[]> => {
        try {
            const response = await api.get<TradingVideo[]>('/videos/trading', { params: { limit } });
            return response.data;
        } catch (error) {
            console.warn('Failed to fetch trading videos:', error);
            throw error;
        }
    }
};

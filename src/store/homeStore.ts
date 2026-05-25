import { create } from 'zustand';
import { API_BASE } from '@/config/api';

interface HomeState {
    homeData: any;
    loading: boolean;
    error: string | null;
    fetchHomeData: () => Promise<void>;
    
    // Video Testimonials / Customer Favorites State
    favorites: any[];
    favoritesLoading: boolean;
    favoritesError: string | null;
    fetchFavorites: () => Promise<void>;
}

export const useHomeStore = create<HomeState>((set) => ({
    homeData: null,
    loading: false,
    error: null,

    // Video Testimonials Initial State
    favorites: [],
    favoritesLoading: false,
    favoritesError: null,

    fetchHomeData: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_BASE}/home`);
            if (!response.ok) throw new Error('Failed to fetch homepage data');
            const result = await response.json();
            if (result.success) {
                set({ homeData: result.data, loading: false });
            } else {
                set({ error: result.message, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    fetchFavorites: async () => {
        set({ favoritesLoading: true, favoritesError: null });
        try {
            const response = await fetch(`${API_BASE}/customer-favorites`);
            if (!response.ok) throw new Error('Failed to fetch customer favorites');
            const result = await response.json();
            if (result.success) {
                set({ favorites: result.items || [], favoritesLoading: false });
            } else {
                set({ favoritesError: result.message, favoritesLoading: false });
            }
        } catch (error: any) {
            set({ favoritesError: error.message, favoritesLoading: false });
        }
    }
}));

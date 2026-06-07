import { create } from 'zustand';
import { API_BASE } from '@/config/api';
import { useAuthStore } from './authStore';
import { useCartStore } from './cartStore';

interface RecentlyViewedState {
    recentlyViewed: any[];
    loading: boolean;
    error: string | null;
    fetchRecentlyViewed: () => Promise<void>;
    trackView: (productId: number | string) => Promise<void>;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>((set, get) => ({
    recentlyViewed: [],
    loading: false,
    error: null,

    fetchRecentlyViewed: async () => {
        set({ loading: true, error: null });
        try {
            // Retrieve active guest session and auth JWT token
            const guestId = useCartStore.getState().guestId;
            const token = useAuthStore.getState().token;

            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };
            if (guestId) headers['x-guest-id'] = guestId;
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_BASE}/recently-viewed`, { 
                headers,
                cache: 'no-store'
            });
            if (!response.ok) throw new Error('Failed to fetch recently viewed products');
            const data = await response.json();
            
            if (data.success) {
                set({ recentlyViewed: data.items || [], loading: false });
            } else {
                set({ error: data.message, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    trackView: async (productId) => {
        try {
            // Ensure guest ID exists prior to logging the view event
            useCartStore.getState().initGuest();
            const guestId = useCartStore.getState().guestId;
            const token = useAuthStore.getState().token;

            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };
            if (guestId) headers['x-guest-id'] = guestId;
            if (token) headers['Authorization'] = `Bearer ${token}`;

            await fetch(`${API_BASE}/recently-viewed`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ product_id: productId })
            });

            // Re-fetch recently viewed products to keep storefront lists hot and active
            await get().fetchRecentlyViewed();
        } catch (error) {
            console.error('Error tracking recently viewed product:', error);
        }
    }
}));

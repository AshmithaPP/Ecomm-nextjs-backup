import { create } from 'zustand';
import { API_BASE } from '@/config/api';

export interface NavigationItem {
    menu_id: string;
    title: string;
    slug?: string;
    route_path: string;
    menu_type: 'internal' | 'external';
    parent_id: string | null;
    sort_order: number;
    is_active: number;
    open_in_new_tab: number;
    created_at?: string;
    updated_at?: string;
}

interface NavigationState {
    navigationItems: NavigationItem[];
    loading: boolean;
    error: string | null;
    fetchNavigation: () => Promise<void>;
}

export const useNavigationStore = create<NavigationState>((set) => ({
    navigationItems: [],
    loading: false,
    error: null,

    fetchNavigation: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_BASE}/navigation?t=${Date.now()}`, {
                cache: 'no-store'
            });
            if (!response.ok) throw new Error('Failed to fetch navigation items');
            const result = await response.json();
            if (result.success) {
                // Filter only active items and sort them by sort_order
                const items = (result.data || [])
                    .filter((item: NavigationItem) => item.is_active === 1)
                    .sort((a: NavigationItem, b: NavigationItem) => a.sort_order - b.sort_order);
                set({ navigationItems: items, loading: false });
            } else {
                set({ error: result.message, loading: false });
            }
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    }
}));

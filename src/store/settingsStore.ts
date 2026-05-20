import { create } from 'zustand';
import { API_BASE } from '@/config/api';

interface SettingsState {
    settings: any;
    loading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>;
    getHeroSettings: () => any;
    getSiteInfo: () => any;
    getStoreSettings: () => any;
    getBannerSettings: () => any;
    getFooterSettings: () => any;
}

const API_BASE_URL = API_BASE;

export const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: null,
    loading: false,
    error: null,

    fetchSettings: async () => {
        if (get().settings) return;

        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_BASE_URL}/settings`);

            if (!response.ok) {
                throw new Error(`Error fetching settings: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                if (data.data && data.data.blog_hero) {
                    delete data.data.blog_hero;
                }
                set({ settings: data.data, loading: false });
            } else {
                set({ error: "Failed to fetch settings", loading: false });
            }
        } catch (err: any) {
            set({ error: err.message || "An error occurred", loading: false });
        }
    },

    getHeroSettings: () => {
        return get().settings?.hero_settings || {
            title: "Timeless Kanchipuram Silk Sarees",
            subtitle: "Handwoven heritage. Pure mulberry silk. Authentic zari.",
            image: "",
            buttonLink: "/products",
            buttonText: "Explore Collections"
        };
    },

    getSiteInfo: () => {
        const raw = get().settings?.site_info;
        let info = {
            site_url: "",
            site_title: "",
            site_logo: "",
            email: "",
            phone: "",
            address: ""
        };

        if (Array.isArray(raw)) {
            raw.forEach(item => {
                const name = item.name?.toLowerCase();
                if (name?.includes('url')) info.site_url = item.value;
                if (name?.includes('title')) info.site_title = item.value;
                if (name?.includes('logo')) info.site_logo = item.value;
                if (name?.includes('email')) info.email = item.value;
                if (name?.includes('phone')) info.phone = item.value;
                if (name?.includes('address')) info.address = item.value;
            });
        } else if (raw && typeof raw === 'object') {
            info = {
                ...info,
                ...raw,
                site_logo: raw.site_logo || raw.logo || raw.website_logo || info.site_logo,
                site_title: raw.site_title || raw.title || raw.website_title || info.site_title
            };
        }
        return info;
    },

    getStoreSettings: () => {
        return get().settings?.store_settings || {
            gst: 0,
            currency: "₹",
            default_stock: 0
        };
    },

    getBannerSettings: () => {
        return get().settings?.banner_settings || {
            image: "",
            title: "",
            enabled: false,
            endDate: "",
            startDate: "",
            description: ""
        };
    },

    getFooterSettings: () => {
        const fs = get().settings?.footer_settings;
        return {
            about_text: fs?.about_text || "The Silk Curator preserves traditional Kanchipuram weaving guilds, bringing you pure South Indian mulberry silk sarees with authentic gold zari directly from master artisan families.",
            contact_info: fs?.contact_info || {
                email: "support@silkcurator.com",
                phone: "+91 98765 43210",
                address: "123, Silk Bazaar, Kanchipuram, Tamil Nadu - 631501"
            },
            social_links: fs?.social_links || {
                youtube: "https://youtube.com",
                facebook: "https://facebook.com",
                whatsapp: "https://wa.me",
                instagram: "https://instagram.com"
            },
            links_group_1: fs?.links_group_1 || [
                { path: "/", label: "Home" },
                { path: "/shop-sarees", label: "Shop Sarees" },
                { path: "/heritage", label: "Heritage" }
            ],
            links_group_2: fs?.links_group_2 || [
                { path: "/terms", label: "Terms & Conditions" },
                { path: "/privacy", label: "Privacy Policy" },
                { path: "/refunds", label: "Refund Policy" }
            ],
            copyright_text: fs?.copyright_text || "© 2026 The Silk Curator. All Rights Reserved."
        };
    }
}));

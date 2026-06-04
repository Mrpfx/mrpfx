'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

export interface PricingTier {
    price: number;
    sellerLink: string;
}

export interface PropFirmSettings {
    discountActive: boolean;
    discountPercentage: number;
    pricingTiers: Record<string, PricingTier>;
}

const SETTINGS_FILE = path.join(process.cwd(), 'prop-firm-settings.json');

const DEFAULT_SETTINGS: PropFirmSettings = {
    discountActive: false,
    discountPercentage: 0,
    pricingTiers: {
        // Guaranteed Pass | 2-Step | Step 1 Only
        "guaranteed-2step-step1-50000": { price: 800, sellerLink: "" },
        "guaranteed-2step-step1-100000": { price: 1200, sellerLink: "" },
        "guaranteed-2step-step1-200000": { price: 1700, sellerLink: "" },
        "guaranteed-2step-step1-500000": { price: 2500, sellerLink: "" },
        // Guaranteed Pass | 2-Step | Full Pass
        "guaranteed-2step-full-50000": { price: 1100, sellerLink: "" },
        "guaranteed-2step-full-100000": { price: 1600, sellerLink: "" },
        "guaranteed-2step-full-200000": { price: 2200, sellerLink: "" },
        "guaranteed-2step-full-500000": { price: 3200, sellerLink: "" },
        // Guaranteed Pass | 1-Step | Full
        "guaranteed-1step-full-50000": { price: 1400, sellerLink: "" },
        "guaranteed-1step-full-100000": { price: 1900, sellerLink: "" },
        "guaranteed-1step-full-200000": { price: 2600, sellerLink: "" },
        "guaranteed-1step-full-500000": { price: 3800, sellerLink: "" },
        // Standard Pass | 2-Step | Step 1 Only
        "standard-2step-step1-50000": { price: 490, sellerLink: "" },
        "standard-2step-step1-100000": { price: 690, sellerLink: "" },
        "standard-2step-step1-200000": { price: 990, sellerLink: "" },
        "standard-2step-step1-300000": { price: 1390, sellerLink: "" },
        "standard-2step-step1-500000": { price: 1790, sellerLink: "" },
        // Standard Pass | 2-Step | Full Pass
        "standard-2step-full-50000": { price: 650, sellerLink: "" },
        "standard-2step-full-100000": { price: 850, sellerLink: "" },
        "standard-2step-full-200000": { price: 1290, sellerLink: "" },
        "standard-2step-full-500000": { price: 1790, sellerLink: "" },
        // Standard Pass | 1-Step | Full
        "standard-1step-full-50000": { price: 1400, sellerLink: "" },
        "standard-1step-full-100000": { price: 1900, sellerLink: "" },
        "standard-1step-full-200000": { price: 2600, sellerLink: "" },
        "standard-1step-full-500000": { price: 3800, sellerLink: "" },
    }
};

export async function getPropFirmSettings(): Promise<PropFirmSettings> {
    try {
        const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        return {
            ...DEFAULT_SETTINGS,
            ...parsed,
            pricingTiers: { ...DEFAULT_SETTINGS.pricingTiers, ...(parsed.pricingTiers || {}) }
        } as PropFirmSettings;
    } catch (error) {
        console.warn('Failed to read prop-firm-settings.json, using defaults.');
        return DEFAULT_SETTINGS;
    }
}

export async function updatePropFirmSettings(settings: Partial<PropFirmSettings>): Promise<PropFirmSettings> {
    const current = await getPropFirmSettings();
    const updated = { ...current, ...settings };
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(updated, null, 2));
    revalidatePath('/', 'layout');
    return updated;
}

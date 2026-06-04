'use server'

import fs from 'fs/promises';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'vip-settings.json');

export interface VIPPlanSlugs {
    oneMonth: { slug: string };
    twelveMonths: { slug: string };
    unlimited: { slug: string };
}

export interface VIPSettings {
    plans: VIPPlanSlugs;
    registrationOpenDate: string | null;
    groupPageLink: string;
}

const DEFAULT_SETTINGS: VIPSettings = {
    plans: {
        oneMonth: { slug: 'vip-signals-1-month' },
        twelveMonths: { slug: 'vip-signals-12-months' },
        unlimited: { slug: 'vip-signals-unlimited' },
    },
    registrationOpenDate: null,
    groupPageLink: '',
};

export async function getVIPSettings(): Promise<VIPSettings> {
    try {
        const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return DEFAULT_SETTINGS;
    }
}

export async function updateVIPSettings(data: VIPSettings): Promise<{ success: boolean }> {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true };
}

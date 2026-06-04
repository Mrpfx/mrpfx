'use server';

import fs from 'fs/promises';
import path from 'path';

export interface CopyTradingSettings {
    monthlyFee: number;
    placeholder: string;
    productSlug: string;
}

const SETTINGS_PATH = path.join(process.cwd(), 'copy-trading-settings.json');

export async function getCopyTradingSettings(): Promise<CopyTradingSettings> {
    try {
        const data = await fs.readFile(SETTINGS_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return {
            monthlyFee: 399,
            placeholder: "Monthly Subscription Fee",
            productSlug: "copy-trading-monthly"
        };
    }
}

export async function updateCopyTradingSettings(settings: CopyTradingSettings) {
    await fs.writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 4));
    return { success: true };
}

'use server'

import fs from 'fs/promises';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'account-management-settings.json');

export interface AccountManagementTier {
    min: number;
    max: number;
    fee: number;
    target: number;
    slug: string;
}

export interface AccountManagementSettings {
    minCapital: number;
    placeholder: string;
    tiers?: AccountManagementTier[];
}

const DEFAULT_SETTINGS: AccountManagementSettings = {
    minCapital: 500,
    placeholder: 'Capital Amount (Min $500)',
};

export async function getAccountManagementSettings(): Promise<AccountManagementSettings> {
    try {
        const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return DEFAULT_SETTINGS;
    }
}

export async function updateAccountManagementSettings(data: AccountManagementSettings): Promise<{ success: boolean }> {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true };
}

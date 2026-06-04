'use server'

import fs from 'fs/promises';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'physical-classes-settings.json');

export async function getPhysicalClassesSettings() {
    try {
        const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        // Return default if file doesn't exist
        return {
            classASlug: 'physical-class-a',
            classBSlug: 'physical-class-b'
        };
    }
}

export async function updatePhysicalClassesSettings(data: { classASlug: string, classBSlug: string }) {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true };
}

'use server'

import fs from 'fs/promises';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'youtube-settings.json');

export interface DynamicVideo {
    id: string; // youtube_id
    title: string;
    thumbnail: string;
}

export interface YoutubeSettings {
    apiKey: string;
    channelId: string;
    defaultVideos: DynamicVideo[];
}

const DEFAULT_SETTINGS: YoutubeSettings = {
    apiKey: '',
    channelId: 'UC1m-GvV3P83C66m105c_n6g',
    defaultVideos: [
        {
            id: "8hrXc3vvUYk",
            title: "Mr P Fx Official Trading Strategy",
            thumbnail: "https://img.youtube.com/vi/8hrXc3vvUYk/hqdefault.jpg"
        },
        {
            id: "Tl0Xv26Xn5g",
            title: "Live Trading Session with Mr P",
            thumbnail: "https://img.youtube.com/vi/Tl0Xv26Xn5g/hqdefault.jpg"
        },
        {
            id: "RTSjkojGsqc",
            title: "Forex Market Analysis & Tips",
            thumbnail: "https://img.youtube.com/vi/RTSjkojGsqc/hqdefault.jpg"
        }
    ]
};

export async function getYoutubeSettings(): Promise<YoutubeSettings> {
    try {
        const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
        const settings = JSON.parse(data);
        return {
            ...DEFAULT_SETTINGS,
            ...settings
        };
    } catch (e) {
        return DEFAULT_SETTINGS;
    }
}

export async function updateYoutubeSettings(data: Partial<YoutubeSettings>): Promise<{ success: boolean }> {
    try {
        const current = await getYoutubeSettings();
        const updated = { ...current, ...data };
        await fs.writeFile(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
        return { success: true };
    } catch (e) {
        console.error("Failed to update YouTube settings:", e);
        return { success: false };
    }
}

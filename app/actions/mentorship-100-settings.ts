'use server'

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const SETTINGS_FILE = path.join(process.cwd(), 'mentorship-100-settings.json');

const DEFAULT_MENTORSHIP_100_SETTINGS = {
    registrationOpenDate: null as string | null,
    productSlug: 'mentorship-100',
    heroImage: '/images/home/trading_mentor_preview.png',
    heroVideoUrl: '',
    heroTitle1: 'Live One-On-One',
    heroTitle2: 'Trading Mentorship',
    heroSubtitle: 'With Mr P',
    courseDateText: 'March 2nd – 10th, 2026',
    heroDescription: 'During this program, Mr P will personally teach LIVE through Zoom, guiding you step-by-step through real market execution and advanced chart mastery.',
    pinnedNote: 'All classes will be recorded and sent to the private group after each session in case you miss any live class.',
    primaryCtaText: 'RESERVE YOUR SEAT NOW',
    secondaryCtaText: 'JOIN NOW – LIMITED SPOTS!',
    secondaryCtaLink: '',
    limitedAdmissionTitle: 'Limited Admission',
    limitedAdmissionPoints: [
        'To maintain real interaction during the Zoom sessions, only 100 TRADERS will be accepted into this mentorship program.',
        'Once the seats are filled, registration will permanently close.'
    ],
    whatYouWillLearnTitle: 'What You Will Learn',
    whatYouWillLearnPoints: [
        'Full basics and foundations of Forex trading and Indices',
        'Complete intermediate-level trading systems',
        'Extremely advanced-level trading execution',
        'Real-time LIVE trading practice',
        'Advanced market structure analysis',
        'Prop firm challenge strategies',
        'Mentorship competition analysis',
        'Funding opportunity up to $10,000',
        'Private LIVE trading with Mr P'
    ],
    transformationText1: 'This Is Not a Normal Forex Class —',
    transformationText2: 'This is a Trading Transformation',
    detailsTitle: 'Registration Details',
    detailsDateRange: 'March 2nd-10th',
    detailsInclusions: [
        '12 months VIP group',
        'Access to VIP tools',
        'Private live sessions',
        'Recorded classes'
    ],
    bottomCtaText: 'JOIN NOW – LIMITED!'
};

export async function getMentorship100Settings() {
    try {
        const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
        return { ...DEFAULT_MENTORSHIP_100_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
        // Return default if file doesn't exist
        return DEFAULT_MENTORSHIP_100_SETTINGS;
    }
}

export async function updateMentorship100Settings(data: typeof DEFAULT_MENTORSHIP_100_SETTINGS) {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    revalidatePath('/admin/settings');
    revalidatePath('/mentorship-course-100');
    revalidatePath('/');
    return { success: true };
}

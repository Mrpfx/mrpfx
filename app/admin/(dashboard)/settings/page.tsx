'use client';

import React, { useState, useEffect } from 'react';
import { getMentorshipSettings, updateMentorshipSettings } from '@/app/actions/mentorship-settings';
import { getMentorship100Settings, updateMentorship100Settings } from '@/app/actions/mentorship-100-settings';
import { getVIPSettings, updateVIPSettings, VIPSettings } from '@/app/actions/vip-settings';
import { getPrivateMentorshipSettings, updatePrivateMentorshipSettings } from '@/app/actions/private-mentorship-settings';
import { getPromoBannerSettings, updatePromoBannerSettings } from '@/app/actions/promo-banner-settings';
import { getAccountManagementSettings, updateAccountManagementSettings, AccountManagementSettings } from '@/app/actions/account-management-settings';
import { getYoutubeSettings, updateYoutubeSettings } from '@/app/actions/youtube-settings';
import { getPhysicalClassesSettings, updatePhysicalClassesSettings } from '@/app/actions/physical-classes-settings';
import { Save, Youtube, MapPin } from 'lucide-react';

export default function SettingsPage() {
    const [date, setDate] = useState('');
    const [productSlug, setProductSlug] = useState('standard-mentorship');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [date100, setDate100] = useState('');
    const [productSlug100, setProductSlug100] = useState('mentorship-100');
    const [saving100, setSaving100] = useState(false);
    const [message100, setMessage100] = useState('');

    const [vipSlugs, setVipSlugs] = useState({ oneMonth: '', twelveMonths: '', unlimited: '' });
    const [vipDate, setVipDate] = useState('');
    const [vipGroupLink, setVipGroupLink] = useState('');
    const [savingVip, setSavingVip] = useState(false);
    const [vipMessage, setVipMessage] = useState('');

    const [classASlug, setClassASlug] = useState('private-mentorship-class-a');
    const [classBSlug, setClassBSlug] = useState('private-mentorship-class-b');
    const [savingPrivate, setSavingPrivate] = useState(false);
    const [privateMessage, setPrivateMessage] = useState('');

    const [physClassASlug, setPhysClassASlug] = useState('physical-class-a');
    const [physClassBSlug, setPhysClassBSlug] = useState('physical-class-b');
    const [savingPhys, setSavingPhys] = useState(false);
    const [physMessage, setPhysMessage] = useState('');



    const [promoActive, setPromoActive] = useState(false);
    const [promoText, setPromoText] = useState('');
    const [promoLink, setPromoLink] = useState('');
    const [promoColor, setPromoColor] = useState('bg-[#5B2EFF]');
    const [savingPromo, setSavingPromo] = useState(false);
    const [promoMessage, setPromoMessage] = useState('');

    const [accMgmtMinCapital, setAccMgmtMinCapital] = useState(500);
    const [accMgmtPlaceholder, setAccMgmtPlaceholder] = useState('');
    const [savingAccMgmt, setSavingAccMgmt] = useState(false);
    const [accMgmtMessage, setAccMgmtMessage] = useState('');

    const [youtubeApiKey, setYoutubeApiKey] = useState('');
    const [youtubeChannelId, setYoutubeChannelId] = useState('');
    const [savingYoutube, setSavingYoutube] = useState(false);
    const [youtubeMessage, setYoutubeMessage] = useState('');

    useEffect(() => {
        getMentorshipSettings().then(data => {
            if (data?.registrationOpenDate) {
                const localDate = new Date(data.registrationOpenDate);
                const offset = localDate.getTimezoneOffset() * 60000;
                const localISOTime = new Date(localDate.getTime() - offset).toISOString().slice(0, 16);
                setDate(localISOTime);
            }
            if (data?.productSlug) {
                setProductSlug(data.productSlug);
            }
            setLoading(false);
        });
        getMentorship100Settings().then(data => {
            if (data?.registrationOpenDate) {
                const localDate = new Date(data.registrationOpenDate);
                const offset = localDate.getTimezoneOffset() * 60000;
                const localISOTime = new Date(localDate.getTime() - offset).toISOString().slice(0, 16);
                setDate100(localISOTime);
            }
            if (data?.productSlug) {
                setProductSlug100(data.productSlug);
            }
        });
        getVIPSettings().then(data => {
            setVipSlugs({
                oneMonth: data.plans.oneMonth.slug || '',
                twelveMonths: data.plans.twelveMonths.slug || '',
                unlimited: data.plans.unlimited.slug || '',
            });
            if (data.registrationOpenDate) {
                const localDate = new Date(data.registrationOpenDate);
                const offset = localDate.getTimezoneOffset() * 60000;
                const localISOTime = new Date(localDate.getTime() - offset).toISOString().slice(0, 16);
                setVipDate(localISOTime);
            }
            setVipGroupLink(data.groupPageLink || '');
        });
        getPrivateMentorshipSettings().then(data => {
            if (data?.classASlug) setClassASlug(data.classASlug);
            if (data?.classBSlug) setClassBSlug(data.classBSlug);
        });

        getPromoBannerSettings().then(data => {
            setPromoActive(data.active || false);
            setPromoText(data.text || '');
            setPromoLink(data.link || '');
            setPromoColor(data.backgroundColor || 'bg-[#5B2EFF]');
        });
        getAccountManagementSettings().then(data => {
            setAccMgmtMinCapital(data.minCapital || 500);
            setAccMgmtPlaceholder(data.placeholder || '');
        });
        getYoutubeSettings().then(data => {
            setYoutubeApiKey(data.apiKey || '');
            setYoutubeChannelId(data.channelId || 'UC1m-GvV3P83C66m105c_n6g');
        });
        getPhysicalClassesSettings().then(data => {
            if (data?.classASlug) setPhysClassASlug(data.classASlug);
            if (data?.classBSlug) setPhysClassBSlug(data.classBSlug);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const isoString = date ? new Date(date).toISOString() : null;
            await updateMentorshipSettings({ registrationOpenDate: isoString, productSlug });
            setMessage('Settings saved successfully!');
        } catch (e) {
            setMessage('Failed to save settings.');
        }
        setSaving(false);
    };

    const handleSave100 = async () => {
        setSaving100(true);
        setMessage100('');
        try {
            const isoString = date100 ? new Date(date100).toISOString() : null;
            await updateMentorship100Settings({ registrationOpenDate: isoString, productSlug: productSlug100 });
            setMessage100('Mentorship 100 settings saved successfully!');
        } catch (e) {
            setMessage100('Failed to save settings.');
        }
        setSaving100(false);
    };

    const handleSaveVip = async () => {
        setSavingVip(true);
        setVipMessage('');
        try {
            const settings: VIPSettings = {
                plans: {
                    oneMonth: { slug: vipSlugs.oneMonth },
                    twelveMonths: { slug: vipSlugs.twelveMonths },
                    unlimited: { slug: vipSlugs.unlimited },
                },
                registrationOpenDate: vipDate ? new Date(vipDate).toISOString() : null,
                groupPageLink: vipGroupLink
            };
            await updateVIPSettings(settings);
            setVipMessage('VIP settings saved successfully!');
        } catch (e) {
            setVipMessage('Failed to save VIP links.');
        }
        setSavingVip(false);
    };

    const handleSavePrivate = async () => {
        setSavingPrivate(true);
        setPrivateMessage('');
        try {
            await updatePrivateMentorshipSettings({ classASlug, classBSlug });
            setPrivateMessage('Private mentorship settings saved successfully!');
        } catch (e) {
            setPrivateMessage('Failed to save private mentorship settings.');
        }
        setSavingPrivate(false);
    };

    const handleSavePhys = async () => {
        setSavingPhys(true);
        setPhysMessage('');
        try {
            await updatePhysicalClassesSettings({ classASlug: physClassASlug, classBSlug: physClassBSlug });
            setPhysMessage('Physical classes settings saved successfully!');
        } catch (e) {
            setPhysMessage('Failed to save physical classes settings.');
        }
        setSavingPhys(false);
    };



    const handleSavePromo = async () => {
        setSavingPromo(true);
        setPromoMessage('');
        try {
            await updatePromoBannerSettings({
                active: promoActive,
                text: promoText,
                link: promoLink,
                backgroundColor: promoColor
            });
            setPromoMessage('Promo banner settings saved successfully!');
        } catch (e) {
            setPromoMessage('Failed to save promo banner settings.');
        }
        setSavingPromo(false);
    };

    const handleSaveAccMgmt = async () => {
        setSavingAccMgmt(true);
        setAccMgmtMessage('');
        try {
            await updateAccountManagementSettings({
                minCapital: accMgmtMinCapital,
                placeholder: accMgmtPlaceholder
            });
            setAccMgmtMessage('Account management settings saved successfully!');
        } catch (e) {
            setAccMgmtMessage('Failed to save settings.');
        }
        setSavingAccMgmt(false);
    };

    const handleSaveYoutube = async () => {
        setSavingYoutube(true);
        setYoutubeMessage('');
        try {
            await updateYoutubeSettings({
                apiKey: youtubeApiKey,
                channelId: youtubeChannelId
            });
            setYoutubeMessage('YouTube settings saved successfully!');
        } catch (e) {
            setYoutubeMessage('Failed to save settings.');
        }
        setSavingYoutube(false);
    };

    if (loading) return <div className="p-8 text-gray-400">Loading settings...</div>;

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white">Global Settings</h1>

            {/* YouTube API & Video Feed Settings */}
            <div className="bg-[#1F2937] rounded-xl shadow-sm border border-gray-800 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    <Youtube className="w-6 h-6 text-red-600" />
                    YouTube API & Video Feed
                </h2>
                <p className="text-sm text-gray-500 mb-6 font-medium">
                    Configure the YouTube Data API to fetch live videos for the homepage.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        YouTube API Key (v3)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                        If left blank, the site will automatically fall back to the three default videos.
                    </p>
                    <input
                        type="password"
                        value={youtubeApiKey}
                        onChange={(e) => setYoutubeApiKey(e.target.value)}
                        placeholder="Paste your Google API Key here..."
                        className="w-full p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none placeholder-gray-600 font-mono text-sm"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        YouTube Channel ID
                    </label>
                    <input
                        type="text"
                        value={youtubeChannelId}
                        onChange={(e) => setYoutubeChannelId(e.target.value)}
                        placeholder="UC1m-GvV3P83C66m105c_n6g"
                        className="w-full md:w-1/2 p-3 bg-[#111827] border border-gray-800 text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none placeholder-gray-600 font-mono text-sm"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSaveYoutube}
                        disabled={savingYoutube}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {savingYoutube ? 'Saving...' : 'Save YouTube Settings'}
                    </button>
                    {youtubeMessage && (
                        <span className={`text-sm ${youtubeMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                            {youtubeMessage}
                        </span>
                    )}
                </div>
            </div>

            {/* Global Promo Banner */}
            <div className="bg-[#1F2937] rounded-xl shadow-sm border border-gray-800 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Global Promo Banner</h2>

                <div className="mb-6 flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="promoActive"
                        checked={promoActive}
                        onChange={(e) => setPromoActive(e.target.checked)}
                        className="w-5 h-5 bg-[#111827] border-gray-700 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="promoActive" className="text-sm font-medium text-gray-300 cursor-pointer">
                        Activate Promo Banner
                    </label>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Banner Text
                    </label>
                    <input
                        type="text"
                        value={promoText}
                        onChange={(e) => setPromoText(e.target.value)}
                        placeholder="e.g. Eid Mubarak! Use code FP..."
                        className="w-full p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 font-mono text-sm"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Banner Link (Optional)
                    </label>
                    <input
                        type="text"
                        value={promoLink}
                        onChange={(e) => setPromoLink(e.target.value)}
                        placeholder="e.g. /pass-funded-accounts"
                        className="w-full md:w-1/2 p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 font-mono text-sm"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Background Color
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {[
                            { value: 'bg-[#5B2EFF]', label: 'Brand Purple' },
                            { value: 'bg-emerald-600', label: 'Emerald' },
                            { value: 'bg-red-600', label: 'Danger Red' },
                            { value: 'bg-indigo-600', label: 'Indigo' },
                            { value: 'bg-slate-900', label: 'Dark Mode' },
                            { value: 'bg-gradient-to-r from-purple-600 to-blue-600', label: 'Purple/Blue Gradient' },
                            { value: 'bg-gradient-to-r from-red-600 to-orange-600', label: 'Red/Orange Gradient' }
                        ].map((color) => (
                            <label key={color.value} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="promoColor"
                                    value={color.value}
                                    checked={promoColor === color.value}
                                    onChange={(e) => setPromoColor(e.target.value)}
                                    className="w-4 h-4 text-blue-600 bg-[#111827] border-gray-700"
                                />
                                <div className={`w-6 h-6 rounded-full ${color.value} border border-gray-600`}></div>
                                <span className="text-sm text-gray-300">{color.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSavePromo}
                        disabled={savingPromo}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {savingPromo ? 'Saving...' : 'Save Promo Banner Settings'}
                    </button>
                    {promoMessage && (
                        <span className={`text-sm ${promoMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                            {promoMessage}
                        </span>
                    )}
                </div>
            </div>

            {/* Standard Mentorship Settings */}
            <div className="bg-[#1F2937] rounded-xl shadow-sm border border-gray-800 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Standard Mentorship</h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Registration Open Date & Time
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                        Lock screen date for Standard Mentorship page. Leave empty to disable.
                    </p>
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full md:w-1/2 p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Standard Mentorship Product Slug
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                        The WooCommerce product slug for Standard Mentorship.
                    </p>
                    <input
                        type="text"
                        value={productSlug}
                        onChange={(e) => setProductSlug(e.target.value)}
                        placeholder="standard-mentorship"
                        className="w-full md:w-1/2 p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 font-mono"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Standard Settings'}
                    </button>
                    {message && (
                        <span className={`text-sm ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                            {message}
                        </span>
                    )}
                </div>
            </div>

            {/* Mentorship Course 100 Settings */}
            <div className="bg-[#1F2937] rounded-xl shadow-sm border border-gray-800 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Mentorship Course 100</h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Registration Open Date & Time
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                        Lock screen date for Mentorship Course 100 page.
                    </p>
                    <input
                        type="datetime-local"
                        value={date100}
                        onChange={(e) => setDate100(e.target.value)}
                        className="w-full md:w-1/2 p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mentorship 100 Product Slug
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                        The WooCommerce product slug for Mentorship Course 100 (e.g., mentorship-100).
                    </p>
                    <input
                        type="text"
                        value={productSlug100}
                        onChange={(e) => setProductSlug100(e.target.value)}
                        placeholder="mentorship-100"
                        className="w-full md:w-1/2 p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 font-mono"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSave100}
                        disabled={saving100}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving100 ? 'Saving...' : 'Save Mentorship 100 Settings'}
                    </button>
                    {message100 && (
                        <span className={`text-sm ${message100.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                            {message100}
                        </span>
                    )}
                </div>
            </div>

            {/* VIP Signals Payment Links */}
            <div className="bg-[#1F2937] rounded-xl shadow-sm border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-1 text-white">VIP Signals – Payment Links</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Set the payment link for each VIP plan. When a user clicks a plan in the modal, they will be redirected to the corresponding link. Leave empty to disable the link.
                </p>

                <div className="space-y-4 mb-6">
                    {([
                        { label: '1 Month – $39 (STARTER)', key: 'oneMonth' },
                        { label: '12 Months – $299 (BEST VALUE)', key: 'twelveMonths' },
                        { label: 'Unlimited – $499 (BEST DEAL)', key: 'unlimited' },
                    ] as { label: string; key: keyof typeof vipSlugs }[]).map(({ label, key }) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                            <input
                                type="text"
                                value={vipSlugs[key]}
                                onChange={(e) => setVipSlugs(prev => ({ ...prev, [key]: e.target.value }))}
                                placeholder="vip-membership-1-month"
                                className="w-full p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none placeholder-gray-500 font-mono text-sm"
                            />
                        </div>
                    ))}
                </div>

                <hr className="border-gray-800 my-6" />

                <h3 className="text-lg font-semibold mb-4 text-white">VIP Signals Group Page Settings</h3>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Registration Open Date & Time
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                        If set to a future date, the VIP Signals Group page will be locked and a registration closed screen will be displayed.
                    </p>
                    <input
                        type="datetime-local"
                        value={vipDate}
                        onChange={(e) => setVipDate(e.target.value)}
                        className="w-full md:w-1/2 p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none placeholder-gray-500"
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Main Checkout Slug or URL
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                        Primary product slug (e.g., vip-membership) or external Sellar link for the VIP Signals Group page CTA button.
                    </p>
                    <input
                        type="text"
                        value={vipGroupLink}
                        onChange={(e) => setVipGroupLink(e.target.value)}
                        placeholder="vip-membership"
                        className="w-full p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none placeholder-gray-500 font-mono text-sm"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSaveVip}
                        disabled={savingVip}
                        className="flex items-center gap-2 px-6 py-2.5 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {savingVip ? 'Saving...' : 'Save VIP Settings'}
                    </button>
                    {vipMessage && (
                        <span className={`text-sm ${vipMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                            {vipMessage}
                        </span>
                    )}
                </div>
            </div>

            {/* Private Mentorship Settings */}
            <div className="bg-[#1F2937] rounded-xl shadow-sm border border-gray-800 p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Private 1-on-1 Mentorship</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Class A Product Slug
                        </label>
                        <input
                            type="text"
                            value={classASlug}
                            onChange={(e) => setClassASlug(e.target.value)}
                            placeholder="private-mentorship-class-a"
                            className="w-full p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600 font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Class B Product Slug
                        </label>
                        <input
                            type="text"
                            value={classBSlug}
                            onChange={(e) => setClassBSlug(e.target.value)}
                            placeholder="private-mentorship-class-b"
                            className="w-full p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600 font-mono"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSavePrivate}
                        disabled={savingPrivate}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {savingPrivate ? 'Saving...' : 'Save Private Mentorship'}
                    </button>
                    {privateMessage && (
                        <span className={`text-sm ${privateMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                            {privateMessage}
                        </span>
                    )}
                </div>
            </div>

            {/* Physical Classes Mentorship Settings */}
            <div className="bg-[#1F2937] rounded-xl shadow-sm border border-gray-800 p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-blue-500" />
                    Physical Classes Mentorship
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Class A Product Slug (Standard)
                        </label>
                        <input
                            type="text"
                            value={physClassASlug}
                            onChange={(e) => setPhysClassASlug(e.target.value)}
                            placeholder="physical-class-a"
                            className="w-full p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600 font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Class B Product Slug (Private)
                        </label>
                        <input
                            type="text"
                            value={physClassBSlug}
                            onChange={(e) => setPhysClassBSlug(e.target.value)}
                            placeholder="physical-class-b"
                            className="w-full p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-600 font-mono"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSavePhys}
                        disabled={savingPhys}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {savingPhys ? 'Saving...' : 'Save Physical Classes Settings'}
                    </button>
                    {physMessage && (
                        <span className={`text-sm ${physMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                            {physMessage}
                        </span>
                    )}
                </div>
            </div>

            {/* Account Management Settings */}
            <div className="bg-[#1F2937] rounded-xl shadow-sm border border-gray-800 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Account Management</h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Minimum Capital ($)
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                        The minimum capital amount required for a user to request account management.
                    </p>
                    <input
                        type="number"
                        value={accMgmtMinCapital}
                        onChange={(e) => setAccMgmtMinCapital(Number(e.target.value))}
                        className="w-full md:w-1/2 p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 font-mono"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Capital Amount Placeholder
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                        The placeholder text shown in the capital amount input field.
                    </p>
                    <input
                        type="text"
                        value={accMgmtPlaceholder}
                        onChange={(e) => setAccMgmtPlaceholder(e.target.value)}
                        placeholder="e.g. Capital Amount (Min $500)"
                        className="w-full md:w-1/2 p-3 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 font-mono"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSaveAccMgmt}
                        disabled={savingAccMgmt}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {savingAccMgmt ? 'Saving...' : 'Save Account Management Settings'}
                    </button>
                    {accMgmtMessage && (
                        <span className={`text-sm ${accMgmtMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                            {accMgmtMessage}
                        </span>
                    )}
                </div>
            </div>

        </div>
    );
}

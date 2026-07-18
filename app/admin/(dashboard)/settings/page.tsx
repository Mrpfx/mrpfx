'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getMentorshipSettings, updateMentorshipSettings } from '@/app/actions/mentorship-settings';
import { getMentorship100Settings, updateMentorship100Settings } from '@/app/actions/mentorship-100-settings';
import { getVIPSettings, updateVIPSettings, VIPSettings } from '@/app/actions/vip-settings';
import { getPrivateMentorshipSettings, updatePrivateMentorshipSettings } from '@/app/actions/private-mentorship-settings';
import { getPromoBannerSettings, updatePromoBannerSettings } from '@/app/actions/promo-banner-settings';
import { getAccountManagementSettings, updateAccountManagementSettings, AccountManagementSettings } from '@/app/actions/account-management-settings';
import { getYoutubeSettings, updateYoutubeSettings } from '@/app/actions/youtube-settings';
import { getPhysicalClassesSettings, updatePhysicalClassesSettings } from '@/app/actions/physical-classes-settings';
import { Save, Youtube, MapPin, Download, Upload, ImagePlus } from 'lucide-react';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import type { WPMediaItem } from '@/lib/admin-api';
import { getMediaUrl } from '@/lib/utils';
import Image from 'next/image';

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

    const [heroTitle1, setHeroTitle1] = useState('');
    const [heroTitle2, setHeroTitle2] = useState('');
    const [heroSubtitle, setHeroSubtitle] = useState('');
    const [heroImage, setHeroImage] = useState('');
    const [heroVideoUrl, setHeroVideoUrl] = useState('');
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [courseDateText, setCourseDateText] = useState('');
    const [heroDescription, setHeroDescription] = useState('');
    const [pinnedNote, setPinnedNote] = useState('');
    const [primaryCtaText, setPrimaryCtaText] = useState('');
    const [secondaryCtaText, setSecondaryCtaText] = useState('');
    const [secondaryCtaLink, setSecondaryCtaLink] = useState('');
    const [limitedAdmissionTitle, setLimitedAdmissionTitle] = useState('');
    const [limitedAdmissionPointsText, setLimitedAdmissionPointsText] = useState('');
    const [whatYouWillLearnTitle, setWhatYouWillLearnTitle] = useState('');
    const [whatYouWillLearnPointsText, setWhatYouWillLearnPointsText] = useState('');
    const [transformationText1, setTransformationText1] = useState('');
    const [transformationText2, setTransformationText2] = useState('');
    const [detailsTitle, setDetailsTitle] = useState('');
    const [detailsDateRange, setDetailsDateRange] = useState('');
    const [detailsInclusionsText, setDetailsInclusionsText] = useState('');
    const [bottomCtaText, setBottomCtaText] = useState('');

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

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importExportMessage, setImportExportMessage] = useState('');

    useEffect(() => {
        getMentorshipSettings().then(data => {
            if (data?.registrationOpenDate) {
                const localDate = new Date(data.registrationOpenDate);
                if (!isNaN(localDate.getTime())) {
                    const offset = localDate.getTimezoneOffset() * 60000;
                    const localISOTime = new Date(localDate.getTime() - offset).toISOString().slice(0, 16);
                    setDate(localISOTime);
                }
            }
            if (data?.productSlug) {
                setProductSlug(data.productSlug);
            }
            setLoading(false);
        });
        getMentorship100Settings().then(data => {
            if (data?.registrationOpenDate) {
                const localDate = new Date(data.registrationOpenDate);
                if (!isNaN(localDate.getTime())) {
                    const offset = localDate.getTimezoneOffset() * 60000;
                    const localISOTime = new Date(localDate.getTime() - offset).toISOString().slice(0, 16);
                    setDate100(localISOTime);
                }
            }
            if (data?.productSlug) {
                setProductSlug100(data.productSlug);
            }
            setHeroTitle1(data?.heroTitle1 || '');
            setHeroTitle2(data?.heroTitle2 || '');
            setHeroSubtitle(data?.heroSubtitle || '');
            setHeroImage(data?.heroImage || '');
            setHeroVideoUrl(data?.heroVideoUrl || '');
            setCourseDateText(data?.courseDateText || '');
            setHeroDescription(data?.heroDescription || '');
            setPinnedNote(data?.pinnedNote || '');
            setPrimaryCtaText(data?.primaryCtaText || '');
            setSecondaryCtaText(data?.secondaryCtaText || '');
            setSecondaryCtaLink(data?.secondaryCtaLink || '');
            setLimitedAdmissionTitle(data?.limitedAdmissionTitle || '');
            setLimitedAdmissionPointsText((data?.limitedAdmissionPoints || []).join('\n'));
            setWhatYouWillLearnTitle(data?.whatYouWillLearnTitle || '');
            setWhatYouWillLearnPointsText((data?.whatYouWillLearnPoints || []).join('\n'));
            setTransformationText1(data?.transformationText1 || '');
            setTransformationText2(data?.transformationText2 || '');
            setDetailsTitle(data?.detailsTitle || '');
            setDetailsDateRange(data?.detailsDateRange || '');
            setDetailsInclusionsText((data?.detailsInclusions || []).join('\n'));
            setBottomCtaText(data?.bottomCtaText || '');
        });
        getVIPSettings().then(data => {
            setVipSlugs({
                oneMonth: data.plans.oneMonth.slug || '',
                twelveMonths: data.plans.twelveMonths.slug || '',
                unlimited: data.plans.unlimited.slug || '',
            });
            if (data.registrationOpenDate) {
                const localDate = new Date(data.registrationOpenDate);
                if (!isNaN(localDate.getTime())) {
                    const offset = localDate.getTimezoneOffset() * 60000;
                    const localISOTime = new Date(localDate.getTime() - offset).toISOString().slice(0, 16);
                    setVipDate(localISOTime);
                }
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
            await updateMentorship100Settings({
                registrationOpenDate: isoString,
                productSlug: productSlug100,
                heroTitle1,
                heroTitle2,
                heroSubtitle,
                heroImage,
                heroVideoUrl,
                courseDateText,
                heroDescription,
                pinnedNote,
                primaryCtaText,
                secondaryCtaText,
                secondaryCtaLink,
                limitedAdmissionTitle,
                limitedAdmissionPoints: limitedAdmissionPointsText.split('\n').map(p => p.trim()).filter(Boolean),
                whatYouWillLearnTitle,
                whatYouWillLearnPoints: whatYouWillLearnPointsText.split('\n').map(p => p.trim()).filter(Boolean),
                transformationText1,
                transformationText2,
                detailsTitle,
                detailsDateRange,
                detailsInclusions: detailsInclusionsText.split('\n').map(p => p.trim()).filter(Boolean),
                bottomCtaText
            });
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

    const collectAllSettings = () => ({
        standardMentorship: { registrationOpenDate: date, productSlug },
        mentorship100: {
            registrationOpenDate: date100,
            productSlug: productSlug100,
            heroTitle1, heroTitle2, heroSubtitle, heroImage, heroVideoUrl,
            courseDateText, heroDescription, pinnedNote,
            primaryCtaText, secondaryCtaText, secondaryCtaLink,
            limitedAdmissionTitle,
            limitedAdmissionPoints: limitedAdmissionPointsText.split('\n').map(p => p.trim()).filter(Boolean),
            whatYouWillLearnTitle,
            whatYouWillLearnPoints: whatYouWillLearnPointsText.split('\n').map(p => p.trim()).filter(Boolean),
            transformationText1, transformationText2,
            detailsTitle, detailsDateRange,
            detailsInclusions: detailsInclusionsText.split('\n').map(p => p.trim()).filter(Boolean),
            bottomCtaText
        },
        vip: { vipSlugs, vipDate, vipGroupLink },
        privateMentorship: { classASlug, classBSlug },
        physicalClasses: { physClassASlug, physClassBSlug },
        promobanner: { active: promoActive, text: promoText, link: promoLink, backgroundColor: promoColor },
        accountManagement: { minCapital: accMgmtMinCapital, placeholder: accMgmtPlaceholder },
        youtube: { apiKey: youtubeApiKey, channelId: youtubeChannelId }
    });

    const handleExportSettings = () => {
        const data = collectAllSettings();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mrp-settings-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setImportExportMessage('Settings exported successfully!');
        setTimeout(() => setImportExportMessage(''), 3000);
    };

    const handleImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (data.mentorship100) {
                    const m = data.mentorship100;
                    setDate100(m.registrationOpenDate || '');
                    setProductSlug100(m.productSlug || 'mentorship-100');
                    setHeroTitle1(m.heroTitle1 || '');
                    setHeroTitle2(m.heroTitle2 || '');
                    setHeroSubtitle(m.heroSubtitle || '');
                    setHeroImage(m.heroImage || '');
                    setHeroVideoUrl(m.heroVideoUrl || '');
                    setCourseDateText(m.courseDateText || '');
                    setHeroDescription(m.heroDescription || '');
                    setPinnedNote(m.pinnedNote || '');
                    setPrimaryCtaText(m.primaryCtaText || '');
                    setSecondaryCtaText(m.secondaryCtaText || '');
                    setSecondaryCtaLink(m.secondaryCtaLink || '');
                    setLimitedAdmissionTitle(m.limitedAdmissionTitle || '');
                    setLimitedAdmissionPointsText((m.limitedAdmissionPoints || []).join('\n'));
                    setWhatYouWillLearnTitle(m.whatYouWillLearnTitle || '');
                    setWhatYouWillLearnPointsText((m.whatYouWillLearnPoints || []).join('\n'));
                    setTransformationText1(m.transformationText1 || '');
                    setTransformationText2(m.transformationText2 || '');
                    setDetailsTitle(m.detailsTitle || '');
                    setDetailsDateRange(m.detailsDateRange || '');
                    setDetailsInclusionsText((m.detailsInclusions || []).join('\n'));
                    setBottomCtaText(m.bottomCtaText || '');
                }
                if (data.standardMentorship) {
                    setDate(data.standardMentorship.registrationOpenDate || '');
                    setProductSlug(data.standardMentorship.productSlug || 'standard-mentorship');
                }
                if (data.vip) {
                    setVipSlugs(data.vip.vipSlugs || { oneMonth: '', twelveMonths: '', unlimited: '' });
                    setVipDate(data.vip.vipDate || '');
                    setVipGroupLink(data.vip.vipGroupLink || '');
                }
                if (data.privateMentorship) {
                    setClassASlug(data.privateMentorship.classASlug || '');
                    setClassBSlug(data.privateMentorship.classBSlug || '');
                }
                if (data.physicalClasses) {
                    setPhysClassASlug(data.physicalClasses.physClassASlug || '');
                    setPhysClassBSlug(data.physicalClasses.physClassBSlug || '');
                }
                if (data.promobanner) {
                    setPromoActive(data.promobanner.active || false);
                    setPromoText(data.promobanner.text || '');
                    setPromoLink(data.promobanner.link || '');
                    setPromoColor(data.promobanner.backgroundColor || 'bg-[#5B2EFF]');
                }
                if (data.accountManagement) {
                    setAccMgmtMinCapital(data.accountManagement.minCapital || 500);
                    setAccMgmtPlaceholder(data.accountManagement.placeholder || '');
                }
                if (data.youtube) {
                    setYoutubeApiKey(data.youtube.apiKey || '');
                    setYoutubeChannelId(data.youtube.channelId || '');
                }
                setImportExportMessage('Settings imported successfully! Save each section to persist changes.');
                setTimeout(() => setImportExportMessage(''), 5000);
            } catch {
                setImportExportMessage('Invalid JSON file.');
                setTimeout(() => setImportExportMessage(''), 3000);
            }
        };
        reader.readAsText(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Hero Section Content */}
                    <div className="bg-[#111827]/40 p-4 rounded-xl border border-gray-800/60 space-y-4">
                        <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">Hero Section Settings</h3>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Hero Title Part 1</label>
                            <input
                                type="text"
                                value={heroTitle1}
                                onChange={(e) => setHeroTitle1(e.target.value)}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Hero Title Part 2 (Italic)</label>
                            <input
                                type="text"
                                value={heroTitle2}
                                onChange={(e) => setHeroTitle2(e.target.value)}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Hero Subtitle</label>
                            <input
                                type="text"
                                value={heroSubtitle}
                                onChange={(e) => setHeroSubtitle(e.target.value)}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Hero Image</label>
                            <div className="flex flex-col gap-3">
                                {heroImage && (
                                    <div className="relative w-40 h-28 rounded-lg overflow-hidden border border-gray-700 bg-[#111827]">
                                        <Image
                                            src={getMediaUrl(heroImage) || heroImage}
                                            alt="Hero preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowMediaModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <ImagePlus className="w-4 h-4" />
                                        {heroImage ? 'Change Image' : 'Upload / Select Image'}
                                    </button>
                                    {heroImage && (
                                        <button
                                            type="button"
                                            onClick={() => setHeroImage('')}
                                            className="px-3 py-2 text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Hero Video URL (YouTube or other)</label>
                            <input
                                type="text"
                                value={heroVideoUrl}
                                onChange={(e) => setHeroVideoUrl(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Course Date Text</label>
                            <input
                                type="text"
                                value={courseDateText}
                                onChange={(e) => setCourseDateText(e.target.value)}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Hero Description (HTML allowed)</label>
                            <textarea
                                value={heroDescription}
                                onChange={(e) => setHeroDescription(e.target.value)}
                                rows={3}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pinned Note (HTML allowed)</label>
                            <textarea
                                value={pinnedNote}
                                onChange={(e) => setPinnedNote(e.target.value)}
                                rows={2}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                            />
                        </div>
                    </div>

                    {/* CTAs and Banner Section */}
                    <div className="bg-[#111827]/40 p-4 rounded-xl border border-gray-800/60 space-y-4">
                        <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">CTAs & Transformation Banner</h3>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Primary CTA Button Text</label>
                            <input
                                type="text"
                                value={primaryCtaText}
                                onChange={(e) => setPrimaryCtaText(e.target.value)}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Secondary CTA Button Text</label>
                            <input
                                type="text"
                                value={secondaryCtaText}
                                onChange={(e) => setSecondaryCtaText(e.target.value)}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Secondary CTA Link (URL — if set, button navigates to this link instead of adding to cart)</label>
                            <input
                                type="text"
                                value={secondaryCtaLink}
                                onChange={(e) => setSecondaryCtaLink(e.target.value)}
                                placeholder="https://"
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Bottom CTA Button Text</label>
                            <input
                                type="text"
                                value={bottomCtaText}
                                onChange={(e) => setBottomCtaText(e.target.value)}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Transformation Banner Part 1 (HTML allowed)</label>
                            <input
                                type="text"
                                value={transformationText1}
                                onChange={(e) => setTransformationText1(e.target.value)}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Transformation Banner Part 2 (HTML allowed)</label>
                            <input
                                type="text"
                                value={transformationText2}
                                onChange={(e) => setTransformationText2(e.target.value)}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Limited Admission Section */}
                    <div className="bg-[#111827]/40 p-4 rounded-xl border border-gray-800/60 space-y-4">
                        <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">Limited Admission</h3>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Section Title</label>
                            <input
                                type="text"
                                value={limitedAdmissionTitle}
                                onChange={(e) => setLimitedAdmissionTitle(e.target.value)}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Bullet Points (One per line, HTML allowed)</label>
                            <textarea
                                value={limitedAdmissionPointsText}
                                onChange={(e) => setLimitedAdmissionPointsText(e.target.value)}
                                rows={6}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y font-sans text-sm"
                            />
                        </div>
                    </div>

                    {/* What You Will Learn Section */}
                    <div className="bg-[#111827]/40 p-4 rounded-xl border border-gray-800/60 space-y-4">
                        <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">What You Will Learn</h3>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Section Title</label>
                            <input
                                type="text"
                                value={whatYouWillLearnTitle}
                                onChange={(e) => setWhatYouWillLearnTitle(e.target.value)}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Bullet Points (One per line, HTML allowed)</label>
                            <textarea
                                value={whatYouWillLearnPointsText}
                                onChange={(e) => setWhatYouWillLearnPointsText(e.target.value)}
                                rows={6}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y font-sans text-sm"
                            />
                        </div>
                    </div>

                    {/* Registration Details Section */}
                    <div className="bg-[#111827]/40 p-4 rounded-xl border border-gray-800/60 space-y-4">
                        <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">Registration Details</h3>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Section Title</label>
                            <input
                                type="text"
                                value={detailsTitle}
                                onChange={(e) => setDetailsTitle(e.target.value)}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Details Date Range</label>
                            <input
                                type="text"
                                value={detailsDateRange}
                                onChange={(e) => setDetailsDateRange(e.target.value)}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Inclusions Checklist (One per line, HTML allowed)</label>
                            <textarea
                                value={detailsInclusionsText}
                                onChange={(e) => setDetailsInclusionsText(e.target.value)}
                                rows={6}
                                className="w-full p-2.5 bg-[#111827] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y font-sans text-sm"
                            />
                        </div>
                    </div>
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

            {/* Import / Export Settings */}
            <div className="bg-[#1F2937] rounded-xl shadow-sm border border-gray-800 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    <Download className="w-6 h-6 text-emerald-500" />
                    Import / Export Settings
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Export all settings as JSON for backup, or import from a previous export. After importing, remember to save each section individually.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={handleExportSettings}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        Export All Settings
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        <Upload className="w-5 h-5" />
                        Import Settings
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImportSettings}
                        className="hidden"
                    />
                    {importExportMessage && (
                        <span className={`text-sm ${importExportMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                            {importExportMessage}
                        </span>
                    )}
                </div>
            </div>

            <MediaPickerModal
                isOpen={showMediaModal}
                onClose={() => setShowMediaModal(false)}
                onSelect={(media: WPMediaItem) => {
                    setHeroImage(media.url || media.source_url || '');
                    setShowMediaModal(false);
                }}
                title="Select Hero Image"
            />

        </div>
    );
}

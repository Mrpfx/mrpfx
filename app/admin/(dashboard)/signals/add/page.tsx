'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Zap, Info, Image as ImageIcon } from 'lucide-react';
import { adminDynamicService, DynamicSignalCreate, WPMediaItem } from '@/lib/admin-api';
import { SuccessModal, ErrorModal } from '@/components/admin/Modals';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import { getMediaUrl, relativizeMediaUrl } from '@/lib/utils';

export default function AddSignalPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [errorModal, setErrorModal] = useState<{ isOpen: boolean, message: string }>({ isOpen: false, message: '' });
    const [createdId, setCreatedId] = useState<number | null>(null);

    const [featuredImage, setFeaturedImage] = useState<WPMediaItem | null>(null);
    const [showMediaModal, setShowMediaModal] = useState(false);

    const [formData, setFormData] = useState<DynamicSignalCreate>({
        title: '',
        instrument: '',
        signal_type: 'free',
        entry: '',
        sl: '',
        tp1: '',
        tp2: '',
        status: 'publish',
        price: '',
        image_url: '',
    });

    const handleChange = (field: keyof DynamicSignalCreate, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.instrument.trim()) return;

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                price: formData.price === '' ? '0' : formData.price,
                image_url: featuredImage
                    ? relativizeMediaUrl((featuredImage as any).url || featuredImage.source_url)
                    : relativizeMediaUrl(formData.image_url)
            };
            const newSignal = await adminDynamicService.createSignal(submitData);
            setCreatedId(newSignal.id);
            setSuccessModal(true);
        } catch (error) {
            console.error('Failed to create signal:', error);
            setErrorModal({ isOpen: true, message: 'Failed to create signal. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleMediaSelect = (media: WPMediaItem) => {
        setFeaturedImage(media);
        setShowMediaModal(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/signals"
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Add New Signal</h1>
                        <p className="text-sm text-gray-400 mt-1">Create a new trading signal for the community</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.title.trim() || !formData.instrument.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Creating...' : 'Create Signal'}
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h3 className="text-white font-semibold">Signal Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-400">Signal Title *</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                    placeholder="e.g. EURUSD Buy Setup"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Instrument *</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                    placeholder="e.g. EURUSD or GOLD"
                                    value={formData.instrument}
                                    onChange={(e) => handleChange('instrument', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Signal Type</label>
                                <select
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent"
                                    value={formData.signal_type}
                                    onChange={(e) => handleChange('signal_type', e.target.value)}
                                >
                                    <option value="free">Free</option>
                                    <option value="vip">VIP</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Entry Price *</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                    placeholder="e.g. 1.0850"
                                    value={formData.entry}
                                    onChange={(e) => handleChange('entry', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Stop Loss *</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                    placeholder="e.g. 1.0820"
                                    value={formData.sl}
                                    onChange={(e) => handleChange('sl', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Take Profit 1 *</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                    placeholder="e.g. 1.0890"
                                    value={formData.tp1}
                                    onChange={(e) => handleChange('tp1', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Take Profit 2 (optional)</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                    placeholder="e.g. 1.0920"
                                    value={formData.tp2}
                                    onChange={(e) => handleChange('tp2', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Price (optional)</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                    placeholder="e.g. 9.99"
                                    value={formData.price}
                                    onChange={(e) => handleChange('price', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4 backdrop-blur-sm">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-800">
                            <ImageIcon className="w-5 h-5 text-purple-500" />
                            <h3 className="text-white font-semibold">Signal Image</h3>
                        </div>

                        {featuredImage ? (
                            <div className="relative group">
                                <img
                                    src={getMediaUrl((featuredImage as any).url || featuredImage.source_url)}
                                    alt="Featured"
                                    className="w-full h-auto rounded-lg border border-gray-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFeaturedImage(null)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Info className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowMediaModal(true)}
                                className="w-full aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg hover:border-purple-500 hover:text-purple-500 text-gray-500 transition-colors"
                            >
                                <ImageIcon className="w-8 h-8 mb-2" />
                                <span className="text-sm">Set signal image</span>
                            </button>
                        )}
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4 backdrop-blur-sm">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-800">
                            <Info className="w-5 h-5 text-purple-500" />
                            <h3 className="text-white font-semibold">Settings</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Status</label>
                            <select
                                className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent"
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                            >
                                <option value="publish">Published</option>
                                <option value="draft">Draft</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
                        <h4 className="text-purple-400 font-bold text-sm mb-2">Pro Tip</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            Signals are pushed to the Telegram channel immediately when published. Make sure all levels are correct before saving.
                        </p>
                    </div>
                </div>
            </form>

            {/* Success Modal */}
            <SuccessModal
                isOpen={successModal}
                onClose={() => setSuccessModal(false)}
                title="Signal Created"
                message="Your trading signal has been created successfully."
                confirmText="Edit Signal"
                onConfirm={() => router.push(`/admin/signals/${createdId}`)}
                secondaryText="Back to Signals"
                onSecondary={() => router.push('/admin/signals')}
            />

            {/* Error Modal */}
            <ErrorModal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
                message={errorModal.message}
            />

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={showMediaModal}
                onClose={() => setShowMediaModal(false)}
                onSelect={handleMediaSelect}
                title="Select Signal Image"
            />
        </div>
    );
}

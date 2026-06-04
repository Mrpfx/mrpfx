'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Zap, Trash2, Info, Image as ImageIcon } from 'lucide-react';
import { adminDynamicService, DynamicSignal, WPMediaItem } from '@/lib/admin-api';
import { SuccessModal, ConfirmModal, ErrorModal } from '@/components/admin/Modals';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import { getMediaUrl, relativizeMediaUrl } from '@/lib/utils';

export default function EditSignalPage() {
    const router = useRouter();
    const params = useParams();
    const signalId = Number(params.signalId);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [errorModal, setErrorModal] = useState<{ isOpen: boolean, message: string }>({ isOpen: false, message: '' });

    const [featuredImage, setFeaturedImage] = useState<WPMediaItem | null>(null);
    const [showMediaModal, setShowMediaModal] = useState(false);

    const [formData, setFormData] = useState<Partial<DynamicSignal>>({
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

    useEffect(() => {
        const fetchSignal = async () => {
            try {
                const signals = await adminDynamicService.getSignals();
                const signal = signals.items.find(s => s.id === signalId);
                if (signal) {
                    setFormData(signal);
                    if (signal.image_url) {
                        setFeaturedImage({
                            id: 0, // Placeholder ID
                            url: signal.image_url,
                            source_url: signal.image_url,
                            title: { rendered: 'Signal Image' },
                            mime_type: 'image/jpeg'
                        } as any);
                    }
                } else {
                    setErrorModal({ isOpen: true, message: 'Signal not found' });
                }
            } catch (error) {
                console.error('Failed to fetch signal:', error);
                setErrorModal({ isOpen: true, message: 'Failed to fetch signal details.' });
            } finally {
                setLoading(false);
            }
        };

        if (signalId) {
            fetchSignal();
        }
    }, [signalId]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title?.trim() || !formData.instrument?.trim()) return;

        setSaving(true);
        try {
            const submitData = {
                ...formData,
                price: formData.price === '' ? '0' : formData.price,
                image_url: featuredImage
                    ? relativizeMediaUrl((featuredImage as any).url || featuredImage.source_url)
                    : relativizeMediaUrl(formData.image_url)
            };
            await adminDynamicService.updateSignal(signalId, submitData);
            setSuccessModal(true);
        } catch (error) {
            console.error('Failed to update signal:', error);
            setErrorModal({ isOpen: true, message: 'Failed to update signal. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await adminDynamicService.deleteSignal(signalId);
            router.push('/admin/signals');
        } catch (error) {
            console.error('Failed to delete signal:', error);
            setErrorModal({ isOpen: true, message: 'Failed to delete signal. Please try again.' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-400">Loading signal details...</div>
            </div>
        );
    }

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
                        <h1 className="text-2xl font-bold text-white">Edit Signal</h1>
                        <p className="text-sm text-gray-400 mt-1">Update signal parameters</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setDeleteModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || !formData.title?.trim() || !formData.instrument?.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
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
                                    <Trash2 className="w-4 h-4" />
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
                </div>
            </form>

            {/* Success Modal */}
            <SuccessModal
                isOpen={successModal}
                onClose={() => setSuccessModal(false)}
                title="Signal Updated"
                message="The signal has been updated successfully."
                confirmText="Continue Editing"
                onConfirm={() => setSuccessModal(false)}
                secondaryText="Back to Signals"
                onSecondary={() => router.push('/admin/signals')}
            />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Signal"
                message="Are you sure you want to delete this signal? This action cannot be undone."
                isDestructive={true}
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
                onSelect={(media) => {
                    setFeaturedImage(media);
                    setShowMediaModal(false);
                }}
                title="Select Signal Image"
            />
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Bot, Info, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { adminDynamicService, DynamicTradingToolCreate, WPMediaItem } from '@/lib/admin-api';
import { SuccessModal, ErrorModal } from '@/components/admin/Modals';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import { getMediaUrl, relativizeMediaUrl } from '@/lib/utils';

export default function AddTradingToolPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [errorModal, setErrorModal] = useState<{ isOpen: boolean, message: string }>({ isOpen: false, message: '' });
    const [createdId, setCreatedId] = useState<number | null>(null);

    const [featuredImage, setFeaturedImage] = useState<WPMediaItem | null>(null);
    const [showMediaModal, setShowMediaModal] = useState(false);

    const [formData, setFormData] = useState<DynamicTradingToolCreate>({
        title: '',
        tool_type: 'bot',
        category: 'free',
        description: '',
        download_url: '',
        purchase_url: '',
        status: 'publish',
        price: '0',
        image_url: '',
        seller_payment_link: '',
        whop_payment_link: '',
    });

    const handleChange = (field: keyof DynamicTradingToolCreate, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            if (field === 'category' && value === 'free') {
                newData.price = '0';
            }
            return newData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim()) return;

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                price: formData.price === '' ? '0' : formData.price,
                image_url: featuredImage
                    ? relativizeMediaUrl((featuredImage as any).url || featuredImage.source_url)
                    : relativizeMediaUrl(formData.image_url)
            };
            const newTool = await adminDynamicService.createTradingTool(submitData);
            setCreatedId(newTool.id);
            setSuccessModal(true);
        } catch (error) {
            console.error('Failed to create trading tool:', error);
            setErrorModal({ isOpen: true, message: 'Failed to create trading tool. Please try again.' });
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
                        href="/admin/trading-tools"
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Add New Trading Tool</h1>
                        <p className="text-sm text-gray-400 mt-1">Create a new Bot or Indicator</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.title.trim() || !formData.description.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Creating...' : 'Create Tool'}
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center">
                                <Bot className="w-5 h-5" />
                            </div>
                            <h3 className="text-white font-semibold">Tool Information</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Tool Title *</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                    placeholder="e.g. Pro Scalper Bot v1.0"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Tool Type</label>
                                    <select
                                        className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent"
                                        value={formData.tool_type}
                                        onChange={(e) => handleChange('tool_type', e.target.value)}
                                    >
                                        <option value="bot">Trading Bot</option>
                                        <option value="indicator">Technical Indicator</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Category</label>
                                    <select
                                        className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent"
                                        value={formData.category}
                                        onChange={(e) => handleChange('category', e.target.value)}
                                    >
                                        <option value="free">Free</option>
                                        <option value="vip">VIP</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Description *</label>
                                <textarea
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600 resize-none h-32"
                                    placeholder="Describe what this tool does, its features, and how to use it..."
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-500 flex items-center justify-center">
                                <LinkIcon className="w-5 h-5" />
                            </div>
                            <h3 className="text-white font-semibold">Links & Access</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Download URL (Direct link to ZIP/EX4)</label>
                                <input
                                    type="url"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                    placeholder="https://..."
                                    value={formData.download_url}
                                    onChange={(e) => handleChange('download_url', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Purchase URL (Native/Direct link)</label>
                                <input
                                    type="url"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                    placeholder="https://..."
                                    value={formData.purchase_url}
                                    onChange={(e) => handleChange('purchase_url', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Selar Payment Link (Optional)</label>
                                <input
                                    type="url"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                    placeholder="https://selar.co/..."
                                    value={formData.seller_payment_link}
                                    onChange={(e) => handleChange('seller_payment_link', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Whop Payment Link (Optional)</label>
                                <input
                                    type="url"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                    placeholder="https://whop.com/..."
                                    value={formData.whop_payment_link}
                                    onChange={(e) => handleChange('whop_payment_link', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Price (optional)</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="e.g. 49.99"
                                    value={formData.price}
                                    onChange={(e) => handleChange('price', e.target.value)}
                                    disabled={formData.category === 'free'}
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
                            <h3 className="text-white font-semibold">Tool Image</h3>
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
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                    <Bot className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowMediaModal(true)}
                                className="w-full aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg hover:border-purple-500 hover:text-purple-500 text-gray-500 transition-colors"
                            >
                                <ImageIcon className="w-8 h-8 mb-2" />
                                <span className="text-sm">Set tool image</span>
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
                title="Tool Created"
                message="Your trading tool has been created successfully."
                confirmText="Edit Tool"
                onConfirm={() => router.push(`/admin/trading-tools/${createdId}`)}
                secondaryText="Back to Trading Tools"
                onSecondary={() => router.push('/admin/trading-tools')}
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
                title="Select Tool Image"
            />
        </div>
    );
}

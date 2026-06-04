'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Book, Trash2, Info, Link as LinkIcon, Lock, Unlock, Image as ImageIcon } from 'lucide-react';
import { adminDynamicService, DynamicBook, WPMediaItem } from '@/lib/admin-api';
import { SuccessModal, ConfirmModal, ErrorModal } from '@/components/admin/Modals';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import { getMediaUrl, relativizeMediaUrl } from '@/lib/utils';

export default function EditBookPage() {
    const router = useRouter();
    const params = useParams();
    const bookId = Number(params.bookId);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [errorModal, setErrorModal] = useState<{ isOpen: boolean, message: string }>({ isOpen: false, message: '' });

    const [featuredImage, setFeaturedImage] = useState<WPMediaItem | null>(null);
    const [showMediaModal, setShowMediaModal] = useState(false);

    const [formData, setFormData] = useState<Partial<DynamicBook>>({
        title: '',
        is_free: true,
        description: '',
        download_url: '',
        purchase_url: '',
        status: 'publish',
        price: '',
        image_url: '',
        seller_payment_link: '',
        whop_payment_link: '',
    });

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const books = await adminDynamicService.getBooks();
                const book = books.items.find(b => b.id === bookId);
                if (book) {
                    setFormData(book);
                    if (book.image_url) {
                        setFeaturedImage({
                            id: 0,
                            url: book.image_url,
                            source_url: book.image_url,
                            title: { rendered: 'Book Cover' },
                            mime_type: 'image/jpeg'
                        } as any);
                    }
                } else {
                    setErrorModal({ isOpen: true, message: 'Book not found' });
                }
            } catch (error) {
                console.error('Failed to fetch book:', error);
                setErrorModal({ isOpen: true, message: 'Failed to fetch book details.' });
            } finally {
                setLoading(false);
            }
        };

        if (bookId) {
            fetchBook();
        }
    }, [bookId]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title?.trim() || !formData.description?.trim()) return;

        setSaving(true);
        try {
            const submitData = {
                ...formData,
                price: formData.price === '' ? '0' : formData.price,
                image_url: featuredImage
                    ? relativizeMediaUrl((featuredImage as any).url || featuredImage.source_url)
                    : relativizeMediaUrl(formData.image_url)
            };
            await adminDynamicService.updateBook(bookId, submitData);
            setSuccessModal(true);
        } catch (error) {
            console.error('Failed to update book:', error);
            setErrorModal({ isOpen: true, message: 'Failed to update book. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await adminDynamicService.deleteBook(bookId);
            router.push('/admin/books');
        } catch (error) {
            console.error('Failed to delete book:', error);
            setErrorModal({ isOpen: true, message: 'Failed to delete book. Please try again.' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-400">Loading book details...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/books"
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Edit Book</h1>
                        <p className="text-sm text-gray-400 mt-1">Update book details</p>
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
                        disabled={saving || !formData.title?.trim() || !formData.description?.trim()}
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
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                <Book className="w-5 h-5" />
                            </div>
                            <h3 className="text-white font-semibold">Book Information</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Book Title *</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                    placeholder="e.g. Mastering Price Action"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Description *</label>
                                <textarea
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600 resize-none h-40"
                                    placeholder="Provide a detailed summary of the book content..."
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => handleChange('is_free', !formData.is_free)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.is_free ? 'bg-emerald-600' : 'bg-gray-700'}`}
                                >
                                    <span className={`${formData.is_free ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                </button>
                                <span className="text-sm text-gray-400">This is a FREE book</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center">
                                <LinkIcon className="w-5 h-5" />
                            </div>
                            <h3 className="text-white font-semibold">Links & Access</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                    <Unlock className="w-3 h-3 text-emerald-500" />
                                    Download URL (PDF Link)
                                </label>
                                <input
                                    type="url"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="https://..."
                                    value={formData.download_url}
                                    onChange={(e) => handleChange('download_url', e.target.value)}
                                    disabled={!formData.is_free}
                                />
                                {!formData.is_free && <p className="text-[10px] text-orange-500/60 font-medium uppercase tracking-wider">Only available for free books</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                    <Lock className="w-3 h-3 text-orange-500" />
                                    Whop Access URL (Native/Direct link)
                                </label>
                                <input
                                    type="url"
                                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                    placeholder="https://whop.com/checkout/..."
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

                            {!formData.is_free && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Price (optional)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 border border-transparent placeholder-gray-600"
                                        placeholder="e.g. 19.99"
                                        value={formData.price}
                                        onChange={(e) => handleChange('price', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4 backdrop-blur-sm">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-800">
                            <ImageIcon className="w-5 h-5 text-purple-500" />
                            <h3 className="text-white font-semibold">Book Cover</h3>
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
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowMediaModal(true)}
                                className="w-full aspect-[3/4] flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg hover:border-purple-500 hover:text-purple-500 text-gray-500 transition-colors"
                            >
                                <ImageIcon className="w-8 h-8 mb-2" />
                                <span className="text-sm">Set book cover</span>
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
                title="Book Updated"
                message="The book has been updated successfully."
                confirmText="Continue Editing"
                onConfirm={() => setSuccessModal(false)}
                secondaryText="Back to Books list"
                onSecondary={() => router.push('/admin/books')}
            />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Book"
                message="Are you sure you want to delete this book? This action cannot be undone."
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
                title="Select Book Cover"
            />
        </div>
    );
}

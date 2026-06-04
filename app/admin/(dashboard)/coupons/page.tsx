'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Tag,
    RefreshCcw,
    X,
    Save,
    AlertCircle
} from 'lucide-react';
import { adminCouponService as couponsService, WCCoupon, WCCouponUpdate } from '@/lib/admin-api';
import { ConfirmModal } from '@/components/admin/Modals';

export default function CouponsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [coupons, setCoupons] = useState<WCCoupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 50;

    // Modal State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<WCCoupon | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, couponId: number | null }>({ isOpen: false, couponId: null });

    // Form State
    const [formData, setFormData] = useState<WCCouponUpdate>({
        code: '',
        amount: '0',
        discount_type: 'percent',
        description: '',
        date_expires: null,
        individual_use: false,
        usage_limit: null,
        usage_limit_per_user: null
    });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        fetchCoupons();
    }, [page]);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const data = await couponsService.getAll({ page, per_page: limit });
            if (Array.isArray(data)) {
                setCoupons(data);
            }
        } catch (error) {
            console.error("Failed to fetch coupons", error);
            setCoupons([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditingCoupon(null);
        setFormData({
            code: '',
            amount: '0',
            discount_type: 'percent',
            description: '',
            date_expires: null,
            individual_use: false,
            usage_limit: null,
            usage_limit_per_user: null
        });
        setFormError('');
        setIsFormOpen(true);
    };

    const handleEditClick = (coupon: WCCoupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            amount: coupon.amount,
            discount_type: coupon.discount_type,
            description: coupon.description || '',
            date_expires: coupon.date_expires ? coupon.date_expires.split('T')[0] : null,
            individual_use: coupon.individual_use,
            usage_limit: coupon.usage_limit,
            usage_limit_per_user: coupon.usage_limit_per_user
        });
        setFormError('');
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setDeleteModal({ isOpen: true, couponId: id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.couponId) return;
        try {
            await couponsService.delete(deleteModal.couponId);
            setCoupons(coupons.filter(c => c.id !== deleteModal.couponId));
            setDeleteModal({ isOpen: false, couponId: null });
        } catch (error) {
            console.error("Failed to delete coupon", error);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');

        try {
            if (editingCoupon) {
                await couponsService.update(editingCoupon.id, formData);
            } else {
                await couponsService.create(formData);
            }
            fetchCoupons();
            setIsFormOpen(false);
        } catch (error: any) {
            console.error("Failed to save coupon", error);
            setFormError(error.response?.data?.message || 'Failed to save coupon. Please check the data and try again.');
        } finally {
            setSaving(false);
        }
    };

    const filteredCoupons = coupons.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-white">Coupons</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search coupons..."
                            className="bg-[#111827] text-white text-sm rounded-lg pl-9 pr-4 py-2 border border-gray-800 focus:outline-none focus:border-purple-500 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-purple-500/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Coupon</span>
                </button>
            </div>

            {/* Coupons Table */}
            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h3 className="text-white font-semibold">All Coupons</h3>
                    <span className="text-xs text-purple-400">Total: {coupons.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase bg-[#1F2937]/50">
                                <th className="p-4 font-medium">Code</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Amount</th>
                                <th className="p-4 font-medium">Usage</th>
                                <th className="p-4 font-medium">Expiry</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">Loading coupons...</td>
                                </tr>
                            ) : filteredCoupons.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No coupons found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCoupons.map((coupon) => (
                                    <tr key={coupon.id} className="border-b border-gray-800 hover:bg-[#1F2937]/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-purple-500/20 text-purple-500 flex items-center justify-center font-mono text-xs font-bold">
                                                    %
                                                </div>
                                                <div>
                                                    <span className="text-white font-bold font-mono tracking-tight">{coupon.code}</span>
                                                    {coupon.description && <p className="text-xs text-gray-500 mt-0.5">{coupon.description}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400 capitalize">
                                            {coupon.discount_type.replace('_', ' ')}
                                        </td>
                                        <td className="p-4 text-white font-medium">
                                            {coupon.discount_type === 'percent' ? `${coupon.amount}%` : `$${coupon.amount}`}
                                        </td>
                                        <td className="p-4 text-gray-400">
                                            {coupon.usage_count || 0} {coupon.usage_limit ? `/ ${coupon.usage_limit}` : ''}
                                        </td>
                                        <td className="p-4">
                                            {coupon.date_expires ? (
                                                <span className={`text-xs ${new Date(coupon.date_expires) < new Date() ? 'text-red-500' : 'text-gray-400'}`}>
                                                    {new Date(coupon.date_expires).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="text-gray-600 text-xs">Never</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-500">
                                                <button
                                                    onClick={() => handleEditClick(coupon)}
                                                    className="p-1.5 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(coupon.id)}
                                                    className="p-1.5 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between p-4 border-t border-gray-800 text-sm text-gray-400">
                    <div>Showing {filteredCoupons.length} results</div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span>Page {page}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            className="p-1 hover:bg-gray-700 rounded"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => fetchCoupons()}
                            className="ml-2 p-1 hover:bg-gray-700 rounded text-gray-500 hover:text-purple-400"
                            title="Refresh"
                        >
                            <RefreshCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1F2937] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-[#111827]">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Tag className="w-5 h-5 text-purple-500" />
                                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                            </h2>
                            <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                            {formError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-500 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{formError}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Coupon Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#111827] border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 font-mono focus:ring-1 focus:ring-purple-500 uppercase"
                                    placeholder="E.G. SUMMER2024"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Discount Type</label>
                                    <select
                                        className="w-full bg-[#111827] border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 appearance-none cursor-pointer"
                                        value={formData.discount_type}
                                        onChange={e => setFormData({ ...formData, discount_type: e.target.value as any })}
                                    >
                                        <option value="percent">Percentage (%)</option>
                                        <option value="fixed_cart">Fixed Amount ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Coupon Amount</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-[#111827] border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Description (Optional)</label>
                                <textarea
                                    className="w-full bg-[#111827] border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 min-h-[80px]"
                                    placeholder="Enter coupon description..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Expiry Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-[#111827] border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                                        value={formData.date_expires || ''}
                                        onChange={e => setFormData({ ...formData, date_expires: e.target.value || null })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Usage Limit</label>
                                    <input
                                        type="number"
                                        className="w-full bg-[#111827] border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                                        placeholder="Unlimited"
                                        value={formData.usage_limit || ''}
                                        onChange={e => setFormData({ ...formData, usage_limit: e.target.value ? parseInt(e.target.value) : null })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="individual_use"
                                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 accent-purple-600"
                                    checked={formData.individual_use}
                                    onChange={e => setFormData({ ...formData, individual_use: e.target.checked })}
                                />
                                <label htmlFor="individual_use" className="text-sm text-gray-300 cursor-pointer">
                                    Individual use only (cannot be used with other coupons)
                                </label>
                            </div>

                            <div className="p-6 border-t border-gray-800 bg-[#111827] -mx-6 -mb-6 flex items-center justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-8 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                                >
                                    {saving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    <span>{editingCoupon ? 'Update Coupon' : 'Create Coupon'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, couponId: null })}
                onConfirm={confirmDelete}
                title="Delete Coupon"
                message="Are you sure you want to delete this coupon? This will immediately disable it from being used."
                isDestructive={true}
            />
        </div>
    );
}

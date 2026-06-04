'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    ShoppingBag,
    Filter,
    Calendar,
    Mail,
    ChevronLeft,
    ChevronRight,
    Trophy,
    CheckCircle2,
    Clock,
    AlertCircle,
    User,
    Trash2,
    Settings,
    LayoutGrid,
    DollarSign,
    ExternalLink,
    Save,
    RefreshCw,
    Edit,
    Eye
} from 'lucide-react';
import { propFirmService, PropFirmRegistrationData } from '@/services/prop-firm.service';
import { getPropFirmSettings, updatePropFirmSettings, PricingTier } from '@/app/actions/prop-firm-settings';
import { SuccessModal, ErrorModal, ConfirmModal } from '@/components/admin/Modals';
import toast from 'react-hot-toast';

const STATUS_TABS = [
    { id: 'all', label: 'All Registrations' },
    { id: 'pending', label: 'Pending' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' },
    { id: 'settings', label: 'Settings' },
];

const PRICING_GROUPS = [
    {
        title: "Guaranteed Pass - 2 Step Challenge",
        tiers: [
            { id: "guaranteed-2step-step1-50000", label: "Step 1 - $50k" },
            { id: "guaranteed-2step-step1-100000", label: "Step 1 - $100k" },
            { id: "guaranteed-2step-step1-200000", label: "Step 1 - $200k" },
            { id: "guaranteed-2step-step1-500000", label: "Step 1 - $500k" },
            { id: "guaranteed-2step-full-50000", label: "Full - $50k" },
            { id: "guaranteed-2step-full-100000", label: "Full - $100k" },
            { id: "guaranteed-2step-full-200000", label: "Full - $200k" },
            { id: "guaranteed-2step-full-500000", label: "Full - $500k" },
        ]
    },
    {
        title: "Guaranteed Pass - 1 Step Challenge",
        tiers: [
            { id: "guaranteed-1step-full-50000", label: "Full - $50k" },
            { id: "guaranteed-1step-full-100000", label: "Full - $100k" },
            { id: "guaranteed-1step-full-200000", label: "Full - $200k" },
            { id: "guaranteed-1step-full-500000", label: "Full - $500k" },
        ]
    },
    {
        title: "Standard Pass - 2 Step Challenge",
        tiers: [
            { id: "standard-2step-step1-50000", label: "Step 1 - $50k" },
            { id: "standard-2step-step1-100000", label: "Step 1 - $100k" },
            { id: "standard-2step-step1-200000", label: "Step 1 - $200k" },
            { id: "standard-2step-step1-300000", label: "Step 1 - $300k" },
            { id: "standard-2step-step1-500000", label: "Step 1 - $500k" },
            { id: "standard-2step-full-50000", label: "Full - $50k" },
            { id: "standard-2step-full-100000", label: "Full - $100k" },
            { id: "standard-2step-full-200000", label: "Full - $200k" },
            { id: "standard-2step-full-500000", label: "Full - $500k" },
        ]
    },
    {
        title: "Standard Pass - 1 Step Challenge",
        tiers: [
            { id: "standard-1step-full-50000", label: "Full - $50k" },
            { id: "standard-1step-full-100000", label: "Full - $100k" },
            { id: "standard-1step-full-200000", label: "Full - $200k" },
            { id: "standard-1step-full-500000", label: "Full - $500k" },
        ]
    }
];

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        active: 'bg-green-500/10 text-green-400 border-green-500/20',
        pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase ${styles[status?.toLowerCase()] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
            {status}
        </span>
    );
};

export default function PropFirmRegistrationsPage() {
    const [registrations, setRegistrations] = useState<PropFirmRegistrationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);
    const limit = 50;
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: string | number | null }>({ isOpen: false, id: null });
    const [editingStatus, setEditingStatus] = useState<PropFirmRegistrationData | null>(null);
    const [viewingRegistration, setViewingRegistration] = useState<PropFirmRegistrationData | null>(null);
    const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

    // Settings State
    const [propFirmDiscountActive, setPropFirmDiscountActive] = useState(false);
    const [propFirmDiscountPercentage, setPropFirmDiscountPercentage] = useState(0);
    const [propFirmPricingTiers, setPropFirmPricingTiers] = useState<Record<string, PricingTier>>({});
    const [savingPropFirm, setSavingPropFirm] = useState(false);
    const [propFirmMessage, setPropFirmMessage] = useState('');

    // Update State
    const [updating, setUpdating] = useState<string | number | null>(null);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const skip = (page - 1) * limit;
            const data = await propFirmService.adminGetRegistrations(limit, skip);
            setRegistrations(data.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch registrations", error);
            setErrorModal({ isOpen: true, message: 'Failed to load registrations.' });
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete.id) return;
        try {
            await propFirmService.deleteRegistration(confirmDelete.id);
            setConfirmDelete({ isOpen: false, id: null });
            toast.success("Registration deleted successfully");
            await fetchRegistrations();
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete registration");
        }
    };

    useEffect(() => {
        fetchRegistrations();
        // Fetch Settings
        getPropFirmSettings().then(data => {
            setPropFirmDiscountActive(data.discountActive || false);
            setPropFirmDiscountPercentage(data.discountPercentage || 0);
            setPropFirmPricingTiers(data.pricingTiers || {});
        });
    }, [page]);

    const handleStatusUpdate = async (id: string | number, field: 'status' | 'payment_status', value: string) => {
        setUpdating(id);
        try {
            await propFirmService.updateRegistrationStatus(id, { [field]: value });
            toast.success(`Updated ${field.replace('_', ' ')} to ${value}`);
            await fetchRegistrations();
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Update failed. Please try again.");
        } finally {
            setUpdating(null);
        }
    };

    const handleSaveSettings = async () => {
        setSavingPropFirm(true);
        setPropFirmMessage('');
        try {
            await updatePropFirmSettings({
                discountActive: propFirmDiscountActive,
                discountPercentage: propFirmDiscountPercentage,
                pricingTiers: propFirmPricingTiers
            });
            toast.success('Settings saved successfully!');
            setPropFirmMessage('Prop firm settings saved successfully!');
        } catch (e) {
            toast.error('Failed to save settings.');
            setPropFirmMessage('Failed to save prop firm settings.');
        }
        setSavingPropFirm(false);
    };

    const filteredRegistrations = registrations.filter(reg => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = (
            reg.login_id?.toString().includes(search) ||
            reg.order_id?.toLowerCase().includes(search) ||
            reg.propfirm_name?.toLowerCase().includes(search) ||
            reg.telegram_username?.toLowerCase().includes(search)
        );

        const matchesTab = activeTab === 'all' || reg.status?.toLowerCase() === activeTab.toLowerCase();

        return matchesSearch && matchesTab;
    });

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'failed': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-white">Prop Firm Registrations</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search Login ID, Order, Firm..."
                            className="bg-[#111827] text-white text-sm rounded-lg pl-9 pr-4 py-2 border border-gray-800 focus:outline-none focus:border-purple-500 w-72"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    onClick={fetchRegistrations}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1F2937] border border-gray-800 text-gray-300 hover:bg-[#374151] rounded-lg text-sm font-medium transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-gray-800 overflow-x-auto scrollbar-hide">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${activeTab === tab.id
                            ? 'border-[#d946ef] text-[#d946ef] bg-[#d946ef]/5'
                            : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Settings Tab Content */}
            {activeTab === 'settings' && (
                <div className="bg-[#1F2937] border border-gray-800 rounded-xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-[#111827]/50">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Settings className="w-5 h-5 text-[#d946ef]" />
                                Prop Firm Global Settings
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">Manage pricing, seller links, and global discounts for Pass Funded services.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {propFirmMessage && (
                                <span className={`text-sm ${propFirmMessage.includes('success') ? 'text-[#d946ef]' : 'text-red-400'}`}>
                                    {propFirmMessage}
                                </span>
                            )}
                            <button
                                onClick={handleSaveSettings}
                                disabled={savingPropFirm}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#d946ef] hover:bg-[#c026d3] text-white font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {savingPropFirm ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </div>

                    <div className="p-8 space-y-12">
                        {/* Discount Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="p-6 bg-[#111827] rounded-xl border border-gray-800 space-y-6">
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-amber-500" />
                                    Global Discount Mode
                                </h3>
                                <div className="flex items-center gap-3 bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                                    <input
                                        type="checkbox"
                                        id="discountActive"
                                        checked={propFirmDiscountActive}
                                        onChange={(e) => setPropFirmDiscountActive(e.target.checked)}
                                        className="w-5 h-5 bg-[#111827] border-gray-700 rounded text-[#d946ef] focus:ring-[#d946ef]"
                                    />
                                    <label htmlFor="discountActive" className="text-sm font-medium text-gray-300 cursor-pointer">
                                        Activate Discount for all challenges
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1">Discount Percentage (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={propFirmDiscountPercentage}
                                        onChange={(e) => setPropFirmDiscountPercentage(Number(e.target.value))}
                                        className="w-full p-3 bg-[#1F2937] border border-gray-800 text-white rounded-lg focus:ring-1 focus:ring-[#d946ef] outline-none text-sm font-mono"
                                        placeholder="e.g. 15"
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-[#d946ef]/5 rounded-xl border border-[#d946ef]/10">
                                <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                                    <AlertCircle className="w-4 h-4 text-[#d946ef]" />
                                    Information
                                </h3>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Updating these settings will immediately affect the pricing cards on the
                                    <span className="text-white font-medium mx-1">/pass-funded-accounts</span>
                                    page and the checkout wizard. Ensure all seller links are correct to prevent checkout failures.
                                </p>
                            </div>
                        </div>

                        {/* Pricing Tiers Section */}
                        <div className="space-y-6">
                            <h3 className="text-white font-bold border-l-4 border-[#d946ef] pl-4">Pricing & Seller Links Configuration</h3>

                            <div className="grid grid-cols-1 gap-12">
                                {PRICING_GROUPS.map((group, groupIdx) => (
                                    <div key={groupIdx} className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-px flex-1 bg-gray-800" />
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{group.title}</span>
                                            <div className="h-px flex-1 bg-gray-800" />
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            {group.tiers.map((tier) => (
                                                <div key={tier.id} className="bg-[#111827]/40 hover:bg-[#111827] p-4 rounded-xl border border-gray-800/50 hover:border-gray-700 transition-all grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                                                    <div className="lg:col-span-3">
                                                        <span className="text-xs font-bold text-gray-300">{tier.label}</span>
                                                    </div>
                                                    <div className="lg:col-span-3 relative">
                                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                                        <input
                                                            type="number"
                                                            value={propFirmPricingTiers[tier.id]?.price || 0}
                                                            onChange={(e) => {
                                                                const val = Number(e.target.value);
                                                                setPropFirmPricingTiers(prev => ({
                                                                    ...prev,
                                                                    [tier.id]: { ...(prev[tier.id] || { sellerLink: '' }), price: val }
                                                                }));
                                                            }}
                                                            className="w-full pl-9 pr-3 py-2 bg-[#1F2937]/50 border border-gray-800 text-white rounded-lg focus:ring-1 focus:ring-[#d946ef] outline-none text-xs font-mono"
                                                            placeholder="Price"
                                                        />
                                                    </div>
                                                    <div className="lg:col-span-6 relative">
                                                        <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                                        <input
                                                            type="text"
                                                            value={propFirmPricingTiers[tier.id]?.sellerLink || ''}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setPropFirmPricingTiers(prev => ({
                                                                    ...prev,
                                                                    [tier.id]: { ...(prev[tier.id] || { price: 0 }), sellerLink: val }
                                                                }));
                                                            }}
                                                            className="w-full pl-9 pr-3 py-2 bg-[#1F2937]/50 border border-gray-800 text-white rounded-lg focus:ring-1 focus:ring-[#d946ef] outline-none text-xs font-mono"
                                                            placeholder="Seller Link (Whop, Sellar, etc.)"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Final Save Button */}
                        <div className="pt-8 border-t border-gray-800 flex items-center justify-end gap-4">
                            {propFirmMessage && (
                                <span className={`text-sm ${propFirmMessage.includes('success') ? 'text-[#d946ef]' : 'text-red-400'}`}>
                                    {propFirmMessage}
                                </span>
                            )}
                            <button
                                onClick={handleSaveSettings}
                                disabled={savingPropFirm}
                                className="flex items-center gap-2 px-12 py-3 bg-[#d946ef] hover:bg-[#c026d3] text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-[#d946ef]/20 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {savingPropFirm ? 'Saving...' : 'Save All Settings'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table and list hidden when settings tab is active */}
            {activeTab !== 'settings' && (
                <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-xl shadow-black/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase bg-[#1F2937]/50">
                                    <th className="p-4 font-medium">Order / Firm</th>
                                    <th className="p-4 font-medium">Account Details</th>
                                    <th className="p-4 font-medium">Status & Payment</th>
                                    <th className="p-4 font-medium">Contact</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center bg-[#111827]">
                                            <div className="flex items-center justify-center gap-3 text-gray-400">
                                                <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                                                <span>Loading registrations...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredRegistrations.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center bg-[#111827]">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center">
                                                    <Trophy className="w-6 h-6 text-gray-600" />
                                                </div>
                                                <div className="text-gray-400 font-medium">No registrations found</div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRegistrations.map((reg) => (
                                        <tr key={reg.registration_id} className="hover:bg-[#1F2937]/50 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold">{reg.order_id}</span>
                                                    <span className="text-xs text-purple-400 mt-1">{reg.propfirm_name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-400">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-white font-mono text-xs">{reg.login_id}</span>
                                                        <span className="text-[10px] bg-gray-800 px-1.5 rounded text-gray-500">{reg.server_type}</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 italic truncate max-w-[150px]">{reg.server_name}</p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <StatusBadge status={reg.status} />
                                                        <span className={`text-[10px] font-bold uppercase border px-1.5 py-0.5 rounded ${reg.payment_status === 'paid' ? 'text-emerald-400 border-emerald-500/30' : 'text-amber-400 border-amber-500/30'}`}>
                                                            {reg.payment_status}
                                                        </span>
                                                        <button
                                                            onClick={() => setEditingStatus(reg)}
                                                            className="p-1 text-gray-500 hover:text-purple-400 transition-colors"
                                                            title="Update Status"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col text-xs text-gray-400 gap-1">
                                                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {reg.telegram_username}</span>
                                                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {reg.whatsapp_no}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="flex flex-col items-end mr-2 text-[10px] text-gray-600">
                                                        <span>{new Date(reg.created_at).toLocaleDateString()}</span>
                                                        <span>{new Date(reg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setViewingRegistration(reg)}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all border border-transparent hover:border-gray-600"
                                                        title="Quick View"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDelete({ isOpen: true, id: reg.registration_id })}
                                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                                                        title="Delete"
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

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4 border-t border-gray-800 bg-[#111827]/30">
                        <p className="text-xs text-gray-500">
                            Showing <span className="text-gray-300">{filteredRegistrations.length}</span> registrations
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 text-gray-600 hover:text-white disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-xs text-gray-300 px-2 font-mono">{page}</span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={registrations.length < limit}
                                className="p-2 text-gray-600 hover:text-white disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {editingStatus && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#111827] border border-gray-800 rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                            <h3 className="text-white font-bold text-sm">Update Registration Status</h3>
                            <button onClick={() => setEditingStatus(null)} className="text-gray-500 hover:text-white transition-colors">
                                <AlertCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-gray-500 font-bold uppercase">Account Status</label>
                                <select
                                    className="w-full bg-[#1F2937] border border-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500"
                                    value={editingStatus.status}
                                    onChange={(e) => {
                                        handleStatusUpdate(editingStatus.registration_id, 'status', e.target.value);
                                        setEditingStatus({ ...editingStatus, status: e.target.value });
                                    }}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-gray-500 font-bold uppercase">Payment Status</label>
                                <select
                                    className="w-full bg-[#1F2937] border border-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500"
                                    value={editingStatus.payment_status}
                                    onChange={(e) => {
                                        handleStatusUpdate(editingStatus.registration_id, 'payment_status', e.target.value);
                                        setEditingStatus({ ...editingStatus, payment_status: e.target.value });
                                    }}
                                >
                                    <option value="pending">Unpaid</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-800/20 border-t border-gray-800">
                            <button
                                onClick={() => setEditingStatus(null)}
                                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition-all active:scale-95"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewingRegistration && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#0B0F19] border border-white/[0.08] rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400"></div>

                        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                                    <Eye className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <h3 className="text-white font-bold text-lg tracking-tight text-left">Registration Details</h3>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest text-left">Prop Firm Management</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingRegistration(null)}
                                className="text-gray-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full border border-transparent hover:border-white/10"
                            >
                                <AlertCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar text-left">
                            {/* Order Section */}
                            <div className="space-y-4 text-left">
                                <h4 className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] border-l-2 border-purple-500 pl-3 text-left">Order Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.03] p-5 rounded-2xl border border-white/[0.05]">
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left">Order ID</p>
                                        <p className="text-sm text-white font-black tracking-wider text-left">{viewingRegistration.order_id}</p>
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left">Firm Name</p>
                                        <p className="text-sm text-purple-400 font-bold text-left">{viewingRegistration.propfirm_name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Credentials Section */}
                            <div className="space-y-4 text-left">
                                <h4 className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] border-l-2 border-pink-500 pl-3 text-left">MT5 Credentials</h4>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-6 bg-white/[0.03] p-5 rounded-2xl border border-white/[0.05]">
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left">Login ID</p>
                                        <p className="text-sm text-white font-mono font-black tracking-wider bg-white/5 w-fit px-2 py-0.5 rounded border border-white/5 uppercase select-all text-left">
                                            {viewingRegistration.login_id}
                                        </p>
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left">Password</p>
                                        <p className="text-sm text-amber-400 font-mono font-bold tracking-wider bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 select-all text-left">
                                            {viewingRegistration.password || '••••••••'}
                                        </p>
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left">Server Name</p>
                                        <p className="text-xs text-gray-300 font-medium bg-white/5 px-2 py-1 rounded w-fit text-left">
                                            {viewingRegistration.server_name}
                                        </p>
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left">Server Type</p>
                                        <p className="text-xs text-gray-300 font-medium bg-white/5 px-2 py-1 rounded w-fit text-left">
                                            {viewingRegistration.server_type}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Plan Section */}
                            <div className="space-y-4 text-left">
                                <h4 className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] border-l-2 border-emerald-500 pl-3 text-left">Registration Plan</h4>
                                <div className="grid grid-cols-2 gap-6 bg-white/[0.03] p-5 rounded-2xl border border-white/[0.05]">
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left">Account Size</p>
                                        <p className="text-lg text-emerald-400 font-black tracking-tight text-left">
                                            ${viewingRegistration.account_size.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left">Phases / Steps</p>
                                        <p className="text-sm text-gray-200 font-bold text-left">{viewingRegistration.account_phases} Phases / Step {viewingRegistration.challenges_step}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Section */}
                            <div className="space-y-4 text-left">
                                <h4 className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] border-l-2 border-blue-500 pl-3 text-left">User Contact</h4>
                                <div className="grid grid-cols-2 gap-6 bg-white/[0.03] p-5 rounded-2xl border border-white/[0.05]">
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left">WhatsApp</p>
                                        <p className="text-sm text-white font-bold text-left">{viewingRegistration.whatsapp_no}</p>
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left">Telegram</p>
                                        <p className="text-sm text-blue-400 font-bold text-left">@{viewingRegistration.telegram_username}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Section */}
                            <div className="grid grid-cols-2 gap-6 text-left">
                                <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl space-y-2 text-left">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left">Current Status</p>
                                    <div className="w-fit scale-110 origin-left">
                                        <StatusBadge status={viewingRegistration.status} />
                                    </div>
                                </div>
                                <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl space-y-2 text-left">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left">Payment Status</p>
                                    <div className="w-fit scale-110 origin-left">
                                        <span className={`text-[10px] font-bold uppercase border px-2 py-0.5 rounded ${viewingRegistration.payment_status === 'paid' ? 'text-emerald-400 border-emerald-500/30' : 'text-amber-400 border-amber-500/30'}`}>
                                            {viewingRegistration.payment_status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white/[0.03] border-t border-white/[0.06] flex items-center gap-4">
                            <button
                                onClick={() => {
                                    setViewingRegistration(null);
                                    setEditingStatus(viewingRegistration);
                                }}
                                className="flex-1 py-3.5 bg-[#1F2937] hover:bg-[#374151] border border-gray-700 text-gray-300 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Update Status
                            </button>
                            <button
                                onClick={() => setViewingRegistration(null)}
                                className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-purple-500/20"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Delete Registration"
                message="Are you sure you want to delete this prop firm registration? This action cannot be undone."
                isDestructive={true}
            />

            <SuccessModal
                isOpen={successModal.isOpen}
                onClose={() => setSuccessModal({ isOpen: false, message: '' })}
                message={successModal.message}
            />

            <ErrorModal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ isOpen: false, message: '' })}
                message={errorModal.message}
            />
        </div>
    );
}

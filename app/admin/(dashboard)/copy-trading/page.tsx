'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    RefreshCw,
    Edit,
    Eye,
    Zap,
    ShieldCheck,
    Mail,
    User,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Server,
    Clock,
    Briefcase
} from 'lucide-react';
import { tradersService } from '@/lib/traders';
import { CopyTradingAdminRead } from '@/lib/types';
import { SuccessModal, ErrorModal } from '@/components/admin/Modals';
import toast from 'react-hot-toast';
import { getCopyTradingSettings, updateCopyTradingSettings, CopyTradingSettings } from '@/app/actions/copy-trading-settings';
import { Save, Plus, Trash2, Settings, DollarSign } from 'lucide-react';

const STATUS_TABS = [
    { id: 'all', label: 'All Connections' },
    { id: 'pending', label: 'Pending' },
    { id: 'active', label: 'Active' },
    { id: 'disconnected', label: 'Disconnected' },
    { id: 'failed', label: 'Failed' },
    { id: 'settings', label: 'Pricing & Settings' },
];

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        disconnected: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase ${styles[status?.toLowerCase()] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
            {status}
        </span>
    );
};

export default function CopyTradingAdminPage() {
    const [connections, setConnections] = useState<CopyTradingAdminRead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);
    const limit = 50;

    const [editingConnection, setEditingConnection] = useState<CopyTradingAdminRead | null>(null);
    const [viewingConnection, setViewingConnection] = useState<CopyTradingAdminRead | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);
    const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

    const [settings, setSettings] = useState<CopyTradingSettings | null>(null);
    const [savingSettings, setSavingSettings] = useState(false);

    const fetchConnections = async () => {
        try {
            setLoading(true);
            const skip = (page - 1) * limit;
            const response = await tradersService.getAllCopyTradingConnections(limit, skip);
            setConnections(response.data || []);
        } catch (error) {
            console.error("Failed to fetch connections", error);
            setErrorModal({ isOpen: true, message: 'Failed to load copy trading connections.' });
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        const data = await getCopyTradingSettings();
        setSettings(data);
    };

    useEffect(() => {
        fetchConnections();
        fetchSettings();
    }, [page]);

    const handleSaveSettings = async () => {
        if (!settings) return;
        setSavingSettings(true);
        try {
            await updateCopyTradingSettings(settings);
            toast.success("Copy Trading settings updated successfully!");
        } catch (error) {
            toast.error("Failed to update settings.");
        } finally {
            setSavingSettings(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdating(id);
        try {
            const result = await tradersService.updateCopyTradingStatus(id, newStatus);
            if (result) {
                toast.success(`Status updated to ${newStatus}. User has been notified via email.`);
                await fetchConnections();
                setEditingConnection(null);
            } else {
                toast.error("Failed to update status.");
            }
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Update failed. Please try again.");
        } finally {
            setUpdating(null);
        }
    };

    const filteredConnections = connections.filter(conn => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = (
            conn.account_id.toLowerCase().includes(search) ||
            conn.user_name.toLowerCase().includes(search) ||
            conn.user_email.toLowerCase().includes(search) ||
            conn.server.toLowerCase().includes(search)
        );

        const matchesTab = activeTab === 'all' || conn.status.toLowerCase() === activeTab.toLowerCase();

        return matchesSearch && matchesTab;
    });

    return (
        <div className="space-y-6 text-left">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                        <Zap className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Copy Trading</h1>
                        <p className="text-xs text-gray-500">Manage user Copy Trading connections</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search Account, User..."
                            className="bg-[#111827] text-white text-sm rounded-lg pl-9 pr-4 py-2 border border-gray-800 focus:outline-none focus:border-indigo-500 w-72 transition-all shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={fetchConnections}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1F2937] border border-gray-800 text-gray-300 hover:bg-[#374151] rounded-lg text-sm font-medium transition-all active:scale-95"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-gray-800 overflow-x-auto scrollbar-hide">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all duration-200 uppercase tracking-wider ${activeTab === tab.id
                            ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                            : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            {activeTab === 'settings' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Monthly Subscription Settings */}
                        <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-gray-800 bg-[#1F2937]/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                                        <DollarSign className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold tracking-tight">Subscription Pricing</h3>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Global Copy Trading Fee</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveSettings}
                                    disabled={savingSettings || !settings}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                                >
                                    {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                {settings && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[11px] text-gray-500 font-black uppercase tracking-widest ml-1">Monthly Fee ($)</label>
                                            <div className="relative group">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                                                <input
                                                    type="number"
                                                    value={settings.monthlyFee}
                                                    onChange={(e) => setSettings({ ...settings, monthlyFee: parseFloat(e.target.value) })}
                                                    className="w-full bg-[#0B0F19] border border-gray-800 text-white rounded-xl pl-11 pr-4 py-4 text-lg font-black outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                                    placeholder="399"
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-600 italic ml-1">This fee will be displayed to all users application for copy trading.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] text-gray-500 font-black uppercase tracking-widest ml-1">WooCommerce Product Slug</label>
                                            <div className="relative group">
                                                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    value={settings.productSlug}
                                                    onChange={(e) => setSettings({ ...settings, productSlug: e.target.value })}
                                                    className="w-full bg-[#0B0F19] border border-gray-800 text-white rounded-xl pl-11 pr-4 py-4 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all uppercase tracking-wider"
                                                    placeholder="COPY-TRADING-MONTHLY"
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-600 italic ml-1">The slug must match the product created in WooCommerce for payment processing.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6 flex gap-4">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                                <AlertCircle className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-white font-bold text-sm">Dynamic Subscription Model</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Updating the monthly fee will immediately change the price shown to users on the Copy Trading page.
                                    Ensure the WooCommerce product slug exists and is active to avoid checkout failures.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-2xl shadow-black/40">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-400 text-[10px] uppercase font-bold tracking-widest bg-[#1F2937]/50">
                                    <th className="p-4">User Details</th>
                                    <th className="p-4">MT5 Account</th>
                                    <th className="p-4">Server</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center bg-[#111827]">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                                <span className="text-gray-400 font-medium">Fetching connections...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredConnections.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-16 text-center bg-[#111827]">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 rounded-3xl bg-gray-800/50 flex items-center justify-center border border-white/5">
                                                    <ShieldCheck className="w-8 h-8 text-gray-600" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-gray-300 font-bold">No connections record</div>
                                                    <p className="text-xs text-gray-500">Records matching your search criteria will appear here.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredConnections.map((conn) => (
                                        <tr key={conn.id} className="hover:bg-[#1F2937]/30 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                                                        {conn.user_name?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-white font-bold truncate">{conn.user_name}</span>
                                                        <span className="text-[11px] text-gray-500 truncate flex items-center gap-1 group-hover:text-gray-400 transition-colors">
                                                            <Mail className="w-3 h-3" /> {conn.user_email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-left">
                                                <span className="text-indigo-400 font-mono text-xs font-bold bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10 uppercase">{conn.account_id}</span>
                                            </td>
                                            <td className="p-4 text-left">
                                                <div className="flex items-center gap-1.5 text-[11px] text-gray-300 font-medium">
                                                    <Server className="w-3 h-3 text-gray-500" />
                                                    <span>{conn.server}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-left">
                                                <div className="flex items-center gap-2">
                                                    <StatusBadge status={conn.status} />
                                                    <button
                                                        onClick={() => setEditingConnection(conn)}
                                                        className="p-1.5 text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                                                        title="Update Status"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 text-left">
                                                    <div className="flex flex-col items-end mr-3 text-[10px] text-gray-600 font-medium">
                                                        <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {new Date(conn.created_at).toLocaleDateString()}</span>
                                                        <span>{new Date(conn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setViewingConnection(conn)}
                                                        className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-all border border-transparent hover:border-gray-600 shadow-sm"
                                                        title="Quick View"
                                                    >
                                                        <Eye className="w-4 h-4" />
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
                    <div className="flex items-center justify-between p-4 border-t border-gray-800 bg-[#111827]/30 text-left">
                        <p className="text-xs text-gray-600 font-medium italic">
                            Showing <span className="text-indigo-400 font-bold">{filteredConnections.length}</span> copy trading connections
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-1.5 bg-[#1F2937] border border-gray-800 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-all shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-xs text-gray-400 font-mono bg-gray-800 px-3 py-1 rounded-md border border-white/5">{page}</span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={connections.length < limit}
                                className="p-1.5 bg-[#1F2937] border border-gray-800 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-all shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {editingConnection && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#111827] border border-white/[0.08] rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden ring-1 ring-white/10 text-left">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                            <h3 className="text-white font-bold text-sm flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 text-indigo-400" />
                                Update Connection Status
                            </h3>
                            <button onClick={() => setEditingConnection(null)} className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg">
                                <AlertCircle className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3 flex flex-col gap-1">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Account</span>
                                <span className="text-sm text-white font-mono font-bold">{editingConnection.account_id}</span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider ml-1">New Status</label>
                                <select
                                    disabled={updating === editingConnection.id}
                                    className="w-full bg-[#1F2937] border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                    value={editingConnection.status}
                                    onChange={(e) => handleStatusUpdate(editingConnection.id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="disconnected">Disconnected</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-4 bg-white/[0.02] border-t border-white/[0.06]">
                            <button
                                onClick={() => setEditingConnection(null)}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/30"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewingConnection && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300 text-left">
                    <div className="bg-[#0B0F19] border border-white/[0.08] rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600"></div>

                        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                                    <Eye className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-white font-bold text-lg tracking-tight">Connection Details</h3>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">MT5 Copy Trading</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingConnection(null)}
                                className="text-gray-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full border border-transparent hover:border-white/10"
                            >
                                <AlertCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar text-left">
                            {/* User Section */}
                            <div className="space-y-4">
                                <h4 className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] border-l-2 border-indigo-500 pl-3">User Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.03] p-5 rounded-2xl border border-white/[0.05]">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Display Name</p>
                                        <p className="text-sm text-white font-bold">{viewingConnection.user_name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email Address</p>
                                        <p className="text-sm text-indigo-400 font-bold break-all">{viewingConnection.user_email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Section */}
                            <div className="space-y-4 text-left">
                                <h4 className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] border-l-2 border-blue-500 pl-3">MT5 Account Credentials</h4>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-6 bg-white/[0.03] p-5 rounded-2xl border border-white/[0.05]">
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Account ID</p>
                                        <p className="text-sm text-white font-mono font-black tracking-wider bg-white/5 w-fit px-2 py-0.5 rounded border border-white/5 uppercase select-all">
                                            {viewingConnection.account_id}
                                        </p>
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Server</p>
                                        <p className="text-xs text-gray-300 font-medium flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded w-fit">
                                            <Server className="w-3" /> {viewingConnection.server}
                                        </p>
                                    </div>
                                    <div className="space-y-1 text-left col-span-2">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Account Password</p>
                                        <p className="text-sm text-amber-400 font-mono font-bold tracking-wider bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 select-all">
                                            {viewingConnection.password || '••••••••'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Section */}
                            <div className="grid grid-cols-2 gap-6 text-left">
                                <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl space-y-2">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Current Status</p>
                                    <div className="w-fit scale-110 origin-left">
                                        <StatusBadge status={viewingConnection.status} />
                                    </div>
                                </div>
                                <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl space-y-2">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Registration Date</p>
                                    <p className="text-[11px] text-gray-300 font-mono flex items-center gap-1.5">
                                        <Clock className="w-3 h-3 text-gray-500" />
                                        {new Date(viewingConnection.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white/[0.03] border-t border-white/[0.06] flex items-center gap-4">
                            <button
                                onClick={() => {
                                    setViewingConnection(null);
                                    setEditingConnection(viewingConnection);
                                }}
                                className="flex-1 py-3.5 bg-[#1F2937] hover:bg-[#374151] border border-gray-700 text-gray-300 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Update Status
                            </button>
                            <button
                                onClick={() => setViewingConnection(null)}
                                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

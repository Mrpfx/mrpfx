'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Activity,
    RefreshCcw,
    ExternalLink,
    Zap
} from 'lucide-react';
import { adminDynamicService, DynamicSignal } from '@/lib/admin-api';
import { ConfirmModal } from '@/components/admin/Modals';

export default function SignalsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [signals, setSignals] = useState<DynamicSignal[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState<'any' | 'vip' | 'free'>('any');
    const limit = 20;

    // Modal State
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, signalId: number | null }>({ isOpen: false, signalId: null });

    useEffect(() => {
        fetchSignals();
    }, [page, typeFilter]);

    const fetchSignals = async () => {
        setLoading(true);
        try {
            const offset = (page - 1) * limit;
            const type = typeFilter === 'any' ? undefined : typeFilter;
            const data = await adminDynamicService.getSignals(type, limit, offset);
            if (data && data.items) {
                setSignals(data.items);
            }
        } catch (error) {
            console.error("Failed to fetch signals", error);
            setSignals([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteModal({ isOpen: true, signalId: id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.signalId) return;

        try {
            await adminDynamicService.deleteSignal(deleteModal.signalId);
            setSignals(signals.filter(s => s.id !== deleteModal.signalId));
            setDeleteModal({ isOpen: false, signalId: null });
        } catch (error) {
            console.error("Failed to delete signal", error);
        }
    };

    const filteredSignals = signals.filter(signal =>
        signal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signal.instrument.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-white">Signals</h1>
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search signals..."
                            className="bg-gray-900/50 text-white text-sm rounded-lg pl-9 pr-4 py-2 border border-gray-800 focus:outline-none focus:border-purple-500 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        className="bg-gray-900/50 text-white text-sm rounded-lg px-3 py-2 border border-gray-800 focus:outline-none focus:border-purple-500"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                    >
                        <option value="any">All Types</option>
                        <option value="vip">VIP</option>
                        <option value="free">Free</option>
                    </select>
                    <Link
                        href="/admin/signals/add"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Signal</span>
                    </Link>
                </div>
            </div>

            {/* Signals Table */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h3 className="text-white font-semibold">Trading Signals</h3>
                    <span className="text-xs text-purple-400">Total: {signals.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase bg-gray-800/30">
                                <th className="p-4 font-medium flex items-center gap-2 cursor-pointer hover:text-white">
                                    Signal Title <ArrowUpDown className="w-3 h-3" />
                                </th>
                                <th className="p-4 font-medium">Instrument</th>
                                <th className="p-4 font-medium">Entry</th>
                                <th className="p-4 font-medium">SL</th>
                                <th className="p-4 font-medium">TP1</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500">Loading signals...</td>
                                </tr>
                            ) : filteredSignals.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500">
                                        No signals found. Click "Add Signal" to create one.
                                    </td>
                                </tr>
                            ) : (
                                filteredSignals.map((signal) => (
                                    <tr key={signal.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                                    <Zap className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-white font-medium block">{signal.title}</span>
                                                    <span className="text-gray-500 text-xs">{signal.status}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300 font-bold">{signal.instrument}</td>
                                        <td className="p-4 text-gray-400">{signal.entry}</td>
                                        <td className="p-4 text-red-400">{signal.sl}</td>
                                        <td className="p-4 text-green-400">{signal.tp1}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.2 px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${signal.signal_type === 'vip'
                                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                }`}>
                                                {signal.signal_type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 text-xs">{formatDate(signal.date)}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-400">
                                                <Link href={`/admin/signals/${signal.id}`} className="p-1.5 hover:text-white hover:bg-gray-700 rounded transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(signal.id)}
                                                    className="p-1.5 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
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
                <div className="flex items-center justify-between p-4 border-t border-gray-800 text-sm text-gray-400">
                    <div>Showing {filteredSignals.length} results</div>
                    <div className="flex items-center gap-2">
                        <span>Rows per page: {limit}</span>
                        <div className="flex gap-1 ml-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-1 hover:bg-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                className="p-1 hover:bg-gray-800 rounded"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, signalId: null })}
                onConfirm={confirmDelete}
                title="Delete Signal"
                message="Are you sure you want to delete this signal? This action cannot be undone."
                isDestructive={true}
            />
        </div>
    );
}

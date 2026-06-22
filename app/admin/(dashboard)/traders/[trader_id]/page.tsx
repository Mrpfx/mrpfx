'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    BarChart2,
    Info,
    Plus,
    ArrowLeft,
    TrendingUp,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import PerformanceList from '@/components/admin/traders/PerformanceList';
import PerformanceForm from '@/components/admin/traders/PerformanceForm';
import {
    traderService,
    Trader,
    TraderPerformance,
    TraderPerformanceCreate,
    TraderPerformanceUpdate
} from '@/services/trader.service';
import { SuccessModal, ErrorModal, ConfirmModal } from '@/components/admin/Modals';

export default function TraderPerformancePage() {
    const router = useRouter();
    const params = useParams();
    const traderId = params.trader_id as string;

    const [trader, setTrader] = useState<Trader | null>(null);
    const [performances, setPerformances] = useState<TraderPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPerf, setEditingPerf] = useState<TraderPerformance | null>(null);

    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, perfId: string | number | null }>({ isOpen: false, perfId: null });
    const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tradersResponse, perfResponse]: [any, any] = await Promise.all([
                traderService.getAllTraders(),
                traderService.getTraderPerformance(traderId)
            ]);

            // Extract traders array
            let traders: Trader[] = [];
            if (Array.isArray(tradersResponse)) {
                traders = tradersResponse;
            } else if (tradersResponse && tradersResponse.data && Array.isArray(tradersResponse.data)) {
                traders = tradersResponse.data;
            } else if (tradersResponse && tradersResponse.traders && Array.isArray(tradersResponse.traders)) {
                traders = tradersResponse.traders;
            }

            // Extract performance array
            let perfData: TraderPerformance[] = [];
            if (Array.isArray(perfResponse)) {
                perfData = perfResponse;
            } else if (perfResponse && perfResponse.data && Array.isArray(perfResponse.data)) {
                perfData = perfResponse.data;
            } else if (perfResponse && perfResponse.performance && Array.isArray(perfResponse.performance)) {
                perfData = perfResponse.performance;
            }

            const safeId = traderId ? traderId.toLowerCase().trim() : '';
            const decodedId = traderId ? decodeURIComponent(traderId).toLowerCase().trim() : '';

            const found = traders.find(t => {
                if (!t) return false;
                const tid = String(t.trader_id || '').toLowerCase().trim();
                const encTid = encodeURIComponent(tid);
                return tid === decodedId || tid === safeId || encTid === safeId || tid.replace(/\s+/g, '%20') === safeId;
            });

            if (found) {
                setTrader(found);
            }
            setPerformances(perfData);
        } catch (error: any) {
            console.error('Failed to fetch data:', error);
            setErrorModal({ isOpen: true, message: `Failed to fetch trader performance data: ${error?.message || 'Unknown error'}` });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (traderId) fetchData();
    }, [traderId]);

    const handleAddClick = () => {
        setEditingPerf(null);
        setShowForm(true);
    };

    const handleEditClick = (perf: TraderPerformance) => {
        setEditingPerf(perf);
        setShowForm(true);
    };

    const handleDeleteClick = (id: string | number) => {
        setConfirmDelete({ isOpen: true, perfId: id });
    };

    const handleSubmit = async (data: TraderPerformanceCreate | TraderPerformanceUpdate) => {
        try {
            if (editingPerf) {
                await traderService.updatePerformance(editingPerf.performance_id, data as TraderPerformanceUpdate);
                setSuccessModal({ isOpen: true, message: 'Performance record updated!' });
            } else {
                await traderService.addPerformance(traderId, data as TraderPerformanceCreate);
                setSuccessModal({ isOpen: true, message: 'Performance record added!' });
            }
            setShowForm(false);
            fetchData();
        } catch (error: any) {
            console.error('Submit failed:', error);
            const detail = error.response?.data?.detail || 'Operation failed.';
            setErrorModal({ isOpen: true, message: detail });
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete.perfId) return;
        try {
            await traderService.deletePerformance(confirmDelete.perfId);
            setConfirmDelete({ isOpen: false, perfId: null });
            setSuccessModal({ isOpen: true, message: 'Record deleted successfully!' });
            fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
            setErrorModal({ isOpen: true, message: 'Failed to delete record.' });
        }
    };

    if (loading && !trader) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                <p className="text-gray-400">Loading performance records...</p>
            </div>
        );
    }

    if (!trader && !loading) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-400">Trader not found.</p>
                <p className="text-xs text-gray-500 mt-2">ID: {traderId}</p>
                <button
                    onClick={() => router.push('/admin/traders')}
                    className="mt-4 text-purple-400 hover:underline"
                >
                    Back to Traders
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumbs / Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/admin/traders')}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            {trader?.name}
                            <span className="text-xs font-normal px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full uppercase tracking-wider">
                                {trader?.type}
                            </span>
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Manage monthly ROI and trading statistics.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push(`/admin/traders/edit/${traderId}`)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Info className="w-4 h-4" />
                        Edit Trader Info
                    </button>
                    <button
                        onClick={handleAddClick}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-purple-600/20"
                    >
                        <Plus className="w-4 h-4" />
                        Add Record
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#111827] border border-gray-800 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Profit Factor</p>
                    <p className="text-xl font-bold text-green-400">{trader?.profitFactor}</p>
                </div>
                <div className="bg-[#111827] border border-gray-800 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Avg Duration</p>
                    <p className="text-xl font-bold text-blue-400">{trader?.avgTradeDuration}</p>
                </div>
                <div className="bg-[#111827] border border-gray-800 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Best Trade</p>
                    <p className="text-xl font-bold text-white">{trader?.bestTrade}</p>
                </div>
                <div className="bg-[#111827] border border-gray-800 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Worst Trade</p>
                    <p className="text-xl font-bold text-red-400">{trader?.worstTrade}</p>
                </div>
            </div>

            {/* Form Overlay / Inline */}
            {showForm && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <PerformanceForm
                        initialData={editingPerf || undefined}
                        onSubmit={handleSubmit}
                        onCancel={() => setShowForm(false)}
                        isEditing={!!editingPerf}
                    />
                </div>
            )}

            {/* Performance List */}
            <PerformanceList
                performances={performances}
                loading={loading}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            {/* Modals */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, perfId: null })}
                onConfirm={handleDelete}
                title="Delete Record"
                message="Are you sure you want to delete this performance record? This action cannot be undone."
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

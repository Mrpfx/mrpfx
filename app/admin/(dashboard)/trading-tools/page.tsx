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
    Bot,
    Target,
    RefreshCcw,
    ExternalLink,
    Code
} from 'lucide-react';
import { adminDynamicService, DynamicTradingTool } from '@/lib/admin-api';
import { ConfirmModal } from '@/components/admin/Modals';

export default function TradingToolsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [tools, setTools] = useState<DynamicTradingTool[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState<'any' | 'bot' | 'indicator'>('any');
    const [categoryFilter, setCategoryFilter] = useState<'any' | 'vip' | 'free'>('any');

    // Modal State
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, toolId: number | null }>({ isOpen: false, toolId: null });

    useEffect(() => {
        fetchTools();
    }, [typeFilter, categoryFilter, page]);

    const fetchTools = async () => {
        setLoading(true);
        try {
            const type = typeFilter === 'any' ? undefined : typeFilter;
            const category = categoryFilter === 'any' ? undefined : categoryFilter;
            const offset = (page - 1) * pageSize;
            const response = await adminDynamicService.getTradingTools(type, category, pageSize, offset);

            if (response && response.items) {
                setTools(response.items);
                setTotal(response.total || response.items.length);
            } else if (Array.isArray(response)) {
                // Compatibility for old API if needed
                setTools(response);
                setTotal(response.length);
            }
        } catch (error) {
            console.error("Failed to fetch trading tools", error);
            setTools([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteModal({ isOpen: true, toolId: id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.toolId) return;

        try {
            await adminDynamicService.deleteTradingTool(deleteModal.toolId);
            setTools(tools.filter(t => t.id !== deleteModal.toolId));
            setDeleteModal({ isOpen: false, toolId: null });
        } catch (error) {
            console.error("Failed to delete tool", error);
        }
    };

    const filteredTools = tools.filter(tool =>
        tool.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-white">Trading Tools</h1>
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tools..."
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
                        <option value="bot">Bots</option>
                        <option value="indicator">Indicators</option>
                    </select>
                    <select
                        className="bg-gray-900/50 text-white text-sm rounded-lg px-3 py-2 border border-gray-800 focus:outline-none focus:border-purple-500"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as any)}
                    >
                        <option value="any">All Categories</option>
                        <option value="vip">VIP</option>
                        <option value="free">Free</option>
                    </select>
                    <Link
                        href="/admin/trading-tools/add"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Tool</span>
                    </Link>
                </div>
            </div>

            {/* Tools Table */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h3 className="text-white font-semibold">Bots & Indicators</h3>
                    <span className="text-xs text-purple-400">Total: {tools.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase bg-gray-800/30">
                                <th className="p-4 font-medium flex items-center gap-2 cursor-pointer hover:text-white">
                                    Tool Name <ArrowUpDown className="w-3 h-3" />
                                </th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">Loading tools...</td>
                                </tr>
                            ) : filteredTools.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No trading tools found. Click "Add Tool" to create one.
                                    </td>
                                </tr>
                            ) : (
                                filteredTools.map((tool) => (
                                    <tr key={tool.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                    {tool.tool_type === 'bot' ? <Bot className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <span className="text-white font-medium block">{tool.title}</span>
                                                    <span className="text-gray-500 text-xs line-clamp-1 max-w-[300px]">{tool.description}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold ${tool.tool_type === 'bot' ? 'text-cyan-400 bg-cyan-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                                                {tool.tool_type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.2 px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${tool.category === 'vip'
                                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                : 'bg-green-500/10 text-green-500 border-green-500/20'
                                                }`}>
                                                {tool.category}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${tool.status === 'publish'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                                }`}>
                                                {tool.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-400">
                                                {tool.purchase_url && (
                                                    <Link href={tool.purchase_url} target="_blank" className="p-1.5 hover:text-cyan-400 hover:bg-gray-700 rounded transition-colors">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                )}
                                                <Link href={`/admin/trading-tools/${tool.id}`} className="p-1.5 hover:text-white hover:bg-gray-700 rounded transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(tool.id)}
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

                {/* Footer and Pagination */}
                <div className="flex items-center justify-between p-4 border-t border-gray-800 text-sm text-gray-400">
                    <div>
                        Showing {tools.length} of {total} results
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            className="p-1 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-1">
                            <span className="text-white font-medium">{page}</span>
                            <span className="text-gray-600">/</span>
                            <span>{Math.ceil(total / pageSize) || 1}</span>
                        </div>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= Math.ceil(total / pageSize) || loading}
                            className="p-1 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, toolId: null })}
                onConfirm={confirmDelete}
                title="Delete Trading Tool"
                message="Are you sure you want to delete this trading tool? This action cannot be undone."
                isDestructive={true}
            />
        </div>
    );
}

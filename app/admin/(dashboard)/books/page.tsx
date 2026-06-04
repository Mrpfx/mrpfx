'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Book,
    ArrowUpDown,
    Download,
    ExternalLink,
    Lock,
    Unlock
} from 'lucide-react';
import { adminDynamicService, DynamicBook } from '@/lib/admin-api';
import { ConfirmModal } from '@/components/admin/Modals';

export default function BooksPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [books, setBooks] = useState<DynamicBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'any' | 'free' | 'paid'>('any');

    // Modal State
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, bookId: number | null }>({ isOpen: false, bookId: null });

    useEffect(() => {
        fetchBooks();
    }, [filter]);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const isFree = filter === 'any' ? undefined : filter === 'free';
            const data = await adminDynamicService.getBooks(isFree);
            if (data && data.items) {
                setBooks(data.items);
            }
        } catch (error) {
            console.error("Failed to fetch books", error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteModal({ isOpen: true, bookId: id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.bookId) return;

        try {
            await adminDynamicService.deleteBook(deleteModal.bookId);
            setBooks(books.filter(b => b.id !== deleteModal.bookId));
            setDeleteModal({ isOpen: false, bookId: null });
        } catch (error) {
            console.error("Failed to delete book", error);
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-white">Forex Books</h1>
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search books..."
                            className="bg-gray-900/50 text-white text-sm rounded-lg pl-9 pr-4 py-2 border border-gray-800 focus:outline-none focus:border-purple-500 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        className="bg-gray-900/50 text-white text-sm rounded-lg px-3 py-2 border border-gray-800 focus:outline-none focus:border-purple-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                    >
                        <option value="any">All Books</option>
                        <option value="free">Free Books</option>
                        <option value="paid">Paid Books</option>
                    </select>
                    <Link
                        href="/admin/books/add"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Book</span>
                    </Link>
                </div>
            </div>

            {/* Books Table */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h3 className="text-white font-semibold">Educational Resources</h3>
                    <span className="text-xs text-purple-400">Total: {books.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase bg-gray-800/30">
                                <th className="p-4 font-medium flex items-center gap-2 cursor-pointer hover:text-white">
                                    Book Title <ArrowUpDown className="w-3 h-3" />
                                </th>
                                <th className="p-4 font-medium">Access</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">Loading books...</td>
                                </tr>
                            ) : filteredBooks.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No books found. Click "Add Book" to create one.
                                    </td>
                                </tr>
                            ) : (
                                filteredBooks.map((book) => (
                                    <tr key={book.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                    <Book className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-white font-medium block">{book.title}</span>
                                                    <span className="text-gray-500 text-xs line-clamp-1 max-w-[400px]">{book.description}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5">
                                                {book.is_free ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-green-400 bg-green-400/10 border border-green-500/20">
                                                        <Unlock className="w-3 h-3" />
                                                        FREE
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-orange-400 bg-orange-400/10 border border-orange-500/20">
                                                        <Lock className="w-3 h-3" />
                                                        Whop Exclusive
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${book.status === 'publish'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                                }`}>
                                                {book.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-400">
                                                {book.download_url && (
                                                    <Link href={book.download_url} target="_blank" className="p-1.5 hover:text-emerald-400 hover:bg-gray-700 rounded transition-colors" title="Download Link">
                                                        <Download className="w-4 h-4" />
                                                    </Link>
                                                )}
                                                {book.purchase_url && (
                                                    <Link href={book.purchase_url} target="_blank" className="p-1.5 hover:text-cyan-400 hover:bg-gray-700 rounded transition-colors" title="Purchase Link">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                )}
                                                <Link href={`/admin/books/${book.id}`} className="p-1.5 hover:text-white hover:bg-gray-700 rounded transition-colors" title="Edit">
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(book.id)}
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

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-gray-800 text-sm text-gray-400">
                    <div>Showing {filteredBooks.length} results</div>
                </div>
            </div>

            {/* Modals */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, bookId: null })}
                onConfirm={confirmDelete}
                title="Delete Book"
                message="Are you sure you want to delete this book? This action cannot be undone."
                isDestructive={true}
            />
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    BarChart2,
    ShoppingBag,
    CheckSquare,
    Star,
    Users,
    DollarSign,
    Puzzle,
    Settings,
    FileText,
    Search,
    ChevronDown,
    Zap,
    BookOpen,
    Folder,
    Tag,
    Ticket,
    ShoppingBag as OrdersIcon,
    MessageSquare,
    Layout,
    Image as ImageIcon,
    X,
    LogOut,
    Bot,
    Book,
    Youtube,
    Trophy,
    Briefcase,
    Mail,
    Shield
} from 'lucide-react';
import { authService, User } from '@/lib/auth';
import { ConfirmModal } from '@/components/admin/Modals';

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const AdminSidebar = ({ isOpen = false, onClose }: AdminSidebarProps) => {
    const pathname = usePathname();

    const [user, setUser] = useState<User | null>(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const u = await authService.getCurrentUser();
                setUser(u);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                // Fallback to token if API fails
                setUser(authService.getUserFromToken());
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        authService.logout();
    };

    const getInitials = (name: string | null) => {
        if (!name) return 'AD';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const menuGroups = [
        {
            title: '', // Main group
            items: [
                { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
                { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
                { name: 'Users', href: '/admin/users', icon: Users },
                { name: 'Orders', href: '/admin/orders', icon: OrdersIcon },
                { name: 'Prop Firm', href: '/admin/prop-firm', icon: Trophy },
                { name: 'Account Mgmt', href: '/admin/account-management', icon: Briefcase },
                { name: 'Copy Trading', href: '/admin/copy-trading', icon: Zap },
                { name: 'Traders', href: '/admin/traders', icon: Users },
                { name: 'Reports', href: '/admin/reports', icon: BarChart2 },
                { name: 'Courses', href: '/admin/courses', icon: BookOpen },
                { name: 'Products', href: '/admin/products', icon: ShoppingBag },
                { name: 'Posts', href: '/admin/posts', icon: FileText },
                { name: 'Pages', href: '/admin/pages', icon: FileText },
                { name: 'Forms', href: '/admin/forms', icon: Layout },
                { name: 'Categories', href: '/admin/categories', icon: Folder },
                { name: 'Tags', href: '/admin/tags', icon: Tag },
                { name: 'Comments', href: '/admin/comments', icon: MessageSquare },
                { name: 'Media', href: '/admin/media', icon: ImageIcon },
                { name: 'Members', href: '/admin/members', icon: Users },
                { name: 'Shortlinks', href: '/admin/links', icon: Zap },
                { name: 'Settings', href: '/admin/settings', icon: Settings },
                { name: 'Security', href: '/admin/settings/security', icon: Shield },
            ]
        },
        {
            title: 'Dynamic Content',
            items: [
                { name: 'Signals', href: '/admin/signals', icon: Zap },
                { name: 'Trading Tools', href: '/admin/trading-tools', icon: Bot },
                { name: 'Forex Books', href: '/admin/books', icon: Book },
                { name: 'Trading Videos', href: '/admin/videos', icon: Youtube },
            ]
        }
    ];

    return (
        <aside className={`
            w-64 bg-[#111827] text-gray-400 h-screen flex flex-col border-r border-gray-800
            fixed left-0 top-0 bottom-0 z-50
            transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
        `}>
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-white text-xl font-bold font-sans">MRPFX</span>
                {/* Close button on mobile */}
                <button
                    onClick={onClose}
                    className="ml-auto p-1.5 rounded-lg hover:bg-[#1F2937] transition-colors md:hidden"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>
                <span className="ml-auto text-xs text-gray-600 hidden md:block">&lt; &gt;</span>
            </div>

            {/* Search */}
            <div className="px-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search for..."
                        className="w-full bg-[#1F2937] text-white text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none focus:ring-1 focus:ring-blue-500 border border-transparent placeholder-gray-600"
                    />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
                {menuGroups.map((group, idx) => (
                    <div key={idx}>
                        {group.title && (
                            <div className="flex items-center justify-between px-2 mb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{group.title}</span>
                                {group.title && <ChevronDown className="w-3 h-3 text-gray-600" />}
                            </div>
                        )}
                        <ul className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                                ? 'bg-[#1F2937] text-white shadow-sm'
                                                : 'hover:bg-[#1F2937] hover:text-white'
                                                }`}
                                        >
                                            <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-purple-400'}`} />
                                            <span className="font-medium">{item.name}</span>
                                            {item.name === 'Dashboard' && (
                                                <ChevronDown className="w-4 h-4 ml-auto text-gray-500" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-800">

                {/* User Profile */}
                <div className="bg-[#1F2937] rounded-xl p-3 mt-4 flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {getInitials(user?.display_name || user?.user_login || 'Admin')}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                                {user?.display_name || user?.user_login || 'Admin'}
                            </p>
                            <p className="text-xs text-gray-400 truncate">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-500 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
                title="Logout"
                message="Are you sure you want to log out? You will need to sign in again to access the admin panel."
                isDestructive={true}
            />
        </aside>
    );
};

export default AdminSidebar;

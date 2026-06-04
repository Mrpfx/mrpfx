'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { authService, User } from '@/lib/auth';
import PromoBanner from './PromoBanner';
import { ChevronDown, Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
          } catch (error: any) {
            console.error('Failed to fetch user:', error);
            if (error.response && error.response.status === 403) {
              const tokenUser = authService.getUserFromToken();
              if (tokenUser) {
                setUser(tokenUser);
                return;
              }
            }
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      }
    };

    fetchUser();
    const handleAuthChange = () => fetchUser();
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setMobileSubMenu(null);
  };

  const toggleMobileSubMenu = (menu: string) => {
    setMobileSubMenu(mobileSubMenu === menu ? null : menu);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setMobileSubMenu(null);
    setOpenDropdown(null);
  };

  const menuCategories = [
    {
      id: 'signals',
      label: 'Signals',
      items: [
        { label: 'VIP Signals', href: '/vip-signals-group' },
        { label: 'Free Signals', href: 'https://t.me/mrpfxuniversity', isExternal: true },
      ]
    },
    {
      id: 'automation',
      label: 'Automation',
      items: [
        { label: 'Copy Trading', href: '/copy-trading' },
        { label: 'Account Management', href: '/account-management' },
        { label: 'Pass Funded Accounts', href: '/pass-funded-accounts' },
      ]
    },
    {
      id: 'bots-indicators',
      label: 'Bots & Indicators',
      items: [
        { label: 'VIP Bots', href: '/vip-trading-bots' },
        { label: 'VIP Indicators', href: '/vip-trading-indicators' },
        { label: 'Free Bots', href: '/free-robots' },
        { label: 'Free Indicators', href: '/free-trading-indicators' },
      ]
    },
    {
      id: 'education-tools',
      label: 'Education & Tools',
      items: [
        { label: 'Mentorship Course', href: '/mentorship-course' },
        { label: 'Forex Books', href: '/forex-books' },
        { label: 'Trade Journal', href: '/' },
        { label: 'Risk Calculator', href: '/risk-calculator' },
      ]
    },
    {
      id: 'partners',
      label: 'Partners',
      items: [
        { label: 'Recommended Broker', href: 'https://one.exnessonelink.com/a/0z72b5esoc', isExternal: true },
        { label: 'Dr. Trade AI', href: 'https://www.drtradepro.com', isExternal: true },
      ]
    }
  ];

  return (
    <header id="masthead" className="sticky top-0 z-[9999] bg-white w-full shadow-sm">
      <PromoBanner />

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-6 py-3 max-w-full mx-auto border-b border-gray-100">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <img alt="Mr P FX" src="/assets/images/mrpfxlogo.png" width={52} height={52} className="h-[52px] w-auto" />
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav aria-label="Menu" className="flex-1 flex justify-center">
          <ul className="flex items-center justify-center gap-1 list-none m-0 p-0">
            {menuCategories.map((cat) => (
              <li
                key={cat.id}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(cat.id)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2.5 font-dm-sans text-[11px] font-bold text-gray-900 uppercase tracking-wider rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap">
                  {cat.label}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === cat.id ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                <div className={`absolute top-full left-0 mt-1 min-w-[220px] bg-white z-[99999] rounded-xl shadow-xl border border-gray-100 p-2 transition-all duration-200 ${openDropdown === cat.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                  {cat.items.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      target={item.isExternal ? "_blank" : undefined}
                      className="block px-4 py-2.5 font-dm-sans text-sm font-semibold text-gray-700 hover:bg-[#5B2EFF] hover:text-white rounded-lg transition-all"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Buttons / User Dropdown */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('user-menu')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 font-bold text-sm hover:border-[#5B2EFF] transition-all">
                <div className="w-8 h-8 rounded-full bg-[#5B2EFF] text-white flex items-center justify-center text-xs">
                  {user.user_email?.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate text-xs">{user.user_email}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              <div className={`absolute top-full right-0 mt-1 min-w-[220px] bg-white rounded-xl shadow-xl border border-gray-100 p-2 transition-all duration-200 z-[99999] ${openDropdown === 'user-menu' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 font-dm-sans text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                  <LayoutDashboard className="w-4 h-4 text-[#5B2EFF]" />
                  My Dashboard
                </Link>
                <div className="border-t border-gray-50 my-1"></div>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 font-dm-sans text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="px-5 py-2.5 font-dm-sans text-sm font-bold text-[#5B2EFF] hover:bg-gray-50 transition-all">Log In</Link>
              <Link href="/sign-up" className="bg-[#5B2EFF] text-white px-6 py-2.5 rounded-lg font-dm-sans text-sm font-bold hover:bg-[#4920cc] transition-all shadow-md shadow-blue-500/20">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 relative z-[9999]">
        <Link href="/">
          <img alt="Mr P FX" src="/assets/images/mrpfxlogo.png" width={44} height={44} className="h-11 w-auto" />
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <Link href="/dashboard" className="w-9 h-9 rounded-full bg-[#5B2EFF] text-white flex items-center justify-center font-bold shadow-md">
              {user.user_email?.charAt(0).toUpperCase()}
            </Link>
          )}
          <button onClick={toggleMenu} className="p-1">
            {isMenuOpen ? <X className="w-8 h-8 text-black" /> : <Menu className="w-8 h-8 text-black" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[10000] bg-white overflow-y-auto animate-in slide-in-from-right duration-300">
          {/* Top Bar inside Menu for easy exiting */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-[10001]">
            <Link href="/" onClick={closeMenu}>
              <img alt="Mr P FX" src="/assets/images/mrpfxlogo.png" width={44} height={44} className="h-11 w-auto" />
            </Link>
            <button onClick={closeMenu} className="p-1">
              <X className="w-8 h-8 text-black" />
            </button>
          </div>

          <div className="px-6 py-6 pb-20">
            {menuCategories.map((cat) => (
              <div key={cat.id} className="mb-4">
                <button
                  onClick={() => toggleMobileSubMenu(cat.id)}
                  className="w-full flex items-center justify-between py-3 text-lg font-bold text-gray-900 border-b border-gray-50"
                >
                  {cat.label}
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileSubMenu === cat.id ? 'rotate-180' : ''}`} />
                </button>
                {mobileSubMenu === cat.id && (
                  <div className="bg-gray-50/50 rounded-xl mt-2 p-2 grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {cat.items.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        target={item.isExternal ? "_blank" : undefined}
                        onClick={closeMenu}
                        className="px-4 py-3 text-gray-600 font-semibold text-sm hover:text-[#5B2EFF] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="mt-8 grid grid-cols-1 gap-4">
              {!user ? (
                <>
                  <Link href="/login" onClick={closeMenu} className="w-full py-4 text-center font-bold text-gray-900 bg-gray-100 rounded-2xl">Log In</Link>
                  <Link href="/sign-up" onClick={closeMenu} className="w-full py-4 text-center font-bold text-white bg-[#5B2EFF] rounded-2xl shadow-lg shadow-blue-500/20">Sign Up</Link>
                </>
              ) : (
                <button onClick={() => { handleLogout(); closeMenu(); }} className="w-full py-4 text-center font-bold text-red-600 bg-red-50 rounded-2xl">Logout</button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

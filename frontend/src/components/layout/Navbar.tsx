'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Menu,
  X,
  Compass,
  Sparkles,
  Building2,
  Car,
  LogOut,
  Package,
} from 'lucide-react';

const authLinks = [
  { href: '/plan', label: 'Plan', icon: Sparkles },
  { href: '/stays', label: 'Stays', icon: Building2 },
  { href: '/move', label: 'Move', icon: Car },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/book', label: 'Trip', icon: Package },
];

const guestLinks = [
  { href: '/discover', label: 'Discover' },
  { href: '/#about-section', label: 'About' },
  { href: '/#feature-section', label: 'Features' },
  { href: '/#vision-section', label: 'Visions' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = isLoggedIn ? authLinks : guestLinks;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getUserInitials = () => 'AV'; // placeholder — swap with real user data

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-boq-dark-900/95 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/40'
          : 'bg-boq-dark-900/80 backdrop-blur-md border-b border-white/5'
      }`}
      id="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18" style={{ height: '72px' }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" id="navbar-logo">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden transition-all duration-500 ease-out border border-white/10 group-hover:border-boq-teal-400/40">
              <Image
                src="/logo.png"
                alt="BoqZel"
                fill
                sizes="40px"
                className="object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-boq-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="text-xl font-black tracking-tighter text-boq-text-primary group-hover:text-glow-teal transition-all duration-300">
              Boq<span className="text-boq-teal-400">Zel</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'text-boq-teal-400 bg-boq-teal-500/8'
                      : 'text-boq-text-secondary hover:text-boq-text-primary hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="nav-indicator"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-boq-text-secondary hover:text-boq-text-primary transition-all underline-offset-4 hover:underline"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 bg-boq-teal-500 hover:bg-boq-teal-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-boq-teal-500/20"
                >
                  Join BoqZel
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button className="relative p-2 text-boq-text-secondary hover:text-boq-text-primary hover:bg-white/5 rounded-full transition-all">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-boq-teal-400 rounded-full ring-2 ring-boq-dark-900" />
                </button>
                <div className="h-8 w-[1px] bg-white/10" />
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded-xl transition-all"
                >
                  <LogOut size={16} />
                  Logout
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-boq-teal-500 to-boq-teal-300 border-2 border-white/10 flex items-center justify-center text-white text-sm font-black shadow-lg cursor-pointer hover:scale-105 transition-transform">
                  {getUserInitials()}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-boq-text-secondary hover:text-boq-text-primary rounded-lg"
            id="nav-mobile-toggle"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-boq-dark-800/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => {
                const Icon = 'icon' in link ? (link as any).icon : null;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-xl transition-all ${
                      isActive
                        ? 'text-boq-teal-400 bg-boq-teal-500/10'
                        : 'text-boq-text-secondary hover:text-boq-text-primary hover:bg-white/5'
                    }`}
                  >
                    {Icon && <Icon size={20} className={isActive ? 'text-boq-teal-400' : 'text-boq-text-muted'} />}
                    {link.label}
                  </Link>
                );
              })}

              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5 mt-4">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex justify-center py-3 text-sm font-bold text-boq-text-primary glass rounded-xl"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex justify-center py-3 text-sm font-bold text-white bg-boq-teal-500 rounded-xl shadow-lg shadow-boq-teal-500/10"
                  >
                    Join Now
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/5 mt-4">
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-base font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded-xl transition-all"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

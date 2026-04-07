'use client';

import { ElementType } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  IconBrandInstagram,
  IconBrandX,
  IconMail,
  IconArrowRight 
} from '@tabler/icons-react';

interface FooterLink {
  label: string;
  href: string;
  icon?: ElementType<{ size?: number; className?: string }>;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    title: 'Discover',
    links: [
      { label: 'AI Scout', href: '/plan' },
      { label: 'Travel Guides', href: '/discover' },
      { label: 'Destinations', href: '/discover' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'AI Planner', href: '/plan' },
      { label: 'Trip Bundles', href: '/book' },
      { label: 'Luxury Stays', href: '/stays' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/#contact-section' },
    ],
  },
  {
    title: 'Social',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/boqzel?igsh=M3B1NnY2Zm12ZmZj&utm_source=qr', icon: IconBrandInstagram },
      { label: 'X', href: 'https://x.com/BoqZel', icon: IconBrandX },
      { label: 'Gmail', href: 'mailto:boqzel676@gmail.com', icon: IconMail },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#050a14] pt-24 pb-0 overflow-hidden border-t border-white/5" id="main-footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Logo */}
        <div className="mb-16">
          <Link href="/" className="inline-block group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 group-hover:border-boq-teal-400/30 transition-all duration-500">
              <Image
                src="/logo.png"
                alt="BoqZel Logo"
                fill
                sizes="48px"
                className="object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
              />
            </div>
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-20">
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h4 className="text-xs font-bold text-boq-text-muted tracking-widest uppercase mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4">
                  {section.links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-base font-medium text-boq-text-secondary hover:text-boq-text-primary hover:translate-x-1 inline-flex items-center gap-2.5 transition-all duration-300 group/link"
                        >
                          {Icon && <Icon size={18} className="text-boq-text-muted group-hover/link:text-boq-teal-400 transition-colors" />}
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <h4 className="text-xs font-bold text-boq-text-muted tracking-widest uppercase mb-6">
              Stay ahead with BoqZel
            </h4>
            <p className="text-sm text-boq-text-secondary mb-6 leading-relaxed">
              Experience the future of travel planning with our AI-driven insights.
            </p>
            <div className="relative group">
              <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl focus-within:border-boq-teal-500/50 transition-all duration-500">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 bg-transparent border-none px-4 py-2.5 text-sm font-medium text-boq-text-primary placeholder:text-boq-text-muted focus:outline-none focus:ring-0"
                />
                <button className="px-6 py-2.5 bg-boq-teal-500 hover:bg-boq-teal-400 text-white rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-boq-teal-500/20 active:scale-95">
                  Register now
                  <IconArrowRight size={16} />
                </button>
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-boq-teal-500/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-12 border-t border-white/5">
          <div className="text-sm font-medium text-boq-text-muted flex items-center gap-2">
            <span>BoqZel Global</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>Digital Assets — 2026</span>
          </div>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-sm font-medium text-boq-text-muted hover:text-boq-text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm font-medium text-boq-text-muted hover:text-boq-text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Massive Branding Text */}
      <div className="relative w-full overflow-hidden select-none pointer-events-none h-48 md:h-80 lg:h-96 -mt-12 md:-mt-24 lg:-mt-32">
        <h2 className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 text-[20vw] font-black tracking-tighter text-white/[0.15] leading-none text-center">
          BOQZEl
        </h2>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-transparent to-transparent h-full w-full" />
      </div>
    </footer>
  );
}

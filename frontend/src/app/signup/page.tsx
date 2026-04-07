'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, Mail, Lock, ArrowRight, Command, Globe } from 'lucide-react';
import Image from 'next/image';

import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const { login } = useAuth();

  return (
    <main className="min-h-screen bg-boq-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-boq-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden group-hover:glow-teal transition-all duration-300">
              <Image src="/logo.png" alt="BoqZel" fill sizes="(max-width: 768px) 100vw, 40px" className="object-cover" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">BoqZel</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2 font-outfit">Join BoqZel</h1>
          <p className="text-boq-text-muted">Start planning your bespoke travel experiences today.</p>
        </div>

        <div className="glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-semibold text-boq-text-muted uppercase tracking-wider mb-2 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-boq-text-muted" size={18} />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full bg-boq-dark-600/50 border border-boq-border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-boq-text-muted focus:outline-none focus:border-boq-teal-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-boq-text-muted uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-boq-text-muted" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full bg-boq-dark-600/50 border border-boq-border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-boq-text-muted focus:outline-none focus:border-boq-teal-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-boq-text-muted uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-boq-text-muted" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-boq-dark-600/50 border border-boq-border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-boq-text-muted focus:outline-none focus:border-boq-teal-500 transition-all text-sm"
                />
              </div>
            </div>

            <button
              onClick={login}
              className="w-full py-4 bg-boq-teal-500 hover:bg-boq-teal-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-boq-teal-500/20 group cursor-pointer"
            >
              Start Planning Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-boq-border"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-boq-text-muted font-medium">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a 
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
              className="flex items-center justify-center gap-2 py-3 glass rounded-xl hover:bg-white/10 transition-all text-sm font-medium text-white border border-white/5 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </a>
            <a 
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`}
              className="flex items-center justify-center gap-2 py-3 glass rounded-xl hover:bg-white/10 transition-all text-sm font-medium text-white border border-white/5 group"
            >
              <svg className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-boq-text-muted">
          Already have an account? <Link href="/login" className="text-boq-teal-400 font-semibold hover:text-boq-teal-300 transition-colors">Log In</Link>
        </p>
      </motion.div>
    </main>
  );
}

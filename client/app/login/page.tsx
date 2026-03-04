// client/app/login/page.tsx
'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Simulating a delay for smooth UX
      setTimeout(() => {
         router.push('/dashboard'); 
      }, 500);
    } catch (err: any) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE: Branding & Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500 blur-[100px]"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500 blur-[100px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-xl">
            <LayoutDashboard size={28} />
            <span>SmartFunnel</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
            Turn Raw Leads into <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Intelligent Revenue.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md">
            The AI-powered engine that predicts, prioritizes, and automates your sales pipeline in real-time.
          </p>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          © 2026 SmartFunnel Inc. Final Year Project.
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to access your dashboard
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-500">Forgot password?</a>
                 </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
              Contact Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
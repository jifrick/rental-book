import React, { useState } from 'react';
import { Wrench, LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('owner@toolrental.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-500 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-amber-500 text-slate-950 rounded-2xl mx-auto flex items-center justify-center font-black shadow-lg">
            <Wrench className="w-9 h-9 stroke-[2.5]" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase mt-3">
            TOOL RENTAL
          </h1>
          <p className="text-base font-bold text-amber-600 uppercase tracking-wide">
            Simple Rental Record Book
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-black text-slate-800 uppercase tracking-wide mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden font-bold text-slate-900 text-lg"
              placeholder="owner@toolrental.com"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-slate-800 uppercase tracking-wide mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden font-bold text-slate-900 text-lg"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xl rounded-xl shadow-xl hover:shadow-2xl active:scale-98 transition-all border-2 border-amber-400 min-h-[52px] mt-6 uppercase tracking-wider"
          >
            <LogIn className="w-6 h-6 stroke-[3]" />
            <span>LOGIN</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-700 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Protected Local & Cloud Sync Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [identity, setIdentity] = useState('CKTOOLS001');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = login(identity, password);
    if (!res.success) {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleQuickLogin = (userCode: string, pass: string) => {
    setIdentity(userCode);
    setPassword(pass);
    const res = login(userCode, pass);
    if (!res.success) {
      setError(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#232621] text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#fdfcf9] text-[#20221f] rounded-[20px] p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-[#ded9d0] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-[50px] h-[50px] border-2 border-[#e7a37f] bg-[#232621] text-[#f5b28e] rounded-[14px] mx-auto flex items-center justify-center font-['Manrope'] font-extrabold text-xl shadow-md">
            RB
          </div>
          <h1 className="text-2xl font-['Manrope'] font-extrabold tracking-[-0.4px] text-[#20221f] uppercase mt-3 m-0">
            RENTAL BOOK
          </h1>
          <p className="text-xs font-bold text-[#d35d2f] uppercase tracking-wide">
            Multi-Tenant Tool Rental Platform
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-red-600 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-[#20221f] uppercase mb-1">
              User ID / Admin Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                className="w-full h-[48px] px-3 rounded-[11px] border border-[#ded9d0] focus:border-[#d35d2f] outline-none font-medium text-[#20221f] bg-white text-base font-mono uppercase"
                placeholder="e.g. CKTOOLS001 or admin@rentalbook.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#20221f] uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[48px] px-3 rounded-[11px] border border-[#ded9d0] focus:border-[#d35d2f] outline-none font-medium text-[#20221f] bg-white text-base"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center h-[50px] bg-[#d35d2f] hover:bg-[#c25227] text-white font-['Manrope'] font-extrabold text-base rounded-[11px] shadow-[0_7px_20px_#d35d2f2b] transition-all border-0 mt-6 uppercase"
          >
            <span>LOGIN TO WORKSPACE</span>
          </button>
        </form>

        {/* Quick Demo Accounts Helper */}
        <div className="pt-4 border-t border-[#ded9d0] space-y-2">
          <p className="text-[11px] font-extrabold text-[#74766f] uppercase tracking-wider text-center">
            Quick Switch Login Accounts:
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
            <button
              onClick={() => handleQuickLogin('CKTOOLS001', 'password123')}
              className="p-2 bg-[#f4f2eb] hover:bg-[#e9e6dc] border border-[#ded9d0] rounded-lg text-center font-mono text-[11px]"
            >
              CK TOOLS
            </button>
            <button
              onClick={() => handleQuickLogin('ABC001', 'password123')}
              className="p-2 bg-[#f4f2eb] hover:bg-[#e9e6dc] border border-[#ded9d0] rounded-lg text-center font-mono text-[11px]"
            >
              ABC TOOLS
            </button>
            <button
              onClick={() => handleQuickLogin('admin@rentalbook.com', 'admin123')}
              className="p-2 bg-[#232621] text-orange-400 hover:bg-[#2e332a] border border-[#32362e] rounded-lg text-center font-mono text-[11px]"
            >
              ADMIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

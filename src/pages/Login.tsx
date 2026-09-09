import React, { useState } from 'react';
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
    <div className="min-h-screen bg-[#232621] text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#fdfcf9] text-[#20221f] rounded-[20px] p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-[#ded9d0] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-[50px] h-[50px] border-2 border-[#e7a37f] bg-[#232621] text-[#f5b28e] rounded-[14px] mx-auto flex items-center justify-center font-['Manrope'] font-extrabold text-xl shadow-md">
            TR
          </div>
          <h1 className="text-2xl font-['Manrope'] font-extrabold tracking-[-0.4px] text-[#20221f] uppercase mt-3 m-0">
            TOOL RENTAL
          </h1>
          <p className="text-xs font-bold text-[#d35d2f] uppercase tracking-wide">
            Digital Rental Book
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-[#20221f] uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[48px] px-3 rounded-[11px] border border-[#ded9d0] focus:border-[#d35d2f] outline-hidden font-medium text-[#20221f] bg-white text-base"
              placeholder="owner@toolrental.com"
            />
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
              className="w-full h-[48px] px-3 rounded-[11px] border border-[#ded9d0] focus:border-[#d35d2f] outline-hidden font-medium text-[#20221f] bg-white text-base"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center h-[50px] bg-[#d35d2f] hover:bg-[#c25227] text-white font-['Manrope'] font-extrabold text-base rounded-[11px] shadow-[0_7px_20px_#d35d2f2b] transition-all border-0 mt-6 uppercase"
          >
            <span>LOGIN TO RENTAL BOOK</span>
          </button>
        </form>

        <div className="pt-2 border-t border-[#ded9d0] text-center">
          <span className="text-[11px] font-bold text-[#74766f]">
            Wayanaad Tool Rentals · Owner Portal
          </span>
        </div>
      </div>
    </div>
  );
};

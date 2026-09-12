import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ForgotPasswordModal } from '../components/auth/ForgotPasswordModal';
import { AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      setIsSubmitting(false);

      if (!res.success) {
        setError(res.error || 'Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'An error occurred during login.');
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
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-red-600 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-[#20221f] uppercase mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[48px] px-3.5 rounded-[11px] border border-[#ded9d0] focus:border-[#d35d2f] outline-none font-medium text-[#20221f] bg-white text-base"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-extrabold text-[#20221f] uppercase">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-xs font-bold text-[#d35d2f] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[48px] px-3.5 rounded-[11px] border border-[#ded9d0] focus:border-[#d35d2f] outline-none font-medium text-[#20221f] bg-white text-base"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center h-[50px] bg-[#d35d2f] hover:bg-[#c25227] text-white font-['Manrope'] font-extrabold text-base rounded-[11px] shadow-[0_7px_20px_#d35d2f2b] transition-all border-0 mt-6 uppercase disabled:opacity-50"
          >
            <span>{isSubmitting ? 'AUTHENTICATING...' : 'LOGIN'}</span>
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
};

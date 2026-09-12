import React, { useState } from 'react';
import { X, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your account email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword(email);
      setIsSubmitting(false);

      if (res.success) {
        setMessage(res.message || 'Password reset instructions have been sent to your email.');
      } else {
        setError(res.error || 'Failed to send password reset request.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Error processing request');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#191b18] border border-[#32362e] rounded-2xl max-w-md w-full p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#32362e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#d35d2f]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Reset Your Password</h2>
              <p className="text-xs text-[#9da699]">Enter your registered shop email address</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#232621] hover:bg-[#2e332a] text-[#9da699] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {message ? (
          <div className="mt-5 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs font-semibold text-emerald-300">{message}</p>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-[#d35d2f] hover:bg-[#c04d21] text-white text-xs font-semibold rounded-xl transition-colors mt-2"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs text-[#9da699] font-medium uppercase tracking-wider mb-1.5">
                Account Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. cktools@example.com"
                className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-[#232621] hover:bg-[#2e332a] text-white text-xs font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#d35d2f] hover:bg-[#c04d21] text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

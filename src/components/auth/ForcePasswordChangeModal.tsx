import React, { useState } from 'react';
import { Lock, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ForcePasswordChangeModalProps {
  onComplete: () => void;
}

export const ForcePasswordChangeModal: React.FC<ForcePasswordChangeModalProps> = ({ onComplete }) => {
  const { currentShop, changePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      changePassword(newPassword);
      setIsSubmitting(false);
      onComplete();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#191b18] border border-[#32362e] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-5 text-[#d35d2f]">
          <KeyRound className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-white mb-1">Set Your Permanent Password</h2>
        <p className="text-sm text-[#9da699] mb-6">
          Welcome to <span className="font-semibold text-white">{currentShop?.name || 'Rental Book'}</span>! Because this is your first login with a temporary password, please set a secure permanent password to protect your shop workspace.
        </p>

        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9da699] uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9da699]" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 6 characters"
                className="w-full bg-[#232621] border border-[#32362e] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9da699] uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9da699]" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-[#232621] border border-[#32362e] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 bg-[#d35d2f] hover:bg-[#c04d21] text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-sm shadow-lg shadow-[#d35d2f]/20"
          >
            {isSubmitting ? (
              <span>Updating Password...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Save & Continue to Dashboard</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Smartphone, KeyRound, User as UserIcon, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithOtp } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobile, setMobile] = useState('9876543210');
  const [name, setName] = useState('Arjun Sharma');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginWithOtp(mobile, otp, name);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Failed to verify OTP');
    }
  };

  const handleUseDemoAccount = async () => {
    setMobile('9876543210');
    setName('Arjun Sharma');
    setOtp('123456');
    setLoading(true);
    await loginWithOtp('9876543210', '123456', 'Arjun Sharma');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#12131C] border border-amber-500/20 rounded-2xl p-6 md:p-8 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="font-serif text-2xl font-bold tracking-widest text-amber-300">
            POUR
          </span>
          <h3 className="text-lg font-medium text-neutral-200 mt-2">
            {step === 'phone' ? 'Sign In or Register' : 'Verify One-Time Password'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {step === 'phone'
              ? 'Enter your mobile number to browse and checkout'
              : `We sent a simulated 6-digit code to +91 ${mobile}`}
          </p>
        </div>

        {/* Demo Helper Banner */}
        <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center justify-between">
          <div>
            <span className="font-semibold text-amber-400">Demo Prototype:</span>
            <span className="ml-1 text-amber-200/90">OTP is </span>
            <span className="font-mono font-bold text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded">
              123456
            </span>
          </div>
          <button
            type="button"
            onClick={handleUseDemoAccount}
            className="text-[11px] underline font-medium text-amber-300 hover:text-amber-100"
          >
            Quick Demo Login
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Full Name (Optional)
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arjun Sharma"
                  className="w-full bg-[#1A1C28] border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Mobile Number
              </label>
              <div className="relative flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-neutral-700 bg-neutral-800 text-neutral-400 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full bg-[#1A1C28] border border-neutral-700 rounded-r-xl px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl font-medium tracking-wide bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <span>Continue with OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-neutral-300">
                  Enter 6-Digit OTP
                </label>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Change number
                </button>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  autoFocus
                  className="w-full bg-[#1A1C28] border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-lg tracking-widest text-center text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOtp('123456')}
              className="text-xs text-amber-300 hover:text-amber-200 underline block text-center"
            >
              Fill demo code: 123456
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-medium tracking-wide bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Proceed</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

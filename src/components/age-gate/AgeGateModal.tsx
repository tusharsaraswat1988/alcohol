import React, { useState } from 'react';
import { ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAgeGate } from '../../context/AgeGateContext';

const INDIAN_STATES = [
  { name: 'Karnataka', minAge: 21 },
  { name: 'Maharashtra', minAge: 25 },
  { name: 'Delhi NCR', minAge: 21 },
  { name: 'Goa', minAge: 21 },
  { name: 'Haryana', minAge: 21 },
  { name: 'West Bengal', minAge: 21 },
  { name: 'Telangana', minAge: 21 },
  { name: 'Tamil Nadu', minAge: 21 },
  { name: 'Kerala', minAge: 23 },
  { name: 'Punjab', minAge: 21 },
];

export const AgeGateModal: React.FC = () => {
  const { isVerified, verifyAge } = useAgeGate();
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  if (isVerified) return null;

  const currentStateObj = INDIAN_STATES.find((s) => s.name === selectedState) || INDIAN_STATES[0];

  const handleConfirm = () => {
    verifyAge(selectedState);
  };

  const handleDecline = () => {
    setErrorMsg('Access restricted. You must be of legal drinking age in your state to view this catalog.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#181924] to-[#0E0F15] border border-amber-500/30 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(212,175,55,0.18)] text-white text-center">
        {/* Glow orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/10 blur-2xl rounded-full pointer-events-none" />

        {/* Brand Monogram */}
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600/20 via-amber-400/30 to-amber-200/10 border border-amber-400/40 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
          <Sparkles className="w-8 h-8 text-amber-400" />
        </div>

        <h2 className="text-3xl font-serif font-bold tracking-wider text-amber-100">
          P O U R
        </h2>
        <p className="text-xs font-mono uppercase tracking-widest text-amber-400/80 mt-1 mb-6">
          Multi-Brand Spirits Reserve
        </p>

        <div className="bg-[#12131D]/80 border border-neutral-800 rounded-xl p-4 mb-5 text-left">
          <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
            Select Your State / Region:
          </label>
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setErrorMsg('');
            }}
            className="w-full bg-[#1A1C28] text-white border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
          >
            {INDIAN_STATES.map((state) => (
              <option key={state.name} value={state.name}>
                {state.name} (Legal Age: {state.minAge}+)
              </option>
            ))}
          </select>

          <div className="mt-3 flex items-center gap-2 text-xs text-amber-300/90 bg-amber-950/30 border border-amber-500/20 rounded p-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Legal drinking age in <strong>{currentStateObj.name}</strong> is <strong>{currentStateObj.minAge} years</strong>.
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 mb-4 text-xs text-red-300 bg-red-950/40 border border-red-800/40 rounded-lg text-left">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mb-6 text-xs text-neutral-400">
          <input
            type="checkbox"
            id="remember-age"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-neutral-700 text-amber-500 focus:ring-amber-500 bg-neutral-900"
          />
          <label htmlFor="remember-age" className="cursor-pointer">
            Remember my confirmation on this device
          </label>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleConfirm}
            className="w-full py-3 px-4 rounded-xl font-medium tracking-wide bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-neutral-950 hover:brightness-110 active:scale-[0.99] transition shadow-[0_4px_20px_rgba(212,175,55,0.3)] font-sans"
          >
            I am {currentStateObj.minAge}+ Years of Age — Enter Store
          </button>
          <button
            onClick={handleDecline}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-normal text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition"
          >
            I am Under {currentStateObj.minAge} (Exit)
          </button>
        </div>

        <p className="mt-6 text-[10px] text-neutral-500 leading-relaxed">
          * UI/UX Demonstration Prototype. No actual alcohol sales or delivery transactions occur. Must be legally permitted in your jurisdiction to view. Drink Responsibly.
        </p>
      </div>
    </div>
  );
};

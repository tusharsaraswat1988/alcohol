import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  CreditCard, 
  Building2, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Lock,
  ArrowRight
} from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotal: number;
  onSuccess: (paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD', txnId: string) => void;
  onFailure?: (errorReason: string) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  orderTotal,
  onSuccess,
  onFailure,
}) => {
  const [selectedTab, setSelectedTab] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulatedFailure, setSimulatedFailure] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateSuccess = () => {
    setSimulatedFailure(null);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const txnId = `TXN-POUR-${Math.floor(100000 + Math.random() * 900000)}`;
      const methodMap = {
        upi: 'UPI' as const,
        card: 'Card' as const,
        netbanking: 'NetBanking' as const,
        cod: 'COD' as const,
      };
      onSuccess(methodMap[selectedTab], txnId);
    }, 1400);
  };

  const handleSimulateFailure = () => {
    setIsProcessing(true);
    setSimulatedFailure(null);

    setTimeout(() => {
      setIsProcessing(false);
      const errors = [
        'Bank Server Timeout: Issuing bank declined transaction response.',
        'Insufficient balance or daily limit exceeded.',
        'UPI PIN verification failed on simulated device.',
      ];
      const randomErr = errors[Math.floor(Math.random() * errors.length)];
      setSimulatedFailure(randomErr);
      if (onFailure) onFailure(randomErr);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-300 text-neutral-900">
        {/* Gateway Brand Header (Razorpay style) */}
        <div className="bg-[#0C1B33] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-neutral-950 font-bold font-serif flex items-center justify-center text-lg">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide">POUR Checkout Gateway</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/40">
                  SANDBOX
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Order Ref: ORD-{Date.now().toString().slice(-6)}</p>
            </div>
          </div>

          <div className="text-right flex items-center gap-4">
            <div>
              <span className="text-[10px] text-neutral-400 block">Total Amount</span>
              <span className="font-mono font-bold text-base text-amber-300">
                ₹{orderTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-1 text-neutral-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prototype Testing Notice */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Interactive Simulator: Test Success & Failure paths without real charges</span>
          </div>
        </div>

        {/* Body Layout: Left tabs + Right content */}
        <div className="flex flex-col md:flex-row min-h-[300px]">
          {/* Methods Sidebar */}
          <div className="w-full md:w-48 bg-neutral-50 border-r border-neutral-200 p-2 space-y-1">
            <button
              onClick={() => {
                setSelectedTab('upi');
                setSimulatedFailure(null);
              }}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-left transition ${
                selectedTab === 'upi'
                  ? 'bg-white text-blue-700 shadow-sm border border-neutral-200 font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>UPI & QR</span>
            </button>

            <button
              onClick={() => {
                setSelectedTab('card');
                setSimulatedFailure(null);
              }}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-left transition ${
                selectedTab === 'card'
                  ? 'bg-white text-blue-700 shadow-sm border border-neutral-200 font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Cards</span>
            </button>

            <button
              onClick={() => {
                setSelectedTab('netbanking');
                setSimulatedFailure(null);
              }}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-left transition ${
                selectedTab === 'netbanking'
                  ? 'bg-white text-blue-700 shadow-sm border border-neutral-200 font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>Net Banking</span>
            </button>

            <button
              onClick={() => {
                setSelectedTab('cod');
                setSimulatedFailure(null);
              }}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-left transition ${
                selectedTab === 'cod'
                  ? 'bg-white text-blue-700 shadow-sm border border-neutral-200 font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Banknote className="w-4 h-4 text-amber-600" />
              <span>Cash on Delivery</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            {/* Failure Alert if active */}
            {simulatedFailure && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Simulated Payment Failure:</div>
                  <p className="mt-0.5 text-neutral-700">{simulatedFailure}</p>
                  <p className="text-[11px] text-red-600 mt-1">
                    Try clicking "⚡ Simulate Success" below to test the approved order flow.
                  </p>
                </div>
              </div>
            )}

            {/* Processing State */}
            {isProcessing ? (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                <h4 className="font-semibold text-sm text-neutral-800">
                  Simulating Bank Gateway Processing...
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Contacting dummy payment network. Please do not refresh.
                </p>
              </div>
            ) : (
              <>
                {/* UPI Content */}
                {selectedTab === 'upi' && (
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-neutral-800">
                      Scan QR code with any UPI App
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                      {/* Mock QR SVG */}
                      <div className="w-24 h-24 bg-white p-2 border border-neutral-300 rounded-lg flex items-center justify-center shrink-0">
                        <QrCode className="w-20 h-20 text-neutral-800" />
                      </div>
                      <div className="text-xs space-y-1">
                        <span className="font-semibold text-neutral-900 block">
                          Instant Scan & Pay
                        </span>
                        <p className="text-neutral-500 text-[11px]">
                          Supported: GPay, PhonePe, Paytm, BHIM, Cred
                        </p>
                        <div className="text-emerald-700 font-mono text-[11px] font-medium pt-1">
                          UPI ID: pourvault@mockbank
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Content */}
                {selectedTab === 'card' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-neutral-800">
                      Mock Credit / Debit Card
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        readOnly
                        value="4532 •••• •••• 8829 (Visa Demo Card)"
                        className="w-full text-xs font-mono bg-neutral-100 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-800"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value="12/28"
                          className="w-1/2 text-xs font-mono bg-neutral-100 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-800"
                        />
                        <input
                          type="text"
                          readOnly
                          value="•••"
                          className="w-1/2 text-xs font-mono bg-neutral-100 border border-neutral-300 rounded-lg px-3 py-2 text-neutral-800"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Card credentials simulated automatically for prototype testing.
                    </p>
                  </div>
                )}

                {/* Net Banking */}
                {selectedTab === 'netbanking' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-neutral-800">
                      Select Popular Bank
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank, i) => (
                        <div
                          key={bank}
                          className={`p-2.5 rounded-lg border text-center font-medium cursor-pointer ${
                            i === 0
                              ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                              : 'border-neutral-200 hover:bg-neutral-50'
                          }`}
                        >
                          {bank}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cash on Delivery */}
                {selectedTab === 'cod' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-neutral-800">
                      Cash on Delivery (Permitted Jurisdictions)
                    </div>
                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-600 leading-relaxed">
                      Physical ID verification required upon doorstep delivery. Delivery partner carries portable QR code and cash pouch.
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Test Simulation Buttons: Success vs Failure */}
            <div className="pt-4 border-t border-neutral-200 mt-4 space-y-2">
              <div className="text-[11px] text-neutral-500 font-medium text-center">
                Prototype Decision Controls:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSimulateSuccess}
                  disabled={isProcessing}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulate Success</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateFailure}
                  disabled={isProcessing}
                  className="py-2.5 px-3 rounded-xl text-xs font-medium bg-neutral-100 hover:bg-red-50 text-red-700 border border-neutral-300 hover:border-red-300 transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Simulate Failure</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-neutral-100 border-t border-neutral-200 p-3 text-[10px] text-neutral-500 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Mock Encryption • PCI-DSS Compliant Simulation</span>
          </div>
          <span>POUR v1.0 Prototype</span>
        </div>
      </div>
    </div>
  );
};

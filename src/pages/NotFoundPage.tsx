import React from 'react';
import { Link } from 'react-router-dom';
import { Wine, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-[#0C0D12] text-white flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <Wine className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-4xl font-extrabold text-amber-100">
          Vintage Not Found
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed">
          The cellar page you are looking for does not exist or has been archived.
        </p>
        <div className="pt-2">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-500 text-neutral-950 hover:bg-amber-400 transition"
          >
            <span>Return to Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

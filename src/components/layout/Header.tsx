import React from 'react';
import { PlusCircle, Wrench } from 'lucide-react';
import { getSettings } from '../../lib/storageService';

interface HeaderProps {
  onOpenNewRental: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewRental }) => {
  const settings = getSettings();

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b-4 border-amber-500 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between gap-3">
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
            <Wrench className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white uppercase">
              {settings.shop_name}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-amber-400 mt-0.5">
              Digital Rental Record Book
            </p>
          </div>
        </div>

        {/* Primary Action Button (+ NEW RENTAL) */}
        <button
          onClick={onOpenNewRental}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all min-h-[48px] shrink-0 border-2 border-amber-300"
        >
          <PlusCircle className="w-6 h-6 stroke-[2.5]" />
          <span>+ NEW RENTAL</span>
        </button>
      </div>
    </header>
  );
};

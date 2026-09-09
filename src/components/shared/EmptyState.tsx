import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-4 text-center bg-white rounded-2xl border-2 border-dashed border-slate-300 shadow-xs">
      <div className="p-4 mb-3 text-slate-500 bg-slate-100 rounded-full">
        {icon || <PackageOpen className="w-10 h-10 stroke-[1.5]" />}
      </div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      {description && <p className="mt-1 text-base text-slate-600 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          type="button"
          className="mt-5 inline-flex items-center justify-center px-6 py-3 text-lg font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 active:scale-95 transition-all shadow-md min-h-[48px]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

import React from 'react';
import type { ToolStatus, ToolCondition, RentalStatus } from '../../types/database';

type StatusType = ToolStatus | ToolCondition | RentalStatus | 'OVERDUE';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  let colorStyle = 'bg-slate-100 text-slate-800 border-slate-300';
  let label = String(status);

  switch (status) {
    case 'AVAILABLE':
    case 'RETURNED':
    case 'GOOD':
      colorStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      label = status === 'GOOD' ? 'GOOD CONDITION' : status;
      break;

    case 'RENTED':
    case 'ACTIVE':
      colorStyle = 'bg-amber-100 text-amber-900 border-amber-400 font-bold';
      label = status === 'ACTIVE' ? 'CURRENTLY OUT' : 'RENTED OUT';
      break;

    case 'OVERDUE':
    case 'DAMAGED':
      colorStyle = 'bg-red-100 text-red-900 border-red-400 font-bold';
      label = status;
      break;

    case 'MAINTENANCE':
    case 'NEEDS_MAINTENANCE':
    case 'MINOR_DAMAGE':
      colorStyle = 'bg-blue-100 text-blue-900 border-blue-400 font-bold';
      label = status === 'NEEDS_MAINTENANCE' ? 'NEEDS SERVICE' : status.replace('_', ' ');
      break;

    case 'CANCELLED':
      colorStyle = 'bg-gray-200 text-gray-700 border-gray-400 font-medium';
      label = 'CANCELLED';
      break;
  }

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs tracking-wider rounded-md border',
    md: 'px-3.5 py-1.5 text-sm tracking-wider rounded-lg border-2',
    lg: 'px-4 py-2 text-base tracking-wider rounded-xl border-2 font-bold',
  };

  return (
    <span className={`inline-flex items-center justify-center font-bold text-center uppercase tracking-wide shadow-xs ${sizeClasses[size]} ${colorStyle} ${className}`}>
      {label}
    </span>
  );
};

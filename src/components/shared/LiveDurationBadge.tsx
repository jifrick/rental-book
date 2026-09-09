import React from 'react';
import { calculateDuration } from '../../lib/dateUtils';
import { useLiveTimer } from '../../hooks/useLiveTimer';
import { Clock } from 'lucide-react';

interface LiveDurationBadgeProps {
  startedAt: string;
  returnedAt?: string | null;
  className?: string;
}

export const LiveDurationBadge: React.FC<LiveDurationBadgeProps> = ({
  startedAt,
  returnedAt,
  className = '',
}) => {
  const currentTime = useLiveTimer(15000); // Ticks every 15s

  const duration = calculateDuration(startedAt, returnedAt || currentTime);

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-amber-400 font-mono font-bold text-base shadow-xs ${className}`}>
      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
      <span>{duration.formatted}</span>
    </div>
  );
};

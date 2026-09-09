import React from 'react';
import { Package, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Rental, Tool } from '../../types/database';
import { getOverdueInfo, formatDateOnly } from '../../lib/dateUtils';

interface SummaryCardsProps {
  rentals: Rental[];
  tools: Tool[];
  onFilterClick?: (filter: 'active' | 'overdue' | 'available' | 'all') => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ rentals, tools, onFilterClick }) => {
  const activeRentals = rentals.filter((r) => r.status === 'ACTIVE');
  
  const todayStr = formatDateOnly(new Date());
  const dueTodayCount = activeRentals.filter((r) => {
    if (!r.expected_return_at) return false;
    return formatDateOnly(r.expected_return_at) === todayStr;
  }).length;

  const overdueCount = activeRentals.filter((r) => getOverdueInfo(r.expected_return_at, r.status).isOverdue).length;

  const availableToolsCount = tools.filter((t) => t.status === 'AVAILABLE').length;

  const cards = [
    {
      title: 'ACTIVE RENTALS',
      value: activeRentals.length,
      subtitle: 'Tools currently outside',
      icon: Package,
      badgeColor: 'bg-amber-500 text-slate-950',
      borderColor: 'border-amber-400',
      filter: 'active' as const,
    },
    {
      title: 'DUE TODAY',
      value: dueTodayCount,
      subtitle: 'Expected returns today',
      icon: Clock,
      badgeColor: 'bg-blue-500 text-white',
      borderColor: 'border-blue-400',
      filter: 'all' as const,
    },
    {
      title: 'OVERDUE',
      value: overdueCount,
      subtitle: 'Past return time',
      icon: AlertTriangle,
      badgeColor: overdueCount > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-400 text-white',
      borderColor: overdueCount > 0 ? 'border-red-500' : 'border-slate-300',
      filter: 'overdue' as const,
    },
    {
      title: 'AVAILABLE TOOLS',
      value: availableToolsCount,
      subtitle: 'Ready to rent inside shop',
      icon: CheckCircle,
      badgeColor: 'bg-emerald-600 text-white',
      borderColor: 'border-emerald-400',
      filter: 'available' as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <button
            key={idx}
            onClick={() => onFilterClick && onFilterClick(card.filter)}
            type="button"
            className={`flex flex-col justify-between p-4 bg-white rounded-2xl border-2 ${card.borderColor} shadow-sm hover:shadow-md transition-all text-left group`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.badgeColor} shadow-xs shrink-0`}>
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {card.value}
              </div>
              <p className="text-xs font-bold text-slate-500 mt-0.5 truncate">
                {card.subtitle}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

import React from 'react';
import { X, Phone, History } from 'lucide-react';
import type { Tool, Rental } from '../../types/database';
import { getRentals, updateToolStatus } from '../../lib/storageService';
import { formatDateTime } from '../../lib/dateUtils';
import { StatusBadge } from '../shared/StatusBadge';
import { LiveDurationBadge } from '../shared/LiveDurationBadge';

interface ToolDetailsModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
  onReturnTool: (rental: Rental) => void;
}

export const ToolDetailsModal: React.FC<ToolDetailsModalProps> = ({
  tool,
  isOpen,
  onClose,
  onReturnTool,
}) => {
  if (!isOpen || !tool) return null;

  const rentals = getRentals();
  const toolRentals = rentals.filter((r) => r.tool_id === tool.id || r.tool_code === tool.tool_code);
  const activeRental = toolRentals.find((r) => r.status === 'ACTIVE');

  const handleToggleMaintenance = () => {
    if (tool.status === 'RENTED') {
      alert('Cannot mark a currently rented tool under maintenance while it is outside with a customer.');
      return;
    }

    const nextStatus = tool.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
    updateToolStatus(tool.id, nextStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-mono font-black flex items-center justify-center text-lg">
              {tool.tool_code}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{tool.name}</h2>
              <p className="text-xs text-amber-400 font-bold">Machine ID: {tool.tool_code}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-900">
          {/* Status Bar */}
          <div className="flex items-center justify-between p-3.5 bg-slate-100 rounded-2xl border border-slate-300">
            <div>
              <span className="text-xs font-black uppercase text-slate-500 block">CURRENT STATUS</span>
              <StatusBadge status={tool.status} size="sm" />
            </div>

            <div>
              <span className="text-xs font-black uppercase text-slate-500 block">CONDITION</span>
              <StatusBadge status={tool.condition} size="sm" />
            </div>
          </div>

          {/* If Rented: Show Current Customer info */}
          {activeRental ? (
            <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-400 space-y-3">
              <div className="flex items-center justify-between text-amber-900 font-black">
                <span className="uppercase text-xs tracking-wider">CURRENTLY TAKEN BY</span>
                <LiveDurationBadge startedAt={activeRental.started_at} />
              </div>

              <div className="text-sm font-bold space-y-1 text-slate-900">
                <div className="text-xl font-black">{activeRental.customer_name}</div>
                <div>📞 {activeRental.customer_phone}</div>
                <div>Taken: {formatDateTime(activeRental.started_at)}</div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onReturnTool(activeRental);
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-base shadow-md uppercase"
                >
                  RETURN TOOL NOW
                </button>
                <a
                  href={`tel:${activeRental.customer_phone}`}
                  className="p-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center min-w-[48px]"
                >
                  <Phone className="w-5 h-5 text-emerald-400" />
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-center font-bold text-emerald-900">
              ✓ Tool is currently inside the shop and available for new rental.
            </div>
          )}

          {/* Maintenance Action */}
          {tool.status !== 'RENTED' && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleToggleMaintenance}
                className={`w-full py-3 px-4 font-bold rounded-xl text-sm border-2 transition-all uppercase ${
                  tool.status === 'MAINTENANCE'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400 hover:bg-emerald-200'
                    : 'bg-blue-100 text-blue-900 border-blue-400 hover:bg-blue-200'
                }`}
              >
                {tool.status === 'MAINTENANCE' ? 'Mark Available (End Maintenance)' : 'Mark Maintenance'}
              </button>
            </div>
          )}

          {/* Tool Rental History */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h3 className="text-base font-black text-slate-900 uppercase flex items-center gap-2">
              <History className="w-5 h-5 text-amber-600" />
              <span>Machine History Log ({toolRentals.length})</span>
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {toolRentals.length === 0 ? (
                <div className="text-center py-4 text-slate-500 font-bold text-sm">
                  No rental history recorded for this specific machine yet.
                </div>
              ) : (
                toolRentals.map((r) => (
                  <div key={r.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-sm font-bold">
                    <div>
                      <div className="text-slate-900">{r.customer_name}</div>
                      <div className="text-xs text-slate-500">{formatDateTime(r.started_at)}</div>
                    </div>
                    <StatusBadge status={r.status} size="sm" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Wrench, PlusCircle } from 'lucide-react';
import type { Tool, Category, Rental } from '../types/database';
import { getTools, getCategories, subscribeToStore } from '../lib/storageService';
import { AddToolModal } from '../components/tools/AddToolModal';
import { ToolDetailsModal } from '../components/tools/ToolDetailsModal';
import { EmptyState } from '../components/shared/EmptyState';

interface ToolsPageProps {
  onReturnTool: (rental: Rental) => void;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ onReturnTool }) => {
  const [tools, setTools] = useState<Tool[]>(() => getTools());
  const [categories] = useState<Category[]>(() => getCategories());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  useEffect(() => {
    return subscribeToStore(() => setTools(getTools()));
  }, []);

  // Grouped Tools by Tool Name
  const groupedTools = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        category_id?: string;
        category_name?: string;
        items: Tool[];
        availableCount: number;
        rentedCount: number;
        maintenanceCount: number;
      }
    >();

    tools.forEach((t) => {
      const existing = map.get(t.name);
      if (existing) {
        existing.items.push(t);
        if (t.status === 'AVAILABLE') existing.availableCount += 1;
        if (t.status === 'RENTED') existing.rentedCount += 1;
        if (t.status === 'MAINTENANCE') existing.maintenanceCount += 1;
      } else {
        map.set(t.name, {
          name: t.name,
          category_id: t.category_id,
          category_name: t.category_name,
          items: [t],
          availableCount: t.status === 'AVAILABLE' ? 1 : 0,
          rentedCount: t.status === 'RENTED' ? 1 : 0,
          maintenanceCount: t.status === 'MAINTENANCE' ? 1 : 0,
        });
      }
    });

    return Array.from(map.values());
  }, [tools]);

  // Filtered Grouped Tools
  const filteredGroupedTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return groupedTools.filter((group) => {
      const matchSearch =
        group.name.toLowerCase().includes(q) ||
        group.items.some((i) => i.tool_code.toLowerCase().includes(q));

      const matchCategory = selectedCategory === 'ALL' || group.category_id === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [groupedTools, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-amber-600 font-black text-sm uppercase tracking-wider">
            <Wrench className="w-5 h-5 stroke-[2.5]" />
            <span>Shop Equipment Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Tools Inventory ({tools.length} Machines)
          </h2>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base rounded-xl shadow-md min-h-[48px] uppercase tracking-wide shrink-0 border-2 border-amber-300"
        >
          <PlusCircle className="w-5 h-5 stroke-[2.5]" />
          <span>+ ADD NEW TOOL</span>
        </button>
      </div>

      {/* Search & Category Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tool by name or machine code (e.g. DR-04)..."
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-900 focus:border-amber-500 outline-hidden shadow-xs text-base"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase shrink-0 min-h-[40px] ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-amber-400 shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase shrink-0 min-h-[40px] ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-amber-400 shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Tool Catalog Cards */}
      {filteredGroupedTools.length === 0 ? (
        <EmptyState
          title="No tools found"
          description={searchQuery ? `No match found for "${searchQuery}"` : 'Add physical tools to your shop catalog to start renting.'}
          actionLabel="+ ADD NEW TOOL"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGroupedTools.map((group) => (
            <div
              key={group.name}
              className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 shadow-xs space-y-4"
            >
              {/* Tool Header (NO PRICES DISPLAYED AS REQUIRED) */}
              <div className="flex items-start justify-between gap-3 border-b pb-3">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase">{group.name}</h3>
                  <span className="text-xs font-bold text-slate-500">
                    {group.category_name || 'General Tools'}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900">
                    {group.items.length} <span className="text-xs text-slate-500 font-bold uppercase">Total</span>
                  </div>
                </div>
              </div>

              {/* Counters */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center font-bold text-xs">
                <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                  <span className="text-emerald-800 block uppercase font-black">Available</span>
                  <span className="text-xl font-black text-emerald-700">{group.availableCount}</span>
                </div>
                <div className="bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                  <span className="text-amber-800 block uppercase font-black">Rented Out</span>
                  <span className="text-xl font-black text-amber-700">{group.rentedCount}</span>
                </div>
                <div className="bg-blue-50 p-1.5 rounded-lg border border-blue-200">
                  <span className="text-blue-800 block uppercase font-black">Service</span>
                  <span className="text-xl font-black text-blue-700">{group.maintenanceCount}</span>
                </div>
              </div>

              {/* Physical Machine Code Pills */}
              <div>
                <div className="text-xs font-black uppercase text-slate-500 mb-2">
                  Physical Machines ({group.items.length}):
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const isAvailable = item.status === 'AVAILABLE';
                    const isRented = item.status === 'RENTED';
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedTool(item)}
                        type="button"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-black text-sm border-2 transition-all min-h-[40px] shadow-xs ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                            : isRented
                            ? 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200'
                            : 'bg-blue-100 text-blue-950 border-blue-400 hover:bg-blue-200'
                        }`}
                      >
                        <span>{item.tool_code}</span>
                        <span className="text-[10px] font-sans uppercase font-bold px-1 rounded bg-white/70">
                          {item.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tool Details Modal */}
      <ToolDetailsModal
        tool={selectedTool}
        isOpen={Boolean(selectedTool)}
        onClose={() => setSelectedTool(null)}
        onReturnTool={onReturnTool}
      />

      {/* Add Tool Modal */}
      <AddToolModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => setTools(getTools())}
      />
    </div>
  );
};

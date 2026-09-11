import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import type { Tool, Category, Rental } from '../types/database';
import { getTools, getCategories, subscribeToStore } from '../lib/storageService';
import { useAuth } from '../context/AuthContext';
import { AddToolModal } from '../components/tools/AddToolModal';
import { ToolDetailsModal } from '../components/tools/ToolDetailsModal';
import { EmptyState } from '../components/shared/EmptyState';

interface ToolsPageProps {
  onReturnTool: (rental: Rental) => void;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ onReturnTool }) => {
  const { currentShopId } = useAuth();
  const [tools, setTools] = useState<Tool[]>(() => getTools(currentShopId));
  const [categories] = useState<Category[]>(() => getCategories());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setTools(getTools(currentShopId));
    return subscribeToStore(() => setTools(getTools(currentShopId)));
  }, [currentShopId]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ded9d0] pb-4">
        <div>
          <h1 className="font-['Manrope'] text-[24px] sm:text-[29px] font-extrabold text-[#20221f] m-0">
            Tools Inventory
          </h1>
          <p className="text-[#74766f] text-[13px] mt-1 font-medium">
            {tools.length} machines tracked in catalog.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          type="button"
          className="inline-flex items-center justify-center gap-2 h-[44px] bg-[#d35d2f] hover:bg-[#c25227] text-white font-extrabold text-xs rounded-[11px] px-[16px] uppercase shadow-xs border-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>＋ Add New Tool</span>
        </button>
      </div>

      {/* Search & Categories */}
      <div className="space-y-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tool by name or machine code (e.g. DR-04)..."
          className="w-full h-[46px] bg-white border border-[#ded9d0] rounded-[11px] px-[13px] font-medium text-sm outline-hidden shadow-xs"
        />

        <div className="flex items-center gap-[7px] overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`whitespace-nowrap border rounded-[20px] px-[12px] py-[7px] text-[10px] font-extrabold ${
              selectedCategory === 'ALL' ? 'bg-[#232621] text-white border-[#232621]' : 'bg-white text-[#20221f] border-[#ded9d0]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap border rounded-[20px] px-[12px] py-[7px] text-[10px] font-extrabold ${
                selectedCategory === cat.id ? 'bg-[#232621] text-white border-[#232621]' : 'bg-white text-[#20221f] border-[#ded9d0]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Catalog Grid */}
      {filteredGroupedTools.length === 0 ? (
        <EmptyState
          title="No tools found"
          description={searchQuery ? `No match found for "${searchQuery}"` : 'Add physical tools to your shop catalog.'}
          actionLabel="＋ Add New Tool"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGroupedTools.map((group) => (
            <div
              key={group.name}
              className="bg-[#fdfcf9] border border-[#ded9d0] rounded-[18px] p-[18px] shadow-[0_14px_40px_rgba(43,37,28,0.09)] space-y-4"
            >
              {/* Tool Name (NO PRICES SHOWN) */}
              <div className="flex justify-between items-start border-b border-[#efede8] pb-3">
                <div>
                  <h3 className="font-['Manrope'] text-[18px] font-extrabold text-[#20221f] m-0">
                    {group.name}
                  </h3>
                  <small className="text-[#74766f] text-[11px] font-bold block mt-0.5">
                    {group.category_name || 'General Equipment'}
                  </small>
                </div>

                <div className="text-right">
                  <b className="font-['Manrope'] text-[22px] font-extrabold text-[#20221f]">
                    {group.items.length}
                  </b>
                  <small className="block text-[#74766f] text-[10px] font-bold">total machines</small>
                </div>
              </div>

              {/* Status Counters */}
              <div className="grid grid-cols-3 gap-2 bg-[#f6f3ed] p-2.5 rounded-[12px] border border-[#ded9d0] text-center font-bold text-xs">
                <div>
                  <span className="text-[#74766f] text-[9px] uppercase block font-extrabold">Available</span>
                  <span className="text-base font-extrabold text-[#2f8a61]">{group.availableCount}</span>
                </div>
                <div>
                  <span className="text-[#74766f] text-[9px] uppercase block font-extrabold">Rented</span>
                  <span className="text-base font-extrabold text-[#d35d2f]">{group.rentedCount}</span>
                </div>
                <div>
                  <span className="text-[#74766f] text-[9px] uppercase block font-extrabold">Service</span>
                  <span className="text-base font-extrabold text-[#5575ad]">{group.maintenanceCount}</span>
                </div>
              </div>

              {/* Machine Code Pills */}
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#74766f] block mb-2">
                  Physical Machines:
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const isAvailable = item.status === 'AVAILABLE';
                    const isRented = item.status === 'RENTED';
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedTool(item)}
                        type="button"
                        className={`border rounded-[10px] px-3 py-1.5 font-mono font-extrabold text-xs transition-all flex items-center gap-1.5 ${
                          isAvailable
                            ? 'bg-[#eaf6f0] border-[#2f8a61] text-[#176d49]'
                            : isRented
                            ? 'bg-[#fff0e8] border-[#d35d2f] text-[#b84e27]'
                            : 'bg-[#edf2fa] border-[#5575ad] text-[#2c4c84]'
                        }`}
                      >
                        <span>{item.tool_code}</span>
                        <span className="text-[9px] font-sans uppercase font-bold opacity-75">
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

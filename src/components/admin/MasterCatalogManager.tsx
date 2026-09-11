import React, { useState } from 'react';
import { Wrench, Plus, Search, Layers } from 'lucide-react';
import { getMasterTools, addMasterTool, toggleMasterToolStatus, getCategories } from '../../lib/storageService';
import type { MasterTool } from '../../types/database';

export const MasterCatalogManager: React.FC = () => {
  const [masterTools, setMasterTools] = useState<MasterTool[]>(() => getMasterTools());
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [categoryName, setCategoryName] = useState('Drilling & Chipping');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const categories = getCategories();

  const refreshTools = () => {
    setMasterTools(getMasterTools());
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Tool name is required.');
      return;
    }

    try {
      addMasterTool({
        name,
        category_name: categoryName,
        description,
      });
      refreshTools();
      setShowAddModal(false);
      setName('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to add master tool.');
    }
  };

  const handleToggleStatus = (tool: MasterTool) => {
    toggleMasterToolStatus(tool.id, !tool.is_active);
    refreshTools();
  };

  const filteredTools = masterTools.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Master Tool Catalog</h1>
          <p className="text-sm text-[#9da699]">
            Central catalog of standard tool types available across the Rental Book platform ({masterTools.length} tools)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-[#d35d2f] hover:bg-[#c04d21] text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-[#d35d2f]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Master Tool</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#9da699]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search master tool catalog by name or category..."
          className="w-full bg-[#232621] border border-[#32362e] rounded-xl pl-12 pr-4 py-3 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm"
        />
      </div>

      {/* Master Tool Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map(t => (
          <div
            key={t.id}
            className="p-4 bg-[#232621] border border-[#32362e] rounded-2xl flex flex-col justify-between hover:border-[#42483d] transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#d35d2f] shrink-0">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{t.name}</h3>
                    <span className="text-xs text-[#9da699] flex items-center gap-1 mt-0.5">
                      <Layers className="w-3 h-3 text-[#d35d2f]" />
                      {t.category_name}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  t.is_active
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {t.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {t.description && (
                <p className="text-xs text-[#9da699] mt-2 line-clamp-2">{t.description}</p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#32362e] flex items-center justify-between">
              <span className="text-[11px] text-[#9da699]">Platform Catalog</span>
              <button
                onClick={() => handleToggleStatus(t)}
                className="text-xs font-semibold text-[#9da699] hover:text-white transition-colors"
              >
                {t.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Master Tool Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#191b18] border border-[#32362e] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1">Add New Master Tool</h2>
            <p className="text-xs text-[#9da699] mb-4">
              Add a new tool type to the global platform catalog. Shops will be able to select and add physical units of this tool.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#9da699] uppercase tracking-wider mb-1">
                  Tool Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laser Level"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9da699] uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={categoryName}
                  onChange={e => setCategoryName(e.target.value)}
                  className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#d35d2f] text-sm"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="General Equipment">General Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9da699] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief equipment description..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#32362e]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#232621] hover:bg-[#2e332a] text-white text-xs font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d35d2f] hover:bg-[#c04d21] text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Add Master Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

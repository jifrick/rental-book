import React, { useState } from 'react';
import { X, PlusCircle, ShieldAlert } from 'lucide-react';
import { addTool, getCategories } from '../../lib/storageService';
import { useAuth } from '../../context/AuthContext';
import type { ToolCondition, ToolStatus } from '../../types/database';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddToolModal: React.FC<AddToolModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentShopId } = useAuth();
  const categories = getCategories();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [toolCode, setToolCode] = useState('');
  const [description] = useState('');
  const [condition, setCondition] = useState<ToolCondition>('GOOD');
  const [status, setStatus] = useState<ToolStatus>('AVAILABLE');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !toolCode.trim()) {
      setError('Please provide Tool Name and Code ID (e.g. DR-05).');
      return;
    }

    try {
      const selectedCat = categories.find((c) => c.id === categoryId);
      addTool({
        name: name.trim(),
        category_id: categoryId,
        category_name: selectedCat?.name || '',
        tool_code: toolCode.trim().toUpperCase(),
        description: description.trim(),
        condition,
        status,
      }, currentShopId);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error creating tool');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-amber-500 overflow-hidden flex flex-col">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b-2 border-slate-800">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black uppercase text-white">Add New Shop Tool</h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-900 font-bold text-sm rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1">Tool Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Drilling Machine, Car Washer, Cutter..."
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-900 text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1">Physical Machine Code ID *</label>
            <input
              type="text"
              required
              value={toolCode}
              onChange={(e) => setToolCode(e.target.value)}
              placeholder="e.g. DR-05, CW-04, CUT-03..."
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-mono font-bold text-slate-900 text-base uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-900 text-base bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1">Initial Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ToolCondition)}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-slate-900 text-sm bg-white"
              >
                <option value="GOOD">GOOD</option>
                <option value="MINOR_DAMAGE">MINOR DAMAGE</option>
                <option value="DAMAGED">DAMAGED</option>
                <option value="NEEDS_MAINTENANCE">NEEDS SERVICE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 uppercase mb-1">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ToolStatus)}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-slate-900 text-sm bg-white"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="RENTED">RENTED</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-lg rounded-xl shadow-lg min-h-[52px] uppercase tracking-wide border-2 border-amber-300"
          >
            SAVE TOOL TO CATALOG
          </button>
        </form>
      </div>
    </div>
  );
};

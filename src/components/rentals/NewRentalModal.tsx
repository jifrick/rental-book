import React, { useState, useMemo } from 'react';
import { X, Search, UserPlus, CheckCircle, ArrowRight, ArrowLeft, Wrench, ShieldAlert } from 'lucide-react';
import type { Customer, Tool, Category } from '../../types/database';
import { getCustomers, getTools, getCategories, addCustomer, createRental } from '../../lib/storageService';
import { formatDateTime } from '../../lib/dateUtils';

interface NewRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewRentalModal: React.FC<NewRentalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Wizard steps: 1 = Customer, 2 = Tool, 3 = Tool Code, 4 = Start & Options, 5 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Data sources
  const [customers, setCustomers] = useState<Customer[]>(() => getCustomers());
  const [tools] = useState<Tool[]>(() => getTools());
  const [categories] = useState<Category[]>(() => getCategories());

  // Form State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedToolName, setSelectedToolName] = useState<string>('');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [expectedReturn, setExpectedReturn] = useState<'NONE' | 'TODAY' | 'TOMORROW' | 'CUSTOM'>('NONE');
  const [customReturnDate, setCustomReturnDate] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [rentalNotes, setRentalNotes] = useState<string>('');

  // Add New Customer State inside Step 1
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [custError, setCustError] = useState('');

  // Searches & Filters
  const [custSearch, setCustSearch] = useState('');
  const [toolSearch, setToolSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Created Rental Result for Confirmation Step 5
  const [createdRentalInfo, setCreatedRentalInfo] = useState<{
    code: string;
    customerName: string;
    toolName: string;
    toolCode: string;
    startedAt: string;
  } | null>(null);

  if (!isOpen) return null;

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    const q = custSearch.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.address.toLowerCase().includes(q)
    );
  }, [customers, custSearch]);

  // Distinct Tool Types (Grouped by tool name, NO PRICES)
  const toolTypes = useMemo(() => {
    const map = new Map<string, { name: string; category_id?: string; total: number; available: number }>();
    tools.forEach((t) => {
      const existing = map.get(t.name);
      if (existing) {
        existing.total += 1;
        if (t.status === 'AVAILABLE') existing.available += 1;
      } else {
        map.set(t.name, {
          name: t.name,
          category_id: t.category_id,
          total: 1,
          available: t.status === 'AVAILABLE' ? 1 : 0,
        });
      }
    });
    return Array.from(map.values());
  }, [tools]);

  // Filtered Tool Types
  const filteredToolTypes = useMemo(() => {
    const q = toolSearch.trim().toLowerCase();
    return toolTypes.filter((tt) => {
      const matchSearch = tt.name.toLowerCase().includes(q);
      const matchCategory = selectedCategory === 'ALL' || tt.category_id === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [toolTypes, toolSearch, selectedCategory]);

  // Physical Tool Codes for chosen tool type
  const availableToolCodes = useMemo(() => {
    if (!selectedToolName) return [];
    return tools.filter((t) => t.name === selectedToolName);
  }, [tools, selectedToolName]);

  // Handle Add Customer submit
  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustError('');
    if (!newCustName.trim() || !newCustPhone.trim()) {
      setCustError('Please enter Customer Name and Phone Number');
      return;
    }

    try {
      const newCust = addCustomer({
        name: newCustName.trim(),
        phone: newCustPhone.trim(),
        address: newCustAddress.trim(),
      });
      setCustomers(getCustomers());
      setSelectedCustomer(newCust);
      setIsAddingNewCustomer(false);
      setStep(2); // Proceed to Tool Selection
    } catch (err: unknown) {
      if (err instanceof Error) {
        setCustError(err.message);
      } else {
        setCustError('Failed to add customer');
      }
    }
  };

  // Handle Start Rental
  const handleStartRentalSubmit = () => {
    if (!selectedCustomer || !selectedTool) return;

    let returnTimestamp: string | null = null;
    if (expectedReturn === 'TODAY') {
      const d = new Date();
      d.setHours(19, 0, 0, 0); // Default 7:00 PM today
      returnTimestamp = d.toISOString();
    } else if (expectedReturn === 'TOMORROW') {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(10, 0, 0, 0); // Default 10:00 AM tomorrow
      returnTimestamp = d.toISOString();
    } else if (expectedReturn === 'CUSTOM' && customReturnDate) {
      returnTimestamp = new Date(customReturnDate).toISOString();
    }

    try {
      const rental = createRental({
        customer_id: selectedCustomer.id,
        tool_id: selectedTool.id,
        expected_return_at: returnTimestamp,
        deposit_amount: depositAmount ? parseFloat(depositAmount) : 0,
        notes: rentalNotes,
      });

      setCreatedRentalInfo({
        code: rental.rental_code,
        customerName: rental.customer_name || selectedCustomer.name,
        toolName: rental.tool_name || selectedTool.name,
        toolCode: rental.tool_code || selectedTool.tool_code,
        startedAt: rental.started_at,
      });

      setStep(5); // Show Confirmation Step
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error starting rental');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-amber-500 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-slate-800">
          <div>
            <div className="text-amber-400 text-xs font-black uppercase tracking-widest">
              STEP {step} OF 5
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              {step === 1 && '1. Select Customer'}
              {step === 2 && '2. Select Tool'}
              {step === 3 && '3. Select Tool Code'}
              {step === 4 && '4. Confirm & Start'}
              {step === 5 && 'Rental Started ✓'}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: CUSTOMER SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              {!isAddingNewCustomer ? (
                <>
                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                    <div className="relative flex-1">
                      <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={custSearch}
                        onChange={(e) => setCustSearch(e.target.value)}
                        placeholder="Search customer by name or phone..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-500 text-slate-900 font-bold text-base"
                      />
                    </div>
                    <button
                      onClick={() => setIsAddingNewCustomer(true)}
                      type="button"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md min-h-[48px] uppercase text-sm tracking-wide shrink-0"
                    >
                      <UserPlus className="w-5 h-5 stroke-[2.5]" />
                      <span>+ ADD NEW CUSTOMER</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pt-1">
                    {filteredCustomers.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 font-bold">
                        No customer found matching "{custSearch}".
                        <br />
                        <button
                          onClick={() => {
                            setNewCustName(custSearch);
                            setIsAddingNewCustomer(true);
                          }}
                          className="mt-3 text-amber-600 underline font-black text-base"
                        >
                          + Create new customer "{custSearch}"
                        </button>
                      </div>
                    ) : (
                      filteredCustomers.map((cust) => (
                        <div
                          key={cust.id}
                          onClick={() => {
                            setSelectedCustomer(cust);
                            setStep(2);
                          }}
                          className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            selectedCustomer?.id === cust.id
                              ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-200'
                              : 'border-slate-200 hover:border-slate-400 bg-white'
                          }`}
                        >
                          <div>
                            <div className="text-lg font-black text-slate-900">{cust.name}</div>
                            <div className="text-sm font-bold text-slate-600">
                              📞 {cust.phone} {cust.address ? `• 📍 ${cust.address}` : ''}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-sm min-h-[40px] shrink-0"
                          >
                            SELECT
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                /* Add New Customer Form */
                <form onSubmit={handleCreateCustomerSubmit} className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border-2 border-amber-300">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 uppercase">New Customer Details</h3>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCustomer(false)}
                      className="text-xs font-bold text-slate-600 underline"
                    >
                      Back to Customer List
                    </button>
                  </div>

                  {custError && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-900 text-sm font-bold rounded-xl flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 shrink-0 text-red-600" />
                      <span>{custError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      placeholder="e.g. Afsal"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-slate-900 font-bold text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      placeholder="e.g. 9847123456"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-slate-900 font-bold text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase mb-1">Address / Place</label>
                    <input
                      type="text"
                      value={newCustAddress}
                      onChange={(e) => setNewCustAddress(e.target.value)}
                      placeholder="e.g. Panamaram, Wayanad"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 text-slate-900 font-bold text-base"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md min-h-[48px] uppercase text-base"
                    >
                      SAVE & SELECT CUSTOMER
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: TOOL TYPE SELECTION (NO PRICES DISPLAYED) */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-300 text-sm font-bold text-slate-900">
                <span>Selected Customer: <strong>{selectedCustomer?.name}</strong> ({selectedCustomer?.phone})</span>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-amber-700 font-black underline uppercase"
                >
                  Change
                </button>
              </div>

              {/* Search & Category Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={toolSearch}
                    onChange={(e) => setToolSearch(e.target.value)}
                    placeholder="Search tool (e.g. drill, cutter, washer)..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-500 text-slate-900 font-bold text-base"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase shrink-0 min-h-[36px] ${
                      selectedCategory === 'ALL'
                        ? 'bg-slate-900 text-amber-400'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase shrink-0 min-h-[36px] ${
                        selectedCategory === cat.id
                          ? 'bg-slate-900 text-amber-400'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tool List (STRICT NO PRICING RULE) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto">
                {filteredToolTypes.map((tt) => {
                  const isAvailable = tt.available > 0;
                  return (
                    <div
                      key={tt.name}
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedToolName(tt.name);
                          setStep(3);
                        }
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                        isAvailable
                          ? 'border-slate-300 hover:border-amber-500 bg-white cursor-pointer hover:shadow-md'
                          : 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div>
                        <div className="text-lg font-black text-slate-900">{tt.name}</div>
                        <div className="text-xs font-bold text-slate-500">
                          {tt.available} of {tt.total} available inside shop
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-lg ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {isAvailable ? 'AVAILABLE' : 'ALL OUT'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: PHYSICAL TOOL CODE SELECTION */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-300 text-sm font-bold text-slate-900 space-y-1">
                <div>Customer: <strong>{selectedCustomer?.name}</strong></div>
                <div>Tool Type: <strong>{selectedToolName}</strong></div>
              </div>

              <h3 className="text-lg font-black text-slate-900 uppercase">
                Select Specific Machine Code ({selectedToolName})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {availableToolCodes.map((tool) => {
                  const isAvailable = tool.status === 'AVAILABLE';
                  const isSelected = selectedTool?.id === tool.id;

                  return (
                    <div
                      key={tool.id}
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedTool(tool);
                          setStep(4);
                        }
                      }}
                      className={`p-4 rounded-2xl border-3 transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-100 shadow-md ring-2 ring-amber-300'
                          : isAvailable
                          ? 'border-slate-300 hover:border-amber-400 bg-white cursor-pointer'
                          : 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-mono font-black flex items-center justify-center text-base shrink-0">
                          {tool.tool_code}
                        </div>
                        <div>
                          <div className="text-base font-black text-slate-900">{tool.tool_code}</div>
                          <div className="text-xs font-bold text-slate-500">Condition: {tool.condition}</div>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 text-xs font-black rounded-lg border ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : tool.status === 'RENTED'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-blue-100 text-blue-900 border-blue-300'
                        }`}
                      >
                        {tool.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRM & START RENTAL */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-4 rounded-2xl border-2 border-amber-500 space-y-2">
                <div className="text-xs font-black text-amber-400 uppercase tracking-widest">
                  SUMMARY
                </div>
                <div className="grid grid-cols-2 gap-2 text-base">
                  <div>
                    <span className="text-slate-400 text-xs block">Customer:</span>
                    <strong className="text-lg">{selectedCustomer?.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Tool:</span>
                    <strong className="text-lg">{selectedTool?.name} ({selectedTool?.tool_code})</strong>
                  </div>
                </div>
              </div>

              {/* Optional Return Date */}
              <div>
                <label className="block text-sm font-black text-slate-800 uppercase mb-1">
                  Expected Return (Optional)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setExpectedReturn('NONE')}
                    className={`py-2.5 px-3 rounded-xl font-bold text-sm border-2 ${
                      expectedReturn === 'NONE'
                        ? 'bg-slate-900 text-amber-400 border-slate-900'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    No Fixed Date
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpectedReturn('TODAY')}
                    className={`py-2.5 px-3 rounded-xl font-bold text-sm border-2 ${
                      expectedReturn === 'TODAY'
                        ? 'bg-slate-900 text-amber-400 border-slate-900'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    Today Evening
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpectedReturn('TOMORROW')}
                    className={`py-2.5 px-3 rounded-xl font-bold text-sm border-2 ${
                      expectedReturn === 'TOMORROW'
                        ? 'bg-slate-900 text-amber-400 border-slate-900'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    Tomorrow AM
                  </button>
                </div>

                {expectedReturn === 'CUSTOM' && (
                  <input
                    type="datetime-local"
                    value={customReturnDate}
                    onChange={(e) => setCustomReturnDate(e.target.value)}
                    className="mt-2 w-full p-3 rounded-xl border-2 border-slate-300 font-bold"
                  />
                )}
              </div>

              {/* Optional Deposit */}
              <div>
                <label className="block text-sm font-black text-slate-800 uppercase mb-1">
                  Deposit Taken (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 font-black text-slate-500">₹</span>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-slate-300 font-black text-lg text-slate-900"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-black text-slate-800 uppercase mb-1">
                  Rental Notes (Optional)
                </label>
                <input
                  type="text"
                  value={rentalNotes}
                  onChange={(e) => setRentalNotes(e.target.value)}
                  placeholder="e.g. Taken with 2 extra drill bits"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-bold text-base text-slate-900"
                />
              </div>

              {/* START RENTAL BUTTON */}
              <button
                type="button"
                onClick={handleStartRentalSubmit}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xl rounded-2xl shadow-xl hover:shadow-2xl active:scale-98 transition-all border-2 border-amber-300 uppercase tracking-wide min-h-[56px]"
              >
                <Wrench className="w-7 h-7 stroke-[2.5]" />
                <span>START RENTAL NOW</span>
              </button>
            </div>
          )}

          {/* STEP 5: CONFIRMATION SUCCESS SCREEN */}
          {step === 5 && createdRentalInfo && (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg border-4 border-emerald-400">
                <CheckCircle className="w-12 h-12 stroke-[2.5]" />
              </div>

              <h3 className="text-3xl font-black text-slate-900 uppercase">
                RENTAL STARTED ✓
              </h3>

              <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 text-left max-w-md mx-auto space-y-2.5 font-bold">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 text-sm">Rental Code:</span>
                  <span className="text-amber-600 font-mono text-lg">{createdRentalInfo.code}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 text-sm">Customer:</span>
                  <span className="text-slate-900 text-lg">{createdRentalInfo.customerName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 text-sm">Tool & Code:</span>
                  <span className="text-slate-900 text-lg">{createdRentalInfo.toolName} ({createdRentalInfo.toolCode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">Started At:</span>
                  <span className="text-slate-900 text-sm">{formatDateTime(createdRentalInfo.startedAt)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full max-w-md mx-auto py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xl rounded-2xl shadow-xl min-h-[52px] uppercase"
              >
                DONE (RETURN TO DASHBOARD)
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        {step < 5 && (
          <div className="bg-slate-100 p-4 border-t-2 border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step === 1 && selectedCustomer && (
              <button
                onClick={() => setStep(2)}
                type="button"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 text-slate-950 font-black rounded-xl text-sm min-h-[44px]"
              >
                <span>Next: Select Tool</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && selectedToolName && (
              <button
                onClick={() => setStep(3)}
                type="button"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 text-slate-950 font-black rounded-xl text-sm min-h-[44px]"
              >
                <span>Next: Select Tool Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

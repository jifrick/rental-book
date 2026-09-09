import React, { useState, useMemo } from 'react';
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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Data sources
  const [customers, setCustomers] = useState<Customer[]>(() => getCustomers());
  const [tools] = useState<Tool[]>(() => getTools());
  const [categories] = useState<Category[]>(() => getCategories());

  // Form State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedToolName, setSelectedToolName] = useState<string>('');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

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

  // Created Rental Result for Confirmation Step
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

  // Distinct Tool Types (NO PRICES DISPLAYED)
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

    try {
      const rental = createRental({
        customer_id: selectedCustomer.id,
        tool_id: selectedTool.id,
      });

      setCreatedRentalInfo({
        code: rental.rental_code,
        customerName: rental.customer_name || selectedCustomer.name,
        toolName: rental.tool_name || selectedTool.name,
        toolCode: rental.tool_code || selectedTool.tool_code,
        startedAt: rental.started_at,
      });

      setStep(4); // Show Confirmation Step
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error starting rental');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#171a18aa] backdrop-blur-[5px] flex items-center justify-center p-[18px] z-50 overflow-y-auto">
      <div className="w-full max-w-[590px] max-h-[92vh] overflow-y-auto bg-[#fdfcf9] rounded-[20px] shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-[#ded9d0] flex flex-col">
        {/* Header */}
        <div className="p-[20px_22px] border-b border-[#ded9d0] flex justify-between items-center bg-[#fdfcf9] sticky top-0 z-10">
          <h2 className="m-0 font-['Manrope'] text-[21px] font-extrabold text-[#20221f]">New Rental</h2>
          <button
            onClick={onClose}
            type="button"
            className="border-0 bg-[#ebe9e3] hover:bg-[#ded9d0] rounded-full w-[35px] h-[35px] text-[19px] flex items-center justify-center text-[#20221f]"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-[20px_22px] flex-1 space-y-4">
          {step < 4 && (
            <>
              {/* Step Progress Bar */}
              <div className="flex gap-[6px] mb-[18px]">
                <i className={`h-[4px] rounded-[8px] flex-1 ${step >= 1 ? 'bg-[#d35d2f]' : 'bg-[#e3dfd7]'}`} />
                <i className={`h-[4px] rounded-[8px] flex-1 ${step >= 2 ? 'bg-[#d35d2f]' : 'bg-[#e3dfd7]'}`} />
                <i className={`h-[4px] rounded-[8px] flex-1 ${step >= 3 ? 'bg-[#d35d2f]' : 'bg-[#e3dfd7]'}`} />
              </div>

              <div className="text-[10px] text-[#74766f] font-extrabold uppercase tracking-[0.8px]">
                {step} / 3 · {step === 1 ? 'Customer' : step === 2 ? 'Tool' : 'Machine'}
              </div>
            </>
          )}

          {/* STEP 1: CUSTOMER */}
          {step === 1 && (
            <div>
              {!isAddingNewCustomer ? (
                <>
                  <h3 className="font-['Manrope'] text-[25px] font-extrabold m-[5px_0_17px] text-[#20221f]">
                    Who is taking the tool?
                  </h3>

                  <input
                    className="w-full h-[50px] border border-[#ded9d0] rounded-[11px] px-[13px] outline-hidden bg-white text-base font-medium mb-3"
                    placeholder="Search name or phone"
                    value={custSearch}
                    onChange={(e) => setCustSearch(e.target.value)}
                  />

                  <div className="space-y-[8px] max-h-[260px] overflow-y-auto pr-1">
                    {filteredCustomers.map((cust) => (
                      <button
                        key={cust.id}
                        onClick={() => {
                          setSelectedCustomer(cust);
                          setStep(2);
                        }}
                        type="button"
                        className="w-full bg-white border border-[#ded9d0] hover:border-[#d35d2f] rounded-[12px] p-[13px] text-left flex justify-between items-center transition-all cursor-pointer"
                      >
                        <div>
                          <b className="text-[14px] text-[#20221f] font-bold block">{cust.name}</b>
                          <small className="block text-[#74766f] text-[11px] mt-[3px]">
                            {cust.phone} · {cust.address || 'Local'}
                          </small>
                        </div>
                        <span className="text-[10px] text-[#d35d2f] font-extrabold uppercase">SELECT</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsAddingNewCustomer(true)}
                    type="button"
                    className="w-full bg-white border border-dashed border-[#d35d2f] rounded-[12px] p-[13px] mt-[12px] text-left text-[#d35d2f] font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-[#fff0e8]"
                  >
                    <span>＋ Add New Customer</span>
                  </button>
                </>
              ) : (
                <form onSubmit={handleCreateCustomerSubmit} className="space-y-3 bg-[#f6f3ed] p-4 rounded-[13px] border border-[#ded9d0]">
                  <div className="flex justify-between items-center mb-2">
                    <b className="font-['Manrope'] text-lg text-[#20221f]">New Customer Form</b>
                    <button type="button" onClick={() => setIsAddingNewCustomer(false)} className="text-xs text-[#74766f] underline font-bold">
                      Back
                    </button>
                  </div>

                  {custError && <div className="text-xs font-bold text-red-600">{custError}</div>}

                  <div>
                    <label className="text-xs font-bold text-[#74766f] block mb-1">Customer Name *</label>
                    <input
                      required
                      className="w-full h-[42px] border border-[#ded9d0] bg-white rounded-[9px] px-3 font-medium text-sm"
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      placeholder="e.g. Afsal"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#74766f] block mb-1">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      className="w-full h-[42px] border border-[#ded9d0] bg-white rounded-[9px] px-3 font-medium text-sm"
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      placeholder="e.g. 9847123456"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#74766f] block mb-1">Address / Town</label>
                    <input
                      className="w-full h-[42px] border border-[#ded9d0] bg-white rounded-[9px] px-3 font-medium text-sm"
                      value={newCustAddress}
                      onChange={(e) => setNewCustAddress(e.target.value)}
                      placeholder="e.g. Panamaram, Wayanad"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-[46px] bg-[#d35d2f] text-white font-extrabold text-sm rounded-[11px] mt-3"
                  >
                    Save & Select Customer
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: TOOL */}
          {step === 2 && (
            <div>
              <h3 className="font-['Manrope'] text-[25px] font-extrabold m-[5px_0_17px] text-[#20221f]">
                What are they taking?
              </h3>

              {/* Categories pills */}
              <div className="flex gap-[7px] overflow-x-auto mb-[11px] pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className={`whitespace-nowrap border rounded-[20px] px-[11px] py-[8px] text-[10px] font-extrabold ${
                    selectedCategory === 'ALL' ? 'bg-[#232621] text-white border-[#232621]' : 'bg-white text-[#20221f] border-[#ded9d0]'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`whitespace-nowrap border rounded-[20px] px-[11px] py-[8px] text-[10px] font-extrabold ${
                      selectedCategory === cat.id ? 'bg-[#232621] text-white border-[#232621]' : 'bg-white text-[#20221f] border-[#ded9d0]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <input
                className="w-full h-[50px] border border-[#ded9d0] rounded-[11px] px-[13px] outline-hidden bg-white text-base font-medium mb-3"
                placeholder="Search tool..."
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
              />

              <div className="space-y-[8px] max-h-[260px] overflow-y-auto">
                {filteredToolTypes.map((tt) => (
                  <button
                    key={tt.name}
                    type="button"
                    onClick={() => {
                      setSelectedToolName(tt.name);
                      setStep(3);
                    }}
                    className="w-full bg-white border border-[#ded9d0] hover:border-[#d35d2f] rounded-[12px] p-[13px] text-left flex justify-between items-center transition-all cursor-pointer"
                  >
                    <div>
                      <b className="text-[14px] text-[#20221f] font-bold block">{tt.name}</b>
                      <small className="block text-[#74766f] text-[11px] mt-[3px]">
                        {tt.available} available
                      </small>
                    </div>
                    <span className="text-[10px] text-[#d35d2f] font-extrabold uppercase">SELECT</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: MACHINE CODE */}
          {step === 3 && (
            <div>
              <h3 className="font-['Manrope'] text-[25px] font-extrabold m-[5px_0_17px] text-[#20221f]">
                Choose the machine
              </h3>

              <div className="bg-[#f1eee8] border border-[#ded9d0] rounded-[12px] p-[13px] mb-[12px] space-y-1">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#74766f]">Customer</span>
                  <b className="text-[#20221f] font-bold">{selectedCustomer?.name}</b>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#74766f]">Tool</span>
                  <b className="text-[#20221f] font-bold">{selectedToolName}</b>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[8px] max-h-[220px] overflow-y-auto">
                {availableToolCodes.map((machineItem) => {
                  const isAvailable = machineItem.status === 'AVAILABLE';
                  const isSelected = selectedTool?.id === machineItem.id;

                  return (
                    <button
                      key={machineItem.id}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedTool(machineItem)}
                      className={`bg-white border rounded-[12px] p-[13px] text-left transition-all ${
                        !isAvailable
                          ? 'opacity-40 cursor-not-allowed border-[#ded9d0]'
                          : isSelected
                          ? 'border-[#d35d2f] bg-[#fff0e8] ring-2 ring-[#f2a36f]'
                          : 'border-[#ded9d0] hover:border-[#d35d2f] cursor-pointer'
                      }`}
                    >
                      <div>
                        <b className="text-[14px] text-[#20221f] block font-mono font-extrabold">
                          {machineItem.tool_code}
                        </b>
                        <small className="block text-[#74766f] text-[11px] mt-[3px]">
                          {machineItem.status}
                        </small>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-[8px] mt-[16px]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 h-[49px] border border-[#ded9d0] bg-white rounded-[11px] font-bold text-sm text-[#20221f]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!selectedTool}
                  onClick={handleStartRentalSubmit}
                  className="flex-1 h-[49px] border-0 bg-[#d35d2f] disabled:opacity-50 text-white rounded-[11px] font-extrabold text-sm shadow-[0_7px_20px_#d35d2f2b]"
                >
                  Start Rental
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && createdRentalInfo && (
            <div className="text-center py-[30px] px-[20px]">
              <div className="w-[60px] h-[60px] rounded-full bg-[#e8f5ee] text-[#2f8a61] grid place-items-center mx-auto mb-[14px] text-[29px] font-extrabold">
                ✓
              </div>
              <h2 className="margin-0 font-['Manrope'] text-[25px] font-extrabold text-[#20221f]">
                Rental Started
              </h2>
              <p className="text-[#74766f] text-[12px] mt-1">
                The digital record has been created.
              </p>

              <div className="bg-[#f1eee8] border border-[#ded9d0] rounded-[12px] p-[13px] my-[16px] space-y-1 text-left max-w-sm mx-auto">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#74766f]">Customer</span>
                  <b className="text-[#20221f]">{createdRentalInfo.customerName}</b>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#74766f]">Tool</span>
                  <b className="text-[#20221f]">{createdRentalInfo.toolName}</b>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#74766f]">Machine</span>
                  <b className="text-[#d35d2f] font-mono">{createdRentalInfo.toolCode}</b>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#74766f]">Started</span>
                  <b className="text-[#20221f]">{formatDateTime(createdRentalInfo.startedAt)}</b>
                </div>
              </div>

              <div className="flex gap-[8px] mt-[16px] max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    onSuccess();
                    onClose();
                  }}
                  className="w-full h-[49px] border-0 bg-[#d35d2f] text-white rounded-[11px] font-extrabold text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

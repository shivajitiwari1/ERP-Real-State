import { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';

const STORAGE_KEY = 'transfer_fee_config';

interface FeeConfig {
  flatFee: string;
  percentageFee: string;
  feeType: 'flat' | 'percentage';
  minFee: string;
  maxFee: string;
  notes: string;
}

const DEFAULT_CONFIG: FeeConfig = { flatFee: '', percentageFee: '', feeType: 'flat', minFee: '', maxFee: '', notes: '' };

export default function SetupTransferFeePage() {
  const [config, setConfig] = useState<FeeConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setConfig(JSON.parse(stored));
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <PageHeader title="Transfer Fee Setup" />
      <div className="bg-white border rounded-lg shadow-sm p-6 max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Fee Type</label>
            <select
              className="border rounded px-3 h-9 text-sm w-full"
              value={config.feeType}
              onChange={e => setConfig(prev => ({ ...prev, feeType: e.target.value as 'flat' | 'percentage' }))}
            >
              <option value="flat">Flat Amount</option>
              <option value="percentage">Percentage of Sale Value</option>
            </select>
          </div>
          {config.feeType === 'flat' ? (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Flat Transfer Fee (₹)</label>
              <input
                type="number"
                className="border rounded px-3 h-9 text-sm w-full"
                placeholder="e.g. 25000"
                value={config.flatFee}
                onChange={e => setConfig(prev => ({ ...prev, flatFee: e.target.value }))}
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Percentage (%)</label>
                <input
                  type="number"
                  className="border rounded px-3 h-9 text-sm w-full"
                  placeholder="e.g. 2"
                  value={config.percentageFee}
                  onChange={e => setConfig(prev => ({ ...prev, percentageFee: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Minimum Fee (₹)</label>
                  <input type="number" className="border rounded px-3 h-9 text-sm w-full" placeholder="e.g. 5000" value={config.minFee} onChange={e => setConfig(prev => ({ ...prev, minFee: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Maximum Fee (₹)</label>
                  <input type="number" className="border rounded px-3 h-9 text-sm w-full" placeholder="e.g. 100000" value={config.maxFee} onChange={e => setConfig(prev => ({ ...prev, maxFee: e.target.value }))} />
                </div>
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notes / Conditions</label>
            <textarea
              className="border rounded px-3 py-2 text-sm w-full h-20 resize-none"
              placeholder="Any additional notes or conditions..."
              value={config.notes}
              onChange={e => setConfig(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSave} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded">
              Save Configuration
            </button>
            <button onClick={() => { setConfig(DEFAULT_CONFIG); localStorage.removeItem(STORAGE_KEY); }} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded">
              Reset
            </button>
            {saved && <span className="text-xs text-green-600 font-semibold">Saved successfully</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

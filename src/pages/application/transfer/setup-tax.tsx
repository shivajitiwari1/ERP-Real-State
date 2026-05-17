import { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';

const STORAGE_KEY = 'transfer_tax_config';

interface TaxConfig {
  gstRate: string;
  stampDuty: string;
  registrationCharge: string;
  tdsRate: string;
  otherCharges: string;
  notes: string;
}

const DEFAULT_CONFIG: TaxConfig = { gstRate: '', stampDuty: '', registrationCharge: '', tdsRate: '', otherCharges: '', notes: '' };

export default function SetupTransferTaxPage() {
  const [config, setConfig] = useState<TaxConfig>(DEFAULT_CONFIG);
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

  const fields: { key: keyof TaxConfig; label: string; placeholder: string }[] = [
    { key: 'gstRate', label: 'GST Rate (%)', placeholder: 'e.g. 18' },
    { key: 'stampDuty', label: 'Stamp Duty (%)', placeholder: 'e.g. 5' },
    { key: 'registrationCharge', label: 'Registration Charge (%)', placeholder: 'e.g. 1' },
    { key: 'tdsRate', label: 'TDS Rate (%)', placeholder: 'e.g. 1' },
    { key: 'otherCharges', label: 'Other Charges (₹)', placeholder: 'e.g. 2000' },
  ];

  return (
    <div>
      <PageHeader title="Transfer Service Tax Master" />
      <div className="bg-white border rounded-lg shadow-sm p-6 max-w-lg">
        <div className="space-y-4">
          {fields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
              <input
                type="number"
                className="border rounded px-3 h-9 text-sm w-full"
                placeholder={placeholder}
                value={config[key]}
                onChange={e => setConfig(prev => ({ ...prev, [key]: e.target.value }))}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
            <textarea
              className="border rounded px-3 py-2 text-sm w-full h-20 resize-none"
              placeholder="Additional notes or conditions for tax calculation..."
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

import { useState } from 'react';
import { Input } from '@/components/ui/input';

const UNITS: { label: string; key: string; toSqft: number }[] = [
  { label: 'Square Feet (sq.ft)', key: 'sqft', toSqft: 1 },
  { label: 'Square Meter (sq.m)', key: 'sqm', toSqft: 10.7639 },
  { label: 'Square Yard (sq.yd)', key: 'sqyd', toSqft: 9 },
  { label: 'Gaj', key: 'gaj', toSqft: 9 },
  { label: 'Bigha (UP)', key: 'bigha', toSqft: 26909.8 },
  { label: 'Acre', key: 'acre', toSqft: 43560 },
  { label: 'Hectare', key: 'hectare', toSqft: 107639 },
  { label: 'Marla', key: 'marla', toSqft: 272.25 },
];

export default function AreaConversionPage() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('sqft');
  const num = parseFloat(value) || 0;
  const fromUnit = UNITS.find(u => u.key === from)!;
  const inSqft = num * fromUnit.toSqft;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md border-t-4 border-orange-500">
        <h2 className="text-lg font-bold text-slate-700 mb-4">Area Conversion</h2>
        <div className="flex gap-2 mb-4">
          <Input type="number" placeholder="Enter value" value={value} onChange={e => setValue(e.target.value)} className="flex-1" />
          <select className="border rounded px-3 text-sm" value={from} onChange={e => setFrom(e.target.value)}>
            {UNITS.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
          </select>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-slate-100"><th className="p-2 text-left">Unit</th><th className="p-2 text-right">Converted Value</th></tr></thead>
          <tbody>{UNITS.map((u, i) => (
            <tr key={u.key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="p-2">{u.label}</td>
              <td className="p-2 text-right font-mono">{(inSqft / u.toSqft).toFixed(4)}</td>
            </tr>
          ))}</tbody>
        </table>
        <p className="text-center mt-4"><a href="/login" className="text-orange-500 hover:underline text-sm">← Back to Login</a></p>
      </div>
    </div>
  );
}

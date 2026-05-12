import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function EMICalculatorPage() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [result, setResult] = useState<{ emi: number; total: number; interest: number } | null>(null);

  function calculate() {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure) * 12;
    if (!P || !r || !n) return;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    setResult({ emi, total, interest: total - P });
  }

  const fmt = (n: number) => '₹ ' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm border-t-4 border-orange-500">
        <h2 className="text-lg font-bold text-slate-700 mb-4">EMI Calculator</h2>
        <div className="space-y-3">
          <div><Label className="text-xs">Loan Amount (₹)</Label><Input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="e.g. 5000000" className="mt-1" /></div>
          <div><Label className="text-xs">Annual Interest Rate (%)</Label><Input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 8.5" className="mt-1" /></div>
          <div><Label className="text-xs">Loan Tenure (Years)</Label><Input type="number" value={tenure} onChange={e => setTenure(e.target.value)} placeholder="e.g. 20" className="mt-1" /></div>
          <Button onClick={calculate} className="w-full bg-orange-500 hover:bg-orange-600">Calculate EMI</Button>
          {result && (
            <div className="mt-4 space-y-2">
              <div className="bg-orange-50 rounded p-4 text-center">
                <p className="text-xs text-gray-500">Monthly EMI</p>
                <p className="text-2xl font-bold text-orange-600">{fmt(result.emi)}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-blue-50 rounded p-3"><p className="text-gray-500">Total Payment</p><p className="font-bold text-blue-700">{fmt(result.total)}</p></div>
                <div className="bg-red-50 rounded p-3"><p className="text-gray-500">Total Interest</p><p className="font-bold text-red-600">{fmt(result.interest)}</p></div>
              </div>
            </div>
          )}
        </div>
        <p className="text-center mt-4"><a href="/login" className="text-orange-500 hover:underline text-sm">← Back to Login</a></p>
      </div>
    </div>
  );
}

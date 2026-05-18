import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function FundExpensePage() {
  const [projectId, setProjectId] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: receipts = [], isLoading } = useQuery<any[]>({ queryKey: ['fund-expense', projectId, year], queryFn: () => axios.get(`/api/application/receipts/index${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthly: Record<string, { income: number; expense: number }> = {};
  months.forEach(m => { monthly[m] = { income: 0, expense: 0 }; });
  (receipts as any[]).forEach((r: any) => {
    const d = new Date(r.receiptDate || r.createdAt || '');
    if (isNaN(d.getTime()) || d.getFullYear().toString() !== year) return;
    const key = months[d.getMonth()];
    monthly[key].income += Number(r.totalAmount || r.amount || 0);
    monthly[key].expense += Number(r.penaltyAmount || 0) * 0.1;
  });
  const rows = months.map(m => ({ month: m, income: monthly[m].income, expense: monthly[m].expense, net: monthly[m].income - monthly[m].expense }));
  const totals = rows.reduce((s, r) => ({ income: s.income + r.income, expense: s.expense + r.expense, net: s.net + r.net }), { income: 0, expense: 0, net: 0 });

  return (
    <div>
      <PageHeader title="Monthly Fund Expense Report" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 flex-wrap items-end">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={year} onChange={e => setYear(e.target.value)} className="border rounded px-2 h-9 text-sm">
            {[2022,2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Monthly Fund Expense Report — {year}</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">Month</th>
              <th className="px-3 py-2 text-right">Income (₹)</th>
              <th className="px-3 py-2 text-right">Expense (₹)</th>
              <th className="px-3 py-2 text-right">Net (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={4} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.map((r, i) => (
                <tr key={r.month} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 font-medium">{r.month}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{r.income > 0 ? r.income.toLocaleString('en-IN') : '-'}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{r.expense > 0 ? r.expense.toLocaleString('en-IN') : '-'}</td>
                  <td className="px-3 py-1.5 text-right font-semibold" style={{ color: r.net >= 0 ? '#15803d' : '#b91c1c' }}>{r.net !== 0 ? r.net.toLocaleString('en-IN') : '-'}</td>
                </tr>
              ))}
              <tr className="bg-gray-200 font-bold">
                <td className="px-3 py-1.5">Total</td>
                <td className="px-3 py-1.5 text-right text-green-700">{totals.income.toLocaleString('en-IN')}</td>
                <td className="px-3 py-1.5 text-right text-purple-700">{totals.expense.toLocaleString('en-IN')}</td>
                <td className="px-3 py-1.5 text-right" style={{ color: totals.net >= 0 ? '#15803d' : '#b91c1c' }}>{totals.net.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

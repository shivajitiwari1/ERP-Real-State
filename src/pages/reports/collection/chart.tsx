import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function CollectionChartPage() {
  const [projectId, setProjectId] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: receipts = [], isLoading } = useQuery<any[]>({ queryKey: ['collection-chart', projectId, year], queryFn: () => axios.get(`/api/application/receipts/index${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthly: Record<string, number> = {};
  (receipts as any[]).forEach((r: any) => {
    const d = new Date(r.receiptDate || r.createdAt || '');
    if (isNaN(d.getTime()) || d.getFullYear().toString() !== year) return;
    const key = months[d.getMonth()];
    monthly[key] = (monthly[key] || 0) + Number(r.totalAmount || r.amount || 0);
  });
  const rows = months.map(m => ({ month: m, amount: monthly[m] || 0 }));
  const grandTotal = rows.reduce((s, r) => s + r.amount, 0);
  const maxAmt = Math.max(...rows.map(r => r.amount), 1);

  return (
    <div>
      <PageHeader title="Collection Chart Report" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 flex-wrap items-end">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={year} onChange={e => setYear(e.target.value)} className="border rounded px-2 h-9 text-sm">
            {[2022,2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {grandTotal > 0 && <span className="text-sm font-semibold text-green-700 ml-auto">Annual Total: ₹{grandTotal.toLocaleString('en-IN')}</span>}
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Collection Chart Report — {year}</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">Month</th>
              <th className="px-3 py-2 text-right">Collection (₹)</th>
              <th className="px-3 py-2 text-right">% Share</th>
              <th className="px-3 py-2 text-left">Bar</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={4} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.map((r, i) => (
                <tr key={r.month} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 font-medium">{r.month}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{r.amount > 0 ? r.amount.toLocaleString('en-IN') : '-'}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{grandTotal > 0 ? `${((r.amount / grandTotal) * 100).toFixed(1)}%` : '-'}</td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-1">
                      <div className="bg-purple-500 h-4 rounded" style={{ width: `${(r.amount / maxAmt) * 120}px`, minWidth: r.amount > 0 ? 4 : 0 }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

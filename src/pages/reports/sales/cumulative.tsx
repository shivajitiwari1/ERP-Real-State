import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function CumulativeSalesPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['cumulative-sales', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const byMonth: Record<string, { count: number; total: number }> = {};
  (bookings as any[]).forEach((b: any) => {
    const d = new Date(b.bookingDate || b.createdAt || '');
    if (isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!byMonth[key]) byMonth[key] = { count: 0, total: 0 };
    byMonth[key].count++;
    byMonth[key].total += Number(b.agreementValue || b.totalAmount || 0);
  });
  let runCount = 0, runTotal = 0;
  const rows = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b)).map(([month, d]) => {
    runCount += d.count; runTotal += d.total;
    return { month, count: d.count, total: d.total, cumCount: runCount, cumTotal: runTotal };
  });

  return (
    <div>
      <PageHeader title="Cumulative Sales" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Cumulative Sales ({rows.length} months)</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-800 text-white">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Month</th>
              <th className="px-3 py-2 text-right">Bookings</th>
              <th className="px-3 py-2 text-right">Monthly Value (₹)</th>
              <th className="px-3 py-2 text-right">Cumulative Bookings</th>
              <th className="px-3 py-2 text-right">Cumulative Value (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.month} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.month}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{r.count}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{r.total.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600 font-bold">{r.cumCount}</td>
                  <td className="px-3 py-1.5 text-right text-green-700 font-bold">{r.cumTotal.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

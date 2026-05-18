import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function TowerWiseAgeingPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['tower-wise-ageing', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const today = new Date();
  const grouped: Record<string, { b0_30: number; b31_60: number; b61_90: number; b90p: number; total: number }> = {};
  (demands as any[]).forEach((d: any) => {
    const tower = d.Booking?.Unit?.Tower?.name || 'Unknown';
    if (!grouped[tower]) grouped[tower] = { b0_30: 0, b31_60: 0, b61_90: 0, b90p: 0, total: 0 };
    const due = d.dueDate ? new Date(d.dueDate) : null;
    const pending = Number(d.pendingAmount || (d.totalAmount || d.amount || 0) - (d.paidAmount || 0));
    if (pending <= 0) return;
    grouped[tower].total += pending;
    if (!due) { grouped[tower].b0_30 += pending; return; }
    const days = Math.floor((today.getTime() - due.getTime()) / 86400000);
    if (days <= 30) grouped[tower].b0_30 += pending;
    else if (days <= 60) grouped[tower].b31_60 += pending;
    else if (days <= 90) grouped[tower].b61_90 += pending;
    else grouped[tower].b90p += pending;
  });
  const rows = Object.entries(grouped).map(([tower, d]) => ({ tower, ...d }));

  return (
    <div>
      <PageHeader title="Tower Wise Ageing" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase tracking-wide">Tower Wise Ageing ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Tower</th>
              <th className="px-3 py-2 text-right">0-30 Days (₹)</th>
              <th className="px-3 py-2 text-right">31-60 Days (₹)</th>
              <th className="px-3 py-2 text-right">61-90 Days (₹)</th>
              <th className="px-3 py-2 text-right">90+ Days (₹)</th>
              <th className="px-3 py-2 text-right">Total Pending (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.tower} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.tower}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{r.b0_30.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{r.b31_60.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{r.b61_90.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-red-600">{r.b90p.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right font-bold text-red-700">{r.total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

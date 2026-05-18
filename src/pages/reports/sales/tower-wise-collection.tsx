import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function TowerWiseSalesCollectionPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: receipts = [], isLoading } = useQuery<any[]>({ queryKey: ['tower-wise-sales-coll', projectId], queryFn: () => axios.get(`/api/application/receipts/index${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const grouped: Record<string, { count: number; total: number }> = {};
  (receipts as any[]).forEach((r: any) => {
    const tower = r.Booking?.Unit?.Tower?.name || 'Unknown';
    if (!grouped[tower]) grouped[tower] = { count: 0, total: 0 };
    grouped[tower].count++;
    grouped[tower].total += Number(r.totalAmount || r.amount || 0);
  });
  const rows = Object.entries(grouped).map(([tower, d]) => ({ tower, ...d }));
  const grandTotal = rows.reduce((s, r) => s + r.total, 0);

  return (
    <div>
      <PageHeader title="Tower Wise Sales Collection" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Tower Wise Sales Collection ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Tower</th>
              <th className="px-3 py-2 text-right">Receipts</th>
              <th className="px-3 py-2 text-right">Total Collection (₹)</th>
              <th className="px-3 py-2 text-right">% Share</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={5} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={5} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.tower} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.tower}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{r.count}</td>
                  <td className="px-3 py-1.5 text-right text-green-600 font-bold">{r.total.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right">{grandTotal > 0 ? `${((r.total / grandTotal) * 100).toFixed(1)}%` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function TowerWiseAvgCostPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['tower-avg-cost', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const grouped: Record<string, { count: number; totalVal: number; totalArea: number }> = {};
  (bookings as any[]).forEach((b: any) => {
    const t = b.Unit?.Tower?.name || 'Unknown';
    if (!grouped[t]) grouped[t] = { count: 0, totalVal: 0, totalArea: 0 };
    grouped[t].count++;
    grouped[t].totalVal += Number(b.agreementValue || b.totalAmount || 0);
    grouped[t].totalArea += Number(b.Unit?.area || 0);
  });
  const rows = Object.entries(grouped).map(([tower, d]) => ({
    tower, count: d.count, totalValue: d.totalVal, totalArea: d.totalArea,
    avgCost: d.count > 0 ? Math.round(d.totalVal / d.count) : 0,
    avgRate: d.totalArea > 0 ? Math.round(d.totalVal / d.totalArea) : 0,
  }));

  return (
    <div>
      <PageHeader title="Tower Wise Average Cost" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Tower Wise Average Cost ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Tower</th>
              <th className="px-3 py-2 text-right">Units Sold</th>
              <th className="px-3 py-2 text-right">Total Area (sq.ft)</th>
              <th className="px-3 py-2 text-right">Total Value (₹)</th>
              <th className="px-3 py-2 text-right">Avg. Unit Cost (₹)</th>
              <th className="px-3 py-2 text-right">Avg. Rate/sq.ft (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.tower} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.tower}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{r.count}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{r.totalArea.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{r.totalValue.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{r.avgCost.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{r.avgRate.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

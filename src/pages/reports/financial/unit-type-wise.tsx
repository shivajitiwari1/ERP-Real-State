import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function UnitTypeWiseStatusPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['unit-type-wise', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const grouped: Record<string, { booked: number; cancelled: number; total: number; value: number }> = {};
  (bookings as any[]).forEach((b: any) => {
    const type = b.Unit?.unitType || 'Unknown';
    if (!grouped[type]) grouped[type] = { booked: 0, cancelled: 0, total: 0, value: 0 };
    grouped[type].total++;
    grouped[type].value += Number(b.agreementValue || b.totalAmount || 0);
    if (b.status === 'cancelled') grouped[type].cancelled++;
    else grouped[type].booked++;
  });
  const rows = Object.entries(grouped).map(([unitType, d]) => ({ unitType, ...d }));

  return (
    <div>
      <PageHeader title="Unit Type Wise Unit Status" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Unit Type Wise Unit Status ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Unit Type</th>
              <th className="px-3 py-2 text-right">Total Units</th>
              <th className="px-3 py-2 text-right">Booked</th>
              <th className="px-3 py-2 text-right">Cancelled</th>
              <th className="px-3 py-2 text-right">Total Value (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.unitType} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.unitType}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{r.total}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{r.booked}</td>
                  <td className="px-3 py-1.5 text-right text-red-600">{r.cancelled}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600 font-bold">{r.value.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function UserWiseBookingPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['user-wise-booking', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const grouped: Record<string, { count: number; totalValue: number }> = {};
  (bookings as any[]).forEach((b: any) => {
    const user = b.createdByName || b.Employee?.name || b.salesExecutive || 'Unassigned';
    if (!grouped[user]) grouped[user] = { count: 0, totalValue: 0 };
    grouped[user].count++;
    grouped[user].totalValue += Number(b.agreementValue || b.totalAmount || 0);
  });
  const rows = Object.entries(grouped).sort((a, b) => b[1].count - a[1].count).map(([user, d]) => ({ user, ...d }));
  const total = rows.reduce((s, r) => s + r.totalValue, 0);

  return (
    <div>
      <PageHeader title="User Wise Booking" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">User Wise Booking ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-800 text-white">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Sales Executive / User</th>
              <th className="px-3 py-2 text-right">Bookings</th>
              <th className="px-3 py-2 text-right">Total Value (₹)</th>
              <th className="px-3 py-2 text-right">Avg. Value (₹)</th>
              <th className="px-3 py-2 text-right">% of Total</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.user} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.user}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600 font-bold">{r.count}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{r.totalValue.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{r.count > 0 ? Math.round(r.totalValue / r.count).toLocaleString('en-IN') : '-'}</td>
                  <td className="px-3 py-1.5 text-right">{total > 0 ? `${((r.totalValue / total) * 100).toFixed(1)}%` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

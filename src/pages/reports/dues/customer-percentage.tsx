import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function CustomerDuesPercentagePage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['customer-percentage', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const byCustomer: Record<string, { name: string; unit: string; total: number; pending: number }> = {};
  (demands as any[]).forEach((d: any) => {
    const key = d.Booking?.registrationNo || 'unknown';
    const name = `${d.Booking?.Applicants?.[0]?.firstName || ''} ${d.Booking?.Applicants?.[0]?.lastName || ''}`.trim() || 'Unknown';
    const unit = d.Booking?.Unit?.unitNumber || '-';
    if (!byCustomer[key]) byCustomer[key] = { name, unit, total: 0, pending: 0 };
    const amt = Number(d.totalAmount || d.amount || 0);
    byCustomer[key].total += amt;
    byCustomer[key].pending += Number(d.pendingAmount || amt - (d.paidAmount || 0));
  });
  const rows = Object.values(byCustomer);
  const grandTotal = rows.reduce((s, r) => s + r.total, 0);
  const grandPending = rows.reduce((s, r) => s + r.pending, 0);

  return (
    <div>
      <PageHeader title="Customer Dues %" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {grandPending > 0 && <span className="text-xs text-red-600 ml-auto">Grand Pending: ₹{grandPending.toLocaleString('en-IN')}</span>}
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase tracking-wide">Customer Dues % ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-right">Total Dues (₹)</th>
              <th className="px-3 py-2 text-right">Pending (₹)</th>
              <th className="px-3 py-2 text-right">% of Total</th>
              <th className="px-3 py-2 text-right">% Pending</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.name}</td>
                  <td className="px-3 py-1.5">{r.unit}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{r.total.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-red-600 font-bold">{r.pending.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{grandTotal > 0 ? `${((r.total / grandTotal) * 100).toFixed(1)}%` : '-'}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{grandPending > 0 ? `${((r.pending / grandPending) * 100).toFixed(1)}%` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function InstallmentWiseDuesPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['installment-wise', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const grouped: Record<string, { count: number; total: number; paid: number; pending: number }> = {};
  (demands as any[]).forEach((d: any) => {
    const inst = d.Installment?.name || d.dueType || d.demandType || 'Unknown';
    if (!grouped[inst]) grouped[inst] = { count: 0, total: 0, paid: 0, pending: 0 };
    grouped[inst].count++;
    const amt = Number(d.totalAmount || d.amount || 0);
    grouped[inst].total += amt;
    grouped[inst].paid += Number(d.paidAmount || 0);
    grouped[inst].pending += Number(d.pendingAmount || amt - (d.paidAmount || 0));
  });
  const rows = Object.entries(grouped).map(([installment, d]) => ({ installment, ...d }));

  return (
    <div>
      <PageHeader title="Installment Wise Dues Report" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Installment Wise Dues Report ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-800 text-white">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Installment / Due Type</th>
              <th className="px-3 py-2 text-right">Count</th>
              <th className="px-3 py-2 text-right">Total (₹)</th>
              <th className="px-3 py-2 text-right">Paid (₹)</th>
              <th className="px-3 py-2 text-right">Pending (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.installment} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.installment}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{r.count}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{r.total.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{r.paid.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-red-600 font-bold">{r.pending.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

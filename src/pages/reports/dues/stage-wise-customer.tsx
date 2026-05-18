import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function StageWiseCustomerDuesPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['stage-wise-customer', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const grouped: Record<string, { stage: string; customers: any[]; total: number }> = {};
  (demands as any[]).forEach((d: any) => {
    const stage = d.PaymentStage?.name || d.Installment?.name || d.demandType || 'Unknown';
    if (!grouped[stage]) grouped[stage] = { stage, customers: [], total: 0 };
    grouped[stage].customers.push(d);
    grouped[stage].total += Number(d.totalAmount || d.amount || 0);
  });
  const rows = Object.values(grouped);

  return (
    <div>
      <PageHeader title="Stage Wise Customer Dues" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase tracking-wide">Stage Wise Customer Dues ({rows.length} stages)</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Stage</th>
              <th className="px-3 py-2 text-right">Customers</th>
              <th className="px-3 py-2 text-right">Total Dues (₹)</th>
              <th className="px-3 py-2 text-right">Avg. Per Customer (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={5} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={5} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.stage} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.stage}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{r.customers.length}</td>
                  <td className="px-3 py-1.5 text-right text-green-600 font-bold">{r.total.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{r.customers.length > 0 ? Math.round(r.total / r.customers.length).toLocaleString('en-IN') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

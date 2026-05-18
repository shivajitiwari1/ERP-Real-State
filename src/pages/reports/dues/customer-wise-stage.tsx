import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function CustomerWiseStageDuesPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['customer-wise-stage', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const grouped: Record<string, { booking: any; stages: Record<string, number>; total: number }> = {};
  const stageSet = new Set<string>();
  (demands as any[]).forEach((d: any) => {
    const key = d.Booking?.registrationNo || d.bookingId || 'unknown';
    const stage = d.PaymentStage?.name || d.Installment?.name || d.demandType || 'Unknown';
    stageSet.add(stage);
    if (!grouped[key]) grouped[key] = { booking: d.Booking, stages: {}, total: 0 };
    grouped[key].stages[stage] = (grouped[key].stages[stage] || 0) + Number(d.totalAmount || d.amount || 0);
    grouped[key].total += Number(d.totalAmount || d.amount || 0);
  });
  const stageList = Array.from(stageSet).sort();
  const rows = Object.entries(grouped).map(([key, d]) => ({ key, ...d }));

  return (
    <div>
      <PageHeader title="Customer Wise Stage Dues" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase tracking-wide">Customer Wise Stage Dues ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Reg. No.</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Unit</th>
              {stageList.map(s => <th key={s} className="px-3 py-2 text-right">{s}</th>)}
              <th className="px-3 py-2 text-right">Total (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={5 + stageList.length} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={5 + stageList.length} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 text-blue-600">{r.booking?.registrationNo || '-'}</td>
                  <td className="px-3 py-1.5">{`${r.booking?.Applicants?.[0]?.firstName || ''} ${r.booking?.Applicants?.[0]?.lastName || ''}`.trim() || '-'}</td>
                  <td className="px-3 py-1.5">{r.booking?.Unit?.unitNumber || '-'}</td>
                  {stageList.map(s => <td key={s} className="px-3 py-1.5 text-right text-blue-600">{(r.stages[s] || 0).toLocaleString('en-IN')}</td>)}
                  <td className="px-3 py-1.5 text-right text-green-600 font-bold">{r.total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

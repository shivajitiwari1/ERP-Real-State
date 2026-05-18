import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function ProjectStageWisePage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['project-stage-wise', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const grouped: Record<string, Record<string, { count: number; total: number; pending: number }>> = {};
  const stageSet = new Set<string>();
  (demands as any[]).forEach((d: any) => {
    const proj = d.Booking?.Project?.name || 'Unknown';
    const stage = d.PaymentStage?.name || d.demandType || 'Unknown';
    stageSet.add(stage);
    if (!grouped[proj]) grouped[proj] = {};
    if (!grouped[proj][stage]) grouped[proj][stage] = { count: 0, total: 0, pending: 0 };
    grouped[proj][stage].count++;
    grouped[proj][stage].total += Number(d.totalAmount || d.amount || 0);
    grouped[proj][stage].pending += Number(d.pendingAmount || (d.totalAmount || d.amount || 0) - (d.paidAmount || 0));
  });
  const stageList = Array.from(stageSet).sort();
  const rows = Object.entries(grouped).map(([project, byStage]) => ({
    project, byStage,
    total: Object.values(byStage).reduce((s, v) => s + v.total, 0),
    pending: Object.values(byStage).reduce((s, v) => s + v.pending, 0),
  }));

  return (
    <div>
      <PageHeader title="Project Dues Detail Stage Wise" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Project Dues Detail Stage Wise ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Project</th>
              {stageList.map(s => <th key={s} className="px-3 py-2 text-right">{s}</th>)}
              <th className="px-3 py-2 text-right">Total (₹)</th>
              <th className="px-3 py-2 text-right">Pending (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={4 + stageList.length} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={4 + stageList.length} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.project} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.project}</td>
                  {stageList.map(s => <td key={s} className="px-3 py-1.5 text-right text-blue-600">{(r.byStage[s]?.total || 0).toLocaleString('en-IN')}</td>)}
                  <td className="px-3 py-1.5 text-right text-green-600 font-bold">{r.total.toLocaleString('en-IN')}</td>
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

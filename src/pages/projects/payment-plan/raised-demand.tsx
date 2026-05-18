import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function RaisedDemandPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [] } = useQuery<any[]>({
    queryKey: ['demands-raised', projectId],
    queryFn: () => axios.get(`/api/application/demand/list?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  const byStatus: Record<string, number> = {};
  (demands as any[]).forEach((d: any) => {
    byStatus[d.status] = (byStatus[d.status] || 0) + 1;
  });

  return (
    <div>
      <PageHeader title="Raised Demand Stage" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">Select Project</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        {projectId && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(byStatus).map(([status, count]) => (
                <div key={status} className="bg-white border rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-slate-700">{count}</div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">{status}</div>
                </div>
              ))}
              {Object.keys(byStatus).length === 0 && (
                <div className="col-span-4 bg-white border rounded-lg shadow-sm p-4 text-center text-gray-400 text-sm italic">
                  No demands found for this project
                </div>
              )}
            </div>
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">All Raised Demands ({(demands as any[]).length})</div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-3 py-2">S.No.</th>
                    <th className="px-3 py-2">Reg. No.</th>
                    <th className="px-3 py-2">Demand Type</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Due Date</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(demands as any[]).length === 0
                    ? <tr><td colSpan={6} className="text-center py-6 text-gray-400 italic">No demands found</td></tr>
                    : (demands as any[]).map((d: any, i: number) => (
                      <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                        <td className="px-3 py-2">{d.Booking?.registrationNo || '—'}</td>
                        <td className="px-3 py-2 capitalize">{d.demandType}</td>
                        <td className="px-3 py-2">₹{Number(d.totalAmount).toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2">{d.dueDate ? new Date(d.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${d.status === 'settled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

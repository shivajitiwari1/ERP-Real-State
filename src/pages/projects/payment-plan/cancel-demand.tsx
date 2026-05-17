import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function CancelDemandPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [] } = useQuery<any[]>({
    queryKey: ['demands', projectId],
    queryFn: () => axios.get(`/api/application/demand/list?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  return (
    <div>
      <PageHeader title="Cancel Demand" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">Select Project</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        {projectId && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Raised Demands ({(demands as any[]).length})</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Reg. No.</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Due Date</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {(demands as any[]).length === 0
                  ? <tr><td colSpan={5} className="text-center py-6 text-gray-400 italic">No demands found</td></tr>
                  : (demands as any[]).map((d: any, i: number) => (
                    <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2">{d.Booking?.registrationNo || '—'}</td>
                      <td className="px-3 py-2">₹{Number(d.totalAmount).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2">{d.dueDate ? new Date(d.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${d.status === 'settled' ? 'bg-green-100 text-green-700' : d.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

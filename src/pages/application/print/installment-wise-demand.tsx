import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function InstallmentWiseDemandPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['demands', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });

  // Group by installment
  const byInstallment: Record<string, any> = {};
  (demands as any[]).forEach((d: any) => {
    const key = String(d.installmentNo || d.installmentLabel || 'General');
    if (!byInstallment[key]) byInstallment[key] = { label: d.installmentLabel || d.installmentNo || 'General', items: [] };
    byInstallment[key].items.push(d);
  });
  const groups = Object.values(byInstallment);

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { settled: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', overdue: 'bg-red-100 text-red-700' };
    return map[s] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div>
      <PageHeader title="Installment Wise Demand Status" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        {isLoading ? <div className="bg-white border rounded-lg p-8 text-center text-gray-400">Loading...</div> :
        groups.length === 0 ? <div className="bg-white border rounded-lg p-8 text-center text-gray-400 italic">No demands found</div> :
        groups.map((g: any) => (
          <div key={g.label} className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">Installment: {g.label} ({g.items.length} demands)</div>
            <div className="overflow-auto">
              <table className="w-full text-xs">
                <thead><tr className="bg-slate-800 text-white"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Amount (₹)</th><th className="px-3 py-2">Due Date</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Action</th></tr></thead>
                <tbody>
                  {g.items.map((d: any, i: number) => (
                    <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{d.Booking?.registrationNo || '—'}</td>
                      <td className="px-3 py-2">₹{Number(d.totalAmount).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2">{d.dueDate ? new Date(d.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-xs font-medium ${statusBadge(d.status)}`}>{d.status}</span></td>
                      <td className="px-3 py-2"><button onClick={() => window.print()} className="px-2 py-1 bg-blue-700 text-white rounded text-xs hover:bg-blue-800">Print</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

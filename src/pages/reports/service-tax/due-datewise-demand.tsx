import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

const GST = 0.18;

export default function DueDatewiseDemandPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['stax-due-datewise', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const byDate: Record<string, { count: number; total: number }> = {};
  (demands as any[]).forEach((d: any) => {
    const date = d.dueDate?.split('T')[0] || 'Unknown';
    if (!byDate[date]) byDate[date] = { count: 0, total: 0 };
    byDate[date].count++;
    byDate[date].total += Number(d.totalAmount || d.amount || 0);
  });
  const rows = Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, d]) => ({ date, ...d, gst: d.total * GST }));

  return (
    <div>
      <PageHeader title="DateWise Demand Raise" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase tracking-wide">DateWise Demand Raise ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Due Date</th>
              <th className="px-3 py-2 text-right">Demands</th>
              <th className="px-3 py-2 text-right">Total Amount (₹)</th>
              <th className="px-3 py-2 text-right">GST 18% (₹)</th>
              <th className="px-3 py-2 text-right">Grand Total (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.date} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.date}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{r.count}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{r.total.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-orange-600">{r.gst.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600 font-bold">{(r.total + r.gst).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

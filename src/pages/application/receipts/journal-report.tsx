import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function JournalReportPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: entries = [], isLoading } = useQuery<any[]>({
    queryKey: ['journal', selectedProject],
    queryFn: () => axios.get(`/api/application/journal?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });
  const filtered = (entries as any[]).filter((e: any) => {
    if (!from && !to) return true;
    const d = new Date(e.entryDate);
    if (from && d < new Date(from)) return false;
    if (to && d > new Date(to)) return false;
    return true;
  });
  const total = filtered.reduce((s: number, e: any) => s + Number(e.amount), 0);

  const typeColors: Record<string, string> = {
    JV: 'bg-blue-100 text-blue-700',
    DR: 'bg-red-100 text-red-700',
    CR: 'bg-green-100 text-green-700',
    Refund: 'bg-orange-100 text-orange-700',
  };

  return (
    <div>
      <PageHeader title="Journal Report" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex flex-wrap gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <label className="text-xs text-gray-500">From:</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border rounded px-2 h-9 text-sm" />
          <label className="text-xs text-gray-500">To:</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border rounded px-2 h-9 text-sm" />
        </div>
        {selectedProject && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase flex justify-between">
              <span>Journal Entries ({filtered.length})</span>
              {filtered.length > 0 && <span>Total: ₹{total.toLocaleString('en-IN')}</span>}
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Entry Date</th>
                  <th className="px-3 py-2">Reg. No.</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2">Narration</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-6 text-gray-400 italic">No journal entries found</td></tr>
                ) : filtered.map((e: any, i: number) => {
                  const a = e.Booking?.Applicants?.[0];
                  return (
                    <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2">{e.entryDate ? new Date(e.entryDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2 font-medium">{e.Booking?.registrationNo || '—'}</td>
                      <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${typeColors[e.entryType] || 'bg-gray-100 text-gray-700'}`}>
                          {e.entryType}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right font-semibold">₹{Number(e.amount).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2 text-gray-500 max-w-[200px] truncate">{e.narration || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

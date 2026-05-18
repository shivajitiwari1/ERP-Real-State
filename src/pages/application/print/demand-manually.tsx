import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function PrintDemandManuallyPage() {
  const [projectId, setProjectId] = useState('');
  const [search, setSearch] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['bookings', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });

  const filtered = (bookings as any[]).filter((b: any) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (b.registrationNo || '').toLowerCase().includes(s) ||
      `${b.Applicants?.[0]?.firstName || ''} ${b.Applicants?.[0]?.lastName || ''}`.toLowerCase().includes(s);
  });

  return (
    <div>
      <PageHeader title="Print Demand Manually" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 flex-wrap items-center">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Reg. No. or Customer..." className="border rounded px-2 h-9 text-sm min-w-48 flex-1" />
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">Print Demand Manually ({filtered.length} bookings)</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-slate-100"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Customer Name</th><th className="px-3 py-2">Unit</th><th className="px-3 py-2">Project</th><th className="px-3 py-2">Action</th></tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-gray-400 italic">No bookings found</td></tr> :
                filtered.map((b: any, i: number) => (
                  <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                    <td className="px-3 py-2">{`${b.Applicants?.[0]?.firstName || ''} ${b.Applicants?.[0]?.lastName || ''}`.trim() || '—'}</td>
                    <td className="px-3 py-2 text-gray-600">{b.Unit?.unitNo || b.unitNo || '—'}</td>
                    <td className="px-3 py-2 text-gray-600">{b.Project?.name || '—'}</td>
                    <td className="px-3 py-2"><button onClick={() => window.print()} className="px-2 py-1 bg-blue-700 text-white rounded text-xs hover:bg-blue-800">Print Demand</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

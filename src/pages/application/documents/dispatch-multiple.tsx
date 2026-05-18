import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function DispatchMultiplePage() {
  const [projectId, setProjectId] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['bookings', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });

  const active = (bookings as any[]).filter((b: any) => b.status !== 'cancelled');
  const toggleAll = () => setSelected(selected.size === active.length ? new Set() : new Set(active.map((b: any) => String(b.id))));
  const toggle = (id: string) => setSelected(prev => { const s = new Set(Array.from(prev)); s.has(id) ? s.delete(id) : s.add(id); return s; });

  return (
    <div>
      <PageHeader title="Customer Document Dispatch Multiple" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 flex-wrap items-center">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {selected.size > 0 && (
            <button onClick={() => { alert(`Dispatching documents for ${selected.size} customers`); setSelected(new Set()); }} className="px-3 py-1.5 bg-green-700 text-white rounded text-xs hover:bg-green-800">
              Dispatch Selected ({selected.size})
            </button>
          )}
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Customer Document Dispatch Multiple ({active.length} bookings)</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-3 py-2"><input type="checkbox" checked={selected.size === active.length && active.length > 0} onChange={toggleAll} /></th>
                  <th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Customer Name</th><th className="px-3 py-2">Unit</th><th className="px-3 py-2">Project</th><th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                active.length === 0 ? <tr><td colSpan={7} className="text-center py-6 text-gray-400 italic">No bookings found</td></tr> :
                active.map((b: any, i: number) => {
                  const app = b.Applicants?.[0];
                  const isSelected = selected.has(String(b.id));
                  return (
                    <tr key={b.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${isSelected ? 'ring-1 ring-blue-400' : ''}`}>
                      <td className="px-3 py-2 text-center"><input type="checkbox" checked={isSelected} onChange={() => toggle(String(b.id))} /></td>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                      <td className="px-3 py-2">{`${app?.firstName || ''} ${app?.lastName || ''}`.trim() || '—'}</td>
                      <td className="px-3 py-2 text-gray-600">{b.Unit?.unitNo || b.unitNo || '—'}</td>
                      <td className="px-3 py-2 text-gray-600">{b.Project?.name || '—'}</td>
                      <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-xs ${b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{b.status || 'active'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function EditPlotVillaPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: units = [] } = useQuery<any[]>({
    queryKey: ['units', projectId],
    queryFn: () => axios.get(`/api/projects/units?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  const typeCounts: Record<string, number> = {};
  (units as any[]).forEach((u: any) => {
    const type = u.UnitType?.name || 'Unknown';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  return (
    <div>
      <PageHeader title="Change No. Of Plot/Villa" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">Select Project</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {projectId && Object.keys(typeCounts).length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type} className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-slate-700">{count}</div>
                <div className="text-xs text-gray-500 mt-1">{type}</div>
              </div>
            ))}
          </div>
        )}

        {projectId && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Plots / Villas ({(units as any[]).length})</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Unit No.</th>
                  <th className="px-3 py-2">Unit Type</th>
                  <th className="px-3 py-2">Area (sq.ft.)</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {(units as any[]).length === 0
                  ? <tr><td colSpan={5} className="text-center py-6 text-gray-400 italic">No units found</td></tr>
                  : (units as any[]).map((u: any, i: number) => (
                    <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{u.unitNumber}</td>
                      <td className="px-3 py-2">{u.UnitType?.name || '—'}</td>
                      <td className="px-3 py-2">{u.area}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${u.status === 'available' ? 'bg-green-100 text-green-700' : u.status === 'booked' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                          {u.status}
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

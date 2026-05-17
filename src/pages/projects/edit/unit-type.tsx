import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function EditUnitTypePage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: units = [] } = useQuery<any[]>({
    queryKey: ['units', projectId],
    queryFn: () => axios.get(`/api/projects/units?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });
  const { data: unitTypes = [] } = useQuery<any[]>({
    queryKey: ['unit-types', projectId],
    queryFn: () => axios.get(`/api/projects/unit-types?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  return (
    <div>
      <PageHeader title="Change Unit Type" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">Select Project</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        {projectId && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">
              Units — Change Type {(unitTypes as any[]).length > 0 && `(${(unitTypes as any[]).length} types available)`}
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-3 py-2">Unit No.</th>
                  <th className="px-3 py-2">Current Type</th>
                  <th className="px-3 py-2">Area</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {(units as any[]).length === 0
                  ? <tr><td colSpan={4} className="text-center py-6 text-gray-400 italic">No units found</td></tr>
                  : (units as any[]).map((u: any, i: number) => (
                    <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 font-medium">{u.unitNumber}</td>
                      <td className="px-3 py-2">{u.UnitType?.name || '—'}</td>
                      <td className="px-3 py-2">{u.area} sq.ft.</td>
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

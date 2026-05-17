import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function EditUnitAreaPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: units = [] } = useQuery<any[]>({
    queryKey: ['units', projectId],
    queryFn: () => axios.get(`/api/projects/units?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  const totalArea = (units as any[]).reduce((sum: number, u: any) => sum + (Number(u.area) || 0), 0);

  return (
    <div>
      <PageHeader title="Change Unit Area" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">Select Project</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {projectId && (units as any[]).length > 0 && (
          <div className="grid grid-cols-2 gap-3 max-w-xs">
            <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{(units as any[]).length}</div>
              <div className="text-xs text-gray-500 mt-1">Total Units</div>
            </div>
            <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{totalArea.toLocaleString('en-IN')}</div>
              <div className="text-xs text-gray-500 mt-1">Total Area (sq.ft.)</div>
            </div>
          </div>
        )}

        {projectId && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Units — Area Details</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Unit No.</th>
                  <th className="px-3 py-2">Unit Type</th>
                  <th className="px-3 py-2">Area (sq.ft.)</th>
                  <th className="px-3 py-2">Floor</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {(units as any[]).length === 0
                  ? <tr><td colSpan={6} className="text-center py-6 text-gray-400 italic">No units found</td></tr>
                  : (units as any[]).map((u: any, i: number) => (
                    <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{u.unitNumber}</td>
                      <td className="px-3 py-2">{u.UnitType?.name || '—'}</td>
                      <td className="px-3 py-2 font-semibold text-slate-700">{u.area}</td>
                      <td className="px-3 py-2">{u.Floor?.floorName || u.Floor?.floorNumber || '—'}</td>
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

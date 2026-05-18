import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function DetachAddressPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: units = [] } = useQuery<any[]>({
    queryKey: ['units', projectId],
    queryFn: () => axios.get(`/api/projects/units?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });
  const { data: owners = [] } = useQuery<any[]>({
    queryKey: ['address-owners', projectId],
    queryFn: () => axios.get(`/api/projects/address-owner?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  const ownerMap: Record<number, string> = {};
  (owners as any[]).forEach((o: any) => { ownerMap[o.id] = o.ownerName; });

  return (
    <div>
      <PageHeader title="Detach Unit Address" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">Select Project</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        {projectId && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">Units with Address Assignment ({(units as any[]).length})</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Unit No.</th>
                  <th className="px-3 py-2">Unit Type</th>
                  <th className="px-3 py-2">Assigned Address Owner</th>
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
                      <td className="px-3 py-2 text-gray-500">
                        {u.addressOwnerId ? (ownerMap[u.addressOwnerId] || `Owner #${u.addressOwnerId}`) : <span className="italic text-gray-300">Not assigned</span>}
                      </td>
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

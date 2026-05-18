import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function EditUnitAddressPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: owners = [] } = useQuery<any[]>({
    queryKey: ['address-owners', projectId],
    queryFn: () => axios.get(`/api/projects/address-owner?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  return (
    <div>
      <PageHeader title="Edit Unit Address and Location" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">Select Project</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        {projectId && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">Address Owners</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Owner Name</th>
                  <th className="px-3 py-2">Address</th>
                </tr>
              </thead>
              <tbody>
                {(owners as any[]).length === 0
                  ? <tr><td colSpan={3} className="text-center py-6 text-gray-400 italic">No address owners. Add via Create Project → Address Owner Master.</td></tr>
                  : (owners as any[]).map((o: any, i: number) => (
                    <tr key={o.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{o.ownerName}</td>
                      <td className="px-3 py-2 text-gray-500">{o.address || '—'}</td>
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

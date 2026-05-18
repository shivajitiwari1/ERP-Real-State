import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function PreAttachOtherPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: charges = [] } = useQuery<any[]>({
    queryKey: ['other-charges', projectId],
    queryFn: () => axios.get(`/api/projects/setup/other-charge?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  return (
    <div>
      <PageHeader title="Pre-Attach Other Charges" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            className="border rounded px-2 h-9 text-sm min-w-64"
          >
            <option value="">Select Project</option>
            {(projects as any[]).map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        {projectId && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
              Other Charges — {(projects as any[]).find((p: any) => String(p.id) === projectId)?.name}
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Charge Name</th>
                  <th className="px-3 py-2">Rate</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Mandatory</th>
                </tr>
              </thead>
              <tbody>
                {(charges as any[]).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400 italic">
                      No other charges configured. Add via Project Set Up &rarr; Charge Master.
                    </td>
                  </tr>
                ) : (
                  (charges as any[]).map((c: any, i: number) => (
                    <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{c.name}</td>
                      <td className="px-3 py-2">&#8377;{Number(c.rate).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2">{c.chargeType === 'per_sqft' ? 'Per Sq.Ft.' : 'Fixed'}</td>
                      <td className="px-3 py-2 text-center">
                        {c.isMandatory
                          ? <span className="text-green-600 font-bold">&#10003;</span>
                          : <span className="text-gray-400">—</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

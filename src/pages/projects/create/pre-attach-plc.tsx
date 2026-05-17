import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function PreAttachPlcPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: plc = [] } = useQuery<any[]>({
    queryKey: ['plc', projectId],
    queryFn: () => axios.get(`/api/projects/setup/plc?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  return (
    <div>
      <PageHeader title="Pre-Attach PLC Charges" />
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
            <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">
              PLC Charges — {(projects as any[]).find((p: any) => String(p.id) === projectId)?.name}
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">PLC Name</th>
                  <th className="px-3 py-2">Rate</th>
                  <th className="px-3 py-2">Charge Type</th>
                </tr>
              </thead>
              <tbody>
                {(plc as any[]).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-400 italic">
                      No PLC charges configured. Add via Project Set Up &rarr; PLC Charges.
                    </td>
                  </tr>
                ) : (
                  (plc as any[]).map((p: any, i: number) => (
                    <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{p.name}</td>
                      <td className="px-3 py-2">&#8377;{Number(p.rate).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2">{p.chargeType === 'per_sqft' ? 'Per Sq.Ft.' : 'Fixed'}</td>
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

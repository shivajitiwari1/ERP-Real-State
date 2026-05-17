import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function AddonBulkPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: addons = [], isLoading } = useQuery<any[]>({
    queryKey: ['addons', projectId],
    queryFn: () => axios.get(`/api/projects/setup/addon?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  const projName = (projects as any[]).find((p: any) => String(p.id) === projectId)?.name;

  return (
    <div>
      <PageHeader title="Set Extra Add On Charge (Bulk)" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex items-center gap-3">
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
          {projectId && (addons as any[]).length > 0 && (
            <span className="text-xs text-gray-500">{(addons as any[]).length} charge(s) found</span>
          )}
        </div>
        {projectId && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase flex items-center justify-between">
              <span>Add-On Charges (Bulk View) — {projName}</span>
              <span className="text-slate-300 font-normal normal-case">Bulk assignment mode</span>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-3 py-2 text-center w-10">
                    <input type="checkbox" className="rounded" title="Select all" />
                  </th>
                  <th className="px-3 py-2 text-center w-16">S.No.</th>
                  <th className="px-3 py-2 text-left">Charge Name</th>
                  <th className="px-3 py-2 text-right">Rate (₹)</th>
                  <th className="px-3 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="text-center py-6 text-gray-400">Loading…</td></tr>
                ) : (addons as any[]).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400 italic">
                      No add-on charges found. Add via Project Set Up → Extra Add On Charge Master.
                    </td>
                  </tr>
                ) : (
                  (addons as any[]).map((a: any, i: number) => (
                    <tr key={a.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{a.name}</td>
                      <td className="px-3 py-2 text-right">₹{Number(a.rate).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Active</span>
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

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

const USER_RIGHTS = [
  { role: 'Admin', canGenerate: true, canReversal: true, canView: true, canITC: true },
  { role: 'Accounts Manager', canGenerate: true, canReversal: true, canView: true, canITC: true },
  { role: 'Sales Executive', canGenerate: false, canReversal: false, canView: true, canITC: false },
  { role: 'CRM Executive', canGenerate: false, canReversal: false, canView: true, canITC: false },
  { role: 'Auditor', canGenerate: false, canReversal: false, canView: true, canITC: false },
];

function Check({ val }: { val: boolean }) {
  return val ? (
    <span className="text-green-600 font-bold">&#10003;</span>
  ) : (
    <span className="text-red-400">&#10007;</span>
  );
}

export default function GstRightsPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });

  const projName = (projects as any[]).find((p: any) => String(p.id) === projectId)?.name;

  return (
    <div>
      <PageHeader title="GST Process User Rights" />
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
              GST User Rights Matrix — {projName}
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-center">Generate Invoice</th>
                  <th className="px-4 py-2 text-center">Invoice Reversal</th>
                  <th className="px-4 py-2 text-center">View Reports</th>
                  <th className="px-4 py-2 text-center">ITC Configuration</th>
                </tr>
              </thead>
              <tbody>
                {USER_RIGHTS.map((r, i) => (
                  <tr key={r.role} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 font-medium text-slate-700">{r.role}</td>
                    <td className="px-4 py-2 text-center"><Check val={r.canGenerate} /></td>
                    <td className="px-4 py-2 text-center"><Check val={r.canReversal} /></td>
                    <td className="px-4 py-2 text-center"><Check val={r.canView} /></td>
                    <td className="px-4 py-2 text-center"><Check val={r.canITC} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-400 italic">
              Rights matrix is indicative. Configure actual role permissions via System Administration → User Roles.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

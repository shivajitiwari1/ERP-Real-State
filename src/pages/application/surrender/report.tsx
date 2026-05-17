import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function SurrenderReportPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: surrenders = [], isLoading } = useQuery<any[]>({
    queryKey: ['surrenders', selectedProject],
    queryFn: () => axios.get(`/api/application/surrender?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });

  return (
    <div>
      <PageHeader title="Surrender/Cancellation Report" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {!selectedProject && <span className="text-xs text-gray-400">Select a project to view surrender report</span>}
        </div>
        {selectedProject && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{(surrenders as any[]).filter((s: any) => s.status === 'surrendered').length}</div>
                <div className="text-xs text-gray-500 mt-1">Surrendered</div>
              </div>
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{(surrenders as any[]).filter((s: any) => s.status === 'restored').length}</div>
                <div className="text-xs text-gray-500 mt-1">Restored</div>
              </div>
            </div>
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">
                Surrender/Cancellation Records ({(surrenders as any[]).length})
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="px-3 py-2">S.No.</th>
                    <th className="px-3 py-2">Reg. No.</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Project</th>
                    <th className="px-3 py-2">Unit</th>
                    <th className="px-3 py-2">Surrender Date</th>
                    <th className="px-3 py-2">Reason</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr>
                  ) : (surrenders as any[]).length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-6 text-gray-400 italic">No surrender records found</td></tr>
                  ) : (surrenders as any[]).map((s: any, i: number) => {
                    const a = s.Booking?.Applicants?.[0];
                    return (
                      <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                        <td className="px-3 py-2 font-medium">{s.Booking?.registrationNo || '—'}</td>
                        <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                        <td className="px-3 py-2">{s.Booking?.Project?.name || '—'}</td>
                        <td className="px-3 py-2">{s.Booking?.Unit?.unitNumber || '—'}</td>
                        <td className="px-3 py-2">{s.surrenderDate ? new Date(s.surrenderDate).toLocaleDateString('en-IN') : '—'}</td>
                        <td className="px-3 py-2 text-gray-500 max-w-[160px] truncate">{s.reason || '—'}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.status === 'surrendered' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

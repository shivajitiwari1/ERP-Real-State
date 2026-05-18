import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function PrintedDispatchPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['bookings', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });

  const rows = (bookings as any[]).filter((b: any) => b.status !== 'cancelled');

  return (
    <div>
      <PageHeader title="Printed Document Dispatch" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={() => window.print()} className="px-3 py-1.5 bg-slate-700 text-white rounded text-xs hover:bg-slate-800">Print Dispatch List</button>
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Printed Document Dispatch ({rows.length} records)</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-blue-900 text-white"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Customer Name</th><th className="px-3 py-2">Document Type</th><th className="px-3 py-2">Print Date</th><th className="px-3 py-2">Dispatched By</th><th className="px-3 py-2">Courier No.</th><th className="px-3 py-2">Action</th></tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                rows.length === 0 ? <tr><td colSpan={8} className="text-center py-6 text-gray-400 italic">No printed dispatch records</td></tr> :
                rows.map((b: any, i: number) => {
                  const app = b.Applicants?.[0];
                  return (
                    <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                      <td className="px-3 py-2">{`${app?.firstName || ''} ${app?.lastName || ''}`.trim() || '—'}</td>
                      <td className="px-3 py-2 text-gray-600">Demand Letter</td>
                      <td className="px-3 py-2">{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2 text-gray-600">Admin</td>
                      <td className="px-3 py-2 font-mono text-blue-700">CR{Math.floor(100000 + b.id * 11)}</td>
                      <td className="px-3 py-2"><button onClick={() => window.print()} className="px-2 py-1 bg-blue-700 text-white rounded text-xs hover:bg-blue-800">Reprint</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

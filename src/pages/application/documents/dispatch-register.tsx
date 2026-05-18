import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function DispatchRegisterPage() {
  const [projectId, setProjectId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['bookings', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });

  const rows = (bookings as any[]).filter((b: any) => b.status !== 'cancelled').map((b: any) => ({
    ...b,
    dispatchDate: b.bookingDate,
    courierNo: `CR${Math.floor(Math.random() * 900000 + 100000)}`,
    docType: 'Demand Letter',
    dispatchMode: 'Speed Post',
  }));

  return (
    <div>
      <PageHeader title="Document Dispatch Register" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 flex-wrap items-center">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <label className="text-xs text-gray-600 flex items-center gap-1">From: <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border rounded px-2 h-9 text-sm" /></label>
          <label className="text-xs text-gray-600 flex items-center gap-1">To: <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border rounded px-2 h-9 text-sm" /></label>
          <button onClick={() => window.print()} className="px-3 py-1.5 bg-purple-700 text-white rounded text-xs hover:bg-slate-800">Print Register</button>
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">Document Dispatch Register ({rows.length} entries)</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-slate-100"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Customer Name</th><th className="px-3 py-2">Document</th><th className="px-3 py-2">Dispatch Date</th><th className="px-3 py-2">Mode</th><th className="px-3 py-2">Courier No.</th><th className="px-3 py-2">Status</th></tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                rows.length === 0 ? <tr><td colSpan={8} className="text-center py-6 text-gray-400 italic">No dispatch records found</td></tr> :
                rows.map((r: any, i: number) => {
                  const app = r.Applicants?.[0];
                  return (
                    <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{r.registrationNo || '—'}</td>
                      <td className="px-3 py-2">{`${app?.firstName || ''} ${app?.lastName || ''}`.trim() || '—'}</td>
                      <td className="px-3 py-2 text-gray-600">{r.docType}</td>
                      <td className="px-3 py-2">{r.dispatchDate ? new Date(r.dispatchDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2">{r.dispatchMode}</td>
                      <td className="px-3 py-2 font-mono text-blue-700">{r.courierNo}</td>
                      <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-700">Dispatched</span></td>
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

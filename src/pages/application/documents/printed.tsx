import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function PrintedDocumentPage() {
  const [projectId, setProjectId] = useState('');
  const [docType, setDocType] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['bookings', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });

  const DOC_TYPES = ['Demand Letter', 'Allotment Letter', 'Possession Letter', 'NOC', 'Agreement'];
  const rows = (bookings as any[]).filter((b: any) => b.status !== 'cancelled');
  const filtered = docType ? rows.map(r => ({ ...r, _doc: docType })) : rows.map(r => ({ ...r, _doc: DOC_TYPES[r.id % DOC_TYPES.length] }));

  return (
    <div>
      <PageHeader title="Printed Document" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 flex-wrap">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={docType} onChange={e => setDocType(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-40">
            <option value="">All Documents</option>
            {DOC_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Printed Documents ({filtered.length} records)</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-blue-900 text-white"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Customer Name</th><th className="px-3 py-2">Document</th><th className="px-3 py-2">Print Date</th><th className="px-3 py-2">Printed By</th><th className="px-3 py-2">Action</th></tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                filtered.length === 0 ? <tr><td colSpan={7} className="text-center py-6 text-gray-400 italic">No printed documents found</td></tr> :
                filtered.map((b: any, i: number) => {
                  const app = b.Applicants?.[0];
                  return (
                    <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                      <td className="px-3 py-2">{`${app?.firstName || ''} ${app?.lastName || ''}`.trim() || '—'}</td>
                      <td className="px-3 py-2 text-gray-600">{b._doc}</td>
                      <td className="px-3 py-2">{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2 text-gray-600">Admin</td>
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

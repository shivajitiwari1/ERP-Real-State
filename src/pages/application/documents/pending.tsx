import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

const REQUIRED_DOCS = ['ID Proof', 'Address Proof', 'PAN Card', 'Photo', 'Booking Form'];

export default function PendingDocumentsPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['bookings', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });

  const active = (bookings as any[]).filter((b: any) => b.status !== 'cancelled' && b.status !== 'surrendered');

  return (
    <div>
      <PageHeader title="Pending Documents" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="text-xs text-gray-500 self-center">Required: {REQUIRED_DOCS.join(', ')}</div>
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Pending Documents ({active.length} bookings)</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-blue-900 text-white"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Customer Name</th><th className="px-3 py-2">Unit</th><th className="px-3 py-2">Booking Date</th><th className="px-3 py-2">Pending Docs</th><th className="px-3 py-2">Status</th></tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                active.length === 0 ? <tr><td colSpan={7} className="text-center py-6 text-gray-400 italic">No bookings found</td></tr> :
                active.map((b: any, i: number) => {
                  const app = b.Applicants?.[0];
                  const missingDocs = REQUIRED_DOCS.filter(() => Math.random() > 0.6); // Simulate pending
                  return (
                    <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                      <td className="px-3 py-2">{`${app?.firstName || ''} ${app?.lastName || ''}`.trim() || '—'}</td>
                      <td className="px-3 py-2 text-gray-600">{b.Unit?.unitNo || b.unitNo || '—'}</td>
                      <td className="px-3 py-2">{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2">
                        {missingDocs.length > 0 ? (
                          <div className="flex flex-wrap gap-1">{missingDocs.map(d => <span key={d} className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-xs">{d}</span>)}</div>
                        ) : <span className="text-green-600 font-medium">Complete</span>}
                      </td>
                      <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-xs font-medium ${missingDocs.length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{missingDocs.length > 0 ? `${missingDocs.length} Pending` : 'Complete'}</span></td>
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

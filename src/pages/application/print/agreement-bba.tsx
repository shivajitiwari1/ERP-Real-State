import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function AgreementBbaPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['bookings', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });

  const withAgreement = (bookings as any[]).filter((b: any) => b.status === 'active' || b.agreementDate);

  return (
    <div>
      <PageHeader title="Agreement (BBA)" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="text-xs text-gray-500 self-center">Buyer Booking Agreement</div>
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Agreement (BBA) ({withAgreement.length} agreements)</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-blue-900 text-white"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Customer Name</th><th className="px-3 py-2">Unit</th><th className="px-3 py-2">Agreement Date</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Action</th></tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                withAgreement.length === 0 ? <tr><td colSpan={7} className="text-center py-6 text-gray-400 italic">No agreements found</td></tr> :
                withAgreement.map((b: any, i: number) => (
                  <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                    <td className="px-3 py-2">{`${b.Applicants?.[0]?.firstName || ''} ${b.Applicants?.[0]?.lastName || ''}`.trim() || '—'}</td>
                    <td className="px-3 py-2 text-gray-600">{b.Unit?.unitNo || b.unitNo || '—'}</td>
                    <td className="px-3 py-2">{b.agreementDate ? new Date(b.agreementDate).toLocaleDateString('en-IN') : b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-700">{b.status || 'active'}</span></td>
                    <td className="px-3 py-2"><button onClick={() => window.print()} className="px-2 py-1 bg-blue-700 text-white rounded text-xs hover:bg-blue-800">Print BBA</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

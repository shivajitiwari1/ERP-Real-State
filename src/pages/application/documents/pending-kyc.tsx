import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function PendingKycPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['bookings', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });

  const KYC_FIELDS = ['PAN No.', 'Aadhaar No.', 'Email', 'Mobile', 'Address'];

  const withKycStatus = (bookings as any[])
    .filter((b: any) => b.status !== 'cancelled')
    .map((b: any) => {
      const app = b.Applicants?.[0] || {};
      const missing = KYC_FIELDS.filter(f => {
        if (f === 'PAN No.') return !app.panNo;
        if (f === 'Aadhaar No.') return !app.aadhaarNo;
        if (f === 'Email') return !app.email;
        if (f === 'Mobile') return !app.mobile && !app.phone;
        if (f === 'Address') return !app.address;
        return false;
      });
      return { ...b, app, missingKyc: missing };
    })
    .filter((b: any) => b.missingKyc.length > 0);

  return (
    <div>
      <PageHeader title="Pending KYC in Booking Form" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <span className="text-xs text-orange-600 font-medium">{withKycStatus.length} bookings with incomplete KYC</span>
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Pending KYC in Booking Form ({withKycStatus.length})</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-blue-900 text-white"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Customer Name</th><th className="px-3 py-2">Unit</th><th className="px-3 py-2">Mobile</th><th className="px-3 py-2">Missing KYC Fields</th><th className="px-3 py-2">Count</th></tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                withKycStatus.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center">
                    <div className="text-green-600 font-medium text-sm">All KYC details complete!</div>
                    <div className="text-gray-400 text-xs mt-1">No bookings with missing KYC found</div>
                  </td></tr>
                ) :
                withKycStatus.map((b: any, i: number) => (
                  <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                    <td className="px-3 py-2">{`${b.app?.firstName || ''} ${b.app?.lastName || ''}`.trim() || '—'}</td>
                    <td className="px-3 py-2 text-gray-600">{b.Unit?.unitNo || b.unitNo || '—'}</td>
                    <td className="px-3 py-2">{b.app?.mobile || b.app?.phone || <span className="text-red-400">Missing</span>}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">{b.missingKyc.map((f: string) => <span key={f} className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">{f}</span>)}</div>
                    </td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">{b.missingKyc.length}</span></td>
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

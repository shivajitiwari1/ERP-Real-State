import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

const STAMP_DUTY_RATE = 0.05;
const REG_CHARGE_RATE = 0.01;

export default function RegistrationChargesPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['reg-charges', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  return (
    <div>
      <PageHeader title="Registration Charges With Stamp Duty" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="ml-auto flex gap-4 text-xs">
            <span className="text-gray-500">Stamp Duty: <strong className="text-purple-700">5%</strong></span>
            <span className="text-gray-500">Reg. Charges: <strong className="text-purple-700">1%</strong></span>
          </div>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase tracking-wide">Registration Charges With Stamp Duty ({(bookings as any[]).length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Reg. No.</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-right">Agreement Value (₹)</th>
              <th className="px-3 py-2 text-right">Stamp Duty 5% (₹)</th>
              <th className="px-3 py-2 text-right">Reg. Charge 1% (₹)</th>
              <th className="px-3 py-2 text-right">Total (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              (bookings as any[]).length === 0 ? <tr><td colSpan={8} className="text-center py-6 text-gray-400">No data found</td></tr> :
              (bookings as any[]).map((b: any, i: number) => {
                const val = Number(b.agreementValue || b.totalAmount || 0);
                const stamp = val * STAMP_DUTY_RATE;
                const reg = val * REG_CHARGE_RATE;
                return (
                  <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-1.5 text-blue-600">{b.registrationNo || '-'}</td>
                    <td className="px-3 py-1.5">{`${b.Applicants?.[0]?.firstName || ''} ${b.Applicants?.[0]?.lastName || ''}`.trim() || '-'}</td>
                    <td className="px-3 py-1.5">{b.Unit?.unitNumber || '-'}</td>
                    <td className="px-3 py-1.5 text-right text-green-600">{val.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-1.5 text-right text-orange-600">{stamp.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-1.5 text-right text-blue-600">{reg.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-1.5 text-right text-purple-700 font-bold">{(val + stamp + reg).toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

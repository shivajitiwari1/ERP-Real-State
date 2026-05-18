import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function UnitSoldAreaWisePage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['inv-area', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  return (
    <div>
      <PageHeader title="Unit Sold/Avail Area Wise" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Unit Sold/Avail Area Wise ({(bookings as any[]).length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Unit No.</th>
              <th className="px-3 py-2 text-left">Tower</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-right">Carpet Area</th>
              <th className="px-3 py-2 text-right">Super Area</th>
              <th className="px-3 py-2 text-right">Agreement Value (₹)</th>
              <th className="px-3 py-2 text-right">Rate/sq.ft (₹)</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={9} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              (bookings as any[]).length === 0 ? <tr><td colSpan={9} className="text-center py-6 text-gray-400">No data found</td></tr> :
              (bookings as any[]).map((b: any, i: number) => {
                const area = Number(b.Unit?.area || 1);
                const val = Number(b.agreementValue || b.totalAmount || 0);
                return (
                  <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-1.5 text-blue-600">{b.Unit?.unitNumber || '-'}</td>
                    <td className="px-3 py-1.5">{b.Unit?.Tower?.name || '-'}</td>
                    <td className="px-3 py-1.5">{b.Unit?.unitType || '-'}</td>
                    <td className="px-3 py-1.5 text-right text-purple-600">{b.Unit?.carpetArea || b.Unit?.area || '-'}</td>
                    <td className="px-3 py-1.5 text-right text-purple-600">{b.Unit?.superArea || b.Unit?.area || '-'}</td>
                    <td className="px-3 py-1.5 text-right text-green-600">{val.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-1.5 text-right text-blue-600">{area > 0 ? Math.round(val / area).toLocaleString('en-IN') : '-'}</td>
                    <td className="px-3 py-1.5"><span className={`px-1.5 py-0.5 rounded text-xs ${(b.Unit?.status || 'available') === 'sold' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{b.Unit?.status || 'available'}</span></td>
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

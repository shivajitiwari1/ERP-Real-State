import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

const GST = 0.18;

export default function DuesBrokerWiseTaxPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['stax-dues-broker-wise', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const brokerDemands = (demands as any[]).filter((d: any) => d.Booking?.brokerId || d.Booking?.Broker);

  return (
    <div>
      <PageHeader title="Broker Wise Due (Tax)" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Broker Wise Due (Tax) ({brokerDemands.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Broker</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-right">Base (₹)</th>
              <th className="px-3 py-2 text-right">GST 18% (₹)</th>
              <th className="px-3 py-2 text-right">Total (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              brokerDemands.length === 0 ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">No broker demands found</td></tr> :
              brokerDemands.map((d: any, i: number) => {
                const amt = Number(d.totalAmount || d.amount || 0); const gst = amt * GST;
                return (
                  <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-1.5 text-blue-600">{d.Booking?.Broker?.name || d.Booking?.brokerName || '-'}</td>
                    <td className="px-3 py-1.5">{`${d.Booking?.Applicants?.[0]?.firstName || ''} ${d.Booking?.Applicants?.[0]?.lastName || ''}`.trim() || '-'}</td>
                    <td className="px-3 py-1.5">{d.Booking?.Unit?.unitNumber || '-'}</td>
                    <td className="px-3 py-1.5 text-right text-green-600">{amt.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-1.5 text-right text-orange-600">{gst.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-1.5 text-right text-purple-600 font-bold">{(amt + gst).toLocaleString('en-IN')}</td>
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

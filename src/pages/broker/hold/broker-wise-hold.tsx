import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function BrokerWiseHoldPage() {
  const { data: heldUnits = [], isLoading } = useQuery<any[]>({ queryKey: ['held-units'], queryFn: () => axios.get('/api/broker/held-units').then(r => r.data.data) });

  const grouped: Record<string, { brokerName: string; units: any[] }> = {};
  (heldUnits as any[]).forEach((h: any) => {
    const key = h.Broker?.id || h.brokerId || 'unknown';
    const brokerName = h.Broker?.name || h.brokerName || 'Unknown';
    if (!grouped[key]) grouped[key] = { brokerName, units: [] };
    grouped[key].units.push(h);
  });
  const rows = Object.values(grouped);

  return (
    <div>
      <PageHeader title="Broker Wise Hold" />
      <div className="space-y-4">
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Broker Wise Hold ({rows.length} brokers)</div>
          {isLoading ? <div className="p-8 text-center text-gray-400 text-sm">Loading...</div> :
          rows.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No held units found</div> :
          rows.map((r, gi) => (
            <div key={gi} className="border-b last:border-b-0">
              <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-purple-700">{r.brokerName} — {r.units.length} unit(s) held</div>
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-slate-100">
                  <th className="px-3 py-1.5 text-left">Unit No.</th>
                  <th className="px-3 py-1.5 text-left">Tower</th>
                  <th className="px-3 py-1.5 text-left">Type</th>
                  <th className="px-3 py-1.5 text-right">Area</th>
                  <th className="px-3 py-1.5 text-left">Hold Date</th>
                  <th className="px-3 py-1.5 text-left">Expiry</th>
                  <th className="px-3 py-1.5 text-left">Status</th>
                </tr></thead>
                <tbody>
                  {r.units.map((u: any, i: number) => (
                    <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-1.5 text-blue-600">{u.Unit?.unitNumber || '-'}</td>
                      <td className="px-3 py-1.5">{u.Unit?.Tower?.name || '-'}</td>
                      <td className="px-3 py-1.5">{u.Unit?.unitType || '-'}</td>
                      <td className="px-3 py-1.5 text-right text-purple-600">{u.Unit?.area || '-'}</td>
                      <td className="px-3 py-1.5">{u.holdDate?.split('T')[0] || '-'}</td>
                      <td className="px-3 py-1.5">{u.expiryDate?.split('T')[0] || '-'}</td>
                      <td className="px-3 py-1.5"><span className={`px-1.5 py-0.5 rounded text-xs ${u.status === 'active' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>{u.status || 'held'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

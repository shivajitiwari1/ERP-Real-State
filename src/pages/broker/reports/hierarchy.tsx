import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function BrokerHierarchyPage() {
  const { data: brokers = [], isLoading } = useQuery<any[]>({ queryKey: ['brokers-hierarchy'], queryFn: () => axios.get('/api/broker/index').then(r => r.data.data) });

  const parentBrokers = (brokers as any[]).filter((b: any) => !b.parentBrokerId && !b.parentId);
  const subBrokers = (brokers as any[]).filter((b: any) => b.parentBrokerId || b.parentId);

  const subCount: Record<string, number> = {};
  subBrokers.forEach((b: any) => {
    const pid = b.parentBrokerId || b.parentId;
    subCount[pid] = (subCount[pid] || 0) + 1;
  });

  return (
    <div>
      <PageHeader title="Broker Hierarchy" />
      <div className="space-y-4">
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Broker Hierarchy ({parentBrokers.length} parent brokers)</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-800 text-white">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Broker Name</th>
              <th className="px-3 py-2 text-left">Company</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-right">Sub-Brokers</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              parentBrokers.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">No data found</td></tr> :
              parentBrokers.map((b: any, i: number) => (
                <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium text-blue-600">{b.name || '-'}</td>
                  <td className="px-3 py-1.5">{b.companyName || '-'}</td>
                  <td className="px-3 py-1.5">{b.phone || b.mobile || '-'}</td>
                  <td className="px-3 py-1.5 text-right"><span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700 font-bold">{subCount[b.id] || 0}</span></td>
                  <td className="px-3 py-1.5"><span className={`px-1.5 py-0.5 rounded text-xs ${b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{b.status || 'active'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

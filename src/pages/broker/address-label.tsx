import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function BrokerAddressLabelPage() {
  const { data: brokers = [], isLoading } = useQuery<any[]>({ queryKey: ['brokers'], queryFn: () => axios.get('/api/broker/index').then(r => r.data.data) });

  return (
    <div>
      <PageHeader title="Broker Address Label" />
      <div className="space-y-4">
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Broker Address Labels ({(brokers as any[]).length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Broker Name</th>
              <th className="px-3 py-2 text-left">Company</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">City</th>
              <th className="px-3 py-2 text-left">Address</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              (brokers as any[]).length === 0 ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">No brokers found</td></tr> :
              (brokers as any[]).map((b: any, i: number) => (
                <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium text-blue-600">{b.name || '-'}</td>
                  <td className="px-3 py-1.5">{b.companyName || '-'}</td>
                  <td className="px-3 py-1.5">{b.phone || b.mobile || '-'}</td>
                  <td className="px-3 py-1.5">{b.email || '-'}</td>
                  <td className="px-3 py-1.5 text-purple-600">{b.city || '-'}</td>
                  <td className="px-3 py-1.5 text-gray-600 max-w-xs truncate">{[b.address, b.area, b.state, b.pincode].filter(Boolean).join(', ') || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

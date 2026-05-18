import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function EditAddressPage() {
  const [search, setSearch] = useState('');
  const { data: bookings = [], isLoading } = useQuery<any[]>({
    queryKey: ['bookings'],
    queryFn: () => axios.get('/api/application/bookings').then(r => r.data.data),
  });

  const filtered = (bookings as any[]).filter((b: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const a = b.Applicants?.[0];
    return (
      (b.registrationNo || '').toLowerCase().includes(q) ||
      (a ? `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) : false) ||
      (a?.city || '').toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <PageHeader title="Edit Customer Address" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <input
            type="text"
            placeholder="Search by name, registration no. or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 h-9 text-sm w-full max-w-sm"
          />
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
            Customer Address List ({filtered.length})
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-purple-700 text-white">
                <th className="px-3 py-2">S.No.</th>
                <th className="px-3 py-2">Reg. No.</th>
                <th className="px-3 py-2">Customer Name</th>
                <th className="px-3 py-2">Mobile</th>
                <th className="px-3 py-2">Address</th>
                <th className="px-3 py-2">City</th>
                <th className="px-3 py-2">State</th>
                <th className="px-3 py-2">PIN</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-6 text-gray-400 italic">No customers found</td></tr>
              ) : filtered.map((b: any, i: number) => {
                const a = b.Applicants?.[0];
                return (
                  <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                    <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                    <td className="px-3 py-2">{a?.mobile || '—'}</td>
                    <td className="px-3 py-2 max-w-[180px] truncate">{a?.address || '—'}</td>
                    <td className="px-3 py-2">{a?.city || '—'}</td>
                    <td className="px-3 py-2">{a?.state || '—'}</td>
                    <td className="px-3 py-2">{a?.pincode || '—'}</td>
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

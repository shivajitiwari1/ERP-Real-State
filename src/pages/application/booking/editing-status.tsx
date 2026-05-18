import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function EditingStatusPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const { data: bookings = [], isLoading } = useQuery<any[]>({
    queryKey: ['bookings'],
    queryFn: () => axios.get('/api/application/bookings').then(r => r.data.data),
  });
  const filtered = (bookings as any[]).filter((b: any) => {
    if (!from && !to) return true;
    const d = new Date(b.updatedAt || b.bookingDate);
    if (from && d < new Date(from)) return false;
    if (to && d > new Date(to)) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title="Editing Status" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex flex-wrap gap-3 items-center">
          <label className="text-xs text-gray-500">From:</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border rounded px-2 h-9 text-sm" />
          <label className="text-xs text-gray-500">To:</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border rounded px-2 h-9 text-sm" />
          {(from || to) && (
            <button onClick={() => { setFrom(''); setTo(''); }} className="text-xs text-blue-600 underline">Clear</button>
          )}
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
            Editing Status ({filtered.length} records)
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-purple-700 text-white">
                <th className="px-3 py-2">S.No.</th>
                <th className="px-3 py-2">Reg. No.</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Project</th>
                <th className="px-3 py-2">Last Edited</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-6 text-gray-400 italic">No editing records found</td></tr>
              ) : filtered.map((b: any, i: number) => {
                const a = b.Applicants?.[0];
                return (
                  <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                    <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                    <td className="px-3 py-2">{b.Project?.name || '—'}</td>
                    <td className="px-3 py-2">{b.updatedAt ? new Date(b.updatedAt).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {b.status}
                      </span>
                    </td>
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

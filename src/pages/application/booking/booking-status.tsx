import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function BookingStatusPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const { data: bookings = [], isLoading } = useQuery<any[]>({
    queryKey: ['bookings'],
    queryFn: () => axios.get('/api/application/bookings').then(r => r.data.data),
  });
  const filtered = (bookings as any[]).filter((b: any) => {
    if (!from && !to) return true;
    const d = new Date(b.bookingDate);
    if (from && d < new Date(from)) return false;
    if (to && d > new Date(to)) return false;
    return true;
  });
  const counts = { active: 0, cancelled: 0, transferred: 0, surrendered: 0 };
  filtered.forEach((b: any) => {
    if (counts[b.status as keyof typeof counts] !== undefined)
      counts[b.status as keyof typeof counts]++;
  });

  return (
    <div>
      <PageHeader title="Booking Status" />
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(counts).map(([s, c]) => (
            <div key={s} className="bg-white border rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{c}</div>
              <div className="text-xs text-gray-500 mt-1 capitalize">{s}</div>
            </div>
          ))}
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
            Booking Status ({filtered.length})
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-purple-700 text-white">
                <th className="px-3 py-2">S.No.</th>
                <th className="px-3 py-2">Reg. No.</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Project</th>
                <th className="px-3 py-2">Booking Date</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-6 text-gray-400 italic">No bookings found</td></tr>
              ) : filtered.map((b: any, i: number) => {
                const a = b.Applicants?.[0];
                return (
                  <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                    <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                    <td className="px-3 py-2">{b.Project?.name || '—'}</td>
                    <td className="px-3 py-2">{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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

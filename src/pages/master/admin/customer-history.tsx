import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function CustomerHistoryPage() {
  const [search, setSearch] = useState('');
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['bookings-history'], queryFn: () => axios.get('/api/application/bookings').then(r => r.data.data) });

  const filtered = (bookings as any[]).filter((b: any) => {
    if (!search) return true;
    const applicant = b.Applicants?.[0];
    const name = `${applicant?.firstName || ''} ${applicant?.lastName || ''}`.toLowerCase();
    return name.includes(search.toLowerCase()) || (b.registrationNo || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <PageHeader title="Customer History" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or registration no..." className="border rounded px-3 h-9 text-sm w-80" />
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">Customer History ({filtered.length})</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-slate-100"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Customer Name</th><th className="px-3 py-2">Project</th><th className="px-3 py-2">Booking Date</th><th className="px-3 py-2">Status</th></tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-gray-400 italic">No records found</td></tr> :
                filtered.map((b: any, i: number) => {
                  const a = b.Applicants?.[0];
                  return (
                    <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                      <td className="px-3 py-2">{a ? `${a.salutation || ''} ${a.firstName} ${a.lastName}` : '—'}</td>
                      <td className="px-3 py-2">{b.Project?.name || '—'}</td>
                      <td className="px-3 py-2">{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${b.status === 'active' ? 'bg-green-100 text-green-700' : b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

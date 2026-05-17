import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function UnitShiftReportPage() {
  const { data: bookings = [], isLoading } = useQuery<any[]>({
    queryKey: ['bookings'],
    queryFn: () => axios.get('/api/application/bookings').then(r => r.data.data),
  });
  return (
    <div>
      <PageHeader title="Unit Shift Report" />
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">
          Unit Shift Report ({(bookings as any[]).length} bookings)
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-3 py-2">S.No.</th>
              <th className="px-3 py-2">Reg. No.</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Project</th>
              <th className="px-3 py-2">Old Unit</th>
              <th className="px-3 py-2">New Unit</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr>
            ) : (bookings as any[]).length === 0 ? (
              <tr><td colSpan={7} className="text-center py-6 text-gray-400 italic">No unit shift records found</td></tr>
            ) : (bookings as any[]).map((b: any, i: number) => {
              const a = b.Applicants?.[0];
              return (
                <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                  <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                  <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                  <td className="px-3 py-2">{b.Project?.name || '—'}</td>
                  <td className="px-3 py-2 text-gray-500">{b.Unit?.unitNumber || '—'}</td>
                  <td className="px-3 py-2 text-gray-500">—</td>
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
  );
}

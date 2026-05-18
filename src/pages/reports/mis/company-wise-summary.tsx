import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function CompanyWiseSummaryPage() {
  const { data: projects = [], isLoading } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [] } = useQuery<any[]>({ queryKey: ['bookings-all'], queryFn: () => axios.get('/api/application/bookings').then(r => r.data.data) });

  const grouped: Record<string, { count: number; projectCount: number; bookings: number; value: number }> = {};
  (projects as any[]).forEach((p: any) => {
    const company = p.companyName || p.Company?.name || 'Unknown';
    if (!grouped[company]) grouped[company] = { count: 0, projectCount: 0, bookings: 0, value: 0 };
    grouped[company].projectCount++;
  });
  (bookings as any[]).forEach((b: any) => {
    const company = b.Project?.companyName || b.Project?.Company?.name || 'Unknown';
    if (!grouped[company]) grouped[company] = { count: 0, projectCount: 0, bookings: 0, value: 0 };
    grouped[company].bookings++;
    grouped[company].value += Number(b.agreementValue || b.totalAmount || 0);
  });
  const rows = Object.entries(grouped).map(([company, d]) => ({ company, ...d }));

  return (
    <div>
      <PageHeader title="Company Wise Summary" />
      <div className="space-y-4">
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Company Wise Summary ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-800 text-white">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Company</th>
              <th className="px-3 py-2 text-right">Projects</th>
              <th className="px-3 py-2 text-right">Bookings</th>
              <th className="px-3 py-2 text-right">Total Value (₹)</th>
              <th className="px-3 py-2 text-right">Avg. Per Booking (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.company} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.company}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{r.projectCount}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{r.bookings}</td>
                  <td className="px-3 py-1.5 text-right text-green-600 font-bold">{r.value.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{r.bookings > 0 ? Math.round(r.value / r.bookings).toLocaleString('en-IN') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function HoldingReportPage() {
  const { data: holdingCharges = [], isLoading } = useQuery<any[]>({ queryKey: ['holding-charges'], queryFn: () => axios.get('/api/possession/holding-charge').then(r => r.data.data) });

  return (
    <div>
      <PageHeader title="Holding Charge Report" />
      <div className="space-y-4">
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Holding Charge Report ({(holdingCharges as any[]).length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-left">Project</th>
              <th className="px-3 py-2 text-left">From Date</th>
              <th className="px-3 py-2 text-left">To Date</th>
              <th className="px-3 py-2 text-right">Rate/Day (₹)</th>
              <th className="px-3 py-2 text-right">Days</th>
              <th className="px-3 py-2 text-right">Total Charge (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={9} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              (holdingCharges as any[]).length === 0 ? <tr><td colSpan={9} className="text-center py-6 text-gray-400">No holding charges found</td></tr> :
              (holdingCharges as any[]).map((h: any, i: number) => (
                <tr key={h.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5">{`${h.Booking?.Applicants?.[0]?.firstName || ''} ${h.Booking?.Applicants?.[0]?.lastName || ''}`.trim() || '-'}</td>
                  <td className="px-3 py-1.5">{h.Unit?.unitNumber || h.Booking?.Unit?.unitNumber || '-'}</td>
                  <td className="px-3 py-1.5">{h.Project?.name || '-'}</td>
                  <td className="px-3 py-1.5">{h.fromDate?.split('T')[0] || '-'}</td>
                  <td className="px-3 py-1.5">{h.toDate?.split('T')[0] || '-'}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{Number(h.ratePerDay || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{h.days || '-'}</td>
                  <td className="px-3 py-1.5 text-right text-green-600 font-bold">{Number(h.totalCharge || h.amount || 0).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

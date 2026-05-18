import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function PenaltyReportPage() {
  const { data: possessions = [], isLoading } = useQuery<any[]>({ queryKey: ['possession-list'], queryFn: () => axios.get('/api/possession/index').then(r => r.data.data) });
  const withPenalty = (possessions as any[]).filter((p: any) => Number(p.penaltyAmount || p.penalty || 0) > 0);

  return (
    <div>
      <PageHeader title="Penalty Report" />
      <div className="space-y-4">
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase tracking-wide">Penalty Report ({withPenalty.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Reg. No.</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-left">Project</th>
              <th className="px-3 py-2 text-left">Possession Date</th>
              <th className="px-3 py-2 text-right">Penalty (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              withPenalty.length === 0 ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">No penalty records found</td></tr> :
              withPenalty.map((p: any, i: number) => (
                <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 text-blue-600">{p.Booking?.registrationNo || '-'}</td>
                  <td className="px-3 py-1.5">{`${p.Booking?.Applicants?.[0]?.firstName || ''} ${p.Booking?.Applicants?.[0]?.lastName || ''}`.trim() || '-'}</td>
                  <td className="px-3 py-1.5">{p.Unit?.unitNumber || p.Booking?.Unit?.unitNumber || '-'}</td>
                  <td className="px-3 py-1.5">{p.Project?.name || p.Booking?.Project?.name || '-'}</td>
                  <td className="px-3 py-1.5">{p.possessionDate?.split('T')[0] || '-'}</td>
                  <td className="px-3 py-1.5 text-right text-red-600 font-bold">{Number(p.penaltyAmount || p.penalty || 0).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

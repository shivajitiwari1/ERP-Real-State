import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  transferred: 'bg-blue-100 text-blue-700',
  surrendered: 'bg-yellow-100 text-yellow-700',
};

export default function BookingListPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings', selectedProject],
    queryFn: () => axios.get(`/api/application/bookings?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });

  const primaryName = (booking: any) => {
    const p = booking.Applicants?.[0];
    return p ? `${p.firstName} ${p.lastName}` : '-';
  };

  return (
    <div>
      <PageHeader title="Customer Register / Booking List" />
      <div className="bg-white p-4 rounded border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <select className="border rounded px-3 py-2 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <Link href="/application/booking/new">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">+ New Booking</Button>
          </Link>
          <span className="text-xs text-gray-500 ml-auto">{(bookings as any[]).length} bookings</span>
        </div>
        {isLoading && <p className="text-sm text-gray-400">Loading...</p>}
        <div className="overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">
              {['#', 'Reg. No.', 'Customer Name', 'Unit', 'Booking Date', 'Plan', 'Basic Price', 'Status', 'Action'].map(h => (
                <th key={h} className="px-2 py-2 text-left">{h}</th>
              ))}
            </tr></thead>
            <tbody>{(bookings as any[]).map((b: any, i) => (
              <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i + 1}</td>
                <td className="px-2 py-2 font-medium text-blue-600">{b.registrationNo}</td>
                <td className="px-2 py-2">{primaryName(b)}</td>
                <td className="px-2 py-2">{b.Unit?.unitNumber || '-'}</td>
                <td className="px-2 py-2">{b.bookingDate}</td>
                <td className="px-2 py-2">{b.PaymentPlan?.name || '-'}</td>
                <td className="px-2 py-2 text-right">₹{Number(b.basicPrice).toLocaleString('en-IN')}</td>
                <td className="px-2 py-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[b.status] || 'bg-gray-100'}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <Link href={`/application/booking/${b.id}`}>
                    <Button size="sm" variant="outline" className="h-6 text-xs px-2">View</Button>
                  </Link>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

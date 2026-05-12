import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import ReportTable from '@/components/shared/ReportTable';

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-100 text-green-700', booked: 'bg-blue-100 text-blue-700',
  sold: 'bg-purple-100 text-purple-700', cancelled: 'bg-red-100 text-red-700', held: 'bg-yellow-100 text-yellow-700',
};

export default function UnitStatusPage() {
  const [projectId, setProjectId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: units = [], isLoading } = useQuery({
    queryKey: ['report-units', projectId, statusFilter],
    queryFn: () => axios.get(`/api/reports/inventory?projectId=${projectId}&status=${statusFilter}`).then(r => r.data.data),
    enabled: !!projectId,
  });
  const { data: summary } = useQuery({
    queryKey: ['report-units-summary', projectId],
    queryFn: () => axios.get(`/api/reports/inventory?projectId=${projectId}&type=summary`).then(r => r.data.data),
    enabled: !!projectId,
  });

  const columns = [
    { header: 'Tower', accessor: (r: any) => r.Tower?.name || '-' },
    { header: 'Floor', accessor: (r: any) => r.Floor?.floorName || '-' },
    { header: 'Unit No.', accessor: 'unitNumber' },
    { header: 'Unit Type', accessor: (r: any) => r.UnitType?.name || '-' },
    { header: 'Area (sq.ft)', accessor: (r: any) => r.area || '-', align: 'right' as const },
    { header: 'Status', accessor: (r: any) => <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[r.status]||'bg-gray-100'}`}>{r.status}</span>, csvValue: (r: any) => r.status },
    { header: 'Customer', accessor: (r: any) => r.Bookings?.[0]?.Applicants?.[0] ? `${r.Bookings[0].Applicants[0].firstName} ${r.Bookings[0].Applicants[0].lastName}` : '-' },
    { header: 'Reg. No.', accessor: (r: any) => r.Bookings?.[0]?.registrationNo || '-' },
    { header: 'Booking Date', accessor: (r: any) => r.Bookings?.[0]?.bookingDate || '-' },
  ];

  return (
    <div>
      <PageHeader title="Unit Status Report" />
      <div className="bg-white p-4 rounded border shadow-sm mb-4">
        <div className="flex gap-3 flex-wrap items-end">
          <div>
            <label className="text-xs text-gray-500">Project *</label>
            <select className="block border rounded px-3 py-2 text-sm mt-1" value={projectId} onChange={e => setProjectId(e.target.value)}>
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Status</label>
            <select className="block border rounded px-3 py-2 text-sm mt-1" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="sold">Sold</option>
              <option value="cancelled">Cancelled</option>
              <option value="held">Held</option>
            </select>
          </div>
        </div>
        {summary && (
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
            {['available', 'booked', 'sold', 'cancelled', 'held', 'total'].map(k => (
              <div key={k} className="border rounded p-2 text-center">
                <p className="text-gray-500 capitalize">{k}</p>
                <p className="font-bold text-lg text-slate-700">{(summary as any)[k] ?? 0}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <ReportTable title="Unit Status" columns={columns} data={units as any[]} filename="unit_status" isLoading={isLoading} />
    </div>
  );
}

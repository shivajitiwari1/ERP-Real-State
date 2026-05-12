import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import ReportTable from '@/components/shared/ReportTable';
import { Input } from '@/components/ui/input';

export default function SalesReportPage() {
  const [projectId, setProjectId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['report-sales', projectId, fromDate, toDate],
    queryFn: () => axios.get(`/api/reports/sales?projectId=${projectId}&fromDate=${fromDate}&toDate=${toDate}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  const totalSales = (bookings as any[]).reduce((s, b) => s + Number(b.basicPrice), 0);

  const columns = [
    { header: 'Reg. No.', accessor: 'registrationNo' },
    { header: 'Booking Date', accessor: 'bookingDate' },
    { header: 'Customer', accessor: (r: any) => `${r.Applicants?.[0]?.firstName || ''} ${r.Applicants?.[0]?.lastName || ''}`.trim() },
    { header: 'Tower', accessor: (r: any) => r.Unit?.Tower?.name || '-' },
    { header: 'Unit No.', accessor: (r: any) => r.Unit?.unitNumber || '-' },
    { header: 'Unit Type', accessor: (r: any) => r.Unit?.UnitType?.name || '-' },
    { header: 'Area', accessor: (r: any) => r.Unit?.area || '-', align: 'right' as const },
    { header: 'Rate/sqft', accessor: (r: any) => Number(r.perSqft).toLocaleString('en-IN'), align: 'right' as const, csvValue: (r: any) => r.perSqft },
    { header: 'Basic Price (₹)', accessor: (r: any) => Number(r.basicPrice).toLocaleString('en-IN'), align: 'right' as const, csvValue: (r: any) => r.basicPrice },
    { header: 'Discount (₹)', accessor: (r: any) => Number((r.inauguralDiscount || 0) + (r.companyDiscount || 0)).toLocaleString('en-IN'), align: 'right' as const, csvValue: (r: any) => Number(r.inauguralDiscount || 0) + Number(r.companyDiscount || 0) },
    { header: 'Status', accessor: 'status' },
  ];

  return (
    <div>
      <PageHeader title="Cumulative Sales Report" />
      <div className="bg-white p-4 rounded border shadow-sm mb-4">
        <div className="flex gap-3 flex-wrap items-end">
          <div><label className="text-xs text-gray-500">Project *</label>
            <select className="block border rounded px-3 py-2 text-sm mt-1" value={projectId} onChange={e => setProjectId(e.target.value)}>
              <option value="">-- Select --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-gray-500">From</label><Input type="date" className="mt-1 h-9 text-sm w-40" value={fromDate} onChange={e => setFromDate(e.target.value)} /></div>
          <div><label className="text-xs text-gray-500">To</label><Input type="date" className="mt-1 h-9 text-sm w-40" value={toDate} onChange={e => setToDate(e.target.value)} /></div>
        </div>
        {(bookings as any[]).length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="border rounded p-2 text-center"><p className="text-gray-500">Bookings</p><p className="font-bold text-xl">{(bookings as any[]).length}</p></div>
            <div className="border rounded p-2 text-center bg-green-50"><p className="text-gray-500">Total Sales</p><p className="font-bold text-xl text-green-700">₹{totalSales.toLocaleString('en-IN')}</p></div>
          </div>
        )}
      </div>
      <ReportTable title="Sales Report" columns={columns} data={bookings as any[]} filename="sales_report" isLoading={isLoading} />
    </div>
  );
}

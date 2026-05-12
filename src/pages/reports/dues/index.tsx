import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import ReportTable from '@/components/shared/ReportTable';
import { Input } from '@/components/ui/input';

export default function DueReportPage() {
  const [projectId, setProjectId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery({
    queryKey: ['report-dues', projectId, fromDate, toDate],
    queryFn: () => axios.get(`/api/reports/dues?projectId=${projectId}&fromDate=${fromDate}&toDate=${toDate}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  const totalDue = (demands as any[]).reduce((s, d) => s + Number(d.totalAmount), 0);

  const columns = [
    { header: 'Reg. No.', accessor: (r: any) => r.Booking?.registrationNo || '-' },
    { header: 'Customer', accessor: (r: any) => `${r.Booking?.Applicants?.[0]?.firstName || ''} ${r.Booking?.Applicants?.[0]?.lastName || ''}`.trim() },
    { header: 'Unit', accessor: (r: any) => r.Booking?.Unit?.unitNumber || '-' },
    { header: 'Installment', accessor: (r: any) => r.Installment?.name || r.PaymentStage?.name || '-' },
    { header: 'Demand Date', accessor: 'demandDate' },
    { header: 'Due Date', accessor: (r: any) => r.dueDate || '-' },
    { header: 'Amount (₹)', accessor: (r: any) => Number(r.amount).toLocaleString('en-IN'), align: 'right' as const, csvValue: (r: any) => r.amount },
    { header: 'Tax (₹)', accessor: (r: any) => Number(r.taxAmount).toLocaleString('en-IN'), align: 'right' as const, csvValue: (r: any) => r.taxAmount },
    { header: 'Total Due (₹)', accessor: (r: any) => Number(r.totalAmount).toLocaleString('en-IN'), align: 'right' as const, csvValue: (r: any) => r.totalAmount },
    { header: 'Status', accessor: (r: any) => <span className={`px-1.5 py-0.5 rounded text-xs ${r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : r.status === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span>, csvValue: (r: any) => r.status },
  ];

  return (
    <div>
      <PageHeader title="Due Report" />
      <div className="bg-white p-4 rounded border shadow-sm mb-4">
        <div className="flex gap-3 flex-wrap items-end">
          <div><label className="text-xs text-gray-500">Project *</label>
            <select className="block border rounded px-3 py-2 text-sm mt-1" value={projectId} onChange={e => setProjectId(e.target.value)}>
              <option value="">-- Select --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-gray-500">Due From</label><Input type="date" className="mt-1 h-9 text-sm w-40" value={fromDate} onChange={e => setFromDate(e.target.value)} /></div>
          <div><label className="text-xs text-gray-500">Due To</label><Input type="date" className="mt-1 h-9 text-sm w-40" value={toDate} onChange={e => setToDate(e.target.value)} /></div>
        </div>
        {(demands as any[]).length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="border rounded p-2 text-center"><p className="text-gray-500">Total Demands</p><p className="font-bold text-xl">{(demands as any[]).length}</p></div>
            <div className="border rounded p-2 text-center bg-red-50"><p className="text-gray-500">Total Outstanding</p><p className="font-bold text-xl text-red-700">₹{totalDue.toLocaleString('en-IN')}</p></div>
          </div>
        )}
      </div>
      <ReportTable title="Due Report" columns={columns} data={demands as any[]} filename="due_report" isLoading={isLoading} />
    </div>
  );
}

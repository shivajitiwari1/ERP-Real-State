import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import ReportTable from '@/components/shared/ReportTable';
import { Input } from '@/components/ui/input';

export default function CollectionReportPage() {
  const [projectId, setProjectId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [mode, setMode] = useState('');

  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: receipts = [], isLoading } = useQuery({
    queryKey: ['report-collection', projectId, fromDate, toDate, mode],
    queryFn: () => axios.get(`/api/reports/collection?projectId=${projectId}&fromDate=${fromDate}&toDate=${toDate}&paymentMode=${mode}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  const total = (receipts as any[]).reduce((s, r) => s + Number(r.totalAmount), 0);

  const columns = [
    { header: 'Receipt No.', accessor: 'receiptNo' },
    { header: 'Date', accessor: 'receiptDate' },
    { header: 'Reg. No.', accessor: (r: any) => r.Booking?.registrationNo || '-' },
    { header: 'Customer', accessor: (r: any) => `${r.Booking?.Applicants?.[0]?.firstName || ''} ${r.Booking?.Applicants?.[0]?.lastName || ''}`.trim() || '-' },
    { header: 'Unit', accessor: (r: any) => r.Booking?.Unit?.unitNumber || '-' },
    { header: 'Mode', accessor: 'paymentMode' },
    { header: 'Type', accessor: 'receiptType' },
    { header: 'Amount (₹)', accessor: (r: any) => Number(r.amount).toLocaleString('en-IN'), align: 'right' as const, csvValue: (r: any) => r.amount },
    { header: 'Penalty (₹)', accessor: (r: any) => Number(r.penaltyAmount || 0).toLocaleString('en-IN'), align: 'right' as const, csvValue: (r: any) => r.penaltyAmount || 0 },
    { header: 'Total (₹)', accessor: (r: any) => Number(r.totalAmount).toLocaleString('en-IN'), align: 'right' as const, csvValue: (r: any) => r.totalAmount },
  ];

  return (
    <div>
      <PageHeader title="Collection Report" />
      <div className="bg-white p-4 rounded border shadow-sm mb-4">
        <div className="flex gap-3 flex-wrap items-end">
          <div><label className="text-xs text-gray-500">Project *</label>
            <select className="block border rounded px-3 py-2 text-sm mt-1" value={projectId} onChange={e => setProjectId(e.target.value)}>
              <option value="">-- Select --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-gray-500">From Date</label><Input type="date" className="mt-1 h-9 text-sm w-40" value={fromDate} onChange={e => setFromDate(e.target.value)} /></div>
          <div><label className="text-xs text-gray-500">To Date</label><Input type="date" className="mt-1 h-9 text-sm w-40" value={toDate} onChange={e => setToDate(e.target.value)} /></div>
          <div><label className="text-xs text-gray-500">Payment Mode</label>
            <select className="block border rounded px-3 py-2 text-sm mt-1" value={mode} onChange={e => setMode(e.target.value)}>
              <option value="">All Modes</option>
              {['cash','cheque','online','neft','rtgs','dd'].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
            </select>
          </div>
        </div>
        {(receipts as any[]).length > 0 && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="border rounded p-2 text-center"><p className="text-gray-500">Total Receipts</p><p className="font-bold text-xl">{(receipts as any[]).length}</p></div>
            <div className="border rounded p-2 text-center bg-green-50"><p className="text-gray-500">Total Collection</p><p className="font-bold text-xl text-green-700">₹{total.toLocaleString('en-IN')}</p></div>
          </div>
        )}
      </div>
      <ReportTable title="Collection Report" columns={columns} data={receipts as any[]} filename="collection_report" isLoading={isLoading} />
    </div>
  );
}

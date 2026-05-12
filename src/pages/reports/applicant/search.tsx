import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReportTable from '@/components/shared/ReportTable';

export default function SearchCustomerPage() {
  const [projectId, setProjectId] = useState('');
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['report-customers', projectId, searchQuery],
    queryFn: () => axios.get(`/api/reports/customers?projectId=${projectId}&search=${searchQuery}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  const columns = [
    { header: 'Reg. No.', accessor: (r: any) => r.registrationNo },
    { header: 'Customer Name', accessor: (r: any) => `${r.Applicants?.[0]?.firstName || ''} ${r.Applicants?.[0]?.lastName || ''}`.trim() },
    { header: 'Mobile', accessor: (r: any) => r.Applicants?.[0]?.ApplicantAddresses?.[0]?.mobile1 || '-' },
    { header: 'Email', accessor: (r: any) => r.Applicants?.[0]?.email1 || '-' },
    { header: 'Unit', accessor: (r: any) => r.Unit?.unitNumber || '-' },
    { header: 'Booking Date', accessor: 'bookingDate' },
    { header: 'Status', accessor: (r: any) => <span className={`px-1.5 py-0.5 rounded text-xs ${r.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span>, csvValue: (r: any) => r.status },
    { header: 'Basic Price (₹)', accessor: (r: any) => Number(r.basicPrice).toLocaleString('en-IN'), align: 'right' as const, csvValue: (r: any) => r.basicPrice },
  ];

  return (
    <div>
      <PageHeader title="Search Customer" />
      <div className="bg-white p-4 rounded border shadow-sm mb-4">
        <div className="flex gap-3 flex-wrap items-end">
          <div><label className="text-xs text-gray-500">Project *</label>
            <select className="block border rounded px-3 py-2 text-sm mt-1" value={projectId} onChange={e => setProjectId(e.target.value)}>
              <option value="">-- Select --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-gray-500">Search (Name / PAN / Email)</label>
            <div className="flex gap-2 mt-1">
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Enter name, PAN, or email" className="h-9 text-sm w-64" onKeyDown={e => e.key === 'Enter' && setSearchQuery(search)} />
              <Button size="sm" onClick={() => setSearchQuery(search)} className="bg-blue-600 hover:bg-blue-700">Search</Button>
              <Button size="sm" variant="outline" onClick={() => { setSearch(''); setSearchQuery(''); }}>Clear</Button>
            </div>
          </div>
        </div>
      </div>
      <ReportTable title="Customer Search Results" columns={columns} data={bookings as any[]} filename="customer_search" isLoading={isLoading} />
    </div>
  );
}

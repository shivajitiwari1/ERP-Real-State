import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';

export default function ReceiptListPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: receipts = [], isLoading } = useQuery({
    queryKey: ['receipts', selectedProject],
    queryFn: () => axios.get(`/api/application/receipts?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });
  const total = (receipts as any[]).reduce((s, r) => s + Number(r.totalAmount), 0);

  return (
    <div>
      <PageHeader title="Receipt Register" />
      <div className="bg-white p-4 rounded border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <select className="border rounded px-3 py-2 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <Link href="/application/receipts/new">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">+ New Receipt</Button>
          </Link>
          {(receipts as any[]).length > 0 && <span className="ml-auto text-xs text-slate-600 font-semibold">Total: ₹{total.toLocaleString('en-IN')}</span>}
        </div>
        <table className="w-full text-xs border-collapse">
          <thead><tr className="bg-purple-700 text-white">{['#','Receipt No.','Date','Customer','Unit','Mode','Amount','Type','Status'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>{isLoading ? <tr><td colSpan={9} className="text-center py-8 text-gray-400">Loading...</td></tr> : (receipts as any[]).map((r: any, i) => (
            <tr key={r.id} className={`${i%2===0?'bg-white':'bg-gray-50'} ${r.isCancelled?'line-through opacity-50':''}`}>
              <td className="px-2 py-2 text-gray-400">{i+1}</td>
              <td className="px-2 py-2 font-medium">{r.receiptNo}</td>
              <td className="px-2 py-2">{r.receiptDate}</td>
              <td className="px-2 py-2">{r.Booking?.Applicants?.[0]?.firstName} {r.Booking?.Applicants?.[0]?.lastName}</td>
              <td className="px-2 py-2">{r.Booking?.Unit?.unitNumber || '-'}</td>
              <td className="px-2 py-2 uppercase">{r.paymentMode}</td>
              <td className="px-2 py-2 text-right font-medium">₹{Number(r.totalAmount).toLocaleString('en-IN')}</td>
              <td className="px-2 py-2 capitalize">{r.receiptType}</td>
              <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded text-xs ${r.isCancelled?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>{r.isCancelled?'Cancelled':'Active'}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { bookingId: number; agreementDate: string; agreementType: string; };

export default function AgreementFormPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const [searchReg, setSearchReg] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: agreements = [] } = useQuery({ queryKey: ['agreements', selectedProject], queryFn: () => axios.get(`/api/application/agreements?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset } = useForm<FD>({ defaultValues: { agreementDate: new Date().toISOString().split('T')[0], agreementType: 'allotment' } });

  async function fetchBooking() {
    if (!selectedProject || !searchReg) return;
    const res = await axios.get(`/api/application/bookings?projectId=${selectedProject}`);
    const found = (res.data.data as any[]).find((b: any) => b.registrationNo === searchReg);
    setBooking(found || null);
  }

  const save = useMutation({
    mutationFn: (d: FD) => axios.post('/api/application/agreements', { ...d, bookingId: booking.id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['agreements'] }); setBooking(null); setSearchReg(''); reset({ agreementDate: new Date().toISOString().split('T')[0], agreementType: 'allotment' }); alert('Agreement created!'); },
    onError: (e: any) => alert(e.response?.data?.message || 'Error'),
  });

  return (
    <div>
      <PageHeader title="Agreement / Allotment Form" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <div className="flex gap-2">
            <select className="border rounded px-2 h-9 text-sm flex-1" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <Input value={searchReg} onChange={e => setSearchReg(e.target.value)} placeholder="Reg. No." className="h-9 text-sm w-36" onKeyDown={e => e.key === 'Enter' && fetchBooking()} />
            <Button type="button" onClick={fetchBooking} size="sm" className="bg-blue-600 hover:bg-blue-700">Fetch</Button>
          </div>
          {booking && (
            <div className="bg-blue-50 rounded p-2 text-xs">
              <strong>{booking.registrationNo}</strong> — {booking.Applicants?.[0]?.firstName} {booking.Applicants?.[0]?.lastName} | Unit: {booking.Unit?.unitNumber}
            </div>
          )}
          {booking && (
            <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3">
              <div><Label className="text-xs">Agreement Date *</Label><Input type="date" {...register('agreementDate')} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Agreement Type</Label>
                <select {...register('agreementType')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                  <option value="provisional">Provisional Allotment</option>
                  <option value="allotment">Allotment Letter</option>
                  <option value="bba">Agreement to Sell / BBA</option>
                  <option value="tpa">TPA</option>
                </select>
              </div>
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Create Agreement</Button>
            </form>
          )}
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Agreements</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{['#','Reg. No.','Customer','Unit','Type','Date','Status'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(agreements as any[]).map((a: any, i) => (
              <tr key={a.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2">{a.Booking?.registrationNo}</td>
                <td className="px-2 py-2">{a.Booking?.Applicants?.[0]?.firstName} {a.Booking?.Applicants?.[0]?.lastName}</td>
                <td className="px-2 py-2">{a.Booking?.Unit?.unitNumber}</td>
                <td className="px-2 py-2 capitalize">{a.agreementType}</td>
                <td className="px-2 py-2">{a.agreementDate}</td>
                <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded text-xs ${a.status==='active'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{a.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

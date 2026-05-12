import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { surrenderDate: string; reason: string; };

export default function SurrenderPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const [searchReg, setSearchReg] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: surrenders = [] } = useQuery({ queryKey: ['surrenders', selectedProject], queryFn: () => axios.get(`/api/application/surrender?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset } = useForm<FD>({ defaultValues: { surrenderDate: new Date().toISOString().split('T')[0] } });

  async function fetchBooking() {
    if (!selectedProject || !searchReg) return;
    const res = await axios.get(`/api/application/bookings?projectId=${selectedProject}`);
    const found = (res.data.data as any[]).find((b: any) => b.registrationNo === searchReg && b.status === 'active');
    setBooking(found || null);
    if (!found) alert('No active booking found with this registration number');
  }

  const save = useMutation({
    mutationFn: (d: FD) => axios.post('/api/application/surrender', { ...d, bookingId: booking.id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['surrenders'] }); setBooking(null); setSearchReg(''); reset(); alert('Surrender application submitted. Unit is now available.'); },
    onError: (e: any) => alert(e.response?.data?.message || 'Error'),
  });

  return (
    <div>
      <PageHeader title="Surrender / Cancellation Application" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <div className="flex gap-2">
            <select className="border rounded px-2 h-9 text-sm flex-1" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <Input value={searchReg} onChange={e => setSearchReg(e.target.value)} placeholder="Registration No." className="h-9 text-sm w-44" onKeyDown={e => e.key === 'Enter' && fetchBooking()} />
            <Button type="button" onClick={fetchBooking} size="sm" className="bg-blue-600 hover:bg-blue-700">Fetch</Button>
          </div>
          {booking && (
            <div className="bg-orange-50 border border-orange-200 rounded p-3 text-xs">
              <p className="font-semibold text-orange-800">⚠ Surrender will mark the unit as Available and booking as Surrendered</p>
              <div className="mt-2 grid grid-cols-2 gap-1">
                <span><strong>Reg. No.:</strong> {booking.registrationNo}</span>
                <span><strong>Customer:</strong> {booking.Applicants?.[0]?.firstName} {booking.Applicants?.[0]?.lastName}</span>
                <span><strong>Unit:</strong> {booking.Unit?.unitNumber}</span>
                <span><strong>Booking Date:</strong> {booking.bookingDate}</span>
              </div>
            </div>
          )}
          {booking && (
            <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3">
              <div><Label className="text-xs">Surrender Date *</Label><Input type="date" {...register('surrenderDate')} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Reason</Label><textarea {...register('reason')} className="w-full border rounded px-2 py-1 text-sm mt-1 h-20 resize-none" /></div>
              <Button type="submit" size="sm" className="bg-red-600 hover:bg-red-700 text-white" disabled={save.isPending}>
                {save.isPending ? 'Submitting...' : 'Submit Surrender'}
              </Button>
            </form>
          )}
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Surrender History</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{['#','Reg. No.','Customer','Unit','Date','Status'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(surrenders as any[]).map((s: any, i) => (
              <tr key={s.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2">{s.Booking?.registrationNo}</td>
                <td className="px-2 py-2">{s.Booking?.Applicants?.[0]?.firstName} {s.Booking?.Applicants?.[0]?.lastName}</td>
                <td className="px-2 py-2">{s.Booking?.Unit?.unitNumber}</td>
                <td className="px-2 py-2">{s.surrenderDate}</td>
                <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded text-xs ${s.status==='surrendered'?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>{s.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

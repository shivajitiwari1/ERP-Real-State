import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { fromBookingId: number; toUnitId: number; shiftDate: string; reason: string; };

export default function UnitShiftingProcessPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const [searchReg, setSearchReg] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [] } = useQuery({ queryKey: ['bookings-shift', selectedProject], queryFn: () => axios.get(`/api/application/bookings?projectId=${selectedProject}&status=active`).then(r => r.data.data), enabled: !!selectedProject });
  const { data: units = [] } = useQuery({ queryKey: ['units-available'], queryFn: () => axios.get('/api/projects/units?status=available').then(r => r.data.data), enabled: !!selectedProject });
  const { data: shifts = [] } = useQuery({ queryKey: ['shifts', selectedProject], queryFn: () => axios.get(`/api/application/booking/shift?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset } = useForm<FD>({ defaultValues: { shiftDate: new Date().toISOString().split('T')[0] } });
  const save = useMutation({
    mutationFn: (d: FD) => axios.post('/api/application/booking/shift', { ...d, fromBookingId: selectedBooking?.id, toUnitId: Number(d.toUnitId) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['shifts'] }); setSelectedBooking(null); reset({ shiftDate: new Date().toISOString().split('T')[0] }); alert('Unit shift recorded!'); },
    onError: (e: any) => alert(e.response?.data?.message || 'Error'),
  });
  const filteredBookings = (bookings as any[]).filter((b: any) => !searchReg || b.registrationNo?.toLowerCase().includes(searchReg.toLowerCase()) || (b.Applicants?.[0]?.firstName + ' ' + b.Applicants?.[0]?.lastName).toLowerCase().includes(searchReg.toLowerCase()));
  return (
    <div>
      <PageHeader title="Unit Shifting Process" subtitle="Transfer a booking from one unit to another available unit" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white p-4 rounded border shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Project *</Label>
              <select value={selectedProject} onChange={e => { setSelectedProject(e.target.value); setSelectedBooking(null); }} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Project --</option>
                {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Search Booking</Label>
              <input value={searchReg} onChange={e => setSearchReg(e.target.value)} placeholder="Reg. no. or customer name..." className="w-full border rounded px-2 h-9 text-sm mt-1" />
            </div>
          </div>
          {selectedProject && (
            <div className="overflow-auto max-h-48 border rounded">
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-slate-700 text-white sticky top-0">{['Reg. No.','Customer','Unit','Select'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
                <tbody>{filteredBookings.map((b: any, i) => (
                  <tr key={b.id} className={selectedBooking?.id===b.id?'bg-orange-50':(i%2===0?'bg-white':'bg-gray-50')}>
                    <td className="px-2 py-1.5 font-medium">{b.registrationNo}</td>
                    <td className="px-2 py-1.5">{b.Applicants?.[0]?.firstName} {b.Applicants?.[0]?.lastName}</td>
                    <td className="px-2 py-1.5">{b.Unit?.unitNo || '-'}</td>
                    <td className="px-2 py-1.5"><Button size="sm" variant={selectedBooking?.id===b.id?'default':'outline'} className="h-6 text-xs px-2" onClick={()=>setSelectedBooking(b)}>Select</Button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
          {selectedBooking && (
            <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3 border-t pt-3">
              <p className="text-xs font-bold text-orange-600">Shifting: {selectedBooking.Applicants?.[0]?.firstName} {selectedBooking.Applicants?.[0]?.lastName} — {selectedBooking.registrationNo}</p>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Target Unit *</Label>
                  <select {...register('toUnitId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                    <option value="">-- Select Available Unit --</option>
                    {(units as any[]).map((u: any) => <option key={u.id} value={u.id}>{u.unitNo} — {u.Floor?.floorName}</option>)}
                  </select>
                </div>
                <div><Label className="text-xs">Shift Date *</Label><Input type="date" {...register('shiftDate')} className="mt-1 h-9 text-sm" /></div>
              </div>
              <div><Label className="text-xs">Reason</Label><Input {...register('reason')} placeholder="Reason for unit shift..." className="mt-1 h-9 text-sm" /></div>
              <div className="flex gap-2 pt-2 border-t">
                <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Process Shift</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setSelectedBooking(null)}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Recent Shifts ({(shifts as any[]).length})</h3>
          <div className="space-y-2">{(shifts as any[]).slice(0, 20).map((s: any) => (
            <div key={s.id} className="bg-gray-50 rounded p-2 border text-xs">
              <div className="font-medium">{s.Booking?.Applicants?.[0]?.firstName} {s.Booking?.Applicants?.[0]?.lastName}</div>
              <div className="text-gray-400">To: {s.Unit?.unitNo} · {s.shiftDate}</div>
              {s.reason && <div className="text-gray-500 mt-0.5 italic">{s.reason}</div>}
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

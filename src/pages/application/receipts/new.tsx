import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = {
  bookingId: number; projectId: number; receiptNo: string; receiptDate: string;
  receiptType: string; paymentMode: string; amount: number; penaltyAmount: number;
  instrumentNo: string; instrumentDate: string; branch: string; narration: string;
  chequeNo: string; chequeBankName: string;
};

export default function ReceiptGenerationPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const [searchReg, setSearchReg] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [searchError, setSearchError] = useState('');

  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FD>({
    defaultValues: { receiptDate: new Date().toISOString().split('T')[0], receiptType: 'installment', paymentMode: 'cheque', amount: 0, penaltyAmount: 0 },
  });
  const paymentMode = watch('paymentMode');

  async function fetchBooking() {
    setSearchError('');
    setBooking(null);
    if (!selectedProject || !searchReg) return;
    try {
      const res = await axios.get(`/api/application/bookings?projectId=${selectedProject}`);
      const found = (res.data.data as any[]).find((b: any) => b.registrationNo === searchReg || (b.Applicants?.[0]?.firstName + ' ' + b.Applicants?.[0]?.lastName).toLowerCase().includes(searchReg.toLowerCase()));
      if (!found) { setSearchError('No booking found'); return; }
      setBooking(found);
    } catch { setSearchError('Search failed'); }
  }

  const save = useMutation({
    mutationFn: (d: FD) => axios.post('/api/application/receipts', {
      ...d,
      bookingId: booking.id,
      projectId: booking.projectId,
      amount: Number(d.amount),
      penaltyAmount: Number(d.penaltyAmount),
      totalAmount: Number(d.amount) + Number(d.penaltyAmount),
      chequeDetails: paymentMode === 'cheque' ? { chequeNo: d.chequeNo, chequeDate: d.instrumentDate || d.receiptDate, bankName: d.chequeBankName, branch: d.branch } : undefined,
    }),
    onSuccess: () => { reset({ receiptDate: new Date().toISOString().split('T')[0], receiptType: 'installment', paymentMode: 'cheque', amount: 0, penaltyAmount: 0 }); setBooking(null); setSearchReg(''); qc.invalidateQueries({ queryKey: ['receipts'] }); alert('Receipt generated successfully!'); },
    onError: (e: any) => alert(e.response?.data?.message || 'Error'),
  });

  return (
    <div>
      <PageHeader title="Receipt Generation" />
      <div className="bg-white p-4 rounded border shadow-sm mb-4">
        <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Fetch Customer</h3>
        <div className="flex gap-3 items-end">
          <div><Label className="text-xs">Project</Label>
            <select className="w-52 border rounded px-2 h-9 text-sm mt-1" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
              <option value="">-- Select --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><Label className="text-xs">Registration No. / Name</Label>
            <Input value={searchReg} onChange={e => setSearchReg(e.target.value)} placeholder="Enter Reg. No. or Name" className="mt-1 h-9 text-sm w-64" onKeyDown={e => e.key === 'Enter' && fetchBooking()} />
          </div>
          <Button type="button" onClick={fetchBooking} className="bg-blue-600 hover:bg-blue-700">FETCH</Button>
        </div>
        {searchError && <p className="text-red-500 text-xs mt-2">{searchError}</p>}
        {booking && (
          <div className="mt-3 bg-blue-50 rounded p-3 text-xs grid grid-cols-4 gap-2">
            <div><span className="text-gray-500">Reg. No.:</span> <strong>{booking.registrationNo}</strong></div>
            <div><span className="text-gray-500">Customer:</span> <strong>{booking.Applicants?.[0]?.firstName} {booking.Applicants?.[0]?.lastName}</strong></div>
            <div><span className="text-gray-500">Unit:</span> <strong>{booking.Unit?.unitNumber}</strong></div>
            <div><span className="text-gray-500">Plan:</span> <strong>{booking.PaymentPlan?.name || '-'}</strong></div>
          </div>
        )}
      </div>

      {booking && (
        <div className="bg-white p-4 rounded border shadow-sm">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Receipt Details</h3>
          <form onSubmit={handleSubmit(d => save.mutate(d))} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div><Label className="text-xs">Receipt No. *</Label><Input {...register('receiptNo')} className="mt-1 h-9 text-sm" placeholder="Auto or Manual" /></div>
            <div><Label className="text-xs">Receipt Date *</Label><Input type="date" {...register('receiptDate')} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Receipt Type</Label>
              <select {...register('receiptType')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="installment">Installment</option>
                <option value="booking">Booking</option>
                <option value="penalty">Penalty</option>
                <option value="addon">Add-on</option>
              </select>
            </div>
            <div><Label className="text-xs">Payment Mode</Label>
              <select {...register('paymentMode')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="cheque">Cheque</option>
                <option value="cash">Cash</option>
                <option value="online">Online</option>
                <option value="neft">NEFT</option>
                <option value="rtgs">RTGS</option>
                <option value="dd">DD</option>
              </select>
            </div>
            <div><Label className="text-xs">Amount (₹) *</Label><Input type="number" step="0.01" {...register('amount')} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Penalty Amount (₹)</Label><Input type="number" step="0.01" {...register('penaltyAmount')} className="mt-1 h-9 text-sm" /></div>
            {paymentMode === 'cheque' && (
              <>
                <div><Label className="text-xs">Cheque No.</Label><Input {...register('chequeNo')} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Cheque Date</Label><Input type="date" {...register('instrumentDate')} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Bank Name</Label><Input {...register('chequeBankName')} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Branch</Label><Input {...register('branch')} className="mt-1 h-9 text-sm" /></div>
              </>
            )}
            {['neft', 'rtgs', 'online', 'dd'].includes(paymentMode) && (
              <>
                <div><Label className="text-xs">Transaction/Reference No.</Label><Input {...register('instrumentNo')} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Transaction Date</Label><Input type="date" {...register('instrumentDate')} className="mt-1 h-9 text-sm" /></div>
              </>
            )}
            <div className="col-span-2 lg:col-span-4"><Label className="text-xs">Narration</Label><Input {...register('narration')} className="mt-1 h-9 text-sm" /></div>
            <div className="col-span-2 lg:col-span-4 flex gap-3 pt-2 border-t">
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>
                {save.isPending ? 'Generating...' : 'Generate Receipt'}
              </Button>
              <Button type="button" variant="outline" onClick={() => reset()}>Clear</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

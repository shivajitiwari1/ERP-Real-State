import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type InstallmentForm = {
  id?: number;
  planId: number;
  stageId?: number | null;
  name: string;
  dueType: string;
  dueDate?: string;
  percentage: number;
  amount: number;
};

export default function EditInstallmentPage() {
  const qc = useQueryClient();
  const [projectId, setProjectId] = useState('');
  const [planId, setPlanId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: plans = [] } = useQuery<any[]>({ queryKey: ['plans', projectId], queryFn: () => axios.get(`/api/projects/payment-plan/index?projectId=${projectId}`).then(r => r.data.data), enabled: !!projectId });
  const { data: installments = [] } = useQuery<any[]>({ queryKey: ['installments', planId], queryFn: () => axios.get(`/api/projects/payment-plan/installments?planId=${planId}`).then(r => r.data.data), enabled: !!planId });
  const { register, handleSubmit, reset, setValue, watch } = useForm<InstallmentForm>();
  const editingId = watch('id');

  const save = useMutation({
    mutationFn: (d: InstallmentForm) => axios.put('/api/projects/payment-plan/installments', d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['installments'] });
      reset();
    },
  });

  function startEdit(inst: any) {
    setValue('id', inst.id);
    setValue('planId', inst.planId);
    setValue('stageId', inst.stageId ?? null);
    setValue('name', inst.name);
    setValue('dueType', inst.dueType);
    setValue('dueDate', inst.dueDate || '');
    setValue('percentage', inst.percentage || 0);
    setValue('amount', inst.amount || 0);
  }

  return (
    <div>
      <PageHeader title="Edit Installment" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3">
          <select value={projectId} onChange={e => { setProjectId(e.target.value); setPlanId(''); }} className="border rounded px-2 h-9 text-sm min-w-52">
            <option value="">Select Project</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={planId} onChange={e => setPlanId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-52" disabled={!projectId}>
            <option value="">Select Payment Plan</option>
            {(plans as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {editingId && (
          <div className="bg-white border rounded-lg shadow-sm p-4">
            <div className="text-xs font-bold text-slate-600 uppercase border-b pb-2 mb-3">Editing Installment</div>
            <form
              onSubmit={handleSubmit(d => save.mutate({
                ...d,
                planId: Number(d.planId),
                stageId: d.stageId ? Number(d.stageId) : null,
                percentage: Number(d.percentage),
                amount: Number(d.amount),
              }))}
              className="grid grid-cols-2 gap-3"
            >
              <div>
                <Label className="text-xs">Installment Name *</Label>
                <Input {...register('name')} className="mt-1 h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Due Type</Label>
                <select {...register('dueType')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                  <option value="date">Date</option>
                  <option value="milestone">Milestone</option>
                  <option value="on_booking">On Booking</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Due Date</Label>
                <Input type="date" {...register('dueDate')} className="mt-1 h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Percentage (%)</Label>
                <Input type="number" step="0.01" {...register('percentage')} className="mt-1 h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Amount (₹)</Label>
                <Input type="number" step="0.01" {...register('amount')} className="mt-1 h-9 text-sm" />
              </div>
              <div className="col-span-2 flex gap-2 pt-2 border-t">
                <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Update Installment</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => reset()}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        {planId && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">Installments</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Due Type</th>
                  <th className="px-3 py-2">Percentage</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Due Date</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {(installments as any[]).length === 0
                  ? <tr><td colSpan={7} className="text-center py-6 text-gray-400 italic">No installments found</td></tr>
                  : (installments as any[]).map((inst: any, i: number) => (
                    <tr key={inst.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{inst.name}</td>
                      <td className="px-3 py-2 capitalize">{inst.dueType}</td>
                      <td className="px-3 py-2">{inst.percentage ? `${inst.percentage}%` : '—'}</td>
                      <td className="px-3 py-2">{inst.amount ? `₹${Number(inst.amount).toLocaleString('en-IN')}` : '—'}</td>
                      <td className="px-3 py-2">{inst.dueDate ? new Date(inst.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2">
                        <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => startEdit(inst)}>Edit</Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

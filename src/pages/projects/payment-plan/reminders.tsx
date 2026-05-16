import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { projectId: number; r1Days: number; r2Days: number; r3Days: number; r4Days: number; terminationDays: number; };

export default function ReminderDaysConfigurationPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: reminder } = useQuery({ queryKey: ['reminders', selectedProject], queryFn: () => axios.get(`/api/projects/payment-plan/reminders?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset } = useForm<FD>({ defaultValues: { r1Days: 7, r2Days: 15, r3Days: 30, r4Days: 45, terminationDays: 60 } });
  useEffect(() => { if (reminder) reset({ ...reminder, projectId: Number(selectedProject) }); else reset({ r1Days: 7, r2Days: 15, r3Days: 30, r4Days: 45, terminationDays: 60 }); }, [reminder, selectedProject]);
  const save = useMutation({
    mutationFn: (d: FD) => axios.post('/api/projects/payment-plan/reminders', { ...d, projectId: Number(selectedProject) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['reminders', selectedProject] }); alert('Reminder days saved!'); },
    onError: (e: any) => alert(e.response?.data?.message || 'Error saving'),
  });
  return (
    <div>
      <PageHeader title="Reminder Days Configuration" subtitle="Set demand reminder escalation schedule per project" />
      <div className="max-w-lg">
        <div className="bg-white p-4 rounded border shadow-sm space-y-4">
          <div><Label className="text-xs">Project *</Label>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full border rounded px-2 h-9 text-sm mt-1">
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          {selectedProject && (
            <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-4">
              <div className="bg-slate-50 rounded p-3 space-y-3">
                <p className="text-xs font-bold text-slate-600 uppercase">Overdue Days Threshold</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">R1 — 1st Reminder (days)</Label><Input type="number" {...register('r1Days')} className="mt-1 h-9 text-sm" /></div>
                  <div><Label className="text-xs">R2 — 2nd Reminder (days)</Label><Input type="number" {...register('r2Days')} className="mt-1 h-9 text-sm" /></div>
                  <div><Label className="text-xs">R3 — 3rd Reminder (days)</Label><Input type="number" {...register('r3Days')} className="mt-1 h-9 text-sm" /></div>
                  <div><Label className="text-xs">R4 — Final Reminder (days)</Label><Input type="number" {...register('r4Days')} className="mt-1 h-9 text-sm" /></div>
                  <div className="col-span-2"><Label className="text-xs">Termination Notice (days)</Label><Input type="number" {...register('terminationDays')} className="mt-1 h-9 text-sm" /></div>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t">
                <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Save Reminder Config</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { projectId: number; bookingAuthType: string; receiptNoPrefix: string; registrationNoPrefix: string; transferAuthType: string; };

export default function ProjectConfigurationDetailPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: config } = useQuery({ queryKey: ['project-config', selectedProject], queryFn: () => axios.get(`/api/projects/setup/project-config?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset } = useForm<FD>({ defaultValues: { bookingAuthType: 'auto', receiptNoPrefix: 'REC', registrationNoPrefix: 'REG', transferAuthType: 'auto' } });
  useEffect(() => { if (config) reset({ ...config, projectId: Number(selectedProject) }); else reset({ bookingAuthType: 'auto', receiptNoPrefix: 'REC', registrationNoPrefix: 'REG', transferAuthType: 'auto' }); }, [config, selectedProject]);
  const save = useMutation({
    mutationFn: (d: FD) => axios.put('/api/projects/setup/project-config', { ...d, projectId: Number(selectedProject) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['project-config', selectedProject] }); alert('Configuration saved!'); },
    onError: (e: any) => alert(e.response?.data?.message || 'Error saving'),
  });
  return (
    <div>
      <PageHeader title="Project Configuration Detail" subtitle="Configure number series and authorization settings per project" />
      <div className="max-w-xl">
        <div className="bg-white p-4 rounded border shadow-sm space-y-4">
          <div><Label className="text-xs">Project *</Label>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full border rounded px-2 h-9 text-sm mt-1">
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          {selectedProject && (
            <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-4">
              <fieldset className="border rounded p-3 space-y-3">
                <legend className="text-xs font-bold uppercase text-slate-500 px-1">Number Series</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Receipt No. Prefix</Label><Input {...register('receiptNoPrefix')} placeholder="REC" className="mt-1 h-9 text-sm" /></div>
                  <div><Label className="text-xs">Registration No. Prefix</Label><Input {...register('registrationNoPrefix')} placeholder="REG" className="mt-1 h-9 text-sm" /></div>
                </div>
              </fieldset>
              <fieldset className="border rounded p-3 space-y-3">
                <legend className="text-xs font-bold uppercase text-slate-500 px-1">Authorization Settings</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Booking Auth Type</Label>
                    <select {...register('bookingAuthType')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                      <option value="auto">Auto</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  <div><Label className="text-xs">Transfer Auth Type</Label>
                    <select {...register('transferAuthType')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                      <option value="auto">Auto</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                </div>
              </fieldset>
              <div className="flex gap-2 pt-2 border-t">
                <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Save Configuration</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

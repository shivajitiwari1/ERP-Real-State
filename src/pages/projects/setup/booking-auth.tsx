import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type FormData = { bookingAuthType: 'auto' | 'manual' };

export default function BookingAuthPage() {
  const qc = useQueryClient();
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: cfg, isLoading } = useQuery<any>({
    queryKey: ['project-config', projectId],
    queryFn: () => axios.get(`/api/projects/setup/project-config?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  const { register, handleSubmit, formState: { isDirty } } = useForm<FormData>({
    values: cfg ? { bookingAuthType: cfg.bookingAuthType ?? 'auto' } : undefined,
  });

  const save = useMutation({
    mutationFn: (d: FormData) =>
      cfg?.id
        ? axios.put('/api/projects/setup/project-config', { ...cfg, ...d, projectId: Number(projectId) })
        : axios.post('/api/projects/setup/project-config', { ...d, projectId: Number(projectId) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['project-config', projectId] }),
  });

  return (
    <div>
      <PageHeader title="Booking Authentication" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            className="border rounded px-2 h-9 text-sm min-w-64"
          >
            <option value="">Select Project</option>
            {(projects as any[]).map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {projectId && !isLoading && (
          <div className="bg-white border rounded-lg shadow-sm p-5 max-w-md">
            <h3 className="text-xs font-bold text-slate-600 uppercase border-b pb-2 mb-4">
              Booking Authentication Type
            </h3>
            <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-4">
              <div>
                <Label className="text-xs">Authentication Type</Label>
                <select
                  {...register('bookingAuthType')}
                  className="w-full border rounded px-2 h-9 text-sm mt-1"
                >
                  <option value="auto">Automated</option>
                  <option value="manual">Manual</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  <strong>Automated:</strong> System auto-approves bookings based on availability.
                  <br />
                  <strong>Manual:</strong> Admin must approve each booking request.
                </p>
              </div>
              {cfg && (
                <div className="bg-blue-50 rounded p-3 text-xs text-blue-700">
                  Current setting: <strong className="capitalize">{cfg.bookingAuthType}</strong>
                </div>
              )}
              <div className="border-t pt-3 flex items-center gap-3">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={save.isPending}
                >
                  {save.isPending ? 'Saving…' : 'Save'}
                </Button>
                {save.isSuccess && <span className="text-xs text-green-600">&#10003; Saved successfully</span>}
                {save.isError && <span className="text-xs text-red-600">Error saving. Try again.</span>}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

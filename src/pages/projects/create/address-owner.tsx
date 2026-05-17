import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  id: z.number().optional(),
  projectId: z.number().min(1, 'Required'),
  ownerName: z.string().min(1, 'Required'),
  address: z.string().optional(),
});
type FD = z.infer<typeof schema>;

export default function AddressOwnerPage() {
  const qc = useQueryClient();
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const [projectId, setProjectId] = useState('');
  const { data: records = [] } = useQuery<any[]>({
    queryKey: ['address-owners', projectId],
    queryFn: () => axios.get(`/api/projects/address-owner?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FD>({
    resolver: zodResolver(schema),
  });
  const save = useMutation({
    mutationFn: (d: FD) => d.id ? axios.put('/api/projects/address-owner', d) : axios.post('/api/projects/address-owner', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['address-owners'] }); reset(); },
  });
  const del = useMutation({
    mutationFn: (id: number) => axios.delete('/api/projects/address-owner', { data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['address-owners'] }),
  });

  return (
    <div>
      <PageHeader title="Address Owner Master" />
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2 bg-white border rounded-lg shadow-sm p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-600 uppercase border-b pb-2">Add Address Owner</h3>
          <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3">
            <div>
              <Label className="text-xs">Project *</Label>
              <select
                {...register('projectId', { valueAsNumber: true })}
                onChange={e => { setValue('projectId', Number(e.target.value)); setProjectId(e.target.value); }}
                className="w-full border rounded px-2 h-9 text-sm mt-1"
              >
                <option value="">Select Project</option>
                {(projects as any[]).map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.projectId && <p className="text-red-500 text-[10px]">{errors.projectId.message}</p>}
            </div>
            <div>
              <Label className="text-xs">Owner Name *</Label>
              <Input {...register('ownerName')} className="mt-1 h-9 text-sm" />
              {errors.ownerName && <p className="text-red-500 text-[10px]">{errors.ownerName.message}</p>}
            </div>
            <div>
              <Label className="text-xs">Address</Label>
              <textarea {...register('address')} rows={2} className="mt-1 w-full border rounded px-2 py-1 text-sm" />
            </div>
            <div className="flex gap-2 border-t pt-2">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>
                Save
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset()}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="xl:col-span-3 bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Address Owners</div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-3 py-2">S.No.</th>
                <th className="px-3 py-2">Owner Name</th>
                <th className="px-3 py-2">Address</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {(records as any[]).length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400 italic">
                    Select a project to view records
                  </td>
                </tr>
              ) : (
                (records as any[]).map((r: any, i: number) => (
                  <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{r.ownerName}</td>
                    <td className="px-3 py-2 text-gray-500">{r.address || '—'}</td>
                    <td className="px-3 py-2 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-[10px] px-2 mr-1"
                        onClick={() => {
                          setValue('id', r.id);
                          setValue('projectId', r.projectId);
                          setValue('ownerName', r.ownerName);
                          setValue('address', r.address || '');
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-[10px] px-2 text-red-500"
                        onClick={() => { if (confirm('Delete?')) del.mutate(r.id); }}
                      >
                        Del
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

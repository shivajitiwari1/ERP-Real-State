import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { towerId: number; floorNumber: number; floorName: string; };

export default function AddBaseFloorPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: towers = [] } = useQuery({ queryKey: ['towers', selectedProject], queryFn: () => axios.get(`/api/projects/towers?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset, watch } = useForm<FD>({ defaultValues: { floorNumber: 0, floorName: 'Ground Floor' } });
  const selectedTower = watch('towerId');
  const { data: floors = [] } = useQuery({ queryKey: ['floors', selectedTower], queryFn: () => axios.get(`/api/projects/floors?towerId=${selectedTower}`).then(r => r.data.data), enabled: !!selectedTower });
  const save = useMutation({
    mutationFn: (d: FD) => axios.post('/api/projects/floors', { ...d, towerId: Number(d.towerId), floorNumber: Number(d.floorNumber) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['floors'] }); reset({ floorNumber: 0, floorName: 'Ground Floor' }); },
    onError: (e: any) => alert(e.response?.data?.message || 'Error saving floor'),
  });
  return (
    <div>
      <PageHeader title="Add Base Floor" subtitle="Add ground / basement floors to a tower" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <div><Label className="text-xs">Project *</Label>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full border rounded px-2 h-9 text-sm mt-1">
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3">
            <div><Label className="text-xs">Tower *</Label>
              <select {...register('towerId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Tower --</option>
                {(towers as any[]).map((t: any) => <option key={t.id} value={t.id}>{t.name} ({t.code})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Floor Number</Label><Input type="number" {...register('floorNumber')} placeholder="0 = Ground, -1 = Basement" className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Floor Name *</Label><Input {...register('floorName')} placeholder="Ground Floor / B1 / Terrace" className="mt-1 h-9 text-sm" /></div>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Add Floor</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ floorNumber: 0, floorName: 'Ground Floor' })}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Floors Added ({(floors as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{['Floor No.','Floor Name'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(floors as any[]).map((f: any, i) => (
              <tr key={f.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2 font-medium">{f.floorNumber}</td>
                <td className="px-2 py-2">{f.floorName}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { projectId: number; towerId: number; floorId: number; unitTypeId?: number | null; unitCount: number; startNumber: number; prefix?: string; area?: number | null; };

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-100 text-green-700', booked: 'bg-blue-100 text-blue-700',
  sold: 'bg-purple-100 text-purple-700', cancelled: 'bg-red-100 text-red-700', held: 'bg-yellow-100 text-yellow-700',
};

export default function FloorWiseUnitsPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTower, setSelectedTower] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');

  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: towers = [] } = useQuery({ queryKey: ['towers', selectedProject], queryFn: () => axios.get(`/api/projects/towers?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { data: floors = [] } = useQuery({ queryKey: ['floors', selectedTower], queryFn: () => axios.get(`/api/projects/floors?towerId=${selectedTower}`).then(r => r.data.data), enabled: !!selectedTower });
  const { data: unitTypes = [] } = useQuery({ queryKey: ['unit-types', selectedProject], queryFn: () => axios.get(`/api/projects/unit-types?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { data: units = [] } = useQuery({ queryKey: ['units', selectedFloor], queryFn: () => axios.get(`/api/projects/units?floorId=${selectedFloor}`).then(r => r.data.data), enabled: !!selectedFloor });

  const { register, handleSubmit, reset } = useForm<FD>({ defaultValues: { unitCount: 1, startNumber: 1 } });
  const save = useMutation({
    mutationFn: (d: FD) => axios.post('/api/projects/units', { ...d, projectId: Number(selectedProject), towerId: Number(selectedTower), floorId: Number(selectedFloor), unitTypeId: d.unitTypeId ? Number(d.unitTypeId) : null, unitCount: Number(d.unitCount), startNumber: Number(d.startNumber), area: d.area ? Number(d.area) : null }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['units'] }); reset({ unitCount: 1, startNumber: 1 }); },
  });

  return (
    <div>
      <PageHeader title="Floor Wise Unit Allocation" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-600 pb-1 border-b uppercase">Select Location</h3>
          <div><Label className="text-xs">Project *</Label>
            <select className="w-full border rounded px-2 h-9 text-sm mt-1" value={selectedProject} onChange={e => { setSelectedProject(e.target.value); setSelectedTower(''); setSelectedFloor(''); }}>
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><Label className="text-xs">Tower *</Label>
            <select className="w-full border rounded px-2 h-9 text-sm mt-1" value={selectedTower} onChange={e => { setSelectedTower(e.target.value); setSelectedFloor(''); }} disabled={!selectedProject}>
              <option value="">-- Select Tower --</option>
              {(towers as any[]).map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div><Label className="text-xs">Floor *</Label>
            <select className="w-full border rounded px-2 h-9 text-sm mt-1" value={selectedFloor} onChange={e => setSelectedFloor(e.target.value)} disabled={!selectedTower}>
              <option value="">-- Select Floor --</option>
              {(floors as any[]).map((f: any) => <option key={f.id} value={f.id}>{f.floorName}</option>)}
            </select>
          </div>
          {selectedFloor && (
            <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3 pt-3 border-t">
              <h3 className="text-xs font-bold text-slate-600 uppercase">Bulk Add Units</h3>
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs">Count *</Label><Input type="number" {...register('unitCount')} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Start No.</Label><Input type="number" {...register('startNumber')} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Prefix</Label><Input {...register('prefix')} placeholder="e.g. A-" className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Area (sq.ft)</Label><Input type="number" step="0.01" {...register('area')} className="mt-1 h-9 text-sm" /></div>
              </div>
              <div><Label className="text-xs">Unit Type</Label>
                <select {...register('unitTypeId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                  <option value="">-- Select --</option>
                  {(unitTypes as any[]).map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <Button type="submit" size="sm" className="w-full bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>
                {save.isPending ? 'Adding...' : 'Add Units'}
              </Button>
            </form>
          )}
        </div>
        <div className="xl:col-span-2 bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Units on Floor ({(units as any[]).length})</h3>
          <div className="flex flex-wrap gap-2">
            {(units as any[]).map((u: any) => (
              <div key={u.id} className={`px-3 py-2 rounded border text-xs font-medium ${STATUS_COLORS[u.status] || 'bg-gray-100'}`}>
                {u.unitNumber}<br />
                <span className="font-normal opacity-70">{u.UnitType?.name || '-'}</span>
              </div>
            ))}
            {(units as any[]).length === 0 && selectedFloor && (
              <p className="text-gray-400 italic text-sm">No units on this floor. Add units using the form.</p>
            )}
            {!selectedFloor && <p className="text-gray-400 italic text-sm">Select a floor to view units.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

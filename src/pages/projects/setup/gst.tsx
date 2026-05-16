import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { projectId: number; gstRate: number; gstNo: string; hsnCode: string; gstOnConstruction: number; gstOnLand: number; };

export default function GSTConfigurationPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { register, handleSubmit, reset } = useForm<FD>({ defaultValues: { gstRate: 5, gstOnConstruction: 12, gstOnLand: 0 } });
  const save = useMutation({
    mutationFn: (d: FD) => axios.put('/api/projects/setup/project-config', { projectId: Number(selectedProject), gstRate: d.gstRate }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['project-config', selectedProject] }); alert('GST configuration saved!'); },
    onError: (e: any) => alert(e.response?.data?.message || 'Error saving'),
  });
  const GST_RATES = [{ label: 'Affordable Housing (1%)', rate: 1 }, { label: 'Under Construction — No ITC (5%)', rate: 5 }, { label: 'Under Construction + ITC (12%)', rate: 12 }, { label: 'Completed / Ready to Move (0%)', rate: 0 }];
  return (
    <div>
      <PageHeader title="GST Configuration" subtitle="Configure GST rates applicable to the project" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-4">
          <div><Label className="text-xs">Project *</Label>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full border rounded px-2 h-9 text-sm mt-1">
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          {selectedProject && (
            <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3">
              <div><Label className="text-xs">GST Registration No. (GSTIN)</Label><Input {...register('gstNo')} placeholder="e.g. 22AAAAA0000A1Z5" className="mt-1 h-9 text-sm font-mono" /></div>
              <div><Label className="text-xs">HSN / SAC Code</Label><Input {...register('hsnCode')} placeholder="e.g. 9954" className="mt-1 h-9 text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">GST on Construction (%)</Label><Input type="number" step="0.01" {...register('gstOnConstruction')} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">GST on Land (%)</Label><Input type="number" step="0.01" {...register('gstOnLand')} className="mt-1 h-9 text-sm" /></div>
              </div>
              <div className="flex gap-2 pt-2 border-t">
                <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Save GST Config</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => reset()}>Clear</Button>
              </div>
            </form>
          )}
        </div>
        <div className="bg-white p-4 rounded border shadow-sm">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">GST Rate Reference</h3>
          <div className="space-y-2">
            {GST_RATES.map(r => (
              <div key={r.rate} className="flex items-center justify-between p-3 bg-gray-50 rounded border text-xs">
                <span className="text-slate-700">{r.label}</span>
                <span className={`font-bold px-2 py-0.5 rounded ${r.rate === 0 ? 'bg-green-100 text-green-700' : r.rate <= 5 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{r.rate}%</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 italic">GST rates per CBIC notification. Verify with your CA before filing.</p>
        </div>
      </div>
    </div>
  );
}

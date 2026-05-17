import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type FormData = {
  itcEligible: string;
  itcPercentage: string;
  itcApplicableFrom: string;
};

const ITC_RULES = [
  { scheme: 'Under Construction (5% — No ITC)', eligible: false, note: 'ITC not available from July 2019 for 5% rate projects.' },
  { scheme: 'Under Construction + ITC (12%)', eligible: true, note: 'Full ITC available. Builder must pass benefit to buyer via anti-profiteering.' },
  { scheme: 'Affordable Housing (1%)', eligible: false, note: 'ITC not available. Concessional rate applies.' },
  { scheme: 'Commercial Property (12%+)', eligible: true, note: 'ITC available for commercial units.' },
];

export default function GstItcPage() {
  const qc = useQueryClient();
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: { itcEligible: 'no', itcPercentage: '0', itcApplicableFrom: '' },
  });

  const save = useMutation({
    mutationFn: (d: FormData) =>
      axios.put('/api/projects/setup/project-config', { projectId: Number(projectId), ...d }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['project-config', projectId] }),
  });

  const projName = (projects as any[]).find((p: any) => String(p.id) === projectId)?.name;

  return (
    <div>
      <PageHeader title="ITC Configuration" />
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

        {projectId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ITC Config Form */}
            <div className="bg-white border rounded-lg shadow-sm p-5">
              <h3 className="text-xs font-bold text-slate-600 uppercase border-b pb-2 mb-4">
                ITC Settings — {projName}
              </h3>
              <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-4">
                <div>
                  <Label className="text-xs">ITC Eligible</Label>
                  <select {...register('itcEligible')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                    <option value="no">No — Not Eligible</option>
                    <option value="yes">Yes — Eligible</option>
                    <option value="partial">Partial Eligibility</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs">ITC Percentage (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register('itcPercentage')}
                    className="mt-1 h-9 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Applicable From</Label>
                  <Input
                    type="date"
                    {...register('itcApplicableFrom')}
                    className="mt-1 h-9 text-sm"
                  />
                </div>
                <div className="border-t pt-3 flex items-center gap-3">
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={save.isPending}
                  >
                    {save.isPending ? 'Saving…' : 'Save ITC Config'}
                  </Button>
                  {save.isSuccess && <span className="text-xs text-green-600">&#10003; Saved</span>}
                </div>
              </form>
            </div>

            {/* ITC Reference */}
            <div className="bg-white border rounded-lg shadow-sm p-4">
              <h3 className="text-xs font-bold text-slate-600 uppercase border-b pb-2 mb-3">
                ITC Eligibility Reference
              </h3>
              <div className="space-y-2">
                {ITC_RULES.map(r => (
                  <div key={r.scheme} className="p-3 bg-gray-50 rounded border text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-slate-700">{r.scheme}</div>
                      <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded font-medium ${r.eligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {r.eligible ? 'Eligible' : 'Not Eligible'}
                      </span>
                    </div>
                    <div className="text-gray-400 mt-1">{r.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

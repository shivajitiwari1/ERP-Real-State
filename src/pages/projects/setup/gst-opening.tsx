import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FormData = {
  openingGstLiability: string;
  openingItcBalance: string;
  openingCgst: string;
  openingSgst: string;
  openingIgst: string;
  openingAsOn: string;
};

export default function GstOpeningPage() {
  const qc = useQueryClient();
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });

  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      openingGstLiability: '0',
      openingItcBalance: '0',
      openingCgst: '0',
      openingSgst: '0',
      openingIgst: '0',
      openingAsOn: '',
    },
  });

  const save = useMutation({
    mutationFn: (d: FormData) =>
      axios.put('/api/projects/setup/project-config', { projectId: Number(projectId), ...d }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['project-config', projectId] }),
  });

  const projName = (projects as any[]).find((p: any) => String(p.id) === projectId)?.name;

  const cgst = parseFloat(watch('openingCgst') || '0');
  const sgst = parseFloat(watch('openingSgst') || '0');
  const igst = parseFloat(watch('openingIgst') || '0');
  const totalLiability = cgst + sgst + igst;

  return (
    <div>
      <PageHeader title="Set Customer Opening" />
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
            {/* Opening Balance Form */}
            <div className="bg-white border rounded-lg shadow-sm p-5">
              <h3 className="text-xs font-bold text-slate-600 uppercase border-b pb-2 mb-4">
                GST Opening Balance — {projName}
              </h3>
              <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3">
                <div>
                  <Label className="text-xs">Opening as on Date</Label>
                  <Input type="date" {...register('openingAsOn')} className="mt-1 h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">Opening GST Liability (₹)</Label>
                  <Input type="number" step="0.01" min="0" {...register('openingGstLiability')} className="mt-1 h-9 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">Opening ITC Balance (₹)</Label>
                  <Input type="number" step="0.01" min="0" {...register('openingItcBalance')} className="mt-1 h-9 text-sm" />
                </div>
                <div className="pt-1 border-t">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Break-up by Tax Head</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">CGST (₹)</Label>
                      <Input type="number" step="0.01" min="0" {...register('openingCgst')} className="mt-1 h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">SGST (₹)</Label>
                      <Input type="number" step="0.01" min="0" {...register('openingSgst')} className="mt-1 h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">IGST (₹)</Label>
                      <Input type="number" step="0.01" min="0" {...register('openingIgst')} className="mt-1 h-9 text-sm" />
                    </div>
                  </div>
                  {totalLiability > 0 && (
                    <div className="mt-2 text-xs text-slate-600">
                      Total: ₹{totalLiability.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  )}
                </div>
                <div className="border-t pt-3 flex items-center gap-3">
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={save.isPending}
                  >
                    {save.isPending ? 'Saving…' : 'Save Opening Balance'}
                  </Button>
                  {save.isSuccess && <span className="text-xs text-green-600">&#10003; Saved</span>}
                  {save.isError && <span className="text-xs text-red-600">Error saving. Try again.</span>}
                </div>
              </form>
            </div>

            {/* Info Card */}
            <div className="bg-white border rounded-lg shadow-sm p-4">
              <div className="text-xs font-bold text-slate-700 uppercase border-b pb-2 mb-3">
                Opening Balance Guidelines
              </div>
              <div className="space-y-3 text-xs text-gray-600">
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <strong className="text-blue-700">When to enter opening balance?</strong><br />
                  Enter opening GST balances when migrating from an existing system or at the start of a new financial year for projects that were already underway.
                </div>
                <div className="p-3 bg-amber-50 rounded border-l-4 border-amber-400">
                  <strong className="text-amber-700">CGST + SGST vs IGST</strong><br />
                  For intra-state transactions, split liability into CGST and SGST equally. For inter-state transactions, use IGST. Do not mix IGST with CGST/SGST.
                </div>
                <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                  <strong className="text-green-700">ITC Balance</strong><br />
                  Enter ITC (Input Tax Credit) balance carried forward from previous period. This will be available for set-off against future liability.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function HoldingChargePage() {
  const qc = useQueryClient();
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: charges = [] } = useQuery({ queryKey: ["holding-charges"], queryFn: () => axios.get("/api/possession/holding-charge").then(r => r.data.data) });
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>({ defaultValues: { chargePerDay: 0, effectiveFrom: new Date().toISOString().split("T")[0] } });
  const editingId = watch("id");
  const save = useMutation({
    mutationFn: (d: any) => d.id ? axios.put("/api/possession/holding-charge", d) : axios.post("/api/possession/holding-charge", d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["holding-charges"] }); reset({ chargePerDay: 0, effectiveFrom: new Date().toISOString().split("T")[0] }); },
  });
  return (
    <div>
      <PageHeader title="Holding Charge" subtitle="Configure per-day holding charges for delayed possession" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <form onSubmit={handleSubmit(d => save.mutate({ ...d, projectId: Number(d.projectId), chargePerDay: Number(d.chargePerDay) }))} className="space-y-3">
            <div><Label className="text-xs">Project *</Label>
              <select {...register("projectId")} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Project --</option>
                {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Charge Per Day (Rs.)</Label><Input type="number" step="0.01" {...register("chargePerDay")} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Effective From</Label><Input type="date" {...register("effectiveFrom")} className="mt-1 h-9 text-sm" /></div>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>{editingId ? "Update" : "Save"}</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ chargePerDay: 0, effectiveFrom: new Date().toISOString().split("T")[0] })}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Holding Charges ({(charges as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{["#","Project","Rs./Day","Effective From","Action"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(charges as any[]).map((c: any, i) => <tr key={c.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-2 py-2 text-gray-400">{i + 1}</td><td className="px-2 py-2 font-medium">{c.projectId}</td><td className="px-2 py-2">Rs.{Number(c.chargePerDay).toLocaleString("en-IN")}</td><td className="px-2 py-2">{c.effectiveFrom}</td><td className="px-2 py-2"><Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => { Object.keys(c).forEach(k => setValue(k as any, c[k])); }}>Edit</Button></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

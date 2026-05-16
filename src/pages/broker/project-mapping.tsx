import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BrokerProjectMappingPage() {
  const qc = useQueryClient();
  const { data: brokers = [] } = useQuery({ queryKey: ["brokers"], queryFn: () => axios.get("/api/broker").then(r => r.data.data) });
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: mappings = [] } = useQuery({ queryKey: ["broker-mappings"], queryFn: () => axios.get("/api/broker/project-mapping").then(r => r.data.data) });
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>({ defaultValues: { commissionRate: 0 } });
  const editingId = watch("id");
  const save = useMutation({
    mutationFn: (d: any) => d.id ? axios.put("/api/broker/project-mapping", d) : axios.post("/api/broker/project-mapping", d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["broker-mappings"] }); reset({ commissionRate: 0 }); },
  });
  const del = useMutation({ mutationFn: (id: number) => axios.delete("/api/broker/project-mapping", { data: { id } }), onSuccess: () => qc.invalidateQueries({ queryKey: ["broker-mappings"] }) });
  return (
    <div>
      <PageHeader title="Broker Project Mapping" subtitle="Assign brokers to projects with commission rates" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <form onSubmit={handleSubmit(d => save.mutate({ ...d, brokerId: Number(d.brokerId), projectId: Number(d.projectId), commissionRate: Number(d.commissionRate) }))} className="space-y-3">
            <div><Label className="text-xs">Broker *</Label>
              <select {...register("brokerId")} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Broker --</option>
                {(brokers as any[]).map((b: any) => <option key={b.id} value={b.id}>{b.code} - {b.firstName} {b.lastName}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Project *</Label>
              <select {...register("projectId")} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Project --</option>
                {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Commission Rate (%)</Label><Input type="number" step="0.01" {...register("commissionRate")} className="mt-1 h-9 text-sm" /></div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>{editingId ? "Update" : "Map"}</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ commissionRate: 0 })}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Mappings ({(mappings as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{["Broker","Project","Commission","Action"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(mappings as any[]).map((m: any, i) => (
              <tr key={m.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-2 font-medium">{m.Broker?.firstName} {m.Broker?.lastName}</td>
                <td className="px-2 py-2">{m.Project?.name}</td>
                <td className="px-2 py-2">{m.commissionRate}%</td>
                <td className="px-2 py-2 flex gap-1">
                  <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => Object.keys(m).forEach(k => setValue(k as any, m[k]))}>Edit</Button>
                  <Button size="sm" variant="destructive" className="h-6 text-xs px-2" onClick={() => del.mutate(m.id)}>Del</Button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

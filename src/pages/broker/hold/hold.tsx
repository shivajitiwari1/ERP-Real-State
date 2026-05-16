import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BrokerHoldUnitPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState("");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: brokers = [] } = useQuery({ queryKey: ["brokers"], queryFn: () => axios.get("/api/broker").then(r => r.data.data) });
  const { data: units = [] } = useQuery({ queryKey: ["units-hold", selectedProject], queryFn: () => axios.get("/api/projects/units?projectId=" + selectedProject + "&status=available").then(r => r.data.data), enabled: !!selectedProject });
  const { data: heldUnits = [] } = useQuery({ queryKey: ["held-units", selectedProject], queryFn: () => axios.get("/api/broker/held-units?projectId=" + selectedProject + "&status=held").then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset } = useForm<any>({ defaultValues: { holdDate: new Date().toISOString().split("T")[0] } });
  const hold = useMutation({
    mutationFn: (d: any) => axios.post("/api/broker/held-units", { ...d, projectId: Number(selectedProject), brokerId: Number(d.brokerId), unitId: Number(d.unitId) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["held-units"] }); qc.invalidateQueries({ queryKey: ["units-hold"] }); reset({ holdDate: new Date().toISOString().split("T")[0] }); alert("Unit held successfully!"); },
    onError: (e: any) => alert(e.response?.data?.message || "Error"),
  });
  return (
    <div>
      <PageHeader title="Hold Unit" subtitle="Place a unit on hold for a broker" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <div><Label className="text-xs">Project *</Label>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full border rounded px-2 h-9 text-sm mt-1">
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <form onSubmit={handleSubmit(d => hold.mutate(d))} className="space-y-3">
            <div><Label className="text-xs">Broker *</Label>
              <select {...register("brokerId")} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Broker --</option>
                {(brokers as any[]).map((b: any) => <option key={b.id} value={b.id}>{b.code} - {b.firstName} {b.lastName}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Unit *</Label>
              <select {...register("unitId")} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Available Unit --</option>
                {(units as any[]).map((u: any) => <option key={u.id} value={u.id}>{u.unitNo} — {u.Floor?.floorName}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Hold Date</Label><Input type="date" {...register("holdDate")} className="mt-1 h-9 text-sm" /></div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={hold.isPending}>Hold Unit</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ holdDate: new Date().toISOString().split("T")[0] })}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Currently Held ({(heldUnits as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{["Unit","Broker","Hold Date"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(heldUnits as any[]).map((h: any, i) => <tr key={h.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-2 py-2 font-medium">{h.Unit?.unitNo || h.unitId}</td><td className="px-2 py-2">{h.Broker?.firstName} {h.Broker?.lastName}</td><td className="px-2 py-2">{h.holdDate ? new Date(h.holdDate).toLocaleDateString("en-IN") : "-"}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

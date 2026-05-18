import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function BrokerUnholdUnitPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState("");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: heldUnits = [], isLoading } = useQuery({ queryKey: ["held-units-unhold", selectedProject], queryFn: () => axios.get("/api/broker/held-units?projectId=" + selectedProject + "&status=held").then(r => r.data.data), enabled: !!selectedProject });
  const unhold = useMutation({
    mutationFn: (id: number) => axios.put("/api/broker/held-units", { id, status: "released", unholdDate: new Date().toISOString().split("T")[0] }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["held-units-unhold"] }); alert("Unit released!"); },
    onError: (e: any) => alert(e.response?.data?.message || "Error"),
  });
  return (
    <div>
      <PageHeader title="Unhold Unit" subtitle="Release held units back to available inventory" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48">
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{["#","Unit","Broker","Hold Date","Action"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{isLoading ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr> : (heldUnits as any[]).length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-gray-400 italic">No held units{selectedProject ? "" : " — select a project"}</td></tr> : (heldUnits as any[]).map((h: any, i) => (
              <tr key={h.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-2 text-gray-400">{i + 1}</td>
                <td className="px-2 py-2 font-medium">{h.Unit?.unitNo || h.unitId}</td>
                <td className="px-2 py-2">{h.Broker?.firstName} {h.Broker?.lastName} ({h.Broker?.code})</td>
                <td className="px-2 py-2">{h.holdDate ? new Date(h.holdDate).toLocaleDateString("en-IN") : "-"}</td>
                <td className="px-2 py-2"><Button size="sm" className="h-6 text-xs px-2 bg-green-600 hover:bg-green-700" onClick={() => { if (window.confirm("Release this held unit?")) unhold.mutate(h.id); }}>Release</Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

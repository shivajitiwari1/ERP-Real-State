import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function HandoverPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: possessions = [], isLoading } = useQuery({ queryKey: ["possessions-handover", selectedProject], queryFn: () => axios.get("/api/possession?projectId=" + selectedProject).then(r => r.data.data), enabled: !!selectedProject });
  const update = useMutation({ mutationFn: (d: any) => axios.post("/api/possession", d), onSuccess: () => { qc.invalidateQueries({ queryKey: ["possessions-handover"] }); alert("Handover date updated!"); } });
  const [handoverDate, setHandoverDate] = useState("");
  const filtered = (possessions as any[]).filter((p: any) => !search || (p.Booking?.Applicants?.[0]?.firstName + " " + p.Booking?.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <PageHeader title="Handover" subtitle="Manage unit handover to customers after possession" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3 flex-wrap items-center">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48"><option value="">-- Select Project --</option>{(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer..." className="border rounded px-3 h-9 text-sm flex-1 min-w-48" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{ l: "Total", v: filtered.length }, { l: "Handed Over", v: filtered.filter((p: any) => p.actualDate).length }, { l: "Pending", v: filtered.filter((p: any) => !p.actualDate).length }].map(s => <div key={s.l} className="bg-white rounded border p-3 text-center"><div className="text-xl font-bold text-slate-700">{s.v}</div><div className="text-xs text-gray-400">{s.l}</div></div>)}
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{["#","Customer","Reg. No.","Unit","Expected","Actual/Handover","Status"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{isLoading ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-400 italic">No possession records{selectedProject ? "" : " — select a project"}</td></tr> : filtered.map((p: any, i) => (
              <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-2 text-gray-400">{i + 1}</td>
                <td className="px-2 py-2 font-medium">{p.Booking?.Applicants?.[0]?.firstName} {p.Booking?.Applicants?.[0]?.lastName}</td>
                <td className="px-2 py-2">{p.Booking?.registrationNo}</td>
                <td className="px-2 py-2">{p.Booking?.Unit?.unitNo || "-"}</td>
                <td className="px-2 py-2">{p.expectedDate || "-"}</td>
                <td className="px-2 py-2 font-medium text-green-600">{p.actualDate || <span className="text-yellow-600">Not handed over</span>}</td>
                <td className="px-2 py-2"><span className={"px-1.5 py-0.5 rounded text-xs font-medium " + (p.actualDate ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>{p.actualDate ? "Handed Over" : "Pending"}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

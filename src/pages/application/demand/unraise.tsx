import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function UnraiseDemandPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery({ queryKey: ["demands-unraise", selectedProject], queryFn: () => axios.get("/api/application/demand/list?projectId=" + selectedProject + "&status=pending").then(r => r.data.data), enabled: !!selectedProject });
  const unraise = useMutation({ mutationFn: (id: number) => axios.put("/api/application/demand/raise", { id, action: "unraise" }), onSuccess: () => { qc.invalidateQueries({ queryKey: ["demands-unraise"] }); alert("Demand unraised successfully."); }, onError: (e: any) => alert(e.response?.data?.message || "Error") });
  const filtered = (demands as any[]).filter((d: any) => !search || (d.Booking?.Applicants?.[0]?.firstName + " " + d.Booking?.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <PageHeader title="Un-Raise Demand" subtitle="Reverse/delete a raised demand that was raised in error" />
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-700"><strong>Warning:</strong> Un-raising a demand permanently removes it. Only un-raise demands that were raised in error. This action cannot be undone.</div>
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3 flex-wrap">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48"><option value="">-- Select Project --</option>{(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer..." className="border rounded px-3 h-9 text-sm flex-1 min-w-48" />
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{["#","Customer","Reg. No.","Demand Date","Type","Amount","Action"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{isLoading ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-400 italic">No pending demands{selectedProject ? "" : " — select a project"}</td></tr> : filtered.map((d: any, i) => (
              <tr key={d.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-2 text-gray-400">{i + 1}</td>
                <td className="px-2 py-2 font-medium">{d.Booking?.Applicants?.[0]?.firstName} {d.Booking?.Applicants?.[0]?.lastName}</td>
                <td className="px-2 py-2">{d.Booking?.registrationNo}</td>
                <td className="px-2 py-2">{d.demandDate}</td>
                <td className="px-2 py-2 capitalize">{d.demandType}</td>
                <td className="px-2 py-2 font-semibold">Rs.{Number(d.totalAmount).toLocaleString("en-IN")}</td>
                <td className="px-2 py-2"><Button size="sm" variant="destructive" className="h-6 text-xs px-2" onClick={() => { if (window.confirm("Un-raise this demand? This cannot be undone.")) unraise.mutate(d.id); }}>Un-Raise</Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

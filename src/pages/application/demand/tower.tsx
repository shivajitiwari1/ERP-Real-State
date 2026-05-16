import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

export default function TowerWiseDemandPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: towers = [] } = useQuery({ queryKey: ["towers", selectedProject], queryFn: () => axios.get("/api/projects/towers?projectId=" + selectedProject).then(r => r.data.data), enabled: !!selectedProject });
  const { data: demands = [], isLoading } = useQuery({ queryKey: ["demands-tower", selectedProject], queryFn: () => axios.get("/api/application/demand/list?projectId=" + selectedProject + "&status=pending").then(r => r.data.data), enabled: !!selectedProject });
  const grouped: Record<string, any[]> = {};
  (demands as any[]).forEach((d: any) => {
    const key = d.Booking?.Unit?.towerId || "unknown";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(d);
  });
  return (
    <div>
      <PageHeader title="Tower Wise Demand" subtitle="Pending demands grouped by tower/block" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48"><option value="">-- Select Project --</option>{(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        </div>
        {isLoading && <div className="text-center py-12 text-gray-400">Loading...</div>}
        {!isLoading && selectedProject && (towers as any[]).map((t: any) => {
          const items = grouped[t.id] || [];
          const total = items.reduce((s, d: any) => s + Number(d.totalAmount), 0);
          if (items.length === 0) return null;
          return (
            <div key={t.id} className="bg-white rounded border shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b flex justify-between items-center">
                <span className="font-semibold text-sm">{t.name} ({t.code})</span>
                <span className="text-xs text-orange-600 font-bold">{items.length} demands · Rs.{total.toLocaleString("en-IN")}</span>
              </div>
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-slate-100">{["Customer","Unit","Due Date","Amount","Status"].map(h => <th key={h} className="px-3 py-1.5 text-left">{h}</th>)}</tr></thead>
                <tbody>{items.slice(0, 10).map((d: any, i) => <tr key={d.id} className={i % 2 === 0 ? "" : "bg-gray-50"}><td className="px-3 py-1.5 font-medium">{d.Booking?.Applicants?.[0]?.firstName} {d.Booking?.Applicants?.[0]?.lastName}</td><td className="px-3 py-1.5">{d.Booking?.Unit?.unitNo || "-"}</td><td className="px-3 py-1.5 text-red-500">{d.dueDate || "-"}</td><td className="px-3 py-1.5 font-semibold">Rs.{Number(d.totalAmount).toLocaleString("en-IN")}</td><td className="px-3 py-1.5">{d.status}</td></tr>)}</tbody>
              </table>
            </div>
          );
        })}
        {!isLoading && !selectedProject && <div className="text-center py-12 text-gray-400 italic">Select a project to view tower-wise demands</div>}
      </div>
    </div>
  );
}

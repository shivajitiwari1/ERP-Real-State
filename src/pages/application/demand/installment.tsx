import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

export default function InstallmentWiseDemandPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery({ queryKey: ["demands-inst", selectedProject], queryFn: () => axios.get("/api/application/demand/list?projectId=" + selectedProject + "&status=pending").then(r => r.data.data), enabled: !!selectedProject });
  const filtered = (demands as any[]).filter((d: any) => d.demandType === "installment" && (!search || (d.Booking?.Applicants?.[0]?.firstName + " " + d.Booking?.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase())));
  const totalAmt = filtered.reduce((s, d: any) => s + Number(d.totalAmount), 0);
  return (
    <div>
      <PageHeader title="Installment Wise Demand" subtitle="Pending installment-based demands across all bookings" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3 flex-wrap items-center">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48"><option value="">-- Select Project --</option>{(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer..." className="border rounded px-3 h-9 text-sm flex-1 min-w-48" />
          {selectedProject && <span className="text-xs text-gray-500">{filtered.length} demands · Rs.{totalAmt.toLocaleString("en-IN")}</span>}
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{["#","Customer","Reg. No.","Installment","Due Date","Amount","Tax","Total"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{isLoading ? <tr><td colSpan={8} className="text-center py-8 text-gray-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={8} className="text-center py-8 text-gray-400 italic">No pending installment demands{selectedProject ? "" : " — select a project"}</td></tr> : filtered.map((d: any, i) => (
              <tr key={d.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-2 text-gray-400">{i + 1}</td>
                <td className="px-2 py-2 font-medium">{d.Booking?.Applicants?.[0]?.firstName} {d.Booking?.Applicants?.[0]?.lastName}</td>
                <td className="px-2 py-2">{d.Booking?.registrationNo}</td>
                <td className="px-2 py-2">{d.Installment?.name || "-"}</td>
                <td className="px-2 py-2 text-red-500">{d.dueDate || "-"}</td>
                <td className="px-2 py-2">Rs.{Number(d.amount).toLocaleString("en-IN")}</td>
                <td className="px-2 py-2">Rs.{Number(d.taxAmount).toLocaleString("en-IN")}</td>
                <td className="px-2 py-2 font-semibold">Rs.{Number(d.totalAmount).toLocaleString("en-IN")}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

export default function TransferReportPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: transfers = [], isLoading } = useQuery({ queryKey: ["transfers-report", selectedProject, statusFilter], queryFn: () => axios.get("/api/application/transfer?projectId=" + selectedProject + (statusFilter ? "&status=" + statusFilter : "")).then(r => r.data.data), enabled: !!selectedProject });
  const filtered = (transfers as any[]).filter((t: any) => !search || (t.fromBooking?.Applicants?.[0]?.firstName + " " + t.fromBooking?.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()) || t.fromBooking?.registrationNo?.toLowerCase().includes(search.toLowerCase()));
  const totalFees = filtered.reduce((s: number, t: any) => s + Number(t.transferFee || 0) + Number(t.serviceTax || 0), 0);
  const STATUS_BADGE: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", completed: "bg-green-100 text-green-700" };
  return (
    <div>
      <PageHeader title="Transfer Report" subtitle="Summary of all ownership transfer applications" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3 flex-wrap items-center">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48">
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded px-2 h-9 text-sm">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer or reg. no..." className="border rounded px-3 h-9 text-sm flex-1 min-w-48" />
        </div>
        {selectedProject && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "Total Transfers", v: filtered.length, cls: "bg-slate-50" },
              { l: "Pending", v: filtered.filter((t: any) => t.status === "pending").length, cls: "bg-yellow-50" },
              { l: "Total Fees Collected", v: "Rs." + totalFees.toLocaleString("en-IN"), cls: "bg-orange-50" },
            ].map(s => (
              <div key={s.l} className={s.cls + " rounded border p-3 text-center"}>
                <div className="text-lg font-bold text-slate-700">{s.v}</div>
                <div className="text-xs text-gray-400 uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        )}
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{["#","From Customer","Reg. No.","Transfer Date","Transfer Fee","Service Tax","Status"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{isLoading ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-400 italic">No transfer records{selectedProject ? "" : " — select a project"}</td></tr> : filtered.map((t: any, i) => (
              <tr key={t.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-2 text-gray-400">{i + 1}</td>
                <td className="px-2 py-2 font-medium">{t.fromBooking?.Applicants?.[0]?.firstName} {t.fromBooking?.Applicants?.[0]?.lastName}</td>
                <td className="px-2 py-2">{t.fromBooking?.registrationNo || t.fromBookingId}</td>
                <td className="px-2 py-2">{t.transferDate ? new Date(t.transferDate).toLocaleDateString("en-IN") : "-"}</td>
                <td className="px-2 py-2 font-semibold">Rs.{Number(t.transferFee).toLocaleString("en-IN")}</td>
                <td className="px-2 py-2">Rs.{Number(t.serviceTax).toLocaleString("en-IN")}</td>
                <td className="px-2 py-2"><span className={"px-1.5 py-0.5 rounded text-xs font-medium " + (STATUS_BADGE[t.status] || "bg-gray-100")}>{t.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

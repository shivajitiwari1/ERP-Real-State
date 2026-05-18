import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

export default function BrokerSummaryReportPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: brokers = [] } = useQuery({ queryKey: ["brokers"], queryFn: () => axios.get("/api/broker").then(r => r.data.data) });
  const { data: heldUnits = [] } = useQuery({ queryKey: ["held-all", selectedProject], queryFn: () => axios.get("/api/broker/held-units?projectId=" + selectedProject).then(r => r.data.data), enabled: !!selectedProject });
  const { data: bookings = [] } = useQuery({ queryKey: ["bookings-bsum", selectedProject], queryFn: () => axios.get("/api/application/bookings?projectId=" + selectedProject).then(r => r.data.data), enabled: !!selectedProject });
  const stats = { total: (brokers as any[]).length, active: (brokers as any[]).filter((b: any) => b.isActive).length, held: (heldUnits as any[]).filter((h: any) => h.status === "held").length, bookings: (bookings as any[]).filter((b: any) => b.brokerId).length };
  return (
    <div>
      <PageHeader title="Broker Summary Report" subtitle="Overall broker performance dashboard" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48"><option value="">-- Select Project --</option>{(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ l: "Total Brokers", v: stats.total, cls: "bg-slate-50" }, { l: "Active Brokers", v: stats.active, cls: "bg-green-50" }, { l: "Units Held", v: stats.held, cls: "bg-yellow-50" }, { l: "Broker Bookings", v: stats.bookings, cls: "bg-orange-50" }].map(s => <div key={s.l} className={s.cls + " rounded border p-4 text-center"}><div className="text-2xl font-bold text-slate-700">{s.v}</div><div className="text-xs text-gray-400 mt-1">{s.l}</div></div>)}
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <div className="px-4 py-2.5 border-b bg-gradient-to-r from-slate-800 to-slate-700"><span className="text-xs font-bold uppercase text-slate-300">All Brokers</span></div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">{["Code","Name","Company","Mobile","PAN","Status"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(brokers as any[]).map((b: any, i) => <tr key={b.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-2 py-2 font-mono font-medium">{b.code}</td><td className="px-2 py-2">{b.firstName} {b.lastName}</td><td className="px-2 py-2 text-gray-400">{b.companyName || "-"}</td><td className="px-2 py-2">{b.mobile || "-"}</td><td className="px-2 py-2 font-mono">{b.panNo || "-"}</td><td className="px-2 py-2"><span className={"px-1.5 py-0.5 rounded text-xs " + (b.isActive ? "bg-green-100 text-green-700" : "bg-gray-100")}>{b.isActive ? "Active" : "Inactive"}</span></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

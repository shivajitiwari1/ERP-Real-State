import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

export default function CustomerWiseDemandPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery({ queryKey: ["demands-cust", selectedProject, statusFilter], queryFn: () => axios.get("/api/application/demand/list?projectId=" + selectedProject + "&status=" + statusFilter).then(r => r.data.data), enabled: !!selectedProject });
  const grouped: Record<string, any[]> = {};
  (demands as any[]).filter((d: any) => !search || (d.Booking?.Applicants?.[0]?.firstName + " " + d.Booking?.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase())).forEach((d: any) => {
    const key = d.bookingId;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(d);
  });
  return (
    <div>
      <PageHeader title="Customer Wise Demand" subtitle="View all demands grouped by customer/booking" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3 flex-wrap">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48"><option value="">-- Select Project --</option>{(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded px-2 h-9 text-sm"><option value="">All</option><option value="pending">Pending</option><option value="sent">Sent</option><option value="settled">Settled</option></select>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer..." className="border rounded px-3 h-9 text-sm flex-1 min-w-48" />
        </div>
        {isLoading ? <div className="text-center py-12 text-gray-400">Loading...</div> : Object.entries(grouped).map(([bookingId, items]) => {
          const b = items[0]?.Booking;
          const total = items.reduce((s, d) => s + Number(d.totalAmount), 0);
          return (
            <div key={bookingId} className="bg-white rounded border shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b flex justify-between items-center">
                <div><span className="font-semibold text-sm">{b?.Applicants?.[0]?.firstName} {b?.Applicants?.[0]?.lastName}</span><span className="ml-2 text-xs text-gray-400">{b?.registrationNo}</span></div>
                <span className="text-xs font-bold text-orange-600">Total: Rs.{total.toLocaleString("en-IN")}</span>
              </div>
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-slate-100">{["Demand Date","Due Date","Type","Amount","Status"].map(h => <th key={h} className="px-3 py-1.5 text-left">{h}</th>)}</tr></thead>
                <tbody>{items.map((d: any, i) => <tr key={d.id} className={i % 2 === 0 ? "" : "bg-gray-50"}><td className="px-3 py-1.5">{d.demandDate}</td><td className="px-3 py-1.5 text-red-500">{d.dueDate || "-"}</td><td className="px-3 py-1.5 capitalize">{d.demandType}</td><td className="px-3 py-1.5 font-semibold">Rs.{Number(d.totalAmount).toLocaleString("en-IN")}</td><td className="px-3 py-1.5"><span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs">{d.status}</span></td></tr>)}</tbody>
              </table>
            </div>
          );
        })}
        {!isLoading && Object.keys(grouped).length === 0 && <div className="text-center py-12 text-gray-400 italic">No demands{selectedProject ? "" : " — select a project"}</div>}
      </div>
    </div>
  );
}

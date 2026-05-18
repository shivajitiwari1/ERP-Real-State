import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

export default function BrokerBookingReportPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedBroker, setSelectedBroker] = useState("");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: brokers = [] } = useQuery({ queryKey: ["brokers"], queryFn: () => axios.get("/api/broker").then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery({ queryKey: ["bookings-broker", selectedProject, selectedBroker], queryFn: () => axios.get("/api/application/bookings?projectId=" + selectedProject).then(r => r.data.data), enabled: !!selectedProject });
  const filtered = (bookings as any[]).filter((b: any) => !selectedBroker || b.brokerId === Number(selectedBroker));
  const totalValue = filtered.reduce((s: number, b: any) => s + Number(b.totalCost || 0), 0);
  return (
    <div>
      <PageHeader title="Broker Booking Report" subtitle="Bookings sourced through brokers" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3 flex-wrap">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48"><option value="">-- Select Project --</option>{(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <select value={selectedBroker} onChange={e => setSelectedBroker(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48"><option value="">All Brokers</option>{(brokers as any[]).map((b: any) => <option key={b.id} value={b.id}>{b.code} - {b.firstName} {b.lastName}</option>)}</select>
          {selectedProject && <span className="text-xs self-center text-gray-500">{filtered.length} bookings · Rs.{totalValue.toLocaleString("en-IN")}</span>}
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{["#","Customer","Reg. No.","Unit","Booking Date","Total Cost"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{isLoading ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-gray-400 italic">No broker bookings{selectedProject ? "" : " — select a project"}</td></tr> : filtered.map((b: any, i) => (
              <tr key={b.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-2 text-gray-400">{i + 1}</td>
                <td className="px-2 py-2 font-medium">{b.Applicants?.[0]?.firstName} {b.Applicants?.[0]?.lastName}</td>
                <td className="px-2 py-2">{b.registrationNo}</td>
                <td className="px-2 py-2">{b.Unit?.unitNo || "-"}</td>
                <td className="px-2 py-2">{b.bookingDate}</td>
                <td className="px-2 py-2 font-semibold">Rs.{Number(b.totalCost || 0).toLocaleString("en-IN")}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

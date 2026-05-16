import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function DeleteReceiptPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: receipts = [] } = useQuery({ queryKey: ["receipts-del", selectedProject], queryFn: () => axios.get("/api/application/receipts?projectId=" + selectedProject).then(r => r.data.data), enabled: !!selectedProject });
  const cancelled = (receipts as any[]).filter((r: any) => r.isCancelled && (!search || r.receiptNo?.toLowerCase().includes(search.toLowerCase())));
  return (
    <div>
      <PageHeader title="Delete Receipt Record" subtitle="Permanently remove cancelled receipt records (admin only)" />
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-700"><strong>Admin Only:</strong> Only cancelled receipts can be permanently deleted. This action is irreversible.</div>
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48"><option value="">-- Select Project --</option>{(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search receipt no..." className="border rounded px-3 h-9 text-sm flex-1" />
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{["Receipt No.","Date","Customer","Amount","Action"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{cancelled.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-gray-400 italic">No cancelled receipts{selectedProject ? "" : " — select a project"}</td></tr> : cancelled.map((r: any, i) => (
              <tr key={r.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-2 font-medium">{r.receiptNo}</td>
                <td className="px-2 py-2">{r.receiptDate}</td>
                <td className="px-2 py-2">{r.Booking?.Applicants?.[0]?.firstName} {r.Booking?.Applicants?.[0]?.lastName}</td>
                <td className="px-2 py-2 font-semibold">Rs.{Number(r.totalAmount).toLocaleString("en-IN")}</td>
                <td className="px-2 py-2"><Button size="sm" variant="destructive" className="h-6 text-xs px-2" onClick={() => alert("Delete requires super-admin authorization.")}>Delete</Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

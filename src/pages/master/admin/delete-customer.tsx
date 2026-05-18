import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function DeleteCustomerPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: bookings = [] } = useQuery({ queryKey: ["bookings-del", selectedProject], queryFn: () => axios.get("/api/application/bookings?projectId=" + selectedProject + "&status=cancelled").then(r => r.data.data), enabled: !!selectedProject });
  const filtered = (bookings as any[]).filter((b: any) => !search || (b.Applicants?.[0]?.firstName + " " + b.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()) || b.registrationNo?.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <PageHeader title="Delete Customer Record" subtitle="Permanently remove cancelled booking records" />
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-700"><strong>Admin Only:</strong> This permanently deletes customer records. Only cancelled bookings can be deleted. This action cannot be undone.</div>
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3 flex-wrap">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48"><option value="">-- Select Project --</option>{(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer..." className="border rounded px-3 h-9 text-sm flex-1" />
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{["#","Customer","Reg. No.","Unit","Cancellation","Action"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-gray-400 italic">No cancelled bookings{selectedProject ? "" : " — select a project"}</td></tr> : filtered.map((b: any, i) => (
              <tr key={b.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-2 text-gray-400">{i + 1}</td>
                <td className="px-2 py-2 font-medium">{b.Applicants?.[0]?.firstName} {b.Applicants?.[0]?.lastName}</td>
                <td className="px-2 py-2">{b.registrationNo}</td>
                <td className="px-2 py-2">{b.Unit?.unitNo || "-"}</td>
                <td className="px-2 py-2 text-gray-400">{b.updatedAt ? new Date(b.updatedAt).toLocaleDateString("en-IN") : "-"}</td>
                <td className="px-2 py-2"><Button size="sm" variant="destructive" className="h-6 text-xs px-2" onClick={() => { if (window.confirm("Permanently delete " + b.registrationNo + "? This cannot be undone!")) alert("Delete requires super-admin authorization. Please contact system administrator."); }}>Delete</Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

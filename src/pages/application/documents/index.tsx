import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function CustomerDocumentsPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery({ queryKey: ["bookings-docs", selectedProject], queryFn: () => axios.get("/api/application/bookings?projectId=" + selectedProject).then(r => r.data.data), enabled: !!selectedProject });
  const filtered = (bookings as any[]).filter((b: any) => !search || (b.Applicants?.[0]?.firstName + " " + b.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()) || b.registrationNo?.toLowerCase().includes(search.toLowerCase()));
  const DOCS = ["Booking Form", "Agreement for Sale", "Demand Letters", "Receipts", "NOC Certificate", "Possession Letter", "Registry Documents"];
  return (
    <div>
      <PageHeader title="Customer Documents" subtitle="View and download documents per booking" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3 flex-wrap">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48"><option value="">-- Select Project --</option>{(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer or reg. no..." className="border rounded px-3 h-9 text-sm flex-1 min-w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading ? <div className="col-span-3 text-center py-8 text-gray-400">Loading...</div> : filtered.length === 0 ? <div className="col-span-3 text-center py-8 text-gray-400 italic">No bookings{selectedProject ? "" : " — select a project"}</div> : filtered.slice(0, 12).map((b: any) => (
            <div key={b.id} className="bg-white rounded border shadow-sm overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 border-b">
                <div className="font-semibold text-sm">{b.Applicants?.[0]?.firstName} {b.Applicants?.[0]?.lastName}</div>
                <div className="text-xs text-gray-400">{b.registrationNo} · {b.Unit?.unitNo || "Unit N/A"}</div>
              </div>
              <div className="p-3 space-y-1">
                {DOCS.map(doc => (
                  <div key={doc} className="flex items-center justify-between text-xs py-1 border-b last:border-0">
                    <span className="text-slate-600">{doc}</span>
                    <Button size="sm" variant="outline" className="h-5 text-xs px-2" onClick={() => alert("Document: " + doc + " for " + b.registrationNo)}>View</Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

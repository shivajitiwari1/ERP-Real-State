import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PossessionDatePage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: bookings = [] } = useQuery({ queryKey: ["bookings-poss", selectedProject], queryFn: () => axios.get("/api/application/bookings?projectId=" + selectedProject + "&status=active").then(r => r.data.data), enabled: !!selectedProject });
  const { data: possessions = [] } = useQuery({ queryKey: ["possessions", selectedProject], queryFn: () => axios.get("/api/possession?projectId=" + selectedProject).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset } = useForm<any>();
  const save = useMutation({
    mutationFn: (d: any) => axios.post("/api/possession", { ...d, bookingId: selectedBooking?.id, projectId: Number(selectedProject) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["possessions"] }); setSelectedBooking(null); reset(); alert("Possession date saved!"); },
    onError: (e: any) => alert(e.response?.data?.message || "Error"),
  });
  const filtered = (bookings as any[]).filter((b: any) => !search || b.registrationNo?.toLowerCase().includes(search.toLowerCase()) || (b.Applicants?.[0]?.firstName + " " + b.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <PageHeader title="Possession Date" subtitle="Set expected and actual possession dates for bookings" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded border shadow-sm space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Project</Label>
                <select value={selectedProject} onChange={e => { setSelectedProject(e.target.value); setSelectedBooking(null); }} className="w-full border rounded px-2 h-9 text-sm mt-1">
                  <option value="">-- Select Project --</option>
                  {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div><Label className="text-xs">Search Booking</Label><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Reg. no. or customer..." className="w-full border rounded px-2 h-9 text-sm mt-1" /></div>
            </div>
            {selectedProject && (
              <div className="overflow-auto max-h-40 border rounded">
                <table className="w-full text-xs"><thead><tr className="bg-slate-700 text-white sticky top-0"><th className="px-2 py-1.5 text-left">Reg. No.</th><th className="px-2 py-1.5 text-left">Customer</th><th className="px-2 py-1.5 text-left">Unit</th><th className="px-2 py-1.5">Select</th></tr></thead>
                  <tbody>{filtered.map((b: any, i) => <tr key={b.id} className={selectedBooking?.id === b.id ? "bg-orange-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-2 py-1 font-medium">{b.registrationNo}</td><td className="px-2 py-1">{b.Applicants?.[0]?.firstName} {b.Applicants?.[0]?.lastName}</td><td className="px-2 py-1">{b.Unit?.unitNo || "-"}</td><td className="px-2 py-1 text-center"><Button size="sm" variant={selectedBooking?.id === b.id ? "default" : "outline"} className="h-5 text-xs px-2" onClick={() => setSelectedBooking(b)}>Select</Button></td></tr>)}</tbody>
                </table>
              </div>
            )}
          </div>
          {selectedBooking && (
            <div className="bg-white p-4 rounded border shadow-sm">
              <p className="text-xs font-bold text-orange-600 mb-3">Setting dates for: {selectedBooking.Applicants?.[0]?.firstName} {selectedBooking.Applicants?.[0]?.lastName} — {selectedBooking.Unit?.unitNo || selectedBooking.registrationNo}</p>
              <form onSubmit={handleSubmit(d => save.mutate(d))} className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Expected Possession Date</Label><Input type="date" {...register("expectedDate")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Actual Possession Date</Label><Input type="date" {...register("actualDate")} className="mt-1 h-9 text-sm" /></div>
                <div className="col-span-2 flex gap-2 border-t pt-2">
                  <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Save Possession Dates</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setSelectedBooking(null)}>Cancel</Button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Possession Schedule ({(possessions as any[]).length})</h3>
          <div className="space-y-2">{(possessions as any[]).slice(0, 15).map((p: any) => (
            <div key={p.id} className="bg-gray-50 rounded p-2.5 border text-xs">
              <div className="font-semibold">{p.Booking?.Applicants?.[0]?.firstName} {p.Booking?.Applicants?.[0]?.lastName}</div>
              <div className="text-gray-500">{p.Booking?.registrationNo} · {p.Booking?.Unit?.unitNo || "-"}</div>
              <div className="mt-1 flex gap-3">
                {p.expectedDate && <span className="text-blue-600">Expected: {p.expectedDate}</span>}
                {p.actualDate && <span className="text-green-600">Actual: {p.actualDate}</span>}
              </div>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

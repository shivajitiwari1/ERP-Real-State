import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegistryReportDateWisePage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: bookings = [] } = useQuery({ queryKey: ["bookings-reg", selectedProject], queryFn: () => axios.get("/api/application/bookings?projectId=" + selectedProject + "&status=active").then(r => r.data.data), enabled: !!selectedProject });
  const { data: records = [] } = useQuery({ queryKey: ["registry", selectedProject], queryFn: () => axios.get("/api/possession/registry?projectId=" + selectedProject).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset } = useForm<any>({ defaultValues: { registryDate: new Date().toISOString().split("T")[0], stampDuty: 0, registrationCharges: 0, total: 0 } });
  const save = useMutation({
    mutationFn: (d: any) => axios.post("/api/possession/registry", { ...d, bookingId: selectedBooking?.id, stampDuty: Number(d.stampDuty), registrationCharges: Number(d.registrationCharges), total: Number(d.total) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["registry"] }); setSelectedBooking(null); reset({ registryDate: new Date().toISOString().split("T")[0], stampDuty: 0, registrationCharges: 0, total: 0 }); alert("Registry record saved!"); },
    onError: (e: any) => alert(e.response?.data?.message || "Error"),
  });
  const filtered = (bookings as any[]).filter((b: any) => !search || b.registrationNo?.toLowerCase().includes(search.toLowerCase()) || (b.Applicants?.[0]?.firstName + " " + b.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()));
  const totalStamp = (records as any[]).reduce((s, r: any) => s + Number(r.stampDuty || 0), 0);
  const totalReg = (records as any[]).reduce((s, r: any) => s + Number(r.registrationCharges || 0), 0);
  return (
    <div>
      <PageHeader title="Registry Report Date Wise" subtitle="Record and report property registration details" />
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
              <div><Label className="text-xs">Search</Label><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Reg. no. or customer..." className="w-full border rounded px-2 h-9 text-sm mt-1" /></div>
            </div>
            {selectedProject && <div className="overflow-auto max-h-40 border rounded"><table className="w-full text-xs"><thead><tr className="bg-slate-700 text-white sticky top-0"><th className="px-2 py-1.5 text-left">Reg. No.</th><th className="px-2 py-1.5 text-left">Customer</th><th className="px-2 py-1.5 text-left">Unit</th><th className="px-2 py-1.5">Select</th></tr></thead><tbody>{filtered.map((b: any, i) => <tr key={b.id} className={selectedBooking?.id === b.id ? "bg-orange-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-2 py-1 font-medium">{b.registrationNo}</td><td className="px-2 py-1">{b.Applicants?.[0]?.firstName} {b.Applicants?.[0]?.lastName}</td><td className="px-2 py-1">{b.Unit?.unitNo || "-"}</td><td className="px-2 py-1 text-center"><Button size="sm" variant={selectedBooking?.id === b.id ? "default" : "outline"} className="h-5 text-xs px-2" onClick={() => setSelectedBooking(b)}>Select</Button></td></tr>)}</tbody></table></div>}
          </div>
          {selectedBooking && (
            <div className="bg-white p-4 rounded border shadow-sm">
              <p className="text-xs font-bold text-orange-600 mb-3">Registry for: {selectedBooking.Applicants?.[0]?.firstName} {selectedBooking.Applicants?.[0]?.lastName} — {selectedBooking.registrationNo}</p>
              <form onSubmit={handleSubmit(d => save.mutate(d))} className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Registry Date *</Label><Input type="date" {...register("registryDate")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Stamp Duty (Rs.)</Label><Input type="number" step="0.01" {...register("stampDuty")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Registration Charges (Rs.)</Label><Input type="number" step="0.01" {...register("registrationCharges")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Total (Rs.)</Label><Input type="number" step="0.01" {...register("total")} className="mt-1 h-9 text-sm" /></div>
                <div className="col-span-2"><Label className="text-xs">Remarks</Label><Input {...register("remarks")} className="mt-1 h-9 text-sm" /></div>
                <div className="col-span-2 flex gap-2 border-t pt-2">
                  <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Save Registry</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setSelectedBooking(null)}>Cancel</Button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[{ l: "Stamp Duty Collected", v: "Rs." + totalStamp.toLocaleString("en-IN"), cls: "bg-blue-50" }, { l: "Reg. Charges", v: "Rs." + totalReg.toLocaleString("en-IN"), cls: "bg-green-50" }].map(s => <div key={s.l} className={s.cls + " rounded border p-3 text-center"}><div className="text-sm font-bold text-slate-700">{s.v}</div><div className="text-xs text-gray-400 mt-0.5">{s.l}</div></div>)}
          </div>
          <div className="bg-white p-3 rounded border shadow-sm overflow-auto">
            <h3 className="text-xs font-bold text-slate-600 mb-2 pb-1 border-b uppercase">Registry Records ({(records as any[]).length})</h3>
            <div className="space-y-2">{(records as any[]).slice(0, 10).map((r: any) => <div key={r.id} className="bg-gray-50 rounded p-2 border text-xs"><div className="font-semibold">{r.Booking?.Applicants?.[0]?.firstName} {r.Booking?.Applicants?.[0]?.lastName}</div><div className="text-gray-400">{r.registryDate} · Rs.{Number(r.total).toLocaleString("en-IN")}</div></div>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FD = { bookingId: number; projectId: number; entryDate: string; amount: number; entryType: string; narration: string; };

export default function JournalEntryPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: bookings = [] } = useQuery({ queryKey: ["bookings-jv", selectedProject], queryFn: () => axios.get("/api/application/bookings?projectId=" + selectedProject).then(r => r.data.data), enabled: !!selectedProject });
  const { data: entries = [] } = useQuery({ queryKey: ["journal", selectedProject], queryFn: () => axios.get("/api/application/journal?projectId=" + selectedProject).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset } = useForm<FD>({ defaultValues: { entryDate: new Date().toISOString().split("T")[0], entryType: "JV", amount: 0 } });
  const save = useMutation({
    mutationFn: (d: FD) => axios.post("/api/application/journal", { ...d, bookingId: selectedBooking?.id, projectId: Number(selectedProject), amount: Number(d.amount) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["journal"] }); setSelectedBooking(null); reset({ entryDate: new Date().toISOString().split("T")[0], entryType: "JV", amount: 0 }); alert("Journal entry saved!"); },
    onError: (e: any) => alert(e.response?.data?.message || "Error"),
  });
  const filteredBookings = (bookings as any[]).filter((b: any) => !search || b.registrationNo?.toLowerCase().includes(search.toLowerCase()) || (b.Applicants?.[0]?.firstName + " " + b.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()));
  const ENTRY_TYPES = { JV: "bg-blue-100 text-blue-700", DR: "bg-red-100 text-red-700", CR: "bg-green-100 text-green-700", Refund: "bg-orange-100 text-orange-700" };
  return (
    <div>
      <PageHeader title="Journal Entry" subtitle="Post manual journal / adjustment entries for bookings" />
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
              <div><Label className="text-xs">Search Booking</Label><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Reg. no. or name..." className="w-full border rounded px-2 h-9 text-sm mt-1" /></div>
            </div>
            {selectedProject && (
              <div className="overflow-auto max-h-36 border rounded">
                <table className="w-full text-xs"><thead><tr className="bg-purple-700 text-white sticky top-0"><th className="px-2 py-1.5 text-left">Reg. No.</th><th className="px-2 py-1.5 text-left">Customer</th><th className="px-2 py-1.5">Select</th></tr></thead>
                  <tbody>{filteredBookings.map((b: any, i) => <tr key={b.id} className={selectedBooking?.id === b.id ? "bg-orange-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-2 py-1 font-medium">{b.registrationNo}</td><td className="px-2 py-1">{b.Applicants?.[0]?.firstName} {b.Applicants?.[0]?.lastName}</td><td className="px-2 py-1 text-center"><Button size="sm" variant={selectedBooking?.id === b.id ? "default" : "outline"} className="h-5 text-xs px-2" onClick={() => setSelectedBooking(b)}>Select</Button></td></tr>)}</tbody>
                </table>
              </div>
            )}
          </div>
          {selectedBooking && (
            <div className="bg-white p-4 rounded border shadow-sm">
              <p className="text-xs font-bold text-orange-600 mb-3">Entry for: {selectedBooking.Applicants?.[0]?.firstName} {selectedBooking.Applicants?.[0]?.lastName} — {selectedBooking.registrationNo}</p>
              <form onSubmit={handleSubmit(d => save.mutate(d))} className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Entry Type</Label>
                  <select {...register("entryType")} className="w-full border rounded px-2 h-9 text-sm mt-1">
                    <option value="JV">JV - Journal Voucher</option>
                    <option value="DR">DR - Debit</option>
                    <option value="CR">CR - Credit</option>
                    <option value="Refund">Refund</option>
                  </select>
                </div>
                <div><Label className="text-xs">Entry Date</Label><Input type="date" {...register("entryDate")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Amount (Rs.)</Label><Input type="number" step="0.01" {...register("amount")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Narration</Label><Input {...register("narration")} placeholder="Reason for entry..." className="mt-1 h-9 text-sm" /></div>
                <div className="col-span-2 flex gap-2 border-t pt-2">
                  <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Post Entry</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setSelectedBooking(null)}>Cancel</Button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Recent Entries ({(entries as any[]).length})</h3>
          <div className="space-y-2">{(entries as any[]).slice(0, 15).map((e: any) => (
            <div key={e.id} className="bg-gray-50 rounded p-2.5 border text-xs">
              <div className="flex justify-between items-start">
                <div><div className="font-semibold">{e.Booking?.Applicants?.[0]?.firstName} {e.Booking?.Applicants?.[0]?.lastName}</div><div className="text-gray-400">{e.entryDate}</div></div>
                <div className="text-right"><span className={"px-1.5 py-0.5 rounded text-xs font-medium " + ((ENTRY_TYPES as any)[e.entryType] || "bg-gray-100")}>{e.entryType}</span><div className="font-semibold mt-0.5">Rs.{Number(e.amount).toLocaleString("en-IN")}</div></div>
              </div>
              {e.narration && <div className="text-gray-400 mt-1 italic">{e.narration}</div>}
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

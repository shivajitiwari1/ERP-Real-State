import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FD = { bookingId: number; projectId: number; receiptNo: string; receiptDate: string; paymentMode: string; amount: number; narration: string; };

export default function PenaltyReceiptPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: bookings = [] } = useQuery({ queryKey: ["bookings-penalty", selectedProject], queryFn: () => axios.get("/api/application/bookings?projectId=" + selectedProject + "&status=active").then(r => r.data.data), enabled: !!selectedProject });
  const { data: penalties = [] } = useQuery({ queryKey: ["receipts-penalty", selectedProject], queryFn: () => axios.get("/api/application/receipts?projectId=" + selectedProject).then(r => r.data.data), enabled: !!selectedProject });
  const penaltyList = (penalties as any[]).filter((r: any) => r.receiptType === "penalty");
  const { register, handleSubmit, reset } = useForm<FD>({ defaultValues: { receiptDate: new Date().toISOString().split("T")[0], paymentMode: "cheque" } });
  const save = useMutation({
    mutationFn: (d: FD) => axios.post("/api/application/receipts", { ...d, bookingId: selectedBooking?.id, projectId: Number(selectedProject), amount: Number(d.amount), penaltyAmount: Number(d.amount), receiptType: "penalty" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["receipts-penalty"] }); setSelectedBooking(null); reset({ receiptDate: new Date().toISOString().split("T")[0], paymentMode: "cheque" }); alert("Penalty receipt saved!"); },
    onError: (e: any) => alert(e.response?.data?.message || "Error"),
  });
  const filteredBookings = (bookings as any[]).filter((b: any) => !search || b.registrationNo?.toLowerCase().includes(search.toLowerCase()) || (b.Applicants?.[0]?.firstName + " " + b.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <PageHeader title="Penalty Receipt" subtitle="Collect and record penalty / late fee receipts" />
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
                <table className="w-full text-xs"><thead><tr className="bg-slate-700 text-white sticky top-0"><th className="px-2 py-1.5 text-left">Reg. No.</th><th className="px-2 py-1.5 text-left">Customer</th><th className="px-2 py-1.5">Select</th></tr></thead>
                  <tbody>{filteredBookings.map((b: any, i) => <tr key={b.id} className={selectedBooking?.id === b.id ? "bg-orange-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-2 py-1 font-medium">{b.registrationNo}</td><td className="px-2 py-1">{b.Applicants?.[0]?.firstName} {b.Applicants?.[0]?.lastName}</td><td className="px-2 py-1 text-center"><Button size="sm" variant={selectedBooking?.id === b.id ? "default" : "outline"} className="h-5 text-xs px-2" onClick={() => setSelectedBooking(b)}>Select</Button></td></tr>)}</tbody>
                </table>
              </div>
            )}
          </div>
          {selectedBooking && (
            <div className="bg-white p-4 rounded border shadow-sm">
              <p className="text-xs font-bold text-orange-600 mb-3">Penalty for: {selectedBooking.Applicants?.[0]?.firstName} {selectedBooking.Applicants?.[0]?.lastName} — {selectedBooking.registrationNo}</p>
              <form onSubmit={handleSubmit(d => save.mutate(d))} className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Receipt No. *</Label><Input {...register("receiptNo")} placeholder="PEN/2026/001" className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Receipt Date</Label><Input type="date" {...register("receiptDate")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Payment Mode</Label>
                  <select {...register("paymentMode")} className="w-full border rounded px-2 h-9 text-sm mt-1">
                    <option value="cash">Cash</option><option value="cheque">Cheque</option><option value="online">Online</option><option value="neft">NEFT</option>
                  </select>
                </div>
                <div><Label className="text-xs">Penalty Amount (Rs.) *</Label><Input type="number" step="0.01" {...register("amount")} className="mt-1 h-9 text-sm" /></div>
                <div className="col-span-2"><Label className="text-xs">Narration / Reason</Label><Input {...register("narration")} placeholder="Late payment penalty for..." className="mt-1 h-9 text-sm" /></div>
                <div className="col-span-2 flex gap-2 border-t pt-2">
                  <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Save Penalty Receipt</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setSelectedBooking(null)}>Cancel</Button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Penalty Receipts ({penaltyList.length})</h3>
          <div className="space-y-2">{penaltyList.slice(0, 15).map((r: any) => (
            <div key={r.id} className="bg-red-50 rounded p-2.5 border border-red-100 text-xs">
              <div className="flex justify-between"><span className="font-semibold">{r.receiptNo}</span><span className="font-bold text-red-600">Rs.{Number(r.totalAmount).toLocaleString("en-IN")}</span></div>
              <div className="text-gray-500">{r.Booking?.Applicants?.[0]?.firstName} {r.Booking?.Applicants?.[0]?.lastName} · {r.receiptDate}</div>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

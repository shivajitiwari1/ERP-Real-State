import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FD = { transferDate: string; transferFee: number; serviceTax: number; };

export default function TransferApplicationPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState("");
  const [searchReg, setSearchReg] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: bookings = [] } = useQuery({ queryKey: ["bookings-transfer", selectedProject], queryFn: () => axios.get("/api/application/bookings?projectId=" + selectedProject + "&status=active").then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset } = useForm<FD>({ defaultValues: { transferDate: new Date().toISOString().split("T")[0], transferFee: 0, serviceTax: 0 } });
  const save = useMutation({
    mutationFn: (d: FD) => axios.post("/api/application/transfer", { ...d, fromBookingId: selectedBooking?.id, transferFee: Number(d.transferFee), serviceTax: Number(d.serviceTax) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["transfers"] }); setSelectedBooking(null); reset({ transferDate: new Date().toISOString().split("T")[0], transferFee: 0, serviceTax: 0 }); alert("Transfer application submitted!"); },
    onError: (e: any) => alert(e.response?.data?.message || "Error"),
  });
  const filteredBookings = (bookings as any[]).filter((b: any) => !searchReg || b.registrationNo?.toLowerCase().includes(searchReg.toLowerCase()) || (b.Applicants?.[0]?.firstName + " " + b.Applicants?.[0]?.lastName).toLowerCase().includes(searchReg.toLowerCase()));
  return (
    <div>
      <PageHeader title="Transfer Application" subtitle="Apply for ownership transfer of a booked unit" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border shadow-sm space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Project</Label>
                <select value={selectedProject} onChange={e => { setSelectedProject(e.target.value); setSelectedBooking(null); }} className="w-full border rounded px-2 h-9 text-sm mt-1">
                  <option value="">-- Select Project --</option>
                  {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div><Label className="text-xs">Search Booking</Label>
                <input value={searchReg} onChange={e => setSearchReg(e.target.value)} placeholder="Reg. no. or name..." className="w-full border rounded px-2 h-9 text-sm mt-1" />
              </div>
            </div>
            {selectedProject && (
              <div className="overflow-auto max-h-48 border rounded">
                <table className="w-full text-xs">
                  <thead><tr className="bg-purple-700 text-white sticky top-0"><th className="px-2 py-1.5 text-left">Reg. No.</th><th className="px-2 py-1.5 text-left">Customer</th><th className="px-2 py-1.5 text-left">Select</th></tr></thead>
                  <tbody>{filteredBookings.map((b: any, i) => (
                    <tr key={b.id} className={selectedBooking?.id === b.id ? "bg-orange-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-2 py-1 font-medium">{b.registrationNo}</td>
                      <td className="px-2 py-1">{b.Applicants?.[0]?.firstName} {b.Applicants?.[0]?.lastName}</td>
                      <td className="px-2 py-1"><Button size="sm" variant={selectedBooking?.id === b.id ? "default" : "outline"} className="h-5 text-xs px-2" onClick={() => setSelectedBooking(b)}>Select</Button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
          {selectedBooking && (
            <div className="bg-white p-4 rounded border shadow-sm">
              <p className="text-xs font-bold text-orange-600 mb-3">Transfer From: {selectedBooking.Applicants?.[0]?.firstName} {selectedBooking.Applicants?.[0]?.lastName} — {selectedBooking.registrationNo}</p>
              <div className="bg-amber-50 border border-amber-200 rounded p-2.5 mb-3 text-xs text-amber-700">New owner details should be updated in the booking after transfer approval.</div>
              <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Transfer Date</Label><Input type="date" {...register("transferDate")} className="mt-1 h-9 text-sm" /></div>
                  <div><Label className="text-xs">Transfer Fee (Rs.)</Label><Input type="number" step="100" {...register("transferFee")} className="mt-1 h-9 text-sm" /></div>
                  <div><Label className="text-xs">Service Tax (Rs.)</Label><Input type="number" step="0.01" {...register("serviceTax")} className="mt-1 h-9 text-sm" /></div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Submit Transfer</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setSelectedBooking(null)}>Cancel</Button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="bg-white p-4 rounded border shadow-sm">
          <h3 className="text-xs font-bold text-slate-600 mb-2 pb-1 border-b uppercase">Transfer Process</h3>
          <ol className="space-y-3 text-xs mt-3">
            {["Select the booking whose ownership needs to be transferred", "Submit transfer application with applicable fees", "Management reviews and approves transfer request", "Update new owner details in the booking record", "Generate fresh agreement in the new owner name", "Update all system records with new applicant details"].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs">{i + 1}</span>
                <span className="text-slate-600 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

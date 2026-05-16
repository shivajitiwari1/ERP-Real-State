import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FD = { bankId?: number; branch?: string; contactPerson?: string; contactNo?: string; fileNo?: string; fileDate?: string; sanctionedAmount?: number; bankInfo?: string; };

export default function LoanProcessPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState("");
  const [searchReg, setSearchReg] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: bookings = [] } = useQuery({ queryKey: ["bookings-loan", selectedProject], queryFn: () => axios.get("/api/application/bookings?projectId=" + selectedProject + "&status=active").then(r => r.data.data), enabled: !!selectedProject });
  const { data: banks = [] } = useQuery({ queryKey: ["banks-loan"], queryFn: () => axios.get("/api/master/setup/bank/loan").then(r => r.data.data) });
  const { data: allLoans = [] } = useQuery({ queryKey: ["loans-list", selectedProject], queryFn: () => axios.get("/api/application/loan?projectId=" + selectedProject).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset } = useForm<FD>();
  const save = useMutation({
    mutationFn: (d: FD) => axios.post("/api/application/loan", { ...d, bookingId: selectedBooking?.id, bankId: d.bankId ? Number(d.bankId) : null, sanctionedAmount: d.sanctionedAmount ? Number(d.sanctionedAmount) : null }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["loans-list"] }); alert("Loan details saved!"); },
    onError: (e: any) => alert(e.response?.data?.message || "Error"),
  });
  const filteredBookings = (bookings as any[]).filter((b: any) => !searchReg || b.registrationNo?.toLowerCase().includes(searchReg.toLowerCase()) || (b.Applicants?.[0]?.firstName + " " + b.Applicants?.[0]?.lastName).toLowerCase().includes(searchReg.toLowerCase()));
  return (
    <div>
      <PageHeader title="Loan Process" subtitle="Track home loan details for each booking" />
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
              <div><Label className="text-xs">Search Booking</Label>
                <input value={searchReg} onChange={e => setSearchReg(e.target.value)} placeholder="Reg. no. or name..." className="w-full border rounded px-2 h-9 text-sm mt-1" />
              </div>
            </div>
            {selectedProject && (
              <div className="overflow-auto max-h-36 border rounded">
                <table className="w-full text-xs">
                  <thead><tr className="bg-slate-700 text-white sticky top-0">
                    <th className="px-2 py-1.5 text-left">Reg. No.</th>
                    <th className="px-2 py-1.5 text-left">Customer</th>
                    <th className="px-2 py-1.5 text-left">Select</th>
                  </tr></thead>
                  <tbody>{filteredBookings.map((b: any, i) => (
                    <tr key={b.id} className={selectedBooking?.id === b.id ? "bg-orange-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-2 py-1 font-medium">{b.registrationNo}</td>
                      <td className="px-2 py-1">{b.Applicants?.[0]?.firstName} {b.Applicants?.[0]?.lastName}</td>
                      <td className="px-2 py-1">
                        <Button size="sm" variant={selectedBooking?.id === b.id ? "default" : "outline"} className="h-5 text-xs px-2" onClick={() => setSelectedBooking(b)}>Select</Button>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
          {selectedBooking && (
            <div className="bg-white p-4 rounded border shadow-sm">
              <p className="text-xs font-bold text-orange-600 mb-3">Loan: {selectedBooking.Applicants?.[0]?.firstName} {selectedBooking.Applicants?.[0]?.lastName} — {selectedBooking.registrationNo}</p>
              <form onSubmit={handleSubmit(d => save.mutate(d))} className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Bank</Label>
                  <select {...register("bankId")} className="w-full border rounded px-2 h-9 text-sm mt-1">
                    <option value="">-- Select Bank --</option>
                    {(banks as any[]).map((b: any) => <option key={b.id} value={b.id}>{b.bankName}</option>)}
                  </select>
                </div>
                <div><Label className="text-xs">Branch</Label><Input {...register("branch")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Contact Person</Label><Input {...register("contactPerson")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Contact No.</Label><Input {...register("contactNo")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">File No.</Label><Input {...register("fileNo")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">File Date</Label><Input type="date" {...register("fileDate")} className="mt-1 h-9 text-sm" /></div>
                <div className="col-span-2"><Label className="text-xs">Sanctioned Amount (Rs.)</Label><Input type="number" {...register("sanctionedAmount")} className="mt-1 h-9 text-sm" /></div>
                <div className="col-span-2"><Label className="text-xs">Bank Info</Label><Input {...register("bankInfo")} placeholder="Additional information..." className="mt-1 h-9 text-sm" /></div>
                <div className="col-span-2 flex gap-2 border-t pt-2">
                  <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Save Loan Details</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => { setSelectedBooking(null); reset(); }}>Cancel</Button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Loan Records ({(allLoans as any[]).length})</h3>
          <div className="space-y-2">{(allLoans as any[]).slice(0, 15).map((l: any) => (
            <div key={l.id} className="bg-gray-50 rounded p-2.5 border text-xs">
              <div className="font-semibold">{l.Booking?.Applicants?.[0]?.firstName} {l.Booking?.Applicants?.[0]?.lastName}</div>
              <div className="text-gray-500">{l.Booking?.registrationNo} · {l.BankLoan?.bankName || "Bank TBD"}</div>
              {l.sanctionedAmount && <div className="text-orange-600 font-semibold mt-0.5">Rs.{Number(l.sanctionedAmount).toLocaleString("en-IN")}</div>}
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

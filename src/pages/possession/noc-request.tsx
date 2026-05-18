import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NocRequestPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: bookings = [] } = useQuery({ queryKey: ["bookings-noc", selectedProject], queryFn: () => axios.get("/api/application/bookings?projectId=" + selectedProject + "&status=active").then(r => r.data.data), enabled: !!selectedProject });
  const { data: nocs = [] } = useQuery({ queryKey: ["nocs", selectedProject], queryFn: () => axios.get("/api/possession/noc?projectId=" + selectedProject).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset } = useForm<any>({ defaultValues: { requestDate: new Date().toISOString().split("T")[0], status: "pending" } });
  const save = useMutation({
    mutationFn: (d: any) => axios.post("/api/possession/noc", { ...d, bookingId: selectedBooking?.id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["nocs"] }); setSelectedBooking(null); reset(); alert("NOC request saved!"); },
    onError: (e: any) => alert(e.response?.data?.message || "Error"),
  });
  const approve = useMutation({ mutationFn: ({ id, status }: any) => axios.put("/api/possession/noc", { id, status, approvedDate: new Date().toISOString().split("T")[0] }), onSuccess: () => qc.invalidateQueries({ queryKey: ["nocs"] }) });
  const filtered = (bookings as any[]).filter((b: any) => !search || b.registrationNo?.toLowerCase().includes(search.toLowerCase()) || (b.Applicants?.[0]?.firstName + " " + b.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()));
  const STATUS_BADGE: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };
  return (
    <div>
      <PageHeader title="NOC Request" subtitle="Manage No Objection Certificate requests for loan/resale" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border shadow-sm space-y-3">
            <div><Label className="text-xs">Project</Label>
              <select value={selectedProject} onChange={e => { setSelectedProject(e.target.value); setSelectedBooking(null); }} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Project --</option>
                {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Search Booking</Label><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Reg. no. or customer..." className="w-full border rounded px-2 h-9 text-sm mt-1" /></div>
            {selectedProject && <div className="overflow-auto max-h-36 border rounded"><table className="w-full text-xs"><thead><tr className="bg-purple-700 text-white sticky top-0"><th className="px-2 py-1.5 text-left">Reg. No.</th><th className="px-2 py-1.5 text-left">Customer</th><th className="px-2 py-1.5">Select</th></tr></thead><tbody>{filtered.map((b: any, i) => <tr key={b.id} className={selectedBooking?.id === b.id ? "bg-orange-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-2 py-1 font-medium">{b.registrationNo}</td><td className="px-2 py-1">{b.Applicants?.[0]?.firstName} {b.Applicants?.[0]?.lastName}</td><td className="px-2 py-1 text-center"><Button size="sm" variant={selectedBooking?.id === b.id ? "default" : "outline"} className="h-5 text-xs px-2" onClick={() => setSelectedBooking(b)}>Select</Button></td></tr>)}</tbody></table></div>}
          </div>
          {selectedBooking && (
            <div className="bg-white p-4 rounded border shadow-sm">
              <p className="text-xs font-bold text-orange-600 mb-3">NOC for: {selectedBooking.Applicants?.[0]?.firstName} {selectedBooking.Applicants?.[0]?.lastName}</p>
              <form onSubmit={handleSubmit(d => save.mutate(d))} className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Request Date</Label><Input type="date" {...register("requestDate")} className="mt-1 h-9 text-sm" /></div>
                <div className="col-span-2"><Label className="text-xs">Remarks</Label><Input {...register("remarks")} placeholder="Purpose of NOC (e.g. Home Loan, Resale)..." className="mt-1 h-9 text-sm" /></div>
                <div className="col-span-2 flex gap-2 border-t pt-2">
                  <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Submit NOC Request</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setSelectedBooking(null)}>Cancel</Button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">NOC Requests ({(nocs as any[]).length})</h3>
          <div className="space-y-2">{(nocs as any[]).map((n: any) => (
            <div key={n.id} className="bg-gray-50 rounded p-2.5 border text-xs">
              <div className="flex justify-between items-start">
                <div><div className="font-semibold">{n.Booking?.Applicants?.[0]?.firstName} {n.Booking?.Applicants?.[0]?.lastName}</div><div className="text-gray-400">{n.Booking?.registrationNo} · {n.requestDate}</div></div>
                <span className={"px-1.5 py-0.5 rounded font-medium " + (STATUS_BADGE[n.status] || "bg-gray-100")}>{n.status}</span>
              </div>
              {n.remarks && <div className="text-gray-400 mt-1">{n.remarks}</div>}
              {n.status === "pending" && <div className="flex gap-1 mt-2"><Button size="sm" className="h-5 text-xs px-2 bg-green-600 hover:bg-green-700" onClick={() => approve.mutate({ id: n.id, status: "approved" })}>Approve</Button><Button size="sm" variant="destructive" className="h-5 text-xs px-2" onClick={() => approve.mutate({ id: n.id, status: "rejected" })}>Reject</Button></div>}
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

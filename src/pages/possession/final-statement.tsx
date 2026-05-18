import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useRef } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function FinalStatementPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: bookings = [] } = useQuery({ queryKey: ["bookings-fs", selectedProject], queryFn: () => axios.get("/api/application/bookings?projectId=" + selectedProject + "&status=active").then(r => r.data.data), enabled: !!selectedProject });
  const { data: detail } = useQuery({ queryKey: ["booking-fs-detail", selected?.id], queryFn: () => axios.get("/api/application/bookings/" + selected?.id).then(r => r.data.data), enabled: !!selected?.id });
  const generate = useMutation({
    mutationFn: (d: any) => axios.post("/api/possession/final-statement", d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["final-statements"] }); alert("Final statement generated!"); },
  });
  const filtered = (bookings as any[]).filter((b: any) => !search || b.registrationNo?.toLowerCase().includes(search.toLowerCase()) || (b.Applicants?.[0]?.firstName + " " + b.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()));
  const totalCost = detail ? Number(detail.totalCost || 0) : 0;
  const totalPaid = detail ? (detail.Receipts || []).reduce((s: number, r: any) => s + Number(r.totalAmount || 0), 0) : 0;
  const balance = totalCost - totalPaid;
  function printStatement() { if (!printRef.current) return; const w = window.open("", "_blank"); if (!w) return; w.document.write("<html><head><title>Final Statement</title><style>body{font-family:Arial;padding:20px;font-size:11px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccc;padding:6px}</style></head><body>" + printRef.current.innerHTML + "</body></html>"); w.document.close(); w.print(); }
  return (
    <div>
      <PageHeader title="Final Statement" subtitle="Generate final account statement before possession handover" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border shadow-sm flex gap-3 flex-wrap">
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48"><option value="">-- Select Project --</option>{(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer..." className="border rounded px-3 h-9 text-sm flex-1 min-w-48" />
          </div>
          <div className="bg-white rounded border shadow-sm overflow-auto max-h-80">
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-purple-700 text-white sticky top-0">{["Customer","Reg. No.","Unit","Select"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
              <tbody>{filtered.slice(0, 30).map((b: any, i) => <tr key={b.id} className={selected?.id === b.id ? "bg-orange-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-2 py-1.5 font-medium">{b.Applicants?.[0]?.firstName} {b.Applicants?.[0]?.lastName}</td><td className="px-2 py-1.5">{b.registrationNo}</td><td className="px-2 py-1.5">{b.Unit?.unitNo || "-"}</td><td className="px-2 py-1.5"><Button size="sm" variant={selected?.id === b.id ? "default" : "outline"} className="h-5 text-xs px-2" onClick={() => setSelected(b)}>Select</Button></td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <div>
          {detail ? (
            <div className="bg-white rounded border shadow-sm">
              <div className="px-4 py-3 border-b flex justify-between items-center">
                <span className="text-sm font-bold">Final Statement</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={printStatement}>Print</Button>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => generate.mutate({ bookingId: detail.id, totalCost, totalPaid, balance, generatedDate: new Date().toISOString().split("T")[0] })} disabled={generate.isPending}>Generate</Button>
                </div>
              </div>
              <div ref={printRef} className="p-4 text-xs space-y-3">
                <div className="text-center border-b pb-2"><h2 className="font-bold text-sm">FINAL ACCOUNT STATEMENT</h2><p className="text-gray-500">Date: {new Date().toLocaleDateString("en-IN")}</p></div>
                <div className="grid grid-cols-2 gap-2 text-xs border-b pb-2"><div><strong>Customer:</strong> {detail.Applicants?.[0]?.firstName} {detail.Applicants?.[0]?.lastName}</div><div><strong>Reg. No.:</strong> {detail.registrationNo}</div><div><strong>Project:</strong> {detail.Project?.name}</div><div><strong>Unit:</strong> {detail.Unit?.unitNo || "-"}</div></div>
                <table className="w-full border-collapse border text-xs"><tbody><tr><td className="border px-2 py-1.5 bg-slate-50 font-bold">Total Cost of Property</td><td className="border px-2 py-1.5 text-right font-bold">Rs.{totalCost.toLocaleString("en-IN")}</td></tr><tr><td className="border px-2 py-1.5 bg-slate-50">Total Amount Received</td><td className="border px-2 py-1.5 text-right text-green-600">Rs.{totalPaid.toLocaleString("en-IN")}</td></tr><tr><td className="border px-2 py-1.5 bg-slate-50 font-bold">Balance Payable</td><td className={"border px-2 py-1.5 text-right font-bold " + (balance > 0 ? "text-red-600" : "text-green-600")}>Rs.{Math.abs(balance).toLocaleString("en-IN")} {balance > 0 ? "(Due)" : "(Credit)"}</td></tr></tbody></table>
              </div>
            </div>
          ) : <div className="bg-white rounded border shadow-sm p-8 text-center text-gray-400 italic">Select a booking to generate final statement</div>}
        </div>
      </div>
    </div>
  );
}

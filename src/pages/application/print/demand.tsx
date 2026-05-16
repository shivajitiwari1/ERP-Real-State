import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useRef } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function PrintDemandPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery({ queryKey: ["demands-print", selectedProject], queryFn: () => axios.get("/api/application/demand/list?projectId=" + selectedProject + "&status=pending").then(r => r.data.data), enabled: !!selectedProject });
  const filtered = (demands as any[]).filter((d: any) => !search || (d.Booking?.Applicants?.[0]?.firstName + " " + d.Booking?.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()));
  function printDemand() { if (!printRef.current) return; const w = window.open("", "_blank"); if (!w) return; w.document.write("<html><head><title>Demand Letter</title><style>body{font-family:Arial;padding:20px;font-size:12px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccc;padding:6px;font-size:11px}</style></head><body>" + printRef.current.innerHTML + "</body></html>"); w.document.close(); w.print(); }
  return (
    <div>
      <PageHeader title="Print Demand" subtitle="Generate and print demand letters" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border shadow-sm flex gap-3 flex-wrap">
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48"><option value="">-- Select Project --</option>{(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer..." className="border rounded px-3 h-9 text-sm flex-1 min-w-48" />
          </div>
          <div className="bg-white rounded border shadow-sm overflow-auto max-h-96">
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-slate-700 text-white sticky top-0">{["Customer","Reg. No.","Due Date","Amount","Select"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
              <tbody>{isLoading ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr> : filtered.slice(0, 30).map((d: any, i) => (
                <tr key={d.id} className={selected?.id === d.id ? "bg-orange-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-2 py-1.5 font-medium">{d.Booking?.Applicants?.[0]?.firstName} {d.Booking?.Applicants?.[0]?.lastName}</td>
                  <td className="px-2 py-1.5">{d.Booking?.registrationNo}</td>
                  <td className="px-2 py-1.5 text-red-500">{d.dueDate || "-"}</td>
                  <td className="px-2 py-1.5 font-semibold">Rs.{Number(d.totalAmount).toLocaleString("en-IN")}</td>
                  <td className="px-2 py-1.5"><Button size="sm" variant={selected?.id === d.id ? "default" : "outline"} className="h-5 text-xs px-2" onClick={() => setSelected(d)}>Select</Button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div>
          {selected ? (
            <div className="bg-white rounded border shadow-sm">
              <div className="px-4 py-3 border-b flex justify-between items-center">
                <span className="text-sm font-bold">Demand Letter Preview</span>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={printDemand}>Print</Button>
              </div>
              <div ref={printRef} className="p-6 text-xs space-y-4">
                <div className="text-center border-b pb-3"><h2 className="font-bold text-base">DEMAND NOTICE</h2><p className="text-gray-500">Date: {new Date().toLocaleDateString("en-IN")}</p></div>
                <div><p>To,</p><p className="font-semibold">{selected.Booking?.Applicants?.[0]?.firstName} {selected.Booking?.Applicants?.[0]?.lastName}</p><p>Reg. No.: {selected.Booking?.registrationNo}</p></div>
                <p>Dear Sir/Madam,</p>
                <p>This is to inform you that the following payment is due as per your payment schedule:</p>
                <table className="w-full border-collapse border text-xs mt-2"><tbody><tr><td className="border px-2 py-1 bg-gray-50">Demand Date</td><td className="border px-2 py-1">{selected.demandDate}</td></tr><tr><td className="border px-2 py-1 bg-gray-50">Due Date</td><td className="border px-2 py-1 font-semibold text-red-600">{selected.dueDate || "-"}</td></tr><tr><td className="border px-2 py-1 bg-gray-50">Amount</td><td className="border px-2 py-1">Rs.{Number(selected.amount).toLocaleString("en-IN")}</td></tr><tr><td className="border px-2 py-1 bg-gray-50">Tax</td><td className="border px-2 py-1">Rs.{Number(selected.taxAmount).toLocaleString("en-IN")}</td></tr><tr><td className="border px-2 py-1 bg-gray-50 font-bold">Total</td><td className="border px-2 py-1 font-bold">Rs.{Number(selected.totalAmount).toLocaleString("en-IN")}</td></tr></tbody></table>
                <p>Please clear the above amount on or before the due date to avoid interest charges.</p>
                <div className="mt-6 pt-4 border-t"><p>For RealBoost</p><p className="mt-4 font-semibold">Authorized Signatory</p></div>
              </div>
            </div>
          ) : <div className="bg-white rounded border shadow-sm p-8 text-center text-gray-400 italic">Select a demand to preview the letter</div>}
        </div>
      </div>
    </div>
  );
}

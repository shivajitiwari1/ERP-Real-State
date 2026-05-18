import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DISPATCH_MODES = ["Courier", "Speed Post", "Registered Post", "Hand Delivery", "Email", "WhatsApp"];

export default function DispatchMasterPage() {
  const [dispatches, setDispatches] = useState([{ id: 1, docType: "Demand Letter", mode: "Courier", recipient: "Customer", days: 3 }]);
  const [form, setForm] = useState({ docType: "", mode: "Courier", recipient: "Customer", days: 1 });
  return (
    <div>
      <PageHeader title="Dispatch Master" subtitle="Configure document dispatch modes and timelines" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-600 uppercase pb-1 border-b">Add Dispatch Config</h3>
          <div><Label className="text-xs">Document Type</Label><Input value={form.docType} onChange={e => setForm({ ...form, docType: e.target.value })} placeholder="e.g. Demand Letter, Agreement" className="mt-1 h-9 text-sm" /></div>
          <div><Label className="text-xs">Dispatch Mode</Label>
            <select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })} className="w-full border rounded px-2 h-9 text-sm mt-1">
              {DISPATCH_MODES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Recipient</Label><Input value={form.recipient} onChange={e => setForm({ ...form, recipient: e.target.value })} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">TAT (days)</Label><Input type="number" value={form.days} onChange={e => setForm({ ...form, days: Number(e.target.value) })} className="mt-1 h-9 text-sm" /></div>
          </div>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => { if (form.docType) { setDispatches([...dispatches, { id: Date.now(), ...form }]); setForm({ docType: "", mode: "Courier", recipient: "Customer", days: 1 }); } }}>Add</Button>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Dispatch Configs ({dispatches.length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{["Document","Mode","Recipient","TAT","Action"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{dispatches.map((d, i) => <tr key={d.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-2 py-2 font-medium">{d.docType}</td><td className="px-2 py-2">{d.mode}</td><td className="px-2 py-2">{d.recipient}</td><td className="px-2 py-2">{d.days}d</td><td className="px-2 py-2"><Button size="sm" variant="destructive" className="h-5 text-xs px-1.5" onClick={() => setDispatches(dispatches.filter(x => x.id !== d.id))}>Del</Button></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

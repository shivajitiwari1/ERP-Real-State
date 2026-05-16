import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

export default function SubBrokerPage() {
  const [search, setSearch] = useState("");
  const [parentBroker, setParentBroker] = useState("");
  const { data: brokers = [] } = useQuery({ queryKey: ["brokers"], queryFn: () => axios.get("/api/broker").then(r => r.data.data) });
  const filtered = (brokers as any[]).filter((b: any) => !search || (b.firstName + " " + b.lastName + " " + b.code).toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <PageHeader title="Sub-Broker Management" subtitle="Manage sub-broker hierarchy and assignments" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3 flex-wrap">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search broker..." className="border rounded px-3 h-9 text-sm flex-1 min-w-48" />
          <select value={parentBroker} onChange={e => setParentBroker(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48">
            <option value="">All Parent Brokers</option>
            {(brokers as any[]).map((b: any) => <option key={b.id} value={b.id}>{b.code} - {b.firstName} {b.lastName}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <div className="px-4 py-2.5 border-b bg-gradient-to-r from-slate-800 to-slate-700"><span className="text-xs font-bold uppercase text-slate-300">Broker Network</span></div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{["Code","Name","Designation","Mobile","Email","PAN","Status"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{filtered.map((b: any, i) => (
              <tr key={b.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-2 font-medium">{b.code}</td>
                <td className="px-2 py-2">{b.firstName} {b.lastName}</td>
                <td className="px-2 py-2">{b.designation || "-"}</td>
                <td className="px-2 py-2">{b.mobile || "-"}</td>
                <td className="px-2 py-2">{b.email || "-"}</td>
                <td className="px-2 py-2 font-mono">{b.panNo || "-"}</td>
                <td className="px-2 py-2"><span className={"px-1.5 py-0.5 rounded text-xs " + (b.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>{b.isActive ? "Active" : "Inactive"}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

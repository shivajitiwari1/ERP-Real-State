import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

export default function SmsTrackerPage() {
  const [search, setSearch] = useState("");
  const { data: logs = [], isLoading } = useQuery({ queryKey: ["sms-logs"], queryFn: () => axios.get("/api/communication/sms-log").then(r => r.data.data) });
  const filtered = (logs as any[]).filter((l: any) => !search || l.mobile?.includes(search) || l.message?.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <PageHeader title="SMS Tracker" subtitle="Log of all outgoing SMS messages sent from the system" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search mobile or message..." className="border rounded px-3 h-9 text-sm flex-1" />
          <span className="text-xs self-center text-gray-500">{filtered.length} messages</span>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{["#","Mobile","Message","Status","Sent At"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{isLoading ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-gray-400 italic">No SMS logs</td></tr> : filtered.map((l: any, i) => (
              <tr key={l.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-2 text-gray-400">{i + 1}</td>
                <td className="px-2 py-2 font-mono">{l.mobile}</td>
                <td className="px-2 py-2 max-w-64 truncate" title={l.message}>{l.message}</td>
                <td className="px-2 py-2"><span className={"px-1.5 py-0.5 rounded text-xs font-medium " + (l.status === "sent" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{l.status}</span></td>
                <td className="px-2 py-2 text-gray-400">{l.sentAt ? new Date(l.sentAt).toLocaleString("en-IN") : "-"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

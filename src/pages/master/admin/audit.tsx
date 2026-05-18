import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const { data: logs = [], isLoading } = useQuery({ queryKey: ["journal-all"], queryFn: () => axios.get("/api/application/journal").then(r => r.data.data) });
  const filtered = (logs as any[]).filter((l: any) => !search || l.narration?.toLowerCase().includes(search.toLowerCase()) || l.entryType?.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <PageHeader title="Audit Log" subtitle="System audit trail of journal entries and adjustments" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search narration or type..." className="border rounded px-3 h-9 text-sm flex-1" />
          <span className="text-xs self-center text-gray-500">{filtered.length} entries</span>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{["#","Date","Type","Booking","Amount","Narration"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{isLoading ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-gray-400 italic">No audit entries</td></tr> : filtered.map((l: any, i) => (
              <tr key={l.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-2 text-gray-400">{i + 1}</td>
                <td className="px-2 py-2">{l.entryDate}</td>
                <td className="px-2 py-2"><span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">{l.entryType}</span></td>
                <td className="px-2 py-2">{l.Booking?.registrationNo || l.bookingId}</td>
                <td className="px-2 py-2 font-semibold">Rs.{Number(l.amount).toLocaleString("en-IN")}</td>
                <td className="px-2 py-2 text-gray-500 italic">{l.narration || "-"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

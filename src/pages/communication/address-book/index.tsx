import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

export default function AddressBookPage() {
  const [search, setSearch] = useState("");
  const { data: bookings = [], isLoading } = useQuery({ queryKey: ["addr-book"], queryFn: () => axios.get("/api/application/bookings?status=active").then(r => r.data.data) });
  const filtered = (bookings as any[]).filter((b: any) => !search || (b.Applicants?.[0]?.firstName + " " + b.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()) || b.Applicants?.[0]?.ApplicantAddresses?.[0]?.mobile1?.includes(search) || b.Applicants?.[0]?.email1?.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <PageHeader title="Address Book" subtitle="Customer contact directory from active bookings" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, mobile, or email..." className="border rounded px-3 h-9 text-sm flex-1" />
          <span className="text-xs self-center text-gray-500">{filtered.length} contacts</span>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{["#","Name","Mobile","Email","Project","Reg. No."].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{isLoading ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr> : filtered.slice(0, 100).map((b: any, i) => {
              const p = b.Applicants?.[0];
              const addr = p?.ApplicantAddresses?.[0];
              return (
                <tr key={b.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-2 py-2 text-gray-400">{i + 1}</td>
                  <td className="px-2 py-2 font-medium">{p?.salutation} {p?.firstName} {p?.lastName}</td>
                  <td className="px-2 py-2 font-mono">{addr?.mobile1 || "-"}</td>
                  <td className="px-2 py-2">{p?.email1 || "-"}</td>
                  <td className="px-2 py-2">{b.Project?.name || "-"}</td>
                  <td className="px-2 py-2">{b.registrationNo}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

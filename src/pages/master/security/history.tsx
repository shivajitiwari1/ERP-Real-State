import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PageHeader from "@/components/shared/PageHeader";

export default function SecurityHistoryPage() {
  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: () => axios.get("/api/master/users").then(r => r.data.data) });
  return (
    <div>
      <PageHeader title="Security History" subtitle="Password change and security event history" />
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-700">Full security audit logging requires event logging configuration. Displaying current user access levels as reference.</div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <div className="px-4 py-2.5 border-b bg-gradient-to-r from-slate-800 to-slate-700"><span className="text-xs font-bold uppercase text-slate-300">User Access Levels</span></div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">{["Username","Name","Role","Last Login","Status"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(users as any[]).map((u: any, i) => <tr key={u.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-3 py-2 font-mono">{u.username}</td><td className="px-3 py-2">{u.firstName} {u.lastName}</td><td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">{u.Role?.name || "User"}</span></td><td className="px-3 py-2 text-gray-400">{u.lastLogin ? new Date(u.lastLogin).toLocaleString("en-IN") : "Never"}</td><td className="px-3 py-2"><span className={"px-1.5 py-0.5 rounded text-xs " + (u.isActive ? "bg-green-100 text-green-700" : "bg-gray-100")}>{u.isActive ? "Active" : "Inactive"}</span></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

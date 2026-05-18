import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PageHeader from "@/components/shared/PageHeader";

export default function LoginViewPage() {
  const { data: users = [], isLoading } = useQuery({ queryKey: ["users"], queryFn: () => axios.get("/api/master/users").then(r => r.data.data) });
  return (
    <div>
      <PageHeader title="Login View" subtitle="Manage system user accounts and access" />
      <div className="bg-white rounded border shadow-sm overflow-auto">
        <div className="px-4 py-2.5 border-b bg-gradient-to-r from-slate-800 to-slate-700 flex justify-between items-center">
          <span className="text-xs font-bold uppercase text-slate-300">System Users ({(users as any[]).length})</span>
        </div>
        <table className="w-full text-xs border-collapse">
          <thead><tr className="bg-slate-100">{["#","Username","Name","Role","Status","Actions"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>{isLoading ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr> : (users as any[]).map((u: any, i) => (
            <tr key={u.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-3 py-2 text-gray-400">{i + 1}</td>
              <td className="px-3 py-2 font-mono font-medium">{u.username}</td>
              <td className="px-3 py-2">{u.firstName} {u.lastName}</td>
              <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">{u.Role?.name || u.role || "User"}</span></td>
              <td className="px-3 py-2"><span className={"px-1.5 py-0.5 rounded text-xs " + (u.isActive ? "bg-green-100 text-green-700" : "bg-gray-100")}>{u.isActive ? "Active" : "Inactive"}</span></td>
              <td className="px-3 py-2 text-gray-400">—</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

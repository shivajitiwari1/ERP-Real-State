import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PageHeader from "@/components/shared/PageHeader";

export default function ManagerPage() {
  const { data: employees = [], isLoading } = useQuery({ queryKey: ["employees"], queryFn: () => axios.get("/api/master/employee/info").then(r => r.data.data) });
  const managers = (employees as any[]).filter((e: any) => e.designation?.toLowerCase().includes("manager") || e.designation?.toLowerCase().includes("director") || e.designation?.toLowerCase().includes("head"));
  return (
    <div>
      <PageHeader title="Manager" subtitle="View all managerial staff" />
      <div className="bg-white rounded border shadow-sm overflow-auto">
        <div className="px-4 py-2.5 border-b bg-gradient-to-r from-slate-800 to-slate-700"><span className="text-xs font-bold uppercase text-slate-300">Management Team ({managers.length})</span></div>
        <table className="w-full text-xs border-collapse">
          <thead><tr className="bg-slate-100">{["Code","Name","Designation","Department","Mobile","Email"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>{isLoading ? <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr> : managers.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-gray-400 italic">No managers found. Add employees with manager designation.</td></tr> : managers.map((e: any, i) => <tr key={e.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-3 py-2 font-mono">{e.empCode || "-"}</td><td className="px-3 py-2 font-medium">{e.firstName} {e.lastName}</td><td className="px-3 py-2">{e.designation || "-"}</td><td className="px-3 py-2">{e.Department?.name || "-"}</td><td className="px-3 py-2">{e.mobile || "-"}</td><td className="px-3 py-2">{e.email || "-"}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

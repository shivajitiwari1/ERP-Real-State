import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PageHeader from "@/components/shared/PageHeader";

export default function EmployeeReportPage() {
  const { data: employees = [], isLoading } = useQuery({ queryKey: ["employees"], queryFn: () => axios.get("/api/master/employee/info").then(r => r.data.data) });
  const { data: departments = [] } = useQuery({ queryKey: ["departments"], queryFn: () => axios.get("/api/master/employee/department").then(r => r.data.data) });
  const deptStats = (departments as any[]).map((d: any) => ({ ...d, count: (employees as any[]).filter((e: any) => e.departmentId === d.id).length }));
  return (
    <div>
      <PageHeader title="Employee Report" subtitle="Workforce summary and department-wise breakdown" />
      <div className="space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ l: "Total Employees", v: (employees as any[]).length }, { l: "Active", v: (employees as any[]).filter((e: any) => e.isActive !== false).length }, { l: "Departments", v: (departments as any[]).length }, { l: "On Field", v: (employees as any[]).filter((e: any) => e.designation?.toLowerCase().includes("sales")).length }].map(s => <div key={s.l} className="bg-white rounded border p-4 text-center shadow-sm"><div className="text-2xl font-bold text-slate-700">{s.v}</div><div className="text-xs text-gray-400 mt-1">{s.l}</div></div>)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="bg-white rounded border shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b bg-gradient-to-r from-slate-800 to-slate-700"><span className="text-xs font-bold uppercase text-slate-300">Department Breakdown</span></div>
            <table className="w-full text-xs border-collapse"><thead><tr className="bg-slate-100"><th className="px-3 py-2 text-left">Department</th><th className="px-3 py-2 text-right">Count</th></tr></thead><tbody>{deptStats.map((d: any, i) => <tr key={d.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-3 py-2 font-medium">{d.name}</td><td className="px-3 py-2 text-right font-semibold">{d.count}</td></tr>)}</tbody></table>
          </div>
          <div className="bg-white rounded border shadow-sm overflow-auto max-h-64">
            <div className="px-4 py-2.5 border-b bg-gradient-to-r from-slate-800 to-slate-700"><span className="text-xs font-bold uppercase text-slate-300">All Employees</span></div>
            <table className="w-full text-xs border-collapse"><thead><tr className="bg-slate-100"><th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Dept.</th><th className="px-3 py-2 text-left">Designation</th></tr></thead><tbody>{isLoading ? <tr><td colSpan={3} className="text-center py-4 text-gray-400">Loading...</td></tr> : (employees as any[]).map((e: any, i) => <tr key={e.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-3 py-1.5 font-medium">{e.firstName} {e.lastName}</td><td className="px-3 py-1.5 text-gray-400">{e.Department?.name || "-"}</td><td className="px-3 py-1.5">{e.designation || "-"}</td></tr>)}</tbody></table>
          </div>
        </div>
      </div>
    </div>
  );
}

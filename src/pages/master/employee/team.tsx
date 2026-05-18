import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

export default function TeamPage() {
  const [selectedDept, setSelectedDept] = useState("");
  const { data: departments = [] } = useQuery({ queryKey: ["departments"], queryFn: () => axios.get("/api/master/employee/department").then(r => r.data.data) });
  const { data: employees = [], isLoading } = useQuery({ queryKey: ["employees-team", selectedDept], queryFn: () => axios.get("/api/master/employee/team" + (selectedDept ? "?departmentId=" + selectedDept : "")).then(r => r.data.data), enabled: true });
  return (
    <div>
      <PageHeader title="Team" subtitle="View team members by department" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm">
          <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48">
            <option value="">All Departments</option>
            {(departments as any[]).map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading ? <div className="col-span-3 text-center py-8 text-gray-400">Loading...</div> : (employees as any[]).length === 0 ? <div className="col-span-3 text-center py-8 text-gray-400 italic">No employees found</div> : (employees as any[]).map((e: any) => (
            <div key={e.id} className="bg-white rounded border shadow-sm p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold text-sm shrink-0">{e.firstName?.[0]}{e.lastName?.[0]}</div>
              <div>
                <div className="font-semibold text-sm">{e.firstName} {e.lastName}</div>
                <div className="text-xs text-orange-600">{e.designation || "Staff"}</div>
                <div className="text-xs text-gray-400 mt-0.5">{e.Department?.name || "-"}</div>
                {e.mobile && <div className="text-xs text-gray-500 mt-0.5">{e.mobile}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

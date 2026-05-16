import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PageHeader from "@/components/shared/PageHeader";

export default function OrgTreePage() {
  const { data: departments = [] } = useQuery({ queryKey: ["departments"], queryFn: () => axios.get("/api/master/employee/department").then(r => r.data.data) });
  const { data: employees = [] } = useQuery({ queryKey: ["employees"], queryFn: () => axios.get("/api/master/employee/info").then(r => r.data.data) });
  return (
    <div>
      <PageHeader title="Organization Tree" subtitle="Company organizational hierarchy" />
      <div className="bg-white p-6 rounded border shadow-sm">
        <div className="flex flex-col items-center">
          <div className="bg-slate-800 text-white px-6 py-3 rounded-lg text-sm font-bold mb-6">4QT Technologies — RealBoost</div>
          <div className="flex flex-wrap gap-4 justify-center">
            {(departments as any[]).map((d: any) => {
              const deptEmps = (employees as any[]).filter((e: any) => e.departmentId === d.id);
              return (
                <div key={d.id} className="border-2 border-slate-200 rounded-lg overflow-hidden min-w-48">
                  <div className="bg-slate-700 text-white px-3 py-2 text-xs font-bold text-center">{d.name}</div>
                  <div className="p-2 space-y-1">
                    {deptEmps.length === 0 ? <div className="text-xs text-gray-400 text-center py-2 italic">No members</div> : deptEmps.map((e: any) => <div key={e.id} className="text-xs bg-slate-50 rounded px-2 py-1.5"><div className="font-medium">{e.firstName} {e.lastName}</div><div className="text-gray-400">{e.designation || "Staff"}</div></div>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

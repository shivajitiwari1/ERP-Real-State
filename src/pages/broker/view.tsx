import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ViewEditBrokerPage() {
  const qc = useQueryClient();
  const { data: brokers = [] } = useQuery({ queryKey: ["brokers"], queryFn: () => axios.get("/api/broker").then(r => r.data.data) });
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>({ defaultValues: { isActive: true, isGstRegistered: false, isTdsApplicable: false } });
  const editingId = watch("id");
  const save = useMutation({
    mutationFn: (d: any) => d.id ? axios.put("/api/broker", d) : axios.post("/api/broker", d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["brokers"] }); reset({ isActive: true, isGstRegistered: false, isTdsApplicable: false }); alert("Broker saved!"); },
    onError: (e: any) => alert(e.response?.data?.message || "Error"),
  });
  return (
    <div>
      <PageHeader title="View / Edit Broker" subtitle="Manage broker profiles and details" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto max-h-96">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Brokers ({(brokers as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{["Code","Name","Mobile","PAN","Status","Action"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(brokers as any[]).map((b: any, i) => (
              <tr key={b.id} className={editingId === b.id ? "bg-orange-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-2 font-medium">{b.code}</td>
                <td className="px-2 py-2">{b.firstName} {b.lastName}</td>
                <td className="px-2 py-2">{b.mobile || "-"}</td>
                <td className="px-2 py-2 font-mono text-xs">{b.panNo || "-"}</td>
                <td className="px-2 py-2"><span className={"px-1.5 py-0.5 rounded text-xs " + (b.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>{b.isActive ? "Active" : "Inactive"}</span></td>
                <td className="px-2 py-2"><Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => Object.keys(b).forEach(k => setValue(k as any, b[k]))}>Edit</Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">{editingId ? "Edit Broker" : "Add Broker"}</h3>
          <form onSubmit={handleSubmit(d => save.mutate(d))} className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Code *</Label><Input {...register("code")} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">First Name *</Label><Input {...register("firstName")} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Last Name *</Label><Input {...register("lastName")} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Mobile</Label><Input {...register("mobile")} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Email</Label><Input {...register("email")} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">PAN No.</Label><Input {...register("panNo")} className="mt-1 h-9 text-sm font-mono" /></div>
            <div><Label className="text-xs">Designation</Label><Input {...register("designation")} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">City</Label><Input {...register("city")} className="mt-1 h-9 text-sm" /></div>
            <div className="col-span-2"><Label className="text-xs">Address</Label><Input {...register("address")} className="mt-1 h-9 text-sm" /></div>
            <div className="col-span-2 flex gap-2 border-t pt-2">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>{editingId ? "Update" : "Add Broker"}</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ isActive: true, isGstRegistered: false, isTdsApplicable: false })}>Clear</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

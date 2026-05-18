import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateLetterTemplatePage() {
  const qc = useQueryClient();
  const { data: templates = [] } = useQuery({ queryKey: ["letter-templates"], queryFn: () => axios.get("/api/master/letters").then(r => r.data.data) });
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>();
  const editingId = watch("id");
  const save = useMutation({
    mutationFn: (d: any) => d.id ? axios.put("/api/master/letters", d) : axios.post("/api/master/letters", d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["letter-templates"] }); reset(); alert("Template saved!"); },
    onError: (e: any) => alert(e.response?.data?.message || "Error"),
  });
  const del = useMutation({ mutationFn: (id: number) => axios.delete("/api/master/letters", { data: { id } }), onSuccess: () => qc.invalidateQueries({ queryKey: ["letter-templates"] }) });
  return (
    <div>
      <PageHeader title="Letter Templates" subtitle="Create and manage letter templates for customer communication" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-600 uppercase pb-1 border-b">{editingId ? "Edit Template" : "New Template"}</h3>
          <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3">
            <div><Label className="text-xs">Template Name *</Label><Input {...register("name")} placeholder="e.g. Demand Letter, Welcome Letter" className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Content *</Label><textarea {...register("content")} rows={8} className="mt-1 w-full border rounded px-3 py-2 text-sm" placeholder="Use {{customerName}}, {{registrationNo}}, {{amount}}, {{dueDate}} as placeholders..." /></div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>{editingId ? "Update" : "Save"}</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset()}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Templates ({(templates as any[]).length})</h3>
          <div className="space-y-2">{(templates as any[]).map((t: any) => (
            <div key={t.id} className="bg-gray-50 rounded p-3 border">
              <div className="flex justify-between items-start">
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => Object.keys(t).forEach(k => setValue(k as any, t[k]))}>Edit</Button>
                  <Button size="sm" variant="destructive" className="h-6 text-xs px-2" onClick={() => del.mutate(t.id)}>Del</Button>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-1 line-clamp-2">{t.content}</div>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

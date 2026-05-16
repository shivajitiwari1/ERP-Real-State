import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditProjectPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState("");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: projectTypes = [] } = useQuery({ queryKey: ["project-types"], queryFn: () => axios.get("/api/master/setup/project-type").then(r => r.data.data) });
  const project = (projects as any[]).find((p: any) => p.id === Number(selectedProject));
  const { register, handleSubmit, reset } = useForm<any>();
  useEffect(() => { if (project) reset({ name: project.name, code: project.code, projectTypeId: project.projectTypeId, address: project.address, city: project.city, state: project.state, pincode: project.pincode, totalUnits: project.totalUnits, status: project.status }); }, [project]);
  const save = useMutation({
    mutationFn: (d: any) => axios.put("/api/projects", { id: Number(selectedProject), ...d, projectTypeId: d.projectTypeId ? Number(d.projectTypeId) : null, totalUnits: d.totalUnits ? Number(d.totalUnits) : null }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["projects"] }); alert("Project updated successfully!"); },
    onError: (e: any) => alert(e.response?.data?.message || "Error updating project"),
  });
  return (
    <div>
      <PageHeader title="Edit Project" subtitle="Modify project details and configuration" />
      <div className="max-w-2xl">
        <div className="bg-white p-4 rounded border shadow-sm space-y-4">
          <div><Label className="text-xs">Select Project to Edit *</Label>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full border rounded px-2 h-9 text-sm mt-1">
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
            </select>
          </div>
          {selectedProject && project && (
            <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs">Project Name *</Label><Input {...register("name")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Project Code *</Label><Input {...register("code")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Project Type</Label>
                  <select {...register("projectTypeId")} className="w-full border rounded px-2 h-9 text-sm mt-1">
                    <option value="">-- Select Type --</option>
                    {(projectTypes as any[]).map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div><Label className="text-xs">Total Units</Label><Input type="number" {...register("totalUnits")} className="mt-1 h-9 text-sm" /></div>
                <div className="col-span-2"><Label className="text-xs">Address</Label><Input {...register("address")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">City</Label><Input {...register("city")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">State</Label><Input {...register("state")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Pincode</Label><Input {...register("pincode")} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Status</Label>
                  <select {...register("status")} className="w-full border rounded px-2 h-9 text-sm mt-1">
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 border-t pt-3">
                <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Update Project</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => { setSelectedProject(""); reset(); }}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

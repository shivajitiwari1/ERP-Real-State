import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PenaltyConfigPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const [config, setConfig] = useState({ graceDays: 30, ratePerDay: 0.1, maxPenalty: 10 });
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  return (
    <div>
      <PageHeader title="Penalty Configuration" subtitle="Configure penalty rates and grace periods per project" />
      <div className="max-w-xl">
        <div className="bg-white p-4 rounded border shadow-sm space-y-4">
          <div><Label className="text-xs">Project</Label>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full border rounded px-2 h-9 text-sm mt-1">
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          {selectedProject && (
            <div className="space-y-4">
              <fieldset className="border rounded p-3 space-y-3">
                <legend className="text-xs font-bold uppercase text-slate-500 px-1">Late Payment Penalty</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Grace Period (days)</Label><Input type="number" value={config.graceDays} onChange={e => setConfig({ ...config, graceDays: Number(e.target.value) })} className="mt-1 h-9 text-sm" /></div>
                  <div><Label className="text-xs">Rate (% per day)</Label><Input type="number" step="0.01" value={config.ratePerDay} onChange={e => setConfig({ ...config, ratePerDay: Number(e.target.value) })} className="mt-1 h-9 text-sm" /></div>
                  <div className="col-span-2"><Label className="text-xs">Maximum Penalty (%)</Label><Input type="number" step="0.01" value={config.maxPenalty} onChange={e => setConfig({ ...config, maxPenalty: Number(e.target.value) })} className="mt-1 h-9 text-sm" /></div>
                </div>
              </fieldset>
              <div className="bg-slate-50 rounded p-3 text-xs space-y-1">
                <div className="font-bold text-slate-600 mb-2">Configuration Summary</div>
                <div className="flex justify-between"><span className="text-gray-500">Grace Period</span><span className="font-semibold">{config.graceDays} days</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Daily Penalty Rate</span><span className="font-semibold text-red-600">{config.ratePerDay}% per day</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Annual Rate (approx.)</span><span className="font-semibold text-red-600">{(config.ratePerDay * 365).toFixed(1)}% p.a.</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Maximum Cap</span><span className="font-semibold">{config.maxPenalty}% of principal</span></div>
              </div>
              <div className="flex gap-2 border-t pt-3">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => alert("Penalty configuration saved!")}>Save Configuration</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

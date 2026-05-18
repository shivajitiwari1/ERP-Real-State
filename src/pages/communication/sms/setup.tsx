import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SmsSetupPage() {
  const qc = useQueryClient();
  const { data: configs = [] } = useQuery({ queryKey: ["sms-config"], queryFn: () => axios.get("/api/communication/sms-config").then(r => r.data.data) });
  const config = Array.isArray(configs) ? configs[0] : configs;
  const { register, handleSubmit } = useForm<any>();
  const save = useMutation({
    mutationFn: (d: any) => config?.id ? axios.put("/api/communication/sms-config", { id: config.id, ...d }) : axios.post("/api/communication/sms-config", d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["sms-config"] }); alert("SMS configuration saved!"); },
    onError: (e: any) => alert(e.response?.data?.message || "Error"),
  });
  return (
    <div>
      <PageHeader title="SMS Setup" subtitle="Configure SMS gateway for sending notifications" />
      <div className="max-w-lg">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          {config && <div className="bg-green-50 border border-green-200 rounded p-2.5 text-xs text-green-700">SMS gateway configured. Sender ID: {config.senderId}</div>}
          <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3">
            <div><Label className="text-xs">API URL *</Label><Input {...register("apiUrl")} defaultValue={config?.apiUrl} placeholder="https://api.smsgateway.com/send" className="mt-1 h-9 text-sm font-mono text-xs" /></div>
            <div><Label className="text-xs">API Key *</Label><Input {...register("apiKey")} defaultValue={config?.apiKey} placeholder="Your API key" className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Sender ID *</Label><Input {...register("senderId")} defaultValue={config?.senderId} placeholder="RBOOST" className="mt-1 h-9 text-sm font-mono" /></div>
            <div className="bg-slate-50 rounded p-3 text-xs text-slate-600">Configure your SMS gateway provider details above. API format varies by provider (TextLocal, MSG91, 2Factor, etc.)</div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Save SMS Config</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmailSetupPage() {
  const qc = useQueryClient();
  const { data: configs = [] } = useQuery({ queryKey: ["email-config"], queryFn: () => axios.get("/api/communication/email-config").then(r => r.data.data) });
  const { register, handleSubmit, reset, setValue } = useForm<any>({ defaultValues: { smtpPort: 587, isSsl: true } });
  const config = Array.isArray(configs) ? configs[0] : configs;
  const save = useMutation({
    mutationFn: (d: any) => config?.id ? axios.put("/api/communication/email-config", { id: config.id, ...d, smtpPort: Number(d.smtpPort), isSsl: d.isSsl === "true" || d.isSsl === true }) : axios.post("/api/communication/email-config", { ...d, smtpPort: Number(d.smtpPort), isSsl: d.isSsl === "true" || d.isSsl === true }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["email-config"] }); alert("Email configuration saved!"); },
    onError: (e: any) => alert(e.response?.data?.message || "Error"),
  });
  return (
    <div>
      <PageHeader title="Email Setup" subtitle="Configure SMTP settings for outgoing emails" />
      <div className="max-w-lg">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          {config && <div className="bg-green-50 border border-green-200 rounded p-2.5 text-xs text-green-700">SMTP configured: {config.smtpHost}:{config.smtpPort} as {config.fromEmail}</div>}
          <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">SMTP Host *</Label><Input {...register("smtpHost")} defaultValue={config?.smtpHost} placeholder="smtp.gmail.com" className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">SMTP Port</Label><Input type="number" {...register("smtpPort")} defaultValue={config?.smtpPort || 587} className="mt-1 h-9 text-sm" /></div>
            </div>
            <div><Label className="text-xs">Username (Email) *</Label><Input {...register("username")} defaultValue={config?.username} placeholder="sender@company.com" className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Password</Label><Input type="password" {...register("passwordEncrypted")} placeholder="App password or SMTP password" className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">From Email *</Label><Input {...register("fromEmail")} defaultValue={config?.fromEmail} placeholder="noreply@company.com" className="mt-1 h-9 text-sm" /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register("isSsl")} defaultChecked={config?.isSsl !== false} id="ssl" className="h-4 w-4" />
              <Label htmlFor="ssl" className="text-xs">Use SSL/TLS</Label>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Save SMTP Config</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

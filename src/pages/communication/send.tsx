import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SendCommunicationPage() {
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [sent, setSent] = useState<{ ok: boolean; msg: string } | null>(null);
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { register, handleSubmit, reset } = useForm<any>();
  const send = useMutation({
    mutationFn: (d: any) => channel === 'email'
      ? axios.post('/api/communication/send-email', d)
      : axios.post('/api/communication/send-sms', d),
    onSuccess: () => { setSent({ ok: true, msg: "Message sent successfully!" }); reset(); },
    onError: (e: any) => setSent({ ok: false, msg: e.response?.data?.message || "Failed to send" }),
  });
  return (
    <div>
      <PageHeader title="Send Communication" subtitle="Send email or SMS to customers individually or in bulk" />
      <div className="max-w-2xl">
        <div className="bg-white p-4 rounded border shadow-sm space-y-4">
          <div className="flex gap-2">
            {(["email", "sms"] as const).map(c => <Button key={c} size="sm" variant={channel === c ? "default" : "outline"} onClick={() => setChannel(c)} className={channel === c ? "bg-orange-500 hover:bg-orange-600" : ""}>{c.toUpperCase()}</Button>)}
          </div>
          <form onSubmit={handleSubmit(d => send.mutate(d))} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Project</Label>
                <select {...register("projectId")} className="w-full border rounded px-2 h-9 text-sm mt-1">
                  <option value="">-- Select Project --</option>
                  {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div><Label className="text-xs">Recipient Type</Label>
                <select {...register("recipientType")} className="w-full border rounded px-2 h-9 text-sm mt-1">
                  <option value="individual">Individual Customer</option>
                  <option value="all_active">All Active Bookings</option>
                  <option value="overdue">Overdue Customers</option>
                </select>
              </div>
            </div>
            {channel === "email" ? (
              <>
                <div><Label className="text-xs">To (Email)</Label><Input {...register("to")} type="email" placeholder="customer@example.com" className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Subject</Label><Input {...register("subject")} placeholder="Email subject..." className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Message Body</Label><textarea {...register("body")} rows={5} className="mt-1 w-full border rounded px-3 py-2 text-sm" placeholder="Type your message..." /></div>
              </>
            ) : (
              <>
                <div><Label className="text-xs">Mobile Number</Label><Input {...register("mobile")} placeholder="+91 XXXXXXXXXX" className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">SMS Message (160 chars)</Label><textarea {...register("message")} rows={3} maxLength={160} className="mt-1 w-full border rounded px-3 py-2 text-sm" placeholder="Type SMS message..." /></div>
              </>
            )}
            {sent && <div className={"rounded p-2.5 text-xs font-medium " + (sent.ok ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200")}>{sent.msg}</div>}
            <div className="flex gap-2 border-t pt-3">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={send.isPending}>Send {channel === "email" ? "Email" : "SMS"}</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => { reset(); setSent(null); }}>Clear</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

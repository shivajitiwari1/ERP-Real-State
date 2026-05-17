import { useState } from "react";
import axios from "axios";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmailTestPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Test Email from RealBoost ERP");
  const [body, setBody] = useState("This is a test email sent from RealBoost ERP system.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  async function sendTest() {
    if (!to) return alert("Enter recipient email");
    setLoading(true); setResult(null);
    try { await axios.post('/api/communication/send-email', { to, subject, body }); setResult({ ok: true, msg: "Test email sent successfully to " + to }); }
    catch (e: any) { setResult({ ok: false, msg: e.response?.data?.message || "Failed to send email" }); }
    setLoading(false);
  }
  return (
    <div>
      <PageHeader title="Test Email" subtitle="Send a test email to verify SMTP configuration" />
      <div className="max-w-lg">
        <div className="bg-white p-4 rounded border shadow-sm space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-700">Ensure SMTP is configured under Email Setup before testing.</div>
          <div><Label className="text-xs">Recipient Email *</Label><Input type="email" value={to} onChange={e => setTo(e.target.value)} placeholder="test@example.com" className="mt-1 h-9 text-sm" /></div>
          <div><Label className="text-xs">Subject</Label><Input value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 h-9 text-sm" /></div>
          <div><Label className="text-xs">Body</Label><textarea value={body} onChange={e => setBody(e.target.value)} rows={4} className="mt-1 w-full border rounded px-3 py-2 text-sm" /></div>
          {result && <div className={"rounded p-3 text-xs font-medium " + (result.ok ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200")}>{result.msg}</div>}
          <div className="flex gap-2 border-t pt-3">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={sendTest} disabled={loading}>{loading ? "Sending..." : "Send Test Email"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

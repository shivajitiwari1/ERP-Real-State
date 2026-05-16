import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function IpRestrictionPage() {
  const [ips, setIps] = useState(["127.0.0.1", "192.168.1.0/24"]);
  const [newIp, setNewIp] = useState("");
  const [mode, setMode] = useState<"whitelist" | "disabled">("disabled");
  return (
    <div>
      <PageHeader title="IP Restriction" subtitle="Restrict system access to specific IP addresses" />
      <div className="max-w-lg">
        <div className="bg-white p-4 rounded border shadow-sm space-y-4">
          <div>
            <Label className="text-xs">Restriction Mode</Label>
            <select value={mode} onChange={e => setMode(e.target.value as any)} className="w-full border rounded px-2 h-9 text-sm mt-1">
              <option value="disabled">Disabled — All IPs Allowed</option>
              <option value="whitelist">Whitelist — Only Listed IPs</option>
            </select>
          </div>
          {mode === "whitelist" && (
            <>
              <div className="flex gap-2">
                <Input value={newIp} onChange={e => setNewIp(e.target.value)} placeholder="e.g. 192.168.1.1 or 192.168.0.0/24" className="h-9 text-sm flex-1" />
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => { if (newIp && !ips.includes(newIp)) { setIps([...ips, newIp]); setNewIp(""); } }}>Add</Button>
              </div>
              <div className="space-y-1">
                {ips.map((ip, i) => <div key={i} className="flex justify-between items-center px-3 py-2 bg-slate-50 rounded border text-xs"><span className="font-mono">{ip}</span><Button size="sm" variant="destructive" className="h-5 text-xs px-1.5" onClick={() => setIps(ips.filter((_, j) => j !== i))}>Remove</Button></div>)}
              </div>
            </>
          )}
          {mode === "disabled" && <div className="bg-green-50 border border-green-200 rounded p-3 text-xs text-green-700">IP restrictions are disabled. All IP addresses can access the system.</div>}
          <div className="flex gap-2 border-t pt-3">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => alert("IP restriction settings saved!")}>Save Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

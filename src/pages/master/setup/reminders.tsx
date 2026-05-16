import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SystemRemindersPage() {
  const [config, setConfig] = useState({ demandReminderDays: 3, birthDayAlert: true, anniversaryAlert: true, possessionAlert: 30, loanExpiryAlert: 7 });
  return (
    <div>
      <PageHeader title="System Reminders" subtitle="Configure automatic reminder alerts for the ERP" />
      <div className="max-w-lg">
        <div className="bg-white p-4 rounded border shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs">Demand Reminder (days before)</Label><Input type="number" value={config.demandReminderDays} onChange={e => setConfig({ ...config, demandReminderDays: Number(e.target.value) })} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Possession Alert (days before)</Label><Input type="number" value={config.possessionAlert} onChange={e => setConfig({ ...config, possessionAlert: Number(e.target.value) })} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Loan Expiry Alert (days before)</Label><Input type="number" value={config.loanExpiryAlert} onChange={e => setConfig({ ...config, loanExpiryAlert: Number(e.target.value) })} className="mt-1 h-9 text-sm" /></div>
          </div>
          <div className="space-y-2">
            {[{ l: "Birthday Reminder", k: "birthDayAlert" }, { l: "Anniversary Reminder", k: "anniversaryAlert" }].map(({ l, k }) => (
              <div key={k} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded border">
                <span className="text-sm">{l}</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={(config as any)[k]} onChange={e => setConfig({ ...config, [k]: e.target.checked })} className="h-4 w-4" />
                  <span className="text-xs text-gray-500">{(config as any)[k] ? "Enabled" : "Disabled"}</span>
                </label>
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t pt-3">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => alert("Reminder settings saved!")}>Save Reminders</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

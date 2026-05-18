import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ReceiptLockPage() {
  const [lockDate, setLockDate] = useState(new Date().toISOString().slice(0, 7));
  return (
    <div>
      <PageHeader title="Receipt Lock" subtitle="Lock receipts for a period to prevent modification" />
      <div className="max-w-lg">
        <div className="bg-white p-4 rounded border shadow-sm space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-700"><strong>Warning:</strong> Locking receipts for a period will prevent any edits or cancellations. This action requires admin authorization.</div>
          <div><Label className="text-xs">Lock Period (Month / Year)</Label><Input type="month" value={lockDate} onChange={e => setLockDate(e.target.value)} className="mt-1 h-9 text-sm" /></div>
          <div className="bg-slate-50 rounded p-3 text-xs">
            <div className="font-bold text-slate-600 mb-2">Lock Summary</div>
            <div className="flex justify-between"><span>Lock Period</span><span className="font-semibold">{lockDate}</span></div>
            <div className="flex justify-between mt-1"><span>Action</span><span className="text-red-600 font-semibold">Receipts in this period will be locked</span></div>
          </div>
          <div className="flex gap-2 border-t pt-3">
            <Button size="sm" className="bg-red-500 hover:bg-red-600" onClick={() => { if (window.confirm("Lock all receipts for " + lockDate + "? This cannot be undone.")) alert("Receipt lock applied for " + lockDate); }}>Apply Lock</Button>
            <Button size="sm" variant="outline" onClick={() => alert("Unlock requires super-admin access.")}>Unlock Period</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BrokerServiceTaxPage() {
  const [config, setConfig] = useState({ serviceTaxRate: 18, tdsRate: 5, threshold: 30000 });
  return (
    <div>
      <PageHeader title="Service Tax Setup" subtitle="Configure service tax rates for broker commission payments" />
      <div className="max-w-lg">
        <div className="bg-white p-4 rounded border shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs">GST / Service Tax Rate (%)</Label><Input type="number" step="0.01" value={config.serviceTaxRate} onChange={e => setConfig({ ...config, serviceTaxRate: Number(e.target.value) })} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">TDS Rate on Commission (%)</Label><Input type="number" step="0.01" value={config.tdsRate} onChange={e => setConfig({ ...config, tdsRate: Number(e.target.value) })} className="mt-1 h-9 text-sm" /></div>
            <div className="col-span-2"><Label className="text-xs">TDS Threshold (Rs.)</Label><Input type="number" value={config.threshold} onChange={e => setConfig({ ...config, threshold: Number(e.target.value) })} className="mt-1 h-9 text-sm" /></div>
          </div>
          <div className="bg-slate-50 rounded p-3 text-xs space-y-1">
            <div className="font-bold text-slate-600 mb-2">Configuration Summary</div>
            <div className="flex justify-between"><span className="text-gray-500">GST on Brokerage</span><span className="font-semibold">{config.serviceTaxRate}%</span></div>
            <div className="flex justify-between"><span className="text-gray-500">TDS Rate (Sec 194H)</span><span className="font-semibold text-red-600">{config.tdsRate}%</span></div>
            <div className="flex justify-between"><span className="text-gray-500">TDS Applicable Above</span><span className="font-semibold">Rs.{config.threshold.toLocaleString("en-IN")} per year</span></div>
          </div>
          <div className="flex gap-2 border-t pt-2">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => alert("Service tax configuration saved!")}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

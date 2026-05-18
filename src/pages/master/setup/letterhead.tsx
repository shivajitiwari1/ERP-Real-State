import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LetterheadPage() {
  const [config, setConfig] = useState({ companyName: "4QT Technologies", address: "123 Business Park", city: "Mumbai", phone: "+91 98765 43210", email: "info@4qt.in", website: "www.4qt.in", regNo: "CIN: U12345MH2020PTC123456" });
  return (
    <div>
      <PageHeader title="Letterhead Setup" subtitle="Configure company letterhead for printed documents" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          {Object.entries({ "Company Name": "companyName", "Address": "address", "City": "city", "Phone": "phone", "Email": "email", "Website": "website", "Registration No.": "regNo" }).map(([l, k]) => (
            <div key={k}><Label className="text-xs">{l}</Label><Input value={(config as any)[k]} onChange={e => setConfig({ ...config, [k]: e.target.value })} className="mt-1 h-9 text-sm" /></div>
          ))}
          <div className="flex gap-2 border-t pt-3">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => alert("Letterhead saved!")}>Save Letterhead</Button>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-600 mb-3 uppercase">Preview</h3>
          <div className="bg-white rounded border shadow-sm p-6 text-xs">
            <div className="border-b-2 border-slate-800 pb-4 mb-4 flex justify-between">
              <div>
                <div className="font-bold text-lg text-slate-800">{config.companyName}</div>
                <div className="text-gray-500 mt-1">{config.address}, {config.city}</div>
                <div className="text-gray-500">{config.phone} | {config.email}</div>
                <div className="text-gray-500">{config.website}</div>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-xl">4QT</div>
            </div>
            <div className="text-gray-300 text-center py-4 italic text-xs">Document content appears here</div>
            <div className="border-t border-slate-200 pt-3 mt-4 text-center text-gray-400 text-xs">{config.regNo}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type DemandFormat = {
  headerTitle: string;
  footerText: string;
  showUnitDetails: boolean;
  showPaymentHistory: boolean;
};

export default function DemandFormatPage() {
  const [format, setFormat] = useState<DemandFormat>({
    headerTitle: 'DEMAND NOTICE',
    footerText: 'Please pay within due date to avoid penalty.',
    showUnitDetails: true,
    showPaymentHistory: false,
  });
  const [saved, setSaved] = useState(false);

  function save() {
    localStorage.setItem('demand_format', JSON.stringify(format));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <PageHeader title="Demand Format Customization" />
      <div className="max-w-xl bg-white border rounded-lg shadow-sm p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-600 uppercase border-b pb-2">Demand Letter Format</h3>
        <div>
          <Label className="text-xs">Header Title</Label>
          <Input
            value={format.headerTitle}
            onChange={e => setFormat(f => ({ ...f, headerTitle: e.target.value }))}
            className="mt-1 h-9 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Footer Text</Label>
          <textarea
            value={format.footerText}
            onChange={e => setFormat(f => ({ ...f, footerText: e.target.value }))}
            rows={3}
            className="mt-1 w-full border rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Display Options</Label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="unitDetails"
              checked={format.showUnitDetails}
              onChange={e => setFormat(f => ({ ...f, showUnitDetails: e.target.checked }))}
              className="h-4 w-4"
            />
            <label htmlFor="unitDetails" className="text-xs text-gray-600">Show Unit Details</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="payHistory"
              checked={format.showPaymentHistory}
              onChange={e => setFormat(f => ({ ...f, showPaymentHistory: e.target.checked }))}
              className="h-4 w-4"
            />
            <label htmlFor="payHistory" className="text-xs text-gray-600">Show Payment History</label>
          </div>
        </div>
        <div className="border-t pt-3 flex gap-2 items-center">
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={save}>Save Format</Button>
          {saved && <span className="text-xs text-green-600">Saved successfully</span>}
        </div>
      </div>
    </div>
  );
}

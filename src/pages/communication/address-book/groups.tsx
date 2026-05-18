import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEFAULT_GROUPS = [
  { name: "All Active Customers", description: "All bookings with active status", count: "Dynamic", type: "system" },
  { name: "Overdue Customers", description: "Customers with pending overdue demands", count: "Dynamic", type: "system" },
  { name: "Pending Possession", description: "Customers awaiting possession", count: "Dynamic", type: "system" },
  { name: "NOC Pending", description: "Customers with pending NOC requests", count: "Dynamic", type: "system" },
];

export default function AddressBookGroupsPage() {
  const [groups, setGroups] = useState(DEFAULT_GROUPS);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <div>
      <PageHeader title="Address Book Groups" subtitle="Manage customer communication groups for bulk messaging" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-600 uppercase">Create Custom Group</h3>
            <div><Label className="text-xs">Group Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. VIP Customers" className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Description</Label><Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Group description..." className="mt-1 h-9 text-sm" /></div>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => { if (name) { setGroups([...groups, { name, description: desc, count: "0", type: "custom" }]); setName(""); setDesc(""); } }}>Create Group</Button>
          </div>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Groups ({groups.length})</h3>
          <div className="space-y-2">{groups.map((g, i) => (
            <div key={i} className="flex items-start justify-between p-3 bg-gray-50 rounded border text-xs">
              <div><div className="font-semibold text-slate-700">{g.name}</div><div className="text-gray-400 mt-0.5">{g.description}</div></div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className={"px-1.5 py-0.5 rounded text-xs " + (g.type === "system" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600")}>{g.type}</span>
                {g.type === "custom" && <Button size="sm" variant="destructive" className="h-5 text-xs px-1.5" onClick={() => setGroups(groups.filter((_, j) => j !== i))}>Del</Button>}
              </div>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}

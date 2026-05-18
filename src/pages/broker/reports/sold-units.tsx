import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

export default function BrokerSoldUnitsPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => axios.get("/api/projects").then(r => r.data.data) });
  const { data: brokers = [] } = useQuery({ queryKey: ["brokers"], queryFn: () => axios.get("/api/broker").then(r => r.data.data) });
  const { data: mappings = [] } = useQuery({ queryKey: ["broker-mappings"], queryFn: () => axios.get("/api/broker/project-mapping").then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery({ queryKey: ["bookings-sold", selectedProject], queryFn: () => axios.get("/api/application/bookings?projectId=" + selectedProject + "&status=active").then(r => r.data.data), enabled: !!selectedProject });
  const brokerStats = (brokers as any[]).map((b: any) => {
    const sold = (bookings as any[]).filter((bk: any) => bk.brokerId === b.id);
    const mapping = (mappings as any[]).find((m: any) => m.brokerId === b.id && m.projectId === Number(selectedProject));
    const totalValue = sold.reduce((s: number, bk: any) => s + Number(bk.totalCost || 0), 0);
    const commission = (mapping?.commissionRate || 0) * totalValue / 100;
    return { ...b, soldCount: sold.length, totalValue, commission };
  }).filter((b: any) => b.soldCount > 0);
  return (
    <div>
      <PageHeader title="Broker Sold Units Report" subtitle="Unit-wise sales performance by broker" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48"><option value="">-- Select Project --</option>{(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{["#","Broker Code","Name","Units Sold","Total Value","Commission Rate","Est. Commission"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{isLoading ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr> : brokerStats.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-400 italic">No broker sales{selectedProject ? "" : " — select a project"}</td></tr> : brokerStats.map((b: any, i) => (
              <tr key={b.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-2 text-gray-400">{i + 1}</td>
                <td className="px-2 py-2 font-mono font-medium">{b.code}</td>
                <td className="px-2 py-2">{b.firstName} {b.lastName}</td>
                <td className="px-2 py-2 font-bold text-center">{b.soldCount}</td>
                <td className="px-2 py-2 font-semibold">Rs.{b.totalValue.toLocaleString("en-IN")}</td>
                <td className="px-2 py-2">{b.commissionRate || 0}%</td>
                <td className="px-2 py-2 font-semibold text-orange-600">Rs.{Math.round(b.commission).toLocaleString("en-IN")}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

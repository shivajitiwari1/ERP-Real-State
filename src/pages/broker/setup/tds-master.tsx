import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PageHeader from "@/components/shared/PageHeader";

const TDS_SECTIONS = [
  { section: "194H", description: "Commission or Brokerage", threshold: 15000, rate: "5%", notes: "Applicable on real estate brokerage" },
  { section: "194IA", description: "Transfer of Immovable Property", threshold: 5000000, rate: "1%", notes: "Applicable on property purchase above 50L" },
  { section: "194I", description: "Rent", threshold: 240000, rate: "10%", notes: "Applicable on rent above 2.4L per year" },
  { section: "194C", description: "Payment to Contractor", threshold: 30000, rate: "1-2%", notes: "Applicable on contractor payments" },
  { section: "194J", description: "Professional Fees", threshold: 30000, rate: "10%", notes: "Applicable on legal, consultant fees" },
];

export default function BrokerTdsMasterPage() {
  const { data: brokers = [] } = useQuery({ queryKey: ["brokers"], queryFn: () => axios.get("/api/broker").then(r => r.data.data) });
  const tdsApplicable = (brokers as any[]).filter((b: any) => b.isTdsApplicable);
  return (
    <div>
      <PageHeader title="TDS Master" subtitle="TDS rates and sections applicable to broker transactions" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-gradient-to-r from-slate-800 to-slate-700"><span className="text-xs font-bold uppercase text-slate-300">TDS Reference Sections</span></div>
          <div className="divide-y">
            {TDS_SECTIONS.map(s => (
              <div key={s.section} className="p-3">
                <div className="flex justify-between items-start">
                  <div><div className="font-bold text-sm text-slate-700">Section {s.section}</div><div className="text-xs text-gray-600 mt-0.5">{s.description}</div><div className="text-xs text-gray-400 mt-0.5">{s.notes}</div></div>
                  <div className="text-right shrink-0 ml-3"><div className="font-bold text-orange-600">{s.rate}</div><div className="text-xs text-gray-400">Above Rs.{Number(s.threshold).toLocaleString("en-IN")}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">TDS-Applicable Brokers ({tdsApplicable.length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{["Code","Name","PAN","TAN"].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{tdsApplicable.length === 0 ? <tr><td colSpan={4} className="px-2 py-4 text-center text-gray-400 italic">No TDS-applicable brokers configured</td></tr> : tdsApplicable.map((b: any, i) => <tr key={b.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}><td className="px-2 py-2 font-mono">{b.code}</td><td className="px-2 py-2">{b.firstName} {b.lastName}</td><td className="px-2 py-2 font-mono">{b.panNo || "-"}</td><td className="px-2 py-2 font-mono">{b.tanNo || "-"}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

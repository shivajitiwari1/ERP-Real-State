import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PageHeader from "@/components/shared/PageHeader";

const DOC_TYPES = [
  { name: "Booking Form", category: "Booking", required: true },
  { name: "KYC - PAN Card", category: "Identity", required: true },
  { name: "KYC - Aadhaar Card", category: "Identity", required: true },
  { name: "KYC - Passport Photo", category: "Identity", required: false },
  { name: "Address Proof", category: "Identity", required: true },
  { name: "Income Proof", category: "Financial", required: false },
  { name: "Bank Statement (6 months)", category: "Financial", required: false },
  { name: "Agreement for Sale", category: "Legal", required: true },
  { name: "Demand Letter", category: "Payment", required: true },
  { name: "Receipt", category: "Payment", required: true },
  { name: "NOC Certificate", category: "Possession", required: false },
  { name: "Possession Letter", category: "Possession", required: true },
  { name: "Registry Document", category: "Possession", required: false },
];

export default function DocumentTypePage() {
  return (
    <div>
      <PageHeader title="Document Type" subtitle="Document types tracked in the system" />
      <div className="bg-white rounded border shadow-sm overflow-auto">
        <table className="w-full text-xs border-collapse">
          <thead><tr className="bg-purple-700 text-white">{["#","Document Name","Category","Required"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>{DOC_TYPES.map((d, i) => (
            <tr key={d.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-3 py-2 text-gray-400">{i + 1}</td>
              <td className="px-3 py-2 font-medium">{d.name}</td>
              <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">{d.category}</span></td>
              <td className="px-3 py-2">{d.required ? <span className="text-red-600 font-medium">Required</span> : <span className="text-gray-400">Optional</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

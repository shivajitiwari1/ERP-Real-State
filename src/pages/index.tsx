import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';

const fmt = (n: number) => n > 0 ? '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0';

export default function Dashboard() {
  const { data: dashData = [], isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => axios.get('/api/dashboard').then(r => r.data.data),
    refetchInterval: 60000,
  });

  const quickActions = [
    { label: 'Receipt(Alt+R)', href: '/application/receipts/new' },
    { label: 'Application Form(Alt+A)', href: '/application/booking/new' },
    { label: 'Unit Status(Alt+U)', href: '/reports/inventory/unit-status' },
    { label: 'Payment File(Alt+P)', href: '/reports/applicant/payment-file' },
    { label: 'Dues(Alt+D)', href: '/reports/dues' },
    { label: 'Search Customer(Alt+C)', href: '/reports/applicant/search' },
    { label: 'Chart Report(Alt+U)', href: '/reports/sales' },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Real Estate Manager — Today's Overview" />
      {isLoading && <div className="text-center text-gray-400 py-10 italic text-sm">Loading dashboard...</div>}
      {(dashData as any[]).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded border shadow-sm overflow-hidden">
            <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Demand Status</div>
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-slate-800 text-white"><th className="px-2 py-1.5 text-left">Project</th><th className="px-2 py-1.5 text-right">Pending</th><th className="px-2 py-1.5 text-right">Sent</th></tr></thead>
              <tbody>{(dashData as any[]).map((d: any, i) => (
                <tr key={i} className={i%2===0?'bg-white':'bg-gray-50'}>
                  <td className="px-2 py-1.5 font-medium">{d.project.name}</td>
                  <td className="px-2 py-1.5 text-right text-blue-600 font-bold">{d.demand.pending}</td>
                  <td className="px-2 py-1.5 text-right text-green-600 font-bold">{d.demand.sent}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="bg-white rounded border shadow-sm overflow-hidden">
            <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Daily Status</div>
            <div className="overflow-auto">
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-slate-800 text-white"><th className="px-2 py-1.5 text-left">Project</th><th className="px-2 py-1.5 text-right">Sales (T)</th><th className="px-2 py-1.5 text-right">Coll. (T)</th><th className="px-2 py-1.5 text-right">Coll. (M)</th><th className="px-2 py-1.5 text-right">Till Date</th></tr></thead>
                <tbody>{(dashData as any[]).map((d: any, i) => (
                  <tr key={i} className={i%2===0?'bg-white':'bg-gray-50'}>
                    <td className="px-2 py-1.5 font-medium">{d.project.name}</td>
                    <td className="px-2 py-1.5 text-right text-blue-600">{fmt(d.daily.todaySales)}</td>
                    <td className="px-2 py-1.5 text-right text-green-600">{fmt(d.daily.todayCollection)}</td>
                    <td className="px-2 py-1.5 text-right text-green-600">{fmt(d.daily.monthCollection)}</td>
                    <td className="px-2 py-1.5 text-right text-purple-600">{fmt(d.daily.tillDateCollection)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded border shadow-sm overflow-hidden">
            <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Inventory Summary</div>
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-slate-800 text-white"><th className="px-2 py-1.5 text-left">Project</th><th className="px-2 py-1.5 text-right">Total</th><th className="px-2 py-1.5 text-right">Available</th><th className="px-2 py-1.5 text-right">Booked</th><th className="px-2 py-1.5 text-right">Sold</th></tr></thead>
              <tbody>{(dashData as any[]).map((d: any, i) => (
                <tr key={i} className={i%2===0?'bg-white':'bg-gray-50'}>
                  <td className="px-2 py-1.5 font-medium">{d.project.name}</td>
                  <td className="px-2 py-1.5 text-right font-bold">{d.inventory.total}</td>
                  <td className="px-2 py-1.5 text-right text-green-600">{d.inventory.available}</td>
                  <td className="px-2 py-1.5 text-right text-blue-600">{d.inventory.booked}</td>
                  <td className="px-2 py-1.5 text-right text-purple-600">{d.inventory.sold}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="bg-white rounded border shadow-sm overflow-hidden">
            <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Forthcoming Due (Next 28 Days)</div>
            <div className="overflow-auto">
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-slate-800 text-white"><th className="px-2 py-1.5 text-left">Project</th><th className="px-2 py-1.5 text-right">Today</th><th className="px-2 py-1.5 text-right">1-7 Days</th><th className="px-2 py-1.5 text-right">8-14 Days</th><th className="px-2 py-1.5 text-right">15-21 Days</th><th className="px-2 py-1.5 text-right">22-28 Days</th></tr></thead>
                <tbody>{(dashData as any[]).map((d: any, i) => (
                  <tr key={i} className={i%2===0?'bg-white':'bg-gray-50'}>
                    <td className="px-2 py-1.5 font-medium">{d.project.name}</td>
                    <td className="px-2 py-1.5 text-right text-red-600 font-bold">{d.forthcomingDue.today}</td>
                    <td className="px-2 py-1.5 text-right text-orange-600">{d.forthcomingDue.week1}</td>
                    <td className="px-2 py-1.5 text-right">{d.forthcomingDue.week2}</td>
                    <td className="px-2 py-1.5 text-right">{d.forthcomingDue.week3}</td>
                    <td className="px-2 py-1.5 text-right">{d.forthcomingDue.week4}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <div className="bg-slate-800 text-white rounded p-2 flex gap-2 flex-wrap">
        {quickActions.map(a => (
          <Link key={a.label} href={a.href}>
            <button className="bg-purple-700 hover:bg-orange-600 transition-colors text-xs px-3 py-1.5 rounded">{a.label}</button>
          </Link>
        ))}
      </div>
    </div>
  );
}

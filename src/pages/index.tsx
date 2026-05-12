import PageHeader from '@/components/shared/PageHeader';

export default function Dashboard() {
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome to RealBoost ERP" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {['Demand Status', 'Daily Status', 'Parking Detail', 'Forthcoming Due'].map(w => (
          <div key={w} className="bg-white border rounded shadow-sm p-4">
            <h3 className="text-xs font-bold text-white bg-purple-700 -mx-4 -mt-4 px-4 py-2 rounded-t mb-3">{w}</h3>
            <p className="text-xs text-gray-400 italic">Will be populated in Phase 9</p>
          </div>
        ))}
      </div>
      <div className="bg-slate-800 text-white rounded p-2 flex gap-2 flex-wrap">
        {['Receipt(Alt+R)', 'Application Form(Alt+A)', 'Unit Status(Alt+U)', 'Payment File(Alt+P)', 'Dues(Alt+D)', 'Search Customer(Alt+C)', 'Chart Report(Alt+U)'].map(btn => (
          <button key={btn} className="bg-slate-700 hover:bg-slate-600 text-xs px-3 py-1.5 rounded">{btn}</button>
        ))}
      </div>
    </div>
  );
}

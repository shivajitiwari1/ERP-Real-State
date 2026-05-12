interface Props { title: string; subtitle?: string; }

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
      <div className="w-1 h-6 bg-orange-500 rounded"></div>
      <div>
        <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

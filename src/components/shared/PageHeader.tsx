interface Props { title: string; subtitle?: string; actions?: React.ReactNode; }

export default function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 4, height: 26, background: 'linear-gradient(180deg, #F97316, #EA6C0A)', borderRadius: 99, flexShrink: 0 }} />
          <div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.025em', lineHeight: 1.2 }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '3px 0 0', fontFamily: "'DM Sans', sans-serif" }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{actions}</div>}
      </div>
    </div>
  );
}

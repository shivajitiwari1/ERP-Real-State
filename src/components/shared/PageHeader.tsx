import { useRouter } from 'next/router';

interface Props { title: string; subtitle?: string; actions?: React.ReactNode; }

export default function PageHeader({ title, subtitle, actions }: Props) {
  const router = useRouter();
  const parts = router.pathname.split('/').filter(Boolean);
  const breadcrumbs = parts.map((p, i) => ({
    label: p.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    href: '/' + parts.slice(0, i + 1).join('/'),
  }));

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
        <a href="/" style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.1s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          Dashboard
        </a>
        {breadcrumbs.map((b, i) => (
          <span key={b.href} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 10, color: 'var(--border)', fontWeight: 300 }}>›</span>
            {i === breadcrumbs.length - 1 ? (
              <span style={{ fontSize: 11, color: '#F97316', fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>{b.label}</span>
            ) : (
              <a href={b.href} style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                {b.label}
              </a>
            )}
          </span>
        ))}
      </div>

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 22, background: 'linear-gradient(180deg, #F97316, #EA6C0A)', borderRadius: 99 }} />
          <div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
            {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>{subtitle}</p>}
          </div>
        </div>
        {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
      </div>
    </div>
  );
}

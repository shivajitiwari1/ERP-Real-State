import { useRouter } from 'next/router';

interface Crumb { label: string; href?: string; }
interface Props { title: string; subtitle?: string; actions?: React.ReactNode; breadcrumbs?: Crumb[]; }

export default function PageHeader({ title, subtitle, actions, breadcrumbs }: Props) {
  const router = useRouter();
  const parts = router.pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = breadcrumbs ?? parts.map((p, i) => ({
    label: p.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    href: '/' + parts.slice(0, i + 1).join('/'),
  }));

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
        <a href="/" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', fontFamily: "'Outfit', sans-serif" }}
          onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          Dashboard
        </a>
        {crumbs.map((b, i) => (
          <span key={b.href} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--border)', fontWeight: 300 }}>›</span>
            {i === crumbs.length - 1 || !b.href ? (
              <span style={{ fontSize: 12, color: '#F97316', fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>{b.label}</span>
            ) : (
              <a href={b.href} style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', fontFamily: "'Outfit', sans-serif" }}
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

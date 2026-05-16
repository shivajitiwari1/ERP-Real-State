import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { initTheme, applyTheme } from '@/lib/theme';
import SserpLogo from '@/components/shared/SserpLogo';

export default function TopBar() {
  const { data: session } = useSession();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const t = initTheme();
    setTheme(t);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)');
    const update = () => setIsCompact(media.matches);
    update();
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  }

  const initial = session?.user?.name?.[0]?.toUpperCase() || 'A';

  return (
    <div
      style={{
        height: isCompact ? 58 : 54,
        background: 'var(--bg-topbar)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isCompact ? '0 10px' : '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        transition: 'background 0.3s ease',
        gap: isCompact ? 6 : 12,
      }}
    >
      <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
        <SserpLogo iconSize={isCompact ? 34 : 40} showText={!isCompact} />
      </Link>

      {!isCompact && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 0 2px rgba(34,197,94,0.2)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'Outfit', sans-serif" }}>
            {dayjs().format('ddd, DD MMM YYYY')}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: isCompact ? 6 : 8, flexShrink: 0 }}>
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            width: isCompact ? 44 : 52,
            height: isCompact ? 30 : 34,
            border: '1px solid var(--border)',
            borderRadius: 8,
            background: 'var(--bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 11,
            transition: 'all 0.15s ease',
            color: 'var(--text-muted)',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = '#F97316';
            (e.currentTarget as HTMLElement).style.color = '#F97316';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
          }}
        >
          Theme
        </button>

        {!isCompact && <div style={{ width: 1, height: 20, background: 'var(--border)' }} />}

        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: isCompact ? '4px 8px' : '5px 10px',
            border: '1px solid var(--border)',
            borderRadius: 7,
            fontSize: isCompact ? 11 : 12,
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'all 0.15s ease',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 500,
            background: 'var(--bg)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = '#F97316';
            (e.currentTarget as HTMLElement).style.color = '#F97316';
            (e.currentTarget as HTMLElement).style.background = 'rgba(249,115,22,0.06)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
            (e.currentTarget as HTMLElement).style.background = 'var(--bg)';
          }}
        >
          Home
        </Link>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isCompact ? 5 : 8,
              padding: isCompact ? '3px 8px 3px 3px' : '4px 10px 4px 4px',
              border: '1px solid var(--border)',
              borderRadius: 99,
              background: 'var(--bg)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#F97316')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div
              style={{
                width: isCompact ? 24 : 26,
                height: isCompact ? 24 : 26,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F97316, #EA6C0A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: isCompact ? 10 : 11,
                color: '#fff',
              }}
            >
              {initial}
            </div>
            {!isCompact && (
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', fontFamily: "'Outfit', sans-serif", maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session?.user?.name || 'User'}
              </span>
            )}
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>v</span>
          </button>

          {showUserMenu && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowUserMenu(false)} />
              <div className="erp-dropdown" style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', minWidth: 180, zIndex: 100 }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--text)', fontFamily: "'Outfit', sans-serif" }}>{session?.user?.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>{session?.user?.email}</p>
                </div>
                <Link href="/master/security/password" className="erp-dropdown-item" onClick={() => setShowUserMenu(false)}>
                  Change Password
                </Link>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    signOut({ callbackUrl: '/login' });
                  }}
                  className="erp-dropdown-item"
                  style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

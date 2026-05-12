import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { initTheme, applyTheme } from '@/lib/theme';

const schema = z.object({
  username: z.string().min(1, 'Username required'),
  password: z.string().min(1, 'Password required'),
});
type FormData = z.infer<typeof schema>;

const S = {
  page: { minHeight: '100vh', background: '#060D18', display: 'flex', alignItems: 'stretch' as const, fontFamily: "'DM Sans', sans-serif" },
  left: { flex: 1, position: 'relative' as const, display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between', padding: '48px', overflow: 'hidden' as const },
  right: { width: '100%', maxWidth: 460, background: '#0B1628', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', padding: '48px 40px', position: 'relative' as const, borderLeft: '1px solid #1A2840' },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#475569', marginBottom: 7, fontFamily: "'Outfit', sans-serif" },
  input: { width: '100%', height: 46, padding: '0 14px 0 42px', background: 'rgba(255,255,255,0.04)', border: '1.5px solid #1A2840', borderRadius: 10, color: '#F1F5F9', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'all 0.15s ease' },
  inputIcon: { position: 'absolute' as const, left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' as const },
  submit: { width: '100%', height: 48, background: 'linear-gradient(135deg, #F97316 0%, #EA6C0A 100%)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: "'Outfit', sans-serif", letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 20px rgba(249,115,22,0.35)' },
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = initTheme();
    setTheme(t);
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next); applyTheme(next);
  }

  async function onSubmit(data: FormData) {
    setError('');
    const result = await signIn('credentials', { username: data.username, password: data.password, redirect: false });
    if (result?.error) { setError('Invalid username or password'); return; }
    router.push('/');
  }

  return (
    <div style={S.page}>
      {/* ── Left: Brand Panel ── */}
      <div style={S.left} className="hidden lg:flex">
        {/* Mesh blobs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div className="animate-mesh" style={{ position: 'absolute', top: '-15%', left: '-5%', width: '65%', height: '65%', background: 'radial-gradient(circle, rgba(249,115,22,0.16) 0%, transparent 70%)', filter: 'blur(50px)', borderRadius: '50%' }} />
          <div className="animate-mesh" style={{ position: 'absolute', bottom: '-10%', right: '5%', width: '55%', height: '55%', background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)', filter: 'blur(50px)', borderRadius: '50%', animationDelay: '3s' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>

        {/* Logo */}
        <div className="animate-fade-up" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
              {[18, 18, 18, 9].map((h, i) => <div key={i} style={{ width: 18, height: h, background: '#F97316', borderRadius: 3 }} />)}
            </div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '-0.03em' }}>4QT</span>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-up-1">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.22)', borderRadius: 99, padding: '5px 14px', marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F97316', animation: 'pulseDot 2s ease infinite' }} />
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em', color: '#F97316', fontFamily: "'Outfit', sans-serif", textTransform: 'uppercase' }}>Real Estate ERP · v5.0</span>
            </div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 54, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.04, letterSpacing: '-0.04em', margin: '0 0 20px' }}>
              Your Business<br /><span style={{ color: '#F97316' }}>At Your</span><br />Finger Tips.
            </h1>
          </div>
          <p className="animate-fade-up-2" style={{ fontSize: 15, color: '#475569', lineHeight: 1.75, maxWidth: 380, margin: '0 0 36px' }}>
            Manage projects, bookings, collections and possession from a single intelligent platform built for modern real estate operations.
          </p>
          <div className="animate-fade-up-3" style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            {['Project Setup', 'Booking & CRM', 'Demand Engine', 'Collection MIS', 'Possession Flow'].map(f => (
              <span key={f} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 99, padding: '6px 13px', fontSize: 12, color: '#64748B' }}>{f}</span>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, fontSize: 11, color: '#1E3A5F' }}>© 2026 4QT Technologies · RealBoost</div>
      </div>

      {/* ── Right: Form ── */}
      <div style={S.right}>
        {/* Theme toggle */}
        <button onClick={toggleTheme} title="Toggle theme" style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid #1A2840', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15, transition: 'border-color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#F97316')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#1A2840')}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Mobile brand */}
        <div className="lg:hidden animate-fade-up" style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {[14, 14, 14, 7].map((h, i) => <div key={i} style={{ width: 14, height: h, background: '#F97316', borderRadius: 2 }} />)}
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 18, color: '#F1F5F9' }}>RealBoost</span>
        </div>

        {/* Header */}
        <div className="animate-fade-up" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 700, color: '#F1F5F9', margin: '0 0 5px', letterSpacing: '-0.03em' }}>Welcome back</h2>
          <p style={{ fontSize: 13.5, color: '#475569', margin: 0 }}>Sign in to continue to RealBoost ERP</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-up-1">
          {/* Username */}
          <div style={S.field}>
            <label style={S.label}>Username</label>
            <div style={{ position: 'relative' }}>
              <span style={{ ...S.inputIcon, color: '#334155' }}>👤</span>
              <input {...register('username')} autoFocus autoComplete="username"
                style={S.input} placeholder="Enter your username"
                onFocus={e => { e.target.style.borderColor = '#F97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; e.target.style.background = 'rgba(249,115,22,0.04)'; }}
                onBlur={e => { e.target.style.borderColor = '#1A2840'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.04)'; }} />
            </div>
            {errors.username && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 5 }}>{errors.username.message}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 22 }}>
            <label style={S.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ ...S.inputIcon, color: '#334155' }}>🔒</span>
              <input {...register('password')} type={showPass ? 'text' : 'password'} autoComplete="current-password"
                style={{ ...S.input, paddingRight: 44 }} placeholder="Enter your password"
                onFocus={e => { e.target.style.borderColor = '#F97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; e.target.style.background = 'rgba(249,115,22,0.04)'; }}
                onBlur={e => { e.target.style.borderColor = '#1A2840'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.04)'; }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#334155' }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 5 }}>{errors.password.message}</p>}
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 13 }}>⚠️</span>
              <span style={{ fontSize: 13, color: '#FCA5A5' }}>{error}</span>
            </div>
          )}

          <button type="submit" disabled={isSubmitting}
            style={{ ...S.submit, background: isSubmitting ? '#7C3F0A' : 'linear-gradient(135deg, #F97316 0%, #EA6C0A 100%)', boxShadow: isSubmitting ? 'none' : '0 4px 20px rgba(249,115,22,0.32)', opacity: isSubmitting ? 0.8 : 1 }}
            onMouseEnter={e => !isSubmitting && ((e.currentTarget.style.transform = 'translateY(-1px)'), (e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.45)'))}
            onMouseLeave={e => !isSubmitting && ((e.currentTarget.style.transform = 'none'), (e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,115,22,0.32)'))}>
            {isSubmitting ? <><div className="spinner" />SIGNING IN...</> : 'SIGN IN →'}
          </button>
        </form>

        {/* Tools */}
        <div className="animate-fade-up-2" style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #1A2840' }}>
          <p style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#1E3A5F', marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>Quick Tools</p>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {[{ l: 'Area Conversion', h: '/tools/area-conversion', i: '📐' }, { l: 'EMI Calculator', h: '/tools/emi-calculator', i: '🧮' }, { l: 'My IP', h: '/tools/my-ip', i: '🌐' }].map(t => (
              <Link key={t.h} href={t.h} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1A2840', borderRadius: 6, fontSize: 11.5, color: '#334155', textDecoration: 'none', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#F97316'; (e.currentTarget as HTMLElement).style.color = '#F97316'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1A2840'; (e.currentTarget as HTMLElement).style.color = '#334155'; }}>
                {t.i} {t.l}
              </Link>
            ))}
          </div>
        </div>
        <p style={{ marginTop: 24, fontSize: 10.5, color: '#1A2840', textAlign: 'center' }}>© 2026 4QT Technologies · All rights reserved</p>
      </div>
    </div>
  );
}

export function getStoredTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem('erp-theme') as 'light' | 'dark') || 'light';
}

export function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('erp-theme', theme); } catch (_) {}
}

export function initTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const stored = getStoredTheme();
  applyTheme(stored);
  return stored;
}

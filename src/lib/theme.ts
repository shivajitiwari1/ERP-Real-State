export function getStoredTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem('erp-theme') as 'light' | 'dark') || 'light';
}

export function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('erp-theme', theme);
}

export function initTheme() {
  const stored = getStoredTheme();
  applyTheme(stored);
  return stored;
}

// src/components/shared/UnderDev.tsx
export default function UnderDev({ title }: { title: string }) {
  return (
    <div className="under-dev">
      <div className="under-dev-icon">🚧</div>
      <div className="under-dev-title">{title}</div>
      <div className="under-dev-sub">This feature is under development and will be available in a future update.</div>
    </div>
  );
}

interface Props {
  iconSize?: number;
  showText?: boolean;
  textColor?: string;
  subTextColor?: string;
  loginStyle?: boolean;
}

export default function SserpLogo({
  iconSize = 44,
  showText = true,
  textColor = 'var(--text)',
  subTextColor = 'var(--text-muted)',
  loginStyle = false,
}: Props) {
  const fontSize = Math.round(iconSize * 0.36);
  const subFontSize = Math.round(iconSize * 0.19);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(iconSize * 0.22) }}>
      {/* Real logo image served via API route */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div style={{ width: iconSize, height: iconSize, borderRadius: '50%', overflow: 'hidden', background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(249,115,22,0.25)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ss-erp-logo.png"
          alt="SS GROUP-ERP"
          width={iconSize}
          height={iconSize}
          style={{ objectFit: 'contain', display: 'block' }}
        />
      </div>

      {showText && (
        <div style={{ lineHeight: 1 }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: loginStyle ? fontSize + 4 : fontSize,
            color: textColor,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
          }}>
            SS GROUP <span style={{ color: '#F97316' }}>- ERP</span>
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: subFontSize,
            fontWeight: 600,
            letterSpacing: '0.07em',
            textTransform: 'uppercase' as const,
            color: subTextColor,
            marginTop: 3,
            whiteSpace: 'nowrap',
          }}>
            Real Estate ERP
          </div>
        </div>
      )}
    </div>
  );
}

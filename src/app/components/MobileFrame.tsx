import { ReactNode } from 'react';
import { BG } from '../neu';

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: '#CBD5E0', fontFamily: 'Poppins, sans-serif' }}>
      {/* Desktop hint */}
      <div className="hidden md:flex flex-col items-center" style={{ marginRight: 32 }}>
        <div style={{ color: '#718096', fontSize: 13, textAlign: 'center', maxWidth: 180, lineHeight: 1.6 }}>
          📱 TourTuaThai<br />Mobile App Preview
        </div>
      </div>

      {/* Phone Shell */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 390,
          height: 844,
          maxHeight: '100vh',
          borderRadius: 48,
          background: BG,
          boxShadow: '0 32px 80px rgba(0,0,0,0.35), inset 0 0 0 2px rgba(255,255,255,0.5)',
          border: '10px solid #2D3748',
          flexShrink: 0,
        }}
      >
        {/* Status bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 pt-3 pb-1"
          style={{ background: 'transparent', zIndex: 50, position: 'relative' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#2D3748' }}>9:41</span>
          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-6 rounded-full"
            style={{ background: '#2D3748' }} />
          <div className="flex items-center gap-1">
            <div style={{ fontSize: 11, color: '#2D3748' }}>●●●</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>

        {/* Home indicator */}
        <div className="flex-shrink-0 flex justify-center pb-2 pt-1">
          <div className="w-28 h-1 rounded-full" style={{ background: '#2D3748', opacity: 0.3 }} />
        </div>
      </div>
    </div>
  );
}

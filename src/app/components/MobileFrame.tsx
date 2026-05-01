import { ReactNode } from 'react';
import { NavLink } from 'react-router';
import { BG, neuExSm, neuIn, TEXT_MID, BLUE } from '../neu';

const DEV_ROUTES = [
  { label: 'Login', path: '/' },
  { label: 'Personality', path: '/onboarding/personality' },
  { label: 'Interests', path: '/onboarding/interests' },
  { label: 'Start', path: '/onboarding/starting-point' },
  { label: 'Planner', path: '/planner' },
  { label: 'Itinerary', path: '/itinerary' },
  { label: 'Live', path: '/live' },
];

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: '#CBD5E0', fontFamily: 'Poppins, sans-serif' }}>

      {/* Dev Nav */}
      <div className="hidden md:flex flex-col gap-1.5 mr-6" style={{ alignSelf: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: TEXT_MID, letterSpacing: '0.08em', marginBottom: 4 }}>DEV NAV</div>
        {DEV_ROUTES.map(r => (
          <NavLink key={r.path} to={r.path} end={r.path === '/'}>
            {({ isActive }) => (
              <div
                style={{
                  background: BG,
                  boxShadow: isActive ? neuIn : neuExSm,
                  color: isActive ? BLUE : TEXT_MID,
                  borderLeft: `3px solid ${isActive ? BLUE : 'transparent'}`,
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  padding: '6px 14px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {r.label}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* App at mobile resolution */}
      <div
        className="relative flex flex-col overflow-hidden flex-shrink-0"
        style={{ width: 390, height: 844, maxHeight: '100vh', background: BG }}
      >
        {children}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Navigation, ChevronRight } from 'lucide-react';
import { BG, BLUE, GREEN, TEXT_DARK, TEXT_MID, TEXT_LIGHT, neuEx, neuIn, neuExSm } from '../neu';

const CITIES = [
  { name: 'Bangkok', region: 'Central Thailand', emoji: '🏙️', coords: { x: 62, y: 68 } },
  { name: 'Chiang Mai', region: 'Northern Thailand', emoji: '🏔️', coords: { x: 37, y: 28 } },
  { name: 'Phuket', region: 'Southern Thailand', emoji: '🏖️', coords: { x: 27, y: 88 } },
  { name: 'Koh Samui', region: 'Gulf Coast', emoji: '🌴', coords: { x: 68, y: 82 } },
  { name: 'Ayutthaya', region: 'Central Thailand', emoji: '🏛️', coords: { x: 59, y: 62 } },
  { name: 'Chiang Rai', region: 'Northern Thailand', emoji: '⛪', coords: { x: 35, y: 18 } },
  { name: 'Krabi', region: 'Southern Thailand', emoji: '⛵', coords: { x: 31, y: 84 } },
  { name: 'Pai', region: 'Mae Hong Son', emoji: '🌸', coords: { x: 30, y: 25 } },
];

// Simplified Thailand SVG path (approximate outline)
const ThailandShape = ({ selectedCity }: { selectedCity: string | null }) => {
  const city = CITIES.find(c => c.name === selectedCity);
  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      {/* Thailand approximate country shape */}
      <path
        d="M48 5 L55 8 L62 12 L65 18 L60 22 L62 28 L58 32 L62 36 L64 42 L62 48 L66 54 L68 60 L65 66 L68 72 L66 78 L62 82 L58 86 L52 88 L48 86 L44 88 L40 90 L36 88 L32 84 L28 80 L26 76 L28 72 L30 68 L28 64 L30 60 L28 56 L24 52 L28 48 L30 42 L28 36 L26 30 L28 24 L32 18 L36 12 L42 8 Z"
        fill="#D4E6F1"
        stroke="#A8CCE0"
        strokeWidth="0.8"
      />
      {/* Southern peninsula */}
      <path
        d="M48 86 L44 88 L40 90 L36 88 L32 84 L30 88 L28 92 L30 96 L32 98 L34 96 L36 92 L38 96 L40 98 L42 96 L44 92 L48 86Z"
        fill="#D4E6F1"
        stroke="#A8CCE0"
        strokeWidth="0.8"
      />

      {/* City dots */}
      {CITIES.map(c => (
        <g key={c.name}>
          <circle
            cx={c.coords.x}
            cy={c.coords.y}
            r={selectedCity === c.name ? 3 : 1.8}
            fill={selectedCity === c.name ? GREEN : '#1B73C6'}
            stroke="white"
            strokeWidth="0.8"
            style={{ transition: 'all 0.3s' }}
          />
          {selectedCity === c.name && (
            <>
              <circle cx={c.coords.x} cy={c.coords.y} r={6} fill={GREEN + '33'} />
              <circle cx={c.coords.x} cy={c.coords.y} r={9} fill={GREEN + '15'} />
            </>
          )}
        </g>
      ))}

      {/* Selected city label */}
      {city && (
        <text
          x={city.coords.x + (city.coords.x > 50 ? -2 : 4)}
          y={city.coords.y - 5}
          fontSize="5"
          fill={GREEN}
          fontWeight="bold"
          textAnchor={city.coords.x > 50 ? 'end' : 'start'}
        >
          {city.name}
        </text>
      )}
    </svg>
  );
};

export default function StartingPointPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const filtered = query.length > 0
    ? CITIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : CITIES;

  return (
    <div className="flex flex-col h-full" style={{ background: BG, fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#F0A500', boxShadow: neuExSm }}>
            <Navigation size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1.5 }}>STEP 3 OF 3</div>
            <div className="flex gap-1.5 mt-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-1 rounded-full"
                  style={{ width: 24, background: '#F0A500' }} />
              ))}
            </div>
          </div>
        </div>
        <h1 style={{ color: TEXT_DARK, fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>
          Where are you<br />starting? 📍
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4" style={{ scrollbarWidth: 'none' }}>
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-4"
          style={{ background: BG, boxShadow: neuIn }}>
          <Search size={18} color={TEXT_MID} />
          <input
            className="flex-1 bg-transparent outline-none"
            style={{ color: TEXT_DARK, fontSize: 14, border: 'none', fontFamily: 'Poppins, sans-serif' }}
            placeholder="Which city are we starting in?"
            value={query}
            onChange={e => { setQuery(e.target.value); setFocused(true); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
              <Search size={14} color={TEXT_LIGHT} />
            </button>
          )}
        </div>

        {/* City Suggestions */}
        <AnimatePresence>
          {(focused || !selected) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl overflow-hidden mb-4"
              style={{ boxShadow: neuEx }}
            >
              {filtered.map((city, idx) => (
                <motion.button
                  key={city.name}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelected(city.name); setQuery(city.name); setFocused(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3"
                  style={{
                    background: selected === city.name ? BLUE + '14' : BG,
                    border: 'none',
                    borderTop: idx > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: BG, boxShadow: neuExSm }}>
                    {city.emoji}
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: 14, fontWeight: 600, color: selected === city.name ? BLUE : TEXT_DARK }}>{city.name}</div>
                    <div style={{ fontSize: 12, color: TEXT_MID }}>{city.region}</div>
                  </div>
                  {selected === city.name && <MapPin size={16} color={GREEN} />}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mini Map Widget */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl overflow-hidden mb-4"
              style={{ background: BG, boxShadow: neuIn }}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div style={{ fontSize: 12, fontWeight: 600, color: TEXT_MID }}>📍 STARTING POINT</div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{ background: GREEN + '22', border: `1px solid ${GREEN}` }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: GREEN }} />
                  <span style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>{selected}</span>
                </div>
              </div>
              <div style={{ height: 200, padding: '0 16px 16px' }}>
                <div className="w-full h-full rounded-2xl overflow-hidden" style={{ boxShadow: neuExSm }}>
                  <ThailandShape selectedCity={selected} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Start Planning Button */}
      <div className="flex-shrink-0 px-6 pb-8 pt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => selected && navigate('/planner')}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
          style={{
            background: selected ? '#F0A500' : '#c5cad1',
            boxShadow: neuEx,
            color: '#fff',
            border: 'none',
            cursor: selected ? 'pointer' : 'not-allowed',
            fontSize: 15,
            fontWeight: 600,
            transition: 'background 0.3s',
          }}
        >
          <ChevronRight size={18} />
          Start Planning!
        </motion.button>
      </div>
    </div>
  );
}

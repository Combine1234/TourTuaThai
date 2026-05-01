import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronRight, User } from 'lucide-react';
import { BG, BLUE, TEXT_DARK, TEXT_MID, TEXT_LIGHT, neuEx, neuIn, neuExSm } from '../neu';

function NeuSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const snap = (clientX: number) => {
    if (!trackRef.current) return;
    const { left, width } = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - left) / width));
    onChange(Math.round(ratio * 4) + 1);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    snap(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current) snap(e.clientX);
  };
  const onPointerUp = () => { dragging.current = false; };

  const pct = ((value - 1) / 4) * 100;

  return (
    <div>
      <div
        ref={trackRef}
        className="relative flex items-center"
        style={{ height: 36, cursor: 'grab', touchAction: 'none', userSelect: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Inset track */}
        <div className="relative w-full h-3 rounded-full" style={{ background: BG, boxShadow: neuIn }}>
          <div className="absolute left-0 top-0 h-full rounded-full"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${BLUE}88, ${BLUE})` }} />
        </div>
        {/* Knob */}
        <motion.div
          className="absolute w-7 h-7 rounded-full"
          animate={{ left: `calc(${pct}% - 14px)` }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{ background: BG, boxShadow: neuEx, border: `2px solid ${BLUE}`, zIndex: 2 }}
        />
      </div>
      {/* Step dots */}
      <div className="flex justify-between mt-2 px-1">
        {[1, 2, 3, 4, 5].map(n => (
          <div key={n} className="w-1.5 h-1.5 rounded-full"
            style={{ background: n <= value ? BLUE : '#c5cad1' }} />
        ))}
      </div>
    </div>
  );
}

interface SliderItem {
  id: string;
  leftLabel: string;
  rightLabel: string;
  leftEmoji: string;
  rightEmoji: string;
  value: number;
}

const defaultSliders: SliderItem[] = [
  { id: 'social', leftLabel: 'Introvert', rightLabel: 'Extrovert', leftEmoji: '🧘', rightEmoji: '🎉', value: 3 },
  { id: 'nature', leftLabel: 'Beach', rightLabel: 'Mountain', leftEmoji: '🏖️', rightEmoji: '⛰️', value: 2 },
  { id: 'pace', leftLabel: 'Slow & Relaxed', rightLabel: 'Maximize Sights', leftEmoji: '😌', rightEmoji: '🚀', value: 3 },
  { id: 'culture', leftLabel: 'Modern City', rightLabel: 'Ancient Heritage', leftEmoji: '🏙️', rightEmoji: '🏛️', value: 4 },
  { id: 'food', leftLabel: 'Safe & Familiar', rightLabel: 'Adventurous Eats', leftEmoji: '🍽️', rightEmoji: '🌶️', value: 4 },
  { id: 'budget', leftLabel: 'Backpacker', rightLabel: 'Luxury', leftEmoji: '🎒', rightEmoji: '💎', value: 2 },
  { id: 'night', leftLabel: 'Early Bird', rightLabel: 'Night Owl', leftEmoji: '🌅', rightEmoji: '🌙', value: 3 },
];

export default function PersonalityPage() {
  const navigate = useNavigate();
  const [sliders, setSliders] = useState<SliderItem[]>(defaultSliders);

  const updateSlider = (id: string, value: number) => {
    setSliders(s => s.map(sl => sl.id === id ? { ...sl, value } : sl));
  };

  return (
    <div className="flex flex-col h-full" style={{ background: BG, fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: BLUE, boxShadow: neuExSm }}>
            <User size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1.5 }}>STEP 1 OF 3</div>
            <div className="flex gap-1.5 mt-1">
              {(['/onboarding/personality', '/onboarding/interests', '/onboarding/starting-point'] as const).map((route, idx) => (
                <button
                  key={route}
                  onClick={() => navigate(route)}
                  style={{
                    width: idx === 0 ? 24 : 8, height: 4,
                    borderRadius: 999,
                    background: idx === 0 ? BLUE : '#c5cad1',
                    border: 'none', padding: 0, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <h1 style={{ color: TEXT_DARK, fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>
          Tell us your<br />travel style ✈️
        </h1>
        <p style={{ color: TEXT_MID, fontSize: 13, marginTop: 6 }}>Slide to match your vibe. We'll craft the perfect trip.</p>
      </div>

      {/* Sliders */}
      <div className="flex-1 overflow-y-auto px-6 pb-4" style={{ scrollbarWidth: 'none' }}>
        {sliders.map((slider) => (
          <motion.div
            key={slider.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-5 p-4 rounded-2xl"
            style={{ background: BG, boxShadow: neuEx }}
          >
            <div className="flex justify-between items-center mb-3">
              <span style={{ fontSize: 13, color: TEXT_MID }}>
                {slider.leftEmoji} {slider.leftLabel}
              </span>
              <span style={{ fontSize: 13, color: TEXT_MID }}>
                {slider.rightLabel} {slider.rightEmoji}
              </span>
            </div>

            <NeuSlider
              value={slider.value}
              onChange={v => updateSlider(slider.id, v)}
            />
          </motion.div>
        ))}
      </div>

      {/* Next Button */}
      <div className="flex-shrink-0 px-6 pb-8 pt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/onboarding/interests')}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
          style={{ background: BLUE, boxShadow: neuEx, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600 }}
        >
          Next: Rank Your Interests <ChevronRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}

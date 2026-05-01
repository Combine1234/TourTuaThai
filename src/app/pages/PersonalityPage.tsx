import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronRight, User } from 'lucide-react';
import { BG, BLUE, TEXT_DARK, TEXT_MID, TEXT_LIGHT, neuEx, neuIn, neuExSm } from '../neu';

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
              {[1, 2, 3].map(i => (
                <div key={i} className="h-1 rounded-full transition-all"
                  style={{ width: i === 1 ? 24 : 8, background: i === 1 ? BLUE : '#c5cad1' }} />
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

            {/* Custom Slider Track */}
            <div className="relative flex items-center" style={{ height: 36 }}>
              {/* Inset track */}
              <div className="relative w-full h-3 rounded-full"
                style={{ background: BG, boxShadow: neuIn }}>
                {/* Fill */}
                <div className="absolute left-0 top-0 h-full rounded-full transition-all"
                  style={{
                    width: `${((slider.value - 1) / 4) * 100}%`,
                    background: `linear-gradient(90deg, ${BLUE}88, ${BLUE})`,
                  }} />
              </div>

              {/* Knob */}
              <div
                className="absolute w-7 h-7 rounded-full cursor-pointer"
                style={{
                  left: `calc(${((slider.value - 1) / 4) * 100}% - 14px)`,
                  background: BG,
                  boxShadow: neuEx,
                  border: `2px solid ${BLUE}`,
                  zIndex: 2,
                }}
              />

              {/* Invisible range input on top */}
              <input
                type="range"
                min={1} max={5} step={1}
                value={slider.value}
                onChange={e => updateSlider(slider.id, parseInt(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                style={{ height: '100%' }}
              />
            </div>

            {/* Step dots */}
            <div className="flex justify-between mt-2 px-1">
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} className="w-1.5 h-1.5 rounded-full"
                  style={{ background: n <= slider.value ? BLUE : '#c5cad1' }} />
              ))}
            </div>
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

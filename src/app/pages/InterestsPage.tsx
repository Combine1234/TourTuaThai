import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, GripVertical, Heart } from 'lucide-react';
import { BG, BLUE, GREEN, TEXT_DARK, TEXT_MID, TEXT_LIGHT, neuEx, neuIn, neuExSm } from '../neu';

interface Interest {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

const ALL_INTERESTS: Interest[] = [
  { id: 'history', label: 'Historical', emoji: '🏛️', color: '#8B5CF6' },
  { id: 'food', label: 'Food & Cuisine', emoji: '🍜', color: '#F97316' },
  { id: 'religion', label: 'Religion & Temples', emoji: '🙏', color: '#F59E0B' },
  { id: 'nature', label: 'Nature & Wildlife', emoji: '🌿', color: '#10B981' },
  { id: 'adventure', label: 'Adventure', emoji: '🧗', color: '#EF4444' },
  { id: 'beach', label: 'Beach & Islands', emoji: '🏖️', color: '#06B6D4' },
  { id: 'shopping', label: 'Shopping & Markets', emoji: '🛍️', color: '#EC4899' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🎶', color: '#7C3AED' },
  { id: 'wellness', label: 'Wellness & Spa', emoji: '💆', color: '#14B8A6' },
  { id: 'arts', label: 'Arts & Culture', emoji: '🎨', color: '#6366F1' },
  { id: 'local', label: 'Local Life', emoji: '🏘️', color: '#84CC16' },
  { id: 'photography', label: 'Photography', emoji: '📸', color: '#F43F5E' },
];

export default function InterestsPage() {
  const navigate = useNavigate();
  const [top5, setTop5] = useState<Interest[]>([]);
  const [notes, setNotes] = useState({ done: '', why: '', special: '' });

  const toggleInterest = (interest: Interest) => {
    if (top5.find(i => i.id === interest.id)) {
      setTop5(prev => prev.filter(i => i.id !== interest.id));
    } else if (top5.length < 5) {
      setTop5(prev => [...prev, interest]);
    }
  };

  const removeFromTop5 = (id: string) => {
    setTop5(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="flex flex-col h-full" style={{ background: BG, fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: GREEN, boxShadow: neuExSm }}>
            <Heart size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: TEXT_LIGHT, letterSpacing: 1.5 }}>STEP 2 OF 3</div>
            <div className="flex gap-1.5 mt-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-1 rounded-full transition-all"
                  style={{ width: i <= 2 ? 24 : 8, background: i <= 2 ? GREEN : '#c5cad1' }} />
              ))}
            </div>
          </div>
        </div>
        <h1 style={{ color: TEXT_DARK, fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>
          Pick your top 5<br />interests 💫
        </h1>
        <p style={{ color: TEXT_MID, fontSize: 13, marginTop: 6 }}>Tap to select. We'll build your trip around these.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4" style={{ scrollbarWidth: 'none' }}>
        {/* Top 5 Drop Zone */}
        <div className="rounded-2xl p-4 mb-5" style={{ background: BG, boxShadow: neuIn, minHeight: 88 }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: 12, color: TEXT_MID, fontWeight: 600 }}>YOUR TOP 5</span>
            <span style={{ fontSize: 12, color: top5.length === 5 ? GREEN : TEXT_LIGHT }}>
              {top5.length}/5 selected
            </span>
          </div>
          {top5.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4" style={{ color: TEXT_LIGHT }}>
              <GripVertical size={24} style={{ opacity: 0.4 }} />
              <span style={{ fontSize: 13, marginTop: 6 }}>Tap interests below to add them here</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {top5.map((interest, idx) => (
                  <motion.div
                    key={interest.id}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ background: interest.color + '22', border: `1.5px solid ${interest.color}`, boxShadow: neuExSm }}
                  >
                    <span style={{ fontSize: 12 }}>#{idx + 1}</span>
                    <span style={{ fontSize: 14 }}>{interest.emoji}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: interest.color }}>{interest.label}</span>
                    <button onClick={() => removeFromTop5(interest.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 2, display: 'flex', alignItems: 'center' }}>
                      <X size={12} color={interest.color} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* All Interests Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {ALL_INTERESTS.map(interest => {
            const selected = !!top5.find(i => i.id === interest.id);
            const disabled = !selected && top5.length >= 5;
            return (
              <motion.button
                key={interest.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => !disabled && toggleInterest(interest)}
                className="flex items-center gap-2 px-3 py-3 rounded-2xl text-left"
                style={{
                  background: BG,
                  boxShadow: selected ? neuIn : neuEx,
                  border: selected ? `2px solid ${interest.color}` : '2px solid transparent',
                  opacity: disabled ? 0.4 : 1,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 22 }}>{interest.emoji}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: selected ? interest.color : TEXT_DARK }}>{interest.label}</div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Open-ended Notes */}
        <div className="mb-4">
          <h3 style={{ color: TEXT_DARK, fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Tell us more (optional)</h3>
          {[
            { key: 'done', placeholder: '🗺️ What have you already done in Thailand?' },
            { key: 'why', placeholder: '💭 Why are you traveling this time?' },
            { key: 'special', placeholder: '✨ Any special interests or needs?' },
          ].map(({ key, placeholder }) => (
            <textarea
              key={key}
              value={notes[key as keyof typeof notes]}
              onChange={e => setNotes(n => ({ ...n, [key]: e.target.value }))}
              placeholder={placeholder}
              rows={2}
              className="w-full mb-3 p-4 rounded-2xl resize-none outline-none"
              style={{
                background: BG,
                boxShadow: neuIn,
                color: TEXT_DARK,
                fontSize: 13,
                border: 'none',
                fontFamily: 'Poppins, sans-serif',
              }}
            />
          ))}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex-shrink-0 px-6 pb-8 pt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/onboarding/starting-point')}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
          style={{ background: GREEN, boxShadow: neuEx, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600 }}
        >
          Next: Set Starting Point <ChevronRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}

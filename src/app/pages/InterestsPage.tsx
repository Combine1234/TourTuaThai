import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, GripVertical, Heart } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BG, GREEN, TEXT_DARK, TEXT_MID, TEXT_LIGHT, neuEx, neuIn, neuExSm } from '../neu';

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

const DRAG_TYPE = 'TOP5_ITEM';

interface DragItem { id: string; index: number }

function SortableRow({
  interest, index, moveItem, onRemove,
}: {
  interest: Interest;
  index: number;
  moveItem: (from: number, to: number) => void;
  onRemove: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: DRAG_TYPE,
    item: { id: interest.id, index },
    collect: m => ({ isDragging: m.isDragging() }),
  });

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: DRAG_TYPE,
    collect: m => ({ isOver: m.isOver() }),
    hover(item) {
      if (item.index === index) return;
      moveItem(item.index, index);
      item.index = index;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="flex items-center gap-2 px-3 py-2 rounded-2xl"
      style={{
        background: isOver ? interest.color + '18' : 'transparent',
        opacity: isDragging ? 0.45 : 1,
        border: `1.5px solid ${interest.color}44`,
        transition: 'background 0.15s, opacity 0.15s',
        cursor: 'grab',
      }}
    >
      <GripVertical size={15} color={TEXT_LIGHT} />

      {/* Rank badge */}
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: interest.color, fontSize: 9, fontWeight: 700, color: '#fff' }}
      >
        {index + 1}
      </div>

      {/* Emoji + label */}
      <span style={{ fontSize: 18 }}>{interest.emoji}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: interest.color, flex: 1 }}>{interest.label}</span>

      {/* Remove */}
      <button
        onClick={() => onRemove(interest.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
      >
        <X size={13} color={TEXT_LIGHT} />
      </button>
    </div>
  );
}

function InterestsInner() {
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

  const removeFromTop5 = (id: string) => setTop5(prev => prev.filter(i => i.id !== id));

  const moveItem = useCallback((from: number, to: number) => {
    setTop5(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

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
              {(['/onboarding/personality', '/onboarding/interests', '/onboarding/starting-point'] as const).map((route, idx) => (
                <button
                  key={route}
                  onClick={() => navigate(route)}
                  style={{
                    width: idx <= 1 ? 24 : 8, height: 4,
                    borderRadius: 999,
                    background: idx <= 1 ? GREEN : '#c5cad1',
                    border: 'none', padding: 0, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <h1 style={{ color: TEXT_DARK, fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>
          Pick your top 5<br />interests 💫
        </h1>
        <p style={{ color: TEXT_MID, fontSize: 13, marginTop: 6 }}>Tap to select, then drag to rank them.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4" style={{ scrollbarWidth: 'none' }}>
        {/* Top 5 zone */}
        <div className="rounded-2xl p-4 mb-5" style={{ background: BG, boxShadow: neuIn, minHeight: 88 }}>
          <div className="flex items-center justify-between mb-3">
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
            <div className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {top5.map((interest, idx) => (
                  <motion.div
                    key={interest.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <SortableRow
                      interest={interest}
                      index={idx}
                      moveItem={moveItem}
                      onRemove={removeFromTop5}
                    />
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

export default function InterestsPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <InterestsInner />
    </DndProvider>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, MapPin, Clock, DollarSign, ChevronDown, ChevronUp,
  Utensils, Landmark, Bed, Car, Bot, Check, Map
} from 'lucide-react';
import { BG, BLUE, GREEN, GOLD, TEXT_DARK, TEXT_MID, TEXT_LIGHT, neuEx, neuIn, neuExSm, neuGoldGlow } from '../neu';

interface Activity {
  id: string;
  name: string;
  time: string;
  cost: number;
  type: 'sight' | 'food' | 'transport' | 'hotel';
  checked: boolean;
  note?: string;
}

interface DayData {
  day: number;
  city: string;
  color: string;
  emoji: string;
  activities: Activity[];
  expanded: boolean;
}

const initialDays: DayData[] = [
  {
    day: 1, city: 'Bangkok', color: '#1B73C6', emoji: '🏙️', expanded: true,
    activities: [
      { id: 'a1', name: 'Grand Palace & Wat Phra Kaew', time: '09:00', cost: 500, type: 'sight', checked: false, note: 'Dress modestly — no shorts' },
      { id: 'a2', name: 'Khao Tom at Or Tor Kor Market', time: '12:30', cost: 120, type: 'food', checked: false },
      { id: 'a3', name: 'Wat Pho (Reclining Buddha)', time: '14:00', cost: 200, type: 'sight', checked: false },
      { id: 'a4', name: 'Tuk-tuk to Chao Phraya Pier', time: '16:00', cost: 80, type: 'transport', checked: false },
      { id: 'a5', name: 'Asiatique Night Market', time: '19:00', cost: 300, type: 'food', checked: false },
      { id: 'a6', name: 'Check-in: Bangkok Marriott', time: '22:00', cost: 2800, type: 'hotel', checked: false },
    ]
  },
  {
    day: 2, city: 'Ayutthaya', color: '#10B981', emoji: '🏛️', expanded: false,
    activities: [
      { id: 'b1', name: 'Drive to Ayutthaya (1.5h)', time: '08:00', cost: 350, type: 'transport', checked: false },
      { id: 'b2', name: 'Wat Mahathat', time: '10:00', cost: 50, type: 'sight', checked: false, note: 'See the Buddha head in tree roots' },
      { id: 'b3', name: 'Wat Chai Watthanaram', time: '12:00', cost: 50, type: 'sight', checked: false },
      { id: 'b4', name: 'Lunch: Riverside Restaurants', time: '13:30', cost: 200, type: 'food', checked: false },
      { id: 'b5', name: 'Elephant Sanctuary Visit', time: '15:00', cost: 800, type: 'sight', checked: false, note: 'Ethical sanctuary, no riding' },
      { id: 'b6', name: 'Return to Bangkok / Night Train North', time: '19:00', cost: 650, type: 'transport', checked: false },
    ]
  },
  {
    day: 3, city: 'Chiang Mai', color: '#F59E0B', emoji: '🏔️', expanded: false,
    activities: [
      { id: 'c1', name: 'Arrive Chiang Mai', time: '07:00', cost: 0, type: 'transport', checked: false },
      { id: 'c2', name: 'Khao Soi at Khun Yai', time: '09:00', cost: 80, type: 'food', checked: false, note: 'Best khao soi in Chiang Mai!' },
      { id: 'c3', name: 'Doi Suthep Temple', time: '11:00', cost: 30, type: 'sight', checked: false },
      { id: 'c4', name: 'Thai Cooking Class', time: '14:00', cost: 950, type: 'food', checked: false, note: 'Added by AI ✨' },
      { id: 'c5', name: 'Nimman Road Cafes', time: '17:30', cost: 200, type: 'food', checked: false },
      { id: 'c6', name: 'Sunday Night Walking Street', time: '20:00', cost: 400, type: 'food', checked: false },
      { id: 'c7', name: 'Check-in: Riverside Boutique', time: '23:00', cost: 1800, type: 'hotel', checked: false },
    ]
  },
  {
    day: 4, city: 'Chiang Rai', color: '#8B5CF6', emoji: '⛪', expanded: false,
    activities: [
      { id: 'd1', name: 'Drive to Chiang Rai (3h)', time: '08:00', cost: 500, type: 'transport', checked: false },
      { id: 'd2', name: 'White Temple (Wat Rong Khun)', time: '11:30', cost: 100, type: 'sight', checked: false, note: 'No black clothing inside' },
      { id: 'd3', name: 'Blue Temple (Wat Rong Suea Ten)', time: '13:30', cost: 0, type: 'sight', checked: false },
      { id: 'd4', name: 'Lunch at local market', time: '14:30', cost: 150, type: 'food', checked: false },
      { id: 'd5', name: 'Golden Triangle Viewpoint', time: '16:00', cost: 0, type: 'sight', checked: false },
      { id: 'd6', name: 'Return flight to Bangkok', time: '19:00', cost: 1200, type: 'transport', checked: false },
    ]
  },
];

const activityIcons = { sight: Landmark, food: Utensils, transport: Car, hotel: Bed };

export default function ItineraryPage() {
  const navigate = useNavigate();
  const [days, setDays] = useState<DayData[]>(initialDays);

  const toggleDay = (dayNum: number) => {
    setDays(d => d.map(day => day.day === dayNum ? { ...day, expanded: !day.expanded } : day));
  };

  const toggleCheck = (dayNum: number, actId: string) => {
    setDays(d => d.map(day =>
      day.day === dayNum
        ? { ...day, activities: day.activities.map(a => a.id === actId ? { ...a, checked: !a.checked } : a) }
        : day
    ));
  };

  const totalBudget = days.reduce((sum, day) =>
    sum + day.activities.reduce((s, a) => s + a.cost, 0), 0
  );

  const dayBudget = (day: DayData) => day.activities.reduce((s, a) => s + a.cost, 0);

  return (
    <div className="flex flex-col h-full" style={{ background: BG, fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="flex-shrink-0 pt-10 px-4 pb-3">
        <div className="px-4 py-4 rounded-3xl" style={{ background: BG, boxShadow: neuExSm }}>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate('/planner')}
            className="flex items-center gap-1.5"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MID, fontSize: 14, fontFamily: 'Poppins, sans-serif' }}
          >
            <ArrowLeft size={16} /> Map View
          </button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate('/live')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full"
            style={{ background: GREEN, boxShadow: neuExSm, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}
          >
            Go Live 🚀
          </motion.button>
        </div>

        {/* Total Budget Card */}
        <motion.div
          className="rounded-3xl px-5 py-4 mt-1"
          style={{ background: BG, boxShadow: neuGoldGlow }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div style={{ fontSize: 11, color: TEXT_MID, letterSpacing: 1.5 }}>TOTAL ESTIMATED BUDGET</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>฿{totalBudget.toLocaleString()}</span>
                <span style={{ fontSize: 13, color: TEXT_MID }}>THB</span>
              </div>
              <div style={{ fontSize: 12, color: TEXT_MID, marginTop: 2 }}>
                ≈ ${Math.round(totalBudget / 35)} USD · 4 Days · 4 Cities
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              {days.map(d => (
                <div key={d.day} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: d.color }} />
                  <span style={{ fontSize: 11, color: TEXT_MID }}>D{d.day}: ฿{dayBudget(d).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Budget bar */}
          <div className="mt-3 rounded-full overflow-hidden" style={{ height: 6, background: BG, boxShadow: neuIn }}>
            <div className="h-full flex">
              {days.map(d => (
                <div key={d.day} className="h-full" style={{
                  width: `${(dayBudget(d) / totalBudget) * 100}%`,
                  background: d.color,
                  transition: 'width 0.5s',
                }} />
              ))}
            </div>
          </div>
        </motion.div>
        </div>
      </div>

      {/* Day Cards */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-8" style={{ scrollbarWidth: 'none' }}>
        {days.map((day) => (
          <div key={day.day} className="mb-4">
            {/* Day Header */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleDay(day.day)}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl mb-1"
              style={{ background: BG, boxShadow: neuEx, border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: BG, boxShadow: neuExSm, border: `2px solid ${day.color}` }}>
                  {day.emoji}
                </div>
                <div className="text-left">
                  <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK }}>Day {day.day} — {day.city}</div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 12, color: day.color }}>฿{dayBudget(day).toLocaleString()}</span>
                    <span style={{ fontSize: 11, color: TEXT_LIGHT }}>·</span>
                    <span style={{ fontSize: 12, color: TEXT_LIGHT }}>{day.activities.length} stops</span>
                    <span style={{ fontSize: 11, color: TEXT_LIGHT }}>·</span>
                    <span style={{ fontSize: 12, color: TEXT_LIGHT }}>
                      {day.activities.filter(a => a.checked).length} done
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded-full" style={{ background: day.color + '22' }}>
                  <span style={{ fontSize: 11, color: day.color, fontWeight: 600 }}>
                    {Math.round((day.activities.filter(a => a.checked).length / day.activities.length) * 100)}%
                  </span>
                </div>
                {day.expanded ? <ChevronUp size={16} color={TEXT_MID} /> : <ChevronDown size={16} color={TEXT_MID} />}
              </div>
            </motion.button>

            {/* Activity List */}
            <AnimatePresence>
              {day.expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="relative pl-8 pr-2">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 rounded-full"
                      style={{ background: day.color + '40' }} />

                    {day.activities.map((activity, idx) => {
                      const Icon = activityIcons[activity.type];
                      return (
                        <div key={activity.id} className="relative mb-2">
                          {/* Timeline dot */}
                          <div className="absolute -left-5 top-3.5 w-2.5 h-2.5 rounded-full border-2"
                            style={{
                              background: activity.checked ? day.color : BG,
                              borderColor: day.color,
                            }} />

                          <motion.div
                            className="flex items-start gap-3 p-3 rounded-xl"
                            style={{
                              background: BG,
                              boxShadow: neuExSm,
                              opacity: activity.checked ? 0.6 : 1,
                            }}
                          >
                            {/* Checkbox */}
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => toggleCheck(day.day, activity.id)}
                              className="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                              style={{
                                background: activity.checked ? GREEN : BG,
                                boxShadow: activity.checked ? 'none' : neuIn,
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              {activity.checked && <Check size={12} color="#fff" />}
                            </motion.button>

                            {/* Icon */}
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: day.color + '20' }}>
                              <Icon size={14} color={day.color} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div style={{
                                fontSize: 13, fontWeight: 600, color: TEXT_DARK,
                                textDecoration: activity.checked ? 'line-through' : 'none'
                              }}>
                                {activity.name}
                              </div>
                              {activity.note && (
                                <div style={{ fontSize: 11, color: TEXT_MID, marginTop: 1 }}>
                                  💡 {activity.note}
                                </div>
                              )}
                            </div>

                            {/* Time & Cost */}
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <div className="flex items-center gap-1" style={{ color: TEXT_MID, fontSize: 11 }}>
                                <Clock size={10} /> {activity.time}
                              </div>
                              {activity.cost > 0 && (
                                <div style={{ fontSize: 11, fontWeight: 600, color: day.color }}>
                                  ฿{activity.cost}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}

                    {/* Edit with AI */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="mt-1 mb-2 flex items-center gap-1.5 px-3 py-2 rounded-xl"
                      style={{ background: BG, boxShadow: neuExSm, color: BLUE, border: `1px dashed ${BLUE}44`, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}
                    >
                      <Bot size={13} />
                      Edit Day {day.day} with AI
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

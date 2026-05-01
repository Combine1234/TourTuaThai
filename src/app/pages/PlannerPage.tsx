import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings, Undo2, Redo2, BookMarked, Save,
  Bot, Send, List, X, Map,
  Cloud, Users, Star, Compass, Zap, Lock,
  Mic, Paperclip, FileText,
} from 'lucide-react';
import { BG, BLUE, GREEN, GOLD, TEXT_DARK, TEXT_MID, TEXT_LIGHT, neuEx, neuIn, neuExSm, neuBlueGlow } from '../neu';

const OPENROUTER_API_KEY = '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'; // แนะนำให้ใส่ใน .env

type ChatMessage = {
  role: 'user' | 'ai';
  text: string;
  file?: { name: string; size: string };
};

const callOpenRouter = async (chatHistory: ChatMessage[]) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin, // ✅ ดึง URL จริงอัตโนมัติ
        "X-Title": "AI Trip Planner"
      },
      body: JSON.stringify({
        "model": "openrouter/free", // ✅ เปลี่ยนชื่อโมเดล
        "messages": chatHistory.map(m => ({
          "role": m.role === 'ai' ? 'assistant' : 'user',
          "content": m.text
        })),
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // ✅ แสดง error ละเอียดขึ้น
      console.error("🚨 Full error response:", JSON.stringify(data, null, 2));
      throw new Error(data.error?.message || data.error?.code || JSON.stringify(data));
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error("🚨 Fetch Error:", error);
    throw error;
  }
};

const FILTERS = [
  { id: 'province', label: 'Province', icon: Map, color: BLUE },
  { id: 'crowds', label: 'Crowds', icon: Users, color: GREEN },
  { id: 'authentic', label: 'Authentic', icon: Star, color: GOLD },
  { id: 'weather', label: 'Weather', icon: Cloud, color: BLUE },
  { id: 'transport', label: 'Transport', icon: Zap, color: GREEN },
  { id: 'hotspots', label: 'Hotspots', icon: Compass, color: GOLD },
  { id: 'secrets', label: 'Local Secrets', icon: Lock, color: BLUE },
];

// Mock Thailand SVG Map with Routes
const TripMap = ({ activeDay }: { activeDay: number | null }) => {
  const stops = [
    { city: 'Bangkok', day: 1, x: 62, y: 68, color: '#1B73C6' },
    { city: 'Ayutthaya', day: 2, x: 57, y: 61, color: '#10B981' },
    { city: 'Chiang Mai', day: 3, x: 37, y: 29, color: '#F59E0B' },
    { city: 'Chiang Rai', day: 4, x: 35, y: 19, color: '#8B5CF6' },
    { city: 'Phuket', day: null, x: 27, y: 88, color: '#94A3B8' },
    { city: 'Koh Samui', day: null, x: 68, y: 82, color: '#94A3B8' },
    { city: 'Krabi', day: null, x: 31, y: 84, color: '#94A3B8' },
  ];

  const routeStops = stops.filter(s => s.day !== null).sort((a, b) => (a.day ?? 0) - (b.day ?? 0));

  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      {/* Background */}
      <rect width="100" height="100" fill="#D4E6F1" />
      {/* Grid lines (simplified map) */}
      {[20, 40, 60, 80].map(v => (
        <g key={v}>
          <line x1={v} y1="0" x2={v} y2="100" stroke="#C0D8EB" strokeWidth="0.3" strokeDasharray="2,3" />
          <line x1="0" y1={v} x2="100" y2={v} stroke="#C0D8EB" strokeWidth="0.3" strokeDasharray="2,3" />
        </g>
      ))}

      {/* Thailand shape */}
      <path
        d="M48 5 L55 8 L62 12 L65 18 L60 22 L62 28 L58 32 L62 36 L64 42 L62 48 L66 54 L68 60 L65 66 L68 72 L66 78 L62 82 L58 86 L52 88 L48 86 L44 88 L40 90 L36 88 L32 84 L28 80 L26 76 L28 72 L30 68 L28 64 L30 60 L28 56 L24 52 L28 48 L30 42 L28 36 L26 30 L28 24 L32 18 L36 12 L42 8 Z"
        fill="#EBF5FB"
        stroke="#A8CCE0"
        strokeWidth="0.6"
      />
      <path
        d="M48 86 L44 88 L40 90 L36 88 L32 84 L30 88 L28 92 L30 96 L32 98 L34 96 L36 92 L38 96 L40 98 L42 96 L44 92 L48 86Z"
        fill="#EBF5FB"
        stroke="#A8CCE0"
        strokeWidth="0.6"
      />

      {/* Route lines */}
      {routeStops.map((stop, idx) => {
        if (idx === 0) return null;
        const prev = routeStops[idx - 1];
        const isActive = activeDay === null || stop.day === activeDay || prev.day === activeDay;
        return (
          <line
            key={idx}
            x1={prev.x} y1={prev.y} x2={stop.x} y2={stop.y}
            stroke={stop.color}
            strokeWidth="1.2"
            strokeDasharray="3,2"
            opacity={isActive ? 1 : 0.3}
          />
        );
      })}

      {/* All city markers */}
      {stops.map(stop => {
        const isActive = activeDay === null || stop.day === activeDay;
        const isRoute = stop.day !== null;
        return (
          <g key={stop.city}>
            {isRoute && isActive && (
              <circle cx={stop.x} cy={stop.y} r={7} fill={stop.color + '25'} />
            )}
            <circle
              cx={stop.x} cy={stop.y}
              r={isRoute ? (isActive ? 3.5 : 2.5) : 1.8}
              fill={isActive ? stop.color : '#94A3B8'}
              stroke="white"
              strokeWidth="0.8"
            />
            {isRoute && (
              <text
                x={stop.x + (stop.x > 50 ? -4 : 4)}
                y={stop.y - 5}
                fontSize="4"
                fill={isActive ? stop.color : '#94A3B8'}
                fontWeight="bold"
                textAnchor={stop.x > 50 ? 'end' : 'start'}
              >
                D{stop.day} {stop.city}
              </text>
            )}
            {!isRoute && (
              <text x={stop.x + 3} y={stop.y + 1} fontSize="3.5" fill="#94A3B8" textAnchor="start">
                {stop.city}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const AI_MESSAGES: ChatMessage[] = [
  { role: 'ai', text: "✨ I've crafted a 4-day Northern Thailand route for you! Starting in Bangkok, heading up to Ayutthaya's ancient temples, then Chiang Mai and Chiang Rai. Want me to adjust anything?" },
  { role: 'user', text: "Can you add more food stops in Chiang Mai?" },
  { role: 'ai', text: "🍜 Done! I've added Khao Soi Khun Yai for iconic Northern khao soi, Talad Warorot Night Bazaar for street food, and a Thai cooking class at Baan Thai. Day 3 is now a food lover's dream!" },
];

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PlannerPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(AI_MESSAGES);
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = filterBarRef.current;
    if (!el) return;
    let isDown = false, startX = 0, scrollLeft = 0;
    const onMouseDown = (e: MouseEvent) => { isDown = true; startX = e.clientX; scrollLeft = el.scrollLeft; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      el.scrollLeft = scrollLeft - (e.clientX - startX);
    };
    const onMouseUp = () => { isDown = false; };
    const onWheel = (e: WheelEvent) => { e.preventDefault(); el.scrollLeft += e.deltaY + e.deltaX; };
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setAttachedFile({ name: f.name, size: formatSize(f.size) });
    e.target.value = '';
  };

  const sendMessage = async () => {
    if (!input.trim() && !attachedFile) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      ...(attachedFile ? { file: attachedFile } : {}),
    };
    const fileLabel = attachedFile ? `[Attached file: ${attachedFile.name}]\n` : '';

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedFile(null);

    // Build API history — inject file label into the text sent to the model
    const apiHistory: ChatMessage[] = [
      ...messages,
      { role: 'user', text: fileLabel + input },
    ];

    try {
      const aiResponseText = await callOpenRouter(apiHistory);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponseText }]);
    } catch (error: any) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `🚨 ล้มเหลว: ${error.message || "ไม่ทราบสาเหตุ ลองเช็ค Console (F12)"}`,
      }]);
    }
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden" style={{ background: BG, fontFamily: 'Poppins, sans-serif' }}>
      {/* Filter pills */}
      <div className="flex-shrink-0 pt-10 px-4 pb-3" style={{ zIndex: 10 }}>
        <div ref={filterBarRef} className="flex gap-2 overflow-x-auto rounded-3xl px-3 py-2.5" style={{ scrollbarWidth: 'none', boxShadow: neuIn, cursor: 'grab' }}>
          {FILTERS.map(f => {
            const Icon = f.icon;
            const active = activeFilter === f.id;
            return (
              <motion.button
                key={f.id}
                whileTap={{ scale: 0.93 }}
                onClick={() => setActiveFilter(active ? null : f.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full"
                style={{
                  background: BG,
                  boxShadow: active ? neuIn : neuExSm,
                  color: active ? f.color : f.color + 'AA',
                  border: `1.5px solid ${active ? f.color : f.color + '55'}`,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                <Icon size={12} />
                {f.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative mx-4 rounded-3xl overflow-hidden" style={{ boxShadow: neuIn, minHeight: 0 }}>
        <TripMap activeDay={null} />

        {/* Right Toolbar */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          {[Settings, Undo2, Redo2, BookMarked, Save].map((Icon, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.88 }}
              onClick={i === 0 ? () => navigate('/onboarding/personality') : undefined}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: BG, boxShadow: neuExSm, border: 'none', cursor: 'pointer' }}
            >
              <Icon size={15} color={TEXT_MID} />
            </motion.button>
          ))}
        </div>

      </div>

      {/* Bottom bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4">
        {/* Itinerary button */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate('/itinerary')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full"
          style={{ background: BG, boxShadow: neuExSm, color: TEXT_MID, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}
        >
          <List size={15} />
          Itinerary
        </motion.button>

        {/* AI Assistant Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          animate={{ boxShadow: showAI ? neuIn : neuBlueGlow }}
          onClick={() => setShowAI(!showAI)}
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: showAI ? BG : BLUE,
            boxShadow: showAI ? neuIn : neuBlueGlow,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Bot size={26} color={showAI ? BLUE : '#fff'} />
        </motion.button>

        {/* Live Mode button */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate('/live')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full"
          style={{ background: BG, boxShadow: neuExSm, color: TEXT_MID, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}
        >
          <Mic size={15} />
          Go Live
        </motion.button>
      </div>

      {/* AI Bottom Sheet */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute inset-x-0 bottom-0 rounded-t-3xl flex flex-col"
            style={{
              background: BG,
              boxShadow: `0 -8px 32px rgba(0,0,0,0.12), ${neuEx}`,
              height: '55%',
              zIndex: 20,
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full" style={{ background: '#c5cad1' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: BLUE, boxShadow: neuExSm }}>
                  <Bot size={16} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT_DARK }}>AI Trip Planner</div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
                    <span style={{ fontSize: 11, color: GREEN }}>Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowAI(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                <X size={18} color={TEXT_MID} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 pb-2" style={{ scrollbarWidth: 'none' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[82%] px-4 py-3 rounded-2xl"
                    style={{
                      background: msg.role === 'ai' ? BG : BLUE,
                      boxShadow: msg.role === 'ai' ? neuExSm : 'none',
                      color: msg.role === 'ai' ? TEXT_DARK : '#fff',
                      fontSize: 13,
                      lineHeight: 1.5,
                      borderBottomLeftRadius: msg.role === 'ai' ? 4 : 16,
                      borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                    }}
                  >
                    {msg.file && (
                      <div className="flex items-center gap-2 mb-2 px-2 py-1.5 rounded-xl"
                        style={{ background: msg.role === 'user' ? 'rgba(255,255,255,0.15)' : BG, boxShadow: msg.role === 'ai' ? neuExSm : 'none' }}>
                        <FileText size={14} color={msg.role === 'user' ? '#fff' : BLUE} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: msg.role === 'user' ? '#fff' : TEXT_DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.file.name}</div>
                          <div style={{ fontSize: 10, color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : TEXT_LIGHT }}>{msg.file.size}</div>
                        </div>
                      </div>
                    )}
                    {msg.text && msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 pb-6 pt-2 flex flex-col gap-2">
              {/* Attachment preview */}
              <AnimatePresence>
                {attachedFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: BLUE + '18', border: `1px solid ${BLUE}44` }}
                  >
                    <FileText size={14} color={BLUE} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: TEXT_DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{attachedFile.name}</div>
                      <div style={{ fontSize: 10, color: TEXT_LIGHT }}>{attachedFile.size}</div>
                    </div>
                    <button onClick={() => setAttachedFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 2 }}>
                      <X size={12} color={TEXT_MID} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  style={{ display: 'none' }}
                  onChange={onFileChange}
                />
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl"
                  style={{ background: BG, boxShadow: neuIn }}>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => fileInputRef.current?.click()}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', flexShrink: 0 }}
                  >
                    <Paperclip size={15} color={attachedFile ? BLUE : TEXT_LIGHT} />
                  </motion.button>
                  <input
                    ref={inputRef}
                    className="flex-1 bg-transparent outline-none"
                    style={{ color: TEXT_DARK, fontSize: 13, border: 'none', fontFamily: 'Poppins, sans-serif' }}
                    placeholder="Ask me to edit your trip..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: BLUE, boxShadow: neuExSm, border: 'none', cursor: 'pointer' }}
                >
                  <Send size={15} color="#fff" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

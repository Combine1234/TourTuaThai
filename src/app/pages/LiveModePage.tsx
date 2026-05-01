import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic, MicOff, Navigation2, Clock, Star, ChevronRight,
  Camera, ArrowLeft, Zap, Trophy, X, Volume2
} from 'lucide-react';
import { BG, BLUE, GREEN, GOLD, TEXT_DARK, TEXT_MID, TEXT_LIGHT, neuEx, neuIn, neuExSm, neuGoldGlow, neuBlueGlow } from '../neu';

const STOPS = [
  { name: 'Grand Palace', done: true },
  { name: 'Wat Pho', done: true },
  { name: 'Chatuchak Market', done: false, current: true },
  { name: 'Asiatique Market', done: false },
];

export default function LiveModePage() {
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showQuest, setShowQuest] = useState(false);
  const [questAccepted, setQuestAccepted] = useState(false);
  const [feedback, setFeedback] = useState(0);
  const [listening, setListening] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const eta = '23 min';

  useEffect(() => {
    const t1 = setTimeout(() => setShowFeedback(true), 3000);
    const t2 = setTimeout(() => setShowQuest(true), 6500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleMic = () => {
    setMicOn(!micOn);
    if (!micOn) {
      setListening(true);
      setTimeout(() => setListening(false), 3000);
    }
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Map Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(39, 174, 96, 0.28), transparent 22%),
            radial-gradient(circle at 78% 18%, rgba(27, 115, 198, 0.32), transparent 24%),
            radial-gradient(circle at 72% 72%, rgba(240, 165, 0, 0.20), transparent 20%),
            linear-gradient(180deg, #12324d 0%, #184c6b 42%, #0e2d43 100%)
          `,
        }}
      >
        <div className="absolute inset-0 opacity-35" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute inset-0" style={{ background: 'rgba(15,25,50,0.36)' }} />

        <div className="absolute inset-x-8 top-30 bottom-28 rounded-[28px] border border-white/15" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
          <div className="absolute left-[18%] top-[20%] h-3 w-3 rounded-full bg-white/85" />
          <div className="absolute left-[36%] top-[38%] h-3 w-3 rounded-full bg-white/85" />
          <div className="absolute left-[58%] top-[52%] h-3 w-3 rounded-full bg-white/85" />
          <div className="absolute left-[74%] top-[72%] h-3 w-3 rounded-full bg-white/85" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M18 20 C 28 26, 34 34, 36 39 S 51 48, 58 53 S 69 63, 74 72"
              fill="none"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1.8"
              strokeDasharray="2.4 2.8"
            />
          </svg>
        </div>
      </div>

      {/* Top Banner - Navigation Info */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 mx-4 mt-10 rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(232,237,242,0.92)', boxShadow: neuEx, backdropFilter: 'blur(12px)' }}
      >
        <button
          onClick={() => navigate('/planner')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}
        >
          <ArrowLeft size={18} color={TEXT_MID} />
        </button>

        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: BLUE, boxShadow: neuExSm }}>
          <Navigation2 size={18} color="#fff" />
        </div>

        <div className="flex-1 min-w-0">
          <div style={{ fontSize: 12, color: TEXT_MID }}>Next stop</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            🛍️ Chatuchak Market
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1" style={{ color: BLUE }}>
            <Clock size={12} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>{eta}</span>
          </div>
          <div style={{ fontSize: 11, color: TEXT_LIGHT }}>5.2 km</div>
        </div>
      </motion.div>

      {/* Stop Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mx-4 mt-3 px-4 py-3 rounded-2xl"
        style={{ background: 'rgba(232,237,242,0.85)', backdropFilter: 'blur(10px)', boxShadow: neuExSm }}
      >
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: 11, color: TEXT_MID, fontWeight: 600 }}>TODAY'S ROUTE — DAY 1</span>
          <span style={{ fontSize: 11, color: GREEN }}>2/4 complete</span>
        </div>
        <div className="flex items-center gap-1">
          {STOPS.map((stop, idx) => (
            <div key={idx} className="flex items-center gap-1 flex-1">
              <div className="flex-1 h-2 rounded-full"
                style={{
                  background: stop.done ? GREEN : stop.current ? BLUE : 'rgba(0,0,0,0.12)',
                  boxShadow: stop.current ? neuBlueGlow : 'none',
                  transition: 'background 0.4s',
                }} />
              {idx < STOPS.length - 1 && <div className="w-0.5 h-2" />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {STOPS.map((stop, idx) => (
            <div key={idx} style={{ fontSize: 9, color: stop.current ? BLUE : stop.done ? GREEN : TEXT_LIGHT, fontWeight: stop.current ? 700 : 400, maxWidth: '22%', textAlign: 'center' }}>
              {stop.name.split(' ')[0]}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Listening indicator */}
      <AnimatePresence>
        {listening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'rgba(27,115,198,0.9)', boxShadow: neuBlueGlow }}>
              <Volume2 size={36} color="#fff" />
            </div>
            <div className="px-4 py-2 rounded-full" style={{ background: 'rgba(232,237,242,0.9)' }}>
              <span style={{ fontSize: 13, color: TEXT_DARK }}>Listening... say your command</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <div className="relative z-10 px-5 pb-8 flex items-end justify-between">
        {/* EXP Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="px-3 py-2 rounded-xl flex items-center gap-2"
            style={{ background: 'rgba(240,165,0,0.9)', backdropFilter: 'blur(8px)', boxShadow: neuGoldGlow }}>
            <Trophy size={14} color="#fff" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>1,250 EXP</span>
          </div>
          <div className="px-3 py-1 rounded-full"
            style={{ background: 'rgba(232,237,242,0.85)', backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: 11, color: GOLD, fontWeight: 600 }}>⚡ Lvl 7 Explorer</span>
          </div>
        </motion.div>

        {/* Voice Mic Button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleMic}
          animate={{
            boxShadow: micOn ? neuBlueGlow : neuEx,
            background: micOn ? BLUE : BG,
          }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ border: 'none', cursor: 'pointer' }}
        >
          {micOn ? (
            <Mic size={30} color="#fff" />
          ) : (
            <MicOff size={28} color={TEXT_MID} />
          )}
        </motion.button>

        {/* Share Route — Strava style */}
        <motion.button
          whileTap={{ scale: 0.93 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-2"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => {
            const text = `🗺️ TourTuaThai Live Route — Day 1\n📍 Grand Palace ✅\n📍 Wat Pho ✅\n📍 Chatuchak Market 🟢\n📍 Asiatique Market ⏳\n🔥 1,250 EXP · Lvl 7 Explorer\nJoin me!`;
            if (navigator.share) {
              navigator.share({ title: 'My TourTuaThai Route', text });
            } else {
              navigator.clipboard.writeText(text).then(() => alert('Route copied!'));
            }
          }}
        >
          <div className="px-3 py-2.5 rounded-xl flex items-center gap-1.5"
            style={{ background: 'rgba(27,115,198,0.9)', backdropFilter: 'blur(8px)', boxShadow: neuExSm }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Share Route</span>
            <ChevronRight size={14} color="#fff" />
          </div>
          <div className="px-3 py-1 rounded-full"
            style={{ background: 'rgba(232,237,242,0.85)', backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: 11, color: TEXT_DARK }}>🏃 Strava style</span>
          </div>
        </motion.button>
      </div>

      {/* End of Day Feedback Slide-in */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 250 }}
            className="absolute z-30 inset-x-4 bottom-32 rounded-3xl p-5"
            style={{ background: 'rgba(232,237,242,0.97)', backdropFilter: 'blur(16px)', boxShadow: neuEx }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK }}>How was Wat Pho? 🏛️</div>
                <div style={{ fontSize: 12, color: TEXT_MID }}>Rate your experience</div>
              </div>
              <button onClick={() => setShowFeedback(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 2 }}>
                <X size={16} color={TEXT_MID} />
              </button>
            </div>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map(n => (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => { setFeedback(n); setTimeout(() => setShowFeedback(false), 600); }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: BG,
                    boxShadow: feedback >= n ? neuIn : neuExSm,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Star size={18} color={feedback >= n ? GOLD : TEXT_LIGHT} fill={feedback >= n ? GOLD : 'none'} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Local Quest Popup */}
      <AnimatePresence>
        {showQuest && !questAccepted && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="absolute z-40 inset-x-4 top-1/2 -translate-y-1/2 rounded-3xl p-5"
            style={{
              background: 'rgba(232,237,242,0.98)',
              backdropFilter: 'blur(16px)',
              boxShadow: neuGoldGlow,
              border: `2px solid ${GOLD}66`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: GOLD + '22', border: `2px solid ${GOLD}` }}
                >
                  ⚡
                </motion.div>
                <div>
                  <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: 1 }}>LOCAL QUEST!</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK }}>Secret OTOP Shop</div>
                </div>
              </div>
              <button onClick={() => setShowQuest(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} color={TEXT_MID} />
              </button>
            </div>

            <div style={{ fontSize: 13, color: TEXT_MID, lineHeight: 1.6, marginBottom: 16 }}>
              🗺️ A hidden local artisan shop is just <strong style={{ color: TEXT_DARK }}>180m from you</strong>!
              Find <strong style={{ color: TEXT_DARK }}>Baan Nang Craft</strong>, buy a souvenir, and upload a photo to earn XP.
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) setUploadedPhoto(URL.createObjectURL(file));
              }}
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => photoInputRef.current?.click()}
              className="w-full rounded-2xl flex flex-col items-center justify-center mb-4 overflow-hidden"
              style={{ background: BG, boxShadow: neuIn, border: `1.5px dashed ${GOLD}66`, cursor: 'pointer', minHeight: 88 }}
            >
              {uploadedPhoto ? (
                <img src={uploadedPhoto} alt="proof" style={{ width: '100%', height: 88, objectFit: 'cover' }} />
              ) : (
                <>
                  <Camera size={22} color={GOLD} />
                  <div style={{ fontSize: 12, color: TEXT_MID, marginTop: 6 }}>Tap to upload proof photo</div>
                </>
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setQuestAccepted(true)}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
              style={{
                background: GOLD,
                boxShadow: neuGoldGlow,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              <Zap size={18} />
              Accept Quest for 500 EXP
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quest Accepted Confirmation */}
      <AnimatePresence>
        {questAccepted && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 18 }}
            className="absolute z-40 inset-x-4 top-1/2 -translate-y-1/2 rounded-3xl p-6 flex flex-col items-center"
            style={{ background: 'rgba(232,237,242,0.97)', backdropFilter: 'blur(16px)', boxShadow: neuGoldGlow }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: 3, duration: 0.4 }}
              className="text-5xl mb-3"
            >
              🏆
            </motion.div>
            <div style={{ fontSize: 20, fontWeight: 700, color: GOLD, marginBottom: 6 }}>Quest Accepted!</div>
            <div style={{ fontSize: 13, color: TEXT_MID, textAlign: 'center', marginBottom: 16 }}>
              +500 EXP added to your account. Head to Baan Nang Craft and complete the quest!
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { setQuestAccepted(false); setShowQuest(false); setUploadedPhoto(null); }}
              className="px-6 py-3 rounded-2xl"
              style={{ background: GOLD, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, boxShadow: neuEx, fontFamily: 'Poppins, sans-serif' }}
            >
              Let's Go! 🚀
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

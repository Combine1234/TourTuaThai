import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic, MicOff, Navigation2, Clock, Star,
  Camera, ArrowLeft, Zap, Trophy, X, Volume2, Share2
} from 'lucide-react';
import { BG, BLUE, GREEN, GOLD, TEXT_DARK, TEXT_MID, TEXT_LIGHT, neuEx, neuIn, neuExSm, neuGoldGlow, neuBlueGlow } from '../neu';
import chatuchakBg from '../imports/chatuchak.jpg';

const STRAVA_ORANGE = '#FC4C02';

const ROUTE_STOPS = [
  { name: 'Grand Palace', short: 'Palace', x: 0.16, y: 0.18, done: true },
  { name: 'Wat Pho',      short: 'Wat Pho', x: 0.35, y: 0.36, done: true },
  { name: 'Chatuchak',   short: 'Chatuchak', x: 0.60, y: 0.54, done: false, current: true },
  { name: 'Asiatique',   short: 'Asiatique', x: 0.78, y: 0.74, done: false },
];

const STOPS = ROUTE_STOPS;

// Smooth curved path through all route stop points
function buildSvgPath(stops: typeof ROUTE_STOPS, W = 100, H = 100) {
  const pts = stops.map(s => ({ x: s.x * W, y: s.y * H }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx = (prev.x + curr.x) / 2;
    const cpy = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x} ${prev.y} ${cpx} ${cpy}`;
  }
  d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
  return d;
}

function drawCurvedPath(ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[]) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx = (prev.x + curr.x) / 2;
    const cpy = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
  }
  ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
}

async function generateAndShare() {
  const W = 800, H = 480;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Load the Chatuchak photo as background
  const BG_IMG = '/chatuchak-bg.jpg';
  try {
    const img = new Image();
    img.src = BG_IMG;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('bg load failed'));
    });
    // Draw blurred photo (extend by blurRadius on each side so edges don't fade)
    const blurPx = 14;
    ctx.filter = `blur(${blurPx}px) saturate(1.25) brightness(0.7)`;
    ctx.drawImage(img, -blurPx * 2, -blurPx * 2, W + blurPx * 4, H + blurPx * 4);
    ctx.filter = 'none';
  } catch {
    // Fallback gradient if image not yet saved
    const fallback = ctx.createLinearGradient(0, 0, W, H);
    fallback.addColorStop(0, '#0f1f14');
    fallback.addColorStop(1, '#111c10');
    ctx.fillStyle = fallback;
    ctx.fillRect(0, 0, W, H);
  }

  // Dark overlay so route and text stay legible
  ctx.fillStyle = 'rgba(0,0,0,0.42)';
  ctx.fillRect(0, 0, W, H);

  // Vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.9);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // Route points scaled to canvas
  const pts = ROUTE_STOPS.map(s => ({ ...s, x: s.x * W, y: s.y * H }));

  // Outer glow halo
  ctx.shadowColor = STRAVA_ORANGE;
  ctx.shadowBlur = 30;
  ctx.strokeStyle = 'rgba(252,76,2,0.35)';
  ctx.lineWidth = 18;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  drawCurvedPath(ctx, pts);
  ctx.stroke();

  // White underline for contrast
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 8;
  drawCurvedPath(ctx, pts);
  ctx.stroke();

  // Main orange route line
  ctx.shadowColor = STRAVA_ORANGE;
  ctx.shadowBlur = 10;
  ctx.strokeStyle = STRAVA_ORANGE;
  ctx.lineWidth = 5;
  drawCurvedPath(ctx, pts);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Stop markers
  pts.forEach((p, _i) => {
    const isCurrent = p.current;
    const r = isCurrent ? 14 : 9;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = p.done ? STRAVA_ORANGE : isCurrent ? '#ffffff' : 'rgba(255,255,255,0.35)';
    ctx.fill();
    ctx.strokeStyle = isCurrent ? STRAVA_ORANGE : '#ffffff';
    ctx.lineWidth = isCurrent ? 3 : 2;
    ctx.stroke();
    if (isCurrent) {
      ctx.fillStyle = STRAVA_ORANGE;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Bottom stats bar
  const barH = 90;
  const barGrad = ctx.createLinearGradient(0, H - barH - 20, 0, H);
  barGrad.addColorStop(0, 'rgba(0,0,0,0)');
  barGrad.addColorStop(0.4, 'rgba(0,0,0,0.75)');
  barGrad.addColorStop(1, 'rgba(0,0,0,0.9)');
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, H - barH - 20, W, barH + 20);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('Day 1 · Bangkok Route', 24, H - 50);

  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = '16px sans-serif';
  ctx.fillText('2/4 stops  ·  12.4 km  ·  Live', 24, H - 22);

  // Watermark
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('TourTuaThai', W - 16, 28);
  ctx.textAlign = 'left';

  // Share via Web Share API
  canvas.toBlob(async (blob) => {
    if (!blob) return;
    const file = new File([blob], 'route-map.png', { type: 'image/png' });
    const shareData = { files: [file], title: 'My TourTuaThai Route — Day 1' };
    if (navigator.canShare && navigator.canShare(shareData)) {
      try { await navigator.share(shareData); } catch { /* cancelled */ }
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'route-map.png'; a.click();
      URL.revokeObjectURL(url);
    }
  }, 'image/png');
}

// ─── Strava-style Route Map Card ────────────────────────────────────────────
function RouteMapCard() {
  const svgPath = buildSvgPath(ROUTE_STOPS);

  return (
    <div className="relative rounded-3xl overflow-hidden mx-4" style={{ height: 230 }}>

      {/* ── Blurred photo background ── */}
      <img
        src="/chatuchak-bg.jpg"
        alt=""
        aria-hidden
        className="absolute"
        style={{
          inset: '-14px',
          width: 'calc(100% + 28px)',
          height: 'calc(100% + 28px)',
          objectFit: 'cover',
          filter: 'blur(7px) saturate(1.3) brightness(0.68)',
        }}
      />

      {/* ── Dark vignette ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.52) 100%)',
      }} />

      {/* ── Route SVG ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feFlood floodColor={STRAVA_ORANGE} floodOpacity="0.55" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Outer glow halo */}
        <path d={svgPath} fill="none" stroke={STRAVA_ORANGE} strokeWidth="7"
          strokeOpacity="0.28" strokeLinecap="round" filter="url(#glowFilter)" />

        {/* White contrast underline */}
        <path d={svgPath} fill="none" stroke="rgba(255,255,255,0.38)"
          strokeWidth="3.8" strokeLinecap="round" />

        {/* Main Strava orange route */}
        <path d={svgPath} fill="none" stroke={STRAVA_ORANGE}
          strokeWidth="2.6" strokeLinecap="round" />

        {/* Stop markers */}
        {ROUTE_STOPS.map((s, i) => {
          const cx = s.x * 100;
          const cy = s.y * 100;
          const isCur = s.current;
          return (
            <g key={i}>
              {isCur && (
                <circle cx={cx} cy={cy} r="6.5" fill="none"
                  stroke={STRAVA_ORANGE} strokeWidth="1" strokeOpacity="0.45" />
              )}
              <circle cx={cx} cy={cy} r={isCur ? 4 : 2.8} fill="none"
                stroke={s.done ? STRAVA_ORANGE : isCur ? '#fff' : 'rgba(255,255,255,0.5)'}
                strokeWidth="1.4" />
              <circle cx={cx} cy={cy} r={isCur ? 2.2 : s.done ? 1.8 : 1.2}
                fill={s.done ? STRAVA_ORANGE : isCur ? '#fff' : 'rgba(255,255,255,0.28)'} />
            </g>
          );
        })}
      </svg>

      {/* ── Stats overlay ── */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8" style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)',
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>
          Day 1 · Bangkok Route
        </div>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>2/4 stops</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: STRAVA_ORANGE, display: 'inline-block' }} />
          <span style={{ fontSize: 11, color: STRAVA_ORANGE, fontWeight: 600 }}>Live</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>12.4 km</span>
        </div>
      </div>

      {/* ── Watermark ── */}
      <div className="absolute top-3 right-4"
        style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: 0.5 }}>
        TourTuaThai
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function LiveModePage() {
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showQuest, setShowQuest] = useState(false);
  const [questAccepted, setQuestAccepted] = useState(false);
  const [feedback, setFeedback] = useState(0);
  const [listening, setListening] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
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

  const handleShare = async () => {
    setSharing(true);
    try { await generateAndShare(); } finally { setSharing(false); }
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden"
      style={{ fontFamily: 'Poppins, sans-serif', background: BG }}>

      {/* Top Banner */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 mx-4 mt-10 rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ background: BG, boxShadow: neuEx }}
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
        style={{ background: BG, boxShadow: neuExSm }}
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
              {stop.short || stop.name.split(' ')[0]}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Strava-style Route Map Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 22 }}
        className="relative z-10 mt-3"
      >
        <RouteMapCard />
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
            style={{ background: BG, boxShadow: neuExSm }}>
            <Trophy size={14} color={GOLD} />
            <span style={{ fontSize: 12, fontWeight: 700, color: GOLD }}>1,250 EXP</span>
          </div>
          <div className="px-3 py-1 rounded-full" style={{ background: BG, boxShadow: neuExSm }}>
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

        {/* Share Route — canvas + Web Share API */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-2"
        >
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleShare}
            disabled={sharing}
            className="px-3 py-2 rounded-xl flex items-center gap-1.5"
            style={{
              background: BG,
              boxShadow: neuExSm,
              border: 'none',
              cursor: sharing ? 'wait' : 'pointer',
              opacity: sharing ? 0.7 : 1,
            }}
          >
            <Share2 size={14} color={STRAVA_ORANGE} />
            <span style={{ fontSize: 12, fontWeight: 700, color: STRAVA_ORANGE }}>
              {sharing ? 'Generating…' : 'Share Route'}
            </span>
          </motion.button>
          <div className="px-3 py-1 rounded-full" style={{ background: BG, boxShadow: neuExSm }}>
            <span style={{ fontSize: 11, color: TEXT_MID }}>🏃 Strava style</span>
          </div>
        </motion.div>
      </div>

      {/* End of Day Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 250 }}
            className="absolute z-30 inset-x-4 bottom-32 rounded-3xl p-5"
            style={{ background: BG, backdropFilter: 'blur(16px)', boxShadow: neuEx }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK }}>How was Wat Pho? 🏛️</div>
                <div style={{ fontSize: 12, color: TEXT_MID }}>Rate your experience</div>
              </div>
              <button onClick={() => setShowFeedback(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 2 }}>
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
                  style={{ background: BG, boxShadow: feedback >= n ? neuIn : neuExSm, border: 'none', cursor: 'pointer' }}
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
            style={{ background: BG, boxShadow: neuGoldGlow, border: `2px solid ${GOLD}66` }}
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
              <button onClick={() => setShowQuest(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} color={TEXT_MID} />
              </button>
            </div>
            <div style={{ fontSize: 13, color: TEXT_MID, lineHeight: 1.6, marginBottom: 16 }}>
              🗺️ A hidden local artisan shop is just <strong style={{ color: TEXT_DARK }}>180m from you</strong>!
              Find <strong style={{ color: TEXT_DARK }}>Baan Nang Craft</strong>, buy a souvenir, and upload a photo to earn XP.
            </div>
            <input
              ref={photoInputRef} type="file" accept="image/*"
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
              style={{ background: GOLD, boxShadow: neuGoldGlow, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}
            >
              <Zap size={18} />
              Accept Quest for 500 EXP
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quest Accepted */}
      <AnimatePresence>
        {questAccepted && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 18 }}
            className="absolute z-40 inset-x-4 top-1/2 -translate-y-1/2 rounded-3xl p-6 flex flex-col items-center"
            style={{ background: BG, boxShadow: neuGoldGlow }}
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

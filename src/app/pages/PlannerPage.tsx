import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

// @ts-ignore: pdfjs-dist does not ship with TypeScript declarations in this project
import * as pdfjsLib from 'pdfjs-dist';
import {
  Settings, Undo2, Redo2, BookMarked, Save,
  Bot, Send, List, X, Map,
  Cloud, Users, Star, Compass, Zap, Lock,
  Mic, Paperclip, FileText,
} from 'lucide-react';
import { BG, BLUE, GREEN, GOLD, TEXT_DARK, TEXT_MID, TEXT_LIGHT, neuEx, neuIn, neuExSm, neuBlueGlow } from '../neu';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const OPENROUTER_API_KEY = "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";

type TripStop = {
  city: string;
  day: number;
  lat: number;
  lon: number;
  color: string;
  note?: string;
};

const COLORS = ['#1B73C6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#F97316'];

type ChatMessage = {
  role: 'user' | 'ai';
  text: string;
  file?: { name: string; size: string };
};

const MODELS = [
  "google/gemma-3-27b-it:free",
  "google/gemma-3-12b-it:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "openrouter/free",
];

const callOpenRouter = async (chatHistory: ChatMessage[], systemPrompt?: string) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const messages = [
    ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
    ...chatHistory.map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.text,
    })),
  ];

  const lastError: string[] = [];

  for (const model of MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "AI Trip Planner"
        },
        body: JSON.stringify({ model, messages })
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.error?.message ?? `HTTP ${response.status}`;
        console.warn(`⚠️ Model ${model} failed:`, msg);
        lastError.push(`${model}: ${msg}`);
        continue;
      }

      console.log(`✅ Used model: ${model}`);
      return data.choices[0].message.content as string;

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`⚠️ Model ${model} network error:`, err);
      lastError.push(`${model}: ${msg}`);
    }
  }

  throw new Error(`All models failed:\n${lastError.join('\n')}`);
};

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item: any) => item.str).join(' ') + '\n';
  }
  return fullText;
}

const FILTERS = [
  { id: 'province', label: 'Province', icon: Map, color: BLUE },
  { id: 'crowds', label: 'Crowds', icon: Users, color: GREEN },
  { id: 'authentic', label: 'Authentic', icon: Star, color: GOLD },
  { id: 'weather', label: 'Weather', icon: Cloud, color: BLUE },
  { id: 'transport', label: 'Transport', icon: Zap, color: GREEN },
  { id: 'hotspots', label: 'Hotspots', icon: Compass, color: GOLD },
  { id: 'secrets', label: 'Local Secrets', icon: Lock, color: BLUE },
];

const LAYER_OPTIONS = [
  { id: 'map' as const, label: 'Map', icon: '🗺️' },
  { id: 'satellite' as const, label: 'Satellite', icon: '🛰️' },
  { id: 'traffic' as const, label: 'Traffic', icon: '🚦' },
];

// ─────────────────────────────────────────────
// TripMap — fixed race condition between map init and stops update
// ─────────────────────────────────────────────
const TripMap = ({ stops }: { stops: TripStop[] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const mapReadyRef = useRef(false);
  const pendingStopsRef = useRef<TripStop[]>(stops); // always holds latest stops
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'map' | 'satellite' | 'traffic'>('map');

  const switchLayer = (layer: 'map' | 'satellite' | 'traffic') => {
    const ld = (window as any).longdo;
    const map = mapInstanceRef.current;
    if (!map || !ld) return;
    try { map.Layers.remove(ld.Layers.TRAFFIC); } catch {}
    if (layer === 'satellite') {
      const satLayer = ld.Layers.GEOIMAGERY ?? ld.Layers.SATELLITE ?? ld.Layers.HYBRID;
      try { map.Layers.setBase(satLayer); } catch {}
    } else {
      try { map.Layers.setBase(ld.Layers.NORMAL); } catch {}
      if (layer === 'traffic') {
        try { map.Layers.add(ld.Layers.TRAFFIC); } catch {}
      }
    }
    setActiveLayer(layer);
    setShowLayerMenu(false);
  };

  // ── Shared redraw function (stable ref via useCallback) ──
  const redrawOverlays = useCallback((currentStops: TripStop[], map: any) => {
    const longdo = (window as any).longdo;
    if (!map || !longdo) return;

    try { map.Overlays.clear(); } catch {}
    if (currentStops.length === 0) return;

    // Place markers
    currentStops.forEach(stop => {
      const marker = new longdo.Marker(
        { lon: stop.lon, lat: stop.lat },
        {
          title: stop.city,
          detail: `Day ${stop.day}${stop.note ? ': ' + stop.note : ''}`,
          icon: {
            html: `<div style="
              background:${stop.color};color:white;border-radius:50%;
              width:34px;height:34px;display:flex;align-items:center;
              justify-content:center;font-weight:700;
              border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);
              font-family:Poppins,sans-serif;flex-direction:column;line-height:1.1;
            ">
              <span style="font-size:8px;opacity:0.85">D${stop.day}</span>
              <span style="font-size:7px;max-width:28px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${stop.city.split(' ')[0]}</span>
            </div>`,
            offset: { x: 17, y: 17 },
          },
        }
      );
      map.Overlays.add(marker);
    });

    // Center map to fit all stops
    const lats = currentStops.map(s => s.lat);
    const lons = currentStops.map(s => s.lon);
    map.location({
      lon: (Math.min(...lons) + Math.max(...lons)) / 2,
      lat: (Math.min(...lats) + Math.max(...lats)) / 2,
    }, true);

    // Draw real road routes via OSRM, fallback to straight line
    const sorted = [...currentStops].sort((a, b) => a.day - b.day);

    const drawRoutes = async () => {
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];

        try {
          const res = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${prev.lon},${prev.lat};${curr.lon},${curr.lat}?overview=full&geometries=geojson`
          );
          const data = await res.json();

          if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error('No route');

          const coords: { lon: number; lat: number }[] = data.routes[0].geometry.coordinates.map(
            ([lon, lat]: [number, number]) => ({ lon, lat })
          );

          // Shadow line for depth
          map.Overlays.add(new longdo.Polyline(coords, {
            lineColor: '#00000022',
            lineWidth: 7,
            lineStyle: longdo.LineStyle.Solid,
            opacity: 1,
          }));

          // Colored route line on top
          map.Overlays.add(new longdo.Polyline(coords, {
            lineColor: curr.color,
            lineWidth: 4,
            lineStyle: longdo.LineStyle.Solid,
            opacity: 0.9,
          }));

        } catch {
          // Fallback: dashed straight line
          map.Overlays.add(new longdo.Polyline(
            [{ lon: prev.lon, lat: prev.lat }, { lon: curr.lon, lat: curr.lat }],
            { lineColor: curr.color, lineWidth: 3, lineStyle: longdo.LineStyle.Dash, opacity: 0.8 }
          ));
        }
      }
    };

    drawRoutes();
  }, []); // no deps — only uses args and window globals

  // ── Init map ONCE ──────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      if (!(window as any).longdo || mapInstanceRef.current) return;
      try {
        const longdo = (window as any).longdo;
        const map = new longdo.Map({
          placeholder: mapRef.current,
          zoom: 6,
          lastView: false,
        });
        map.location({ lon: 100.5, lat: 14.5 }, true);
        mapInstanceRef.current = map;
        mapReadyRef.current = true;

        try { map.Ui.DPad.visible(false); } catch {}
        try { map.Ui.Zoombar.visible(false); } catch {}
        try { map.Ui.LayerSelector.visible(false); } catch {}
        try { map.Ui.Terrain.visible(false); } catch {}

        if (mapRef.current) {
          const s = document.createElement('style');
          s.textContent = `.ldmap_copyright,.ldmap-copyright,.ldmap_info,.longdo-copyright{font-size:9px!important;opacity:0.6;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:200px!important}`;
          mapRef.current.appendChild(s);
        }

        // ✅ After map is ready, draw any stops that arrived before init finished
        if (pendingStopsRef.current.length > 0) {
          redrawOverlays(pendingStopsRef.current, map);
        }
      } catch (err) {
        console.error('Longdo Map init error:', err);
      }
    };

    if ((window as any).longdo) {
      initMap();
    } else {
      const script = document.querySelector('script[src*="longdo.com"]');
      script?.addEventListener('load', initMap);
      return () => script?.removeEventListener('load', initMap);
    }
  }, [redrawOverlays]); // stable dep

  // ── Redraw overlays whenever stops change ──
  useEffect(() => {
    // Always keep pendingStopsRef up to date
    pendingStopsRef.current = stops;

    // If map isn't ready yet, initMap will pick up pendingStopsRef when it fires
    if (!mapReadyRef.current || !mapInstanceRef.current) return;

    redrawOverlays(stops, mapInstanceRef.current);
  }, [stops, redrawOverlays]);

  const activeLyr = LAYER_OPTIONS.find(l => l.id === activeLayer)!;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Layer picker — top center */}
      <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => setShowLayerMenu(v => !v)}
          style={{
            background: BG, boxShadow: neuExSm, border: 'none', cursor: 'pointer',
            borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600,
            color: TEXT_DARK, display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {activeLyr.icon} {activeLyr.label}
        </motion.button>

        <AnimatePresence>
          {showLayerMenu && (
            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: -6 }}
                transition={{ type: 'spring', damping: 22, stiffness: 320 }}
                style={{
                  background: BG, boxShadow: neuEx, borderRadius: 16, padding: 6,
                  display: 'flex', flexDirection: 'column', gap: 3, minWidth: 130,
                }}
              >
                {LAYER_OPTIONS.map(layer => (
                  <button
                    key={layer.id}
                    onClick={() => switchLayer(layer.id)}
                    style={{
                      background: activeLayer === layer.id ? BLUE + '18' : 'transparent',
                      border: `1.5px solid ${activeLayer === layer.id ? BLUE + '55' : 'transparent'}`,
                      borderRadius: 10, padding: '7px 12px', cursor: 'pointer',
                      fontSize: 12, fontWeight: 600,
                      color: activeLayer === layer.id ? BLUE : TEXT_DARK,
                      display: 'flex', alignItems: 'center', gap: 8,
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    <span>{layer.icon}</span><span>{layer.label}</span>
                  </button>
                ))}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Default chat seed messages
// ─────────────────────────────────────────────
const AI_MESSAGES: ChatMessage[] = [
  { role: 'ai', text: "✨ I've crafted a 4-day Northern Thailand route for you! Starting in Bangkok, heading up to Ayutthaya's ancient temples, then Chiang Mai and Chiang Rai. Want me to adjust anything?" },
  { role: 'user', text: "Can you add more food stops in Chiang Mai?" },
  { role: 'ai', text: "🍜 Done! I've added Khao Soi Khun Yai for iconic Northern khao soi, Talad Warorot Night Bazaar for street food, and a Thai cooking class at Baan Thai. Day 3 is now a food lover's dream!" },
];

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─────────────────────────────────────────────
// PlannerPage
// ─────────────────────────────────────────────
export default function PlannerPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(AI_MESSAGES);
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  const [pdfTexts, setPdfTexts] = useState<{ name: string; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const DEFAULT_STOPS: TripStop[] = [
    { city: 'Bangkok',    day: 1, lat: 13.7563, lon: 100.5018, color: COLORS[0] },
    { city: 'Ayutthaya',  day: 2, lat: 14.3532, lon: 100.5659, color: COLORS[1] },
    { city: 'Chiang Mai', day: 3, lat: 18.7883, lon: 98.9853,  color: COLORS[2] },
    { city: 'Chiang Rai', day: 4, lat: 19.9105, lon: 99.8406,  color: COLORS[3] },
  ];
  const [tripStops, setTripStops] = useState<TripStop[]>(DEFAULT_STOPS);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSheetRef = useRef<HTMLDivElement>(null);
  const [chatHeightPct, setChatHeightPct] = useState(55);
  const resizeDrag = useRef<{ startY: number; startH: number } | null>(null);

  const onResizeDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    resizeDrag.current = { startY: e.clientY, startH: chatSheetRef.current?.offsetHeight ?? 0 };
  };
  const onResizeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizeDrag.current || !chatSheetRef.current) return;
    const dy = resizeDrag.current.startY - e.clientY;
    const parentH = chatSheetRef.current.parentElement?.offsetHeight ?? 844;
    const newPct = Math.max(30, Math.min(90, Math.round(((resizeDrag.current.startH + dy) / parentH) * 100)));
    setChatHeightPct(newPct);
  };
  const onResizeUp = () => { resizeDrag.current = null; };

  // Auto scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Horizontal drag scroll for filter bar
  useEffect(() => {
    const el = filterBarRef.current;
    if (!el) return;
    let isDown = false, startX = 0, scrollLeft = 0;
    const onMouseDown = (e: MouseEvent) => { isDown = true; startX = e.clientX; scrollLeft = el.scrollLeft; };
    const onMouseMove = (e: MouseEvent) => { if (!isDown) return; el.scrollLeft = scrollLeft - (e.clientX - startX); };
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

  // Read PDF immediately on attach
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAttachedFile({ name: f.name, size: formatSize(f.size) });
    if (f.type === 'application/pdf') {
      try {
        const text = await extractTextFromPDF(f);
        setPdfTexts(prev => [...prev, { name: f.name, text: text.slice(0, 3000) }]);
      } catch (err) {
        console.error('PDF read error:', err);
      }
    }
    e.target.value = '';
  };

  const sendMessage = async () => {
    if (!input.trim() && !attachedFile) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      ...(attachedFile ? { file: attachedFile } : {}),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedFile(null);
    setIsLoading(true);

    const combinedContext = pdfTexts
      .map(p => `=== ${p.name} ===\n${p.text}`)
      .join('\n\n')
      .slice(0, 6000);

    const systemPrompt = `You are a Thailand travel assistant.
${pdfTexts.length > 0 ? `The user has shared PDF documents:\n${combinedContext}\n\n` : ''}
Whenever you recommend ANY places, restaurants, attractions, or locations — ALWAYS respond in this EXACT format:

TRIP_JSON:{"stops":[{"city":"Place Name","day":1,"lat":13.7563,"lon":100.5018,"note":"Short description"}]}
SUMMARY:Your friendly summary text here.

Rules:
- ALWAYS include TRIP_JSON whenever you mention specific places, even for lunch spots or restaurants.
- Use accurate real GPS coordinates for every place.
- For multiple places recommended together, increment day numbers starting from 1 (e.g. day:1, day:2, day:3).
- If places are in the same visit (e.g. 3 lunch options), use the same day number for all.
- Always respond in the same language the user uses.`;

    const apiHistory: ChatMessage[] = [
      ...messages,
      { role: 'user', text: input },
    ];

    try {
      const aiResponseText = await callOpenRouter(apiHistory, systemPrompt);

      // Parse TRIP_JSON if present — greedy match to handle nested JSON
      const jsonMatch = aiResponseText.match(/TRIP_JSON:(\{[\s\S]*\})\s*\nSUMMARY:/);
      const summaryMatch = aiResponseText.match(/SUMMARY:([\s\S]*)/);

      if (jsonMatch && summaryMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          const newStops: TripStop[] = parsed.stops.map((s: any, i: number) => ({
            ...s,
            color: COLORS[i % COLORS.length],
          }));
          setTripStops(newStops);
          setMessages(prev => [...prev, {
            role: 'ai',
            text: '🗺️ ' + summaryMatch[1].trim(),
          }]);
        } catch {
          // JSON parse failed — show raw response
          setMessages(prev => [...prev, { role: 'ai', text: aiResponseText }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: aiResponseText }]);
      }

    } catch (error: any) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `🚨 ล้มเหลว: ${error.message || "ไม่ทราบสาเหตุ"}`,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden" style={{ background: BG, fontFamily: 'Poppins, sans-serif' }}>

      {/* Filter pills */}
      <div className="flex-shrink-0 pt-10 px-4 pb-3" style={{ zIndex: 10 }}>
        <div
          ref={filterBarRef}
          className="flex gap-2 overflow-x-auto rounded-3xl px-3 py-2.5"
          style={{ scrollbarWidth: 'none', boxShadow: neuIn, cursor: 'grab' }}
        >
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
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif',
                }}
              >
                <Icon size={12} />{f.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative mx-4 rounded-3xl overflow-hidden" style={{ boxShadow: neuIn, minHeight: 0 }}>
        <TripMap stops={tripStops} />
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
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate('/itinerary')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full"
          style={{ background: BG, boxShadow: neuExSm, color: TEXT_MID, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}
        >
          <List size={15} />Itinerary
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.92 }}
          animate={{ boxShadow: showAI ? neuIn : neuBlueGlow }}
          onClick={() => setShowAI(!showAI)}
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: showAI ? BG : BLUE, boxShadow: showAI ? neuIn : neuBlueGlow, border: 'none', cursor: 'pointer' }}
        >
          <Bot size={26} color={showAI ? BLUE : '#fff'} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate('/live')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full"
          style={{ background: BG, boxShadow: neuExSm, color: TEXT_MID, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}
        >
          <Mic size={15} />Go Live
        </motion.button>
      </div>

      {/* AI Bottom Sheet */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            ref={chatSheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute inset-x-0 bottom-0 rounded-t-3xl flex flex-col"
            style={{
              background: BG,
              boxShadow: `0 -8px 32px rgba(0,0,0,0.12), ${neuEx}`,
              height: `${chatHeightPct}%`,
              zIndex: 20,
            }}
          >
            {/* Drag handle — resize sheet */}
            <div
              className="flex justify-center pt-3 pb-2"
              style={{ cursor: 'ns-resize', touchAction: 'none', userSelect: 'none' }}
              onPointerDown={onResizeDown}
              onPointerMove={onResizeMove}
              onPointerUp={onResizeUp}
            >
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

            {/* PDF indicator */}
            {pdfTexts.length > 0 && (
              <div
                className="mx-4 mb-2 flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background: BLUE + '12', border: `1px solid ${BLUE}33` }}
              >
                <FileText size={12} color={BLUE} />
                <span style={{ fontSize: 11, color: BLUE, flex: 1 }}>
                  {pdfTexts.length} PDF{pdfTexts.length > 1 ? 's' : ''} loaded: {pdfTexts.map(p => p.name).join(', ')}
                </span>
                <button onClick={() => setPdfTexts([])} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  <X size={11} color={TEXT_MID} />
                </button>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2" style={{ scrollbarWidth: 'none' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[82%] px-4 py-3 rounded-2xl"
                    style={{
                      background: msg.role === 'ai' ? BG : BLUE,
                      boxShadow: msg.role === 'ai' ? neuExSm : 'none',
                      color: msg.role === 'ai' ? TEXT_DARK : '#fff',
                      fontSize: 13, lineHeight: 1.5,
                      borderBottomLeftRadius: msg.role === 'ai' ? 4 : 16,
                      borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                    }}
                  >
                    {msg.file && (
                      <div
                        className="flex items-center gap-2 mb-2 px-2 py-1.5 rounded-xl"
                        style={{
                          background: msg.role === 'user' ? 'rgba(255,255,255,0.15)' : BG,
                          boxShadow: msg.role === 'ai' ? neuExSm : 'none',
                        }}
                      >
                        <FileText size={14} color={msg.role === 'user' ? '#fff' : BLUE} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: msg.role === 'user' ? '#fff' : TEXT_DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.file.name}</div>
                          <div style={{ fontSize: 10, color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : TEXT_LIGHT }}>{msg.file.size}</div>
                        </div>
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Loading dots */}
              {isLoading && (
                <div className="flex mb-3 justify-start">
                  <div className="px-4 py-3 rounded-2xl" style={{ background: BG, boxShadow: neuExSm, borderBottomLeftRadius: 4 }}>
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: BLUE }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 pb-6 pt-2 flex flex-col gap-2">
              <AnimatePresence>
                {attachedFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
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
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={onFileChange} />
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl" style={{ background: BG, boxShadow: neuIn }}>
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
                    onKeyDown={e => e.key === 'Enter' && !isLoading && sendMessage()}
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: isLoading ? BLUE + '88' : BLUE, boxShadow: neuExSm, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer' }}
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
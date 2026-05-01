export type TripActivityType = 'sight' | 'food' | 'transport' | 'hotel';

export type TripStop = {
  name: string;
  day: number;
  time: string;
  lat: number;
  lon: number;
  color: string;
  note?: string;
};

export type TripActivity = {
  time: string;
  name: string;
  type: TripActivityType;
  cost: number;
  lat?: number;
  lon?: number;
  note?: string;
};

export type TripDay = {
  day: number;
  title: string;
  city: string;
  color: string;
  activities: TripActivity[];
};

export type GeneratedTrip = {
  version: 1;
  title: string;
  createdAt: string;
  summary: string;
  stops: TripStop[];
  days: TripDay[];
};

export const GENERATED_TRIP_STORAGE_KEY = 'tourThai.generatedTrip.v1';

export const TRIP_COLORS = ['#1B73C6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#F97316'];

export const defaultGeneratedTrip: GeneratedTrip = {
  version: 1,
  title: 'Northern Thailand Route',
  createdAt: new Date().toISOString(),
  summary: `ตารางรายวัน
วันที่ 1: กรุงเทพฯ
09:00 Grand Palace & Wat Phra Kaew
12:30 Khao Tom at Or Tor Kor Market
14:00 Wat Pho (Reclining Buddha)
16:00 Tuk-tuk to Chao Phraya Pier
19:00 Asiatique Night Market
22:00 Check-in: Bangkok Marriott

วันที่ 2: อยุธยา
08:00 Drive to Ayutthaya
10:00 Wat Mahathat
12:00 Wat Chai Watthanaram
13:30 Lunch: Riverside Restaurants
15:00 Elephant Sanctuary Visit
19:00 Return to Bangkok / Night Train North

วันที่ 3: เชียงใหม่
07:00 Arrive Chiang Mai
09:00 Khao Soi at Khun Yai
11:00 Doi Suthep Temple
14:00 Thai Cooking Class
17:30 Nimman Road Cafes
20:00 Sunday Night Walking Street
23:00 Check-in: Riverside Boutique

วันที่ 4: เชียงราย
08:00 Drive to Chiang Rai
11:30 White Temple (Wat Rong Khun)
13:30 Blue Temple (Wat Rong Suea Ten)
14:30 Lunch at local market
16:00 Golden Triangle Viewpoint
19:00 Return flight to Bangkok`,
  stops: [
    { name: 'Bangkok', day: 1, time: '09:00', lat: 13.7563, lon: 100.5018, color: TRIP_COLORS[0] },
    { name: 'Ayutthaya', day: 2, time: '08:00', lat: 14.3532, lon: 100.5659, color: TRIP_COLORS[1] },
    { name: 'Chiang Mai', day: 3, time: '07:00', lat: 18.7883, lon: 98.9853, color: TRIP_COLORS[2] },
    { name: 'Chiang Rai', day: 4, time: '08:00', lat: 19.9105, lon: 99.8406, color: TRIP_COLORS[3] },
  ],
  days: [
    {
      day: 1,
      title: 'Bangkok',
      city: 'Bangkok',
      color: TRIP_COLORS[0],
      activities: [
        { name: 'Grand Palace & Wat Phra Kaew', time: '09:00', cost: 500, type: 'sight', note: 'Dress modestly, no shorts' },
        { name: 'Khao Tom at Or Tor Kor Market', time: '12:30', cost: 120, type: 'food' },
        { name: 'Wat Pho (Reclining Buddha)', time: '14:00', cost: 200, type: 'sight' },
        { name: 'Tuk-tuk to Chao Phraya Pier', time: '16:00', cost: 80, type: 'transport' },
        { name: 'Asiatique Night Market', time: '19:00', cost: 300, type: 'food' },
        { name: 'Check-in: Bangkok Marriott', time: '22:00', cost: 2800, type: 'hotel' },
      ],
    },
    {
      day: 2,
      title: 'Ayutthaya',
      city: 'Ayutthaya',
      color: TRIP_COLORS[1],
      activities: [
        { name: 'Drive to Ayutthaya (1.5h)', time: '08:00', cost: 350, type: 'transport' },
        { name: 'Wat Mahathat', time: '10:00', cost: 50, type: 'sight', note: 'See the Buddha head in tree roots' },
        { name: 'Wat Chai Watthanaram', time: '12:00', cost: 50, type: 'sight' },
        { name: 'Lunch: Riverside Restaurants', time: '13:30', cost: 200, type: 'food' },
        { name: 'Elephant Sanctuary Visit', time: '15:00', cost: 800, type: 'sight', note: 'Ethical sanctuary, no riding' },
        { name: 'Return to Bangkok / Night Train North', time: '19:00', cost: 650, type: 'transport' },
      ],
    },
    {
      day: 3,
      title: 'Chiang Mai',
      city: 'Chiang Mai',
      color: TRIP_COLORS[2],
      activities: [
        { name: 'Arrive Chiang Mai', time: '07:00', cost: 0, type: 'transport' },
        { name: 'Khao Soi at Khun Yai', time: '09:00', cost: 80, type: 'food', note: 'Best khao soi in Chiang Mai' },
        { name: 'Doi Suthep Temple', time: '11:00', cost: 30, type: 'sight' },
        { name: 'Thai Cooking Class', time: '14:00', cost: 950, type: 'food' },
        { name: 'Nimman Road Cafes', time: '17:30', cost: 200, type: 'food' },
        { name: 'Sunday Night Walking Street', time: '20:00', cost: 400, type: 'food' },
        { name: 'Check-in: Riverside Boutique', time: '23:00', cost: 1800, type: 'hotel' },
      ],
    },
    {
      day: 4,
      title: 'Chiang Rai',
      city: 'Chiang Rai',
      color: TRIP_COLORS[3],
      activities: [
        { name: 'Drive to Chiang Rai (3h)', time: '08:00', cost: 500, type: 'transport' },
        { name: 'White Temple (Wat Rong Khun)', time: '11:30', cost: 100, type: 'sight', note: 'No black clothing inside' },
        { name: 'Blue Temple (Wat Rong Suea Ten)', time: '13:30', cost: 0, type: 'sight' },
        { name: 'Lunch at local market', time: '14:30', cost: 150, type: 'food' },
        { name: 'Golden Triangle Viewpoint', time: '16:00', cost: 0, type: 'sight' },
        { name: 'Return flight to Bangkok', time: '19:00', cost: 1200, type: 'transport' },
      ],
    },
  ],
};

const validType = (type: unknown): TripActivityType => {
  if (type === 'food' || type === 'transport' || type === 'hotel' || type === 'sight') return type;
  return 'sight';
};

const asNumber = (value: unknown, fallback = 0) => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asString = (value: unknown, fallback = '') => {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
};

const byDayTime = <T extends { day: number; time?: string }>(a: T, b: T) => {
  const dayDiff = a.day - b.day;
  if (dayDiff !== 0) return dayDiff;
  return (a.time || '99:99').localeCompare(b.time || '99:99');
};

const buildDaysFromStops = (stops: TripStop[]): TripDay[] => {
  const grouped = new Map<number, TripStop[]>();
  for (const stop of stops) {
    const list = grouped.get(stop.day) ?? [];
    list.push(stop);
    grouped.set(stop.day, list);
  }

  return [...grouped.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([dayNumber, dayStops]) => {
      const color = TRIP_COLORS[(dayNumber - 1) % TRIP_COLORS.length];
      const sortedStops = dayStops.sort(byDayTime);
      const firstStop = sortedStops[0];
      return {
        day: dayNumber,
        title: firstStop?.name || `Day ${dayNumber}`,
        city: firstStop?.name || `Day ${dayNumber}`,
        color,
        activities: sortedStops.map(stop => ({
          time: stop.time,
          name: stop.name,
          type: 'sight' as const,
          cost: 0,
          lat: stop.lat,
          lon: stop.lon,
          note: stop.note,
        })),
      };
    });
};

export function normalizeGeneratedTrip(raw: any, summary = ''): GeneratedTrip {
  const rawStops = Array.isArray(raw?.stops) ? raw.stops : [];
  const rawDays = Array.isArray(raw?.days) ? raw.days : [];

  const days: TripDay[] = rawDays.map((day: any, dayIndex: number) => {
    const dayNumber = Math.max(1, Math.round(asNumber(day?.day, dayIndex + 1)));
    const color = TRIP_COLORS[(dayNumber - 1) % TRIP_COLORS.length];
    const activities: TripActivity[] = (Array.isArray(day?.activities) ? day.activities : []).map((activity: any) => ({
      time: asString(activity?.time, '09:00'),
      name: asString(activity?.name, 'Untitled stop'),
      type: validType(activity?.type),
      cost: Math.max(0, Math.round(asNumber(activity?.cost, 0))),
      lat: activity?.lat === undefined ? undefined : asNumber(activity.lat),
      lon: activity?.lon === undefined ? undefined : asNumber(activity.lon),
      note: asString(activity?.note),
    }));

    return {
      day: dayNumber,
      title: asString(day?.title, asString(day?.city, `Day ${dayNumber}`)),
      city: asString(day?.city, asString(day?.title, `Day ${dayNumber}`)),
      color,
      activities: activities.sort((a, b) => a.time.localeCompare(b.time)),
    };
  }).sort((a, b) => a.day - b.day);

  const rawNormalizedStops: TripStop[] = rawStops.map((stop: any, index: number) => {
    const day = Math.max(1, Math.round(asNumber(stop?.day, 1)));
    return {
      name: asString(stop?.name, asString(stop?.city, `Stop ${index + 1}`)),
      day,
      time: asString(stop?.time, '09:00'),
      lat: asNumber(stop?.lat),
      lon: asNumber(stop?.lon),
      note: asString(stop?.note),
      color: TRIP_COLORS[(day - 1) % TRIP_COLORS.length],
    };
  }).filter(stop => stop.lat !== 0 || stop.lon !== 0).sort(byDayTime);

  const dayDerivedStops = days
    .map(day => {
      const firstActivity = day.activities[0];
      const firstActivityWithCoords = day.activities.find(
        activity => typeof activity.lat === 'number' && typeof activity.lon === 'number'
      );

      return {
        name: day.city || day.title || `Day ${day.day}`,
        day: day.day,
        time: firstActivity?.time || '09:00',
        lat: firstActivityWithCoords?.lat ?? 0,
        lon: firstActivityWithCoords?.lon ?? 0,
        note: day.title || firstActivity?.note,
        color: day.color,
      };
    })
    .filter(s => s.lat !== 0 || s.lon !== 0)
    .sort(byDayTime);

  // ใช้ rawNormalizedStops ก่อน (มี coords จาก AI), ถ้าไม่มีค่อยใช้ dayDerivedStops
  const stops = rawNormalizedStops.length > 0 ? rawNormalizedStops : dayDerivedStops;
  const canonicalDays = days.length > 0 ? days : (stops.length > 0 ? buildDaysFromStops(stops) : defaultGeneratedTrip.days);

  return {
    version: 1,
    title: asString(raw?.title, canonicalDays[0]?.title ? `${canonicalDays[0].title} Trip Plan` : 'AI Trip Plan'),
    createdAt: new Date().toISOString(),
    summary: asString(summary, asString(raw?.summary, '')),
    stops: stops.length > 0 ? stops : defaultGeneratedTrip.stops,
    days: canonicalDays,
  };
}

export function saveGeneratedTrip(trip: GeneratedTrip) {
  localStorage.setItem(GENERATED_TRIP_STORAGE_KEY, JSON.stringify(trip));
}

export function loadGeneratedTrip(): GeneratedTrip | null {
  try {
    const raw = localStorage.getItem(GENERATED_TRIP_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return normalizeGeneratedTrip(parsed, parsed.summary);
  } catch {
    return null;
  }
}

const escapeHtml = (value: string | number | undefined) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export function exportTripToPdf(trip: GeneratedTrip) {
  const printWindow = window.open('', '_blank', 'width=900,height=1100');
  if (!printWindow) {
    window.alert('Please allow popups to export the trip PDF.');
    return;
  }

  const sortedStops = [...trip.stops].sort(byDayTime);
  const exportedAt = new Date().toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' });

  const stopsHtml = sortedStops.map((stop, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>วันที่ ${escapeHtml(stop.day)}</td>
      <td>${escapeHtml(stop.time)}</td>
      <td><strong>${escapeHtml(stop.name)}</strong><br><span>${escapeHtml(stop.note)}</span></td>
      <td>${escapeHtml(stop.lat.toFixed(5))}, ${escapeHtml(stop.lon.toFixed(5))}</td>
    </tr>
  `).join('');

  const daysHtml = trip.days.map(day => `
    <section class="day">
      <h2>วันที่ ${escapeHtml(day.day)}: ${escapeHtml(day.title || day.city)}</h2>
      <table>
        <tbody>
          ${day.activities.map(activity => `
            <tr>
              <td class="time">${escapeHtml(activity.time)}</td>
              <td>
                <strong>${escapeHtml(activity.name)}</strong>
                ${activity.note ? `<br><span>${escapeHtml(activity.note)}</span>` : ''}
              </td>
              <td class="cost">${activity.cost > 0 ? `฿${escapeHtml(activity.cost.toLocaleString())}` : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
  `).join('');

  printWindow.document.write(`<!doctype html>
<html lang="th">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(trip.title)}</title>
    <style>
      @page { size: A4; margin: 16mm; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #1f2937; font-family: Arial, "Noto Sans Thai", sans-serif; line-height: 1.45; }
      header { border-bottom: 3px solid #1B73C6; margin-bottom: 20px; padding-bottom: 12px; }
      h1 { margin: 0; color: #1B73C6; font-size: 28px; }
      h2 { color: #1B73C6; font-size: 18px; margin: 0 0 10px; }
      h3 { color: #111827; margin: 22px 0 10px; }
      .meta { color: #6b7280; font-size: 12px; margin-top: 4px; }
      .summary { white-space: pre-wrap; background: #f3f8ff; border-left: 4px solid #1B73C6; padding: 12px; margin: 14px 0 20px; }
      table { border-collapse: collapse; width: 100%; font-size: 12px; }
      th, td { border: 1px solid #d7dee8; padding: 8px; text-align: left; vertical-align: top; }
      th { background: #eef5ff; color: #1B73C6; }
      span { color: #6b7280; }
      .day { break-inside: avoid; page-break-inside: avoid; margin-top: 20px; }
      .day + .day { border-top: 1px solid #e5e7eb; padding-top: 16px; }
      .time { width: 72px; color: #1B73C6; font-weight: 700; }
      .cost { width: 80px; text-align: right; color: #047857; font-weight: 700; }
      @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
    </style>
  </head>
  <body>
    <header>
      <h1>${escapeHtml(trip.title || 'Trip Plan')}</h1>
      <div class="meta">Exported ${escapeHtml(exportedAt)} · ${trip.days.length} days · ${sortedStops.length} route stops</div>
    </header>

    ${trip.summary ? `<section><h3>AI Summary</h3><div class="summary">${escapeHtml(trip.summary)}</div></section>` : ''}

    <section>
      <h3>Map Route</h3>
      <table>
        <thead><tr><th>#</th><th>Day</th><th>Time</th><th>Stop</th><th>GPS</th></tr></thead>
        <tbody>${stopsHtml || '<tr><td colspan="5">No route stops available.</td></tr>'}</tbody>
      </table>
    </section>

    <section>
      <h3>Timeline</h3>
      ${daysHtml}
    </section>
    <script>
      window.onload = () => {
        window.focus();
        setTimeout(() => window.print(), 250);
      };
    </script>
  </body>
</html>`);
  printWindow.document.close();
}

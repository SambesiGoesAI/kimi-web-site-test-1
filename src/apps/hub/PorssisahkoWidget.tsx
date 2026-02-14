import { useState, useEffect, useCallback, useMemo } from 'react';

interface SpotPrice {
  Rank: number;
  DateTime: string;
  PriceNoTax: number;
  PriceWithTax: number;
}

/** Convert EUR/kWh to cents/kWh */
function toCents(eur: number): number {
  return eur * 100;
}

function getCurrentPrice(prices: SpotPrice[]): SpotPrice | null {
  const now = new Date();
  // Prices are in 15-min intervals. Find the interval that contains "now".
  for (const p of prices) {
    const start = new Date(p.DateTime);
    const end = new Date(start.getTime() + 15 * 60 * 1000);
    if (now >= start && now < end) return p;
  }
  return null;
}

function getUpcomingPricesUntilMidnight(prices: SpotPrice[]): SpotPrice[] {
  const now = new Date();
  // Calculate next midnight (00:00)
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // Next midnight

  return prices
    .filter((p) => {
      const t = new Date(p.DateTime);
      return t >= now && t < midnight;
    })
    .sort((a, b) => new Date(a.DateTime).getTime() - new Date(b.DateTime).getTime());
}

interface CheapestSlot {
  startIndex: number;
  avgCents: number;
  startTime: string;
  endTime: string;
  slots: Array<{ time: string; cents: number }>;
}

function findCheapestHourSlot(upcoming: SpotPrice[]): CheapestSlot | null {
  if (upcoming.length < 4) return null;
  let bestAvg = Infinity;
  let bestIdx = 0;
  for (let i = 0; i <= upcoming.length - 4; i++) {
    const avg =
      (upcoming[i].PriceWithTax +
        upcoming[i + 1].PriceWithTax +
        upcoming[i + 2].PriceWithTax +
        upcoming[i + 3].PriceWithTax) /
      4;
    if (avg < bestAvg) {
      bestAvg = avg;
      bestIdx = i;
    }
  }
  const start = upcoming[bestIdx].DateTime;
  const end = new Date(
    new Date(upcoming[bestIdx + 3].DateTime).getTime() + 15 * 60 * 1000
  ).toISOString();
  const slots = [0, 1, 2, 3].map((offset) => ({
    time: formatHour(upcoming[bestIdx + offset].DateTime),
    cents: toCents(upcoming[bestIdx + offset].PriceWithTax),
  }));
  return { startIndex: bestIdx, avgCents: toCents(bestAvg), startTime: start, endTime: end, slots };
}

function formatHour(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('fi-FI', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function priceColor(cents: number): string {
  if (cents <= 0) return 'text-green-400';
  if (cents < 5) return 'text-green-300';
  if (cents < 10) return 'text-yellow-300';
  if (cents < 15) return 'text-orange-400';
  return 'text-red-400';
}

function useCountdown(targetTime: string | null): { label: string; isActive: boolean } {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    if (!targetTime) return { label: '', isActive: false };
    const start = new Date(targetTime).getTime();
    const diff = start - now.getTime();
    if (diff <= 0) return { label: 'NYT!', isActive: true };
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const parts: string[] = [];
    if (h > 0) parts.push(`${h}h`);
    parts.push(`${m}min`);
    return { label: `alkaa ${parts.join(' ')} kuluttua`, isActive: false };
  }, [targetTime, now]);
}

function priceBarColor(cents: number): string {
  if (cents <= 0) return 'bg-green-400';
  if (cents < 5) return 'bg-green-300';
  if (cents < 10) return 'bg-yellow-300';
  if (cents < 15) return 'bg-orange-400';
  return 'bg-red-400';
}

export default function PorssisahkoWidget() {
  const [prices, setPrices] = useState<SpotPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://api.spot-hinta.fi/TodayAndDayForward');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: SpotPrice[] = await res.json();
      setPrices(json);
      setLastFetched(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const current = prices.length > 0 ? getCurrentPrice(prices) : null;
  const upcoming = prices.length > 0 ? getUpcomingPricesUntilMidnight(prices) : [];

  // Calculate min and max for relative scaling
  const allCents = upcoming.map((p) => toCents(p.PriceWithTax));
  const minCents = upcoming.length > 0 ? Math.min(...allCents) : 0;
  const maxCents = upcoming.length > 0 ? Math.max(...allCents) : 1;
  const centRange = maxCents - minCents;

  const currentCents = current ? toCents(current.PriceWithTax) : 0;
  const cheapest = upcoming.length >= 4 ? findCheapestHourSlot(upcoming) : null;
  const countdown = useCountdown(cheapest?.startTime ?? null);

  // Mini timeline: position of cheapest hour within the upcoming range (now → midnight)
  const timeline = useMemo(() => {
    if (!cheapest || upcoming.length === 0) return null;
    const rangeStart = new Date(upcoming[0].DateTime).getTime();
    // End is midnight
    const midnight = new Date(rangeStart);
    midnight.setHours(24, 0, 0, 0);
    const rangeEnd = midnight.getTime();
    const totalSpan = rangeEnd - rangeStart;
    if (totalSpan <= 0) return null;
    const slotStart = new Date(cheapest.startTime).getTime();
    const slotEnd = new Date(cheapest.endTime).getTime();
    return {
      leftPct: ((slotStart - rangeStart) / totalSpan) * 100,
      widthPct: ((slotEnd - slotStart) / totalSpan) * 100,
      rangeStartLabel: formatHour(upcoming[0].DateTime),
      rangeEndLabel: '00:00',
    };
  }, [cheapest, upcoming]);

  return (
    <div className="hub-widget animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">&#9889;</span>
          <h2 className="text-lg font-semibold text-white">Pörssisähkö</h2>
        </div>
        <div className="flex items-center gap-3">
          {lastFetched && (
            <span className="text-xs text-zinc-500">
              {lastFetched.toLocaleTimeString('fi-FI')}
            </span>
          )}
          <button
            onClick={fetchPrices}
            disabled={loading}
            className="text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded border border-zinc-700 hover:border-zinc-500 disabled:opacity-50"
          >
            {loading ? '...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm mb-4 p-3 rounded-lg bg-red-950/30 border border-red-900/50">
          {error}
        </div>
      )}

      {current && (
        <div className="text-center mb-8">
          <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
            Hinta nyt
          </div>
          <div className={`text-6xl font-bold tracking-tight ${priceColor(currentCents)}`}>
            {currentCents.toFixed(2)}
          </div>
          <div className="text-sm text-zinc-500 mt-1">snt/kWh (sis. ALV)</div>
          <div className="text-xs text-zinc-600 mt-2">
            {formatHour(current.DateTime)} – {formatHour(new Date(new Date(current.DateTime).getTime() + 15 * 60 * 1000).toISOString())}
          </div>
        </div>
      )}

      {cheapest && (
        <div className="mb-6 p-4 rounded-xl bg-green-950/30 border border-green-900/40">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-sm">&#9660;</span>
              <span className="text-xs uppercase tracking-widest text-green-400/70">
                Halvin tunti
              </span>
            </div>
            {countdown.isActive ? (
              <span className="text-xs font-bold text-green-300 bg-green-400/20 px-2 py-0.5 rounded-full animate-pulse">
                NYT!
              </span>
            ) : countdown.label ? (
              <span className="text-xs text-zinc-400">
                {countdown.label}
              </span>
            ) : null}
          </div>
          <div className="flex items-baseline gap-3">
            <span className={`text-2xl font-bold ${priceColor(cheapest.avgCents)}`}>
              {cheapest.avgCents.toFixed(2)}
            </span>
            <span className="text-xs text-zinc-500">snt/kWh (ka.)</span>
          </div>
          <div className="text-sm text-zinc-400 mt-1">
            {formatHour(cheapest.startTime)} – {formatHour(cheapest.endTime)}
          </div>

          {/* 15-minute breakdown */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {cheapest.slots.map((slot, i) => (
              <div key={i} className="text-center">
                <div className="text-[10px] text-zinc-500">{slot.time}</div>
                <div className={`text-sm font-semibold ${priceColor(slot.cents)}`}>
                  {slot.cents.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Mini timeline bar */}
          {timeline && (
            <div className="mt-3">
              <div className="relative h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="absolute top-0 h-full rounded-full bg-green-400/60"
                  style={{ left: `${timeline.leftPct}%`, width: `${Math.max(timeline.widthPct, 2)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-zinc-600">{timeline.rangeStartLabel}</span>
                <span className="text-[10px] text-zinc-600">{timeline.rangeEndLabel}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {!current && !loading && !error && (
        <div className="text-center mb-8 text-zinc-500">
          No current price available
        </div>
      )}

      {loading && prices.length === 0 && (
        <div className="text-center mb-8">
          <div className="text-zinc-500 animate-pulse">Loading prices...</div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
            Hinnat keskiyöhön
          </div>
          <div className="overflow-x-auto">
            <div className="relative inline-flex gap-[2px] pb-6">
              {upcoming.map((p, i) => {
                const cents = toCents(p.PriceWithTax);
                const height = centRange > 0
                  ? Math.max(((cents - minCents) / centRange) * 100, 4)
                  : 50;
                const isCheapest =
                  cheapest != null &&
                  i >= cheapest.startIndex &&
                  i < cheapest.startIndex + 4;
                const isLast = i === upcoming.length - 1;
                return (
                  <div key={i} className="w-2 flex flex-col items-center group relative">
                    <span className="absolute -top-4 text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {cents.toFixed(2)}
                    </span>
                    <div className="h-28 w-full flex items-end">
                      <div
                        className={`w-full rounded-sm transition-all group-hover:opacity-80 ${
                          isCheapest
                            ? 'bg-green-400 ring-1 ring-green-400/50'
                            : priceBarColor(cents)
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <div className="h-4 flex items-center">
                      <span className="text-[10px] text-zinc-600 whitespace-nowrap">
                        {i % 4 === 0 ? formatHour(p.DateTime) : isLast ? '00:00' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Chart connector bracket under cheapest bars */}
              {cheapest && upcoming.length > 0 && (() => {
                const barW = 8; // w-2 = 8px
                const gap = 2;  // gap-[2px]
                const step = barW + gap;
                const left = cheapest.startIndex * step;
                const width = 4 * barW + 3 * gap;
                return (
                  <div
                    className="absolute flex flex-col items-center"
                    style={{
                      left: `${left}px`,
                      width: `${width}px`,
                      bottom: 0,
                    }}
                  >
                    <div className="w-full flex items-center">
                      <div className="h-[6px] w-px bg-green-400/60" />
                      <div className="flex-1 border-b border-green-400/60" />
                      <div className="h-[6px] w-px bg-green-400/60" />
                    </div>
                    <span className="text-[9px] text-green-400/70 mt-0.5 whitespace-nowrap">
                      halvin
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
          <div className="text-right mt-2">
            <span className="text-[10px] text-zinc-600">spot-hinta.fi</span>
          </div>
        </div>
      )}
    </div>
  );
}

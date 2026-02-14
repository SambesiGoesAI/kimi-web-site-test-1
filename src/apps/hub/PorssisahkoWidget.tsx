import { useState, useEffect, useCallback } from 'react';

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

function getUpcomingPrices(prices: SpotPrice[], count: number): SpotPrice[] {
  const now = new Date();
  return prices
    .filter((p) => new Date(p.DateTime) >= now)
    .sort((a, b) => new Date(a.DateTime).getTime() - new Date(b.DateTime).getTime())
    .slice(0, count);
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
  const upcoming = prices.length > 0 ? getUpcomingPrices(prices, 24) : [];
  const maxCents = upcoming.length > 0
    ? Math.max(...upcoming.map((p) => Math.max(toCents(p.PriceWithTax), 1)))
    : 1;

  const currentCents = current ? toCents(current.PriceWithTax) : 0;

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
            Tulevat tunnit
          </div>
          <div className="flex items-end gap-[2px] h-32">
            {upcoming.map((p, i) => {
              const cents = toCents(p.PriceWithTax);
              const height = Math.max((cents / maxCents) * 100, 4);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {cents.toFixed(1)}
                  </span>
                  <div
                    className={`w-full rounded-sm ${priceBarColor(cents)} transition-all group-hover:opacity-80`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-zinc-600">
                    {i % 4 === 0 ? formatHour(p.DateTime) : ''}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="text-right mt-2">
            <span className="text-[10px] text-zinc-600">spot-hinta.fi</span>
          </div>
        </div>
      )}
    </div>
  );
}

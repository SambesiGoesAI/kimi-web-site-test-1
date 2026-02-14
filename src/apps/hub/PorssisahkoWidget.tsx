import { useState, useEffect, useCallback } from 'react';

interface PriceEntry {
  price: number;
  startDate: string;
  endDate: string;
}

interface PriceData {
  prices: PriceEntry[];
}

function getCurrentPrice(prices: PriceEntry[]): PriceEntry | null {
  const now = new Date();
  return prices.find((p) => {
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    return now >= start && now < end;
  }) ?? null;
}

function getUpcomingPrices(prices: PriceEntry[], count: number): PriceEntry[] {
  const now = new Date();
  return prices
    .filter((p) => new Date(p.startDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, count);
}

function formatHour(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('fi-FI', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function priceColor(price: number): string {
  if (price <= 0) return 'text-green-400';
  if (price < 5) return 'text-green-300';
  if (price < 10) return 'text-yellow-300';
  if (price < 15) return 'text-orange-400';
  return 'text-red-400';
}

function priceBarColor(price: number): string {
  if (price <= 0) return 'bg-green-400';
  if (price < 5) return 'bg-green-300';
  if (price < 10) return 'bg-yellow-300';
  if (price < 15) return 'bg-orange-400';
  return 'bg-red-400';
}

export default function PorssisahkoWidget() {
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://api.porssisahko.net/v1/latest-prices.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: PriceData = await res.json();
      setData(json);
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

  const current = data ? getCurrentPrice(data.prices) : null;
  const upcoming = data ? getUpcomingPrices(data.prices, 12) : [];
  const maxPrice = upcoming.length > 0 ? Math.max(...upcoming.map((p) => Math.max(p.price, 1))) : 1;

  return (
    <div className="hub-widget animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">&#9889;</span>
          <h2 className="text-lg font-semibold text-white">Porssisahko</h2>
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
            Current price
          </div>
          <div className={`text-6xl font-bold tracking-tight ${priceColor(current.price)}`}>
            {current.price.toFixed(2)}
          </div>
          <div className="text-sm text-zinc-500 mt-1">snt/kWh</div>
          <div className="text-xs text-zinc-600 mt-2">
            {formatHour(current.startDate)} – {formatHour(current.endDate)}
          </div>
        </div>
      )}

      {!current && !loading && !error && (
        <div className="text-center mb-8 text-zinc-500">
          No current price available
        </div>
      )}

      {loading && !data && (
        <div className="text-center mb-8">
          <div className="text-zinc-500 animate-pulse">Loading prices...</div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
            Upcoming hours
          </div>
          <div className="flex items-end gap-1 h-32">
            {upcoming.map((p, i) => {
              const height = Math.max((p.price / maxPrice) * 100, 4);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {p.price.toFixed(1)}
                  </span>
                  <div
                    className={`w-full rounded-sm ${priceBarColor(p.price)} transition-all group-hover:opacity-80`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-zinc-600">
                    {formatHour(p.startDate)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

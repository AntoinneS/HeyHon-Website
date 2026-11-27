import { useMemo, useState, type FormEvent } from 'react';
import { Building2, CheckCircle2, MessageCircle } from 'lucide-react';
import { BRAND, formatJmd } from '@/data/brand';

function sliderToQty(pos: number): number {
  const clamped = Math.max(0, Math.min(300, pos));
  if (clamped <= 100) return Math.round(10 + (clamped / 100) * 15);
  if (clamped <= 200) return Math.round(25 + ((clamped - 100) / 100) * 25);
  return Math.round(50 + ((clamped - 200) / 100) * 100);
}

function qtyToSlider(qty: number): number {
  const clamped = Math.max(10, Math.min(150, qty));
  if (clamped <= 25) return Math.round(((clamped - 10) / 15) * 100);
  if (clamped <= 50) return Math.round(100 + ((clamped - 25) / 25) * 100);
  return Math.round(200 + ((clamped - 50) / 100) * 100);
}

export default function WholesaleCalculator() {
  const [size, setSize] = useState<'266ml' | '500ml' | 'Mixed'>('266ml');
  const [sliderPos, setSliderPos] = useState<number>(() => qtyToSlider(20));
  const quantity = sliderToQty(sliderPos);
  const sliderPct = (sliderPos / 300) * 100;
  const [category, setCategory] = useState('Café / Restaurant / Hotel');
  const [customLabel, setCustomLabel] = useState('Standard Hey Hon Glass Label');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ leadId: string; volumeTier: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const estimate = useMemo(() => {
    const qty = Math.max(BRAND.wholesaleMoq, quantity);
    const tier =
      qty >= 50
        ? { name: 'Tier 3 · Signature Partner (50+ Jars)', discountHint: 'Our deepest bulk discount & priority harvest scheduling', pctLow: 0.22, pctHigh: 0.28 }
        : qty >= 25
          ? { name: 'Tier 2 · Events & Stockists (25 to 49 Jars)', discountHint: 'Great margin for stores, cafés & weddings', pctLow: 0.16, pctHigh: 0.22 }
          : { name: 'Tier 1 · Starter Bulk (10 to 24 Jars)', discountHint: 'Low 10-jar minimum to get started', pctLow: 0.1, pctHigh: 0.15 };

    const retailUnit = size === '500ml' ? 3200 : size === '266ml' ? 2200 : 2700;
    const retailTotal = retailUnit * qty;
    const estLow = Math.round((retailTotal * (1 - tier.pctHigh)) / 100) * 100;
    const estHigh = Math.round((retailTotal * (1 - tier.pctLow)) / 100) * 100;

    return { qty, tier, retailTotal, estLow, estHigh };
  }, [quantity, size]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!businessName.trim() || !email.trim()) {
      setError('Please enter your business/event name and email.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads/wholesale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessOrName: businessName,
          category,
          email,
          phone,
          preferredSize: size,
          estQuantity: estimate.qty,
          customLabeling: customLabel,
          targetDate,
          notes,
        }),
      });
      const data = (await res.json()) as { ok: boolean; leadId?: string; volumeTier?: string; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || 'Could not submit inquiry.');
      } else {
        setResult({ leadId: data.leadId || 'WS-NEW', volumeTier: data.volumeTier || estimate.tier.name });
      }
    } catch {
      setError('Connection hiccup. You can also tap WhatsApp below for an instant reply.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappDirectUrl = `https://wa.me/${BRAND.contact.whatsappDigits}?text=${encodeURIComponent(
    `Hi Hey Hon! Wholesale inquiry (${estimate.qty}x ${size} jars, ${estimate.tier.name}) for ${businessName || 'my business/event'} (${category}). Custom finish: ${customLabel}.`
  )}`;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left Interactive Tier Estimator (Obsidian Glass) */}
      <div className="lg:col-span-5 glass-dark rounded-3xl p-6 sm:p-8 text-ivory flex flex-col justify-between">
        <div>
          <span className="inline-block rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold text-gold-bright">
            Minimum 10 Jars · Bulk &amp; Event Pricing
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-ivory">Estimate Your Price</h2>
          <p className="mt-2 text-sm text-ivory/70">
            Slide to your jar count (starting at 10 jars) to preview your bulk discount tier.
          </p>

          <div className="mt-6">
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-ivory/60">
              Jar Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['266ml', '500ml', 'Mixed'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`rounded-xl py-2.5 text-xs font-semibold transition ${
                    size === s
                      ? 'bg-gold text-obsidian shadow'
                      : 'border border-white/15 bg-white/5 text-ivory/80 hover:border-gold/50'
                  }`}
                >
                  {s === 'Mixed' ? 'Mixed Sizes' : `${s} Glass`}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between">
              <label className="text-xs font-semibold uppercase tracking-wide text-ivory/70">
                Quantity (Minimum 10)
              </label>
              <span className="font-mono text-2xl font-bold text-gold-bright">{estimate.qty} jars</span>
            </div>
            <input
              type="range"
              min={0}
              max={300}
              step={1}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Wholesale jar quantity"
              aria-valuemin={10}
              aria-valuemax={150}
              aria-valuenow={estimate.qty}
              style={{
                background: `linear-gradient(to right, #d49b2a ${sliderPct}%, rgba(255, 255, 255, 0.15) ${sliderPct}%)`,
              }}
              className="mt-3 h-2 w-full appearance-none rounded-full accent-gold cursor-pointer [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-bright [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-gold-bright"
            />
            <div className="relative mt-2 h-4 font-mono text-[10px] text-ivory/50">
              <button
                type="button"
                onClick={() => setSliderPos(0)}
                className="absolute left-0 hover:text-gold-bright transition"
              >
                10 min
              </button>
              <button
                type="button"
                onClick={() => setSliderPos(100)}
                className={`absolute left-[33.333%] -translate-x-1/2 hover:text-gold-bright transition ${
                  estimate.qty >= 25 ? 'text-gold-bright/90' : ''
                }`}
              >
                25
              </button>
              <button
                type="button"
                onClick={() => setSliderPos(200)}
                className={`absolute left-[66.667%] -translate-x-1/2 hover:text-gold-bright transition ${
                  estimate.qty >= 50 ? 'text-gold-bright/90' : ''
                }`}
              >
                50+
              </button>
              <button
                type="button"
                onClick={() => setSliderPos(300)}
                className={`absolute right-0 hover:text-gold-bright transition ${
                  estimate.qty >= 150 ? 'text-gold-bright/90' : ''
                }`}
              >
                150
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gold/25 bg-obsidian/80 p-5 space-y-3">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-gold-bright">Unlocked Tier</span>
              <p className="font-serif text-xl font-bold text-ivory">{estimate.tier.name}</p>
              <p className="text-xs text-ivory/65">{estimate.tier.discountHint}</p>
            </div>
            <div className="border-t border-white/10 pt-3 flex items-baseline justify-between">
              <span className="text-xs text-ivory/65">Estimated Trade Range</span>
              <span className="font-mono text-base font-bold text-gold-bright">
                {formatJmd(estimate.estLow)} to {formatJmd(estimate.estHigh)}
              </span>
            </div>
            <p className="text-[11px] text-ivory/50">
              Exact per-jar trade sheet confirmed based on harvest availability &amp; custom ribbon or tag needs.
            </p>
          </div>
        </div>

        <a
          href={whatsappDirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-3 text-xs font-semibold text-gold-bright hover:bg-gold hover:text-obsidian transition"
        >
          <MessageCircle className="h-4 w-4" /> Fast-Track This Estimate on WhatsApp
        </a>
      </div>

      {/* Right Structured Request Form (Frosted Pearl Glass inside Light Studio) */}
      <div className="lg:col-span-7 glass-pearl rounded-3xl p-6 sm:p-8 text-ink">
        {result ? (
          <div className="py-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/35 bg-nectar text-gold-deep">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-gold-deep">
              Wholesale Ref: {result.leadId} · {result.volumeTier}
            </p>
            <h3 className="font-serif text-3xl font-bold text-ink">Wholesale Request Received</h3>
            <p className="mx-auto max-w-md text-sm text-ink-muted">
              We received your request and will send your custom quote within 24 hours.
            </p>
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-obsidian px-6 py-3 text-xs font-semibold text-ivory hover:bg-gold hover:text-obsidian transition"
            >
              <MessageCircle className="h-4 w-4" /> Chat Directly on WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gold/20">
              <Building2 className="h-5 w-5 text-gold-deep" />
              <h3 className="font-serif text-2xl font-bold text-ink">Request Wholesale Pricing Sheet</h3>
            </div>

            {error && <p className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Company / Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Blue Hills Café / Smith Wedding"
                  className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Inquiry Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
                >
                  <option>Café / Restaurant / Hotel</option>
                  <option>Retail Stockist / Specialty Grocer</option>
                  <option>Corporate Gifting / Holiday Boxes</option>
                  <option>Wedding / Event Favors</option>
                  <option>Airbnb / Villa Welcome Amenities</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="buyer@company.com"
                  className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="876-555-0123"
                  className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Presentation / Labeling
                </label>
                <select
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
                >
                  <option>Standard Hey Hon Glass Label</option>
                  <option>Custom Wedding / Event Ribbon &amp; Tag</option>
                  <option>Corporate Co-Branded Gift Note</option>
                  <option>Reserve Gift Boxes (Launching Soon)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Target Delivery Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Notes / Sample Request
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell us about your parish, recurring monthly volume, or event details..."
                className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-obsidian px-6 py-3.5 text-sm font-semibold text-ivory hover:bg-gold hover:text-obsidian transition shadow-md disabled:opacity-50"
            >
              {submitting ? 'Submitting Wholesale Request...' : `Request Catalog & Quote (${estimate.qty} Jars)`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

import { useMemo, useState, type FormEvent } from 'react';
import { Globe, Package, ShieldCheck, MessageCircle, CheckCircle2, Gift, ArrowRight } from 'lucide-react';
import { INTL_RATE_BANDS, type IntlRateBand } from '@/data/delivery';
import { BRAND, formatJmd, formatApproxFx } from '@/data/brand';

export default function IntlShippingCalculator() {
  const [region, setRegion] = useState<IntlRateBand['region']>('USA');
  const [stateProvince, setStateProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [qty266, setQty266] = useState(1);
  const [qty500, setQty500] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const band = useMemo(() => INTL_RATE_BANDS.find((b) => b.region === region) ?? INTL_RATE_BANDS[0], [region]);

  const calc = useMemo(() => {
    const totalJars = qty266 + qty500;
    const jarWeightKg = qty266 * 0.55 + qty500 * 0.95;
    const packagingKg = totalJars > 0 ? 0.35 + totalJars * 0.08 : 0;
    const grossKg = Math.round((jarWeightKg + packagingKg) * 100) / 100;
    const grossLbs = Math.round(grossKg * 2.20462 * 10) / 10;

    const extraKg = Math.max(0, Math.ceil(grossKg - 2));
    const emsMin = totalJars === 0 ? 0 : band.emsBaseUsd[0] + extraKg * band.emsPerExtraKgUsd[0];
    const emsMax = totalJars === 0 ? 0 : band.emsBaseUsd[1] + extraKg * band.emsPerExtraKgUsd[1];
    const expMin = totalJars === 0 ? 0 : band.expressBaseUsd[0] + extraKg * band.expressPerExtraKgUsd[0];
    const expMax = totalJars === 0 ? 0 : band.expressBaseUsd[1] + extraKg * band.expressPerExtraKgUsd[1];

    const honeySubtotalJmd = qty266 * 2200 + qty500 * 3200;

    return {
      totalJars,
      grossKg,
      grossLbs,
      emsMin,
      emsMax,
      expMin,
      expMax,
      honeySubtotalJmd,
      bandLabel: `EMS US$${emsMin}-$${emsMax} | Express US$${expMin}-$${expMax}`,
    };
  }, [qty266, qty500, band]);

  const whatsappUrl = `https://wa.me/${BRAND.contact.whatsappDigits}?text=${encodeURIComponent(
    `Hi Hey Hon! International Shipping Quote Request:\nDestination: ${band.label}${stateProvince ? `, ${stateProvince}` : ''} ${postalCode}\nItems: ${qty266}x 266ml, ${qty500}x 500ml (~${calc.grossKg} kg)\nEstimated Band: ${calc.bandLabel}`
  )}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (calc.totalJars === 0) {
      setError('Please select at least 1 jar.');
      return;
    }
    if (!email.trim() || !name.trim()) {
      setError('Please enter your name and email so we can send your exact quote.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/leads/international', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entryType: 'Intl_Quote',
          name,
          email,
          phoneWhatsapp: phone,
          country: band.label,
          stateProvince,
          postalCode,
          qty266ml: qty266,
          qty500ml: qty500,
          estWeightKg: calc.grossKg,
          estCarrierBandUsd: calc.bandLabel,
        }),
      });
      const data = (await res.json()) as { ok: boolean; refId?: string; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || 'Could not submit quote request.');
      } else {
        setSubmittedRef(data.refId || 'INT-QUOTE');
      }
    } catch {
      setError('Network error. Feel free to tap WhatsApp below.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Diaspora Smart Nudge */}
      <div className="glass-pearl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border-gold/35 px-5 py-4">
        <div className="flex items-start gap-3">
          <Gift className="h-5 w-5 text-gold-deep shrink-0 mt-0.5" />
          <p className="text-sm text-ink">
            <strong>Sending to family IN Jamaica instead?</strong> Skip overseas shipping fees: place your order in the Harvest Bag, confirm via WhatsApp (+1 658-218-2734), and deliver locally from JMD $500 (or FREE in Kingston on JMD $6,000+).
          </p>
        </div>
        <a
          href="/gifting"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-obsidian px-4 py-2 text-xs font-semibold text-ivory hover:bg-gold hover:text-obsidian transition"
        >
          Send Local Gift <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Calculator Controls (Obsidian Glass) */}
        <div className="lg:col-span-6 glass-dark rounded-3xl p-6 sm:p-8 text-ivory space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold text-gold-bright">
              <Globe className="h-3 w-3" /> Shipping Estimator
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-ivory">Estimate International Shipping</h2>
            <p className="mt-1.5 text-sm text-ivory/70">
              Choose your destination and jar count to see packed weight and estimated shipping costs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ivory/60">
                Destination Region *
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as IntlRateBand['region'])}
                className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-ivory focus:border-gold focus:outline-none"
              >
                {INTL_RATE_BANDS.map((b) => (
                  <option key={b.region} value={b.region} className="bg-obsidian text-ivory">
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ivory/60">
                State / Province / City
              </label>
              <input
                type="text"
                value={stateProvince}
                onChange={(e) => setStateProvince(e.target.value)}
                placeholder="e.g. Florida / Toronto / London"
                className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ivory/60">
                ZIP / Postal Code
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g. 33101 / M5V / SW1A"
                className="w-full rounded-xl border border-white/15 bg-obsidian px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-obsidian/80 p-4">
              <div className="font-serif text-lg font-bold text-ivory">266ml Jar</div>
              <div className="font-mono text-[11px] text-gold-bright">JMD $2,200 · 0.55 kg</div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQty266((n) => Math.max(0, n - 1))}
                  className="h-8 w-8 rounded-full border border-white/20 text-ivory hover:border-gold"
                >
                  −
                </button>
                <span className="font-mono text-lg font-bold">{qty266}</span>
                <button
                  type="button"
                  onClick={() => setQty266((n) => Math.min(12, n + 1))}
                  className="h-8 w-8 rounded-full border border-white/20 text-ivory hover:border-gold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-obsidian/80 p-4">
              <div className="font-serif text-lg font-bold text-ivory">500ml Jar</div>
              <div className="font-mono text-[11px] text-gold-bright">JMD $3,200 · 0.95 kg</div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQty500((n) => Math.max(0, n - 1))}
                  className="h-8 w-8 rounded-full border border-white/20 text-ivory hover:border-gold"
                >
                  −
                </button>
                <span className="font-mono text-lg font-bold">{qty500}</span>
                <button
                  type="button"
                  onClick={() => setQty500((n) => Math.min(10, n + 1))}
                  className="h-8 w-8 rounded-full border border-white/20 text-ivory hover:border-gold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gold/25 bg-obsidian p-5 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
              <span className="inline-flex items-center gap-1.5 text-ivory/75">
                <Package className="h-4 w-4 text-gold-bright" /> Packed Export Weight ({calc.totalJars} jar{calc.totalJars === 1 ? '' : 's'})
              </span>
              <span className="font-mono font-semibold text-gold-bright">
                {calc.grossKg} kg ({calc.grossLbs} lbs)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-white/5 p-3">
                <span className="block font-mono text-[10px] uppercase text-ivory/50">Jamaica Post EMS (Est.)</span>
                <span className="mt-1 block font-mono text-base font-bold text-ivory">
                  US${calc.emsMin} to US${calc.emsMax}
                </span>
                <span className="text-[11px] text-ivory/55">{band.emsDays}</span>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <span className="block font-mono text-[10px] uppercase text-ivory/50">DHL / FedEx Express (Est.)</span>
                <span className="mt-1 block font-mono text-base font-bold text-gold-bright">
                  US${calc.expMin} to US${calc.expMax}
                </span>
                <span className="text-[11px] text-ivory/55">{band.expressDays}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-ivory/70">
              <span>Honey Subtotal</span>
              <span className="font-mono text-ivory">
                {formatJmd(calc.honeySubtotalJmd)} ({formatApproxFx(calc.honeySubtotalJmd, 'USD')})
              </span>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-gold/10 p-3 text-[11px] text-ivory/80">
              <ShieldCheck className="h-4 w-4 text-gold-bright shrink-0 mt-0.5" />
              <span>{band.customsNote}</span>
            </div>
          </div>
        </div>

        {/* Right Quote Request Form (Frosted Pearl Glass) */}
        <div className="lg:col-span-6 glass-pearl rounded-3xl p-6 sm:p-8 text-ink">
          {submittedRef ? (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/35 bg-nectar text-gold-deep">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-gold-deep">Quote Ref: {submittedRef}</p>
              <h3 className="font-serif text-3xl font-bold text-ink">Quote Request Received</h3>
              <p className="mx-auto max-w-md text-sm text-ink-muted">
                We received your shipping request ({calc.grossKg} kg to {band.label}) and will send your exact total and a secure card payment link within 24 hours.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-obsidian px-6 py-3 text-xs font-semibold text-ivory hover:bg-gold hover:text-obsidian transition"
              >
                <MessageCircle className="h-4 w-4" /> Fast-Track on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-ink border-b border-gold/20 pb-3">
                Lock In Your Exact Export Quote
              </h3>
              <p className="text-sm text-ink-muted">
                Courier rates vary by postal code, so we confirm your exact final total within 24 hours and send you a secure card payment link once you approve.
              </p>

              {error && <p className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">{error}</p>}

              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none"
                />
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
                    placeholder="you@email.com"
                    className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 / +44 number"
                    className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-gold/20 bg-ivory/80 p-4 text-xs text-ink-muted space-y-1">
                <div className="font-mono uppercase tracking-wider text-[10px] text-gold-deep">Quote Summary</div>
                <div>
                  Destination: <strong className="text-ink">{band.label}</strong>
                  {stateProvince ? ` · ${stateProvince}` : ''} {postalCode}
                </div>
                <div>
                  Jars: <strong className="text-ink">{qty266}× 266ml, {qty500}× 500ml</strong> ({calc.grossKg} kg packed)
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-obsidian px-6 py-3.5 text-sm font-semibold text-ivory hover:bg-gold hover:text-obsidian transition shadow-md disabled:opacity-50"
              >
                {submitting ? 'Submitting Quote...' : 'Request Confirmed Shipping Quote'}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-obsidian/20 bg-parchment/90 py-3 text-xs font-semibold text-ink hover:border-gold hover:text-gold-deep transition"
              >
                <MessageCircle className="h-4 w-4" /> Or Send This Calculation Directly on WhatsApp
              </a>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

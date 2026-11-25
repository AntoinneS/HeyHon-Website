import { useEffect, useMemo, useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { FAQS } from '@/data/faq';
import { ST_MARY_FLORA } from '@/data/flora';
import { DELIVERY_OPTIONS } from '@/data/delivery';
import { formatJmd } from '@/data/brand';

interface QuickResult {
  type: 'Answer' | 'Delivery' | 'St. Mary Flora';
  title: string;
  body: string;
  href?: string;
  cta?: string;
}

const SUGGESTIONS = ['Delivery rates', 'Pickup spots', 'Moringa', 'Crystallized honey', 'Flying with honey', 'Bulk & weddings'];

export default function AskHeyHonModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onOpen = (e: Event) => {
      const custom = e as CustomEvent<{ query?: string }>;
      if (custom.detail?.query) setQuery(custom.detail.query);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('heyhon:open-ask', onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('heyhon:open-ask', onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const results = useMemo<QuickResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return FAQS.slice(0, 5).map((f) => ({
        type: 'Answer',
        title: f.question,
        body: f.answer,
        href: f.ctaHref,
        cta: f.ctaLabel,
      }));
    }

    const out: QuickResult[] = [];

    for (const f of FAQS) {
      const hay = `${f.question} ${f.answer} ${f.category} ${f.tags.join(' ')}`.toLowerCase();
      if (hay.includes(q)) {
        out.push({
          type: 'Answer',
          title: f.question,
          body: f.answer,
          href: f.ctaHref,
          cta: f.ctaLabel,
        });
      }
    }

    for (const d of DELIVERY_OPTIONS) {
      const hay = `${d.label} ${d.details} ${d.stations?.join(' ') || ''}`.toLowerCase();
      if (hay.includes(q)) {
        out.push({
          type: 'Delivery',
          title: d.label,
          body: `${d.feeJmd === 0 ? 'FREE' : formatJmd(d.feeJmd)} · ${d.eta}. ${d.details}`,
          href: '/delivery',
          cta: 'Check All Rates',
        });
      }
    }

    for (const p of ST_MARY_FLORA) {
      const hay = `${p.commonName} ${p.botanicalName} ${p.flavorNotes} ${p.layer} ${p.mapZone} ${p.medicinal.primaryBenefit} ${p.medicinal.keyCompounds} ${p.medicinal.honeyEffect} medicinal wellness antioxidant throat`.toLowerCase();
      if (hay.includes(q)) {
        out.push({
          type: 'St. Mary Flora',
          title: `${p.commonName} (${p.botanicalName})`,
          body: `${p.medicinal.primaryBenefit}. ${p.medicinal.honeyEffect}`,
          href: '/st-mary-flora',
          cta: 'Inspect on St. Mary Bloom Map',
        });
      }
    }

    return out.slice(0, 8);
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-3 sm:px-4 pt-12 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Ask Hey Hon"
    >
      <div className="fixed inset-0 bg-obsidian/45 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-obsidian/12 bg-ivory/98 backdrop-blur-2xl text-ink shadow-2xl">
        <div className="flex items-center gap-3 border-b border-obsidian/10 bg-parchment/90 px-4 sm:px-5 py-4">
          <Search className="h-4 w-4 text-ink-muted shrink-0" strokeWidth={1.75} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search delivery rates, plants, gifts, flying with honey..."
            className="w-full bg-transparent text-base sm:text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-full px-2 py-1 text-xs font-medium text-ink-muted hover:text-ink"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 text-ink-muted hover:bg-obsidian/5 hover:text-ink"
            aria-label="Close search"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-b border-obsidian/10 bg-sandstone/55 px-4 sm:px-5 py-3">
          <span className="mr-1 text-[11px] font-semibold text-ink-muted">Popular:</span>
          {SUGGESTIONS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setQuery(chip)}
              className="rounded-full border border-obsidian/12 bg-parchment px-3 py-1 text-xs font-medium text-ink/85 hover:border-gold hover:text-gold-deep transition"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="max-h-[60vh] overflow-y-auto divide-y divide-ink/8 px-4 sm:px-5 py-2">
          {results.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-ink-muted">No direct match for “{query}”.</p>
              <a
                href={`https://wa.me/16582182734?text=${encodeURIComponent(`Hi Hey Hon! I have a question: ${query}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-obsidian px-5 py-2.5 text-xs font-semibold text-ivory hover:bg-gold-deep transition"
              >
                Ask Us Directly on WhatsApp <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </a>
            </div>
          ) : (
            results.map((r, i) => (
              <div key={`${r.title}-${i}`} className="py-4">
                <span className="inline-block rounded-full bg-gold/12 px-2.5 py-0.5 text-[11px] font-semibold text-gold-deep">
                  {r.type}
                </span>
                <h3 className="mt-1.5 font-serif text-lg font-semibold text-ink">{r.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{r.body}</p>
                {r.href && (
                  <a
                    href={r.href}
                    onClick={() => setOpen(false)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-deep hover:underline"
                  >
                    {r.cta || 'Learn More'} <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </a>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-obsidian/10 bg-parchment/90 px-4 sm:px-5 py-3 text-xs text-ink-muted">
          <span className="hidden sm:inline">Every product, medicinal &amp; delivery question answered clearly.</span>
          <a href="/faq" onClick={() => setOpen(false)} className="font-semibold text-gold-deep hover:underline">
            Browse Full FAQ →
          </a>
        </div>
      </div>
    </div>
  );
}

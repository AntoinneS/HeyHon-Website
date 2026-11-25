import { useState, type FormEvent } from 'react';
import { ShoppingBag, Bell, CheckCircle2, ArrowUpRight } from 'lucide-react';
import type { ProductItem } from '@/data/products';
import { formatJmd, formatApproxFx } from '@/data/brand';
import { addToCart } from '@/lib/cartStore';

interface Props {
  product: ProductItem;
  effectiveAvailable: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'coming_soon';
  showApproxUsd?: boolean;
}

export default function ProductCard({ product, effectiveAvailable, status, showApproxUsd = false }: Props) {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [waitlistSending, setWaitlistSending] = useState(false);

  const isBuyable = status === 'in_stock' || status === 'low_stock';

  const handleAdd = () => {
    addToCart({
      sku: product.sku,
      name: product.shortName,
      sizeLabel: product.sizeLabel,
      priceJmd: product.priceJmd,
      image: product.image,
    });
  };

  const handleWaitlist = async (e: FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    setWaitlistSending(true);
    try {
      await fetch('/api/leads/international', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entryType: product.type === 'gift_box' ? 'GiftBox_Waitlist' : 'Restock_Alert',
          email: waitlistEmail.trim(),
          notes: `Requested alert for ${product.sku} (${product.name})`,
        }),
      });
      setWaitlistDone(true);
    } finally {
      setWaitlistSending(false);
    }
  };

  return (
    <article className="group glass-pearl flex flex-col overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Sunlit Studio Pedestal */}
      <div className="jar-pedestal-light relative aspect-[4/3] overflow-hidden border-b border-obsidian/10 p-5 sm:p-6">
        <div className="absolute left-3.5 top-3.5 z-10 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-obsidian/10 bg-parchment/92 px-3 py-1 text-[11px] font-semibold text-ink shadow-xs backdrop-blur">
            {product.badge}
          </span>
        </div>

        {/* Clean Minimal Stock Pill */}
        <div className="absolute right-3.5 top-3.5 z-10">
          {status === 'in_stock' && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-parchment/92 px-2.5 py-1 text-[11px] font-medium text-gold-deep shadow-xs backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold"></span>
              In stock
            </span>
          )}
          {status === 'low_stock' && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/35 bg-parchment/92 px-2.5 py-1 text-[11px] font-semibold text-gold-deep shadow-xs backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold"></span>
              Only {effectiveAvailable} left
            </span>
          )}
          {status === 'out_of_stock' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-obsidian/10 px-2.5 py-1 text-[11px] font-medium text-ink-muted">
              Batch sold out
            </span>
          )}
          {status === 'coming_soon' && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-parchment/92 px-2.5 py-1 text-[11px] font-semibold text-gold-deep">
              Waitlist open
            </span>
          )}
        </div>

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain drop-shadow-[0_12px_20px_rgba(38,25,18,0.18)] transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-gold-deep">{product.sizeLabel}</p>
            <h3 className="mt-1 font-serif text-2xl font-semibold leading-snug text-ink">
              {product.type !== 'gift_box' ? (
                <a href={`/shop/${product.slug}`} className="hover:text-gold-deep transition">
                  {product.shortName}
                </a>
              ) : (
                product.shortName
              )}
            </h3>
          </div>
          {product.type !== 'gift_box' && (
            <a
              href={`/shop/${product.slug}`}
              className="rounded-full border border-obsidian/10 bg-sandstone/55 p-2 text-ink-muted hover:border-gold hover:text-gold-deep transition"
              aria-label={`View details for ${product.shortName}`}
            >
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </a>
          )}
        </div>

        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{product.tagline}</p>

        {/* Price + Action */}
        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-obsidian/10 pt-4">
            <div>
              {product.priceJmd > 0 ? (
                <>
                  <div className="text-xl font-bold text-ink">{formatJmd(product.priceJmd)}</div>
                  {showApproxUsd && (
                    <div className="font-mono text-[11px] text-ink-muted">
                      {formatApproxFx(product.priceJmd, 'USD')} · {formatApproxFx(product.priceJmd, 'GBP')}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs font-semibold uppercase tracking-wide text-gold-deep">Launching Soon</div>
              )}
            </div>

            {isBuyable ? (
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center gap-2 rounded-full bg-obsidian px-5 py-2.5 text-xs font-semibold text-ivory hover:bg-gold-bright hover:text-obsidian transition shadow-xs"
              >
                <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.75} />
                Add to Bag
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setWaitlistOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-gold/10 px-4 py-2 text-xs font-semibold text-gold-deep hover:bg-obsidian hover:text-ivory transition"
              >
                <Bell className="h-3.5 w-3.5" strokeWidth={1.75} />
                Notify Me
              </button>
            )}
          </div>

          {waitlistOpen && (
            <div className="mt-3 rounded-xl border border-obsidian/10 bg-parchment/92 p-3">
              {waitlistDone ? (
                <p className="flex items-center gap-2 text-xs font-semibold text-bloom-deep">
                  <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} /> You’re on the priority list. We’ll alert you first.
                </p>
              ) : (
                <form onSubmit={handleWaitlist} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="flex-1 rounded-lg border border-ink/15 bg-ivory px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={waitlistSending}
                    className="rounded-lg bg-obsidian px-3.5 py-2 text-xs font-semibold text-ivory hover:bg-gold-deep transition"
                  >
                    {waitlistSending ? '...' : 'Join'}
                  </button>
                </form>
              )}
            </div>
          )}

          {product.freeKingstonEligible && isBuyable && (
            <p className="mt-2.5 text-[11px] font-semibold text-bloom-deep">
              ✓ Unlocks free Kingston delivery
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

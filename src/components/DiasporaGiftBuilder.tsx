import { useState } from 'react';
import { Gift, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { formatJmd, formatApproxFx } from '@/data/brand';
import { addToCart } from '@/lib/cartStore';

export default function DiasporaGiftBuilder() {
  const [currency, setCurrency] = useState<'USD' | 'CAD' | 'GBP'>('USD');
  const [recipientName, setRecipientName] = useState('Mom');
  const [senderName, setSenderName] = useState('With love from New York');
  const [message, setMessage] = useState(
    'Missing you and Jamaica! Enjoy pure raw St. Mary honey in your morning tea.'
  );
  const [selectedSku, setSelectedSku] = useState('HH-BUNDLE-KGN-500');

  const buyable = PRODUCTS.filter((p) => p.type !== 'gift_box');
  const chosen = buyable.find((p) => p.sku === selectedSku) ?? buyable[0];

  const handleAddGift = () => {
    addToCart({
      sku: chosen.sku,
      name: chosen.shortName,
      sizeLabel: chosen.sizeLabel,
      priceJmd: chosen.priceJmd,
      image: chosen.image,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Left Configurator (Frosted Pearl Glass) */}
      <div className="lg:col-span-6 glass-pearl rounded-3xl p-6 sm:p-8 text-ink space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-gold-deep">
              Send a Gift in Jamaica
            </span>
            <h2 className="font-serif text-3xl font-bold text-ink">Personalize Your Gift Note</h2>
          </div>

          <div className="inline-flex rounded-full border border-obsidian/15 bg-parchment/90 p-1">
            {(['USD', 'CAD', 'GBP'] as const).map((cur) => (
              <button
                key={cur}
                type="button"
                onClick={() => setCurrency(cur)}
                className={`rounded-full px-3 py-1 font-mono text-xs font-semibold transition ${
                  currency === cur ? 'bg-obsidian text-gold-bright' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            1. Choose Gift Jar or Free Kingston Delivery Bundle
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {buyable.map((p) => (
              <button
                key={p.sku}
                type="button"
                onClick={() => setSelectedSku(p.sku)}
                className={`rounded-2xl border p-3.5 text-left transition ${
                  selectedSku === p.sku
                    ? 'border-gold bg-nectar/65 shadow-sm'
                    : 'border-obsidian/12 bg-parchment/90 hover:border-gold/45'
                }`}
              >
                <div className="font-serif text-lg font-bold text-ink">{p.shortName}</div>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-xs font-bold text-ink">{formatJmd(p.priceJmd)}</span>
                  <span className="font-mono text-[11px] text-gold-deep">
                    {formatApproxFx(p.priceJmd, currency)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              To (In Jamaica)
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-base sm:text-sm text-ink focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              From
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-base sm:text-sm text-ink focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            Complimentary Handwritten Note Preview
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-base sm:text-sm text-ink focus:border-gold focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-ink-muted">
            Paste or refine this note at checkout. You can also tick <strong className="text-ink">“Hide price on delivery slip”</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddGift}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-obsidian px-6 py-3.5 text-sm font-semibold text-ivory hover:bg-gold hover:text-obsidian transition shadow-lg"
        >
          <ShoppingBag className="h-4 w-4" />
          Add {chosen.shortName} to Bag ({formatJmd(chosen.priceJmd)} / {formatApproxFx(chosen.priceJmd, currency)})
        </button>
      </div>

      {/* Right Matte Obsidian & Gold-Foil Keepsake Card Preview */}
      <div className="lg:col-span-6 glass-dark rounded-3xl p-6 sm:p-10 text-ivory flex flex-col justify-center">
        <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-gold-bright">
          <span className="inline-flex items-center gap-1.5">
            <Gift className="h-4 w-4" /> Live Keepsake Card Preview
          </span>
          <span>Included Free</span>
        </div>

        <div className="relative rounded-2xl border border-gold/45 bg-gradient-to-br from-[#2E1E15] via-[#241710] to-[#1A100B] p-7 sm:p-8 text-ivory shadow-xl">
          <div className="flex items-center justify-between border-b border-gold/25 pb-3">
            <span className="font-serif text-xl font-semibold text-gold-bright">Hey Hon</span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-gold-bright/80">
              St. Mary, Jamaica
            </span>
          </div>

          <div className="py-6 space-y-3">
            <p className="font-serif text-lg italic text-gold-bright/85">Dearest {recipientName || 'Friend'},</p>
            <p className="font-serif text-2xl leading-relaxed text-ivory">
              “{message || 'Enjoy pure raw honey from the hills of St. Mary, Jamaica.'}”
            </p>
            <p className="pt-2 font-serif text-lg font-semibold text-gold-bright">
              {senderName || 'With love'}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-gold/20 pt-3 font-mono text-[10px] text-ivory/55">
            <span>100% Raw Cold-Extracted Wildflower</span>
            <span>No Prices Printed on Gift Slip</span>
          </div>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ivory/75">
          Order from the US, UK, or Canada via your Harvest Bag and confirm directly on WhatsApp (+1 658-218-2734) to finalize delivery day and payment. We deliver across Kingston, Portmore, Spanish Town &amp; Knutsford Express islandwide.
        </p>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { MapPin, Truck, CheckCircle2 } from 'lucide-react';
import { DELIVERY_OPTIONS, calculateLocalDeliveryFee } from '@/data/delivery';
import { BRAND, formatJmd } from '@/data/brand';

export default function DeliveryChecker() {
  const [selectedId, setSelectedId] = useState('courier-kingston');
  const [orderValue, setOrderValue] = useState(3200);

  const result = useMemo(
    () => calculateLocalDeliveryFee(selectedId, orderValue),
    [selectedId, orderValue]
  );

  return (
    <div className="glass-dark rounded-3xl p-6 sm:p-8 text-ivory">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-bright">
            Jamaica Delivery &amp; Pickup
          </span>
          <h2 className="mt-1 font-serif text-3xl font-bold text-ivory">Check Your Delivery Fee</h2>
        </div>
        <span className="rounded-full border border-gold-bright/35 bg-gold-bright/12 px-3 py-1 text-xs font-medium text-gold-bright">
          All 14 Parishes
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ivory/75">
              Where are we delivering?
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-obsidian px-4 py-3 text-base sm:text-sm text-ivory focus:border-gold focus:outline-none"
            >
              <optgroup label="Free Pickup (JMD $0)">
                {DELIVERY_OPTIONS.filter((o) => o.group === 'pickup').map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Direct Courier">
                {DELIVERY_OPTIONS.filter((o) => o.group === 'courier').map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label} ({formatJmd(o.feeJmd)})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Knutsford Express (JMD $700)">
                {DELIVERY_OPTIONS.filter((o) => o.group === 'knutsford').map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-ivory/75">
                Order Size
              </label>
              <span className="font-mono text-xs text-gold-bright">{formatJmd(orderValue)}</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                { label: '1× 266ml ($2,200)', val: 2200 },
                { label: '1× 500ml ($3,200)', val: 3200 },
                { label: '2× 500ml ($6,400)', val: 6400 },
              ].map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => setOrderValue(preset.val)}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                    orderValue === preset.val
                      ? 'border-gold bg-gold text-obsidian font-semibold'
                      : 'border-white/15 bg-white/5 text-ivory/75 hover:border-gold/50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Result Card */}
        <div className="lg:col-span-5 rounded-2xl border border-gold/25 bg-obsidian p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gold-bright">
              {result.option?.group === 'pickup' ? (
                <MapPin className="h-3.5 w-3.5" />
              ) : (
                <Truck className="h-3.5 w-3.5" />
              )}
              <span>{result.option?.shortLabel}</span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-4xl font-bold text-ivory">
                {result.feeJmd === 0 ? 'FREE' : formatJmd(result.feeJmd)}
              </span>
              {result.isFreeUnlocked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold-bright/18 px-2.5 py-0.5 text-[11px] font-semibold text-gold-bright">
                  ✓ JMD $6,000+ Unlocked
                </span>
              )}
            </div>

            <p className="mt-2 text-xs text-ivory/75 leading-relaxed">{result.option?.details}</p>
            <p className="mt-2 font-mono text-[11px] text-gold-bright/90">ETA: {result.option?.eta}</p>

            {result.option?.stations && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {result.option.stations.map((st) => (
                  <span
                    key={st}
                    className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-ivory/80"
                  >
                    Hub: {st}
                  </span>
                ))}
              </div>
            )}
          </div>

          {selectedId === 'courier-kingston' && orderValue < BRAND.freeKingstonThresholdJmd && (
            <p className="mt-4 flex items-center gap-1.5 rounded-xl bg-gold/15 px-3 py-2 text-[11px] text-gold-bright">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              Tip: Order the 2× 500ml Duo (JMD $6,400) to unlock FREE Kingston delivery!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

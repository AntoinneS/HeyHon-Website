import { useEffect, useMemo, useState } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  MessageCircle,
  Gift,
  Truck,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { readCart, writeCart, type CartItem } from '@/lib/cartStore';
import { BRAND, formatJmd, formatApproxFx } from '@/data/brand';
import { DELIVERY_OPTIONS, calculateLocalDeliveryFee } from '@/data/delivery';

interface LiveStockMap {
  [sku: string]: { effectiveAvailable: number; status: string };
}

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'bag' | 'checkout' | 'done'>('bag');
  const [items, setItems] = useState<CartItem[]>([]);
  const [liveStock, setLiveStock] = useState<LiveStockMap>({});

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryOptionId, setDeliveryOptionId] = useState('courier-kingston');
  const [knutsfordStation, setKnutsfordStation] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isDiasporaGift, setIsDiasporaGift] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [giftNote, setGiftNote] = useState('');
  const [hidePrice, setHidePrice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [doneResult, setDoneResult] = useState<{
    orderId: string;
    message?: string;
    whatsappUrl?: string;
  } | null>(null);

  useEffect(() => {
    setItems(readCart());

    const syncCart = (e: Event) => {
      const custom = e as CustomEvent<CartItem[]>;
      setItems(custom.detail ?? readCart());
    };
    const handleOpen = () => {
      setOpen(true);
      setStep('bag');
      fetch('/api/inventory')
        .then((r) => r.json())
        .then((raw) => {
          const d = raw as { items?: { sku: string; effectiveAvailable: number; status: string }[] };
          const map: LiveStockMap = {};
          for (const it of d.items || []) {
            map[it.sku] = { effectiveAvailable: it.effectiveAvailable, status: it.status };
          }
          setLiveStock(map);
        })
        .catch(() => {});
    };

    window.addEventListener('heyhon:cart-updated', syncCart);
    window.addEventListener('heyhon:open-cart', handleOpen);
    return () => {
      window.removeEventListener('heyhon:cart-updated', syncCart);
      window.removeEventListener('heyhon:open-cart', handleOpen);
    };
  }, []);

  useEffect(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    document.querySelectorAll('[data-cart-badge]').forEach((el) => {
      el.textContent = String(count);
    });
  }, [items]);

  const subtotalJmd = useMemo(() => items.reduce((sum, i) => sum + i.priceJmd * i.qty, 0), [items]);
  const remainingForFreeKgn = Math.max(0, BRAND.freeKingstonThresholdJmd - subtotalJmd);
  const progressPct = Math.min(100, Math.round((subtotalJmd / BRAND.freeKingstonThresholdJmd) * 100));

  const { feeJmd, isFreeUnlocked, option: selectedDelivery } = useMemo(
    () => calculateLocalDeliveryFee(deliveryOptionId, subtotalJmd),
    [deliveryOptionId, subtotalJmd]
  );

  const totalJmd = subtotalJmd + feeJmd;

  const updateQty = (sku: string, delta: number) => {
    const next = items
      .map((it) => (it.sku === sku ? { ...it, qty: it.qty + delta } : it))
      .filter((it) => it.qty > 0);
    setItems(next);
    writeCart(next);
  };

  const removeSku = (sku: string) => {
    const next = items.filter((it) => it.sku !== sku);
    setItems(next);
    writeCart(next);
  };

  const submitCheckout = async (channel: 'HandyPay' | 'WhatsApp') => {
    setErrorMsg(null);
    if (!customerName.trim() || !phone.trim()) {
      setErrorMsg('Please enter your name and phone/WhatsApp number.');
      return;
    }
    if (selectedDelivery?.requiresStation && !knutsfordStation.trim()) {
      setErrorMsg('Please select or enter your preferred Knutsford Express station.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          customerName,
          phone,
          email,
          deliveryOptionId,
          knutsfordStation,
          deliveryAddress,
          giftNote,
          hidePrice,
          isDiasporaGift,
          recipientName,
          recipientPhone,
          lines: items.map((i) => ({ sku: i.sku, qty: i.qty })),
        }),
      });

      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        orderId?: string;
        checkoutUrl?: string;
        whatsappUrl?: string;
        whatsappFallbackUrl?: string;
        message?: string;
      };

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'Could not process checkout. Please try again.');
        setSubmitting(false);
        return;
      }

      if (channel === 'HandyPay' && data.checkoutUrl) {
        writeCart([]);
        window.location.href = data.checkoutUrl;
        return;
      }

      if (channel === 'WhatsApp' && data.whatsappUrl) {
        writeCart([]);
        setDoneResult({
          orderId: data.orderId || 'HH-ORDER',
          message: 'Your order is logged in our system! Tap below if WhatsApp did not open automatically.',
          whatsappUrl: data.whatsappUrl,
        });
        setStep('done');
        window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
        setSubmitting(false);
        return;
      }

      setDoneResult({
        orderId: data.orderId || 'HH-ORDER',
        message:
          data.message ||
          'Your order is saved. Tap below to confirm your delivery or pickup time on WhatsApp:',
        whatsappUrl: data.whatsappFallbackUrl,
      });
      setStep('done');
    } catch {
      setErrorMsg('Network hiccup. Please check your connection or use WhatsApp Express.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Harvest Bag">
      <div
        className="fixed inset-0 bg-obsidian/45 backdrop-blur-sm transition-opacity"
        onClick={() => setOpen(false)}
      />

      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-ivory/98 backdrop-blur-2xl text-ink shadow-2xl border-l border-obsidian/12">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-obsidian/10 bg-parchment/90 px-5 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-gold-deep" strokeWidth={1.75} />
            <div>
              <h2 className="font-serif text-xl font-semibold tracking-tight text-ink">
                {step === 'bag' ? 'Your Bag' : step === 'checkout' ? 'Checkout & Delivery' : 'Order Saved'}
              </h2>
              <p className="text-[11px] font-medium text-ink-muted">
                100% Pure Raw Honey
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-ink-muted hover:bg-obsidian/5 hover:text-ink transition"
            aria-label="Close Harvest Bag"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Free Kingston Delivery Progress */}
        {step !== 'done' && (
          <div className="border-b border-obsidian/10 bg-sandstone/55 px-5 sm:px-6 py-3.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-ink">
                <Truck className="h-3.5 w-3.5 text-gold-deep" strokeWidth={1.75} />
                {remainingForFreeKgn === 0 ? (
                  <span className="text-bloom-deep font-semibold">Free Kingston Delivery unlocked!</span>
                ) : (
                  <span>
                    Add <strong className="text-gold-deep">{formatJmd(remainingForFreeKgn)}</strong> for Free Kingston Delivery
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px] text-ink-muted">{progressPct}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-obsidian/10">
              <div
                className={`h-full transition-all duration-500 ${
                  remainingForFreeKgn === 0 ? 'bg-bloom' : 'bg-gold'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          {step === 'bag' && (
            <>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-obsidian/12 bg-parchment text-gold-deep shadow-xs">
                    <ShoppingBag className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <p className="font-serif text-2xl font-semibold text-ink">Your Harvest Bag is empty</p>
                  <p className="mt-2 max-w-xs text-sm text-ink-muted">
                    Add a 266ml or 500ml jar, or grab the Free Kingston Delivery Duo (2× 500ml).
                  </p>
                  <a
                    href="/shop"
                    onClick={() => setOpen(false)}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-obsidian px-6 py-3 text-sm font-semibold text-ivory hover:bg-gold-deep transition"
                  >
                    Explore The Harvest
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const stock = liveStock[item.sku];
                    return (
                      <div
                        key={item.sku}
                        className="flex gap-4 rounded-2xl border border-obsidian/12 bg-parchment/90 p-3.5 shadow-xs"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="jar-pedestal-light h-20 w-20 rounded-xl object-contain p-1.5 border border-obsidian/10"
                        />
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-serif text-lg font-semibold leading-tight text-ink">
                                {item.name}
                              </h3>
                              <p className="text-xs text-ink-muted">{item.sizeLabel}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSku(item.sku)}
                              className="text-ink-muted/70 hover:text-red-600 transition"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                          </div>

                          {stock && stock.effectiveAvailable <= 5 && (
                            <p className="mt-1 text-[11px] font-medium text-gold-deep">
                              Only {stock.effectiveAvailable} left in current batch
                            </p>
                          )}

                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-ivory px-2.5 py-1">
                              <button
                                type="button"
                                onClick={() => updateQty(item.sku, -1)}
                                className="p-0.5 text-ink hover:text-gold-deep"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
                              </button>
                              <span className="min-w-[1.25rem] text-center font-mono text-xs font-semibold text-ink">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(item.sku, 1)}
                                className="p-0.5 text-ink hover:text-gold-deep"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
                              </button>
                            </div>
                            <span className="font-semibold text-ink">
                              {formatJmd(item.priceJmd * item.qty)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="rounded-xl border border-gold/25 bg-gold/8 p-3.5 text-xs text-ink flex items-start gap-2.5">
                    <Gift className="h-4 w-4 text-gold-deep shrink-0 mt-0.5" strokeWidth={1.75} />
                    <span>
                      Every order includes a <strong>complimentary handwritten gift note</strong> on the next step.
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <div className="space-y-4">
              {errorMsg && (
                <div className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3.5">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-muted">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Danielle Brown"
                    className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-base sm:text-sm text-ink placeholder:text-ink-muted/60 focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-muted">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="876-555-0192"
                      className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-base sm:text-sm text-ink placeholder:text-ink-muted/60 focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-muted">
                      Email (Receipt)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-base sm:text-sm text-ink placeholder:text-ink-muted/60 focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-muted">
                    Delivery Parish or Free Pickup *
                  </label>
                  <select
                    value={deliveryOptionId}
                    onChange={(e) => {
                      setDeliveryOptionId(e.target.value);
                      setKnutsfordStation('');
                    }}
                    className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-base sm:text-sm text-ink focus:border-gold focus:outline-none"
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
                          {o.label} ({o.freeOverJmd && subtotalJmd >= o.freeOverJmd ? 'Free' : formatJmd(o.feeJmd)})
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

                {selectedDelivery?.requiresStation && (
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-muted">
                      Preferred Knutsford Station *
                    </label>
                    <input
                      type="text"
                      value={knutsfordStation}
                      onChange={(e) => setKnutsfordStation(e.target.value)}
                      placeholder={`e.g. ${selectedDelivery.stations?.join(', ') || 'Mandeville, Drax Hall'}`}
                      className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-base sm:text-sm text-ink placeholder:text-ink-muted/60 focus:border-gold focus:outline-none"
                    />
                  </div>
                )}

                {selectedDelivery?.group === 'courier' && (
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-muted">
                      Delivery Address / Community
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Street, apartment, or landmark"
                      className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-base sm:text-sm text-ink placeholder:text-ink-muted/60 focus:border-gold focus:outline-none"
                    />
                  </div>
                )}

                <label className="flex items-center gap-2.5 rounded-xl border border-obsidian/12 bg-parchment/90 px-3.5 py-3 text-xs font-medium text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDiasporaGift}
                    onChange={(e) => setIsDiasporaGift(e.target.checked)}
                    className="accent-gold h-4 w-4"
                  />
                  <span>Sending as a gift to someone else in Jamaica?</span>
                </label>

                {isDiasporaGift && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-gold/25 bg-gold/8 p-3">
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Recipient Name in JA"
                      className="w-full rounded-lg border border-obsidian/15 bg-parchment/90 px-3 py-2 text-sm text-ink placeholder:text-ink-muted/60"
                    />
                    <input
                      type="tel"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="Recipient JA Phone (876-...)"
                      className="w-full rounded-lg border border-obsidian/15 bg-parchment/90 px-3 py-2 text-sm text-ink placeholder:text-ink-muted/60"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-muted">
                    Free Handwritten Gift Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    placeholder="Write a personal note. We handwrite it on our card for free."
                    className="w-full rounded-xl border border-obsidian/15 bg-parchment/90 px-3.5 py-2.5 text-base sm:text-sm text-ink placeholder:text-ink-muted/60 focus:border-gold focus:outline-none"
                  />
                  {giftNote.trim() && (
                    <label className="mt-1.5 flex items-center gap-2 text-xs text-ink-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hidePrice}
                        onChange={(e) => setHidePrice(e.target.checked)}
                        className="accent-gold"
                      />
                      Hide price on delivery slip
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'done' && doneResult && (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/35 bg-nectar text-gold-deep">
                <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-gold-deep">Order Ref: {doneResult.orderId}</p>
              <h3 className="font-serif text-3xl font-semibold text-ink">We’ve Got Your Harvest</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{doneResult.message}</p>
              {doneResult.whatsappUrl && (
                <a
                  href={doneResult.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-obsidian px-6 py-3.5 text-sm font-semibold text-ivory hover:bg-gold-deep transition"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                  Confirm on WhatsApp Now
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer Totals & Actions */}
        {step !== 'done' && items.length > 0 && (
          <div className="border-t border-obsidian/10 bg-parchment/95 px-5 sm:px-6 py-4 space-y-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-ink-muted">
                <span>Subtotal</span>
                <span className="text-ink font-medium">{formatJmd(subtotalJmd)}</span>
              </div>
              {step === 'checkout' && (
                <div className="flex justify-between text-ink-muted">
                  <span>{selectedDelivery?.shortLabel || 'Delivery'}</span>
                  <span className={feeJmd === 0 ? 'font-semibold text-bloom-deep' : 'text-ink font-medium'}>
                    {feeJmd === 0 ? (isFreeUnlocked ? 'FREE Unlocked' : 'FREE Pickup') : formatJmd(feeJmd)}
                  </span>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-dashed border-ink/15 pt-2 text-base font-bold text-ink">
                <span>Total</span>
                <div className="text-right">
                  <div className="text-ink">{formatJmd(step === 'checkout' ? totalJmd : subtotalJmd)}</div>
                  <div className="font-mono text-[11px] font-normal text-ink-muted">
                    {formatApproxFx(step === 'checkout' ? totalJmd : subtotalJmd, 'USD')} ·{' '}
                    {formatApproxFx(step === 'checkout' ? totalJmd : subtotalJmd, 'GBP')}
                  </div>
                </div>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-obsidian px-6 py-3.5 text-sm font-semibold text-ivory hover:bg-gold-deep transition shadow-sm"
              >
                Continue to Checkout →
              </button>
            ) : (
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => submitCheckout('HandyPay')}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-obsidian px-6 py-3.5 text-sm font-semibold text-ivory hover:bg-gold-deep transition disabled:opacity-50 shadow-sm"
                >
                  <CreditCard className="h-4 w-4" strokeWidth={1.75} />
                  {submitting ? 'Saving Order...' : `Pay by Card (${formatJmd(totalJmd)})`}
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => submitCheckout('WhatsApp')}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-ivory px-6 py-3 text-xs font-semibold text-ink hover:border-gold hover:text-gold-deep transition disabled:opacity-50"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                  Order on WhatsApp Instead
                </button>
                <div className="flex items-center justify-between pt-1 text-[11px] text-ink-muted">
                  <button type="button" onClick={() => setStep('bag')} className="underline hover:text-ink">
                    ← Edit Bag
                  </button>
                  <span className="inline-flex items-center gap-1">
                    <Lock className="h-3 w-3 text-gold-deep" strokeWidth={1.75} /> Secure card or WhatsApp checkout
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}

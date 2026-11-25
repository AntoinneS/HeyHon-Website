import type { APIRoute } from 'astro';
import { BRAND, formatJmd } from '@/data/brand';
import { PRODUCTS } from '@/data/products';
import { calculateLocalDeliveryFee } from '@/data/delivery';
import { expandLinesToPhysicalJars, reserveStockForOrder, type CartLine } from '@/lib/inventory';
import { createHandyPayCheckout } from '@/lib/handypay';
import { pushToGoogleSheet } from '@/lib/sheets';

interface CheckoutPayload {
  channel: 'HandyPay' | 'WhatsApp';
  customerName: string;
  phone: string;
  email?: string;
  deliveryOptionId: string;
  knutsfordStation?: string;
  deliveryAddress?: string;
  giftNote?: string;
  hidePrice?: boolean;
  isDiasporaGift?: boolean;
  recipientName?: string;
  recipientPhone?: string;
  lines: CartLine[];
}

function generateOrderId(): string {
  const now = new Date();
  const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HH-${ym}-${rand}`;
}

export const POST: APIRoute = async ({ request, locals, url }) => {
  try {
    const env = locals.runtime?.env;
    const body = (await request.json()) as CheckoutPayload;

    if (!body.customerName?.trim() || !body.phone?.trim() || !body.deliveryOptionId || !body.lines?.length) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing required customer, delivery, or bag fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate items & compute authoritative subtotal on the server
    let subtotalJmd = 0;
    const itemSummaries: string[] = [];
    for (const line of body.lines) {
      const product = PRODUCTS.find((p) => p.sku === line.sku);
      if (!product || product.statusOverride === 'coming_soon' || line.qty <= 0) {
        return new Response(JSON.stringify({ ok: false, error: `Invalid or unavailable item: ${line.sku}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      subtotalJmd += product.priceJmd * line.qty;
      itemSummaries.push(`${line.qty}x ${product.shortName} (${formatJmd(product.priceJmd * line.qty)})`);
    }

    const { feeJmd, isFreeUnlocked, option } = calculateLocalDeliveryFee(body.deliveryOptionId, subtotalJmd);
    const totalJmd = subtotalJmd + feeJmd;
    const orderId = generateOrderId();

    const physical = expandLinesToPhysicalJars(body.lines);
    const qty266ml = physical.get('HH-RAW-266') ?? 0;
    const qty500ml = physical.get('HH-RAW-500') ?? 0;

    // Reserve stock atomically for HandyPay online checkout (15-min hold)
    if (body.channel === 'HandyPay') {
      const reservation = await reserveStockForOrder(env, orderId, body.lines, 15);
      if (!reservation.ok) {
        return new Response(JSON.stringify({ ok: false, error: reservation.error }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const fulfillmentLabel = option?.fullLabel ?? option?.label ?? body.deliveryOptionId;
    const notesParts: string[] = [];
    if (body.deliveryAddress) notesParts.push(`Address: ${body.deliveryAddress}`);
    if (body.knutsfordStation) notesParts.push(`Station: ${body.knutsfordStation}`);
    if (body.isDiasporaGift && body.recipientName) {
      notesParts.push(`Recipient: ${body.recipientName} (${body.recipientPhone || 'N/A'})`);
    }

    // Persist order in Cloudflare D1 when bound
    if (env?.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO orders
            (order_id, channel, customer_name, phone, email, items_json, qty_266ml, qty_500ml,
             fulfillment_method, parish_or_pickup, knutsford_station, subtotal_jmd, delivery_fee_jmd,
             total_jmd, gift_note, hide_price, is_diaspora_gift, payment_status, fulfillment_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'New')`
        )
          .bind(
            orderId,
            body.channel,
            body.customerName.trim(),
            body.phone.trim(),
            body.email?.trim() || null,
            JSON.stringify(body.lines),
            qty266ml,
            qty500ml,
            option?.group || 'delivery',
            fulfillmentLabel,
            body.knutsfordStation?.trim() || null,
            subtotalJmd,
            feeJmd,
            totalJmd,
            body.giftNote?.trim() || null,
            body.hidePrice ? 1 : 0,
            body.isDiasporaGift ? 1 : 0
          )
          .run();
      } catch {
        // Non-fatal if D1 migration hasn't run locally yet
      }
    }

    // Sync order row to Google Sheet (non-blocking best-effort)
    await pushToGoogleSheet(env, {
      action: 'append_order',
      order: {
        orderId,
        timestamp: new Date().toISOString(),
        channel: body.channel,
        customerName: body.customerName.trim(),
        phone: body.phone.trim(),
        email: body.email?.trim() || '',
        itemsSummary: itemSummaries.join(' | '),
        qty266ml,
        qty500ml,
        fulfillmentMethod: option?.group || 'delivery',
        parishOrPickup: fulfillmentLabel,
        subtotalJmd,
        deliveryFeeJmd: feeJmd,
        totalJmd,
        giftNote: body.giftNote?.trim() || '',
        hidePrice: Boolean(body.hidePrice),
        paymentStatus: 'Pending',
        fulfillmentStatus: 'New',
        handyPayTxId: '',
        notes: notesParts.join(' · '),
      },
    });

    // Build pre-filled WhatsApp message (used directly for WhatsApp channel or as instant fallback)
    const waLines = [
      `*Hey Hon Order ${orderId}*`,
      ``,
      `*Buyer:* ${body.customerName.trim()}`,
      `*Phone:* ${body.phone.trim()}`,
      body.email ? `*Email:* ${body.email.trim()}` : '',
      body.isDiasporaGift && body.recipientName
        ? `*Jamaica Recipient:* ${body.recipientName} (${body.recipientPhone || ''})`
        : '',
      `*Fulfillment:* ${fulfillmentLabel}`,
      body.knutsfordStation ? `*Knutsford Station:* ${body.knutsfordStation.trim()}` : '',
      body.deliveryAddress ? `*Address / Directions:* ${body.deliveryAddress.trim()}` : '',
      body.giftNote ? `*Handwritten Gift Note:* "${body.giftNote.trim()}"${body.hidePrice ? ' (Hide price on slip)' : ''}` : '',
      ``,
      `*Items:*`,
      ...itemSummaries.map((s) => `• ${s}`),
      ``,
      `*Subtotal:* ${formatJmd(subtotalJmd)}`,
      `*Delivery:* ${feeJmd === 0 ? (isFreeUnlocked ? 'FREE (Kingston JMD $6,000+ unlocked!)' : 'FREE Pickup') : formatJmd(feeJmd)}`,
      `*Total Due:* ${formatJmd(totalJmd)}`,
    ].filter(Boolean);

    const waPhone = env?.WHATSAPP_NUMBER || BRAND.contact.whatsappDigits;
    const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waLines.join('\n'))}`;

    if (body.channel === 'HandyPay') {
      const origin = env?.SITE_URL || url.origin;
      const session = await createHandyPayCheckout(env, {
        orderId,
        amountJmd: totalJmd,
        customerName: body.customerName.trim(),
        customerEmail: body.email?.trim(),
        customerPhone: body.phone.trim(),
        description: `Hey Hon Order ${orderId}: ${itemSummaries.join(', ')}`,
        successUrl: `${origin}/shop?order=${orderId}&status=paid`,
        cancelUrl: `${origin}/shop?order=${orderId}&status=cancelled`,
        metadata: {
          qty_266ml: String(qty266ml),
          qty_500ml: String(qty500ml),
        },
      });

      return new Response(
        JSON.stringify({
          ok: true,
          orderId,
          channel: 'HandyPay',
          paymentMode: session.mode,
          checkoutUrl: session.checkoutUrl,
          message: session.message,
          whatsappFallbackUrl: whatsappUrl,
          summary: { subtotalJmd, feeJmd, totalJmd, isFreeUnlocked },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        orderId,
        channel: 'WhatsApp',
        whatsappUrl,
        summary: { subtotalJmd, feeJmd, totalJmd, isFreeUnlocked },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : 'Checkout processing failed.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

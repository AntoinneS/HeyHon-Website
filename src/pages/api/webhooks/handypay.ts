import type { APIRoute } from 'astro';
import { verifyHandyPayWebhookSignature } from '@/lib/handypay';
import { commitOrderStockDeduction } from '@/lib/inventory';
import { pushToGoogleSheet } from '@/lib/sheets';

/**
 * HandyPay Webhook Receiver
 * Verifies HMAC-SHA256 signature, atomically finalizes inventory deduction in Cloudflare D1,
 * and updates your Hey Hon Command Center Google Sheet automatically.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  const rawBody = await request.text();
  const signature =
    request.headers.get('x-handypay-signature') ||
    request.headers.get('x-webhook-signature') ||
    request.headers.get('signature');

  const isValid = await verifyHandyPayWebhookSignature(rawBody, signature, env?.HANDYPAY_WEBHOOK_SECRET);
  if (!isValid) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid webhook signature' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload = JSON.parse(rawBody) as {
      event?: string;
      type?: string;
      data?: {
        id?: string;
        reference?: string;
        metadata?: { order_id?: string; qty_266ml?: string; qty_500ml?: string };
      };
    };

    const eventType = payload.event || payload.type || '';
    const orderId = payload.data?.metadata?.order_id || payload.data?.reference;
    const txId = payload.data?.id || '';

    if (
      orderId &&
      (eventType === 'payment.success' ||
        eventType === 'payment.succeeded' ||
        eventType === 'checkout.session.completed')
    ) {
      await commitOrderStockDeduction(env, orderId, txId);

      const qty266ml = Number(payload.data?.metadata?.qty_266ml || 0);
      const qty500ml = Number(payload.data?.metadata?.qty_500ml || 0);

      await pushToGoogleSheet(env, {
        action: 'decrement_stock',
        orderId,
        qty266ml,
        qty500ml,
        handyPayTxId: txId,
      });
    }

    return new Response(JSON.stringify({ ok: true, received: eventType }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : 'Malformed payload' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

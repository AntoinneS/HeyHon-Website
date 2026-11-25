import type { CloudflareEnv } from '@/env';

/**
 * Payment Adapter Interface: starts with HandyPay Jamaica (unregistered sole-trader friendly,
 * $0/mo, REST API + signed HMAC webhooks). Designed so WiPay, LynkBiz, or Fygaro can be
 * swapped in later without touching storefront UI.
 */
export interface CheckoutSessionRequest {
  orderId: string;
  amountJmd: number;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResponse {
  mode: 'live' | 'test' | 'unconfigured';
  checkoutUrl?: string;
  providerRef?: string;
  message?: string;
}

export async function createHandyPayCheckout(
  env: CloudflareEnv | undefined,
  req: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  const apiKey = env?.HANDYPAY_API_KEY;
  const apiBase = env?.HANDYPAY_API_BASE || 'https://api.handypay.me/api/v1';

  if (!apiKey) {
    return {
      mode: 'unconfigured',
      message:
        'Your order details are ready! Online card checkout is being finalized; tap below to confirm and complete your order right now on WhatsApp.',
    };
  }

  const isTest = apiKey.startsWith('hp_test_');

  const response = await fetch(`${apiBase}/checkout/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(req.amountJmd * 100), // minor units (cents)
      currency: 'JMD',
      reference: req.orderId,
      description: req.description,
      customer: {
        name: req.customerName,
        email: req.customerEmail || undefined,
        phone: req.customerPhone,
      },
      success_url: req.successUrl,
      cancel_url: req.cancelUrl,
      metadata: {
        order_id: req.orderId,
        ...(req.metadata ?? {}),
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`HandyPay checkout creation failed (${response.status}): ${errText}`);
  }

  const data = (await response.json()) as {
    id?: string;
    url?: string;
    checkout_url?: string;
    data?: { id?: string; url?: string; checkout_url?: string };
  };

  const checkoutUrl = data.checkout_url || data.url || data.data?.checkout_url || data.data?.url;
  const providerRef = data.id || data.data?.id;

  return {
    mode: isTest ? 'test' : 'live',
    checkoutUrl,
    providerRef,
  };
}

/**
 * Verifies HMAC-SHA256 webhook signature from HandyPay using Web Crypto (Cloudflare Workers native).
 */
export async function verifyHandyPayWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string | undefined
): Promise<boolean> {
  if (!secret || !signatureHeader) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
  const computedHex = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const cleanedHeader = signatureHeader.replace(/^sha256=/i, '').trim().toLowerCase();
  if (computedHex.length !== cleanedHeader.length) return false;

  // Constant-time comparison
  let diff = 0;
  for (let i = 0; i < computedHex.length; i++) {
    diff |= computedHex.charCodeAt(i) ^ cleanedHeader.charCodeAt(i);
  }
  return diff === 0;
}

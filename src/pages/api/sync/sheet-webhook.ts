import type { APIRoute } from 'astro';
import { syncManualStockFromSheet } from '@/lib/inventory';

/**
 * Google Sheets -> Cloudflare D1 Manual Sync Endpoint
 * Called by your Google Sheet Apps Script onEdit trigger (or Sync button) whenever you edit
 * Stock_Available on your phone after a WhatsApp, Instagram, or in-person sale.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  const authHeader = request.headers.get('x-heyhon-secret') || '';

  if (env?.SHEET_SYNC_SHARED_SECRET && authHeader !== env.SHEET_SYNC_SHARED_SECRET) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = (await request.json()) as {
      items?: { sku: string; stockAvailable: number; statusOverride?: string; activeBatchId?: string }[];
    };

    if (!Array.isArray(body.items) || !body.items.length) {
      return new Response(JSON.stringify({ ok: false, error: 'No inventory items provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updated = await syncManualStockFromSheet(env, body.items);
    return new Response(JSON.stringify({ ok: true, updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : 'Sync failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

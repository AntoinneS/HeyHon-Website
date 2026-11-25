import type { CloudflareEnv } from '@/env';

export type SheetSyncEvent =
  | {
      action: 'append_order';
      order: {
        orderId: string;
        timestamp: string;
        channel: string;
        customerName: string;
        phone: string;
        email: string;
        itemsSummary: string;
        qty266ml: number;
        qty500ml: number;
        fulfillmentMethod: string;
        parishOrPickup: string;
        subtotalJmd: number;
        deliveryFeeJmd: number;
        totalJmd: number;
        giftNote: string;
        hidePrice: boolean;
        paymentStatus: string;
        fulfillmentStatus: string;
        handyPayTxId: string;
        notes: string;
      };
    }
  | {
      action: 'decrement_stock';
      orderId: string;
      qty266ml: number;
      qty500ml: number;
      handyPayTxId?: string;
    }
  | {
      action: 'append_wholesale';
      lead: Record<string, string | number>;
    }
  | {
      action: 'append_intl_or_waitlist';
      entry: Record<string, string | number>;
    };

/**
 * Pushes structured events from Cloudflare Workers to the Hey Hon Command Center Google Sheet
 * via the companion Google Apps Script Web App (`google-apps-script/HeyHonSheetSync.gs`).
 */
export async function pushToGoogleSheet(
  env: CloudflareEnv | undefined,
  event: SheetSyncEvent
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const url = env?.GOOGLE_APPS_SCRIPT_SYNC_URL;
  if (!url) {
    return { ok: false, skipped: true, error: 'GOOGLE_APPS_SCRIPT_SYNC_URL not configured' };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env?.SHEET_SYNC_SHARED_SECRET ? { 'X-HeyHon-Secret': env.SHEET_SYNC_SHARED_SECRET } : {}),
      },
      body: JSON.stringify({
        secret: env?.SHEET_SYNC_SHARED_SECRET || '',
        ...event,
      }),
    });
    return { ok: res.ok };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Sheet sync failed' };
  }
}

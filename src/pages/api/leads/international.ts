import type { APIRoute } from 'astro';
import { pushToGoogleSheet } from '@/lib/sheets';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime?.env;
    const body = (await request.json()) as {
      entryType: 'Intl_Quote' | 'GiftBox_Waitlist' | 'Restock_Alert' | 'Newsletter';
      name?: string;
      email: string;
      phoneWhatsapp?: string;
      country?: string;
      stateProvince?: string;
      postalCode?: string;
      qty266ml?: number;
      qty500ml?: number;
      estWeightKg?: number;
      estCarrierBandUsd?: string;
      notes?: string;
    };

    if (!body.email?.trim()) {
      return new Response(JSON.stringify({ ok: false, error: 'Please enter a valid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prefix = body.entryType === 'Intl_Quote' ? 'INT' : body.entryType === 'GiftBox_Waitlist' ? 'GBX' : 'SUB';
    const refId = `${prefix}-${Date.now().toString(36).toUpperCase().slice(-6)}`;

    if (env?.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO intl_quotes_waitlist
            (ref_id, entry_type, name, email, phone_whatsapp, country, state_province, postal_code,
             qty_266ml, qty_500ml, est_weight_kg, est_carrier_band_usd, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            refId,
            body.entryType || 'Intl_Quote',
            body.name?.trim() || null,
            body.email.trim(),
            body.phoneWhatsapp?.trim() || null,
            body.country || null,
            body.stateProvince?.trim() || null,
            body.postalCode?.trim() || null,
            body.qty266ml ?? 0,
            body.qty500ml ?? 0,
            body.estWeightKg ?? 0,
            body.estCarrierBandUsd || null,
            body.notes?.trim() || null
          )
          .run();
      } catch {
        // Non-fatal in local preview
      }
    }

    await pushToGoogleSheet(env, {
      action: 'append_intl_or_waitlist',
      entry: {
        refId,
        timestamp: new Date().toISOString(),
        entryType: body.entryType || 'Intl_Quote',
        name: body.name?.trim() || '',
        email: body.email.trim(),
        phoneWhatsapp: body.phoneWhatsapp?.trim() || '',
        country: body.country || '',
        stateProvince: body.stateProvince?.trim() || '',
        postalCode: body.postalCode?.trim() || '',
        qty266ml: body.qty266ml ?? 0,
        qty500ml: body.qty500ml ?? 0,
        estWeightKg: body.estWeightKg ?? 0,
        estCarrierBandUsd: body.estCarrierBandUsd || '',
        status: 'New',
        notes: body.notes?.trim() || '',
      },
    });

    return new Response(JSON.stringify({ ok: true, refId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : 'Unable to save request.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

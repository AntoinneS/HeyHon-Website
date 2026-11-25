import type { APIRoute } from 'astro';
import { pushToGoogleSheet } from '@/lib/sheets';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime?.env;
    const body = (await request.json()) as {
      businessOrName: string;
      category: string;
      email: string;
      phone?: string;
      preferredSize: string;
      estQuantity: number;
      customLabeling?: string;
      targetDate?: string;
      notes?: string;
    };

    if (!body.businessOrName?.trim() || !body.email?.trim() || !body.estQuantity || body.estQuantity < 10) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Please include your name or business, email, and at least 10 jars.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const qty = Math.max(10, Math.floor(Number(body.estQuantity)));
    const volumeTier = qty >= 50 ? 'Tier 3 (50+ Jars)' : qty >= 25 ? 'Tier 2 (25–49 Jars)' : 'Tier 1 (10–24 Jars)';
    const leadId = `WS-${Date.now().toString(36).toUpperCase().slice(-6)}`;

    if (env?.DB) {
      try {
        await env.DB.prepare(
          `INSERT INTO wholesale_leads
            (lead_id, business_or_name, category, email, phone, preferred_size, est_quantity, volume_tier, custom_labeling, target_date, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            leadId,
            body.businessOrName.trim(),
            body.category || 'Retail / Boutique',
            body.email.trim(),
            body.phone?.trim() || null,
            body.preferredSize || '266ml',
            qty,
            volumeTier,
            body.customLabeling || 'Standard Hey Hon Label',
            body.targetDate || null,
            body.notes?.trim() || null
          )
          .run();
      } catch {
        // Non-fatal in local preview
      }
    }

    await pushToGoogleSheet(env, {
      action: 'append_wholesale',
      lead: {
        leadId,
        timestamp: new Date().toISOString(),
        businessOrName: body.businessOrName.trim(),
        category: body.category || 'Retail / Boutique',
        email: body.email.trim(),
        phone: body.phone?.trim() || '',
        preferredSize: body.preferredSize || '266ml',
        estQuantity: qty,
        volumeTier,
        customLabeling: body.customLabeling || 'Standard Hey Hon Label',
        targetDate: body.targetDate || '',
        status: 'New',
        notes: body.notes?.trim() || '',
      },
    });

    return new Response(JSON.stringify({ ok: true, leadId, volumeTier }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : 'Unable to submit wholesale inquiry.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

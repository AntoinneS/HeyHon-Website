import type { APIRoute } from 'astro';
import { getLiveInventory } from '@/lib/inventory';

export const GET: APIRoute = async ({ locals }) => {
  const env = locals.runtime?.env;
  const inventory = await getLiveInventory(env);

  return new Response(
    JSON.stringify({
      ok: true,
      syncedAt: new Date().toISOString(),
      items: inventory,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
};

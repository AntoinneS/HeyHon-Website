import { PRODUCTS, type ProductItem } from '@/data/products';
import type { CloudflareEnv } from '@/env';

export interface LiveStockRecord {
  sku: string;
  productName: string;
  type: 'single' | 'bundle' | 'gift_box';
  componentSku: string | null;
  componentQty: number;
  priceJmd: number;
  packedWeightKg: number;
  stockAvailable: number;
  stockReserved: number;
  effectiveAvailable: number;
  lowStockThreshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'coming_soon';
  activeBatchId: string;
  waitlistEnabled: boolean;
  updatedAt: string;
}

// Local dev fallback store when D1 is not bound
const memoryStock = new Map<string, { stockAvailable: number; stockReserved: number; statusOverride: string }>();

function initMemoryStock() {
  if (memoryStock.size > 0) return;
  for (const p of PRODUCTS) {
    memoryStock.set(p.sku, {
      stockAvailable: p.defaultStock,
      stockReserved: 0,
      statusOverride: p.statusOverride,
    });
  }
}

function computeStatus(
  effectiveAvailable: number,
  lowThreshold: number,
  override: string
): LiveStockRecord['status'] {
  if (override === 'coming_soon') return 'coming_soon';
  if (override === 'out_of_stock') return 'out_of_stock';
  if (override === 'in_stock') return 'in_stock';
  if (override === 'low_stock') return 'low_stock';
  if (effectiveAvailable <= 0) return 'out_of_stock';
  if (effectiveAvailable <= lowThreshold) return 'low_stock';
  return 'in_stock';
}

export async function releaseExpiredReservations(db?: D1Database): Promise<void> {
  if (!db) return;
  try {
    const expired = await db
      .prepare(`SELECT id, sku, qty FROM stock_reservations WHERE status = 'held' AND datetime(expires_at) <= datetime('now')`)
      .all<{ id: string; sku: string; qty: number }>();

    if (!expired.results?.length) return;

    for (const row of expired.results) {
      await db.batch([
        db.prepare(`UPDATE stock_reservations SET status = 'expired' WHERE id = ? AND status = 'held'`).bind(row.id),
        db
          .prepare(
            `UPDATE inventory SET stock_reserved = MAX(0, stock_reserved - ?), updated_at = datetime('now') WHERE sku = ?`
          )
          .bind(row.qty, row.sku),
      ]);
    }
  } catch {
    // Table may not be migrated yet in local dev
  }
}

export async function getLiveInventory(env?: CloudflareEnv): Promise<LiveStockRecord[]> {
  const db = env?.DB;
  const rowsBySku = new Map<
    string,
    { stockAvailable: number; stockReserved: number; statusOverride: string; activeBatchId: string; updatedAt: string }
  >();

  if (db) {
    try {
      await releaseExpiredReservations(db);
      const res = await db
        .prepare(
          `SELECT sku, stock_available, stock_reserved, status_override, active_batch_id, updated_at FROM inventory`
        )
        .all<{
          sku: string;
          stock_available: number;
          stock_reserved: number;
          status_override: string;
          active_batch_id: string;
          updated_at: string;
        }>();

      for (const r of res.results || []) {
        rowsBySku.set(r.sku, {
          stockAvailable: r.stock_available,
          stockReserved: r.stock_reserved,
          statusOverride: r.status_override,
          activeBatchId: r.active_batch_id,
          updatedAt: r.updated_at,
        });
      }
    } catch {
      // Fallback cleanly to memory/defaults if D1 is uninitialized
    }
  }

  if (rowsBySku.size === 0) {
    initMemoryStock();
    for (const [sku, val] of memoryStock.entries()) {
      rowsBySku.set(sku, {
        ...val,
        activeBatchId: 'BATCH-2026-NOV',
        updatedAt: new Date().toISOString(),
      });
    }
  }

  // Compute effective stock: bundles dynamically derive from their underlying jar SKU
  return PRODUCTS.map((p: ProductItem) => {
    const raw = rowsBySku.get(p.sku) ?? {
      stockAvailable: p.defaultStock,
      stockReserved: 0,
      statusOverride: p.statusOverride,
      activeBatchId: 'BATCH-2026-NOV',
      updatedAt: new Date().toISOString(),
    };

    let effectiveAvailable = Math.max(0, raw.stockAvailable - raw.stockReserved);

    if (p.type === 'bundle' && p.componentSku) {
      const comp = rowsBySku.get(p.componentSku);
      if (comp) {
        const compFree = Math.max(0, comp.stockAvailable - comp.stockReserved);
        effectiveAvailable = Math.floor(compFree / p.componentQty);
      }
    }

    const status = computeStatus(effectiveAvailable, p.lowStockThreshold, raw.statusOverride);

    return {
      sku: p.sku,
      productName: p.name,
      type: p.type,
      componentSku: p.componentSku ?? null,
      componentQty: p.componentQty,
      priceJmd: p.priceJmd,
      packedWeightKg: p.packedWeightKg,
      stockAvailable: p.type === 'bundle' ? effectiveAvailable : raw.stockAvailable,
      stockReserved: p.type === 'bundle' ? 0 : raw.stockReserved,
      effectiveAvailable,
      lowStockThreshold: p.lowStockThreshold,
      status,
      activeBatchId: raw.activeBatchId,
      waitlistEnabled: p.waitlistEnabled || status === 'out_of_stock' || status === 'coming_soon',
      updatedAt: raw.updatedAt,
    };
  });
}

export interface CartLine {
  sku: string;
  qty: number;
}

/**
 * Expands bundles into their underlying single-jar SKUs so atomic holds and deductions
 * always track real physical jars (266ml and 500ml).
 */
export function expandLinesToPhysicalJars(lines: CartLine[]): Map<string, number> {
  const totals = new Map<string, number>();
  for (const line of lines) {
    const product = PRODUCTS.find((p) => p.sku === line.sku);
    if (!product || line.qty <= 0) continue;
    const targetSku = product.type === 'bundle' && product.componentSku ? product.componentSku : product.sku;
    const physicalQty = line.qty * (product.type === 'bundle' ? product.componentQty : 1);
    totals.set(targetSku, (totals.get(targetSku) ?? 0) + physicalQty);
  }
  return totals;
}

export async function reserveStockForOrder(
  env: CloudflareEnv | undefined,
  orderId: string,
  lines: CartLine[],
  holdMinutes = 15
): Promise<{ ok: boolean; error?: string }> {
  const physicalMap = expandLinesToPhysicalJars(lines);
  const db = env?.DB;

  if (!db) {
    initMemoryStock();
    for (const [sku, qty] of physicalMap.entries()) {
      const cur = memoryStock.get(sku);
      if (!cur || cur.stockAvailable - cur.stockReserved < qty) {
        return { ok: false, error: `Insufficient stock for ${sku}` };
      }
    }
    for (const [sku, qty] of physicalMap.entries()) {
      const cur = memoryStock.get(sku)!;
      cur.stockReserved += qty;
    }
    return { ok: true };
  }

  await releaseExpiredReservations(db);

  // Verify availability first
  for (const [sku, qty] of physicalMap.entries()) {
    const row = await db
      .prepare(`SELECT stock_available, stock_reserved, status_override FROM inventory WHERE sku = ?`)
      .bind(sku)
      .first<{ stock_available: number; stock_reserved: number; status_override: string }>();

    if (!row || row.status_override === 'out_of_stock' || row.status_override === 'coming_soon') {
      return { ok: false, error: `${sku} is currently unavailable.` };
    }
    if (row.stock_available - row.stock_reserved < qty) {
      return {
        ok: false,
        error: `Only ${Math.max(0, row.stock_available - row.stock_reserved)} jar(s) remaining for ${sku}.`,
      };
    }
  }

  const expiresAt = new Date(Date.now() + holdMinutes * 60_000).toISOString();
  const statements: D1PreparedStatement[] = [];
  for (const [sku, qty] of physicalMap.entries()) {
    const resId = `RES-${orderId}-${sku}`;
    statements.push(
      db
        .prepare(
          `INSERT INTO stock_reservations (id, order_id, sku, qty, status, expires_at) VALUES (?, ?, ?, ?, 'held', ?)`
        )
        .bind(resId, orderId, sku, qty, expiresAt),
      db
        .prepare(
          `UPDATE inventory SET stock_reserved = stock_reserved + ?, updated_at = datetime('now') WHERE sku = ? AND (stock_available - stock_reserved) >= ?`
        )
        .bind(qty, sku, qty)
    );
  }

  await db.batch(statements);
  return { ok: true };
}

export async function commitOrderStockDeduction(
  env: CloudflareEnv | undefined,
  orderId: string,
  handyPayTxId?: string
): Promise<boolean> {
  const db = env?.DB;
  if (!db) return true;

  const held = await db
    .prepare(`SELECT id, sku, qty FROM stock_reservations WHERE order_id = ? AND status = 'held'`)
    .bind(orderId)
    .all<{ id: string; sku: string; qty: number }>();

  const stmts: D1PreparedStatement[] = [];
  for (const row of held.results || []) {
    stmts.push(
      db.prepare(`UPDATE stock_reservations SET status = 'committed' WHERE id = ?`).bind(row.id),
      db
        .prepare(
          `UPDATE inventory
           SET stock_available = MAX(0, stock_available - ?),
               stock_reserved = MAX(0, stock_reserved - ?),
               updated_at = datetime('now')
           WHERE sku = ?`
        )
        .bind(row.qty, row.qty, row.sku)
    );
  }

  stmts.push(
    db
      .prepare(
        `UPDATE orders
         SET payment_status = 'Paid',
             handypay_tx_id = COALESCE(?, handypay_tx_id),
             updated_at = datetime('now')
         WHERE order_id = ?`
      )
      .bind(handyPayTxId ?? null, orderId)
  );

  await db.batch(stmts);
  return true;
}

export async function syncManualStockFromSheet(
  env: CloudflareEnv | undefined,
  updates: { sku: string; stockAvailable: number; statusOverride?: string; activeBatchId?: string }[]
): Promise<number> {
  const db = env?.DB;
  let updatedCount = 0;

  if (!db) {
    initMemoryStock();
    for (const u of updates) {
      const cur = memoryStock.get(u.sku);
      if (cur) {
        cur.stockAvailable = Math.max(0, Math.floor(u.stockAvailable));
        if (u.statusOverride) cur.statusOverride = u.statusOverride;
        updatedCount++;
      }
    }
    return updatedCount;
  }

  const stmts: D1PreparedStatement[] = [];
  for (const u of updates) {
    stmts.push(
      db
        .prepare(
          `UPDATE inventory
           SET stock_available = ?,
               status_override = COALESCE(?, status_override),
               active_batch_id = COALESCE(?, active_batch_id),
               updated_at = datetime('now')
           WHERE sku = ?`
        )
        .bind(
          Math.max(0, Math.floor(u.stockAvailable)),
          u.statusOverride ?? null,
          u.activeBatchId ?? null,
          u.sku
        )
    );
    updatedCount++;
  }

  if (stmts.length) await db.batch(stmts);
  return updatedCount;
}

-- Hey Hon Jamaica: Cloudflare D1 Real-Time Inventory, Orders & Leads Schema

CREATE TABLE IF NOT EXISTS inventory (
  sku TEXT PRIMARY KEY,
  product_name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'single', -- single | bundle | gift_box
  component_sku TEXT,
  component_qty INTEGER NOT NULL DEFAULT 1,
  price_jmd INTEGER NOT NULL,
  packed_weight_kg REAL NOT NULL DEFAULT 0.55,
  stock_available INTEGER NOT NULL DEFAULT 0,
  stock_reserved INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  status_override TEXT NOT NULL DEFAULT 'auto', -- auto | in_stock | low_stock | out_of_stock | coming_soon
  active_batch_id TEXT NOT NULL DEFAULT 'BATCH-2026-NOV',
  waitlist_enabled INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS stock_reservations (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  qty INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'held', -- held | committed | released | expired
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  channel TEXT NOT NULL, -- HandyPay | WhatsApp | Instagram | In-Person | Wholesale
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  items_json TEXT NOT NULL,
  qty_266ml INTEGER NOT NULL DEFAULT 0,
  qty_500ml INTEGER NOT NULL DEFAULT 0,
  fulfillment_method TEXT NOT NULL,
  parish_or_pickup TEXT NOT NULL,
  knutsford_station TEXT,
  subtotal_jmd INTEGER NOT NULL,
  delivery_fee_jmd INTEGER NOT NULL DEFAULT 0,
  total_jmd INTEGER NOT NULL,
  gift_note TEXT,
  hide_price INTEGER NOT NULL DEFAULT 0,
  is_diaspora_gift INTEGER NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'Pending', -- Pending | Paid | Refunded | Cancelled
  fulfillment_status TEXT NOT NULL DEFAULT 'New', -- New | Packed | Dispatched | Ready_Pickup | Delivered | Cancelled
  handypay_tx_id TEXT,
  synced_to_sheet INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS wholesale_leads (
  lead_id TEXT PRIMARY KEY,
  business_or_name TEXT NOT NULL,
  category TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_size TEXT NOT NULL,
  est_quantity INTEGER NOT NULL,
  volume_tier TEXT NOT NULL,
  custom_labeling TEXT,
  target_date TEXT,
  notes TEXT,
  synced_to_sheet INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS intl_quotes_waitlist (
  ref_id TEXT PRIMARY KEY,
  entry_type TEXT NOT NULL, -- Intl_Quote | GiftBox_Waitlist | Restock_Alert | Newsletter
  name TEXT,
  email TEXT NOT NULL,
  phone_whatsapp TEXT,
  country TEXT,
  state_province TEXT,
  postal_code TEXT,
  qty_266ml INTEGER DEFAULT 0,
  qty_500ml INTEGER DEFAULT 0,
  est_weight_kg REAL DEFAULT 0,
  est_carrier_band_usd TEXT,
  notes TEXT,
  synced_to_sheet INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed initial SKUs matching the Hey Hon Command Center Google Sheet
INSERT OR IGNORE INTO inventory
  (sku, product_name, type, component_sku, component_qty, price_jmd, packed_weight_kg, stock_available, stock_reserved, low_stock_threshold, status_override, active_batch_id, waitlist_enabled)
VALUES
  ('HH-RAW-266', 'Raw St. Mary Wildflower Honey: 266ml Glass Jar', 'single', NULL, 1, 2200, 0.55, 25, 0, 5, 'auto', 'BATCH-2026-NOV', 0),
  ('HH-RAW-500', 'Raw St. Mary Wildflower Honey: 500ml Glass Jar', 'single', NULL, 1, 3200, 0.95, 25, 0, 5, 'auto', 'BATCH-2026-NOV', 0),
  ('HH-BUNDLE-KGN-500', 'Free Kingston Delivery Duo (2x 500ml)', 'bundle', 'HH-RAW-500', 2, 6400, 1.90, 12, 0, 3, 'auto', 'BATCH-2026-NOV', 0),
  ('HH-BUNDLE-KGN-266', 'Free Kingston Delivery Trio (3x 266ml)', 'bundle', 'HH-RAW-266', 3, 6600, 1.65, 8, 0, 3, 'auto', 'BATCH-2026-NOV', 0),
  ('HH-GIFT-BOX', 'Hey Hon Signature Gift Box', 'gift_box', NULL, 1, 0, 1.25, 0, 0, 0, 'coming_soon', 'BATCH-2026-NOV', 1);

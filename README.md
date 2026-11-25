# Hey Hon Jamaica — Astro + Cloudflare Workers + D1 + Google Sheets

Modern, futuristic, edge-rendered rebuild of **heyhonjamaica.com**.

## Stack (\$0/Month Free-Tier Architecture)
- **Framework:** Astro 5 (`output: 'server'`) + React 19 Islands + Tailwind CSS v4
- **Edge Runtime & Hosting:** Cloudflare Workers (`wrangler.jsonc`)
- **Live Inventory & Order Ledger:** Cloudflare D1 (`migrations/0001_init.sql`) with 15-minute atomic stock reservation during checkout
- **Mobile Command Center:** Two-way sync with **Hey Hon Command Center** Google Sheet (`1kVxhtemSDtAVdAZj9w3npNVIenHG2uCHB_8FSwTYMPQ`) via `google-apps-script/HeyHonSheetSync.gs`
- **Payments:** HandyPay Jamaica REST API + HMAC-SHA256 webhooks (`src/lib/handypay.ts`) + Express WhatsApp fallback

## Local Development
```bash
npm install --legacy-peer-deps
npm run dev
```

## Production Setup on Cloudflare
1. **Create D1 Database:**
   ```bash
   npx wrangler d1 create heyhon-db
   ```
   Copy the returned `database_id` into `wrangler.jsonc`, then run:
   ```bash
   npm run db:migrate:remote
   ```
2. **Add Secrets (Never Commit Keys):**
   ```bash
   npx wrangler secret put HANDYPAY_API_KEY
   npx wrangler secret put HANDYPAY_WEBHOOK_SECRET
   npx wrangler secret put GOOGLE_APPS_SCRIPT_SYNC_URL
   npx wrangler secret put SHEET_SYNC_SHARED_SECRET
   ```
3. **Wire Two-Way Google Sheets Sync:**
   - Open your **Hey Hon Command Center** Google Sheet → *Extensions → Apps Script*
   - Paste `google-apps-script/HeyHonSheetSync.gs`
   - Deploy as a Web App and add an installable `On edit` trigger on `onInventoryEdit`
4. **Build & Deploy:**
   ```bash
   npm run cf:deploy
   ```

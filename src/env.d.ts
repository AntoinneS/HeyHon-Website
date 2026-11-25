/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

export interface CloudflareEnv {
  DB?: D1Database;
  ASSETS?: Fetcher;
  SITE_URL?: string;
  GOOGLE_SHEET_ID?: string;
  WHATSAPP_NUMBER?: string;
  FREE_KINGSTON_THRESHOLD_JMD?: string;
  WHOLESALE_MOQ?: string;
  HANDYPAY_API_KEY?: string;
  HANDYPAY_WEBHOOK_SECRET?: string;
  HANDYPAY_API_BASE?: string;
  GOOGLE_APPS_SCRIPT_SYNC_URL?: string;
  SHEET_SYNC_SHARED_SECRET?: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<CloudflareEnv>;

declare global {
  namespace App {
    interface Locals extends Runtime {}
  }
}

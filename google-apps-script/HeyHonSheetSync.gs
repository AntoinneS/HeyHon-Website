/**
 * Hey Hon Command Center: Two-Way Google Sheets <-> Cloudflare Workers Sync
 * Sheet ID: 1kVxhtemSDtAVdAZj9w3npNVIenHG2uCHB_8FSwTYMPQ
 *
 * SETUP (2 minutes):
 * 1. Open your "Hey Hon Command Center" Google Sheet -> Extensions -> Apps Script.
 * 2. Paste this entire file and save.
 * 3. Set Script Properties (Project Settings -> Script Properties):
 *    - CLOUDFLARE_SYNC_URL = https://heyhonjamaica.com/api/sync/sheet-webhook
 *    - SHARED_SECRET       = <same secret you set in Cloudflare as SHEET_SYNC_SHARED_SECRET>
 *    - ADMIN_NOTIFY_EMAIL  = <optional override email for order/lead alerts; defaults to heyhonjamaica@gmail.com>
 * 4. Deploy -> New deployment -> Web app (Execute as: Me, Who has access: Anyone).
 *    Copy the Web App URL and save it in Cloudflare as GOOGLE_APPS_SCRIPT_SYNC_URL.
 * 5. Triggers -> Add Trigger -> `onInventoryEdit` -> Event source: From spreadsheet -> Event type: On edit.
 */

function getConfig_() {
  const props = PropertiesService.getScriptProperties();
  return {
    syncUrl: props.getProperty('CLOUDFLARE_SYNC_URL') || 'https://heyhonjamaica.com/api/sync/sheet-webhook',
    secret: props.getProperty('SHARED_SECRET') || '',
    notifyEmail: props.getProperty('ADMIN_NOTIFY_EMAIL') || 'heyhonjamaica@gmail.com',
  };
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Hey Hon')
    .addItem('Sync Inventory to Website Now', 'manualSyncInventory')
    .addToUi();
}

function manualSyncInventory() {
  const result = pushInventoryToCloudflare_();
  SpreadsheetApp.getActiveSpreadsheet().toast(
    result.ok ? 'Website inventory synced!' : 'Sync failed: ' + result.message,
    'Hey Hon Sync',
    5
  );
}

function notifyAdmin_(subject, body, replyTo) {
  try {
    const cfg = getConfig_();
    if (!cfg.notifyEmail) return;
    const fullSubject = subject.indexOf('[Hey Hon') === 0 ? subject : '[Hey Hon] ' + subject;
    const mailOpts = {
      to: cfg.notifyEmail,
      subject: fullSubject,
      body: body,
    };
    if (replyTo && String(replyTo).trim()) {
      mailOpts.replyTo = String(replyTo).trim();
    }
    MailApp.sendEmail(mailOpts);
  } catch (err) {
    // Non-fatal if MailApp quota or permission is not enabled yet
  }
}

/**
 * Website -> Google Sheet (Called by Cloudflare Workers on checkout, HandyPay webhook, wholesale, waitlist)
 */
function doPost(e) {
  const cfg = getConfig_();
  const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');

  if (cfg.secret && payload.secret !== cfg.secret) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Unauthorized' })).setMimeType(
      ContentService.MimeType.JSON
    );
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (payload.action === 'append_order' && payload.order) {
    const o = payload.order;
    const sheet = ss.getSheetByName('Orders');
    sheet.appendRow([
      o.orderId, o.timestamp, o.channel, o.customerName, o.phone, o.email,
      o.itemsSummary, o.qty266ml, o.qty500ml, o.fulfillmentMethod, o.parishOrPickup,
      o.subtotalJmd, o.deliveryFeeJmd, o.totalJmd, o.giftNote, o.hidePrice ? 'TRUE' : 'FALSE',
      o.paymentStatus, o.fulfillmentStatus, o.handyPayTxId, o.notes,
    ]);
    notifyAdmin_(
      'New ' + o.channel + ' Order ' + o.orderId + ' (JMD $' + o.totalJmd + ')',
      'Customer: ' + o.customerName + ' (' + o.phone + ')\n' +
        'Items: ' + o.itemsSummary + '\n' +
        'Delivery/Pickup: ' + o.parishOrPickup + '\n' +
        'Total: JMD $' + o.totalJmd + '\n' +
        'Gift Note: ' + (o.giftNote || 'None') + '\n' +
        'Notes: ' + (o.notes || 'None')
    );
  }

  if (payload.action === 'decrement_stock') {
    const inv = ss.getSheetByName('Inventory');
    const values = inv.getDataRange().getValues();
    for (let r = 1; r < values.length; r++) {
      const sku = values[r][0];
      const current = Number(values[r][7] || 0);
      if (sku === 'HH-RAW-266' && payload.qty266ml > 0) {
        inv.getRange(r + 1, 8).setValue(Math.max(0, current - Number(payload.qty266ml)));
      }
      if (sku === 'HH-RAW-500' && payload.qty500ml > 0) {
        inv.getRange(r + 1, 8).setValue(Math.max(0, current - Number(payload.qty500ml)));
      }
    }

    // Mark matching Order row Paid
    if (payload.orderId) {
      const orders = ss.getSheetByName('Orders');
      const oVals = orders.getDataRange().getValues();
      for (let r = 1; r < oVals.length; r++) {
        if (oVals[r][0] === payload.orderId) {
          orders.getRange(r + 1, 17).setValue('Paid');
          if (payload.handyPayTxId) orders.getRange(r + 1, 19).setValue(payload.handyPayTxId);
          break;
        }
      }
    }
  }

  if (payload.action === 'append_wholesale' && payload.lead) {
    const l = payload.lead;
    const sheet = ss.getSheetByName('Wholesale_Leads');
    sheet.appendRow([
      l.leadId, l.timestamp, l.businessOrName, l.category, l.email, l.phone,
      l.preferredSize, l.estQuantity, l.volumeTier, l.customLabeling, l.targetDate, l.status, l.notes,
    ]);
    notifyAdmin_(
      '[Hey Hon | Wholesale Catalog] New Inquiry ' + l.leadId + ' (' + l.estQuantity + ' jars)',
      'Business/Event: ' + l.businessOrName + ' (' + l.category + ')\n' +
        'Contact: ' + l.email + ' | ' + (l.phone || 'No phone') + '\n' +
        'Order: ' + l.estQuantity + 'x ' + l.preferredSize + ' (' + l.volumeTier + ')\n' +
        'Labeling: ' + l.customLabeling + '\n' +
        'Target Date: ' + (l.targetDate || 'Flexible') + '\n' +
        'Notes: ' + (l.notes || 'None'),
      l.email
    );
  }

  if (payload.action === 'append_intl_or_waitlist' && payload.entry) {
    const q = payload.entry;
    const sheet = ss.getSheetByName('Intl_Quotes_Waitlist');
    sheet.appendRow([
      q.refId, q.timestamp, q.entryType, q.name, q.email, q.phoneWhatsapp,
      q.country, q.stateProvince, q.postalCode, q.qty266ml, q.qty500ml,
      q.estWeightKg, q.estCarrierBandUsd, q.status, q.notes,
    ]);
    const categoryPrefix =
      q.entryType === 'Newsletter'
        ? '[Hey Hon | Join List]'
        : q.entryType === 'GiftBox_Waitlist'
          ? '[Hey Hon | Gift Box Waitlist]'
          : q.entryType === 'Intl_Quote'
            ? '[Hey Hon | International Quote]'
            : '[Hey Hon | ' + (q.entryType || 'Lead') + ']';
    notifyAdmin_(
      categoryPrefix + ' New Submission (' + q.refId + ')',
      'Name: ' + (q.name || 'Subscriber') + '\n' +
        'Email: ' + q.email + ' | Phone: ' + (q.phoneWhatsapp || 'N/A') + '\n' +
        'Destination: ' + (q.country || 'N/A') + ' ' + (q.stateProvince || '') + ' ' + (q.postalCode || '') + '\n' +
        'Jars: ' + q.qty266ml + 'x 266ml, ' + q.qty500ml + 'x 500ml\n' +
        'Estimate: ' + (q.estCarrierBandUsd || 'N/A') + '\n' +
        'Notes: ' + (q.notes || 'None'),
      q.email
    );
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Google Sheet -> Website (Installable onEdit Trigger)
 * Whenever you update Stock_Available or Status_Override on the Inventory tab from your phone,
 * this pushes the live count straight to Cloudflare D1 in <1 second.
 */
function onInventoryEdit(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  if (sheet.getName() !== 'Inventory') return;
  pushInventoryToCloudflare_();
}

function pushInventoryToCloudflare_() {
  const cfg = getConfig_();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const inv = ss.getSheetByName('Inventory');
  const rows = inv.getDataRange().getValues();
  const items = [];

  for (let r = 1; r < rows.length; r++) {
    const sku = String(rows[r][0] || '').trim();
    if (!sku) continue;
    items.push({
      sku: sku,
      stockAvailable: Number(rows[r][7] || 0),
      statusOverride: String(rows[r][9] || 'auto').trim(),
      activeBatchId: String(rows[r][10] || 'BATCH-2026-NOV').trim(),
    });
  }

  const res = UrlFetchApp.fetch(cfg.syncUrl, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-heyhon-secret': cfg.secret },
    payload: JSON.stringify({ items: items }),
    muteHttpExceptions: true,
  });

  const code = res.getResponseCode();
  return { ok: code >= 200 && code < 300, message: 'HTTP ' + code };
}

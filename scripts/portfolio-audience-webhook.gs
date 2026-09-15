/**
 * Optional upgrade from FormSubmit: stores all visits in Google Sheets + returns stats to your private page.
 *
 * 1. script.google.com → New project → paste this file → Save
 * 2. Run once: setupSheet (authorize)
 * 3. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone
 * 4. Copy deployment URL into src/environments/environment.ts → audience.webhookUrl
 */
const SHEET_NAME = 'PortfolioAudience';
const STATS_KEY = 'sivaraaj-stats'; // match environment.audience.statsAccessKey

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['at', 'type', 'name', 'email', 'city', 'country', 'referrer', 'device', 'raw']);
  }
}

function doGet(e) {
  const action = e.parameter.action;
  const key = e.parameter.key;
  if (action !== 'stats' || key !== STATS_KEY) {
    return jsonResponse({ error: 'unauthorized' }, 403);
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return jsonResponse({ events: [] });
  const rows = sheet.getDataRange().getValues();
  const events = [];
  for (let i = 1; i < rows.length; i++) {
    try {
      events.push(JSON.parse(rows[i][8]));
    } catch (err) {
      /* skip bad row */
    }
  }
  return jsonResponse({ events: events.reverse() });
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || '{}');
  if (body.action !== 'log' || body.key !== STATS_KEY) {
    return jsonResponse({ error: 'unauthorized' }, 403);
  }
  const event = body.event || {};
  setupSheet();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  sheet.appendRow([
    event.at || new Date().toISOString(),
    event.type || '',
    event.name || '',
    event.email || '',
    event.city || '',
    event.country || '',
    event.referrer || '',
    event.device || '',
    JSON.stringify(event),
  ]);
  if (body.notify) {
    const subject =
      event.type === 'identified_contact'
        ? 'Portfolio contact: ' + (event.name || 'Someone')
        : 'Portfolio visit: ' + [event.city, event.country].filter(String).join(', ') || 'new viewer';
    const text = JSON.stringify(event, null, 2);
    MailApp.sendEmail(body.notify, subject, text);
  }
  return jsonResponse({ ok: true });
}

function jsonResponse(obj, code) {
  const out = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
  if (code) {
    // Apps Script doGet/doPost cannot set HTTP status; include error in body for clients
    if (code === 403) obj.error = 'unauthorized';
  }
  return out;
}

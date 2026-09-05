/**
 * Chapter Room waitlist → Google Sheet.
 *
 * Paste this into an Apps Script project attached to the sheet (Extensions → Apps Script),
 * deploy it as a web app (Execute as: Me, Who has access: Anyone), and set the resulting
 * /exec URL as WAITLIST_WEBHOOK_URL on the site.
 *
 * Each signup POSTed by app/api/waitlist/route.ts becomes one row:
 *   Submitted at | Email | Phone | Chapter | Source
 *
 * Duplicate emails are still appended, with "duplicate" in the Source column, so you can
 * see repeat interest without losing the original row.
 */

var SHEET_NAME = "Waitlist";
var HEADERS = ["Submitted at", "Email", "Phone", "Chapter", "Source"];

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return respond({ ok: false, error: "Send JSON." });
  }

  var email = String(data.email || "").trim().toLowerCase();
  var phone = String(data.phone || "").trim();
  var chapter = String(data.chapter || "").trim();
  if (!email || !chapter) {
    return respond({ ok: false, error: "email and chapter are required." });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet();
    var source = isDuplicate(sheet, email) ? "duplicate" : "site";
    var submittedAt = data.submittedAt ? new Date(data.submittedAt) : new Date();
    sheet.appendRow([submittedAt, email, "'" + phone, chapter, source]);
  } finally {
    lock.releaseLock();
  }

  return respond({ ok: true });
}

// A GET in the browser confirms the deployment is live.
function doGet() {
  return respond({ ok: true, service: "chapter-room-waitlist" });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange("A:A").setNumberFormat("yyyy-mm-dd hh:mm");
    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 260);
    sheet.setColumnWidth(3, 150);
    sheet.setColumnWidth(4, 320);
  }
  // Rewrite the header row whenever the columns change, so an existing tab keeps up.
  var header = sheet.getRange(1, 1, 1, HEADERS.length);
  if (header.getValues()[0].join("|") !== HEADERS.join("|")) {
    header.setValues([HEADERS]);
  }
  header.setFontWeight("bold");
  return sheet;
}

function isDuplicate(sheet, email) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  var emails = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  for (var i = 0; i < emails.length; i++) {
    if (String(emails[i][0]).toLowerCase() === email) return true;
  }
  return false;
}

function respond(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

import fs from "node:fs/promises";
import { parse } from "csv-parse/sync";
import { Document } from "@langchain/core/documents";

type Row = Record<string, string>;

let cachedDocs: Document[] | null = null;

function toDoc(r: Row): Document {
  const id =
    r["NCTId"] ||
    r["NCT Number"] ||
    r["NCT Id"] ||
    r["id"] ||
    crypto.randomUUID();

  // Adjust these field names to match your CSV columns from ClinicalTrials.gov
  const title = r["BriefTitle"] || r["OfficialTitle"] || r["Title"];
  const conditions = r["Condition"] || r["Conditions"];
  const interventions = r["InterventionName"] || r["Interventions"];
  const phase = r["Phase"];
  const status = r["OverallStatus"] || r["Status"];
  const sponsor = r["LeadSponsorName"] || r["Sponsor"];
  const locations =
    r["LocationCity"] ||
    r["LocationCountry"] ||
    r["Locations"] ||
    r["LocationFacility"];

  let pageContent = [
    ["Title", title],
    ["Conditions", conditions],
    ["Interventions", interventions],
    ["Phase", phase],
    ["Status", status],
    ["Sponsor", sponsor],
    ["Locations", locations],
  ]
    .filter(([, v]) => v && String(v).trim().length > 0)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  // Avoid falling back to stringifying the entire row, which can be massive
  if (!pageContent || pageContent.trim().length === 0) {
    pageContent = `NCTId: ${id}`;
  }

  return new Document({
    pageContent,
    metadata: { NCTId: id, raw: r },
  });
}

export async function loadCsvAsDocs(path: string): Promise<Document[]> {
  if (cachedDocs) {
    return cachedDocs;
  }
  const raw = await fs.readFile(path, "utf8");
  const rows = parse(raw, { columns: true, skip_empty_lines: true }) as Row[];
  return rows.map(toDoc);
}

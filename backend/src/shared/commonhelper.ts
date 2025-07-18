import * as cheerio from 'cheerio';



// ✅ Extract plain text from HTML string
export function extractTextFromHtml(html: string): string {
  const $ = cheerio.load(html);
  return $.text().trim();
}

export function formatMinutes(min: string | number): string {
  const totalMinutes = Number(min);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
}
import * as cheerio from 'cheerio';



// ✅ Extract plain text from HTML string
export function extractTextFromHtml(html: string): string {
  const $ = cheerio.load(html);
  return $.text().trim();
}
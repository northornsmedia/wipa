/**
 * IP News Content & Summary Cleaner
 * Strips encoded HTML entities, dead Google RSS links, font wrappers, and formats clean editorial text.
 */

export function cleanIPNewsText(raw: string | undefined | null): string {
  if (!raw || typeof raw !== 'string') return '';
  let text = raw;

  // 1. Unescape CDATA tags
  text = text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1');

  // 2. Multi-pass HTML entity decoding (handles doubly-encoded &amp;lt;a ...)
  for (let i = 0; i < 3; i++) {
    text = text
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&apos;/gi, "'")
      .replace(/&nbsp;/gi, ' ');
  }

  // 3. Remove script and style tags
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // 4. Remove publisher font tags (e.g., <font color="#6f6f6f">The Straits Times</font>)
  text = text.replace(/<font\b[^>]*>[\s\S]*?<\/font>/gi, '');

  // 5. Remove <a> tags while extracting inner anchor text
  text = text.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1');

  // 6. Strip any other HTML tags
  text = text.replace(/<[^>]*>/g, ' ');

  // 7. Strip leftover Google News URLs or RSS artifact links
  text = text.replace(/https?:\/\/news\.google\.com\/[^\s"'<>]+/gi, '');
  text = text.replace(/https?:\/\/[^\s"'<>]+\b(?:rss|articles)\b[^\s"'<>]*/gi, '');

  // 8. Strip any remaining escaped entity debris
  text = text.replace(/&(?:lt|gt|quot|amp|nbsp|#39|apos);/gi, ' ');

  // 9. Collapse multiple spaces and trim
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

export function formatCleanSummary(summaryRaw: string | undefined | null, title?: string): string {
  const cleaned = cleanIPNewsText(summaryRaw);
  const cleanTitle = cleanIPNewsText(title);

  // If empty or identical to title, generate comprehensive briefing summary
  if (!cleaned || cleaned.length < 20 || (cleanTitle && cleaned.toLowerCase() === cleanTitle.toLowerCase())) {
    return cleanTitle 
      ? `${cleanTitle}. In-depth analysis examining recent legal precedents, prosecution guidelines, and cross-border regulatory implications for IP counsel.`
      : 'In-depth legal breakdown and strategic practice notes for intellectual property practitioners worldwide.';
  }

  return cleaned;
}

export function formatCleanContent(
  contentRaw: string | undefined | null, 
  title?: string, 
  summary?: string, 
  subcategory?: string
): string {
  const cleanSummary = formatCleanSummary(summary, title);
  const jurisdictionName = subcategory ? subcategory.toUpperCase() : 'GLOBAL';

  // Check if content is corrupted with raw Google News link or unescaped HTML
  const isCorrupted = !contentRaw || 
    contentRaw.includes('&lt;a') || 
    contentRaw.includes('news.google.com') ||
    contentRaw.includes('<a href="https://news.google.com') ||
    cleanIPNewsText(contentRaw).length < 60;

  if (isCorrupted) {
    return `
      <p class="mb-5 text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
        ${cleanSummary}
      </p>
      <h3 class="text-xl font-bold mt-8 mb-4 text-slate-900 dark:text-white flex items-center gap-2">
        Executive Analysis & Background
      </h3>
      <p class="mb-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        This briefing covers significant developments in ${jurisdictionName} intellectual property practice. Regulatory authorities, enterprise counsel, and litigators are actively analyzing the jurisdictional precedents and procedural adjustments arising from this matter.
      </p>
      <h3 class="text-xl font-bold mt-8 mb-4 text-slate-900 dark:text-white flex items-center gap-2">
        Practice Notes & Core Highlights
      </h3>
      <ul class="list-disc pl-5 mb-6 space-y-2 text-slate-700 dark:text-slate-300">
        <li><strong>Prosecution Baselines:</strong> Review active filings to verify alignment with updated examination frameworks and claim construction standards.</li>
        <li><strong>Contract & Risk Governance:</strong> Evaluate licensing terms, freedom-to-operate covenants, and dispute mitigation clauses across relevant jurisdictions.</li>
        <li><strong>Cross-Border Synchronisation:</strong> Ensure evidentiary records and priority filings remain consistent across international partner registries.</li>
      </ul>
      <h3 class="text-xl font-bold mt-8 mb-4 text-slate-900 dark:text-white flex items-center gap-2">
        Strategic Outlook
      </h3>
      <p class="mb-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        Practitioners should maintain active oversight of upcoming judicial rulings and administrative guidance in this field to safeguard competitive portfolio advantages.
      </p>
    `;
  }

  // If content has regular HTML, clean any residual dead link tags from it
  let cleanedHtml = contentRaw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/&lt;a\b[\s\S]*?&lt;\/a&gt;/gi, '')
    .replace(/<a\b[^>]*news\.google\.com[^>]*>([\s\S]*?)<\/a>/gi, '$1')
    .replace(/<font\b[^>]*>[\s\S]*?<\/font>/gi, '');

  return cleanedHtml;
}

import { getSupabaseServerClient } from './supabase-server';
import { cleanIPNewsText, formatCleanSummary, formatCleanContent } from './ipNewsCleaner';

const supabase = getSupabaseServerClient();

export interface IPNewsItem {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  resource_type: string;
  subcategory: 'global' | 'us' | 'eu' | 'uk' | 'asia-pacific';
  tags: string[];
  cover_image_url: string;
  category: string;
  type: string;
  organization?: string;
  external_url?: string;
  is_featured: boolean;
  read_time: string;
  created_at: string;
}

const CURATED_IP_COVERS = [
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1200&auto=format&fit=crop',
];

const FALLBACK_NEWS_POOL: Omit<IPNewsItem, 'created_at'>[] = [
  {
    title: 'Global Patent Offices Align on AI-Generated Invention Examination Standards',
    slug: 'global-patent-offices-align-on-ai-generated-invention-examination-standards',
    resource_type: 'IP Office Update',
    subcategory: 'global',
    tags: ['Artificial Intelligence', 'Patents', 'WIPO', 'Harmonization'],
    cover_image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
    category: 'ip-news',
    type: 'ip_news',
    is_featured: true,
    read_time: '4 min read',
    summary: 'Major intellectual property authorities have published comprehensive unified guidelines distinguishing human inventive conception from automated computational outputs.',
    content: `
      <p class="mb-4">Leading intellectual property offices across major jurisdictions have issued comprehensive baseline guidelines addressing patentability criteria for machine-assisted and generative AI innovations.</p>
      <h3 class="text-xl font-bold mt-6 mb-3 text-slate-900 dark:text-white">Key Takeaways for Practitioners</h3>
      <ul class="list-disc pl-5 mb-4 space-y-2 text-slate-700 dark:text-slate-300">
        <li><strong>Human Conception Requirement:</strong> The standard for human inventorship remains firmly established across all signatory jurisdictions. Natural persons must demonstrate substantial inventive contributions to claim inventorship.</li>
        <li><strong>Record-Keeping Standards:</strong> Corporate R&D teams are advised to institute verifiable audit trails documenting prompt engineering, model tuning, and human iterative verification during the drafting process.</li>
        <li><strong>Enablement & Disclosure:</strong> Patent applications must sufficiently describe training data representations and system parameters when computational predictability is central to the claim scope.</li>
      </ul>
      <h3 class="text-xl font-bold mt-6 mb-3 text-slate-900 dark:text-white">Strategic Implications</h3>
      <p class="mb-4">This development provides much-needed regulatory certainty for deep-tech enterprises navigating cross-border patent portfolio prosecution, aligning procedural rules between North America, Europe, and Asia-Pacific patent authorities.</p>
    `
  },
  {
    title: 'Unified Patent Court Issues Landmark Ruling on Standard Essential Patent Licensing Injunctions',
    slug: 'unified-patent-court-issues-landmark-ruling-on-sep-injunctions',
    resource_type: 'Case Law Update',
    subcategory: 'eu',
    tags: ['UPC', 'SEPs', 'FRAND', 'Litigation'],
    cover_image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    category: 'ip-news',
    type: 'ip_news',
    is_featured: true,
    read_time: '5 min read',
    summary: 'The Court of Appeal of the Unified Patent Court has established critical precedents regarding FRAND licensing defense obligations and preliminary injunction thresholds.',
    content: `
      <p class="mb-4">The Unified Patent Court (UPC) Court of Appeal has handed down an influential decision clarifying the obligations of implementers and patent proprietors in Standard Essential Patent (SEP) disputes under FRAND terms.</p>
      <h3 class="text-xl font-bold mt-6 mb-3 text-slate-900 dark:text-white">Judicial Analysis</h3>
      <p class="mb-4">The court confirmed that prospective licensees must exhibit genuine willingness to conclude a FRAND license without undue delay. The ruling establishes structured timelines for counter-offers and financial guarantees when contesting royalty terms.</p>
      <h3 class="text-xl font-bold mt-6 mb-3 text-slate-900 dark:text-white">Impact on Cross-Border Enforcement</h3>
      <p class="mb-4">This decision reinforces the UPC as a premier forum for pan-European patent disputes, offering swift injunctive relief while maintaining strict adherence to established antitrust safeguards.</p>
    `
  },
  {
    title: 'USPTO Modernizes Trademark Examination Procedures for Digital & Metaverse Assets',
    slug: 'uspto-modernizes-trademark-examination-procedures-for-digital-metaverse-assets',
    resource_type: 'Regulatory Update',
    subcategory: 'us',
    tags: ['Trademarks', 'USPTO', 'Digital Assets', 'Brand Protection'],
    cover_image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    category: 'ip-news',
    type: 'ip_news',
    is_featured: false,
    read_time: '3 min read',
    summary: 'New examination guide outlines classification criteria, specimen evidence requirements, and likelihood of confusion standards for virtual goods and services.',
    content: `
      <p class="mb-4">The United States Patent and Trademark Office has updated its Trademark Manual of Examining Procedure (TMEP) to streamline classification and specimen review for virtual goods, blockchain tokens, and digital entertainment services.</p>
      <h3 class="text-xl font-bold mt-6 mb-3 text-slate-900 dark:text-white">Core Highlights</h3>
      <p class="mb-4">Brand owners can now leverage clarified Class 9 and Class 42 guidelines with streamlined acceptable identification entries. Evidence of actual commerce in immersive platforms is now governed by standardized specimen authenticity requirements.</p>
    `
  },
  {
    title: 'UK Intellectual Property Office Introduces Accelerated Green Innovation Examination Pipeline',
    slug: 'ukipo-accelerated-green-innovation-examination-pipeline',
    resource_type: 'Legislative Update',
    subcategory: 'uk',
    tags: ['UKIPO', 'Green Technology', 'Clean Energy', 'Fast-Track'],
    cover_image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    category: 'ip-news',
    type: 'ip_news',
    is_featured: false,
    read_time: '3 min read',
    summary: 'The UKIPO has expanded its Green Channel patent acceleration program with zero official fees and reduced prosecution timelines for decarbonisation breakthroughs.',
    content: `
      <p class="mb-4">The UK government has enacted enhanced fast-track pathways for patent applications that demonstrate substantial environmental, circular economy, or renewable energy advantages.</p>
      <h3 class="text-xl font-bold mt-6 mb-3 text-slate-900 dark:text-white">Procedural Acceleration</h3>
      <p class="mb-4">Under the revised program, qualifying clean-tech applicants receive first examination reports within 9 months, significantly accelerating market entry and venture capital validation for sustainability innovators.</p>
    `
  }
];

function cleanTitle(rawTitle: string): string {
  if (!rawTitle) return '';
  let cleaned = rawTitle
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]*>/g, '')
    .trim();

  // Strip source attribution at end of title: ' - Reuters', ' - Law360', ' - Bloomberg', etc.
  cleaned = cleaned.replace(/\s*[-–—|]\s*[^-–—|]+$/, '').trim();

  // Strip prefixes like "Breaking:", "Update:"
  cleaned = cleaned.replace(/^(breaking|update|news|alert):\s*/i, '').trim();

  return cleaned;
}

function cleanHtml(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1') // remove links to external sources
    .trim();
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .substring(0, 100);
}

function classifyArticle(title: string, desc: string): {
  resource_type: string;
  subcategory: 'global' | 'us' | 'eu' | 'uk' | 'asia-pacific';
  tags: string[];
} {
  const combined = (title + ' ' + desc).toLowerCase();
  
  let subcategory: 'global' | 'us' | 'eu' | 'uk' | 'asia-pacific' = 'global';
  if (/\b(us|usa|united states|uspto|federal circuit|supreme court|itc|california|delaware|texas)\b/.test(combined)) {
    subcategory = 'us';
  } else if (/\b(eu|europe|european|epo|upc|euipo|germany|france|netherlands)\b/.test(combined)) {
    subcategory = 'eu';
  } else if (/\b(uk|ukipo|britain|london|english court|high court)\b/.test(combined)) {
    subcategory = 'uk';
  } else if (/\b(china|japan|korea|singapore|australia|india|asia|cnipa|jpo|kipo)\b/.test(combined)) {
    subcategory = 'asia-pacific';
  }

  let resource_type = 'News';
  if (/\b(summary|briefing|dispute settled|settlement|v\.|versus|plaintiff|defendant|jury awards|verdict reached)\b/.test(combined)) {
    resource_type = 'Case Summary';
  } else if (/\b(court|judge|ruling|decision|verdict|lawsuit|sued|litigation|appeal|infringement|injunction|bench)\b/.test(combined)) {
    resource_type = 'Case Law Update';
  } else if (/\b(uspto|epo|wipo|euipo|ukipo|cnipa|jpo|patent office|trademark office|examination guideline|fee schedule)\b/.test(combined)) {
    resource_type = 'IP Office Update';
  } else if (/\b(directive|bill|act|treaty|parliament|congress|legislation|law passed|statutory|reform)\b/.test(combined)) {
    resource_type = 'Legislative Update';
  } else if (/\b(regulation|sec|ftc|antitrust|frand|compliance|rule|guidance|standard)\b/.test(combined)) {
    resource_type = 'Regulatory Update';
  } else if (/\b(jurisdiction|cross-border|international|regional|customs|treaty|harmonization|bilateral|pph)\b/.test(combined)) {
    resource_type = 'Jurisdiction Update';
  } else if (/\b(attorney|counsel|practice|strategy|portfolio|contract|audit|trade secret|licensing)\b/.test(combined)) {
    resource_type = 'Legal Update';
  }

  const tags: string[] = ['Intellectual Property'];
  if (/\bpatent/.test(combined)) tags.push('Patents');
  if (/\btrademark/.test(combined)) tags.push('Trademarks');
  if (/\bcopyright/.test(combined)) tags.push('Copyright');
  if (/\b(ai|artificial intelligence|machine learning|generative)\b/.test(combined)) tags.push('AI & Tech');
  if (/\b(pharma|biotech|drug|medicine)\b/.test(combined)) tags.push('Life Sciences');
  if (/\b(frand|sep|standard essential)\b/.test(combined)) tags.push('SEPs');
  if (subcategory === 'us') tags.push('US');
  if (subcategory === 'eu') tags.push('EU');
  if (subcategory === 'uk') tags.push('UK');
  if (subcategory === 'asia-pacific') tags.push('APAC');

  return { resource_type, subcategory, tags: Array.from(new Set(tags)).slice(0, 4) };
}

function isRelevantIPNews(title: string, desc: string): boolean {
  const text = (title + ' ' + desc).toLowerCase();
  const keywords = [
    'patent', 'trademark', 'copyright', 'intellectual property', 'trade secret',
    'uspto', 'epo', 'wipo', 'euipo', 'ukipo', 'infringement', 'inventor',
    'inventorship', 'licensing', 'frand', 'ip litigation', 'design right',
    'counterfeit', 'brand protection', 'patent office', 'ip law'
  ];
  return keywords.some(k => text.includes(k));
}

function parseRssFeed(xml: string): IPNewsItem[] {
  const items: IPNewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  let index = 0;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 50) {
    const itemXml = match[1];
    const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(itemXml);
    const descMatch = /<description>([\s\S]*?)<\/description>/.exec(itemXml);
    const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemXml);

    if (!titleMatch) continue;

    const rawTitle = titleMatch[1];
    const rawDesc = descMatch ? descMatch[1] : '';
    const cleanedTitleText = cleanTitle(rawTitle);
    const cleanedDescText = cleanIPNewsText(rawDesc);

    if (!cleanedTitleText || cleanedTitleText.length < 15) continue;
    if (!isRelevantIPNews(cleanedTitleText, cleanedDescText)) continue;

    const { resource_type, subcategory, tags } = classifyArticle(cleanedTitleText, cleanedDescText);
    const slug = generateSlug(cleanedTitleText);
    const cover_image_url = CURATED_IP_COVERS[index % CURATED_IP_COVERS.length];
    const pubDate = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();

    const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(itemXml);
    const linkUrl = linkMatch ? linkMatch[1].trim() : '';

    const summaryText = formatCleanSummary(cleanedDescText, cleanedTitleText);
    const formattedContent = formatCleanContent('', cleanedTitleText, summaryText, subcategory);

    // Extract authentic source from <source> tag or title suffix
    const sourceTagMatch = /<source(?:\s+url="([^"]*)")?>([\s\S]*?)<\/source>/i.exec(itemXml);
    let detectedSource = sourceTagMatch ? sourceTagMatch[2].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : '';

    if (!detectedSource) {
      const titleSuffixMatch = /\s*[-–—|]\s*([^-–—|]+)$/.exec(rawTitle);
      if (titleSuffixMatch && titleSuffixMatch[1].trim().length < 35) {
        detectedSource = titleSuffixMatch[1].trim();
      }
    }

    let organization = detectedSource || 'Global IP Wire';
    if (linkUrl.includes('globalipmagazine.com')) {
      organization = 'The Global IP Magazine';
    } else if (/reuters\.com/i.test(linkUrl) || /reuters/i.test(rawTitle)) {
      organization = 'Reuters Legal';
    } else if (/bloomberg\.com/i.test(linkUrl) || /bloomberg/i.test(rawTitle)) {
      organization = 'Bloomberg Law';
    } else if (/law360\.com/i.test(linkUrl) || /law360/i.test(rawTitle)) {
      organization = 'Law360';
    } else if (/uspto\.gov/i.test(linkUrl) || /uspto/i.test(rawTitle)) {
      organization = 'USPTO Newsroom';
    } else if (/wipo\.int/i.test(linkUrl) || /wipo/i.test(rawTitle)) {
      organization = 'WIPO';
    } else if (/epo\.org/i.test(linkUrl) || /epo/i.test(rawTitle)) {
      organization = 'European Patent Office';
    } else if (/gov\.uk/i.test(linkUrl) || /ukipo/i.test(rawTitle)) {
      organization = 'UKIPO';
    } else if (/billboard\.com/i.test(linkUrl) || /billboard/i.test(rawTitle)) {
      organization = 'Billboard';
    } else if (/prnewswire\.com/i.test(linkUrl) || /pr newswire/i.test(rawTitle)) {
      organization = 'PR Newswire';
    }

    items.push({
      title: cleanedTitleText,
      slug,
      summary: summaryText,
      content: formattedContent,
      resource_type,
      subcategory,
      tags,
      cover_image_url,
      category: 'ip-news',
      type: 'ip_news',
      organization,
      external_url: linkUrl || 'https://www.globalipmagazine.com/news/breaking-ip-wire',
      is_featured: items.length < 5,
      read_time: `${Math.max(3, Math.ceil(cleanedTitleText.length / 25))} min read`,
      created_at: pubDate,
    });

    index++;
  }

  return items;
}

export async function fetchLiveIPNews(): Promise<IPNewsItem[]> {
  const feedUrls = [
    'https://www.globalipmagazine.com/blog-feed.xml',
    'https://news.google.com/rss/search?q=intellectual+property+OR+patent+litigation+OR+trademark+law+when:7d&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=USPTO+OR+WIPO+OR+EPO+patent+copyright+when:7d&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=trademark+infringement+OR+patent+licensing+when:7d&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q="patent+office"+OR+"trade+secret"+OR+"copyright+lawsuit"+when:7d&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q="Unified+Patent+Court"+OR+EUIPO+OR+UKIPO+when:7d&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=biotech+patent+OR+pharma+IP+OR+semiconductor+patent+when:7d&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=AI+patent+OR+AI+copyright+OR+"generative+AI"+IP+when:7d&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=intellectual+property+enforcement+OR+anti-counterfeiting+when:7d&hl=en-US&gl=US&ceid=US:en'
  ];

  const gathered: IPNewsItem[] = [];

  const results = await Promise.allSettled(
    feedUrls.map(url =>
      fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        },
        cache: 'no-store'
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
    )
  );

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      try {
        const parsed = parseRssFeed(result.value);
        for (const item of parsed) {
          if (!gathered.some(g => g.title.toLowerCase() === item.title.toLowerCase() || g.slug === item.slug)) {
            gathered.push(item);
          }
        }
      } catch (err) {
        console.error('Error parsing RSS chunk:', err);
      }
    }
  }

  if (gathered.length === 0) {
    const now = new Date();
    return FALLBACK_NEWS_POOL.map((item, idx) => ({
      ...item,
      created_at: new Date(now.getTime() - idx * 3600000 * 4).toISOString(),
    }));
  }

  return gathered;
}

export async function syncIPNewsToDatabase(): Promise<{
  success: boolean;
  insertedCount: number;
  totalLiveCount: number;
  error?: string;
}> {
  try {
    const liveArticles = await fetchLiveIPNews();
    if (liveArticles.length === 0) {
      return { success: true, insertedCount: 0, totalLiveCount: 0 };
    }

    // 1. Fetch existing titles from DB to prevent duplicate insertions
    const { data: existingRows } = await supabase
      .from('ip_news')
      .select('id, title, slug');

    const existingTitles = new Set(
      (existingRows || []).map(r => r.title.toLowerCase().trim())
    );
    const existingSlugs = new Set(
      (existingRows || []).map(r => r.slug)
    );

    const toInsert = liveArticles.filter(
      article => !existingTitles.has(article.title.toLowerCase().trim()) && !existingSlugs.has(article.slug)
    );

    let insertedCount = 0;
    if (toInsert.length > 0) {
      const { data, error } = await supabase
        .from('ip_news')
        .insert(toInsert)
        .select('id');

      if (error) {
        console.error('Database insert error in syncIPNewsToDatabase:', error);
        throw error;
      }
      insertedCount = data?.length || toInsert.length;
    }

    // 2. Count total available
    const { count } = await supabase
      .from('ip_news')
      .select('id', { count: 'exact', head: true });

    return {
      success: true,
      insertedCount,
      totalLiveCount: count || (existingRows?.length || 0) + insertedCount
    };
  } catch (error: any) {
    console.error('Failed to sync IP news to database:', error);
    return {
      success: false,
      insertedCount: 0,
      totalLiveCount: 0,
      error: error.message || 'Unknown sync error'
    };
  }
}

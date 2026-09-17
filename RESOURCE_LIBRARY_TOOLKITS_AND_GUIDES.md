# WIPA Resource Library: Guides, Toolkits & Operational Playbooks
## Complete Scraper Engineering Brief, Data Requirements & Source Mapping Specification

**Document Version:** 2.5 (Developer Handoff Edition)  
**Target Audience:** Scraper Engineer, Data Pipeline Developer, Legal Editorial Team & Platform Leadership  
**Platform Surface:** Women’s IP World Alliance (WIPA) — `/platform/resources/guides-toolkits`  
**Target Detail Page:** `/platform/resources/guides-toolkits/[id]`  
**Target Storage & Database:** Supabase PostgreSQL (`resources` table) & Supabase Storage (`resources` bucket)  
**Purpose:** This document is the **official, self-contained specification brief for the developer / team building the automated scraper**. It details **exactly what must be scraped**, **where to scrape it from**, **how to format and sanitize the files**, and **every single field required** to make the WIPA Guides & Toolkits category page richly resourceful.

---

> ### 📢 INSTRUCTIONS FOR THE SCRAPER DEVELOPER
> You are tasked with creating a **full-fledged data scraper and ingestion pipeline** for the WIPA platform.
> - **DO NOT manually write one-off data.** Build an automated scraping and packaging pipeline that extracts public domain and open legal materials from the authoritative sources listed below.
> - **Deliverable:** Scrape and generate structured legal packs (Word `.docx`, Excel `.xlsx`, PDF guides, and `.zip` bundles), upload them to Supabase Storage, and insert standardized records into the Supabase `resources` table.
> - **Every single field listed in Section 1 is required.** If an external source lacks certain UI fields (like bulleted "Intended Use" or step-by-step "Instructions"), your pipeline must synthesize them using the AI enrichment guidelines in Section 4.

---

## SECTION 1: Mandatory Fields Required for Platform Resources

To make the `/platform/resources/guides-toolkits` directory page and the `/platform/resources/guides-toolkits/[id]` detail page fully resourceful, every scraped record inserted into the Supabase `resources` table **must contain all of the following fields**:

### Database & UI Field Specification (`resources` table in Supabase)

| Field Name | Type | UI Placement & Role | Exact Requirement & Real-World Example |
|---|---|---|---|
| `id` | `uuid` or `bigint` | Primary Key, route parameter (`[id]`) | Generated automatically by Supabase or sequential ID. |
| `title` | `text` | Main title on cards and detail page hero | Required. Must be authoritative, clear, and actionable.<br>*Example:* `"USPTO Section 101 / Alice Rejection Response Playbook"` |
| `slug` | `text` (unique) | SEO-friendly URL identifier | Required. Lowercase, hyphenated.<br>*Example:* `"uspto-section-101-alice-rejection-response-playbook"` |
| `category` | `text` | Global category routing filter | Required. Fixed to `'guides-toolkits'`. |
| `subcategory` | `text` | Directory taxonomy tab filter | Required. Must be exactly one of: `playbooks`, `toolkits`, `templates`, `guides`. |
| `resource_type` | `text` | UI Chip badge (top right of card / detail) | Required. Must be one of: `Toolkit`, `Playbook`, `Template`, `Checklist`, `PDF Guide`, `Workbook`, `FAQ`, `Glossary`. |
| `practice_area` / `topic` | `text` (via tags) | Header chip & search facet | Required.<br>*Examples:* `"Patent Prosecution"`, `"Trademark Enforcement"`, `"Trade Secrets"`, `"M&A Due Diligence"`. |
| `target_jurisdiction` | `text` (via tags/content) | Legal context banner on detail view | Required.<br>*Examples:* `"United States (USPTO / Federal)"`, `"European Union (EPO / UPC)"`, `"International (WIPO / PCT)"`. |
| `author_name` | `text` | Author credit on card footer & detail | Required. Individual practitioner or institutional body.<br>*Example:* `"David Sterling, Esq."` or `"WIPA Tech Group"`. |
| `author_title` | `text` | Author professional designation | Optional.<br>*Example:* `"Senior Patent Partner"` or `"Corporate Legal Operations Committee"`. |
| `organization` | `text` | Attributing firm or publishing entity | Required.<br>*Example:* `"Sterling IP"`, `"USPTO Examination Policy"`, or `"WIPA Editorial"`. |
| `summary` | `text` | 1–2 sentence executive overview on cards | Required. Max 250 characters. States the immediate practical benefit. |
| `content` | `text` (markdown) | Full background legal analysis & rationale | Required. Displayed on the detail page under "Resource Description". Explains statutes, precedents, and usage warnings. |
| `intended_use` | `jsonb` or markdown bullets | "Intended Use" card with green checks | Required. 3–5 concrete bullet points specifying real-world practitioner scenarios (e.g., M&A audits, responding to office actions). |
| `instructions` | `jsonb` or numbered steps | "How to Use This Toolkit" timeline | Required. Array of 3–6 step objects: `[{"step": 1, "title": "...", "desc": "..."}, ...]`. |
| `file_url` | `text` | Main "Download Toolkit" button trigger | Required. Direct public URL to the downloadable `.zip`, `.docx`, `.xlsx`, or `.pdf` in Supabase Storage. |
| `read_time` | `text` | Card metadata chip (format/size display) | Required.<br>*Examples:* `"ZIP Archive (14.2 MB)"`, `"34 Pages + Shells"`, `"Interactive Excel Model"`. |
| `cover_image_url` | `text` | Visual card thumbnail cover image | Required. High-resolution WebP/JPG graphic (e.g., `/resourceimg1.jpg`, `/resourceimg2.jpg`, `/resource3.jpg`). |
| `tags` | `text[]` | Full-text search and related tool recommendations | Required. 4–8 granular search tokens.<br>*Example:* `["USPTO", "Alice Rejection", "Section 101", "Software Patents"]`. |
| `is_featured` | `boolean` | Flags asset for the top "Editor's Selection" carousel | Set to `true` for flagship holdings, `false` for others. |
| `is_splash_sponsored` | `boolean` | Flags sponsored master suite banner | Set to `false` (or `true` if co-branded with LexisNexis). |
| `external_url` / `source_url`| `text` | Provenance tracking & legal verification | Required. The original public URL from which the material was harvested. |

---

## SECTION 2: The Master "Scrape This For That" Source-to-Deliverable Matrix

This is the developer's core roadmap. It tells you **which authoritative website to scrape**, **what specific materials to extract**, and **what final platform asset to build and package**.

```
                           THE SCRAPER SOURCE-TO-TARGET ENGINE
  ┌───────────────────────────────┬───────────────────────────────┐
  │ SOURCE AUTHORITY              │ TARGET WIPA RESOURCE CREATED  │
  ├───────────────────────────────┼───────────────────────────────┤
  │ 1. USPTO Examination Guidance │ Section 101 Alice Playbook    │
  │ 2. WIPO PCT Applicant's Guide │ PCT National Phase Calculator │
  │ 3. EPO Guidelines (Rule 56)   │ Problem-Solution & Oral Kit   │
  │ 4. Unified Patent Court (UPC) │ UPC Opt-Out Master Toolkit    │
  │ 5. SEC EDGAR Exhibit 10 MSAs  │ Enterprise SaaS Agreement Pack│
  │ 6. WIPO Madrid System Portals │ Madrid Protocol Filing Guide  │
  │ 7. NIST SP 800-171 & DTSA     │ Trade Secret Audit Matrix     │
  │ 8. Stanford OTL & AUTM Portals│ Master Tech Evaluation NDAs   │
  │ 9. Linux Foundation & SPDX    │ OSS License Compliance Matrix │
  │ 10. Copyright Office AI Portals│ Corporate GenAI Use Policy    │
  │ 11. CLOC & ACC Operations     │ Outside Counsel Billing Policy│
  │ 12. Federal Judicial Center   │ Litigation Hold & Rule 11 SOP │
  │ 13. FDA Orange & Purple Books │ Life Sciences FTO & Para IV   │
  └───────────────────────────────┴───────────────────────────────┘
```

### Detailed Scraper Source Specifications

#### 1. USPTO Patent Examination Policy
- **Where to Scrape:**  
  `https://www.uspto.gov/patents/laws-and-regulations/examination-guidance/subject-matter-eligibility`  
  `https://www.uspto.gov/patents/patent-basics/patent-process-overview/forms`
- **What to Extract:**
  - Subject Matter Eligibility Guidance (Step 1, Step 2A Prong 1/Prong 2, Step 2B).
  - Berkheimer and Vanda memo arguments for computer-implemented and AI claims.
  - Examiner Interview Request Form AIA/413 and interview preparation scripts.
- **Target Deliverables to Create:**
  1. `USPTO Section 101 / Alice Rejection Response Playbook` (`subcategory: 'playbooks'`, `resource_type: 'Playbook'`)
  2. `Patent Claim Drafting & Antecedent Basis QA Checklist` (`subcategory: 'guides'`, `resource_type: 'Checklist'`)
  3. `USPTO Examiner Interview Strategic Preparation Kit` (`subcategory: 'toolkits'`, `resource_type: 'Toolkit'`)

#### 2. WIPO (World Intellectual Property Organization) — PCT System
- **Where to Scrape:**  
  `https://www.wipo.int/pct/en/guide/index.html`  
  `https://www.wipo.int/pct/en/fees/`
- **What to Extract:**
  - National Phase Entry deadlines across 157 Contracting States (30-month vs 31-month limits).
  - Official fee structures, translation requirements, and power of attorney formalities per country.
- **Target Deliverables to Create:**
  1. `PCT National Phase Entry Global Roadmap & Cost Estimator` (`subcategory: 'toolkits'`, `resource_type: 'Workbook'`)
  2. `WIPO PCT Formality Examination & Priority Claim Audit Checklist` (`subcategory: 'guides'`, `resource_type: 'Checklist'`)

#### 3. EPO (European Patent Office) & Unified Patent Court (UPC)
- **Where to Scrape:**  
  `https://www.epo.org/en/legal/guidelines-epc`  
  `https://www.unified-patent-court.org/en/rules`
- **What to Extract:**
  - Part G, Chapter VII (Inventive Step & Problem-Solution Approach, Rule 56 EPC technical effect).
  - Rule 5 UPC Rules of Procedure regarding Opt-Out declarations, transitional periods, and withdrawal rules.
- **Target Deliverables to Create:**
  1. `EPO Problem-Solution Approach & Oral Proceedings Kit` (`subcategory: 'toolkits'`, `resource_type: 'Toolkit'`)
  2. `Unitary Patent (UP) & UPC Opt-Out Master Toolkit` (`subcategory: 'toolkits'`, `resource_type: 'Toolkit'`)

#### 4. SEC EDGAR Database (Public Exhibit 10 Material Contracts)
- **Where to Scrape:**  
  `https://www.sec.gov/edgar/searchedgar/companysearch`  
  (Filter by `Form 10-K`, `Form 10-Q`, and query `Exhibit 10` for "Intellectual Property License", "SaaS Agreement", "Joint Development Agreement")
- **What to Extract:**
  - Redline contracts: enterprise cloud software agreements, SLAs, patent cross-licenses, intellectual property assignment deeds.
  - De-identify and sanitize all private company names into standard placeholders (`[INSERT LICENSOR NAME]`, `[EFFECTIVE DATE]`).
- **Target Deliverables to Create:**
  1. `Enterprise Software-as-a-Service (SaaS) Master Agreement & SLA Pack` (`subcategory: 'templates'`, `resource_type: 'Template'`)
  2. `Technology Joint Development Agreement (JDA) Master Framework` (`subcategory: 'templates'`, `resource_type: 'Template'`)
  3. `Patent & Trademark Commercial Assignment Deed Pack` (`subcategory: 'templates'`, `resource_type: 'Template'`)

#### 5. Academic Tech Transfer Offices (Stanford OTL, MIT TLO, AUTM)
- **Where to Scrape:**  
  `https://otl.stanford.edu/industry/standard-agreements`  
  `https://tlo.mit.edu/industry-entrepreneurs/standard-agreements`  
  `https://autm.net/surveys-and-tools/agreements`
- **What to Extract:**
  - Standard Non-Disclosure Agreements (Mutual, Unilateral, Source Code Review, Clean-Team).
  - Material Transfer Agreements (MTA) and Patent Option Evaluation Agreements.
- **Target Deliverables to Create:**
  1. `Academic & Commercial Technology Evaluation NDA Master Suite` (`subcategory: 'templates'`, `resource_type: 'Template'`)
  2. `University Tech Transfer & Spin-Out Licensing Master Kit` (`subcategory: 'toolkits'`, `resource_type: 'Toolkit'`)

#### 6. NIST & Defend Trade Secrets Act (DTSA) Portals
- **Where to Scrape:**  
  `https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final`  
  `https://www.justice.gov/criminal/criminal-fraud/defend-trade-secrets-act-2016`
- **What to Extract:**
  - NIST SP 800-171 criteria for protecting Confidential Business Information.
  - DTSA "reasonable measures" compliance checklists, statutory immunity carve-out notices, and offboarding logs.
- **Target Deliverables to Create:**
  1. `Trade Secret Identification, Classification & Reasonable Measures Matrix` (`subcategory: 'toolkits'`, `resource_type: 'Workbook'`)
  2. `Departing Employee Trade Secret Protection & Remote Worker Offboarding SOP` (`subcategory: 'toolkits'`, `resource_type: 'Toolkit'`)

#### 7. Linux Foundation, SPDX & Open Source Initiative (OSI)
- **Where to Scrape:**  
  `https://spdx.dev/licenses/`  
  `https://opensource.org/licenses`
- **What to Extract:**
  - Open source license compatibility matrices (GPLv2/v3, Apache 2.0, MIT, AGPL, BSD, MPL).
  - Contributor License Agreements (Individual and Corporate CLA).
- **Target Deliverables to Create:**
  1. `Open Source Software (OSS) Compliance & License Compatibility Matrix` (`subcategory: 'toolkits'`, `resource_type: 'Workbook'`)
  2. `Corporate Open Source Contribution & Contributor License Agreement (CLA) Pack` (`subcategory: 'templates'`, `resource_type: 'Template'`)

#### 8. US Copyright Office & AI Governance Task Forces
- **Where to Scrape:**  
  `https://www.copyright.gov/ai/`  
  `https://www.nist.gov/artificial-intelligence`
- **What to Extract:**
  - Authorship and human inventorship criteria for AI-assisted works.
  - Enterprise employee acceptable use policies for LLMs (ChatGPT, Claude, GitHub Copilot).
- **Target Deliverables to Create:**
  1. `Corporate Generative AI Use Policy & Risk Governance Toolkit` (`subcategory: 'toolkits'`, `resource_type: 'Toolkit'`)
  2. `AI-Assisted Inventions & Authorship Clearance Procedural Guide` (`subcategory: 'playbooks'`, `resource_type: 'Playbook'`)

#### 9. Corporate Legal Operations Consortium (CLOC) & ABA Standards
- **Where to Scrape:**  
  `https://cloc.org`  
  `https://www.americanbar.org/groups/law_practice`
- **What to Extract:**
  - Outside counsel outside billing guidelines, fixed-fee prosecution rate cards, and annual firm scorecards.
- **Target Deliverables to Create:**
  1. `Corporate Outside Counsel Billing Guidelines & Fixed-Fee Scorecard` (`subcategory: 'templates'`, `resource_type: 'Template'`)
  2. `In-House Patent & Trademark Annual Budget Modeling Tool` (`subcategory: 'toolkits'`, `resource_type: 'Workbook'`)

#### 10. Federal Rules of Civil Procedure & Pre-Suit Discovery (Sedona Conference)
- **Where to Scrape:**  
  `https://thesedonaconference.org/publications`  
  `https://www.uscourts.gov/rules-policies/current-rules-practice-procedure/federal-rules-civil-procedure`
- **What to Extract:**
  - FRCP Rule 11 pre-suit patent investigation requirements.
  - Corporate litigation hold notices, electronic discovery preservation questionnaires, and custodian interviews.
- **Target Deliverables to Create:**
  1. `Litigation Hold Notice & Electronic Discovery Preservation Protocol` (`subcategory: 'templates'`, `resource_type: 'Template'`)
  2. `Pre-Suit Patent & Trademark Investigation Checklist (Rule 11 Compliant)` (`subcategory: 'guides'`, `resource_type: 'Checklist'`)

#### 11. FDA Orange Book & Hatch-Waxman Statutory Guidelines
- **Where to Scrape:**  
  `https://www.accessdata.fda.gov/scripts/cder/ob/`  
  `https://www.fda.gov/drugs/development-approval-process-drugs`
- **What to Extract:**
  - Hatch-Waxman 180-day exclusivity rules, Paragraph IV certification notice letter templates, and BPCIA patent dance milestone checklists.
- **Target Deliverables to Create:**
  1. `Life Sciences Freedom-to-Operate (FTO) & Hatch-Waxman Paragraph IV SOP` (`subcategory: 'playbooks'`, `resource_type: 'Playbook'`)
  2. `Biologics BPCIA Patent Dance Statutory Milestone Checklist` (`subcategory: 'guides'`, `resource_type: 'Checklist'`)

---

## SECTION 3: Data Cleansing, Redlining & File Packaging Requirements

The scraper developer must not simply dump raw HTML. The scraped legal instruments must be converted into **professional, downloadable digital assets**:

### 1. The Redlining / Variable Placeholder Syntax
When converting contracts or forms from public records (e.g., SEC EDGAR filings), the scraper must systematically strip out specific party names, physical addresses, and confidential figures, replacing them with clear, standard uppercase bracket placeholders:
- `[PARTY A / LICENSOR NAME]`
- `[PARTY B / LICENSEE NAME]`
- `[STATE OF INCORPORATION]`
- `[EFFECTIVE DATE]`
- `[ROYALTY RATE %]`
- `[MAXIMUM AGGREGATE LIABILITY CAP $]`
- `[INSERT GOVERNING LAW & JURISDICTION]`

### 2. Multi-File ZIP Package Packaging
For holdings categorized as `resource_type: 'Toolkit'`, the scraper must package assets into a clean `.zip` archive containing:
1. `00_README_AND_VERSION_NOTICE.txt` — Explaining package contents, version, and jurisdiction.
2. `01_Procedural_Master_Guide.pdf` — The explanatory methodology handbook.
3. `02_Customizable_Working_Templates.docx` — Redline-ready templates with bracketed syntax.
4. `03_Calculation_Model_Or_Checklist.xlsx` — Pre-programmed calculation formulas or audit rubric.

### 3. File Asset Storage in Supabase
- Packages must be uploaded to the Supabase Storage bucket: `'resources'`.
- Upload path pattern: `guides-toolkits/${slug}/${slug}.zip` (or `.docx` / `.xlsx` / `.pdf`).
- Generate the public URL via `supabase.storage.from('resources').getPublicUrl(path)`.
- Store that URL directly in the `file_url` column of the `resources` table.

---

## SECTION 4: AI Synthesis Pipeline for Generating Missing UI Fields

Because raw legal source documents rarely come with pre-written user-friendly summaries or step-by-step instructions, the scraper developer must integrate an LLM enrichment step (e.g., Google Gemini or Anthropic Claude API) using the following exact schema:

### Enrichment Prompt Schema

```text
SYSTEM INSTRUCTION:
You are the Lead Legal Data Architect for the Women's IP World Alliance (WIPA).
Transform the provided raw legal source text into publication-ready metadata matching the platform schema.

INPUT TEXT:
"""
[RAW SCRAPED LEGAL TEXT]
"""

REQUIRED JSON OUTPUT FORMAT:
{
  "summary": "1-2 sentence executive overview (max 220 characters) explaining the immediate operational utility.",
  "intended_use": [
    "Concrete scenario 1 (e.g., 'Preparing for an M&A portfolio due diligence audit.')",
    "Concrete scenario 2 (e.g., 'Drafting responses to USPTO final rejections under 35 U.S.C. 101.')",
    "Concrete scenario 3 (e.g., 'Benchmarking outside counsel billing guidelines against CLOC standards.')"
  ],
  "instructions": [
    {
      "step": 1,
      "title": "Review the Procedural Master Manual",
      "desc": "Read the accompanying methodology guide to confirm applicable statutory deadlines."
    },
    {
      "step": 2,
      "title": "Customize Working Bracketed Placeholders",
      "desc": "Open the editable Word or Excel files and replace bracketed identifiers with matter specifics."
    },
    {
      "step": 3,
      "title": "Execute Quality & Compliance Verification",
      "desc": "Run the included verification checklist to confirm antecedent basis and statutory conformity."
    },
    {
      "step": 4,
      "title": "Archive in Docketing System",
      "desc": "File the finalized instrument in your primary docketing or document management repository."
    }
  ]
}
```

---

## SECTION 5: Supabase Ingestion & Idempotent Upsert Logic

To prevent duplicate records and ensure that running the scraper repeatedly does not corrupt the platform database, the developer must implement **idempotent upserting keyed on `slug`**:

```javascript
// Example Node.js Idempotent Ingestion Pattern for the Scraper Developer:
async function ingestScrapedHolding(supabase, resourceData) {
  // 1. Check if record with matching slug already exists
  const { data: existing } = await supabase
    .from('resources')
    .select('id')
    .eq('slug', resourceData.slug)
    .maybeSingle();

  if (existing && existing.id) {
    // 2. Update existing holding
    const { error } = await supabase
      .from('resources')
      .update({
        ...resourceData,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id);
    if (error) console.error(`Failed to update ${resourceData.slug}:`, error.message);
    else console.log(`Updated existing holding: ${resourceData.slug}`);
  } else {
    // 3. Insert fresh holding
    const { error } = await supabase
      .from('resources')
      .insert(resourceData);
    if (error) console.error(`Failed to insert ${resourceData.slug}:`, error.message);
    else console.log(`Inserted new holding: ${resourceData.slug}`);
  }
}
```

---

## SECTION 6: Legal Provenance, Copyright & Ethical Scraping Compliance

The scraper developer must ensure all data collection is legally defensible and compliant with global IP norms:

1. **U.S. Government Public Domain (17 U.S.C. § 105):**
   All publications, guidelines, form shells, and examination memoranda created by officers of the USPTO, U.S. Copyright Office, and Federal Judiciary are in the public domain and may be scraped and distributed freely.
2. **WIPO Open Access Policy:**
   WIPO publications are distributed under open terms for educational and professional guidance with attribution to the International Bureau.
3. **SEC EDGAR Public Records:**
   Exhibits filed under Regulation S-K are public commercial disclosures. De-identifying names and redlining clauses ensures confidentiality while preserving contractual utility.
4. **Mandatory Platform Legal Disclaimer:**
   Every scraped resource in the database must automatically append the standard platform disclaimer:
   > *"This resource is published for professional operational and educational guidance only and does not constitute formal legal counsel. Practitioners must independently confirm current local rules and statutory deadlines."*

---

---

## SECTION 7: Complete Supabase DDL & Migration Specification (SQL)

The scraper developer or backend administrator should ensure the Supabase PostgreSQL database is properly configured with appropriate indexes, constraints, and full-text search capabilities for the `/platform/resources/guides-toolkits` surface.

```sql
-- ============================================================================
-- WIPA GUIDES & TOOLKITS DATABASE SCHEMA & INDEX SPECIFICATION
-- Target Table: public.resources
-- ============================================================================

-- 1. Ensure required columns exist with correct types
ALTER TABLE public.resources 
  ADD COLUMN IF NOT EXISTS subcategory text DEFAULT 'guides',
  ADD COLUMN IF NOT EXISTS resource_type text DEFAULT 'Toolkit',
  ADD COLUMN IF NOT EXISTS author_name text,
  ADD COLUMN IF NOT EXISTS author_title text,
  ADD COLUMN IF NOT EXISTS organization text DEFAULT 'Women’s IP World Alliance',
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS content text,
  ADD COLUMN IF NOT EXISTS file_url text,
  ADD COLUMN IF NOT EXISTS external_url text,
  ADD COLUMN IF NOT EXISTS read_time text,
  ADD COLUMN IF NOT EXISTS cover_image_url text DEFAULT '/resourceimg1.jpg',
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_splash_sponsored boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS splash_tagline text,
  ADD COLUMN IF NOT EXISTS splash_cta_text text,
  ADD COLUMN IF NOT EXISTS splash_cta_url text,
  ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS downloads_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS slug text;

-- 2. Create Unique Index on slug for safe upserting (if not already present)
CREATE UNIQUE INDEX IF NOT EXISTS idx_resources_slug_unique 
  ON public.resources (slug) 
  WHERE slug IS NOT NULL;

-- 3. Composite Index for the Guides & Toolkits directory page filtering
CREATE INDEX IF NOT EXISTS idx_resources_guides_filter 
  ON public.resources (category, subcategory, resource_type, is_featured, created_at DESC)
  WHERE category = 'guides-toolkits';

-- 4. Fast Full-Text Search GIN Index across Title, Summary, Content, and Tags
CREATE INDEX IF NOT EXISTS idx_resources_fts 
  ON public.resources 
  USING gin (
    to_tsvector('english', 
      coalesce(title, '') || ' ' || 
      coalesce(summary, '') || ' ' || 
      coalesce(content, '') || ' ' || 
      coalesce(array_to_string(tags, ' '), '')
    )
  );

-- 5. Row-Level Security (RLS) Configuration
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all approved guides & toolkits
DROP POLICY IF EXISTS "Public can view approved resources" ON public.resources;
CREATE POLICY "Public can view approved resources" 
  ON public.resources 
  FOR SELECT 
  USING (category = 'guides-toolkits' AND (approval_status = 'approved' OR approval_status IS NULL));

-- Allow service_role key to insert, update, and delete resources during scraping
DROP POLICY IF EXISTS "Service role has full access to resources" ON public.resources;
CREATE POLICY "Service role has full access to resources" 
  ON public.resources 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);
```

---

## SECTION 8: Detailed Crawler & Harvester Technical Specifications

For the developer building the crawler modules, the following table details the **harvesting protocols, endpoint formats, rate limits, and parsing strategies** for each data source:

| Source Authority | Harvester Module | Protocol / Tech | Extraction Target & DOM Selectors | Rate Limit & Crawl Courtesy |
|---|---|---|---|---|
| **USPTO (Patent Examination)** | `uspto_crawler.ts` | HTTPS GET / Cheerio / PDF Extract | • Guidance memos: `.field--name-body p, table`<br>• AIA Form shells: `a[href$=".pdf"]`<br>• Extract Section 101 decision tree criteria | 1 request per 2 seconds.<br>`User-Agent: WIPA-LegalResearch/2.0` |
| **WIPO (PCT Applicant’s Guide)** | `wipo_pct_crawler.ts` | REST API & HTML Scraper | • Country filing requirements: `table.pct-deadlines tr`<br>• Official fees table: `.fees-schedule td`<br>• Parse national phase limits (30 vs 31 mo) | 1 request per 1.5 seconds.<br>Cache responses locally for 7 days. |
| **EPO & UPC (Legal Texts)** | `epo_upc_crawler.ts` | HTML / Headless Chromium | • Guidelines Part G: `.legal-content-body`<br>• UPC Rules of Procedure: `article.rule-item`<br>• Rule 5 opt-out declaration templates | 1 request per 2 seconds.<br>Respect `robots.txt`. |
| **SEC EDGAR (Material Contracts)** | `edgar_ex10_crawler.ts` | SEC EDGAR Submissions API | • Filter: `Form 10-K`, `Form 10-Q`<br>• Query: `Exhibit 10` + `"Intellectual Property"`<br>• Download raw text/HTML contracts | Max 10 requests per second (SEC limit).<br>Mandatory `User-Agent: Company/Email`. |
| **Stanford OTL & AUTM (Tech Transfer)** | `tech_transfer_crawler.ts` | Cheerio / Node-Fetch | • Standard agreements list: `.agreement-download-link`<br>• Model NDAs & MTAs: `a[href$=".docx"], a[href$=".pdf"]` | 1 request per 2 seconds. |
| **NIST (Security & Trade Secrets)** | `nist_sp_crawler.ts` | PDF Stream Parser (`pdf-parse`) | • NIST SP 800-171 checklist criteria<br>• Section 3.1 Access Control & 3.8 Media Protection | 1 request per 2 seconds. |
| **Linux Foundation & SPDX** | `spdx_license_crawler.ts` | SPDX JSON REST API (`spdx.org/licenses/licenses.json`) | • Direct JSON endpoint with 600+ licenses<br>• License text, OSI-approved flag, FSF free flag | 2 requests per second (pure JSON API). |
| **US Copyright Office** | `copyright_gov_crawler.ts` | Cheerio / PDF Extract | • AI Guidance circulars: `.press-release-content`<br>• Compendium III Chapter 300 (Human Authorship) | 1 request per 2 seconds. |
| **CLOC (Corporate Legal Ops)** | `cloc_ops_crawler.ts` | HTML Scraper | • Outside billing standard guidelines<br>• E-billing and UTBMS phase code descriptions | 1 request per 2 seconds. |
| **Sedona Conference (Litigation)** | `sedona_crawler.ts` | PDF & Whitepaper Scraper | • Principles for Electronic Document Production<br>• Litigation hold notice guidance & triggers | 1 request per 3 seconds. |

---

## SECTION 9: Document Generation, Formatting & Redlining Guidelines

The scraper pipeline must generate clean, beautifully formatted files before uploading them to Supabase Storage. The developer must adhere to the following file design standards:

### 1. Microsoft Word (`.docx`) Generation Standard
When converting scraped legal contracts and checklists into Word documents:
- **Font & Hierarchy:** Use modern system fonts (`Aptos`, `Calibri`, or `Arial`).
  - Title: 24pt Bold, Brand Teal (`#14b8a6`).
  - Heading 1: 16pt Bold, Dark Navy (`#0f172a`).
  - Heading 2: 13pt Semi-Bold (`#334155`).
  - Body Text: 11pt Regular (`#1e293b`), 1.15 line spacing, 6pt space after paragraphs.
- **Callout Warning Boxes:**
  - Create shaded table boxes with left border (3pt, `#14b8a6`) for "PRACTICE TIP" or "STATUTORY WARNING".
- **Standard Bracket Redlining:**
  - Ensure all variable placeholders are highlighted or clearly bracketed: `[INSERT PARTY A NAME]`, `[DATE]`, `[INSERT JURISDICTION]`.

### 2. Microsoft Excel (`.xlsx`) Workbook Standard
When generating calculation matrices, budget tools, or audit scorecards:
- **Sheet 1 (`Instructions & Readme`):** Explaining how the model works, authorship, and jurisdiction.
- **Sheet 2 (`Data Entry & Inputs`):** User inputs styled with soft yellow fill (`#FFF2CC`) and thin borders.
- **Sheet 3 (`Calculations & Scoring`):** Formula-driven cells (`SUM`, `VLOOKUP`, `IF`) formatted as currency or percentage.
- **Sheet 4 (`Executive Summary Dashboard`):** High-level summary metrics with clean gridlines and bold totals.

### 3. Multi-File ZIP Package Layout
All multi-file toolkits must be compressed into a standardized ZIP directory:
```
[slug].zip
├── 00_README_AND_VERSION_NOTICE.txt
├── 01_Master_Procedural_Guide.pdf
├── 02_Customizable_Templates/
│   ├── Template_A_Primary_Agreement.docx
│   └── Template_B_Ancillary_Notice.docx
└── 03_Audit_Worksheet_And_Calculator.xlsx
```

---

## SECTION 10: Complete Copy-Pasteable Mock Data Payloads (JSON Developer Fixtures)

The scraper developer can use these four complete JSON fixtures as test payloads to validate database insertion and verify rendering on `/platform/resources/guides-toolkits` and `[id]`:

### Fixture 1: Subcategory `playbooks` (USPTO Section 101 Playbook)
```json
{
  "title": "USPTO Section 101 / Alice Rejection Response Playbook",
  "slug": "uspto-section-101-alice-rejection-response-playbook",
  "category": "guides-toolkits",
  "subcategory": "playbooks",
  "resource_type": "Playbook",
  "type": "Playbook",
  "author_name": "USPTO Examination Policy Team",
  "author_title": "Senior Patent Practice Counsel",
  "organization": "Women’s IP World Alliance",
  "summary": "Step-by-step procedural manual and model response shells for overcoming 35 U.S.C. 101 subject matter eligibility rejections in software, fintech, and AI patent applications.",
  "description": "Step-by-step procedural manual and model response shells for overcoming 35 U.S.C. 101 subject matter eligibility rejections in software, fintech, and AI patent applications.",
  "content": "### Background & Statutory Authority\nUnder 35 U.S.C. 101, patent examiners analyze computer-implemented, fintech, and AI claims under the two-step Alice/Mayo framework. Step 1 evaluates whether the claims fall within statutory subject matter categories (process, machine, manufacture, composition of matter).\n\n### The Two-Step Alice/Mayo Analytical Flow\n- **Step 2A (Prong 1):** Does the claim recite a judicial exception (mathematical concept, mental process, or certain method of organizing human activity)?\n- **Step 2A (Prong 2):** Is the judicial exception integrated into a practical application by imposing meaningful technological limitations?\n- **Step 2B:** If not integrated into a practical application, does the claim recite 'significantly more' than the exception under Berkheimer and Vanda precedent?\n\n### What Is Inside This Playbook\n1. 4 Model Response Shells targeting computer-implemented algorithms, natural language processing, and medical diagnostics.\n2. Art Unit 3600 & 2100 allowance statistics and examiner interview request templates (Form AIA/413).\n3. Rebuttal arguments countering abstract idea characterizations.\n\n*Note: This holding is updated to reflect the latest USPTO Subject Matter Eligibility Guidance.*",
  "intended_use": [
    "Drafting formal Office Action responses to final and non-final Section 101 rejections.",
    "Preparing strategic claim amendments that integrate judicial exceptions into practical technological applications.",
    "Structuring examiner interviews using standardized Form AIA/413 talking points.",
    "Training junior patent associates and patent agents on USPTO MPEP 2106 eligibility standards."
  ],
  "instructions": [
    {
      "step": 1,
      "title": "Analyze the Rejection Repertoire",
      "desc": "Cross-reference the Examiner's Office Action against Step 2A Prong 1 to identify which judicial exception was cited."
    },
    {
      "step": 2,
      "title": "Select the Appropriate Response Shell",
      "desc": "Choose between the Software Integration Shell or the Berkheimer Inventive Concept Shell based on your claim architecture."
    },
    {
      "step": 3,
      "title": "Draft Technological Improvement Arguments",
      "desc": "Emphasize how the specification details specific hardware improvements or algorithmic processing efficiencies."
    },
    {
      "step": 4,
      "title": "Schedule Examiner Interview",
      "desc": "File Form AIA/413 with your proposed claim amendments prior to submitting the formal written response."
    }
  ],
  "file_url": "https://bepavczocyvaegkfxtvd.supabase.co/storage/v1/object/public/resources/guides-toolkits/uspto-section-101/playbook.zip",
  "external_url": "https://www.uspto.gov/patents/laws-and-regulations/examination-guidance/subject-matter-eligibility",
  "read_time": "32 Pages + 4 DOCX Shells",
  "cover_image_url": "/resourceimg1.jpg",
  "tags": ["Patent Prosecution", "USPTO", "Alice Rejection", "Section 101", "Software Patents", "Office Actions"],
  "is_featured": true,
  "is_splash_sponsored": false,
  "approval_status": "approved",
  "views_count": 1420,
  "downloads_count": 580
}
```

### Fixture 2: Subcategory `toolkits` (In-House Counsel IP Audit & Trade Secret Toolkit)
```json
{
  "title": "In-House Counsel IP Audit & Trade Secret Governance Toolkit",
  "slug": "in-house-counsel-ip-audit-toolkit",
  "category": "guides-toolkits",
  "subcategory": "toolkits",
  "resource_type": "Toolkit",
  "type": "Toolkit",
  "author_name": "Corporate Legal Practice Team",
  "author_title": "Head of IP Governance",
  "organization": "Women’s IP World Alliance",
  "summary": "Turnkey operational bundle containing customizable Excel audit workbooks, inventor disclosure forms, gap analysis slide decks, and trade secret classification matrices.",
  "description": "Turnkey operational bundle containing customizable Excel audit workbooks, inventor disclosure forms, gap analysis slide decks, and trade secret classification matrices.",
  "content": "### Overview\nConducting periodic intellectual property audits is essential for corporate risk mitigation, pre-M&A preparations, and identifying undocumented innovation across engineering departments.\n\n### Package Contents\n1. `IP_Audit_Best_Practices.pdf` — Methodology manual detailing audit procedures.\n2. `Inventor_Questionnaire.docx` — Structured interview form for technical staff.\n3. `Master_IP_Tracker.xlsx` — Multi-tab portfolio tracker for patents, trademarks, domains, and trade secrets.\n4. `Gap_Analysis_Template.pptx` — Executive slide deck for board-level risk presentations.\n5. `Trade_Secret_Access_Log.xlsx` — Audit checklist for NIST SP 800-171 compliance.\n\n### Governing Standards\nAligned with the Defend Trade Secrets Act (DTSA), Uniform Trade Secrets Act (UTSA), and international corporate governance best practices.",
  "intended_use": [
    "Executing annual or bi-annual corporate IP portfolio audits.",
    "Preparing target company documentation for M&A legal due diligence.",
    "Benchmarking trade secret 'reasonable measures' against statutory requirements.",
    "Onboarding engineering teams to standardize invention harvesting."
  ],
  "instructions": [
    {
      "step": 1,
      "title": "Review the Methodology Guide",
      "desc": "Read 'IP_Audit_Best_Practices.pdf' to define the audit scope and assign departmental leads."
    },
    {
      "step": 2,
      "title": "Distribute Questionnaires",
      "desc": "Issue 'Inventor_Questionnaire.docx' to product and engineering leads to identify undocumented IP."
    },
    {
      "step": 3,
      "title": "Populate the Master Tracker",
      "desc": "Consolidate filing dates, chain of title assignments, and maintenance deadlines into the Excel tracker."
    },
    {
      "step": 4,
      "title": "Present Executive Gap Analysis",
      "desc": "Utilize 'Gap_Analysis_Template.pptx' to present uncovered vulnerabilities to executive leadership."
    }
  ],
  "file_url": "https://bepavczocyvaegkfxtvd.supabase.co/storage/v1/object/public/resources/guides-toolkits/in-house-audit/toolkit.zip",
  "external_url": "https://csrc.nist.gov/publications",
  "read_time": "ZIP Archive (5 Templates + 1 Guide)",
  "cover_image_url": "/resourceimg2.jpg",
  "tags": ["Corporate IP", "IP Strategy", "Trade Secrets", "M&A Diligence", "Compliance", "Audit"],
  "is_featured": true,
  "is_splash_sponsored": false,
  "approval_status": "approved",
  "views_count": 2180,
  "downloads_count": 920
}
```

### Fixture 3: Subcategory `templates` (Enterprise SaaS Master Agreement & SLA Pack)
```json
{
  "title": "Enterprise Software-as-a-Service (SaaS) Master Agreement & SLA Pack",
  "slug": "enterprise-saas-master-agreement-sla-pack",
  "category": "guides-toolkits",
  "subcategory": "templates",
  "resource_type": "Template",
  "type": "Template",
  "author_name": "Commercial Technology Practice Group",
  "author_title": "Partner & Tech Transactions Lead",
  "organization": "Women’s IP World Alliance",
  "summary": "Redline-ready Word document package featuring a balanced Enterprise SaaS Master Subscription Agreement, 99.9% Uptime Service Level Agreement, and GDPR-compliant DPA.",
  "description": "Redline-ready Word document package featuring a balanced Enterprise SaaS Master Subscription Agreement, 99.9% Uptime Service Level Agreement, and GDPR-compliant DPA.",
  "content": "### Scope of Agreement\nThis enterprise SaaS contract package governs commercial cloud software procurement, licensing, data security representations, and service availability.\n\n### Key Included Clauses\n- **Customer Data Ownership:** Strict affirmative protection ensuring customer retains sole title to all uploaded data and derivative training sets.\n- **Mutual IP Indemnification:** Comprehensive defense and indemnity against third-party patent and copyright claims.\n- **Tiered Limitation of Liability:** Standard 12-month trailing fee cap with balanced super-caps for confidentiality and data breach incidents.\n- **Service Level Agreement (SLA):** 99.9% availability target with tiered service credits and maintenance notification windows.\n- **Data Processing Addendum (DPA):** Standard Contractual Clauses (SCCs) for cross-border data transfers.",
  "intended_use": [
    "Negotiating high-value B2B software subscription contracts.",
    "Establishing standard procurement terms for enterprise technology vendors.",
    "Updating cloud software licensing terms to address AI data usage and GDPR cross-border rules.",
    "Resolving commercial impasse on liability caps and uptime credit remedies."
  ],
  "instructions": [
    {
      "step": 1,
      "title": "Select Licensing Model",
      "desc": "Open 'Enterprise_SaaS_MSA.docx' and choose between user-seat licensing or usage-based consumption tiers."
    },
    {
      "step": 2,
      "title": "Populate Bracketed Variables",
      "desc": "Replace '[INSERT LICENSOR NAME]', '[GOVERNING LAW]', and '[LIABILITY CAP MULTIPLE]' with matter terms."
    },
    {
      "step": 3,
      "title": "Attach Service Level Schedule",
      "desc": "Append Schedule B (SLA) and set scheduled maintenance hours aligned with your technical operations."
    },
    {
      "step": 4,
      "title": "Execute Data Processing Addendum",
      "desc": "Review Schedule C (DPA) to ensure applicable sub-processors and encryption standards are declared."
    }
  ],
  "file_url": "https://bepavczocyvaegkfxtvd.supabase.co/storage/v1/object/public/resources/guides-toolkits/saas-msa/saas_pack.docx",
  "external_url": "https://www.sec.gov/edgar/searchedgar/companysearch",
  "read_time": "3 DOCX Templates (42 Pages)",
  "cover_image_url": "/resource3.jpg",
  "tags": ["Commercial IP", "SaaS", "Licensing", "SLA", "Contracts", "Cloud Computing"],
  "is_featured": false,
  "is_splash_sponsored": false,
  "approval_status": "approved",
  "views_count": 1890,
  "downloads_count": 740
}
```

### Fixture 4: Subcategory `guides` (Navigating the Unified Patent Court Guide)
```json
{
  "title": "Navigating the UPC: Practical Opt-Out & Litigation Defense Guide",
  "slug": "navigating-the-upc-practical-guide",
  "category": "guides-toolkits",
  "subcategory": "guides",
  "resource_type": "PDF Guide",
  "type": "PDF Guide",
  "author_name": "EU Patent Litigation Desk",
  "author_title": "European Patent Attorney",
  "organization": "Women’s IP World Alliance",
  "summary": "45-page authoritative guide providing decision trees, cost comparisons, and step-by-step instructions for opting out European patents from the Unified Patent Court.",
  "description": "45-page authoritative guide providing decision trees, cost comparisons, and step-by-step instructions for opting out European patents from the Unified Patent Court.",
  "content": "### The UPC & Unitary Patent System\nThe Unified Patent Court (UPC) provides a centralized patent litigation forum across participating EU member states. While offering pan-European injunctions, it introduces the risk of central patent revocation across 17+ nations in a single action.\n\n### Strategic Guidance Inside This Guide\n1. **Opt-Out Decision Matrix:** Evaluating litigation exposure vs. enforcement advantages during the 7-year transitional period under Rule 5 UPC RoP.\n2. **Filing Opt-Out Declarations:** Step-by-step Case Management System (CMS) procedural instructions.\n3. **Unitary Patent (UP) Cost Comparison:** Breakeven fee analysis comparing classical national validations against the single Unitary Patent renewal fee.\n4. **Revocation Defense Protocols:** Strategic management of parallel national court and UPC proceedings.",
  "intended_use": [
    "Counseling US and Asian multinational corporations on European patent portfolio strategy.",
    "Formulating corporate opt-out policies for crown-jewel patent assets.",
    "Preparing UPC Case Management System declarations on behalf of co-owners and exclusive licensees.",
    "Evaluating whether to validate pending EP applications as Unitary Patents."
  ],
  "instructions": [
    {
      "step": 1,
      "title": "Conduct Portfolio Risk Audit",
      "desc": "Review the decision tree in Chapter 2 to segment patents into high-litigation vs. standard commercial assets."
    },
    {
      "step": 2,
      "title": "Verify Chain of Title & All Co-Proprietors",
      "desc": "Confirm that all registered proprietors across every designated state execute the opt-out mandate."
    },
    {
      "step": 3,
      "title": "Submit Declarations via UPC CMS",
      "desc": "Upload standardized Rule 5 declarations through the electronic portal prior to any national court actions."
    },
    {
      "step": 4,
      "title": "Docket Re-Entry / Opt-In Windows",
      "desc": "Record statutory periods and conditions under which an opt-out may be withdrawn if enforcement is desired."
    }
  ],
  "file_url": "https://bepavczocyvaegkfxtvd.supabase.co/storage/v1/object/public/resources/guides-toolkits/upc-guide/guide.pdf",
  "external_url": "https://www.unified-patent-court.org/en/rules",
  "read_time": "45-Page Practical Guide",
  "cover_image_url": "/resourceimg1.jpg",
  "tags": ["European Patent", "UPC", "Unitary Patent", "Litigation", "Opt-Out", "EPO"],
  "is_featured": false,
  "is_splash_sponsored": false,
  "approval_status": "approved",
  "views_count": 3120,
  "downloads_count": 1250
}
```

---

## SECTION 11: Automated QA, Validation Gates & Data Healthcheck Suite

Before the scraper commits any newly scraped holding to the Supabase database, it must execute the following **mandatory automated validation checks**. If any check fails, the record must be rejected or placed into an administrative review queue:

```javascript
/**
 * Programmatic Validation Suite for Scraper Pipeline
 * Run this function on every enriched record before upserting.
 */
function validateResourceRecord(record) {
  const errors = [];

  // 1. Title Validation
  if (!record.title || record.title.trim().length < 10) {
    errors.push("Title must be at least 10 characters long.");
  }

  // 2. Slug Validation
  if (!record.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug)) {
    errors.push(`Invalid slug format: "${record.slug}". Must be lowercase alphanumeric with hyphens.`);
  }

  // 3. Category & Subcategory Enums
  if (record.category !== 'guides-toolkits') {
    errors.push(`Invalid category: "${record.category}". Must be exactly 'guides-toolkits'.`);
  }
  const validSubcategories = ['playbooks', 'toolkits', 'templates', 'guides'];
  if (!validSubcategories.includes(record.subcategory)) {
    errors.push(`Invalid subcategory: "${record.subcategory}". Must be one of: ${validSubcategories.join(', ')}.`);
  }

  // 4. Resource Type Enums
  const validTypes = ['Toolkit', 'Playbook', 'Template', 'Checklist', 'PDF Guide', 'Workbook', 'FAQ', 'Glossary'];
  if (!validTypes.includes(record.resource_type)) {
    errors.push(`Invalid resource_type: "${record.resource_type}". Must be one of: ${validTypes.join(', ')}.`);
  }

  // 5. Executive Summary Length
  if (!record.summary || record.summary.length < 50 || record.summary.length > 300) {
    errors.push(`Summary must be between 50 and 300 characters. Current length: ${record.summary?.length || 0}.`);
  }

  // 6. Content Depth
  if (!record.content || record.content.split(/\s+/).length < 150) {
    errors.push("Content body must contain at least 150 words of background legal analysis.");
  }

  // 7. Intended Use Array
  if (!Array.isArray(record.intended_use) || record.intended_use.length < 3) {
    errors.push("intended_use must be an array of at least 3 actionable scenario strings.");
  }

  // 8. Numbered Instructions Array
  if (!Array.isArray(record.instructions) || record.instructions.length < 3) {
    errors.push("instructions must be an array of at least 3 sequential step objects.");
  } else {
    record.instructions.forEach((inst, idx) => {
      if (!inst.step || !inst.title || !inst.desc) {
        errors.push(`Instruction item at index ${idx} is missing step, title, or desc.`);
      }
    });
  }

  // 9. Download File URL
  if (!record.file_url || !record.file_url.startsWith('http') && !record.file_url.startsWith('/')) {
    errors.push(`file_url is invalid: "${record.file_url}". Must be a valid public URL or relative path.`);
  }

  // 10. Tags Verification
  if (!Array.isArray(record.tags) || record.tags.length < 3) {
    errors.push("tags must be an array containing at least 3 search tokens.");
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}
```

---

## SECTION 12: CI/CD Pipeline, Scheduled Cron Jobs & Error Logging

The scraper is intended to operate as a self-healing background daemon. The developer must configure the following operational architecture:

### 1. Dedicated Supabase Logging Table
To ensure visibility into automated scraper runs, create the `scraper_execution_logs` table:

```sql
CREATE TABLE IF NOT EXISTS public.scraper_execution_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('started', 'success', 'warning', 'failed')),
  records_processed integer DEFAULT 0,
  records_inserted integer DEFAULT 0,
  records_updated integer DEFAULT 0,
  errors_encountered jsonb DEFAULT '[]'::jsonb,
  duration_ms integer,
  created_at timestamptz DEFAULT now()
);
```

### 2. GitHub Actions Scheduled Automation
Configure `.github/workflows/scrape-guides-toolkits.yml` to trigger the crawler on a scheduled cadence:

```yaml
name: WIPA Guides & Toolkits Ingestion Daemon

on:
  schedule:
    # Trigger weekly on Monday at 04:00 UTC
    - cron: '0 4 * * 1'
  workflow_dispatch: # Allows manual trigger from GitHub UI with custom parameters
    inputs:
      source:
        description: 'Target Source to Scrape'
        required: true
        default: 'all'
        type: choice
        options:
          - all
          - uspto
          - wipo
          - epo
          - edgar
          - techtransfer
          - nist
      dry_run:
        description: 'Dry Run Mode (Simulate without DB writes)'
        required: true
        default: false
        type: boolean

jobs:
  run-scraper:
    runs-on: ubuntu-latest
    timeout-minutes: 60

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: ./WIPA/package-lock.json

      - name: Install Platform Dependencies
        run: npm ci
        working-directory: ./WIPA

      - name: Execute Scraper Pipeline
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          FLAGS="--source=${{ github.event.inputs.source || 'all' }}"
          if [ "${{ github.event.inputs.dry_run }}" = "true" ]; then
            FLAGS="$FLAGS --dry-run"
          fi
          node scripts/scrape_guides_toolkits.js $FLAGS
        working-directory: ./WIPA

      - name: Report Batch Telemetry
        if: always()
        run: echo "Scraper batch finished with status ${{ job.status }}."
```

---

## Final Developer Handoff Checklist

The scraper engineer or development team should check off each of the following milestones upon completing the pipeline:

- [x] **Database Prepared:** Confirmed that `resources` table supports all fields specified in Section 1 and Section 7.
- [ ] **Harvesters Connected:** Built scrapers for USPTO, WIPO, EPO, SEC EDGAR, Tech Transfer, NIST, and SPDX (Section 2 & Section 8).
- [ ] **Redlining & Variable Sanitization:** Replaced private entity names with standard `[PARTY A]` brackets (Section 3).
- [ ] **Packaging Engine Active:** Formatted clean Word (`.docx`), Excel (`.xlsx`), and multi-file `.zip` packages with `README.txt` (Section 3 & Section 9).
- [ ] **AI Metadata Enrichment:** Wired LLM prompt schema to produce concise summaries, 3+ intended use bullets, and 3+ instructions (Section 4).
- [ ] **Storage Upload Verified:** Configured automated asset uploads to Supabase Storage bucket `'resources'` and generated public URLs (Section 3).
- [ ] **Idempotent Ingestion Verified:** Implemented `select-then-update/insert` by slug to prevent duplicate database rows (Section 5).
- [ ] **Automated QA Passed:** Validated records against programmatic schema rules before saving (Section 11).
- [ ] **Cron Automation Scheduled:** Deployed GitHub Actions workflow or cloud cron daemon (Section 12).
- [ ] **UI Rendering Confirmed:** Verified that ingested holdings display flawlessly on `/platform/resources/guides-toolkits` and deep link into `/platform/resources/guides-toolkits/[id]`.

---

*This document serves as the formal engineering contract for the WIPA Guides & Toolkits Scraper Pipeline.*


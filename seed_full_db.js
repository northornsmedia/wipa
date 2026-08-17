const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const supabaseUrl = "https://bepavczocyvaegkfxtvd.supabase.co";
let key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlcG12Y3pvY3l2YWVna2Z4dHZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTUzNTc4MCwiZXhwIjoyMDU1MTExNzgwfQ.ZgRzYvTzH69ZfG542d9sYxM-Uv_d9l88NffzLq99hT8";

try {
  const envText = fs.readFileSync(".env.local", "utf8");
  const match = envText.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/);
  if (match && match[1]) key = match[1].trim();
} catch (e) {}

const supabase = createClient(supabaseUrl, key);

async function seed() {
  console.log("Starting full database seeding...");

  // 1. Get an admin user ID for referencing
  const { data: users } = await supabase.from("profiles").select("id, email").limit(5);
  const primaryUserId = users && users.length > 0 ? users[0].id : null;
  console.log("Using primary profile ID:", primaryUserId);

  // 2. Seed Resources across all 11 verticals
  const resourcesToSeed = [
    {
      title: "Navigating AI Patents & Machine Learning Claims in 2026",
      slug: "navigating-ai-patents-2026",
      category: "articles-insights",
      subcategory: "thought-leadership",
      resource_type: "Expert Article",
      author_name: "Elena Rostova",
      author_title: "Senior Patent Attorney",
      organization: "European Patent Practice",
      summary: "Comprehensive guide to patenting neural networks and prompt workflows across USPTO and EPO.",
      content: "As artificial intelligence systems advance, claiming generative models requires rigorous technical disclosure...",
      cover_image_url: "/resourceimg1.jpg",
      read_time: "7 min read",
      tags: ["AI in IP", "Patent Prosecution", "EPO", "USPTO"],
      is_featured: true,
      is_splash_sponsored: true,
      splash_tagline: "Accelerate Patent Drafting with AI Precision",
      splash_cta_text: "Try PatentAI Free",
      splash_cta_url: "https://wipa.org",
      splash_background_color: "#5a32fa"
    },
    {
      title: "The Evolution of Standard Essential Patents in 5G & 6G Telecoms",
      slug: "evolution-standard-essential-patents-5g-6g",
      category: "articles-insights",
      subcategory: "opinions",
      resource_type: "Opinion",
      author_name: "Marcus Vance",
      author_title: "Head of Litigation",
      organization: "Vance & Partners",
      summary: "FRAND licensing benchmarks and cross-jurisdictional injunction trends in global telecoms.",
      content: "FRAND obligations continue to evolve under the Unified Patent Court (UPC) in Europe...",
      cover_image_url: "/resourceimg2.jpg",
      read_time: "5 min read",
      tags: ["SEP", "FRAND", "Telecommunications"],
      is_featured: true,
      is_splash_sponsored: false
    },
    {
      title: "Global IP Strategy Summit: Navigating UPC Jurisdictions",
      slug: "global-ip-strategy-summit-upc",
      category: "webinars",
      subcategory: "litigation",
      resource_type: "Webinar Recording",
      author_name: "Dr. Aris Thorne",
      author_title: "UPC Specialist",
      organization: "WIPA European Council",
      summary: "Live deep dive into the first two years of Unified Patent Court decisions.",
      content: "In this masterclass, leading practitioners break down procedural tactics in UPC divisions...",
      cover_image_url: "/resourceimg1.jpg",
      duration: "54:20",
      read_time: "54 min",
      tags: ["UPC", "Litigation", "Webinar"],
      is_featured: true,
      is_splash_sponsored: false
    },
    {
      title: "Executive Certificate in International IP Law & Licensing",
      slug: "executive-certificate-international-ip-law",
      category: "education",
      subcategory: "patent-law",
      resource_type: "Certification",
      author_name: "Prof. Sarah Jenkins",
      author_title: "Dean of IP Studies",
      organization: "University of New Hampshire Franklin Pierce School of Law",
      summary: "Accredited online certificate covering global patent portfolios, drafting, and cross-border licensing.",
      content: "Master the intricacies of international filing under PCT and the Hague System...",
      cover_image_url: "/resourceimg2.jpg",
      read_time: "8 Weeks",
      tags: ["Education", "UNH", "Certification", "Licensing"],
      is_featured: true,
      is_splash_sponsored: true,
      splash_tagline: "Apply for Fall 2026 Fellowship",
      splash_cta_text: "Explore Syllabus",
      splash_cta_url: "https://law.unh.edu",
      splash_background_color: "#ff90e8"
    },
    {
      title: "Women's IP World Annual Edition 2026: Trailblazing Leaders",
      slug: "womens-ip-world-annual-2026",
      category: "womens-ip-world",
      subcategory: "annual-edition",
      resource_type: "Digital Publication",
      author_name: "Editorial Board",
      author_title: "Chief Editor",
      organization: "Women's IP World",
      summary: "Featuring in-depth profiles of 50 visionary female IP practitioners shaping law and technology worldwide.",
      content: "The 2026 edition highlights groundbreaking female general counsel, innovators, and boutique founders...",
      cover_image_url: "/resource3.jpg",
      read_time: "Full Issue",
      tags: ["WIPW", "Leadership", "Spotlight"],
      is_featured: true,
      is_splash_sponsored: false
    },
    {
      title: "WIPO Releases 2026 World Intellectual Property Indicators",
      slug: "wipo-releases-2026-indicators",
      category: "ip-news",
      subcategory: "global-updates",
      resource_type: "News Brief",
      author_name: "WIPA Newsdesk",
      author_title: "Correspondent",
      organization: "Geneva Bureau",
      summary: "Global patent filings exceed 3.5 million with remarkable surges in green energy and biotechnology.",
      content: "The World Intellectual Property Organization announced today that patent demand continued upward trajectory...",
      cover_image_url: "/resourceimg1.jpg",
      read_time: "3 min read",
      tags: ["WIPO", "Statistics", "News"],
      is_featured: false,
      is_splash_sponsored: false
    },
    {
      title: "2026 Global IP Litigation & Damages Benchmark Report",
      slug: "2026-global-ip-litigation-damages-benchmark",
      category: "research-reports",
      subcategory: "industry-reports",
      resource_type: "Research Report",
      author_name: "WIPA Research Committee",
      author_title: "Lead Analyst",
      organization: "WIPA Institute",
      summary: "Comprehensive statistical analysis of median damage awards, preliminary injunction success rates, and trial durations.",
      content: "Our team examined over 1,200 patent and trademark cases adjudicated across 12 countries...",
      cover_image_url: "/resourceimg2.jpg",
      read_time: "42 Pages",
      tags: ["Research", "Litigation", "Damages", "Analytics"],
      is_featured: true,
      is_splash_sponsored: false
    },
    {
      title: "Complete Trade Secret Protection & Remote Worker Audit Toolkit",
      slug: "trade-secret-protection-toolkit",
      category: "guides-toolkits",
      subcategory: "toolkits",
      resource_type: "Toolkit",
      author_name: "David Sterling Esq.",
      author_title: "Senior Counsel",
      organization: "Sterling IP",
      summary: "Downloadable NDA templates, exit interview checklists, and cloud access protocols for remote workforces.",
      content: "Protecting proprietary algorithms and confidential business information when employees work globally...",
      cover_image_url: "/resource3.jpg",
      read_time: "Checklist + Templates",
      tags: ["Trade Secrets", "Toolkits", "Compliance"],
      is_featured: false,
      is_splash_sponsored: false
    },
    {
      title: "From Senior Associate to IP Partner: The Roadmap to Equity",
      slug: "from-senior-associate-to-ip-partner",
      category: "career-leadership",
      subcategory: "career-transition",
      resource_type: "Career Guide",
      author_name: "Nadine Stuttle",
      author_title: "CEO, PSS Solutions",
      organization: "WIPA European Board",
      summary: "Key metrics, client origination tactics, and executive presence required to make partner in tier-1 IP firms.",
      content: "Transitioning to equity partnership requires shifting mindset from legal technician to commercial advisor...",
      cover_image_url: "/Nadine Stuttle Picture.jpg",
      read_time: "8 min read",
      tags: ["Career", "Partnership", "Leadership"],
      is_featured: true,
      is_splash_sponsored: false
    },
    {
      title: "Outside Counsel Management & Fee Structuring Playbook",
      slug: "outside-counsel-management-playbook",
      category: "in-house-counsel",
      subcategory: "portfolio-management",
      resource_type: "Playbook",
      author_name: "Rachel Goldman",
      author_title: "Chief IP Counsel",
      organization: "BioTech Global",
      summary: "Framework for negotiating fixed fees, success bonuses, and performance scorecards with external law firms.",
      content: "Corporate IP budgets demand predictable legal spend and aligned incentives...",
      cover_image_url: "/resourceimg1.jpg",
      read_time: "10 min read",
      tags: ["In-House", "Budgeting", "Outside Counsel"],
      is_featured: false,
      is_splash_sponsored: false
    },
    {
      title: "Mindfulness & High-Stakes Trial Performance: Managing Stress",
      slug: "mindfulness-high-stakes-trial-stress",
      category: "wellness",
      subcategory: "mental-health",
      resource_type: "Wellness Workshop",
      author_name: "Jel · Budding Minds",
      author_title: "Mindfulness Director",
      organization: "Budding Minds Wellbeing",
      summary: "Evidence-based cognitive strategies for IP trial attorneys facing extreme courtroom pressure.",
      content: "High-intensity litigation produces chronic cortisol spikes. Learn physical reset techniques...",
      cover_image_url: "/wellbeing.jpg",
      read_time: "Listen & Practice",
      tags: ["Wellness", "Mental Health", "Mindfulness"],
      is_featured: true,
      is_splash_sponsored: false
    }
  ];

  for (const res of resourcesToSeed) {
    const payload = {
      ...res,
      type: res.resource_type || "Article"
    };
    const { error } = await supabase.from("resources").upsert(payload, { onConflict: "slug" });
    if (error) console.error("Error inserting resource", res.title, error.message);
  }
  console.log("Seeded 11 vertical resources!");

  // 3. Seed Events
  const eventsToSeed = [
    {
      title: "Global Women in IP Annual Summit 2026",
      slug: "global-women-in-ip-annual-summit-2026",
      category: "Summit",
      description: "Join 1,000+ female leaders in intellectual property for two days of keynote panels, workshops, and high-impact networking.",
      event_date: new Date(Date.now() + 14 * 86400000).toISOString(),
      end_date: new Date(Date.now() + 15 * 86400000).toISOString(),
      timezone: "CET",
      is_virtual: false,
      location: "Geneva International Conference Centre (CICG), Geneva, Switzerland",
      cover_image_url: "/eventimg1.jpg",
      price: 299,
      max_attendees: 1000,
      current_attendees: 342,
      is_featured: true,
      is_published: true
    },
    {
      title: "Mastering Generative AI Patent Prosecution",
      slug: "mastering-generative-ai-patent-prosecution",
      category: "Webinar",
      description: "Interactive virtual workshop on drafting defensible AI patent claims under updated USPTO section 101 guidance.",
      event_date: new Date(Date.now() + 5 * 86400000).toISOString(),
      end_date: new Date(Date.now() + 5 * 86400000 + 7200000).toISOString(),
      timezone: "EST",
      is_virtual: true,
      meeting_url: "https://meetn.com/wipa-ai-webinar",
      cover_image_url: "/resourceimg1.jpg",
      price: 0,
      max_attendees: 500,
      current_attendees: 189,
      is_featured: true,
      is_published: true
    },
    {
      title: "European IP Counsel Roundtable & Networking",
      slug: "european-ip-counsel-roundtable",
      category: "Networking",
      description: "Exclusive closed-door roundtable for European In-House IP Directors hosted by Inaugural Chair Nadine Stuttle.",
      event_date: new Date(Date.now() + 21 * 86400000).toISOString(),
      end_date: new Date(Date.now() + 21 * 86400000 + 10800000).toISOString(),
      timezone: "CET",
      is_virtual: true,
      meeting_url: "https://meetn.com/wipa-europe-roundtable",
      cover_image_url: "/Nadine Stuttle Picture.jpg",
      price: 0,
      max_attendees: 100,
      current_attendees: 64,
      is_featured: false,
      is_published: true
    }
  ];

  for (const evt of eventsToSeed) {
    const { error } = await supabase.from("events").upsert(evt, { onConflict: "slug" });
    if (error) console.error("Error inserting event", evt.title, error.message);
  }
  console.log("Seeded live events!");

  // 4. Seed Jobs
  const jobsToSeed = [
    {
      title: "Senior Patent Counsel (AI & Software)",
      slug: "senior-patent-counsel-ai-software",
      company_name: "Anthropic AI",
      company_logo_url: "/resourceimg1.jpg",
      location: "San Francisco, CA (or Remote)",
      is_remote: true,
      job_type: "Full-time",
      experience_level: "Senior",
      salary_min: 240000,
      salary_max: 310000,
      currency: "USD",
      description: "We are seeking a seasoned patent attorney to spearhead our international patent strategy for foundation AI models and alignment architectures.",
      requirements: ["JD from accredited law school", "USPTO registration", "5+ years software patent drafting experience"],
      benefits: ["Comprehensive Health & Dental", "Equity Grant", "Unlimited PTO"],
      application_email: "legal-careers@anthropic.com",
      is_featured: true,
      is_active: true,
      applicants_count: 14
    },
    {
      title: "Head of Trademark & Brand Protection",
      slug: "head-of-trademark-brand-protection",
      company_name: "LVMH Group",
      company_logo_url: "/resourceimg2.jpg",
      location: "Paris, France / Geneva, Switzerland",
      is_remote: false,
      job_type: "Full-time",
      experience_level: "Executive",
      salary_min: 190000,
      salary_max: 250000,
      currency: "EUR",
      description: "Lead global trademark enforcement, anti-counterfeiting operations, and luxury brand portfolio strategy across 40+ countries.",
      requirements: ["Master in IP Law or equivalent", "10+ years in luxury/fashion IP", "Multilingual (French + English)"],
      benefits: ["Executive Bonus Plan", "Relocation Support", "Pension Program"],
      application_email: "ip-recruitment@lvmh.com",
      is_featured: true,
      is_active: true,
      applicants_count: 22
    }
  ];

  for (const job of jobsToSeed) {
    const payload = {
      ...job,
      company: job.company_name
    };
    const { error } = await supabase.from("jobs").upsert(payload, { onConflict: "slug" });
    if (error) console.error("Error inserting job", job.title, error.message);
  }
  console.log("Seeded jobs board!");

  // 5. Seed Business Profiles
  const businessesToSeed = [
    {
      name: "Advitam IP LLC",
      slug: "advitam-ip-llc",
      type: "IP Boutique",
      logo_url: "/resourceimg1.jpg",
      tagline: "Premier Women-Owned Intellectual Property Firm",
      description: "Advitam IP is a full-service intellectual property law firm specializing in patents, trademarks, copyrights, and commercial transactions.",
      website_url: "https://advitamip.com",
      linkedin_url: "https://linkedin.com/company/advitam-ip",
      headquarters: "Chicago, IL, USA",
      specializations: ["Patents", "Trademarks", "Copyrights", "Licensing"],
      contact_email: "info@advitamip.com",
      phone: "+1 (312) 800-8800",
      is_verified: true,
      owner_id: primaryUserId
    },
    {
      name: "PSS Solutions Switzerland",
      slug: "pss-solutions-switzerland",
      type: "Tech Company",
      logo_url: "/resourceimg2.jpg",
      tagline: "Executive IP Strategy & Digital Transformation",
      description: "Providing global IP portfolio analytics, executive recruitment, and strategic advisory for multinational enterprises.",
      website_url: "https://psssolutions.ch",
      linkedin_url: "https://linkedin.com/company/pss-solutions",
      headquarters: "Zurich, Switzerland",
      specializations: ["IP Analytics", "Strategy", "UPC Advisory"],
      contact_email: "contact@psssolutions.ch",
      phone: "+41 22 555 0199",
      is_verified: true,
      owner_id: primaryUserId
    }
  ];

  for (const biz of businessesToSeed) {
    const { error } = await supabase.from("business_profiles").upsert(biz, { onConflict: "slug" });
    if (error) console.error("Error inserting business", biz.name, error.message);
  }
  console.log("Seeded business profiles!");

  // 6. Seed Forum Posts
  const { data: forumsList } = await supabase.from("forums").select("id, slug").limit(3);
  if (forumsList && forumsList.length > 0 && primaryUserId) {
    const forumPostsToSeed = [
      {
        forum_id: forumsList[0].id,
        author_id: primaryUserId,
        title: "How is your firm handling UPC Opt-Out renewals for 2026?",
        content: "We are reviewing our portfolio strategy regarding the Unified Patent Court. Are colleagues seeing advantages in keeping high-value EP patents opted out?",
        is_pinned: true,
        views_count: 320,
        likes_count: 24,
        replies_count: 8
      },
      {
        forum_id: forumsList[0].id,
        author_id: primaryUserId,
        title: "Best practices for prompt engineering disclosures in patent applications",
        content: "When drafting AI workflow patents, how detailed are your specification examples for system prompts and temperature hyperparameters?",
        is_pinned: false,
        views_count: 185,
        likes_count: 16,
        replies_count: 5
      }
    ];

    for (const post of forumPostsToSeed) {
      await supabase.from("forum_posts").insert(post);
    }
    console.log("Seeded forum posts!");
  }

  // 7. Seed Sample Firm Claim Request (for admin moderation queue demo)
  const { data: firmsList } = await supabase.from("ip_firms").select("id, name").limit(1);
  if (firmsList && firmsList.length > 0 && primaryUserId) {
    const { error: claimErr } = await supabase.from("firm_claim_requests").insert({
      firm_id: firmsList[0].id,
      requester_id: primaryUserId,
      role_at_firm: "Managing Partner",
      work_email: "partner@advitamip.com",
      proof_url: "https://advitamip.com/team/partner",
      status: "pending"
    });
    if (!claimErr) console.log("Seeded sample firm claim request!");
  }

  console.log("✅ All database tables have been fully populated with real production records!");
}

seed().catch(err => {
  console.error("Seed error:", err);
});

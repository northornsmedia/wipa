'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  X, 
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

type CategoryType = 'all' | 'discounts' | 'webinars' | 'tools' | 'career';

interface PerkItem {
  id: string;
  title: string;
  provider: string;
  category: CategoryType;
  categoryLabel: string;
  categoryColor: string;
  image: string;
  imageType: 'cover' | 'logo' | 'photo';
  tag: string;
  tagColor: string;
  valueBadge: string;
  promoCode?: string;
  description: string;
  highlights: string[];
  terms: string;
  redemptionSteps: string[];
  platformLink?: string;
  platformLinkText?: string;
  externalLink?: string;
  externalLinkText?: string;
}

const PERKS_DATA: PerkItem[] = [
  {
    id: 'womens-ip-world',
    title: "The Women's IP World Annual (2027)",
    provider: "The Women's IP World",
    category: 'discounts',
    categoryLabel: 'Discounts & Publishing',
    categoryColor: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    image: '/images/womens-ip-world-cover.png',
    imageType: 'cover',
    tag: '35% Member Discount',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    valueBadge: 'Save up to £1,398.25',
    promoCode: 'WIPA35WORLD',
    description: "Global digital and print publication celebrating the work and achievements of women across intellectual property law and innovation. Alliance members receive an exclusive 35% preferential rate on editorial articles, practitioner profiles, and display advertisements.",
    highlights: [
      "35% off full profile & editorial packages (Standard £3,995 → Member £2,596.75)",
      "35% off two-page standalone articles (Standard £2,995 → Member £1,946.75)",
      "Full-, half-, and quarter-page print and digital advertisements",
      "Reach 17,000+ digital readers and 7,500 print copies across print, digital, and audio"
    ],
    terms: "Exclusive to active Women's IP Alliance members. Placements and premium positions remain subject to editorial calendar availability.",
    redemptionSteps: [
      "Select your desired editorial format or advertising placement.",
      "Quote promo code WIPA35WORLD when submitting your booking enquiry.",
      "Your 35% member rate will be applied directly to your editorial invoice."
    ],
    platformLink: '/platform/publications',
    platformLinkText: 'View Publications Hub',
    externalLink: 'https://www.womensipworld.com',
    externalLinkText: 'Visit womensipworld.com'
  },
  {
    id: 'global-ip-magazine',
    title: 'The Global IP Magazine',
    provider: 'The Global IP Magazine',
    category: 'discounts',
    categoryLabel: 'Discounts & Publishing',
    categoryColor: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    image: '/images/global-ip-magazine-cover.png',
    imageType: 'cover',
    tag: '35% Member Discount',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    valueBadge: 'Save 35% on All Placements',
    promoCode: 'WIPAMAG35',
    description: "Tri-annual industry publication reaching over 20,000 IP professionals across print, digital, and audio formats. Feature your firm's cross-border practice, regional regulatory updates, and commercial IP strategy at preferential rates.",
    highlights: [
      "35% discount across one-page and two-page editorial articles",
      "Preferred positioning for inside front and outside back covers",
      "Digital banner placements across the online publication",
      "Included non-intrusive audio article narration feature"
    ],
    terms: "Available only to active Alliance members. Editorial content remains subject to editorial board review.",
    redemptionSteps: [
      "Review the current editorial calendar and issue themes.",
      "Quote code WIPAMAG35 in your submission or reserve request.",
      "Your dedicated publishing coordinator will apply the 35% deduction."
    ],
    platformLink: '/platform/publications',
    platformLinkText: 'View Publications Hub',
    externalLink: 'https://www.womensipworld.com',
    externalLinkText: 'Visit Magazine Site'
  },
  {
    id: 'ip-tech-annual',
    title: 'The IP Tech & Innovation Services Annual 2027',
    provider: 'IP Tech & Innovation Services',
    category: 'discounts',
    categoryLabel: 'Discounts & Publishing',
    categoryColor: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    image: '/images/ip-tech-annual-cover.png',
    imageType: 'cover',
    tag: '35% Member Rate (Public gets 10%)',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    valueBadge: 'Exclusive Preferential Rate',
    promoCode: 'WIPAINNOV35',
    description: "Dedicated annual directory and publication focused on the intersection of intellectual property law, legal technology, AI patent platforms, and operational service providers.",
    highlights: [
      "Technology & Product Spotlights for AI software, analytics tools, and IP platforms",
      "Service Provider Showcases for law firms, valuation teams, and consultants",
      "Thought leadership commentary on patent office automation and digital enforcement",
      "Audio and digital distribution to corporate IP counsels worldwide"
    ],
    terms: "Standard public direct-enquiry discount is 10%. Active Alliance members receive an exclusive 35% rate.",
    redemptionSteps: [
      "Contact the editorial team through the publication portal.",
      "Provide your WIPA member ID and quote code WIPAINNOV35.",
      "The 35% discount is calculated against published media-pack rates."
    ],
    platformLink: '/platform/publications',
    platformLinkText: 'View Publications Hub',
    externalLink: 'https://www.iptechnovation.com',
    externalLinkText: 'Visit iptechnovation.com'
  },
  {
    id: 'lexisnexis-research',
    title: 'LexisNexis® IP Global Intelligence Series',
    provider: 'LexisNexis® IP',
    category: 'discounts',
    categoryLabel: 'Discounts & Publishing',
    categoryColor: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    image: '/lexisnexis-logo.png',
    imageType: 'logo',
    tag: 'Complimentary Access',
    tagColor: 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    valueBadge: '£450 Value / Report',
    promoCode: 'WIPALEXISVIP',
    description: "Unrestricted download access to authoritative research whitepapers, Patent Asset Index benchmark studies, and cross-border patent prosecution trend decks compiled by LexisNexis senior analysts.",
    highlights: [
      "Global patent filing trends across USPTO, EPO, JPO, and CNIPA",
      "Standard Essential Patent (SEP) dynamics in 5G, telecom, and artificial intelligence",
      "Examiner allowance predictors and art unit difficulty benchmark tables",
      "Quarterly briefing webinars with LexisNexis chief IP economists"
    ],
    terms: "Available at no cost to all authenticated WIPA members via the IP Intelligence portal.",
    redemptionSteps: [
      "Navigate to the IP Intelligence Hub on the WIPA platform.",
      "Access the Research & Benchmark tab.",
      "Download any whitepaper or dataset directly to your device."
    ],
    platformLink: '/platform/intelligence',
    platformLinkText: 'Open IP Intelligence Hub'
  },
  {
    id: 'cle-webinars',
    title: 'Live Accredited CLE Webinars & IP Masterclasses',
    provider: 'WIPA Academy & CLE Board',
    category: 'webinars',
    categoryLabel: 'Webinars & Masterclasses',
    categoryColor: 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    image: '/resource3.jpg',
    imageType: 'photo',
    tag: '100% Free for Members',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    valueBadge: '£149 Value per Session',
    description: "Monthly live interactive masterclasses delivered by renowned patent attorneys, litigators, and judges. Topics range from AI patentability hurdles to cross-border licensing, with formal CLE credit certificates provided upon completion.",
    highlights: [
      "Free live registration for all upcoming masterclasses and CLE sessions",
      "Accredited Continuing Legal Education (CLE) certificates of attendance",
      "Interactive live Q&A with keynote instructors and panel speakers",
      "Comprehensive digital study packs and presentation slide decks"
    ],
    terms: "Unlimited free registration for active Alliance members. Non-member registration rate is £149 per masterclass.",
    redemptionSteps: [
      "Browse the upcoming webinar calendar in the Resource Library.",
      "Click 'Register as Member' with your logged-in account.",
      "Your seat confirmation and calendar invite are generated automatically."
    ],
    platformLink: '/platform/resources/webinars',
    platformLinkText: 'Browse Upcoming Webinars'
  },
  {
    id: 'board-roundtables',
    title: 'Advisory Board & General Counsel Virtual Roundtables',
    provider: 'WIPA Executive Council',
    category: 'webinars',
    categoryLabel: 'Webinars & Masterclasses',
    categoryColor: 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    image: '/resourceimg1.jpg',
    imageType: 'photo',
    tag: 'Member Exclusive',
    tagColor: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    valueBadge: 'Private Small-Group Sessions',
    description: "Chatham House Rule virtual roundtables connecting active members with WIPA Advisory Board directors and Fortune 500 IP Chief Counsel for frank discussions on career progression, firm equity, and emerging regulatory hurdles.",
    highlights: [
      "Strictly limited to 25 verified members per session to preserve authentic discussion",
      "Direct dialogue with senior in-house IP directors and firm managing partners",
      "Quarterly sessions covering leadership, fee negotiation, and AI governance",
      "Confidential, unrecorded format enabling transparent peer exchange"
    ],
    terms: "Registration opens 14 days prior to each session on a first-come, first-served basis for active members.",
    redemptionSteps: [
      "Watch the Platform Events tab for quarterly roundtable announcements.",
      "Select 'Reserve Member Seat' before the 25-participant capacity is reached.",
      "Access credentials and discussion briefing notes are sent 48 hours prior."
    ],
    platformLink: '/platform/events',
    platformLinkText: 'View Events Calendar'
  },
  {
    id: 'summit-passes',
    title: 'WIPA Annual Global Summit — VIP Pass & Early Bird',
    provider: "Women's IP Alliance",
    category: 'webinars',
    categoryLabel: 'Webinars & Masterclasses',
    categoryColor: 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    image: '/AD1.png',
    imageType: 'photo',
    tag: 'Priority Access & Member Rate',
    tagColor: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    valueBadge: 'Save £250 on Delegate Tickets',
    promoCode: 'WIPASUMMITVIP',
    description: "Exclusive member registration windows, priority keynote seating, and 25% discounted delegate passes for the Women's IP Alliance Annual Global Summit and regional symposiums.",
    highlights: [
      "Early-bird reservation window 3 weeks before public ticket release",
      "25% discount across in-person delegate and virtual livestream passes",
      "Exclusive access to the Alliance Member VIP Reception & Networking Lounge",
      "Priority submission review for panel speaker and workshop host applications"
    ],
    terms: "Member discount applies to active accounts at time of purchase. Valid for all standard and executive delegate tiers.",
    redemptionSteps: [
      "Visit the Summit registration page via the Events portal.",
      "Apply code WIPASUMMITVIP at checkout.",
      "Your member verification badge is automatically printed on your delegate pass."
    ],
    platformLink: '/platform/events',
    platformLinkText: 'Check Summit Dates'
  },
  {
    id: 'webinar-vault',
    title: 'Webinar & Masterclass On-Demand Video Vault',
    provider: 'WIPA Knowledge Center',
    category: 'webinars',
    categoryLabel: 'Webinars & Masterclasses',
    categoryColor: 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    image: '/wipa-intro-thumb.jpg',
    imageType: 'photo',
    tag: 'Unrestricted Streaming',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    valueBadge: '60+ Hours of Legal CPD',
    description: "Stream every past WIPA masterclass, panel discussion, and keynote presentation on-demand with synchronized slides, speaker bios, and downloadable reference handouts.",
    highlights: [
      "Full high-definition recordings of 40+ past webinars and workshops",
      "Searchable video transcripts and timestamped speaker navigation",
      "Downloadable speaker handouts, case summaries, and reading lists",
      "Self-paced learning with completion certificates for your CPD record"
    ],
    terms: "Full on-demand library included as an active member benefit with zero paywalls.",
    redemptionSteps: [
      "Open the Webinars & Learning section of the Resource Library.",
      "Switch to the 'Past Masterclasses' archive tab.",
      "Click any recording to stream instantly in your browser."
    ],
    platformLink: '/platform/resources/webinars',
    platformLinkText: 'Open Webinar Vault'
  },
  {
    id: 'sally-ip',
    title: 'Sally IP — AI Legal & Patent Co-Pilot',
    provider: 'Sally IP Intelligence',
    category: 'tools',
    categoryLabel: 'AI & Legal Tech Tools',
    categoryColor: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    image: '/sally-logo.png',
    imageType: 'logo',
    tag: 'Monthly Credits Included',
    tagColor: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    valueBadge: 'Save 20% on Pro Plans',
    promoCode: 'SALLYWIPA20',
    description: "Next-generation AI legal co-pilot built specifically for patent and trademark attorneys. Conduct sub-second case law retrieval, draft office action responses, and query 410+ legal templates in one unified workspace.",
    highlights: [
      "Monthly starter AI research and drafting credit allowance included with membership",
      "20% ongoing member discount on Pro (£499/mo) and Business (£699/mo) allocations",
      "Zero data retention guarantee: your client prompts and drafts are never used to train models",
      "Multi-jurisdiction case law support across USPTO, EPO, UKIPO, and CNIPA"
    ],
    terms: "Monthly free credit allowance replenishes on the first of each month. 20% discount code applies to ongoing monthly subscriptions.",
    redemptionSteps: [
      "Navigate to Explore Sally IP in the platform sidebar.",
      "Starter credits are automatically credited to your member account.",
      "To upgrade to high-volume Pro/Business tiers, apply code SALLYWIPA20."
    ],
    platformLink: '/platform/sallyip',
    platformLinkText: 'Launch Sally IP Workspace'
  },
  {
    id: 'lexisnexis-platform',
    title: 'LexisNexis® IP Intelligence Command Center',
    provider: 'LexisNexis® IP',
    category: 'tools',
    categoryLabel: 'AI & Legal Tech Tools',
    categoryColor: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    image: '/lexisnexis-logo.png',
    imageType: 'logo',
    tag: '30-Day VIP Access',
    tagColor: 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    valueBadge: 'Enterprise Trial (£1,200 Value)',
    promoCode: 'LEXIS30WIPA',
    description: "Native platform integration providing direct access to the LexisNexis Patent Landscape Visualizer, PatentAdvisor® examiner difficulty predictor, and IPlytics standard essential patent (SEP) tracking.",
    highlights: [
      "Extended 30-day guided VIP trial for Alliance members and their practice groups",
      "Examiner allowance matrix and art unit difficulty forecasting",
      "PatentOptimizer™ claim antecedent basis and clarity checking",
      "Shepard's® citation validator embedded directly inside research workflows"
    ],
    terms: "Available to active members who have not activated an institutional trial in the last 12 months.",
    redemptionSteps: [
      "Open the IP Intelligence Hub from your left sidebar navigation.",
      "Click 'Activate 30-Day VIP Access' in the header banner.",
      "Confirm your firm email address to activate live analytics."
    ],
    platformLink: '/platform/intelligence',
    platformLinkText: 'Open IP Intelligence Hub'
  },
  {
    id: 'genie-ai',
    title: 'Genie AI Legal Workflow Suite',
    provider: 'Genie AI',
    category: 'tools',
    categoryLabel: 'AI & Legal Tech Tools',
    categoryColor: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    image: '/genie-ai-logo.png',
    imageType: 'logo',
    tag: 'Partner Software Perk',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    valueBadge: 'Free Contract Repository',
    description: "Access a comprehensive repository of standardized commercial agreements, IP licensing frameworks, technology transfer contracts, and mutual non-disclosure agreements tailored for IP practices.",
    highlights: [
      "Access to 1,000+ open-source IP and commercial agreement templates",
      "Automated redlining and clause comparison tools",
      "Plain-language legal term summaries for client advisory letters",
      "One-click export to Microsoft Word (.docx) with preserved formatting"
    ],
    terms: "Integration features are directly accessible to all authenticated WIPA members.",
    redemptionSteps: [
      "Browse the Guides & Toolkits section under the Resource Library.",
      "Filter by 'Licensing & Commercial Contracts'.",
      "Download or edit documents directly in the browser."
    ],
    platformLink: '/platform/resources/guides-toolkits',
    platformLinkText: 'Open Document Library'
  },
  {
    id: 'curated-toolkits',
    title: 'Curated IP Practice Toolkits & Playbooks',
    provider: 'WIPA Practice Operations',
    category: 'tools',
    categoryLabel: 'AI & Legal Tech Tools',
    categoryColor: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    image: '/resourceimg2.jpg',
    imageType: 'photo',
    tag: 'Full Library Unlocked',
    tagColor: 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    valueBadge: '410+ Legal Assets',
    description: "Practitioner-ready operational playbooks, checklists, and templates authored by senior patent attorneys and litigation partners. Save dozens of drafting hours on routine filings and client memos.",
    highlights: [
      "USPTO Section 101 / Alice Rejection Response Playbook & decision trees",
      "Patent & Trademark M&A Due Diligence Audit Workbook (Interactive Excel model)",
      "Trade Secret Audit & Employee Onboarding/Offboarding Enforcement Pack",
      "EPO Opposition Procedure Timeline & Written Argument Skeleton Arguments"
    ],
    terms: "Unrestricted download of all Word, Excel, and PDF assets included with membership.",
    redemptionSteps: [
      "Open the Resource Library from the main navigation.",
      "Select 'Guides & Toolkits' from the directory tabs.",
      "Click any asset to view its intended use cases and download files."
    ],
    platformLink: '/platform/resources/guides-toolkits',
    platformLinkText: 'Explore Toolkits'
  },
  {
    id: 'mentorship',
    title: 'Executive 1:1 Mentorship Matching',
    provider: 'WIPA Mentorship Council',
    category: 'career',
    categoryLabel: 'Career & Mentorship',
    categoryColor: 'text-sky-700 bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
    image: '/course_speaking_1783622343431.png',
    imageType: 'photo',
    tag: 'Included with Membership',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    valueBadge: 'Personal Executive Matching',
    description: "Structured 6-month mentorship pairing connecting aspiring attorneys, associates, and innovators with veteran IP Directors, Partners, and General Counsels across your target practice area.",
    highlights: [
      "Personalized matching based on jurisdiction, practice vertical, and career goals",
      "Structured quarterly milestone guidebooks and confidential check-in schedules",
      "Career transition pathways: Private practice to in-house counsel, partnership prep",
      "Mentor community roundtables and private networking mixers"
    ],
    terms: "Available to all active members. Mentorship cohorts launch biannually in spring and autumn.",
    redemptionSteps: [
      "Navigate to the Mentorship portal in the sidebar navigation.",
      "Complete your mentee or mentor intake profile and practice focus.",
      "The Mentorship Council reviews applications and issues cohort matches."
    ],
    platformLink: '/platform/mentorship',
    platformLinkText: 'Go to Mentorship Hub'
  },
  {
    id: 'jobs-board',
    title: 'Complimentary Firm Job Board Postings',
    provider: 'WIPA Jobs Board',
    category: 'career',
    categoryLabel: 'Career & Mentorship',
    categoryColor: 'text-sky-700 bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
    image: '/JOBAD1.png',
    imageType: 'photo',
    tag: '2 Free Listings / Year',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    valueBadge: 'Save £900 per Year',
    promoCode: 'WIPAJOBSFREE',
    description: "Attract top-tier patent attorneys, trademark agents, IP paralegals, and legal engineers. Active members receive two complimentary 60-day featured job listings per year for their firm or company.",
    highlights: [
      "Two free 60-day job listings per year (standard non-member rate £450 per listing)",
      "Featured placement in weekly platform job alert emails sent to 10,000+ IP professionals",
      "Direct applicant message routing and CV downloads in your employer dashboard",
      "Confidential/blind hiring options for sensitive executive lateral transitions"
    ],
    terms: "Two complimentary listings per member firm per calendar year. Additional listings discounted by 25%.",
    redemptionSteps: [
      "Navigate to the Jobs Board and click 'Post a Vacancy'.",
      "Complete your job description, salary range, and application URL.",
      "Apply code WIPAJOBSFREE at checkout to reduce your balance to £0."
    ],
    platformLink: '/platform/jobs',
    platformLinkText: 'Go to Jobs Board'
  },
  {
    id: 'member-credential',
    title: 'Verified Alliance Member Directory Credential & Spotlight',
    provider: 'WIPA Trust & Identity',
    category: 'career',
    categoryLabel: 'Career & Mentorship',
    categoryColor: 'text-sky-700 bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
    image: '/WIPA-Logo.png',
    imageType: 'logo',
    tag: 'Profile Privilege',
    tagColor: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    valueBadge: 'Global Visibility',
    description: "Distinguish your practice with the verified Alliance Member credential on your public and platform profile. Boost your referral opportunities among corporate counsel seeking specialist outside counsel.",
    highlights: [
      "Verified Member badge displaying on directory cards and forum contributions",
      "Priority ranking in the global member search directory by practice area and city",
      "Eligibility for the 'Member Spotlight' feature on platform home feed and social channels",
      "Customizable shareable public profile link for your email signature and firm biography"
    ],
    terms: "Automatically granted to all members upon completing 80% or more of their platform profile.",
    redemptionSteps: [
      "Visit your platform profile to verify your experience and practice area.",
      "Your verified member credential will automatically activate.",
      "Copy your public profile URL from your profile settings."
    ],
    platformLink: '/platform/profile',
    platformLinkText: 'View My Profile'
  },
  {
    id: 'unh-law',
    title: 'Academic Alliances: UNH Franklin Pierce School of Law',
    provider: 'UNH Franklin Pierce School of Law',
    category: 'career',
    categoryLabel: 'Career & Mentorship',
    categoryColor: 'text-sky-700 bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
    image: '/unh_light.png',
    imageType: 'logo',
    tag: 'Academic Partner Discount',
    tagColor: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    valueBadge: '15% Tuition Reduction',
    promoCode: 'WIPAUNH15',
    description: "Special preferential tuition rates and executive scholarship allocations for WIPA members enrolling in University of New Hampshire Franklin Pierce School of Law IP certificate and LL.M. programs.",
    highlights: [
      "15% tuition discount on executive IP certificates and continuing education modules",
      "Priority admission consideration for summer intellectual property institutes",
      "Invitations to joint academic symposiums, paper submissions, and faculty lectures",
      "Digital library reciprocal research privileges for enrolled certificate candidates"
    ],
    terms: "Valid for active members admitted to qualifying executive education and certificate programs.",
    redemptionSteps: [
      "Contact the UNH Law Graduate Admissions office.",
      "Indicate your active Women's IP Alliance membership.",
      "Provide promo code WIPAUNH15 on your registration application."
    ],
    platformLink: '/platform/resources/education',
    platformLinkText: 'View Education Hub',
    externalLink: 'https://law.unh.edu',
    externalLinkText: 'Visit law.unh.edu'
  }
];

const FAQS = [
  {
    question: "How do I claim the 35% discount on publications?",
    answer: "Each publication has a dedicated Alliance member code (e.g., WIPA35WORLD, WIPAMAG35, WIPAINNOV35). When inquiring with the editorial or advertising team, or booking via the platform Publications hub, quote your code. Your 35% discount will be applied directly against the standard media-pack rates."
  },
  {
    question: "Are all webinars and masterclasses free for active members?",
    answer: "Yes. All live webinars, accredited Continuing Legal Education (CLE) sessions, and virtual roundtables hosted by WIPA are 100% complimentary for active members. Non-members pay the standard rate of £149 per session. Certificates of attendance are issued automatically upon session completion."
  },
  {
    question: "How do I access my included Sally IP AI credits?",
    answer: "Every active Alliance member receives a complimentary monthly starter allocation of research and document drafting credits. Simply open Explore Sally IP from the left sidebar. Your credits replenish automatically on the first day of each calendar month. If your firm requires high-volume Pro tiers, use code SALLYWIPA20 for 20% off."
  },
  {
    question: "Can I use my firm job board posting perk right away?",
    answer: "Yes. Every active member firm receives two free 60-day featured job listings per calendar year (saving £900). Simply go to the Jobs Board, click 'Post a Vacancy', fill in your listing details, and apply code WIPAJOBSFREE at checkout to reduce your balance to £0."
  }
];

export default function PlatformPerksPage() {
  const { user } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerk, setSelectedPerk] = useState<PerkItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const filteredPerks = useMemo(() => {
    return PERKS_DATA.filter((perk) => {
      const matchesCategory = activeCategory === 'all' || perk.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        perk.title.toLowerCase().includes(q) ||
        perk.provider.toLowerCase().includes(q) ||
        perk.description.toLowerCase().includes(q) ||
        perk.tag.toLowerCase().includes(q) ||
        perk.highlights.some(h => h.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const categories: { id: CategoryType; label: string; count: number }[] = [
    { id: 'all', label: 'All Perks', count: PERKS_DATA.length },
    { id: 'discounts', label: 'Discounts & Publishing', count: PERKS_DATA.filter(p => p.category === 'discounts').length },
    { id: 'webinars', label: 'Webinars & Masterclasses', count: PERKS_DATA.filter(p => p.category === 'webinars').length },
    { id: 'tools', label: 'AI & Legal Tech Tools', count: PERKS_DATA.filter(p => p.category === 'tools').length },
    { id: 'career', label: 'Career & Mentorship', count: PERKS_DATA.filter(p => p.category === 'career').length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0c1222] dark:text-slate-100 pb-24">
      
      {/* Top Header Section */}
      <section className="w-full bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-12">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
            <Link href="/platform" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              Platform
            </Link>
            <span>/</span>
            <span className="text-[#5a32fa] dark:text-purple-400 font-bold">
              Member Perks
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                Member <span className="text-[#5a32fa] dark:text-purple-400">Perks</span> & Privileges
              </h1>

              <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Exclusive 35% publication savings, complimentary accredited CLE webinars, included AI research credits, and partner privileges reserved for active Women's IP Alliance members.
              </p>
            </div>

            {/* Member Status Box */}
            <div className="bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5 flex flex-col justify-between min-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Membership Status
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Active Member
                </span>
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {user?.name || 'Alliance Practitioner'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                All 35% publication savings and platform tools unlocked
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Link
                  href="/platform/memberships"
                  className="text-xs font-bold text-[#5a32fa] dark:text-purple-400 hover:underline"
                >
                  Manage Membership Tiers
                </Link>
              </div>
            </div>
          </div>

          {/* Key Value Metric Grid */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-slate-800 rounded-lg p-4">
              <span className="text-2xl sm:text-3xl font-black text-[#5a32fa] dark:text-purple-400">35% Off</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                Top IP Publications
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Women's IP World, Global IP Magazine & Tech Annual
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-slate-800 rounded-lg p-4">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">100% Free</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                Accredited CLE Webinars
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Monthly live masterclasses + 60h video vault
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-slate-800 rounded-lg p-4">
              <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">Included</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                Sally IP AI Credits
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Complimentary patent research & drafting tokens
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-slate-800 rounded-lg p-4">
              <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">410+</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                Legal Practice Toolkits
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Alice 101 playbooks, M&A models, & contract templates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 pt-8">

        {/* FEATURED SPOTLIGHT: 35% Publications Advantage */}
        <div className="mb-10 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-[#5a32fa] dark:text-purple-400 mb-2">
                Flagship Advantage · 35% Publishing Discount
              </p>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Turn your Alliance membership into greater global visibility
              </h2>

              <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                Active Alliance members receive an exclusive 35% discount across editorial articles, professional profiles, and display advertising in three specialist publications reaching over 40,000 IP practitioners globally.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-[#172033] rounded-lg border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Women's IP World</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Save up to £1,398 / package</p>
                  <p className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">Code: WIPA35WORLD</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-[#172033] rounded-lg border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Global IP Magazine</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">35% off all editorial & ads</p>
                  <p className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">Code: WIPAMAG35</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-[#172033] rounded-lg border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">IP Tech Annual 2027</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">35% rate (Public gets 10%)</p>
                  <p className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">Code: WIPAINNOV35</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/platform/publications"
                  className="px-5 py-2.5 rounded-lg bg-[#5a32fa] hover:bg-[#4a24e0] text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Explore Publications Hub
                </Link>
                <button
                  onClick={() => setSelectedPerk(PERKS_DATA[0])}
                  className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  View Rate Card & Claim Code
                </button>
              </div>
            </div>

            {/* Real Publication Covers Showcase */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className="relative w-24 sm:w-28 md:w-32 aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm transition-transform hover:-translate-y-1">
                <Image
                  src="/images/womens-ip-world-cover.png"
                  alt="Women's IP World Annual Cover"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-24 sm:w-28 md:w-32 aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm transition-transform hover:-translate-y-1 -mt-4">
                <Image
                  src="/images/global-ip-magazine-cover.png"
                  alt="Global IP Magazine Cover"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-24 sm:w-28 md:w-32 aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm transition-transform hover:-translate-y-1">
                <Image
                  src="/images/ip-tech-annual-cover.png"
                  alt="IP Tech & Innovation Annual Cover"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Category Tabs (Clean border-bottom tabs matching platform) */}
          <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800 flex-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`pb-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                    isActive
                      ? 'border-[#5a32fa] text-[#5a32fa] dark:text-purple-400'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search perks..."
              className="w-full pl-9 pr-8 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[#5a32fa]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Results Count Banner */}
        <div className="mb-6 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>Showing {filteredPerks.length} member privileges</span>
          {searchQuery && (
            <span>Filtered by "{searchQuery}"</span>
          )}
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPerks.map((perk) => (
            <div
              key={perk.id}
              className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-xs hover:shadow-md group"
            >
              {/* Card Image / Cover Section */}
              <div className="relative w-full h-48 bg-slate-100 dark:bg-[#172033] border-b border-slate-200 dark:border-slate-800 flex items-center justify-center p-4 overflow-hidden">
                {perk.imageType === 'cover' ? (
                  <div className="relative h-full aspect-[3/4] rounded-sm overflow-hidden shadow-sm">
                    <Image
                      src={perk.image}
                      alt={perk.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : perk.imageType === 'logo' ? (
                  <div className="relative w-44 h-16 flex items-center justify-center">
                    <Image
                      src={perk.image}
                      alt={perk.provider}
                      fill
                      className="object-contain dark:brightness-110"
                    />
                  </div>
                ) : (
                  <Image
                    src={perk.image}
                    alt={perk.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider mb-2">
                    <span className="text-[#5a32fa] dark:text-purple-400">{perk.provider}</span>
                    <span className="text-slate-500 dark:text-slate-400">{perk.tag}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#5a32fa] dark:group-hover:text-purple-400 transition-colors leading-snug">
                    {perk.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {perk.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    {perk.highlights.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <span className="text-slate-400 select-none">–</span>
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">
                      Advantage
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {perk.valueBadge}
                    </span>
                  </div>

                  {perk.promoCode && (
                    <div className="mb-3 px-3 py-1.5 rounded bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Code
                      </span>
                      <span className="font-mono font-bold text-[#5a32fa] dark:text-purple-400">
                        {perk.promoCode}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPerk(perk)}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-[#5a32fa] dark:hover:bg-purple-400 dark:hover:text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors text-center cursor-pointer"
                    >
                      {perk.promoCode ? 'View Code & Rates' : 'View Details'}
                    </button>

                    {perk.platformLink && (
                      <Link
                        href={perk.platformLink}
                        className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors text-center"
                        title={perk.platformLinkText || 'Open Tool'}
                      >
                        Open
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPerks.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg p-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching perks found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              We couldn't find any privileges matching "{searchQuery}". Try searching for publications, webinars, Sally IP, or CLE.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#5a32fa] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Member Questions & Guidance FAQ */}
        <div className="mt-16 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Frequently Asked Questions About Member Privileges
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            Everything you need to know about redeeming publication discounts, accessing webinars, and utilizing software credits.
          </p>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 bg-slate-50 dark:bg-[#172033] hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between gap-4"
                  >
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white dark:bg-[#111827] text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Assistance / Support Banner */}
        <div className="mt-8 bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Need assistance with an institutional booking or bespoke discount?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Our Member Experience team is available via live support to assist with multi-attorney packages and publication deadlines.
            </p>
          </div>
          <Link
            href="/platform/chat-support"
            className="px-4 py-2.5 rounded-xl bg-[#5a32fa] text-white hover:bg-[#4d25db] font-bold text-xs transition-colors shrink-0 text-center"
          >
            Contact Live Support
          </Link>
        </div>

      </div>

      {/* Perk Detail & Redemption Modal */}
      {selectedPerk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#5a32fa] dark:text-purple-400 mb-1">
                  {selectedPerk.categoryLabel} · {selectedPerk.tag}
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedPerk.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Provided by {selectedPerk.provider}
                </p>
              </div>

              <button
                onClick={() => setSelectedPerk(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Promo Code Box (if perk has a discount code) */}
              {selectedPerk.promoCode && (
                <div className="p-4 bg-purple-50 dark:bg-[#1b1730] border border-purple-200 dark:border-purple-800 rounded-lg">
                  <p className="text-xs font-bold text-[#5a32fa] dark:text-purple-300 uppercase tracking-wider mb-2">
                    Alliance Member Promotional Code
                  </p>
                  <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#111827] border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                    <span className="font-mono text-base font-black tracking-wider text-slate-900 dark:text-white">
                      {selectedPerk.promoCode}
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedPerk.promoCode!)}
                      className="px-3 py-1.5 rounded-md bg-[#5a32fa] hover:bg-[#4822d4] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      {copiedCode === selectedPerk.promoCode ? 'Copied' : 'Copy Code'}
                    </button>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Benefit Overview
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedPerk.description}
                </p>
              </div>

              {/* What's Included */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  What Is Included
                </h4>
                <div className="space-y-2">
                  {selectedPerk.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span className="text-slate-400 select-none">–</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Redemption Instructions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  How To Redeem
                </h4>
                <ol className="space-y-2">
                  {selectedPerk.redemptionSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span className="flex items-center justify-center w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Terms and Eligibility */}
              <div className="p-3 bg-slate-50 dark:bg-[#172033] rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-700 dark:text-slate-300 font-semibold">Eligibility: </strong>
                  {selectedPerk.terms}
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#172033] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setSelectedPerk(null)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedPerk.externalLink && (
                  <a
                    href={selectedPerk.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <span>{selectedPerk.externalLinkText || 'Visit Partner Website'}</span>
                    <ExternalLink size={13} />
                  </a>
                )}

                {selectedPerk.platformLink && (
                  <Link
                    href={selectedPerk.platformLink}
                    className="px-4 py-2 rounded-xl bg-[#5a32fa] hover:bg-[#4822d4] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{selectedPerk.platformLinkText || 'Open in Platform'}</span>
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

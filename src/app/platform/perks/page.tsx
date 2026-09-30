'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  X, 
  ExternalLink, 
  ArrowRight, 
  Copy, 
  Check, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

type CategoryType = 'all' | 'discounts' | 'tools' | 'webinars' | 'career';

interface PerkItem {
  id: string;
  title: string;
  provider: string;
  category: CategoryType;
  categoryLabel: string;
  benefit: string;
  subtitle: string;
  promoCode?: string;
  image: string;
  imageType: 'cover' | 'logo' | 'photo';
  platformLink?: string;
  platformLinkText?: string;
  externalLink?: string;
  externalLinkText?: string;
  highlights?: string[];
}

const PERKS: PerkItem[] = [
  {
    id: 'womens-ip-world',
    title: "The Women's IP World Annual",
    provider: "The Women's IP World",
    category: 'discounts',
    categoryLabel: 'Publishing',
    benefit: '35% OFF',
    subtitle: 'Preferential rates on global editorial profiles, practitioner spotlights, and print display.',
    promoCode: 'WIPA35WORLD',
    image: '/images/womens-ip-world-cover.png',
    imageType: 'cover',
    platformLink: '/platform/publications',
    platformLinkText: 'Publications Hub',
    externalLink: 'https://www.womensipworld.com',
    highlights: [
      '35% off two-page standalone and full profile packages',
      'Print, digital, and audio distribution to 17,000+ readers',
      'Preferred positioning in the 2027 Annual Edition'
    ]
  },
  {
    id: 'global-ip-magazine',
    title: 'The Global IP Magazine',
    provider: 'Global IP Publications',
    category: 'discounts',
    categoryLabel: 'Publishing',
    benefit: '35% OFF',
    subtitle: 'Tri-annual international journal reaching 20,000+ cross-border IP practitioners.',
    promoCode: 'WIPAMAG35',
    image: '/images/global-ip-magazine-cover.png',
    imageType: 'cover',
    platformLink: '/platform/publications',
    platformLinkText: 'Publications Hub',
    externalLink: 'https://www.womensipworld.com',
    highlights: [
      '35% discount across all editorial and display placements',
      'Inside front & back cover priority reservation',
      'Non-intrusive audio article narration feature included'
    ]
  },
  {
    id: 'ip-tech-annual',
    title: 'IP Tech & Innovation Annual',
    provider: 'IP Tech Media',
    category: 'discounts',
    categoryLabel: 'Publishing',
    benefit: '35% OFF',
    subtitle: 'Showcase AI software, patent platforms, and legaltech services to corporate counsels.',
    promoCode: 'WIPAINNOV35',
    image: '/images/ip-tech-annual-cover.png',
    imageType: 'cover',
    platformLink: '/platform/publications',
    platformLinkText: 'Publications Hub',
    externalLink: 'https://www.iptechnovation.com',
    highlights: [
      'Exclusive 35% rate for Alliance members (Public rate: 10%)',
      'Dedicated software showcase & tech spotlight pages',
      'Worldwide circulation across tech-forward IP legal teams'
    ]
  },
  {
    id: 'genie-ai',
    title: 'Genie AI Legal Suite',
    provider: 'Genie AI',
    category: 'tools',
    categoryLabel: 'AI & Tools',
    benefit: '25% OFF',
    subtitle: 'AI-powered legal drafting, 1,000+ commercial contract templates, and instant redlining.',
    promoCode: 'WIPA25',
    image: '/genie-ai-logo.png',
    imageType: 'logo',
    platformLink: '/platform/resources/ip-services/genie-ai',
    platformLinkText: 'Genie AI Portal',
    externalLink: 'https://www.genieai.co/partners/wipa',
    highlights: [
      '25% discount on Genie Pro for the first 12 months',
      '1,000+ verified IP and commercial contract precedents',
      'Specialist AI precision tuned for multi-jurisdiction agreements'
    ]
  },
  {
    id: 'sally-ip',
    title: 'Sally IP Legal Co-Pilot',
    provider: 'Sally IP Intelligence',
    category: 'tools',
    categoryLabel: 'AI & Tools',
    benefit: '20% OFF + Credits',
    subtitle: 'Sub-second patent case law retrieval, office action drafting, and monthly starter credits.',
    promoCode: 'SALLYWIPA20',
    image: '/sally-logo.png',
    imageType: 'logo',
    platformLink: '/platform/sallyip',
    platformLinkText: 'Launch Sally IP',
    highlights: [
      'Monthly complimentary AI research and drafting allowance',
      '20% ongoing member discount on Pro and Business allocations',
      'Zero client data retention guarantee on all queries'
    ]
  },
  {
    id: 'lexisnexis-intel',
    title: 'LexisNexis® IP Intelligence',
    provider: 'LexisNexis® IP',
    category: 'tools',
    categoryLabel: 'AI & Tools',
    benefit: '30-Day VIP Pass',
    subtitle: 'Extended guided access to PatentSight+™, PatentAdvisor®, and SEP landscape tools.',
    promoCode: 'LEXIS30WIPA',
    image: '/lexisnexis-logo.png',
    imageType: 'logo',
    platformLink: '/platform/intelligence',
    platformLinkText: 'IP Intelligence Hub',
    highlights: [
      'Complimentary access to global patent benchmark dossiers',
      'Examiner allowance predictors and art unit matrices',
      'Comprehensive claim antecedent and clarity analysis'
    ]
  },
  {
    id: 'cle-webinars',
    title: 'Accredited CLE Masterclasses',
    provider: 'WIPA Academy',
    category: 'webinars',
    categoryLabel: 'CLE & Learning',
    benefit: '100% FREE',
    subtitle: 'Monthly interactive masterclasses with formal CLE credit certificates of attendance.',
    image: '/resource3.jpg',
    imageType: 'photo',
    platformLink: '/platform/resources/webinars',
    platformLinkText: 'Browse Webinars',
    highlights: [
      'Unlimited free live registrations (Standard fee: £149/session)',
      'Direct interactive Q&A with keynote practitioners and judges',
      'Official Continuing Legal Education completion certificates'
    ]
  },
  {
    id: 'webinar-vault',
    title: 'On-Demand CPD Video Vault',
    provider: 'WIPA Knowledge Center',
    category: 'webinars',
    categoryLabel: 'CLE & Learning',
    benefit: '60+ Hours CPD',
    subtitle: 'Stream 40+ past masterclasses, keynote panels, and workshops with synced handouts.',
    image: '/wipa-intro-thumb.jpg',
    imageType: 'photo',
    platformLink: '/platform/resources/webinars',
    platformLinkText: 'Open Video Vault',
    highlights: [
      'Instant browser playback with timestamped slide navigation',
      'Downloadable speaker slide decks and case law reading lists',
      'Self-paced learning hours trackable for your annual CPD log'
    ]
  },
  {
    id: 'summit-passes',
    title: 'WIPA Global Summit VIP Pass',
    provider: "Women's IP Alliance",
    category: 'webinars',
    categoryLabel: 'CLE & Learning',
    benefit: '25% OFF',
    subtitle: 'Priority registration windows and discounted delegate passes for flagship conferences.',
    promoCode: 'WIPASUMMITVIP',
    image: '/AD1.png',
    imageType: 'photo',
    platformLink: '/platform/events',
    platformLinkText: 'View Events Calendar',
    highlights: [
      'Early-bird booking window 3 weeks before public release',
      '25% discount across in-person and livestream delegate tiers',
      'Alliance Member VIP Reception & Networking Lounge access'
    ]
  },
  {
    id: 'curated-toolkits',
    title: 'Practice Playbooks & Models',
    provider: 'WIPA Operations',
    category: 'tools',
    categoryLabel: 'AI & Tools',
    benefit: '410+ Assets',
    subtitle: 'Practitioner playbooks: Alice 101 decision trees, M&A models, and trade secret packs.',
    image: '/resourceimg2.jpg',
    imageType: 'photo',
    platformLink: '/platform/resources/guides-toolkits',
    platformLinkText: 'Explore Toolkits',
    highlights: [
      'USPTO Section 101 response framework and decision trees',
      'Interactive Excel patent due diligence audit workbook',
      'EPO opposition procedure timeline and skeleton argument briefs'
    ]
  },
  {
    id: 'mentorship',
    title: 'Executive 1:1 Mentorship',
    provider: 'WIPA Mentorship Council',
    category: 'career',
    categoryLabel: 'Career',
    benefit: 'Included',
    subtitle: 'Structured 6-month pairings with senior IP Directors, General Counsels, and firm partners.',
    image: '/course_speaking_1783622343431.png',
    imageType: 'photo',
    platformLink: '/platform/mentorship',
    platformLinkText: 'Mentorship Hub',
    highlights: [
      'Biannual cohorts tailored by jurisdiction and practice vertical',
      'Career transition guidance: Associate to Partner, private to in-house',
      'Private mentor community roundtables and networking mixers'
    ]
  },
  {
    id: 'jobs-board',
    title: 'Firm Job Board Listings',
    provider: 'WIPA Talent Network',
    category: 'career',
    categoryLabel: 'Career',
    benefit: '2 Free / Year',
    subtitle: 'Reach 10,000+ patent and trademark professionals. Save £900 per year on talent acquisition.',
    promoCode: 'WIPAJOBSFREE',
    image: '/JOBAD1.png',
    imageType: 'photo',
    platformLink: '/platform/jobs',
    platformLinkText: 'Post a Vacancy',
    highlights: [
      'Two complimentary 60-day listings per firm per calendar year',
      'Featured placement in weekly IP alert newsletters',
      'Direct candidate messaging and resume downloads'
    ]
  },
  {
    id: 'unh-law',
    title: 'UNH Franklin Pierce School of Law',
    provider: 'Academic Alliances',
    category: 'career',
    categoryLabel: 'Career',
    benefit: '15% OFF',
    subtitle: 'Preferential tuition reduction on executive IP certificates and graduate LL.M. courses.',
    promoCode: 'WIPAUNH15',
    image: '/unh_light.png',
    imageType: 'logo',
    platformLink: '/platform/resources/education',
    platformLinkText: 'Education Hub',
    externalLink: 'https://law.unh.edu',
    highlights: [
      '15% tuition reduction on executive certificate programs',
      'Priority admission review for summer intellectual property institutes',
      'Invitations to joint academic symposiums and guest lectures'
    ]
  }
];

export default function PlatformPerksPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerk, setSelectedPerk] = useState<PerkItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredPerks = useMemo(() => {
    return PERKS.filter((perk) => {
      const matchesCat = activeCategory === 'all' || perk.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      return (
        matchesCat &&
        (perk.title.toLowerCase().includes(q) ||
         perk.provider.toLowerCase().includes(q) ||
         perk.subtitle.toLowerCase().includes(q) ||
         perk.benefit.toLowerCase().includes(q) ||
         (perk.promoCode && perk.promoCode.toLowerCase().includes(q)))
      );
    });
  }, [activeCategory, searchQuery]);

  const handleCopyCode = (code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2200);
  };

  const categories = [
    { id: 'all' as CategoryType, label: 'All', count: PERKS.length },
    { id: 'discounts' as CategoryType, label: 'Publishing', count: PERKS.filter(p => p.category === 'discounts').length },
    { id: 'tools' as CategoryType, label: 'AI & Tools', count: PERKS.filter(p => p.category === 'tools').length },
    { id: 'webinars' as CategoryType, label: 'CLE & Events', count: PERKS.filter(p => p.category === 'webinars').length },
    { id: 'career' as CategoryType, label: 'Career', count: PERKS.filter(p => p.category === 'career').length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white font-sans selection:bg-purple-500/20 pb-28">
      
      {/* Sleek Minimal Apple-Level Hero */}
      <section className="relative w-full border-b border-slate-200/80 dark:border-white/[0.08] pt-12 pb-14 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-50 dark:from-[#0d1222] dark:via-[#070b14] dark:to-[#070b14]">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[280px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6">
            <Link href="/platform" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Platform
            </Link>
            <span>/</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold">
              Perks
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/70 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[11px] font-bold tracking-wider uppercase mb-4">
                <Sparkles size={12} />
                <span>Alliance Privileges</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                Membership has its privileges.
              </h1>

              <p className="mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                Exclusive publishing rates, AI credits, accredited CLE, and partner benefits curated for IP leaders.
              </p>
            </div>

            {/* Quick Summary Strip */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs font-semibold text-slate-600 dark:text-slate-300">
              <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-xs">
                <span className="font-black text-purple-600 dark:text-purple-400 mr-1.5">35%</span>
                <span>Publishing</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-xs">
                <span className="font-black text-emerald-600 dark:text-emerald-400 mr-1.5">100%</span>
                <span>Free CLE</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-xs">
                <span className="font-black text-indigo-600 dark:text-indigo-400 mr-1.5">AI</span>
                <span>Tokens Included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 pt-8">

        {/* Flagship Bento Showcase: 35% Publishing Advantage */}
        <div className="mb-10 rounded-3xl bg-gradient-to-br from-purple-50 via-white to-purple-50/40 dark:from-[#13112a] dark:via-[#0f0e20] dark:to-[#0a0718] border border-purple-200/70 dark:border-purple-500/20 p-6 sm:p-8 lg:p-10 shadow-sm overflow-hidden relative">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="max-w-xl">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
                Flagship Privilege
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5 leading-tight">
                35% off the world's leading IP publications.
              </h2>

              <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Save on editorial packages, professional spotlights, and print advertisements across 3 global industry publications.
              </p>

              {/* Promo Code Chips (1-Click Copy) */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {[
                  { label: "Women's IP World", code: 'WIPA35WORLD' },
                  { label: 'Global IP Magazine', code: 'WIPAMAG35' },
                  { label: 'IP Tech Annual', code: 'WIPAINNOV35' }
                ].map((item) => {
                  const isCopied = copiedCode === item.code;
                  return (
                    <button
                      key={item.code}
                      onClick={(e) => handleCopyCode(item.code, e)}
                      className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white/80 dark:bg-white/5 border-purple-200/80 dark:border-white/10 hover:border-purple-400 text-slate-700 dark:text-slate-200'
                      }`}
                      title={`Click to copy promo code ${item.code}`}
                    >
                      <span className="text-slate-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-300 text-[10px] uppercase font-bold">
                        {item.label}:
                      </span>
                      <span className="font-mono font-bold tracking-wider">{item.code}</span>
                      {isCopied ? <Check size={12} /> : <Copy size={12} className="opacity-60 group-hover:opacity-100" />}
                    </button>
                  );
                })}
              </div>

              {/* CTA Link */}
              <div className="mt-6">
                <Link
                  href="/platform/publications"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-purple-600/20 active:scale-95"
                >
                  <span>Explore Publications Hub</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Apple-Style Overlapping Visual Book Mockups */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 shrink-0 py-2">
              <div className="relative w-24 sm:w-28 md:w-32 aspect-[3/4] rounded-xl overflow-hidden border border-slate-200/80 dark:border-white/15 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:rotate-[-2deg]">
                <Image
                  src="/images/womens-ip-world-cover.png"
                  alt="Women's IP World Annual"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-26 sm:w-32 md:w-36 aspect-[3/4] rounded-xl overflow-hidden border border-slate-200/80 dark:border-white/15 shadow-2xl transition-all duration-300 hover:-translate-y-2 -mt-4">
                <Image
                  src="/images/global-ip-magazine-cover.png"
                  alt="Global IP Magazine"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-24 sm:w-28 md:w-32 aspect-[3/4] rounded-xl overflow-hidden border border-slate-200/80 dark:border-white/15 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:rotate-[2deg]">
                <Image
                  src="/images/ip-tech-annual-cover.png"
                  alt="IP Tech Annual"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls: Apple Segmented Pill Switcher & Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Apple-Style Segmented Pill Bar */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-200/70 dark:bg-white/[0.06] backdrop-blur-md overflow-x-auto scrollbar-none self-start md:self-auto border border-slate-300/40 dark:border-white/[0.05]">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="ml-1.5 text-[10px] opacity-60 font-normal">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Minimalist Search Box */}
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search privileges..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-2xs transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Perks Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPerks.map((perk) => {
            const isCopied = copiedCode === perk.promoCode;
            return (
              <div
                key={perk.id}
                onClick={() => setSelectedPerk(perk)}
                className="group relative rounded-3xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-white/[0.08] hover:border-purple-300 dark:hover:border-purple-500/40 p-6 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 cursor-pointer select-none"
              >
                <div>
                  {/* Top Bar: Category / Provider + Bold Benefit */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {perk.provider}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white text-[11px] font-black tracking-tight">
                      {perk.benefit}
                    </span>
                  </div>

                  {/* Visual Preview Pedestal */}
                  <div className="relative w-full h-36 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-[#141b2e] dark:to-[#0e1424] border border-slate-100 dark:border-white/5 flex items-center justify-center p-3 mb-4 overflow-hidden">
                    {perk.imageType === 'cover' ? (
                      <div className="relative h-full aspect-[3/4] rounded-md overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={perk.image}
                          alt={perk.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : perk.imageType === 'logo' ? (
                      <div className="relative w-40 h-14 flex items-center justify-center">
                        <Image
                          src={perk.image}
                          alt={perk.provider}
                          fill
                          className="object-contain dark:brightness-110 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-full rounded-xl overflow-hidden">
                        <Image
                          src={perk.image}
                          alt={perk.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* Title & Short Subtitle (No Walls of Text!) */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors leading-snug">
                    {perk.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed line-clamp-2">
                    {perk.subtitle}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                  {perk.promoCode ? (
                    <button
                      onClick={(e) => handleCopyCode(perk.promoCode!, e)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-purple-50/70 dark:bg-white/5 border-purple-200/70 dark:border-white/10 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-white/10'
                      }`}
                      title="Click to copy code"
                    >
                      <span className="font-mono font-bold tracking-wider">{perk.promoCode}</span>
                      {isCopied ? <Check size={11} /> : <Copy size={11} className="opacity-70" />}
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Included Benefit
                    </span>
                  )}

                  <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    <span>Details</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPerks.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-white/10 rounded-3xl p-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching privileges found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try searching for "publications", "Genie", "Sally", or "CLE".
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Apple-Style Minimal Detail Modal */}
      {selectedPerk && (
        <div 
          onClick={() => setSelectedPerk(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white dark:bg-[#0e1424] border border-slate-200/90 dark:border-white/15 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPerk(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {selectedPerk.provider}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100/70 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] font-black">
                  {selectedPerk.benefit}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedPerk.title}
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {selectedPerk.subtitle}
              </p>
            </div>

            {/* Promo Code Box if Available */}
            {selectedPerk.promoCode && (
              <div className="mt-5 p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-500/20 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Promo Code
                  </p>
                  <p className="font-mono text-base font-black tracking-widest text-slate-900 dark:text-white mt-0.5">
                    {selectedPerk.promoCode}
                  </p>
                </div>
                <button
                  onClick={() => handleCopyCode(selectedPerk.promoCode!)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {copiedCode === selectedPerk.promoCode ? (
                    <>
                      <Check size={13} />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Key Highlights */}
            {selectedPerk.highlights && selectedPerk.highlights.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Included Privileges
                </p>
                {selectedPerk.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <span className="text-purple-600 dark:text-purple-400 font-bold select-none">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Actions */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
              {selectedPerk.externalLink && (
                <a
                  href={selectedPerk.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Website</span>
                  <ArrowUpRight size={13} />
                </a>
              )}

              {selectedPerk.platformLink && (
                <Link
                  href={selectedPerk.platformLink}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-1.5 shadow-xs"
                >
                  <span>{selectedPerk.platformLinkText || 'Open in Platform'}</span>
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

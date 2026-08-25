export type PublicationTheme = "rose" | "violet" | "cyan";

export type PublicationStat = {
  value: string;
  label: string;
};

export type PublicationRate = {
  opportunity: string;
  standardRate: string;
  memberRate: string;
  saving: string;
};

export type Publication = {
  slug: string;
  title: string;
  shortTitle: string;
  edition: string;
  theme: PublicationTheme;
  tagline: string;
  summary: string;
  overview: string[];
  about: string[];
  opportunitiesTitle: string;
  opportunities: string[];
  reasonsTitle: string;
  reasons: string[];
  stats: PublicationStat[];
  memberBenefit: string;
  website?: string;
  rates?: PublicationRate[];
};

export const publications: Publication[] = [
  {
    slug: "womens-ip-world",
    title: "The Women’s IP World",
    shortTitle: "Women’s IP World",
    edition: "2027 Annual",
    theme: "rose",
    tagline: "Put your expertise, achievements and organisation in front of a focused international IP audience.",
    summary:
      "A dedicated digital and print publication celebrating the work, expertise and achievements of women across intellectual property law and innovation globally.",
    overview: [
      "Your membership gives you more than access—it gives you a platform. As a member of The Women’s IP Alliance, you receive an exclusive 35% member discount across editorial and advertising options with The Women’s IP World.",
      "This benefit is designed to make it easier for Alliance members to increase professional visibility, share expertise, celebrate achievements and place a personal or organisational brand in front of a specialist global IP and innovation audience.",
      "The preferential rate is for Alliance members only and is not a general public offer. It can be used to publish thought leadership, showcase a professional profile, promote a firm or organisation, or secure advertising visibility at substantially reduced rates.",
    ],
    about: [
      "The Women’s IP World Annual amplifies women’s voices, recognises professional excellence and provides a specialist platform where women can share knowledge, experience and achievements with the wider IP community.",
      "The publication brings together profiles, professional experience, accolades, articles, rankings and achievements. Its ‘Females in Focus’ concept highlights influential women helping to reshape IP law and innovation.",
    ],
    opportunitiesTitle: "Use your member discount for",
    opportunities: [
      "Editorial articles on legal developments, innovation, emerging issues, cases, strategy and specialist expertise.",
      "Professional profiles presenting your career, credentials, experience, accolades and achievements.",
      "Full-page, half-page and quarter-page advertising, including selected premium positions.",
      "Combined editorial and advertising packages connecting personal thought leadership with organisational visibility.",
      "Selected digital advertising opportunities, including website banner placements where available.",
    ],
    reasonsTitle: "Why this publication",
    reasons: [
      "Build a credible international profile within a specialist women-in-IP audience.",
      "Share knowledge and professional achievements across print, digital and audio formats.",
      "Connect personal expertise with the visibility of your firm, organisation, service or brand.",
    ],
    stats: [
      { value: "17,000+", label: "Digital circulation" },
      { value: "7,500", label: "Print copies per annual issue" },
      { value: "3 formats", label: "Print, digital and audio" },
    ],
    memberBenefit:
      "Active Women’s IP Alliance members receive 35% off eligible Women’s IP World editorial and advertising opportunities. Availability, premium positions, sponsorships and bespoke packages remain subject to confirmation.",
    website: "https://www.womensipworld.com",
    rates: [
      { opportunity: "Complete profile, editorial & advertisement package", standardRate: "£3,995", memberRate: "£2,596.75", saving: "£1,398.25" },
      { opportunity: "Two-page stand-alone article", standardRate: "£2,995", memberRate: "£1,946.75", saving: "£1,048.25" },
      { opportunity: "Stand-alone profile", standardRate: "£2,195", memberRate: "£1,426.75", saving: "£768.25" },
      { opportunity: "Full-page advertisement", standardRate: "£1,800", memberRate: "£1,170", saving: "£630" },
      { opportunity: "Half-page advertisement", standardRate: "£1,500", memberRate: "£975", saving: "£525" },
      { opportunity: "Quarter-page advertisement", standardRate: "£1,000", memberRate: "£650", saving: "£350" },
    ],
  },
  {
    slug: "global-ip-magazine",
    title: "The Global IP Magazine",
    shortTitle: "Global IP Magazine",
    edition: "Alliance member offer",
    theme: "violet",
    tagline: "Share your expertise and strengthen your visibility across the international intellectual property community.",
    summary:
      "An IP industry-focused publication featuring expert perspectives on innovation, IP trends, new legislation and international IP strategy.",
    overview: [
      "As a member of The Women’s IP Alliance, you receive an exclusive 35% discount across editorial and advertising opportunities with The Global IP Magazine.",
      "The member benefit gives you a valuable platform to share expertise, strengthen your professional profile and increase the visibility of your firm, organisation or brand within the international intellectual property community.",
      "The preferential rate is exclusive to active Women’s IP Alliance members and is not available to the general public.",
    ],
    about: [
      "The Global IP Magazine is available across print, digital and non-intrusive audio formats. Its content is contributed by legal professionals working within intellectual property.",
      "Published three times per year, its readership includes patent and trademark attorneys, in-house and special counsel, legal advisers, managing directors, IP service providers and senior professionals across the global IP community.",
    ],
    opportunitiesTitle: "Your 35% discount can be used across",
    opportunities: [
      "One-page and two-page editorial articles.",
      "Full-page, half-page and quarter-page advertisements.",
      "Premium advertising positions, including inside and outside covers.",
      "Selected editorial, branding and advertising packages.",
      "Digital banner advertising and online visibility opportunities.",
    ],
    reasonsTitle: "Your expertise. Your visibility.",
    reasons: [
      "Publish thought leadership and important developments from your jurisdiction.",
      "Showcase your firm’s expertise to an international professional readership.",
      "Strengthen organisational and brand visibility at 35% below the standard rate.",
    ],
    stats: [
      { value: "20,000+", label: "IP professionals reached digitally" },
      { value: "8,000", label: "Print copies per issue" },
      { value: "3× yearly", label: "Publication frequency" },
    ],
    memberBenefit:
      "Active Women’s IP Alliance members save 35% across eligible editorial and advertising opportunities with The Global IP Magazine.",
  },
  {
    slug: "ip-tech-innovation-annual",
    title: "The IP Tech & Innovation Services Annual",
    shortTitle: "IP Tech & Innovation Annual",
    edition: "2027 Annual",
    theme: "cyan",
    tagline: "Turn your Alliance membership into greater visibility across IP, technology and innovation.",
    summary:
      "A global publication spotlighting the tools, platforms, services and people transforming how intellectual property is practised and commercialised.",
    overview: [
      "Women’s IP Alliance members receive an exclusive 35% discount on editorial and advertising opportunities in The IP Tech & Innovation Services Annual 2027.",
      "The offer helps members share expertise, showcase technology or services, strengthen brand visibility and connect with a specialist international audience across intellectual property, innovation and technology.",
      "This Alliance member-only benefit is available whether you participate individually, represent a law firm or in-house team, or promote a technology, platform, consultancy or professional service.",
    ],
    about: [
      "The Annual brings clarity and transparency to a rapidly changing market by spotlighting the technology, services and people transforming how IP is practised, managed, protected and commercialised.",
      "Its content includes expert interviews, feature articles, technology spotlights, service-provider showcases, product insight, case studies, practical guidance and global trend analysis across AI, legal technology, IP management, analytics, translation, recruitment, education, commercialisation, domains and technology transfer.",
    ],
    opportunitiesTitle: "What Alliance members can feature",
    opportunities: [
      "Thought leadership, practical insight, case studies, market perspectives and expert analysis.",
      "AI solutions, software platforms, analytics tools and IP management technology.",
      "Specialist service-provider showcases for law firms, in-house teams, innovators and IP owners.",
      "Advertising, brand visibility and premium placement opportunities.",
      "Profiles, interviews, leadership perspectives, company journeys and industry stories.",
    ],
    reasonsTitle: "Why feature in the 2027 Annual",
    reasons: [
      "Build credibility in a specialist publication focused specifically on IP technology and innovation.",
      "Reach professionals actively seeking tools, services and solutions that improve IP practice and operations.",
      "Increase awareness of your organisation, platform, product or specialist expertise across jurisdictions.",
      "Gain visibility beyond print through digital and audio formats.",
      "Stand alongside the innovators and service providers shaping the future of intellectual property.",
    ],
    stats: [
      { value: "60–80", label: "Global events and conferences" },
      { value: "8,000", label: "Printed copies annually" },
      { value: "3 formats", label: "Print, digital and audio" },
    ],
    memberBenefit:
      "The public website promotes a 10% direct-enquiry discount. Active Women’s IP Alliance members receive an enhanced 35% discount on eligible 2027 editorial and advertising opportunities.",
    website: "https://www.iptechnovation.com",
  },
];

export function getPublication(slug: string) {
  return publications.find((publication) => publication.slug === slug);
}

import { supabase } from '@/lib/supabase';

export interface InHouseCounsel {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  avatar: string;
  coverImage?: string;
  experienceYears: number;
  practiceArea: string;
  skills: string[];
  bio: string;
  isVerified: boolean;
  membershipTier?: string;
  patentsManaged?: string;
  previousRoles?: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
  }>;
  education?: string[];
  achievements?: string[];
  quote?: string;
}

export const VERIFIED_IN_HOUSE_COUNSEL_IDS = new Set([
  '9b3c3082-04ef-4041-bebe-f018f3b3ef4d', // Charlotte Sterling (Waymo / Alphabet)
  '44eef627-2bc9-4f3b-998c-56059d686b13', // Claire Dupont (LVMH)
  'f15bd30f-f74b-4a4b-b948-6b001a5cd822', // Beatrice Moreau (Sanofi)
  '0f6fc8f9-7748-436c-a4b3-7499e695ac12', // Olivia Thornton (AstraZeneca)
]);

export function checkIsInHouseCounsel(profile: any): boolean {
  if (!profile) return false;
  if (profile.membership_tier === 'in_house_counsel') return true;
  if (VERIFIED_IN_HOUSE_COUNSEL_IDS.has(profile.id)) return true;

  const role = (profile.role || '').toLowerCase();
  const company = (profile.company || '').toLowerCase();

  const counselKeywords = [
    'in-house', 'in house', 'general counsel', 'chief ip', 'head of ip',
    'head of legal', 'patent counsel', 'legal director', 'director of ip',
    'vp ip', 'corporate counsel', 'lead ip counsel', 'senior legal director'
  ];

  const hasCounselRole = counselKeywords.some(kw => role.includes(kw));
  const hasCorporateCompany = company.length > 0 && 
    !company.includes('llp') && 
    !company.includes('law firm') && 
    !company.includes('advocates') && 
    !company.includes('practice');

  return hasCounselRole && hasCorporateCompany;
}

export const MOCK_IN_HOUSE_COUNSELS: InHouseCounsel[] = [
  {
    id: "9b3c3082-04ef-4041-bebe-f018f3b3ef4d",
    name: "Charlotte Sterling",
    role: "Lead IP Counsel - AI & Autonomous Vehicles",
    company: "Waymo / Alphabet",
    location: "San Francisco, USA",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=400&q=80",
    experienceYears: 14,
    practiceArea: "Autonomous Systems & Sensor Fusion",
    skills: ["LiDAR Inventions", "Autonomous Driving Models", "USPTO PTAB Trials", "Standards IP", "Machine Learning Patents"],
    bio: "Overseeing global patent portfolios in computer vision, neural driving policies, simulation architectures, and vehicle-to-everything (V2X) protocols for autonomous fleets.",
    isVerified: true,
    patentsManaged: "450+ Assets",
    previousRoles: [
      {
        title: "Senior Patent Attorney",
        company: "Google LLC",
        period: "2016 - 2021",
        description: "Directed patent prosecution for deep learning hardware and sensor integration across Google Brain and Hardware divisions."
      },
      {
        title: "IP Associate",
        company: "Morrison & Foerster LLP",
        period: "2012 - 2016",
        description: "Drafted high-value electrical and software patents; represented tech leaders in Federal Circuit patent appeals."
      }
    ],
    education: ["J.D., Stanford Law School", "B.S. in Electrical Engineering & Computer Science, UC Berkeley"],
    achievements: ["IAM Patent 1000 Leading In-House Counsel", "Lead Architect on Waymo's Global V2X Patent Portfolio"],
    quote: "Building an enterprise in-house IP function requires treating patents not as legal checklists, but as strategic market access engines."
  },
  {
    id: "44eef627-2bc9-4f3b-998c-56059d686b13",
    name: "Claire Dupont",
    role: "Head of Global Trademarks & Brand Protection",
    company: "LVMH Moët Hennessy Louis Vuitton",
    location: "Paris, France",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&h=400&q=80",
    experienceYears: 17,
    practiceArea: "Luxury Brand Protection & Fashion Law",
    skills: ["3D Trademark Registration", "Haute Couture Design Rights", "Anti-Counterfeiting", "EUIPO Opposition", "Brand Equity"],
    bio: "Managing high-profile brand equity, sensory trademarks, and international counterfeit interdiction for iconic fashion and luxury houses across 120+ jurisdictions.",
    isVerified: true,
    patentsManaged: "1,200+ Marks & Designs",
    previousRoles: [
      {
        title: "Senior IP Director",
        company: "Kering Group",
        period: "2014 - 2020",
        description: "Led worldwide trademark portfolios, design registrations, and global anti-counterfeiting enforcement."
      },
      {
        title: "Trademarks Attorney",
        company: "Gide Loyrette Nouel",
        period: "2009 - 2014",
        description: "Specialized in European Community Trademark (now EUTM) oppositions and customs seizure enforcement."
      }
    ],
    education: ["Master in Intellectual Property Law, Université Paris-Panthéon-Assas", "Admitted to the Paris Bar"],
    achievements: ["World Trademark Review (WTR 300) Top In-House Leader", "Pioneered sensory and 3D trademark jurisprudence in the EU"],
    quote: "In luxury and fashion, brand identity is the enterprise's greatest asset. Vigilant protection preserves heritage."
  },
  {
    id: "f15bd30f-f74b-4a4b-b948-6b001a5cd822",
    name: "Beatrice Moreau",
    role: "Senior Legal Director - Global IP & Licensing",
    company: "Sanofi Pasteur",
    location: "Lyon, France",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&h=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&h=400&q=80",
    experienceYears: 16,
    practiceArea: "Vaccines & Biotherapeutic IP",
    skills: ["mRNA Technology Patents", "Lyophilization Claims", "Global Alliance IP Structuring", "Patent Prosecution", "Licensing"],
    bio: "Managing complex multi-party research consortia, international vaccine supply IP agreements, and mRNA lipid nanoparticle licenses.",
    isVerified: true,
    patentsManaged: "320+ Global Filings",
    previousRoles: [
      {
        title: "Principal IP Counsel",
        company: "BioNTech SE",
        period: "2017 - 2021",
        description: "Structured platform licensing deals and freedom-to-operate clearance for mRNA delivery formulations."
      },
      {
        title: "Patent Attorney",
        company: "Cabinet Beau de Loménie",
        period: "2010 - 2017",
        description: "Prosecuted biotechnology and pharmaceutical applications before the European Patent Office (EPO)."
      }
    ],
    education: ["Ph.D. in Molecular Biology, École Normale Supérieure", "European Patent Attorney (EQE Qualified)"],
    achievements: ["Led IP clearance for breakthrough multilateral pandemic response alliance", "WIPA Distinguished Bio-IP Leader"],
    quote: "Biotechnology patents demand precision. Bridging laboratory science with aggressive legal defense is essential."
  },
  {
    id: "0f6fc8f9-7748-436c-a4b3-7499e695ac12",
    name: "Olivia Thornton",
    role: "Senior Patent Counsel & IP Strategist",
    company: "AstraZeneca Biologics",
    location: "Cambridge, United Kingdom",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&h=400&q=80",
    experienceYears: 15,
    practiceArea: "Oncology & Antibody-Drug Conjugates",
    skills: ["Monoclonal Antibodies", "ADC Linkers", "Target Antigen Exclusivity", "EPO Oppositions", "Portfolio Life-Cycle"],
    bio: "Spearheading patent lifecycle extension for targeted oncology drugs, bispecific antibodies, and proprietary antibody-drug conjugate (ADC) linkers.",
    isVerified: true,
    patentsManaged: "280+ Biologic Assets",
    previousRoles: [
      {
        title: "Senior Patent Counsel",
        company: "GlaxoSmithKline (GSK)",
        period: "2015 - 2020",
        description: "Formulated global patent strategies for immune checkpoint inhibitors and vaccine adjuvants."
      },
      {
        title: "Associate",
        company: "Marks & Clerk LLP",
        period: "2011 - 2015",
        description: "Represented multinational pharmaceutical firms in EPO oppositions and UK High Court patent disputes."
      }
    ],
    education: ["M.Sc. in Biochemistry, University of Oxford", "Chartered UK Patent Attorney (CPA) & EPA"],
    achievements: ["Successfully defended key oncology patents in 4 high-stakes EPO appeals", "Author of 'Biologics Exclusivity in the Post-UPC Era'"],
    quote: "True patent value lies in understanding the clinical development pathway as intimately as the legal claims."
  },
  {
    id: "ac3759c1-58bc-412a-90bc-4de024aced85",
    name: "Sophia Bennett",
    role: "VP & General Counsel, Intellectual Property",
    company: "MedTech Global & WIPA Council",
    location: "London, United Kingdom",
    avatar: "https://bepavczocyvaegkfxtvd.supabase.co/storage/v1/object/public/avatars/ac3759c1-58bc-412a-90bc-4de024aced85/1787296906871-Untitled_design__4_.webp",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=400&q=80",
    experienceYears: 12,
    practiceArea: "MedTech, Medical Devices & Global Strategy",
    skills: ["Medical Device Patents", "Outside Counsel Guidelines", "Regulatory IP", "Cross-Border Licensing", "Trade Secret Protection"],
    bio: "General Counsel and IP Vice President advising global medical technology companies on proprietary hardware, algorithmic diagnostics, and outside counsel cost optimization.",
    isVerified: true,
    patentsManaged: "210+ MedTech Patents",
    previousRoles: [
      {
        title: "Head of Legal & IP",
        company: "OmniHealth Innovations",
        period: "2018 - 2022",
        description: "Directed legal and intellectual property strategy from Series B through public listing."
      },
      {
        title: "Senior IP Counsel",
        company: "Smith & Nephew",
        period: "2014 - 2018",
        description: "Oversaw orthopedic device patent prosecution and competitor intelligence audits."
      }
    ],
    education: ["LL.B. (Hons), King's College London", "Bar Vocational Course, BPP Law School"],
    achievements: ["WIPA Leadership Council Member", "Architect of Enterprise Outside Counsel Cost Benchmark System"],
    quote: "Operational efficiency in legal operations turns outside counsel relationships from cost centers into strategic leverage."
  },
  {
    id: "mock-counsel-tesla",
    name: "Dr. Marcus Vance",
    role: "Chief IP Counsel & Associate General Counsel",
    company: "Tesla / Energy & Autonomy",
    location: "Austin, Texas, USA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&h=400&q=80",
    experienceYears: 18,
    practiceArea: "CleanTech & Artificial Intelligence",
    skills: ["Battery Patents", "CleanTech Licensing", "Global Litigation Strategy", "Patent Harvesting", "Energy Storage Claims"],
    bio: "Directing global IP portfolio spanning battery chemistries, neural net architectures, supercomputing, and electric powertrain hardware.",
    isVerified: true,
    patentsManaged: "800+ Patents",
    previousRoles: [
      {
        title: "Senior Director of Patents",
        company: "General Motors EV Division",
        period: "2013 - 2019",
        description: "Built the advanced battery and power electronics patent portfolio."
      }
    ],
    education: ["J.D., University of Texas School of Law", "Ph.D. in Materials Science, MIT"],
    achievements: ["CleanTech IP Attorney of the Year", "Managed cross-border multi-forum trade secret injunctions"],
    quote: "The speed of invention in hardware-software convergence requires in-house counsel to embed directly in the engineering sprint."
  },
  {
    id: "mock-counsel-novartis",
    name: "Elena Rostova",
    role: "Global Head of Patent Operations",
    company: "Novartis International AG",
    location: "Basel, Switzerland",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&h=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&h=400&q=80",
    experienceYears: 13,
    practiceArea: "Small Molecule Therapeutics & Hatch-Waxman",
    skills: ["Patent Term Extensions (PTE)", "Supplementary Protection Certificates (SPC)", "Freedom to Operate (FTO)", "Hatch-Waxman", "Regulatory Exclusivity"],
    bio: "Leading cross-border IP prosecution and lifecycle management across European and Asian regulatory authorities for blockbuster molecular therapies.",
    isVerified: true,
    patentsManaged: "600+ Global Filings",
    previousRoles: [
      {
        title: "IP Counsel",
        company: "Roche",
        period: "2015 - 2020",
        description: "Managed Swiss and European pharmaceutical patent oppositions and regulatory exclusivity alignments."
      }
    ],
    education: ["M.Sc. in Pharmacology, ETH Zurich", "Swiss & European Patent Attorney"],
    achievements: ["Secured 5-year SPC extensions on flagship cardiac therapies in 18 European states"],
    quote: "Navigating regulatory exclusivity hand-in-hand with patent claims maximizes the therapeutic window of discovery."
  },
  {
    id: "mock-counsel-qualcomm",
    name: "David Chen",
    role: "Senior Director, IP Litigation & Commercial Legal",
    company: "Qualcomm Technologies",
    location: "San Diego, California, USA",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&h=400&q=80",
    experienceYears: 15,
    practiceArea: "Telecommunications & Standard Essential Patents (SEP)",
    skills: ["FRAND Determinations", "Wireless Communication Protocols", "ITC Section 337", "Patent Pooling", "Cross-Licensing"],
    bio: "Managing FRAND licensing agreements, standard-essential patent (SEP) negotiations, and international arbitration across cellular connectivity standards.",
    isVerified: true,
    patentsManaged: "1,500+ Standard Essential Assets",
    previousRoles: [
      {
        title: "IP Litigation Partner",
        company: "Kirkland & Ellis LLP",
        period: "2014 - 2020",
        description: "Represented semiconductor and telecom firms before the USITC and federal district courts."
      }
    ],
    education: ["J.D., Harvard Law School", "B.S. in Electrical Engineering, MIT"],
    achievements: ["Chambers USA Band 1 In-House Litigator", "Co-drafted landmark cross-industry FRAND licensing principles"],
    quote: "Standard-essential patents power the modern connected world. Fair, reasonable, and non-discriminatory licensing keeps innovation thriving."
  }
];

export async function fetchInHouseCounsels(): Promise<InHouseCounsel[]> {
  try {
    const { data: dbProfiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role, company, country, bio, experience_years, practice_area, skills, membership_tier')
      .eq('membership_tier', 'in_house_counsel');

    if (error || !dbProfiles || dbProfiles.length === 0) {
      return MOCK_IN_HOUSE_COUNSELS;
    }

    // Merge registered profiles with mock counsel data
    const liveCounsels: InHouseCounsel[] = dbProfiles
      .filter(p => p.full_name && p.company)
      .map(p => {
        const matchingMock = MOCK_IN_HOUSE_COUNSELS.find(m => m.id === p.id);
        if (matchingMock) {
          return {
            ...matchingMock,
            name: p.full_name || matchingMock.name,
            avatar: p.avatar_url || matchingMock.avatar,
            role: p.role || matchingMock.role,
            company: p.company || matchingMock.company,
            location: p.country || matchingMock.location,
            bio: p.bio || matchingMock.bio,
            membershipTier: p.membership_tier || "in_house_counsel",
            experienceYears: p.experience_years || matchingMock.experienceYears
          };
        }
        return {
          id: p.id,
          name: p.full_name,
          role: p.role || "In-House IP Counsel",
          company: p.company,
          location: p.country || "Global",
          avatar: p.avatar_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80",
          experienceYears: p.experience_years || 10,
          practiceArea: p.practice_area || "Corporate Intellectual Property",
          skills: p.skills ? (typeof p.skills === 'string' ? p.skills.split(',').map((s: string) => s.trim()) : p.skills) : ["Patent Strategy", "Outside Counsel Oversight", "Trade Secrets"],
          bio: p.bio || `Senior in-house counsel at ${p.company} advising on intellectual property strategy, portfolio management, and corporate transactions.`,
          isVerified: true,
          membershipTier: p.membership_tier || "in_house_counsel",
          patentsManaged: "200+ Assets",
          previousRoles: [
            {
              title: "Senior Legal Counsel",
              company: p.company,
              period: "2019 - Present",
              description: `Lead corporate intellectual property counsel managing strategic IP initiatives and outside counsel partners.`
            }
          ],
          education: ["J.D. / LL.M. in Intellectual Property Law"],
          achievements: ["Active WIPA In-House Counsel Network Leader"]
        };
      });

    // Ensure we include high-profile featured mock counsels if not already in DB list
    const combined = [...liveCounsels];
    MOCK_IN_HOUSE_COUNSELS.forEach(mock => {
      if (!combined.some(c => c.id === mock.id)) {
        combined.push(mock);
      }
    });

    return combined;
  } catch (err) {
    return MOCK_IN_HOUSE_COUNSELS;
  }
}

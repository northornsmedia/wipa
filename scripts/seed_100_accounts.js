const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const envPath = path.resolve(__dirname, '..', '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Curated high quality professional female portraits
const AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1573497491765-dccce02b29df?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1573496799515-eebbb63814f2?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?auto=format&fit=crop&w=400&h=400&q=80'
];

const PROFILES_DATA = [
  // 1 to 50: INDIAN FEMALE NAMES & PROFILES
  {
    name: "Ananya Sharma",
    role: "Senior Patent Attorney & Partner",
    company: "Shardul Amarchand Mangaldas & Co",
    location: "New Delhi, India",
    practice: "Patent Prosecution & Tech Licensing",
    experience: 14,
    education: "NLSIU Bangalore (B.A. LL.B Hons.)",
    skills: "Patent Drafting, AI Inventions, Tech Transfer, Cross-Border Licensing",
    bio: "Passionate about high-tech patents, electronics and generative AI inventions. Over 14 years advising top innovation labs across India and APAC."
  },
  {
    name: "Dr. Priya Ramachandran",
    role: "Chief IP Counsel - Life Sciences",
    company: "Biocon Biologics",
    location: "Bengaluru, India",
    practice: "Life Sciences & Pharma IP",
    experience: 18,
    education: "IISc Bangalore (Ph.D. Biochemistry), DU Faculty of Law",
    skills: "Biologics Patents, Biosimilars, Freedom-to-Operate, Drug Formulation IP",
    bio: "Dual-qualified scientist and patent attorney spearheading patent strategies for recombinant proteins, biosimilars, and global clinical pipeline protections."
  },
  {
    name: "Meera Nair",
    role: "Partner - Trademark & Brand Protection",
    company: "Anand and Anand",
    location: "Mumbai, India",
    practice: "Trademarks & Brand Strategy",
    experience: 16,
    education: "Government Law College Mumbai",
    skills: "Global Trademark Clearing, Brand Portfolio Audit, Anti-Counterfeiting, Madrid System",
    bio: "Strategic brand advisor to leading consumer retail brands, luxury houses, and media conglomerates across South Asia and the Middle East."
  },
  {
    name: "Sunita Deshmukh",
    role: "Director of IP Commercialization",
    company: "Tata Consultancy Services IP Lab",
    location: "Pune, India",
    practice: "Software Patents & Open Source Governance",
    experience: 12,
    education: "Symbiosis Law School Pune",
    skills: "Cloud Architecture Patents, SaaS Licensing, Open Source Compliance, FRAND",
    bio: "Leading enterprise IP strategy, managing 600+ multi-jurisdictional cloud computing and distributed algorithms patent portfolios."
  },
  {
    name: "Kavita Iyer",
    role: "Principal Patent Litigator",
    company: "K&S Partners",
    location: "Chennai, India",
    practice: "IP Litigation & Dispute Resolution",
    experience: 15,
    education: "Madras Law College",
    skills: "Patent Infringement, High Court Appellate Practice, Injunction Strategy, Mediation",
    bio: "Recognized litigator appearing before the Delhi and Madras High Courts on high-stakes pharma patent invalidations and telecommunications disputes."
  },
  {
    name: "Dr. Aditi Sengupta",
    role: "Head of Technology Transfer",
    company: "Indian Institute of Technology (IIT) Delhi",
    location: "New Delhi, India",
    practice: "Academic IP & DeepTech Incubation",
    experience: 13,
    education: "IIT Kharagpur (Ph.D.), Cambridge University (LL.M)",
    skills: "DeepTech Spinouts, Seed Licensing, Royalty Structuring, Cleantech Patents",
    bio: "Bridging the gap between academic lab breakthroughs and commercial spin-offs in quantum sensors, renewable energy, and nanotech."
  },
  {
    name: "Pooja Kulkarni",
    role: "Head of Legal & IP",
    company: "Ola Electric Mobility",
    location: "Bengaluru, India",
    practice: "EV & Green Technology Patents",
    experience: 11,
    education: "ILS Law College Pune",
    skills: "Battery Chemistry IP, Autonomous Systems, EV Charging Standards, Supply Chain Licensing",
    bio: "Managing aggressive clean mobility patent portfolios, battery pack innovations, and motor drive hardware architecture registrations."
  },
  {
    name: "Ritu Agarwal",
    role: "Senior Associate - IP Advisory",
    company: "Khaitan & Co",
    location: "Kolkata, India",
    practice: "Copyright, Media & Digital IP",
    experience: 9,
    education: "NUJS Kolkata",
    skills: "Streaming Content Licensing, Digital Copyright, OTT Distribution Agreements",
    bio: "Advising digital creators, production houses, and OTT platforms on content acquisition, moral rights, and global syndication contracts."
  },
  {
    name: "Shreya Bhattacharya",
    role: "Registered Patent Agent",
    company: "Remfry & Sagar",
    location: "Gurugram, India",
    practice: "Chemical & Materials Patent Prosecution",
    experience: 8,
    education: "Calcutta University (M.Sc Chemistry), Patent Bar",
    skills: "Polymer Patents, Chemical Synthesis Drafting, Section 3(d) Prosecution, PCT Filings",
    bio: "Specializing in overcoming Indian Section 3(d) patent hurdles for specialty polymers, agrochemicals, and green synthesis technologies."
  },
  {
    name: "Neha Kapoor",
    role: "General Counsel - Global Brands",
    company: "Titan Company Limited",
    location: "Bengaluru, India",
    practice: "Industrial Design & Trademark Law",
    experience: 17,
    education: "Delhi University Campus Law Centre",
    skills: "Industrial Design Registration, Global Trademark Portfolios, Brand Enforcements",
    bio: "Championing design patent protection and brand equity across international jewelry, wearable electronics, and lifestyle accessories."
  },
  {
    name: "Sneha Reddy",
    role: "Lead Counsel - IP Transactions",
    company: "Dr. Reddy's Laboratories",
    location: "Hyderabad, India",
    practice: "Pharma M&A and Licensing",
    experience: 14,
    education: "NALSAR University of Law",
    skills: "Generic Drug Settlements, Paragraph IV Filings, ANDA Litigation, Cross-Border M&A",
    bio: "Structuring complex multinational pharmaceutical cross-licensing deals, generic market authorizations, and Hatch-Waxman risk assessments."
  },
  {
    name: "Dr. Deepa Venkat",
    role: "IP Director - Medical Devices",
    company: "Agappe Diagnostics",
    location: "Kochi, India",
    practice: "MedTech & In-Vitro Diagnostics IP",
    experience: 13,
    education: "AIIMS New Delhi (Biomedical Eng), Rajiv Gandhi School of IP Law",
    skills: "Point-of-Care Diagnostics IP, Microfluidics, Sensor Patents, Regulatory-IP Alignment",
    bio: "Guiding patent lifecycle for portable diagnostic equipment, microfluidic chips, and automated reagent delivery mechanisms."
  },
  {
    name: "Pallavi Joshi",
    role: "Managing Associate",
    company: "Cyril Amarchand Mangaldas",
    location: "Mumbai, India",
    practice: "Fintech & Blockchain IP",
    experience: 10,
    education: "Government Law College Mumbai",
    skills: "Fintech Licensing, Smart Contracts, Digital Asset IP, Data Privacy & Trade Secrets",
    bio: "Focused on regulatory intersections of fintech, proprietary payment gateways, algorithm protection, and secure ledger technologies."
  },
  {
    name: "Swati Verma",
    role: "Senior Patent Analyst",
    company: "Clarivate Analytics India",
    location: "Noida, India",
    practice: "Patent Landscaping & Competitive Intelligence",
    experience: 8,
    education: "Delhi Technological University (DTU)",
    skills: "Prior Art Searching, Patent White Space Analysis, Freedom to Operate, Citation Mapping",
    bio: "Delivering data-backed patent analytics, whitespace landscape maps, and technology trend reports for Fortune 500 R&D departments."
  },
  {
    name: "Anjali Mukherjee",
    role: "Founding Partner",
    company: "Mukherjee & Associates IP",
    location: "Kolkata, India",
    practice: "Geographical Indications & Heritage IP",
    experience: 20,
    education: "Calcutta University",
    skills: "Geographical Indications (GI), Traditional Knowledge Digital Library (TKDL), Handicrafts IP",
    bio: "Dedicated champion for community-owned intellectual property, GI registrations for artisan collectives, and preservation of indigenous crafts."
  },
  {
    name: "Tanvi Chawla",
    role: "IP & Technology Counsel",
    company: "Infosys Technologies",
    location: "Chandigarh, India",
    practice: "Artificial Intelligence & IP Ethics",
    experience: 9,
    education: "Panjab University Law Department",
    skills: "AI Training Data Rights, Machine Learning Patents, Open Source Audits, Trade Secret Audits",
    bio: "Advising enterprise engineering teams on responsible AI model training rights, code governance, and generative software development."
  },
  {
    name: "Rohini Menon",
    role: "Partner - IP Disputes",
    company: "Lakshmikumaran & Sridharan",
    location: "New Delhi, India",
    practice: "Customs IP & Border Enforcement",
    experience: 16,
    education: "National University of Advanced Legal Studies (NUALS)",
    skills: "Customs Recordals, Counterfeit Interception, Border Measures, Commercial Court Trials",
    bio: "Expert on Indian Customs border control regulations, seizing grey-market imports, and safeguarding trademark owners against transit counterfeit rings."
  },
  {
    name: "Divya Nambiar",
    role: "Senior In-House Counsel",
    company: "Wipro Digital",
    location: "Bengaluru, India",
    practice: "Cybersecurity & Cloud IP",
    experience: 11,
    education: "Christ University School of Law",
    skills: "Zero Trust Architecture Patents, Cloud Security Licensing, Vendor Risk Agreements",
    bio: "Drafting and negotiating cloud security infrastructure IP warranties, SaaS end-user agreements, and proprietary encryption disclosures."
  },
  {
    name: "Simran Kaur",
    role: "Head of Patents - Agritech",
    company: "UPL Limited",
    location: "Mumbai, India",
    practice: "Plant Variety & Agricultural IP",
    experience: 12,
    education: "Punjab Agricultural University, Amity Law School",
    skills: "Plant Variety Protection (PPV&FR), Crop Protection Chemistry, Bio-stimulant Patents",
    bio: "Pioneering protection for sustainable crop nutrition formulations, hybrid seed patents, and biological pesticide technologies."
  },
  {
    name: "Malini Sundaram",
    role: "Director of IP Strategy",
    company: "Ashok Leyland Defense Systems",
    location: "Chennai, India",
    practice: "Aerospace & Automotive IP",
    experience: 19,
    education: "IIT Madras (B.Tech Mechanical), NLSIU (MBL)",
    skills: "Powertrain Inventions, Dual-Use Tech Export Controls, Defense Inventions Licensing",
    bio: "Managing mission-critical engineering patent portfolios, tactical mobility systems, and electric propulsion technologies."
  },
  {
    name: "Radhika Mathur",
    role: "Senior Legal Counsel",
    company: "Flipkart Group",
    location: "Bengaluru, India",
    practice: "E-Commerce IP & Brand Registry",
    experience: 10,
    education: "NLU Jodhpur",
    skills: "Notice-and-Takedown Policies, Intermediary Liability, Brand Registry Governance",
    bio: "Managing intermediary safe harbor protections, brand protection algorithms, and expedited counterfeit takedown mechanisms on marketplace platforms."
  },
  {
    name: "Shruti Saxena",
    role: "Lead Patent Attorney - Semiconductor",
    company: "Applied Materials India",
    location: "Hyderabad, India",
    practice: "Semiconductor Fabrication & Chip IP",
    experience: 11,
    education: "BITS Pilani (Electrical Eng), Rajiv Gandhi School of IP Law",
    skills: "Wafer Processing Patents, Clean Room Tooling IP, Integrated Circuit Layout Designs",
    bio: "Focusing on lithography equipment inventions, thin-film deposition patents, and layout designs under the Semiconductor IC Layout-Design Act."
  },
  {
    name: "Vandana Pillai",
    role: "Associate Director - IP Governance",
    company: "Sun Pharmaceutical Industries",
    location: "Vadodara, India",
    practice: "Formulation Patents & Regulatory Strategy",
    experience: 15,
    education: "MS University Baroda (Pharmacy & Law)",
    skills: "Modified Release Patents, API Synthesis, Patent Extension Strategies, Orange Book Listings",
    bio: "Aligning global regulatory dossiers with robust patent lifecycles across US, EU, and emerging markets for specialty formulations."
  },
  {
    name: "Bhavna Mehta",
    role: "Partner - IP Commercialization",
    company: "AZB & Partners",
    location: "Mumbai, India",
    practice: "Venture Capital & Tech Due Diligence",
    experience: 14,
    education: "Government Law College Mumbai",
    skills: "Startup IP Due Diligence, Founder Assignment Agreements, Valuation of Intangibles",
    bio: "Advising tier-1 venture capital funds on IP asset ownership, founder code vesting, and freedom-to-operate in high-growth Indian tech unicorns."
  },
  {
    name: "Gauri Shinde",
    role: "Senior Trademark Attorney",
    company: "Inttl Advocare",
    location: "New Delhi, India",
    practice: "Trademark Prosecution & Opposition",
    experience: 9,
    education: "Symbiosis Law School",
    skills: "Trademark Hearing Appearances, Evidence of Distinctiveness, Well-Known Trademark Declarations",
    bio: "Appeared in over 500 trademark registry show-cause hearings and secured well-known trademark recognitions for indigenous brands."
  },
  {
    name: "Preeti Narayanan",
    role: "Head of IP & Legal Operations",
    company: "Zoho Corporation",
    location: "Chennai, India",
    practice: "Enterprise SaaS Intellectual Property",
    experience: 13,
    education: "Tamil Nadu Dr. Ambedkar Law University",
    skills: "Global SaaS Terms, Patent Quality Assurance, Multi-Tenant Architecture Rights",
    bio: "Architecting in-house patent harvesting programs and global IP portfolio protection across 50+ enterprise cloud products."
  },
  {
    name: "Nisha Singhania",
    role: "Principal Legal Counsel",
    company: "Lupin Limited",
    location: "Mumbai, India",
    practice: "Complex Generics & Biosimilars IP",
    experience: 16,
    education: "NALSAR Hyderabad",
    skills: "Inhalation Product IP, Biosimilar Development Strategy, Global Opposition Practice",
    bio: "Strategizing patent challenges before the European Patent Office and US PTAB for complex respiratory and injectable formulations."
  },
  {
    name: "Shalini Hegde",
    role: "Patent Engineer & Attorney",
    company: "Bosch India Research",
    location: "Bengaluru, India",
    practice: "IoT & Connected Sensors",
    experience: 8,
    education: "RV College of Engineering, Law Bar",
    skills: "Connected Car Protocols, Edge Computing Inventions, Sensor Fusion Patents",
    bio: "Transforming telemetry and edge computing software architectures into high-value global patent portfolios."
  },
  {
    name: "Kriti Malhotra",
    role: "Head of Copyright Enforcement",
    company: "Indian Performing Right Society (IPRS)",
    location: "Mumbai, India",
    practice: "Music & Performing Arts Copyright",
    experience: 12,
    education: "Delhi University Law Faculty",
    skills: "Music Royalties, Blanket Licensing, Sync Rights, Digital Streaming Tariffs",
    bio: "Leading royalty governance, mechanical reproduction licenses, and negotiating collective licensing tariffs for thousands of composers and lyricists."
  },
  {
    name: "Aarti Goswami",
    role: "Senior IP Advisor",
    company: "Godrej Industries Legal",
    location: "Mumbai, India",
    practice: "Consumer Goods & Packaging Innovations",
    experience: 14,
    education: "Mumbai University Law",
    skills: "Sustainable Packaging Patents, FMCG Brand Defenses, Trade Dress Protection",
    bio: "Safeguarding revolutionary biodegradable packaging technologies, pump mechanisms, and household consumer product trade dresses."
  },
  {
    name: "Nandita Das",
    role: "Senior Patent Examiner (Ex-IPO) & Consultant",
    company: "Kolkata IP Advisory",
    location: "Kolkata, India",
    practice: "IPO Office Practice & Patent Audits",
    experience: 21,
    education: "Jadavpur University (M.Tech), ILS Pune",
    skills: "Patent Office Procedures, First Examination Reports (FER), Section 8 Compliance",
    bio: "Decades of public service insight into Indian Patent Office examination standards, helping enterprises streamline prosecution timelines."
  },
  {
    name: "Dr. Ishita Bannerjee",
    role: "Biotech Patent Specialist",
    company: "Bharat Biotech International",
    location: "Hyderabad, India",
    practice: "Vaccines & Immunotherapy IP",
    experience: 15,
    education: "JNU New Delhi (Ph.D.), Osmania Law",
    skills: "Adjuvant Formulations, Inactivated Vaccines, Viral Vector Patents, WHO Prequalification IP",
    bio: "Key architect of intellectual property portfolios safeguarding life-saving vaccines and recombinant adjuvant technologies."
  },
  {
    name: "Tarini Roy",
    role: "Media & Entertainment IP Counsel",
    company: "Yash Raj Films",
    location: "Mumbai, India",
    practice: "Film Production & Character Merchandising",
    experience: 10,
    education: "Jindal Global Law School",
    skills: "Character Merchandising Rights, Script Optioning, Chain-of-Title Verifications",
    bio: "Managing title clearances, film score rights, international co-production treaties, and global theatrical intellectual property."
  },
  {
    name: "Madhuri Rao",
    role: "Director of IP - Telecom",
    company: "Tejas Networks",
    location: "Bengaluru, India",
    practice: "5G/6G & Optical Networking IP",
    experience: 17,
    education: "NIT Karnataka (B.Tech), NLSIU Bangalore",
    skills: "Optical Transport Patents, 3GPP Standard Contributions, SEP Portfolio Valuation",
    bio: "Driving India's sovereign telecom IP assets, contributing to 3GPP standards, and building resilient 5G/6G indigenous patent blocks."
  },
  {
    name: "Rupal Trivedi",
    role: "Lead Patent Counsel",
    company: "Zydus Lifesciences",
    location: "Ahmedabad, India",
    practice: "Novel Chemical Entities (NCE)",
    experience: 13,
    education: "Gujarat National Law University (GNLU)",
    skills: "NCE Synthesis Routes, Polymorph Patents, Drug Repurposing Disclosures",
    bio: "Focusing on small-molecule pipeline patents, crystallographic polymorph claims, and global clinical exclusivity extensions."
  },
  {
    name: "Sushma Bhatia",
    role: "Partner - IP Transactions",
    company: "Kochhar & Co.",
    location: "Gurugram, India",
    practice: "Cross-Border Technology Agreements",
    experience: 15,
    education: "Amity Law School Delhi",
    skills: "Technology Transfer Agreements, Joint Venture IP Allocation, Escrow Source Code Agreements",
    bio: "Crafting bulletproof joint venture IP holding structures and software escrow terms for Indo-European tech consortia."
  },
  {
    name: "Vidya Krishnan",
    role: "Senior Patent Agent",
    company: "De Penning & De Penning",
    location: "Chennai, India",
    practice: "Precision Engineering & Heavy Machinery",
    experience: 14,
    education: "College of Engineering Guindy (Anna Univ), Registered Patent Agent",
    skills: "Automotive Suspension Patents, Industrial Valves, Hydraulics Inventions, PCT Filing",
    bio: "Expert drafter of mechanical inventions, robotic assembly jigs, and industrial fabrication apparatus patents for international innovators."
  },
  {
    name: "Charu Srivastava",
    role: "Patent Analytics Lead",
    company: "CPA Global / Questel India",
    location: "Noida, India",
    practice: "IP Landscaping & Invalidation Searches",
    experience: 10,
    education: "IIT Roorkee (Biotechnology), Patent Bar",
    skills: "Patent Validity Searches, Claim Charting, 102/103 Obviousness Analysis, Semantic Search",
    bio: "Specializing in crafting devastating prior art claim charts for US inter partes review (IPR) and European opposition proceedings."
  },
  {
    name: "Leela Namboodiri",
    role: "Chief Trademark Counsel",
    company: "Dabur India Limited",
    location: "New Delhi, India",
    practice: "Ayurvedic Products & Consumer IP",
    experience: 19,
    education: "Kerala Law Academy",
    skills: "Traditional Formulation Protection, Passing Off Litigation, Trade Dress Safeguards",
    bio: "Protecting iconic Indian FMCG trademarks, defending herbal formulations against predatory imitators in over 60 export markets."
  },
  {
    name: "Priyanka Sethi",
    role: "IP Policy & Advocacy Director",
    company: "FICCI Intellectual Property Forum",
    location: "New Delhi, India",
    practice: "National IP Policy & Legislative Reform",
    experience: 16,
    education: "National Law University Delhi (LL.M)",
    skills: "Legislative Drafting, TRIPS Compliance, Innovation Indexes, Inter-Ministerial Consultations",
    bio: "Advocating for robust innovation ecosystems, streamlined patent office backlogs, and progressive amendments to Indian copyright laws."
  },
  {
    name: "Barkha Rastogi",
    role: "Senior Associate - IP Advisory",
    company: "S.S. Rana & Co.",
    location: "New Delhi, India",
    practice: "Anti-Counterfeiting & Brand Enforcement",
    experience: 9,
    education: "Campus Law Centre, Delhi University",
    skills: "Criminal Raid Coordination, Civil Injunctions, Online Marketplace Enforcement",
    bio: "Executing coordinated enforcement actions with law enforcement agencies to eliminate counterfeit auto parts and pharmaceuticals."
  },
  {
    name: "Namrata Somani",
    role: "Head of Patent Strategy",
    company: "Freshworks Inc.",
    location: "Chennai, India",
    practice: "Customer Engagement Cloud Patents",
    experience: 11,
    education: "Symbiosis International University",
    skills: "Omnichannel Architecture Patents, Conversational Bot Inventions, USPTO Prosecutions",
    bio: "Leading patent harvesting and USPTO prosecution for multi-channel CRM, automated ticket routing, and conversational AI features."
  },
  {
    name: "Trisha Dutta",
    role: "Associate Partner",
    company: "Fox & Mandal",
    location: "Kolkata, India",
    practice: "Commercial IP Contracts",
    experience: 12,
    education: "NUJS Kolkata",
    skills: "Licensing Negotiations, Franchise IP Agreements, Software Distribution Clauses",
    bio: "Counseling retail franchisors and software houses on intellectual property revenue sharing, territorial exclusivity, and audits."
  },
  {
    name: "Jyoti Mahajan",
    role: "Senior Patent Drafter",
    company: "LexOrbis",
    location: "Mumbai, India",
    practice: "Nanotechnology & Materials Science",
    experience: 10,
    education: "ICT Mumbai (Chemical Eng), Law Bar",
    skills: "Carbon Nanotube Patents, Catalyst Claims, Battery Electrode Inventions",
    bio: "Specializing in drafting complex nanomaterial claims, synthetic graphene manufacturing procedures, and solid-state battery patents."
  },
  {
    name: "Rashmi Vohra",
    role: "Partner - IP Disputes",
    company: "Lall & Sethi",
    location: "New Delhi, India",
    practice: "Domain Name Disputes & Cyber Squatting",
    experience: 14,
    education: "Army Institute of Law Mohali",
    skills: "UDRP Arbitrations, INDRP Complaints, Digital Impersonation, Social Handle Recovery",
    bio: "Leading counsel for WIPO UDRP and .IN domain name dispute resolutions, recovering hijacked corporate digital assets."
  },
  {
    name: "Aruna Swaminathan",
    role: "Director of IP - Renewable Energy",
    company: "ReNew Power",
    location: "Gurugram, India",
    practice: "Solar & Wind CleanTech Inventions",
    experience: 15,
    education: "Anna University (Electrical Eng), NLSIU Bangalore",
    skills: "Solar Inverter Topologies, Wind Turbine Pitch Control Patents, Grid Balancing IP",
    bio: "Directing patent creation and IP valuation for utility-scale solar generation, hybrid wind installations, and battery energy storage."
  },
  {
    name: "Chetna Parekh",
    role: "Senior Legal Counsel",
    company: "Marico Limited",
    location: "Mumbai, India",
    practice: "Packaging Design & Trademark Enforcement",
    experience: 12,
    education: "Government Law College Mumbai",
    skills: "Bottle Design Injunctions, Distinctive Container Trademarks, Comparative Advertising Law",
    bio: "Defending signature consumer packaging shapes and prosecuting comparative advertising disparagement claims across national TV and digital media."
  },
  {
    name: "Harini Rajagopal",
    role: "Senior Patent Agent",
    company: "Origiin IP Solutions",
    location: "Bengaluru, India",
    practice: "Deep Learning & NLP Patents",
    experience: 8,
    education: "PES University (Computer Science), Patent Bar",
    skills: "Natural Language Processing Claims, Neural Network Compression, Speech Recognition IP",
    bio: "Assisting Bengaluru AI startups in converting proprietary transformer model optimizations into defensible patent claims."
  },
  {
    name: "Lavanya Murthy",
    role: "IP Commercialization Counsel",
    company: "C-CAMP (Centre for Cellular and Molecular Platforms)",
    location: "Bengaluru, India",
    practice: "Synthetic Biology & Agritech Innovations",
    experience: 10,
    education: "University of Agricultural Sciences Bangalore, NLSIU",
    skills: "CRISPR Licensing, Biological Material Transfer Agreements (MTA), Bio-incubator IP",
    bio: "Managing material transfer agreements, CRISPR-Cas license allocations, and IP spin-out terms for biotech innovators."
  },
  {
    name: "Vasudha Godbole",
    role: "Senior Associate - IP & Trade",
    company: "Vaish Associates Advocates",
    location: "New Delhi, India",
    practice: "International Trade & IP Tariffs",
    experience: 11,
    education: "ILS Law College Pune, Georgetown Law (LL.M)",
    skills: "WTO Dispute Settlements, TRIPS Flexibilities, Compulsory Licensing Provisions",
    bio: "Advising governments and multinational corporations on TRIPS public health flexibilities, technology transfer restrictions, and international trade treaties."
  },

  // 51 to 100: FOREIGN FEMALE NAMES & PROFILES (GLOBAL)
  {
    name: "Dr. Eleanor Vance",
    role: "Senior Patent Partner",
    company: "Bird & Bird LLP",
    location: "London, United Kingdom",
    practice: "European Patent Prosecution (EPO)",
    experience: 19,
    education: "University of Oxford (Ph.D. Quantum Physics), BPP Law School",
    skills: "EPO Opposition, Quantum Computing Patents, Unified Patent Court (UPC) Litigation",
    bio: "Top-ranked European Patent Attorney specializing in quantum algorithms, superconducting qubits, and multi-jurisdictional UPC enforcement."
  },
  {
    name: "Claire Dupont",
    role: "Head of Global Trademarks",
    company: "LVMH Moët Hennessy Louis Vuitton",
    location: "Paris, France",
    practice: "Luxury Brand Protection & Fashion Law",
    experience: 17,
    education: "Université Paris-Panthéon-Assas, Columbia Law School (LL.M)",
    skills: "3D Trademark Registration, Haute Couture Design Rights, Anti-Counterfeiting",
    bio: "Managing high-profile brand equity, sensory trademarks, and international counterfeit interdiction for iconic fashion and luxury houses."
  },
  {
    name: "Charlotte Sterling",
    role: "Lead IP Counsel - AI & Autonomous Vehicles",
    company: "Waymo / Alphabet",
    location: "San Francisco, USA",
    practice: "Autonomous Systems & Sensor Fusion",
    experience: 14,
    education: "Stanford Law School, UC Berkeley (B.S. EECS)",
    skills: "LiDAR Inventions, Autonomous Driving Models, USPTO PTAB Trials, Standards IP",
    bio: "Overseeing patent portfolios in computer vision, neural driving policies, simulation architectures, and vehicle-to-everything (V2X) protocols."
  },
  {
    name: "Dr. Sophia Hartmann",
    role: "Partner - Life Sciences IP",
    company: "Hogan Lovells",
    location: "Munich, Germany",
    practice: "Pharmaceutical Patents & Supplementary Protection Certificates (SPC)",
    experience: 16,
    education: "Ludwig Maximilian University of Munich (Dr. rer. nat.), German Patent Bar",
    skills: "SPC Calculations, Second Medical Use Claims, German Federal Patent Court Nullity",
    bio: "Recognized German Patent Attorney representing global biopharma giants in complex European nullity and SPC duration litigations."
  },
  {
    name: "Isabella Rossi",
    role: "Director of IP & Industrial Design",
    company: "Ferrari S.p.A.",
    location: "Maranello, Italy",
    practice: "Automotive Industrial Design & Aerodynamics IP",
    experience: 15,
    education: "Bocconi University, University of Milan Law",
    skills: "Automotive Body Designs, Wind Tunnel Inventions, Hybrid Powertrain Trademarks",
    bio: "Protecting the aesthetic soul and aerodynamic breakthroughs of world-class supercars across the WIPO Hague System and international design registries."
  },
  {
    name: "Camille Laurent",
    role: "General Counsel - Creative Rights",
    company: "Ubisoft Entertainment",
    location: "Montreal, Canada",
    practice: "Video Game IP & Virtual Assets",
    experience: 12,
    education: "McGill University Faculty of Law",
    skills: "Game Engine Copyright, Virtual Currency IP, Voice Actor Rights, Motion Capture Licensing",
    bio: "Navigating virtual worlds, interactive storytelling protections, procedurally generated game landscapes, and global distribution licenses."
  },
  {
    name: "Sarah Jenkins",
    role: "Principal Patent Attorney",
    company: "Finnegan, Henderson, Farabow, Garrett & Dunner",
    location: "Washington D.C., USA",
    practice: "ITC Section 337 & Federal Circuit Litigation",
    experience: 18,
    education: "Harvard Law School, MIT (B.S. Mechanical Eng)",
    skills: "USITC Exclusion Orders, CAFC Appeals, Markman Hearings, Semiconductor Disputes",
    bio: "Formidable trial attorney with 25+ appearances before the US International Trade Commission securing nationwide import exclusion orders."
  },
  {
    name: "Elena Rostova",
    role: "Senior IP Strategist",
    company: "Kaspersky Lab Global IP",
    location: "Zurich, Switzerland",
    practice: "Cyber Defense & Threat Intelligence IP",
    experience: 13,
    education: "ETH Zurich (Computer Science), University of Zurich Law",
    skills: "Heuristic Malware Detection Patents, Zero-Day Exploit Safeguards, Trade Secret Firewalls",
    bio: "Directing patent strategies across defensive endpoint monitoring, behavioral heuristics, and global threat detection frameworks."
  },
  {
    name: "Beatrice Moreau",
    role: "Senior Legal Director - IP",
    company: "Sanofi Pasteur",
    location: "Lyon, France",
    practice: "Vaccines & Biotherapeutic IP",
    experience: 16,
    education: "Sciences Po Paris, University of Strasbourg CEIPI",
    skills: "mRNA Technology Patents, Lyophilization Claims, Global Alliance IP Structuring",
    bio: "Managing complex multi-party research consortia, international vaccine supply IP agreements, and mRNA lipid nanoparticle licenses."
  },
  {
    name: "Fiona MacLeod",
    role: "Partner - IP Disputes",
    company: "Pinsent Masons",
    location: "Edinburgh, United Kingdom",
    practice: "Energy Transition & Offshore Wind IP",
    experience: 14,
    education: "University of Edinburgh Law School",
    skills: "Floating Wind Patents, Subsea Cable Connectors, Carbon Capture IP, UK High Court IP",
    bio: "Pioneering patent protection for deepwater floating wind foundations, subsea mooring systems, and industrial carbon capture technologies."
  },
  {
    name: "Dr. Astrid Lindholm",
    role: "Head of Patent Development",
    company: "Ericsson Global IP",
    location: "Stockholm, Sweden",
    practice: "Telecommunications & Standard Essential Patents (SEP)",
    experience: 17,
    education: "KTH Royal Institute of Technology (Ph.D.), European Patent Attorney",
    skills: "5G Core Architecture, Beamforming Patents, FRAND Licensing, ETSI Disclosures",
    bio: "Key architect of Ericsson's 5G and 6G standard essential patent submissions and cross-licensing arrangements with global smartphone manufacturers."
  },
  {
    name: "Victoria Montgomery",
    role: "Partner & Head of Trademarks",
    company: "DLA Piper LLP",
    location: "New York, USA",
    practice: "Global Brand Management & Media",
    experience: 20,
    education: "Columbia Law School",
    skills: "Worldwide Trademark Prosecution, Dilution Claims, Metaverse Branding Strategies",
    bio: "Advisor to Fortune 50 media conglomerates, social networks, and streaming giants on international trademark clearance and brand enforcement."
  },
  {
    name: "Laura Chen",
    role: "VP of Intellectual Property",
    company: "ByteDance / TikTok Global",
    location: "Singapore",
    practice: "Recommendation Algorithms & Digital Video IP",
    experience: 13,
    education: "National University of Singapore (NUS Law), Tsinghua University",
    skills: "Recommendation Engine Patents, Content Fingerprinting, Audio-Video Sync IP",
    bio: "Overseeing massive global patent filing programs for short-video real-time encoding, video recommendation algorithms, and sound matching technologies."
  },
  {
    name: "Olivia Thornton",
    role: "Senior Patent Counsel",
    company: "AstraZeneca Biologics",
    location: "Cambridge, United Kingdom",
    practice: "Oncology & Antibody-Drug Conjugates",
    experience: 15,
    education: "University of Cambridge (Ph.D. Molecular Biology), Registered UK & EP Attorney",
    skills: "Monoclonal Antibodies, ADC Linkers, Target Antigen Exclusivity, EPO Oppositions",
    bio: "Spearheading patent lifecycle extension for targeted oncology drugs, bispecific antibodies, and proprietary antibody-drug conjugate (ADC) linkers."
  },
  {
    name: "Dr. Hannah Lindqvist",
    role: "Director of IP Commercialization",
    company: "Novo Nordisk",
    location: "Copenhagen, Denmark",
    practice: "Peptide Therapeutics & Drug Delivery Devices",
    experience: 16,
    education: "University of Copenhagen (Medicinal Chemistry), European Patent Bar",
    skills: "GLP-1 Analog Patents, Pen Injector Mechanics, Formulation Exclusivities",
    bio: "Managing the world's most valuable peptide metabolic medicine patent estates and high-precision mechanical autoinjector delivery devices."
  },
  {
    name: "Emily Watson",
    role: "Partner - IP Litigation",
    company: "Kirkland & Ellis LLP",
    location: "Chicago, USA",
    practice: "Jury Trial Patent Litigation",
    experience: 18,
    education: "University of Chicago Law School",
    skills: "Federal District Court Jury Trials, Technical Expert Cross-Examination, Damages Testimony",
    bio: "Acclaimed first-chair trial lawyer with over $2B in defended patent damage claims across microprocessors, telecom, and medical implants."
  },
  {
    name: "Sofia Alvarez",
    role: "Senior Partner",
    company: "Baker McKenzie",
    location: "Madrid, Spain",
    practice: "European Trademark & Customs IP",
    experience: 15,
    education: "Universidad Complutense de Madrid, King's College London (LL.M)",
    skills: "EUIPO Cancellations, Spanish Supreme Court Appeals, Mediterranean Border Seizures",
    bio: "Defending premier European beverage, wine appellation, and high-fashion trademarks before the EUIPO Boards of Appeal in Alicante."
  },
  {
    name: "Dr. Chloe Zhang",
    role: "Lead Patent Counsel",
    company: "Tencent Technology Licensing",
    location: "Hong Kong",
    practice: "Cloud Computing & Fintech Patents",
    experience: 11,
    education: "Hong Kong University of Science and Technology, Peking University Law",
    skills: "Distributed Ledger Inventions, Microservices Patents, Chinese CNIPA Prosecution",
    bio: "Pioneering patent strategies across high-concurrency cloud databases, biometric payment systems, and cross-border digital wallets."
  },
  {
    name: "Freja Møller",
    role: "Chief IP Officer",
    company: "Vestas Wind Systems",
    location: "Aarhus, Denmark",
    practice: "Clean Energy & Mechanical Patents",
    experience: 19,
    education: "Aarhus University (Mechanical Eng & Law)",
    skills: "Composite Blade Aerodynamics, Pitch Bearings IP, Grid Compatibility Controls",
    bio: "Directing the global patent strategy for modular wind turbine blades, advanced carbon composite structures, and predictive yaw controllers."
  },
  {
    name: "Valentina Morales",
    role: "Head of IP & Regulatory Affairs",
    company: "Grupo Bimbo Global",
    location: "Mexico City, Mexico",
    practice: "Food Technology & Packaging Innovations",
    experience: 14,
    education: "Universidad Nacional Autónoma de México (UNAM)",
    skills: "Food Shelf-Life Formulations, Sustainable Film Packaging, Latin American Trademark Roster",
    bio: "Leading food science patent filings, biodegradable baking wraps, and brand protection across North, Central, and South America."
  },
  {
    name: "Genevieve Dubois",
    role: "Senior Patent Attorney",
    company: "L'Oréal Research & Innovation",
    location: "Paris, France",
    practice: "Cosmetic Chemistry & Dermatological IP",
    experience: 16,
    education: "Sorbonne Université (Chemistry), CEIPI Strasbourg",
    skills: "Skin Microbiome Formulations, Sunscreen Filters, Bio-fermentation Patents",
    bio: "Crafting worldwide patent protections for anti-aging peptides, UV screening molecule assemblies, and personalized skincare diagnostic apps."
  },
  {
    name: "Dr. Mei-Ling Huang",
    role: "Senior Director of Patents",
    company: "Taiwan Semiconductor Manufacturing Co. (TSMC)",
    location: "Hsinchu, Taiwan",
    practice: "Advanced Node Semiconductor Lithography",
    experience: 18,
    education: "National Taiwan University (Ph.D. Material Science), US Patent Agent",
    skills: "2nm Gate-All-Around (GAA) Transistors, Extreme Ultraviolet (EUV) Masks, Packaging IP",
    bio: "Managing core patent portfolios protecting sub-3nm nanosheet architectures, backside power delivery networks, and advanced 3D packaging."
  },
  {
    name: "Jessica Miller",
    role: "Head of Open Source & Tech IP",
    company: "Red Hat / IBM",
    location: "Raleigh, North Carolina, USA",
    practice: "Open Source Licensing & Cloud Infrastructure",
    experience: 13,
    education: "Duke University School of Law",
    skills: "GPLv3 Compliance, Apache Software Licensure, Open Source Patent Pledges",
    bio: "Advising enterprise engineering communities on open-source inbound/outbound compliance, Linux kernel patents, and patent commons initiatives."
  },
  {
    name: "Emma Campbell",
    role: "Partner - IP Disputes",
    company: "Allens Linklaters",
    location: "Sydney, Australia",
    practice: "Federal Court of Australia Patent Litigation",
    experience: 17,
    education: "University of Sydney Law School",
    skills: "Australian Federal Court Trials, High Court Appeals, Mining Tech Patents, Pharma Disputes",
    bio: "Leading Australian trial counsel for automated autonomous haulage systems, resource extraction IP, and biologics market exclusivity."
  },
  {
    name: "Dr. Ingrid Weber",
    role: "VP of Global Patents",
    company: "Siemens AG",
    location: "Munich, Germany",
    practice: "Industrial Automation & Digital Twins",
    experience: 21,
    education: "Technical University of Munich (Dr.-Ing.), German & European Patent Bar",
    skills: "Digital Twin Systems, Factory Automation Protocols, SCADA Security Inventions",
    bio: "Overseeing 15,000+ active patent families covering cyber-physical production systems, smart grid distribution, and train traction electronics."
  },
  {
    name: "Natalie Brooks",
    role: "Lead Copyright & Licensing Counsel",
    company: "Spotify Global",
    location: "London, United Kingdom",
    practice: "Music Streaming & Podcast Syndication",
    experience: 12,
    education: "London School of Economics (LL.B)",
    skills: "Mechanical Streaming Rights, Podcast Talent Agreements, Global Royalty Distribution",
    bio: "Drafting global master licensing deals, statutory mechanical rate negotiations, and dynamic audio insert advertising intellectual property."
  },
  {
    name: "Rachel O'Connor",
    role: "Managing Partner",
    company: "Mason Hayes & Curran",
    location: "Dublin, Ireland",
    practice: "European Tech IP & Data Holding Structures",
    experience: 18,
    education: "Trinity College Dublin Law",
    skills: "Irish IP Holding Boxes, European R&D Tax Credit Alignments, SaaS Data Rights",
    bio: "Structuring IP ownership frameworks, software transfer pricing compliance, and European headquarters licensing models for Silicon Valley giants."
  },
  {
    name: "Dr. Samantha Vance",
    role: "Principal Patent Counsel",
    company: "Moderna Therapeutics",
    location: "Boston, Massachusetts, USA",
    practice: "mRNA Platforms & Lipid Nanoparticles",
    experience: 14,
    education: "Harvard Medical School (Ph.D. Immunology), Boston University Law",
    skills: "mRNA Sequence Modifications, LNP Formulation Claims, Inter Partes Review (IPR)",
    bio: "Defending foundational mRNA platform patents, modified nucleosides, and lipid envelope delivery systems against multinational challenges."
  },
  {
    name: "Juliana Gomez",
    role: "Senior IP Counsel - South America",
    company: "Mercado Libre",
    location: "Buenos Aires, Argentina",
    practice: "E-Commerce IP & Payment Fintech",
    experience: 11,
    education: "Universidad de Buenos Aires Law",
    skills: "Regional Trademark Strategy, Brand Protection Programs, QR Code Payment IP",
    bio: "Protecting fintech and e-commerce ecosystems across Brazil, Argentina, Colombia, and Chile, managing anti-piracy collaborations."
  },
  {
    name: "Alice Hamilton",
    role: "Partner - IP Commercialization",
    company: "Mishcon de Reya LLP",
    location: "London, United Kingdom",
    practice: "Sports IP & Athlete Image Rights",
    experience: 15,
    education: "UCL Faculty of Laws",
    skills: "Premier League Athlete Image Rights, Stadium Naming Deals, Broadcasting Licensing",
    bio: "Specializing in structuring commercial rights, endorsement monopolies, and international broadcast syndication for elite football and motorsport teams."
  },
  {
    name: "Dr. Rebecca Fontaine",
    role: "Director of IP - Neurotechnology",
    company: "Neuralink / MedTech Labs",
    location: "Austin, Texas, USA",
    practice: "Brain-Computer Interfaces (BCI) & Robotics",
    experience: 12,
    education: "Johns Hopkins University (Ph.D. Neural Eng), Stanford Law",
    skills: "Micron-Scale Electrode Patents, Biocompatible Hermetic Seals, Neural Signal Decoders",
    bio: "Navigating pioneering patent protection for invasive brain-computer interface electrodes, robotic surgical inserters, and low-latency decoders."
  },
  {
    name: "Mia Tanaka",
    role: "General Manager of Patents",
    company: "Sony Corporation of America",
    location: "San Mateo, California, USA",
    practice: "Sensory Electronics & Spatial Audio",
    experience: 16,
    education: "University of Tokyo (B.Eng), UCLA School of Law",
    skills: "CMOS Image Sensors, 3D Spatial Audio, PlayStation Hardware Patents",
    bio: "Managing patent prosecution across stacked CMOS image sensors, immersive spatial audio engines, and haptic feedback controller mechanisms."
  },
  {
    name: "Katherine Pierce",
    role: "Chief Trademark Counsel",
    company: "The Coca-Cola Company",
    location: "Atlanta, Georgia, USA",
    practice: "Global Beverage Trademarks & Trade Dress",
    experience: 22,
    education: "Emory University School of Law",
    skills: "Contour Bottle Trade Dress, Famous Mark Protection, 200+ Country Portfolio Maintenance",
    bio: "Safeguarding some of the planet's most recognized brand marks, signature bottle silhouettes, and advertising slogans across 200+ territories."
  },
  {
    name: "Juliette Mercier",
    role: "Head of Patent Strategy",
    company: "Airbus Defence and Space",
    location: "Toulouse, France",
    practice: "Aerospace & Satellite Communications",
    experience: 17,
    education: "Institut Polytechnique de Paris, University of Toulouse Law",
    skills: "Geostationary Satellite Inventions, Laser Inter-Satellite Links, Avionics Security",
    bio: "Directing patent protection for advanced satellite constellation communications, phased array antennas, and autonomous commercial avionics."
  },
  {
    name: "Diana Prince",
    role: "Senior Patent Agent",
    company: "Fish & Richardson P.C.",
    location: "Boston, Massachusetts, USA",
    practice: "CRISPR & Gene Editing Technologies",
    experience: 13,
    education: "MIT (Ph.D. Genetics), USPTO Bar",
    skills: "CRISPR-Cas9 Interferences, Base Editing Claims, Prime Editing Delivery Patents",
    bio: "Extensive experience in high-stakes USPTO patent interference contests and international prosecution of precision gene editing architectures."
  },
  {
    name: "Zoe Crawford",
    role: "Director of IP Disputes",
    company: "Herbert Smith Freehills",
    location: "London, United Kingdom",
    practice: "Life Sciences High Court Litigation",
    experience: 15,
    education: "King's College London (BSc Pharmacology & Law)",
    skills: "Preliminary Injunctions, Arrow Declarations, Patent Settlement Compliance",
    bio: "Leading contentious patent disputes in the Patents Court of England and Wales, handling pioneering Arrow declarations for originator drugs."
  },
  {
    name: "Gabriella Santos",
    role: "Lead Trademark Partner",
    company: "Pinheiro Neto Advogados",
    location: "São Paulo, Brazil",
    practice: "Latin American IP & INPI Practice",
    experience: 16,
    education: "Universidade de São Paulo (USP)",
    skills: "INPI Patent Prosecution Highway, Technology Transfer Approval, Unfair Competition Law",
    bio: "Expert on Brazilian National Institute of Industrial Property (INPI) procedures, registration of foreign technology agreements, and trademark oppositions."
  },
  {
    name: "Dr. Clara Schumann",
    role: "Senior Patent Attorney",
    company: "Vossius & Partner",
    location: "Munich, Germany",
    practice: "Optics, Photonics & Laser Systems",
    experience: 14,
    education: "Max Planck Institute (Ph.D. Laser Physics), German Patent Bar",
    skills: "Femtosecond Lasers, Optical Metrology Claims, German & EPO Litigation",
    bio: "Drafting and defending patents in ultrafast laser manufacturing tools, EUV optical components, and precision quantum metrology systems."
  },
  {
    name: "Nadia Al-Mansoor",
    role: "Managing Director of IP & Tech Transfer",
    company: "KAUST (King Abdullah University of Science and Technology)",
    location: "Thuwal / Dubai, UAE",
    practice: "Middle East Innovation & Tech Transfer",
    experience: 15,
    education: "American University of Beirut, Georgetown Law (LL.M)",
    skills: "Saudi & GCC Patent Office Practice, Desalination Patents, Solar Membrane IP",
    bio: "Spearheading regional intellectual property policy, solar-powered water desalination patents, and building the GCC's premier deep-tech incubation hub."
  },
  {
    name: "Grace Kelly",
    role: "Senior Director - Brand Legal",
    company: "Warner Bros. Discovery",
    location: "Burbank, California, USA",
    practice: "Franchise IP & Character Licensing",
    experience: 18,
    education: "USC Gould School of Law",
    skills: "Iconic Character Trademarks, Theme Park Ride Licensing, Global Merchandising Monopolies",
    bio: "Preserving multi-billion dollar cinematic franchises, defending comic character trademarks, and supervising worldwide merchandise licensing deals."
  },
  {
    name: "Hannah Fischer",
    role: "Head of Patent Operations",
    company: "BMW Group Legal",
    location: "Munich, Germany",
    practice: "Autonomous Driving & Electric Drivetrains",
    experience: 16,
    education: "Technical University of Munich (Informatics & Law)",
    skills: "Solid-State Battery Enclosures, Autonomous Parking Algorithms, Car-to-Cloud IP",
    bio: "Directing international patent prosecution across electric drive module architectures, regenerative braking, and Level 3 automated driving systems."
  },
  {
    name: "Dr. Yoko Takahashi",
    role: "General Manager - Global IP",
    company: "Canon Inc. Global IP Headquarters",
    location: "Tokyo, Japan",
    practice: "Optoelectronic Sensors & Printing Technologies",
    experience: 22,
    education: "University of Tokyo (Ph.D. Applied Physics), Registered Benrishi",
    skills: "Nanoimprint Lithography Patents, Inkjet Fluidics, JPO Board of Appeals Trials",
    bio: "Pioneering Japanese Benrishi leading high-volume USPTO and JPO patent creation across nanoimprint lithography, medical optical scanners, and cameras."
  },
  {
    name: "Miriam Cohen",
    role: "Partner - Cyber & Tech Law",
    company: "Meitar Law Offices",
    location: "Tel Aviv, Israel",
    practice: "Cybersecurity & Cryptography IP",
    experience: 14,
    education: "Tel Aviv University Law, NYU Law (LL.M)",
    skills: "Zero-Knowledge Proofs, Homomorphic Encryption Patents, Tech M&A IP Audits",
    bio: "Advising world-leading Israeli cybersecurity scale-ups on patenting homomorphic encryption algorithms and preparing for multi-billion dollar NASDAQ exits."
  },
  {
    name: "Carmen Vega",
    role: "Senior Director - IP & Compliance",
    company: "Inditex (Zara Global)",
    location: "A Coruña, Spain",
    practice: "Fast-Fashion Design Rights & Supply Chain IP",
    experience: 15,
    education: "Universidad de Salamanca",
    skills: "Unregistered Community Design Rights, Automated Fabric Cutting IP, RFID Supply Chain Tracking",
    bio: "Navigating unregistered Community design protections, automated logistics sorting patents, and defending against fast-fashion design infringement disputes."
  },
  {
    name: "Alexandra Hayes",
    role: "Principal Patent Counsel",
    company: "Quantum Circuits Inc. / Yale Spinout",
    location: "New Haven, Connecticut, USA",
    practice: "Quantum Hardware & Error Correction",
    experience: 11,
    education: "Yale University (B.S. Physics), Columbia Law School",
    skills: "Modular Quantum Architectures, Quantum Error Correction Codes, Cryogenic Electronics",
    bio: "Drafting fundamental patents for modular quantum computer frameworks, error-corrected logical qubits, and microwave resonator readouts."
  },
  {
    name: "Dr. Evelyn Reed",
    role: "VP of Intellectual Property",
    company: "Illumina Inc.",
    location: "San Diego, California, USA",
    practice: "Next-Generation DNA Sequencing (NGS)",
    experience: 18,
    education: "UC San Diego (Ph.D. Genomics), UC Berkeley School of Law",
    skills: "Sequencing-by-Synthesis (SBS) Patents, Flow Cell Chemistry, Fluorescent Dye Exclusivity",
    bio: "Leading worldwide patent defense and enforcement for sequencing-by-synthesis flow cells, reversible terminators, and genomic bioinformatics software."
  },
  {
    name: "Teresa Silva",
    role: "Head of Trademark & Brand Security",
    company: "Embraer S.A.",
    location: "São José dos Campos, Brazil",
    practice: "Aviation & Defense Intellectual Property",
    experience: 17,
    education: "Universidade Presbiteriana Mackenzie",
    skills: "Regional Jet Aerodynamics, Fly-by-Wire Avionics IP, Military Aircraft Trademark Portfolios",
    bio: "Managing aerospace IP assets, composite wing assembly patents, and defense supply chain technology disclosures across the Americas and Europe."
  },
  {
    name: "Brooke Kensington",
    role: "Senior Partner",
    company: "Clifford Chance LLP",
    location: "London, United Kingdom",
    practice: "Fintech, Derivatives & AI Licensing",
    experience: 19,
    education: "University of Cambridge (MA Law)",
    skills: "Algorithmic Trading Systems, ISDA Standard Tech Terms, Bank Consortium IP",
    bio: "Advising tier-1 investment banks on intellectual property joint ventures, quantitative trading software licenses, and clearinghouse proprietary systems."
  },
  {
    name: "Dr. Kimberly Adams",
    role: "Chief Patent Counsel",
    company: "Genentech / Roche Group",
    location: "South San Francisco, USA",
    practice: "Therapeutic Antibodies & Targeted Cell Therapy",
    experience: 20,
    education: "Stanford University (Ph.D. Immunology), Harvard Law School",
    skills: "CAR-T Cell Patents, Biologic Exclusivity Extensions, Federal Circuit Oral Arguments",
    bio: "Veteran biotech patent strategist managing multi-billion dollar biological franchises, chimeric antigen receptor therapies, and pioneer drug exclusivities."
  },
  {
    name: "Serena Marchetti",
    role: "Director of IP Commercialization",
    company: "Barilla Group Global",
    location: "Parma, Italy",
    practice: "Agri-Food Processing & 3D Food Printing",
    experience: 13,
    education: "University of Bologna Law",
    skills: "3D Pasta Extrusion Patents, Eco-Friendly Cardboard Packaging, Italian Heritage Trademarks",
    bio: "Protecting breakthrough food manufacturing techniques, sustainable packaging closures, and iconic Italian culinary trademarks worldwide."
  }
];

async function seed100Accounts() {
  console.log(`=======================================================`);
  console.log(`Starting creation of 100 female IP accounts (50 Indian + 50 Foreign)`);
  console.log(`Emails: test1@gmail.com to test100@gmail.com | Password: 123456`);
  console.log(`=======================================================`);

  let createdCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (let i = 1; i <= 100; i++) {
    const email = `test${i}@gmail.com`;
    const password = '123456';
    const profileMeta = PROFILES_DATA[i - 1];
    const avatarUrl = AVATARS[(i - 1) % AVATARS.length];

    try {
      // 1. Check if user already exists
      let userId = null;

      // Check profiles first
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile?.id) {
        userId = existingProfile.id;
        console.log(`[${i}/100] User ${email} already exists with ID ${userId}.`);
      } else {
        // Try creating via admin auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: profileMeta.name,
            avatar_url: avatarUrl
          }
        });

        if (authError) {
          // If already registered in auth but profile didn't have email field set
          if (authError.message.includes('already registered')) {
            // Find in admin list
            const { data: userList } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
            const matched = userList?.users?.find(u => u.email === email);
            if (matched) {
              userId = matched.id;
            } else {
              throw authError;
            }
          } else {
            throw authError;
          }
        } else {
          userId = authData.user.id;
          createdCount++;
        }
      }

      if (!userId) {
        throw new Error('Unable to obtain userId');
      }

      // 2. Update the profile with rich title, bio, company, country, etc.
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: email,
          full_name: profileMeta.name,
          role: profileMeta.role,
          company: profileMeta.company,
          bio: profileMeta.bio,
          country: profileMeta.location,
          practice_area: profileMeta.practice,
          skills: profileMeta.skills,
          education: profileMeta.education,
          experience_years: profileMeta.experience,
          avatar_url: avatarUrl,
          membership_tier: 'ip_professional',
          verification_status: 'verified',
          onboarding_completed: true
        }, { onConflict: 'id' });

      if (profileUpdateError) {
        console.error(`[${i}/100] Profile update failed for ${email}:`, profileUpdateError.message);
        errorCount++;
      } else {
        updatedCount++;
        console.log(`[${i}/100] SUCCESS: ${email} -> "${profileMeta.name}" | ${profileMeta.role} at ${profileMeta.company} (${profileMeta.location})`);
      }

      // Tiny delay to be gentle on DB triggers and network
      await new Promise(r => setTimeout(r, 60));

    } catch (err) {
      console.error(`[${i}/100] FAILED for ${email}:`, err.message || err);
      errorCount++;
    }
  }

  console.log(`\n=======================================================`);
  console.log(`SEEDED SUMMARY:`);
  console.log(`Total Target: 100 accounts`);
  console.log(`Successfully Processed: ${updatedCount} profiles`);
  console.log(`Errors: ${errorCount}`);
  console.log(`All accounts: test1@gmail.com - test100@gmail.com`);
  console.log(`Password for all: 123456`);
  console.log(`=======================================================`);
}

seed100Accounts();

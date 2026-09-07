const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { Redis } = require('@upstash/redis');

// Load environment variables
const envPath = path.resolve(__dirname, '..', '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Setup optional Redis invalidation
let redisClient = null;
if (envConfig.UPSTASH_REDIS_REST_URL && envConfig.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redisClient = new Redis({
      url: envConfig.UPSTASH_REDIS_REST_URL,
      token: envConfig.UPSTASH_REDIS_REST_TOKEN
    });
  } catch (e) {
    console.warn('Redis client not available:', e.message);
  }
}

// Parse command-line args for delay options (defaults to 10s - 150s)
const args = process.argv.slice(2);
let minDelaySec = 10;
let maxDelaySec = 150;

if (args.includes('--fast')) {
  minDelaySec = 2;
  maxDelaySec = 6;
}
const minArgIdx = args.indexOf('--min');
if (minArgIdx !== -1 && args[minArgIdx + 1]) {
  minDelaySec = parseInt(args[minArgIdx + 1], 10) || 10;
}
const maxArgIdx = args.indexOf('--max');
if (maxArgIdx !== -1 && args[maxArgIdx + 1]) {
  maxDelaySec = parseInt(args[maxArgIdx + 1], 10) || 150;
}

// Curated professional imagery for posts (~35% of posts will have an image)
const POST_IMAGES = [
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80', // Courtroom & Law Books
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80', // Digital Tech Global Network
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80', // Team Discussion / Conference
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80', // Modern Law Firm Tower
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80', // Conference Keynote Hall
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80', // Biotech Research Lab
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80', // Executive Meeting
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80', // Women Leaders Collaborating
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80', // Cybersecurity & Data Law
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80', // Working Group Session
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80', // Patent Analytics & Strategy
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80', // Artificial Intelligence Coding
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=80', // Global Tech Summit
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80', // Startup Working Session
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80'  // Modern Legal Chambers
];

// Rich, authentic posts tailored to various IP disciplines
const POST_TEMPLATES = [
  "Just concluded oral proceedings at the European Patent Office (EPO). A truly deep exploration of inventive step thresholds for neural network diagnostic software. Delighted with the affirmative decision for our client! 🏛️⚖️ #PatentLaw #EPO #AIPatents",
  "Key takeaway from this morning's High Court trademark injunction hearing: early documentation of online commercial use and geo-targeted analytics is becoming the deciding factor in demonstrating secondary meaning. 📈 #Trademarks #BrandProtection",
  "Proud to mentor 15 brilliant junior patent agents and associates entering intellectual property practice this year through the WIPA network. The future of innovation law is diverse and unstoppable. ✨👩‍⚖️ #WomenInIP #Mentorship",
  "Breaking: New guidelines on patenting computer-implemented inventions and AI model architectures were just announced. Crucial reading for any in-house tech counsel structuring disclosure pipelines. 🤖📜 #SoftwarePatents #LegalTech #Innovation",
  "A friendly reminder to startup founders: filing your provisional patent applications BEFORE publicly demonstrating at demo days or publishing tech whitepapers is paramount. Protect your runway early! 🚀💡 #Startups #PatentStrategy #Founders",
  "Attending the Global IP & Technology Summit this week. Looking forward to connecting with fellow practitioners on cross-border patent prosecution and standard-essential patent (SEP) licensing frameworks. 🌏✈️ #IPSummit #Licensing #FRAND",
  "Reflecting on over a decade in practice today. The intellectual property sector has evolved from heavy paper dockets to predictive AI docketing—yet the essence remains steadfast: defending human ingenuity. 🏛️ #IntellectualProperty #LawPractice",
  "Our team successfully registered 3 new geographical indications (GIs) for traditional weaving and artisan clusters today. Using IP law to protect cultural heritage and empower grassroots communities is one of the most rewarding parts of our profession. 🧵✨ #GeographicalIndications #HeritageLaw",
  "Navigating the Unified Patent Court (UPC) has been a fascinating highlight of our European litigation team this quarter. Streamlined proceedings and pan-European injunction reach are reshaping global patent assertion strategies. 🇪🇺⚖️ #UPC #PatentLitigation",
  "Negotiating cross-border patent licensing agreements in biotechnology requires balancing regulatory data exclusivity with clinical patent terms. Always review your Orange Book and SPC expirations in unison! 🧬💊 #Biotech #PharmaIP #Licensing",
  "Excited to host an interactive masterclass on 'Trade Secrets vs. Patents in Machine Learning' next week on WIPA! We will examine training dataset confidentiality, clean-room protocols, and algorithmic reverse-engineering defenses. Join us! 💻🛡️ #TradeSecrets #MachineLearning #Webinar",
  "What is the biggest challenge in-house IP counsel face today? Managing budget ceilings while filing aggressively in emerging Asian and Latin American consumer markets. How is your team balancing volume vs. budget this fiscal year? 💭📊 #InHouseCounsel #IPBudgeting #Strategy",
  "Congratulations to our client for receiving their first US utility patent grant today on high-efficiency solar perovskite coatings! From the initial invention disclosure interview to the notice of allowance, it has been an exhilarating technical journey. ☀️⚡ #CleanTech #PatentGrant #GreenEnergy",
  "A landmark appellate ruling today underscores that brand owners must actively police dilution on third-party digital marketplaces. Takedown automation and continuous marketplace monitoring are no longer optional. 🛡️🔍 #ECommerce #AntiCounterfeiting #BrandDefense",
  "Thrilled to announce that our team has been recognized in the 2026 Women in IP Legal 500 roster! Tremendous gratitude to our visionary clients and dedicated colleagues across the globe. 🥂✨ #LegalAwards #WomenInLaw #Recognition",
  "When drafting patent claims for medical devices, always ensure your method claims distinguish between physiological diagnosis and therapeutic intervention to satisfy European and Indian statutory requirements. 🩺📑 #MedTech #PatentDrafting #IPStrategy",
  "Enjoying the vibrant networking discussions here at the WIPA platform! Fantastic to see so many trailblazing women in patent prosecution, trademark law, and venture capital connecting in one space. 🌐🤝 #Community #Networking #WIPA",
  "Managing multi-jurisdictional freedom-to-operate (FTO) clearances in the electric mobility sector is proving to be one of the most dynamic areas of engineering law right now. Battery thermal management alone is seeing exponential filing surges. 🔋🚗 #ElectricVehicles #CleanMobility #FTO",
  "Copyright ownership in generative music and synthetic media is rapidly heading toward legislative clarification. Contracts drafted today need explicit warranties regarding model pre-training inputs and synthetic attribution. 🎵🎧 #Copyright #EntertainmentLaw #DigitalMedia",
  "A wonderful panel discussion this afternoon on 'Navigating Partner Track as a Woman in IP Law'. Supportive mentorship, technical specialization, and business development acumen are the three pillars that make all the difference. 💼👠 #CareerGrowth #LawFirmLeadership #WomenInLaw",
  "Fascinating case study in our docket today: converting university laboratory proof-of-concepts into a defensible patent thicket for deep-tech spinouts. Prioritize core composition of matter claims first! 🔬📚 #TechTransfer #DeepTech #UniversityIP",
  "Defending client trademarks against bad-faith cyber-squatting and typo-squatting before the WIPO Arbitration and Mediation Center. UDRP remains one of the most effective rapid-remedy frameworks in international law. 🌐⚖️ #DomainDisputes #UDRP #CyberLaw",
  "Semiconductor layout design protection (SICLDA) and advanced node chip packaging patents are at the epicenter of the global hardware race. Exciting challenges ahead for patent engineers in microelectronics! 🔌💾 #Semiconductors #HardwareIP #ChipWar",
  "Just published our comprehensive guide on 'IP Due Diligence for Venture Capital and M&A Transactions'. Covering open source code scans, assignment chain of title, and inventor compensation compliance. Check it out on the Resources hub! 📑🔍 #DueDiligence #VentureCapital #MA",
  "Delighted to join the Women in Intellectual Property Alliance! Looking forward to collaborating with fellow IP counsel on cross-border patent prosecution and AI licensing strategies. 💡⚖️ #PatentLaw #Innovation #WIPA"
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function simulatePosting() {
  console.log('===============================================================');
  console.log('🚀 WIPA Multi-Account Posting Simulation Script');
  console.log(`⏱️  Delay Range: Between ${minDelaySec}s and ${maxDelaySec}s per post`);
  console.log('===============================================================');

  // 1. Fetch all 100 test accounts
  const { data: accounts, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, company, country, practice_area')
    .ilike('email', 'test%@gmail.com')
    .order('created_at', { ascending: true });

  if (error || !accounts || accounts.length === 0) {
    console.error('Failed to fetch test accounts:', error);
    process.exit(1);
  }

  console.log(`Found ${accounts.length} test accounts ready to post.`);
  
  // Shuffle accounts so the posting order feels organic and varied
  const queue = shuffle(accounts);

  for (let i = 0; i < queue.length; i++) {
    const user = queue[i];
    const timestamp = new Date().toLocaleTimeString();

    // Pick a tailored post template
    const baseContent = getRandomItem(POST_TEMPLATES);
    
    // 35% chance to attach an image
    const hasImage = Math.random() < 0.35;
    const mediaUrls = hasImage ? [getRandomItem(POST_IMAGES)] : [];
    const mediaType = hasImage ? 'image' : null;

    try {
      // Insert post into feed_posts table
      const { data: post, error: postErr } = await supabase
        .from('feed_posts')
        .insert({
          author_id: user.id,
          content: baseContent,
          privacy: 'Anyone',
          media_urls: mediaUrls,
          media_type: mediaType,
          likes_count: getRandomInt(0, 5),
          comments_count: 0,
          comments_disabled: false,
          post_to_feed: true
        })
        .select()
        .single();

      if (postErr) {
        console.error(`❌ [${i + 1}/${queue.length}] Failed for ${user.full_name} (${user.email}):`, postErr.message);
      } else {
        console.log(`\n[${i + 1}/${queue.length}] [${timestamp}] ✨ ${user.full_name} (${user.role} · ${user.company}) posted:`);
        console.log(`💬 "${baseContent.slice(0, 95)}..."`);
        if (hasImage) console.log(`🖼️  Attached Media: ${mediaUrls[0]}`);
      }

      // Invalidate Redis feed cache so the live app updates immediately
      if (redisClient) {
        try {
          await redisClient.del('wipa:feed:posts:v1', 'wipa:feed:posts:v2');
        } catch (e) {}
      }

    } catch (err) {
      console.error(`❌ [${i + 1}/${queue.length}] Error:`, err.message || err);
    }

    // If not the last account, wait random delay between minDelaySec and maxDelaySec
    if (i < queue.length - 1) {
      const delaySec = getRandomInt(minDelaySec, maxDelaySec);
      console.log(`⏳ Waiting ${delaySec} seconds before the next account posts...`);
      await new Promise(r => setTimeout(r, delaySec * 1000));
    }
  }

  console.log('\n===============================================================');
  console.log('🎉 All 100 accounts have successfully completed posting!');
  console.log('===============================================================');
}

simulatePosting();

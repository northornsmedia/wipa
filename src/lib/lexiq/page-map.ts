export const PAGE_MAP: Record<string, { name: string; aliases: string[]; description: string }> = {
  '/': {
    name: 'Landing Page',
    aliases: ['home page', 'landing', 'main site', 'about wipa', 'what is wipa', 'wipa website'],
    description: 'WIPA public homepage. Mission, membership tiers, featured events, sign-up CTA.'
  },
  '/login': {
    name: 'Login Page',
    aliases: ['log in', 'sign in', 'login', 'enter my account', 'log into wipa'],
    description: 'Sign-in via email/password or OAuth.'
  },
  '/signup': {
    name: 'Signup Page',
    aliases: ['register', 'create account', 'join wipa', 'sign up', 'new account'],
    description: 'Register for a new WIPA account.'
  },
  '/onboarding': {
    name: 'Onboarding',
    aliases: ['onboarding', 'setup profile', 'complete profile', 'first time setup', 'profile setup'],
    description: 'First-time profile setup.'
  },
  '/about': {
    name: 'About WIPA',
    aliases: ['about', 'who is wipa', 'wipa team', 'wipa story', 'about the platform'],
    description: 'WIPA story, leadership, mission, and core values.'
  },
  '/contact': {
    name: 'Contact',
    aliases: ['contact', 'reach out', 'get in touch', 'email wipa', 'support', 'help desk'],
    description: 'Contact form to reach the WIPA operations and member team.'
  },
  '/pricing': {
    name: 'Pricing & Membership Plans',
    aliases: ['pricing', 'membership cost', 'how much does wipa cost', 'plans', 'upgrade', 'subscription', 'tiers'],
    description: 'Shows membership tiers and Stripe checkout.'
  },
  '/resources': {
    name: 'Public Resource Teaser',
    aliases: ['public resources', 'resources without login', 'free resources'],
    description: 'Public preview of the Resource Library.'
  },
  '/platform': {
    name: 'Home Feed',
    aliases: ['home', 'feed', 'dashboard', 'my feed', 'news feed', 'posts', 'platform', 'whats new', 'main page'],
    description: 'Main activity feed. Posts from connections + community, trending forum topics, upcoming events, leaderboard snapshot.'
  },
  '/platform/calendar': {
    name: 'My Calendar',
    aliases: ['calendar', 'my calendar', 'personal calendar', 'schedule', 'my schedule', 'agenda', 'my agenda', 'calendar sync', 'sync calendar', 'ical', 'personal events'],
    description: 'User personal calendar and schedule. Monthly grid view, agenda view, personal note events, and iCal feed URL to sync directly with Google Calendar, Apple Calendar, and Outlook.'
  },
  '/platform/events': {
    name: 'Events & Summits',
    aliases: ['events', 'upcoming events', 'wipa events', 'conferences', 'summits', 'workshops', 'what events are coming up', 'wipa summits', 'virtual roundtables', 'browse events'],
    description: 'All WIPA community events, global conferences, accredited CLE workshops, and virtual roundtables.'
  },
  '/platform/profile': {
    name: 'My Profile',
    aliases: ['my profile', 'my page', 'edit my profile', 'profile settings', 'my account', 'view my profile', 'my info'],
    description: 'Logged-in user own profile. Bio, avatar, practice area, experience, education, verified credentials, and XP level.'
  },
  '/platform/members': {
    name: 'Members Directory',
    aliases: ['members', 'directory', 'find members', 'all members', 'member list', 'find someone', 'browse members', 'who is on wipa'],
    description: 'Searchable directory of all verified WIPA members across 45+ jurisdictions.'
  },
  '/platform/network': {
    name: 'Network Explorer',
    aliases: ['network', 'discover people', 'find new connections', 'grow my network', 'explore network', 'networking'],
    description: 'Discover new female practitioners, senior partners, and patent examiners outside your current connections.'
  },
  '/platform/messages': {
    name: 'Direct Messages',
    aliases: ['messages', 'dms', 'direct messages', 'inbox', 'chat', 'message someone', 'my messages', 'conversations'],
    description: 'Real-time private messaging and encrypted peer communications.'
  },
  '/platform/groups': {
    name: 'Community Groups',
    aliases: ['groups', 'join a group', 'community groups', 'interest groups', 'wipa groups', 'my groups'],
    description: 'Interest and practice-based affinity groups (Biotech IP, In-House Leaders, Trademark Counsel, etc.).'
  },
  '/platform/mentorship': {
    name: 'Mentorship Programme',
    aliases: ['mentorship', 'mentor', 'mentee', 'find a mentor', 'become a mentor', 'mentorship programme', 'book session', 'executive mentors'],
    description: 'Structured 1:1 mentorship matching system with seasoned IP partners, Chief Patent Counsels, and trademark directors.'
  },
  '/platform/mentorship/apply': {
    name: 'Become a Mentor',
    aliases: ['apply mentor', 'become a mentor', 'mentor application', 'volunteer mentor'],
    description: 'Application for senior IP practitioners to join the WIPA mentor roster.'
  },
  '/platform/forums': {
    name: 'Forums Hub',
    aliases: ['forums', 'discussions', 'community discussions', 'forum', 'talk to members', 'ask a question', 'debate', 'trending topics'],
    description: 'High-stakes community discussion forums organized into 12 practice channels.'
  },
  '/platform/jobs': {
    name: 'Jobs Board',
    aliases: ['jobs', 'job board', 'find a job', 'ip jobs', 'career opportunities', 'apply for a job', 'job listings', 'vacancies', 'careers'],
    description: 'Curated IP-focused job listings from top global firms and enterprise in-house departments.'
  },
  '/platform/sallyip': {
    name: 'Sally IP Enterprise AI Co-Pilot',
    aliases: ['sally ip', 'sallyip', 'explore sallyip', 'ai copilot', 'ai legal drafting', 'sally plans', 'sally credits', 'sally subscription'],
    description: 'Dedicated enterprise AI suite for IP professionals. Advanced patent & trademark drafting, document libraries, and member tier benefits.'
  },
  '/platform/memberships': {
    name: 'Membership Tiers & Upgrades',
    aliases: ['memberships', 'upgrade membership', 'membership tiers', 'pro membership', 'executive membership', 'plans', 'billing'],
    description: 'WIPA membership tiers, plan upgrades, billing management, and exclusive tier benefits.'
  },
  '/platform/resources': {
    name: 'Resource Library Hub',
    aliases: ['resources', 'resource library', 'learning center', 'ip resources', 'knowledge base', 'resources hub'],
    description: 'Central library featuring research reports, CLE masterclasses, podcasts, templates, and directory services.'
  },
  '/platform/resources/research-reports': {
    name: 'Research Reports & Benchmarks',
    aliases: ['research reports', 'reports', 'whitepapers', 'patent analytics reports', 'industry studies'],
    description: 'Deep-dive industry reports, jurisdiction prosecution benchmarks, and patent landscape analytics.'
  },
  '/platform/resources/webinars': {
    name: 'Webinars & Video Hub',
    aliases: ['webinars', 'watch webinars', 'virtual roundtables', 'webinar replays', 'host webinar'],
    description: 'Live and on-demand webinars, masterclasses, and virtual presentation archives.'
  },
  '/platform/resources/podcasts-conversations': {
    name: 'Podcasts & Conversations',
    aliases: ['podcasts', 'podcast', 'audio', 'ip podcasts', 'interviews', 'listen'],
    description: 'Audio interviews with managing partners, IP judges, and General Counsel pioneers.'
  },
  '/platform/resources/articles-insights': {
    name: 'Articles & Insights',
    aliases: ['articles', 'insights', 'legal briefs', 'case studies', 'thought leadership', 'blogs'],
    description: 'Peer-reviewed legal articles, patent case analyses, and practice updates.'
  },
  '/platform/resources/career-leadership': {
    name: 'Career & Leadership Hub',
    aliases: ['career', 'leadership', 'career development', 'partnership track', 'executive coaching', 'salary survey'],
    description: 'Equity partnership playbooks, salary surveys, in-house transitions, and leadership masterclasses.'
  },
  '/platform/resources/ip-services': {
    name: 'IP Services Directory',
    aliases: ['ip services', 'law firms', 'service providers', 'ip vendors', 'patent search firms'],
    description: 'Directory of verified patent searchers, docketing software, litigation counsel, and translation firms.'
  },
  '/platform/resources/ip-news': {
    name: 'IP News Wire',
    aliases: ['ip news', 'news', 'legal news', 'patent news', 'trademark updates', 'daily briefing'],
    description: 'Real-time global IP news, judicial decisions from USPTO, EPO, JPO, and CNIPA, and statutory changes.'
  },
  '/platform/resources/wellness': {
    name: 'Wellness & Wellbeing',
    aliases: ['wellness', 'wellbeing', 'mental health', 'take a break', 'relax', 'health resources', 'wellness hub'],
    description: 'Curated wellness resources, mental health tools, and physical wellbeing guidance for high-performance IP attorneys.'
  },
  '/platform/resources/wellness/budding-minds': {
    name: 'Budding Minds · Whole-Person Wellbeing for Women',
    aliases: ['budding minds', 'jel', 'nutritional therapist', 'gut health', 'hormone health', 'polyvagal', 'wellness retreats', 'somatic', '1:1 nutrition', 'jel budding minds'],
    description: 'Specialised gut & hormone health, nervous system regulation, 1:1 support, corporate workshops, and international retreats with Jel.'
  },
  '/platform/intelligence': {
    name: 'LexisNexis IP Intelligence',
    aliases: ['intelligence', 'lexisnexis', 'patent intelligence', 'ip analytics', 'legal analytics'],
    description: 'Integrated patent analytics, claim optimization, and Shepard’s® legal citation intelligence.'
  },
  '/platform/quizzes': {
    name: 'Quizzes & Knowledge Arena',
    aliases: ['quizzes', 'take a quiz', 'test my knowledge', 'earn xp', 'challenges', 'quiz', 'trivia', 'ip test', 'knowledge arena'],
    description: 'Interactive IP law quizzes to test knowledge and earn XP.'
  },
  '/platform/leaderboard': {
    name: 'Global Leaderboard',
    aliases: ['leaderboard', 'rankings', 'top members', 'who is number one', 'my rank', 'xp leaderboard', 'standings'],
    description: 'Global leaderboard of top WIPA members ranked by XP and contributions.'
  },
  '/platform/settings': {
    name: 'Account & Privacy Settings',
    aliases: ['settings', 'account settings', 'preferences', 'notification settings', 'privacy settings', 'calendar sync settings'],
    description: 'Manage personal notification settings, iCal sync tokens, security, and profile visibility.'
  },
  '/platform/notifications': {
    name: 'Notifications Center',
    aliases: ['notifications', 'alerts', 'my alerts', 'activity alerts', 'recent notifications'],
    description: 'Real-time activity alerts, mentorship bookings, discussion replies, and connection requests.'
  },
  '/platform/liked-threads': {
    name: 'Saved & Liked Discussions',
    aliases: ['liked threads', 'saved discussions', 'bookmarks', 'favorites', 'saved posts', 'saved topics'],
    description: 'Personal repository of bookmarked and liked community discussions.'
  },
  '/platform/board-members': {
    name: 'Board of Directors',
    aliases: ['board', 'board members', 'directors', 'wipa leadership', 'advisory board'],
    description: 'Executive leadership, advisory board, and founding members of the Women in IP Alliance.'
  },
  '/platform/gift': {
    name: 'Gift WIPA Membership',
    aliases: ['gift', 'gift membership', 'sponsor a member', 'give membership'],
    description: 'Gift an annual WIPA membership to an emerging female IP professional or student.'
  },
  '/platform/chat-support': {
    name: 'Live Chat Support',
    aliases: ['live chat', 'chat support', 'support chat', 'help desk', 'customer support', 'talk to agent', 'help with wipa', 'contact support'],
    description: 'Live chat support with WIPA Member Experience specialists.'
  }
};

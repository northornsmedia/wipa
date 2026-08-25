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
    description: 'WIPA story, team, mission, values.'
  },
  '/contact': {
    name: 'Contact',
    aliases: ['contact', 'reach out', 'get in touch', 'email wipa', 'support', 'help desk'],
    description: 'Contact form to reach the WIPA team.'
  },
  '/pricing': {
    name: 'Pricing & Membership Plans',
    aliases: ['pricing', 'membership cost', 'how much does wipa cost', 'plans', 'upgrade', 'subscription', 'tiers'],
    description: 'Shows membership tiers and checkout.'
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
  '/platform/profile': {
    name: 'My Profile',
    aliases: ['my profile', 'my page', 'edit my profile', 'profile settings', 'my account', 'view my profile', 'my info'],
    description: 'Logged-in user\'s own profile. Bio, avatar, practice area, XP level.'
  },
  '/platform/members': {
    name: 'Members Directory',
    aliases: ['members', 'directory', 'find members', 'all members', 'member list', 'find someone', 'browse members', 'who is on wipa'],
    description: 'Searchable directory of all WIPA members.'
  },
  '/platform/network': {
    name: 'Network Explorer',
    aliases: ['network', 'discover people', 'find new connections', 'grow my network', 'explore network', 'networking'],
    description: 'Discover new professionals outside your connections.'
  },
  '/platform/messages': {
    name: 'Direct Messages',
    aliases: ['messages', 'DMs', 'direct messages', 'inbox', 'chat', 'message someone', 'my messages', 'conversations'],
    description: 'Real-time private messaging.'
  },
  '/platform/groups': {
    name: 'Community Groups',
    aliases: ['groups', 'join a group', 'community groups', 'interest groups', 'wipa groups', 'my groups'],
    description: 'Interest-based groups.'
  },
  '/platform/mentorship': {
    name: 'Mentorship Programme',
    aliases: ['mentorship', 'mentor', 'mentee', 'find a mentor', 'become a mentor', 'mentorship programme'],
    description: 'Structured mentorship matching system.'
  },
  '/platform/forums': {
    name: 'Forums Hub',
    aliases: ['forums', 'discussions', 'community discussions', 'forum', 'talk to members', 'ask a question', 'debate', 'trending'],
    description: 'Community discussion forums organised by topic.'
  },
  '/platform/events': {
    name: 'Events',
    aliases: ['events', 'upcoming events', 'wipa events', 'conference', 'what events are coming up', 'event calendar', 'my events'],
    description: 'All WIPA events (virtual + in-person).'
  },
  '/platform/jobs': {
    name: 'Jobs Board',
    aliases: ['jobs', 'job board', 'find a job', 'ip jobs', 'career opportunities', 'apply for a job', 'job listings', 'vacancies', 'careers'],
    description: 'IP-focused job listings.'
  },
  '/platform/quizzes': {
    name: 'Quizzes Hub',
    aliases: ['quizzes', 'take a quiz', 'test my knowledge', 'earn xp', 'challenges', 'quiz', 'trivia', 'ip test', 'knowledge arena'],
    description: 'IP knowledge quizzes. Earn XP by completing them.'
  },
  '/platform/leaderboard': {
    name: 'Global Leaderboard',
    aliases: ['leaderboard', 'rankings', 'top members', 'who is number one', 'my rank', 'xp leaderboard', 'standings'],
    description: 'Top WIPA members ranked by total XP.'
  },
  '/platform/resources/wellness': {
    name: 'Wellness & Wellbeing',
    aliases: ['wellness', 'wellbeing', 'mental health', 'take a break', 'relax', 'health resources', 'wellness hub'],
    description: 'Curated wellness resources, mental health, and physical wellbeing tools for IP professionals.'
  }
};

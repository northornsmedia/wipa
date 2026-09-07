import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Post {
  id: number;
  name: string;
  initial: string;
  color: string;
  title: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
}

const DUMMY_POSTS: Post[] = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    initial: 'S',
    color: '#ff90e8',
    title: 'Patent Attorney at TechLaw',
    time: '2h ago',
    content: 'Just finished a fascinating panel on AI and Intellectual Property! 🚀 The consensus is clear: we need adaptive frameworks that can keep pace with generative models. What are your thoughts on copyright attribution for AI-generated works? Let\'s discuss below! 👇',
    likes: 24,
    comments: 5
  },
  {
    id: 2,
    name: 'David Chen',
    initial: 'D',
    color: '#b892ff',
    title: 'Senior IP Strategist',
    time: '4h ago',
    content: 'Very excited to announce that our firm has successfully defended the core patents for NextGen Biotech! This marks a major milestone for biotech innovations and secondary market protections. Huge thanks to my incredible team. 🎉',
    likes: 156,
    comments: 32
  },
  {
    id: 3,
    name: 'Maria Garcia',
    initial: 'M',
    color: '#ffc900',
    title: 'Corporate Counsel',
    time: '5h ago',
    content: 'Does anyone have recommendations for IP management software that integrates well with existing CRM tools? We are scaling fast and spreadsheets just aren\'t cutting it anymore. 😅',
    likes: 12,
    comments: 18
  },
  {
    id: 4,
    name: 'James Wilson',
    initial: 'J',
    color: '#5a32fa',
    title: 'Trademark Specialist',
    time: '8h ago',
    content: 'A friendly reminder to all founders: secure your trademarks early! I\'ve seen too many brilliant startups forced into expensive rebrands because they didn\'t do a proper clearance search before launch. Protect your brand identity.',
    likes: 89,
    comments: 7
  },
  {
    id: 5,
    name: 'Elena Rostova',
    initial: 'E',
    color: '#ff90e8',
    title: 'Tech IP Analyst',
    time: '12h ago',
    content: 'The recent ruling on open-source software licenses sets a dangerous precedent. If you haven\'t read the brief yet, I highly recommend digging into the dissenting opinion. It could change how we structure dual-licensing models forever.',
    likes: 312,
    comments: 84
  },
  {
    id: 6,
    name: 'Marcus Thorne',
    initial: 'M',
    color: '#b892ff',
    title: 'Partner at Thorne & Associates',
    time: '1d ago',
    content: 'Thrilled to be speaking at the International IP Summit next month in London! I\'ll be covering cross-border enforcement strategies in the digital age. Let me know if you\'ll be attending, I\'d love to connect over coffee! ☕️',
    likes: 204,
    comments: 41
  },
  {
    id: 7,
    name: 'Alicia Keyser',
    initial: 'A',
    color: '#ffc900',
    title: 'Legal Tech Innovator',
    time: '1d ago',
    content: 'Is the billable hour finally dying? We switched to flat-fee pricing for our trademark prosecution services last year and both client satisfaction and internal efficiency have skyrocketed. Curious to hear how other boutique firms are managing this transition.',
    likes: 76,
    comments: 29
  },
  {
    id: 8,
    name: 'Robert Chang',
    initial: 'R',
    color: '#5a32fa',
    title: 'General Counsel',
    time: '2d ago',
    content: 'Our legal department is hiring! We are looking for a mid-level IP attorney with a strong background in hardware and consumer electronics. Remote flexible. If you know anyone looking for a dynamic in-house role, please send them my way.',
    likes: 45,
    comments: 3
  },
  {
    id: 9,
    name: 'Sophie Laurent',
    initial: 'S',
    color: '#ff90e8',
    title: 'European Patent Examiner',
    time: '2d ago',
    content: 'A quick tip for applicants: ensuring your claims are clearly distinguished from prior art in the initial filing saves everyone time. Don\'t rely on office actions to narrow your scope if you already know the field is crowded!',
    likes: 128,
    comments: 14
  },
  {
    id: 10,
    name: 'Kwame Osei',
    initial: 'K',
    color: '#b892ff',
    title: 'Blockchain & IP Researcher',
    time: '3d ago',
    content: 'Smart contracts for IP licensing are no longer just a theory. We just executed our first fully automated royalty distribution on Ethereum for a digital asset portfolio. The transparency is incredible. The future of IP monetization is here.',
    likes: 410,
    comments: 112
  }
];

interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  isLexIQOpen: boolean;
  setIsLexIQOpen: (open: boolean) => void;
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  lexiqMessages: { role: string; content: string; reasoning_details?: any }[];
  setLexiqMessages: (messages: { role: string; content: string; reasoning_details?: any }[]) => void;
  user: { 
    id?: string; 
    name: string; 
    email: string; 
    avatar_url?: string; 
    cover_url?: string; 
    member_id?: string;
    membership_tier?: string;
    verification_status?: string;
    onboarding_completed?: boolean;
    country?: string;
    practice_area?: string;
    industry_sector?: string;
    bio?: string;
    business_profile_id?: string;
  } | null;
  setUser: (user: any | null) => void;
  posts: Post[];
  cachedFeedPosts: any[];
  setCachedFeedPosts: (posts: any[]) => void;
  cachedConversations: any[];
  setCachedConversations: (convs: any[]) => void;
  likedPostIds: number[];
  toggleLike: (postId: number) => void;
  isInsideChat: boolean;
  setIsInsideChat: (isInsideChat: boolean) => void;
  isVideoMuted: boolean;
  setIsVideoMuted: (isMuted: boolean) => void;
  toggleVideoMuted: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      isMenuOpen: false,
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      isLexIQOpen: false,
      setIsLexIQOpen: (open) => set({ isLexIQOpen: open }),
      isCreatePostOpen: false,
      setIsCreatePostOpen: (open) => set({ isCreatePostOpen: open }),
      lexiqMessages: [{ role: 'ai', content: 'Hello! I am Sally 4.1 Pro, your IP assistant. How can I help you today?' }],
      setLexiqMessages: (lexiqMessages) => set({ lexiqMessages }),
      user: null,
      setUser: (user) => set({ user }),
      isInsideChat: false,
      setIsInsideChat: (isInsideChat) => set({ isInsideChat }),
      isVideoMuted: true,
      setIsVideoMuted: (isVideoMuted) => set({ isVideoMuted }),
      toggleVideoMuted: () => set((state) => ({ isVideoMuted: !state.isVideoMuted })),
      posts: DUMMY_POSTS,
      cachedFeedPosts: [],
      setCachedFeedPosts: (cachedFeedPosts) => set({ cachedFeedPosts }),
      cachedConversations: [],
      setCachedConversations: (cachedConversations) => set({ cachedConversations }),
      likedPostIds: [],
      toggleLike: (postId) => set((state) => {
        const isLiked = state.likedPostIds.includes(postId);
        const newLikedPostIds = isLiked
          ? state.likedPostIds.filter(id => id !== postId)
          : [...state.likedPostIds, postId];
          
        const newPosts = state.posts.map(post => 
          post.id === postId 
            ? { ...post, likes: isLiked ? post.likes - 1 : post.likes + 1 }
            : post
        );

        return {
          likedPostIds: newLikedPostIds,
          posts: newPosts
        };
      }),
    }),
    {
      name: 'wipa-storage',
      version: 3,
      migrate: (persistedState: any) => ({
        ...persistedState,
        cachedFeedPosts: [],
        lexiqMessages: (persistedState?.lexiqMessages || []).map((m: any) => ({
          ...m,
          content: typeof m?.content === 'string' 
            ? m.content.replace(/LexIQ/g, 'Sally 4.1 Pro') 
            : m.content
        }))
      }),
      partialize: (state) => {
        const { cachedFeedPosts: _cachedFeedPosts, isInsideChat: _isInsideChat, ...persistedState } = state;
        return persistedState;
      },
    }
  )
);

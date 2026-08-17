'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { BrainCircuit, PlayCircle, BookOpen, Clock, Award, ChevronRight, CheckCircle, Trophy, Star } from 'lucide-react';
import Link from 'next/link';

export default function QuizzesPage() {
  const { user } = useAppStore();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('quizzes')
        .select('*, questions:quiz_questions(count)')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (data) setQuizzes(data);

      if (user?.id) {
        const { data: attemptsData } = await supabase
          .from('quiz_attempts')
          .select('quiz_id, score, max_score, xp_earned')
          .eq('user_id', user.id);
        
        if (attemptsData) {
          const attemptMap: Record<string, any> = {};
          attemptsData.forEach(a => {
            if (!attemptMap[a.quiz_id] || attemptMap[a.quiz_id].score < a.score) {
              attemptMap[a.quiz_id] = a;
            }
          });
          setAttempts(attemptMap);
        }
      }
      setIsLoading(false);
    };
    fetchQuizzes();
  }, [user]);

  const filteredQuizzes = quizzes.filter(q => {
    if (activeTab !== 'All' && q.difficulty !== activeTab) return false;
    if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase()) && !q.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalXPEarned = Object.values(attempts).reduce((acc, curr) => acc + (curr.xp_earned || 0), 0);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] relative overflow-hidden flex flex-col">
      {/* Glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#5a32fa]/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ff90e8]/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pt-8 relative z-10">
        
        {/* Header */}
        <div className="mb-12 bg-white/60 dark:bg-[#1e293b]/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black flex items-center gap-4 text-gray-900 dark:text-white tracking-tight mb-4">
              <div className="bg-gradient-to-br from-[#5a32fa] to-[#ff90e8] p-3 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#5a32fa]/30">
                <BrainCircuit size={32} className="text-white" />
              </div>
              Knowledge <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5a32fa] to-[#ff90e8]">Arena</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium text-lg max-w-xl leading-relaxed">
              Level up your IP expertise. Take challenges, earn XP, and climb the leaderboard.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Trophy size={32} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Your Quiz XP</p>
              <p className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                {totalXPEarned} <Star size={20} className="text-amber-500 fill-amber-500" />
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 items-center justify-between">
          <div className="flex gap-3 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md' 
                    : 'bg-white dark:bg-[#1e293b] text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <input 
              type="text" 
              placeholder="Search challenges..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#1e293b] py-4 pl-5 pr-5 rounded-2xl font-bold text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#5a32fa] transition-colors shadow-sm placeholder-gray-400"
            />
          </div>
        </div>

        {/* Quizzes Grid */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-[#5a32fa] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold">Loading challenges...</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="py-24 text-center bg-white/50 dark:bg-[#1e293b]/50 backdrop-blur-md rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-sm">
            <div className="w-24 h-24 bg-gray-100 dark:bg-[#0f172a] rounded-full flex items-center justify-center mb-6 mx-auto">
              <BrainCircuit size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">No challenges found</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Check back later or adjust your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredQuizzes.map(quiz => {
              const attempt = attempts[quiz.id];
              const isCompleted = !!attempt;
              const isPerfect = attempt && attempt.score === attempt.max_score;

              return (
                <div key={quiz.id} className="bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-xl rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col group hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#5a32fa]/10 transition-all duration-300">
                  <div className="p-6 md:p-8 flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${
                        quiz.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                        quiz.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                      }`}>
                        {quiz.difficulty}
                      </span>
                      {isCompleted && (
                        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${isPerfect ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                          <CheckCircle size={14} /> {attempt.score}/{attempt.max_score}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-[#5a32fa] transition-colors leading-tight">
                      {quiz.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 line-clamp-2">
                      {quiz.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-[#0f172a] p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                      <div className="flex flex-col items-center justify-center text-center">
                        <BookOpen size={18} className="text-gray-400 mb-1" />
                        <span className="font-bold text-gray-900 dark:text-white text-sm">{quiz.questions?.[0]?.count || 0}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center border-x border-gray-200 dark:border-white/10">
                        <Clock size={18} className="text-gray-400 mb-1" />
                        <span className="font-bold text-gray-900 dark:text-white text-sm">{Math.round((quiz.time_limit_seconds || 300) / 60)}m</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center">
                        <Award size={18} className="text-[#5a32fa] mb-1" />
                        <span className="font-bold text-[#5a32fa] text-sm">+{quiz.xp_reward}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    {isCompleted ? (
                      <Link href={`/platform/quizzes/${quiz.id}`} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100 py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-colors">
                        Retake Quiz <RotateCcw size={18} />
                      </Link>
                    ) : (
                      <Link href={`/platform/quizzes/${quiz.id}`} className="w-full bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] hover:opacity-90 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#5a32fa]/20 group-hover:shadow-xl group-hover:shadow-[#5a32fa]/30">
                        Start Challenge <PlayCircle size={20} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Inline RotateCcw icon since it wasn't imported from lucide-react in the original header
function RotateCcw(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

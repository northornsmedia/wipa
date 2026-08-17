'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { BookOpen, Search, Filter, Clock, BrainCircuit, CheckCircle, Award, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function QuizzesPage() {
  const { user } = useAppStore();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('quizzes')
        .select('*, questions:quiz_questions(count)')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (data) setQuizzes(data);

      if (user?.id) {
        const { data: attemptsData } = await supabase
          .from('quiz_attempts')
          .select('quiz_id, score, max_score')
          .eq('user_id', user.id);
        
        if (attemptsData) {
          const attemptMap: Record<string, any> = {};
          attemptsData.forEach(a => {
            attemptMap[a.quiz_id] = a;
          });
          setAttempts(attemptMap);
        }
      }
      setLoading(false);
    };
    fetchQuizzes();
  }, [user?.id]);

  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || q.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = ['All', ...Array.from(new Set(quizzes.map(q => q.category).filter(Boolean)))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] font-sans pb-24">
      {/* Hero Header */}
      <div className="bg-[#5a32fa] text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <BrainCircuit size={400} className="translate-x-1/4 -translate-y-1/4" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4">IP Knowledge Challenges</h1>
          <p className="text-xl text-white/80 max-w-2xl font-medium">
            Test your intellectual property expertise, earn XP, and climb the WIPA leaderboard.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search quizzes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5a32fa] font-medium"
            />
          </div>
          
          <div className="flex gap-4">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#5a32fa]"
            >
              {categories.map(c => <option key={c as string} value={c as string}>{c}</option>)}
            </select>
            
            <select 
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#5a32fa]"
            >
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Quiz Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-[#5a32fa] border-t-transparent rounded-full"></div>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10">
            <BookOpen size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No Quizzes Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map(quiz => {
              const attempt = attempts[quiz.id];
              const isCompleted = !!attempt;
              
              return (
                <div key={quiz.id} className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col group hover:border-[#5a32fa] transition-colors relative">
                  {isCompleted && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 z-10">
                      <CheckCircle size={14} /> Completed
                    </div>
                  )}
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded-md">
                        {quiz.category || 'General'}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                        quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                        quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                      }`}>
                        {quiz.difficulty || 'Medium'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {quiz.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-1">
                      {quiz.description || 'Test your knowledge on this topic.'}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={16} /> {quiz.questions?.[0]?.count || 0} Qs
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} /> {Math.round((quiz.time_limit_seconds || 300) / 60)} mins
                      </div>
                      <div className="flex items-center gap-1.5 text-[#5a32fa]">
                        <Award size={16} /> +{quiz.xp_reward || 50} XP
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 pb-6 pt-0 mt-auto">
                    {isCompleted ? (
                      <Link href={`/platform/quizzes/${quiz.id}/results`} className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                        View Results (Score: {attempt.score}/{attempt.max_score})
                      </Link>
                    ) : (
                      <Link href={`/platform/quizzes/${quiz.id}`} className="w-full bg-[#5a32fa] hover:bg-[#4a24db] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors group-hover:shadow-lg">
                        Start Quiz <ChevronRight size={18} />
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

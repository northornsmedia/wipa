'use client';

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Clock, BrainCircuit, Award, CheckCircle, XCircle, AlertCircle, PlayCircle, Trophy, BarChart3, RotateCcw, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function QuizTakingPage({ params }: { params: { id: string } }) {
  const { user } = useAppStore();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Game state
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'results' | 'review'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState<any>(null);
  const [previousAttempt, setPreviousAttempt] = useState<any>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      const { data: quizData } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', params.id)
        .single();
        
      if (quizData) {
        setQuiz(quizData);
        setTimeLeft(quizData.time_limit_seconds || 300);
        
        const { data: qData } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', params.id)
          .order('order_index', { ascending: true });
          
        if (qData) setQuestions(qData);
        
        // Check for previous attempt
        if (user?.id) {
          const { data: attData } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('quiz_id', params.id)
            .eq('user_id', user.id)
            .single();
            
          if (attData) {
            setPreviousAttempt(attData);
            setAttemptResult(attData);
            setGameState('results');
          }
        }
      }
      setLoading(false);
    };
    fetchQuiz();
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [params.id, user?.id]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameState !== 'playing' && timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const handleTimeUp = () => {
    alert("Time's up! Submitting your answers.");
    submitQuiz(true);
  };

  const startQuiz = () => {
    if (previousAttempt) {
      // Just re-taking for fun, no XP
      setAnswers({});
      setCurrentQuestionIndex(0);
      setTimeLeft(quiz.time_limit_seconds || 300);
    }
    setGameState('playing');
  };

  const handleSelectOption = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitQuiz(false);
    }
  };

  const submitQuiz = async (isTimeUp = false) => {
    setIsSubmitting(true);
    setGameState('results');
    
    // Calculate Score
    let score = 0;
    const maxScore = questions.length;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_option) score++;
    });
    
    const timeTaken = (quiz.time_limit_seconds || 300) - timeLeft;
    
    let xpEarned = 0;
    if (!previousAttempt) {
      const percentage = score / maxScore;
      if (percentage >= 0.8) xpEarned = quiz.xp_reward;
      else if (percentage >= 0.5) xpEarned = Math.floor(quiz.xp_reward / 2);
    }

    const attemptData = {
      quiz_id: quiz.id,
      user_id: user?.id,
      score,
      max_score: maxScore,
      xp_earned: xpEarned,
      time_taken_seconds: timeTaken,
      answers: answers
    };

    setAttemptResult(attemptData);

    if (user?.id) {
      // Save attempt
      if (!previousAttempt) {
        await supabase.from('quiz_attempts').insert(attemptData);
        setPreviousAttempt(attemptData); // Prevent multiple XP rewards
      }
      
      // Award XP
      if (xpEarned > 0) {
        try {
          await fetch('/api/xp/award', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              xpAmount: xpEarned,
              reason: `Completed Quiz: ${quiz.title}`,
              referenceId: quiz.id
            })
          });
        } catch (e) {
          console.error("Failed to award XP", e);
        }
      }
    }
    
    setIsSubmitting(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#0f172a]"><div className="animate-spin w-12 h-12 border-4 border-[#5a32fa] border-t-transparent rounded-full"></div></div>;
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] dark:bg-[#0f172a] p-4 text-center">
        <AlertCircle size={64} className="text-gray-300 dark:text-gray-700 mb-6" />
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Quiz Not Found</h1>
        <p className="text-gray-500 mb-6">This quiz might have been deleted or has no questions yet.</p>
        <Link href="/platform/quizzes" className="bg-[#5a32fa] text-white px-6 py-3 rounded-xl font-bold">Back to Quizzes</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] font-sans pb-24 flex flex-col">
      {/* Top Nav */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/platform/quizzes" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold transition-colors">
            <ArrowLeft size={20} /> Back
          </Link>
          <div className="font-bold text-gray-900 dark:text-white truncate max-w-xs">{quiz.title}</div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        
        {/* Intro State */}
        {gameState === 'intro' && (
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-white/10 max-w-3xl w-full text-center">
            <div className="w-20 h-20 bg-[#5a32fa]/10 text-[#5a32fa] rounded-full flex items-center justify-center mx-auto mb-6">
              <BrainCircuit size={40} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
              {quiz.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              {quiz.description}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              <div className="bg-gray-50 dark:bg-black/20 px-6 py-4 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col items-center">
                <div className="text-gray-500 font-medium mb-1 flex items-center gap-2"><BookOpen size={16}/> Questions</div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{questions.length}</div>
              </div>
              <div className="bg-gray-50 dark:bg-black/20 px-6 py-4 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col items-center">
                <div className="text-gray-500 font-medium mb-1 flex items-center gap-2"><Clock size={16}/> Time Limit</div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{formatTime(quiz.time_limit_seconds)}</div>
              </div>
              <div className="bg-[#5a32fa]/5 px-6 py-4 rounded-2xl border border-[#5a32fa]/20 flex flex-col items-center">
                <div className="text-[#5a32fa] font-medium mb-1 flex items-center gap-2"><Award size={16}/> Reward</div>
                <div className="text-2xl font-black text-[#5a32fa]">+{quiz.xp_reward} XP</div>
              </div>
            </div>
            
            {previousAttempt ? (
              <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 p-6 rounded-2xl mb-8">
                <h3 className="text-green-800 dark:text-green-400 font-black text-xl mb-2 flex items-center justify-center gap-2">
                  <CheckCircle /> You've already taken this quiz!
                </h3>
                <p className="text-green-700 dark:text-green-500">Your score: {previousAttempt.score}/{previousAttempt.max_score}. You can retake it for practice, but you won't earn XP again.</p>
                <div className="flex gap-4 justify-center mt-6">
                  <button onClick={() => setGameState('results')} className="bg-white dark:bg-black/20 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 px-6 py-3 rounded-xl font-bold hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors">
                    View Results
                  </button>
                  <button onClick={startQuiz} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
                    <RotateCcw size={18} /> Retake Quiz
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={startQuiz}
                className="bg-[#5a32fa] text-white px-12 py-4 rounded-full font-black text-xl flex items-center gap-3 hover:bg-[#4a24db] transition-transform hover:scale-105 active:scale-95 shadow-xl mx-auto"
              >
                <PlayCircle size={24} /> Start Quiz
              </button>
            )}
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && (
          <div className="w-full max-w-3xl">
            {/* Header & Progress */}
            <div className="bg-white dark:bg-[#1e293b] rounded-t-3xl p-6 border border-gray-200 dark:border-white/10 border-b-0 flex items-center justify-between">
              <div className="font-bold text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className={`font-black text-xl flex items-center gap-2 ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
                <Clock size={20} /> {formatTime(timeLeft)}
              </div>
            </div>
            
            <div className="h-2 w-full bg-gray-100 dark:bg-black/20 relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-[#5a32fa] transition-all duration-300"
                style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-[#1e293b] rounded-b-3xl p-6 md:p-10 border border-gray-200 dark:border-white/10 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-8 leading-relaxed">
                {questions[currentQuestionIndex].question_text}
              </h2>
              
              <div className="space-y-4 mb-10">
                {(questions[currentQuestionIndex].options as string[]).map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 md:p-6 rounded-2xl border-2 transition-all font-bold text-lg flex items-center gap-4 ${
                      answers[currentQuestionIndex] === idx 
                        ? 'border-[#5a32fa] bg-[#5a32fa]/5 text-[#5a32fa]' 
                        : 'border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                      answers[currentQuestionIndex] === idx ? 'border-[#5a32fa] bg-[#5a32fa] text-white' : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    {option}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-white/5">
                <button
                  onClick={handleNext}
                  disabled={answers[currentQuestionIndex] === undefined}
                  className="bg-[#5a32fa] text-white px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-[#4a24db] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Submit Quiz' : 'Next Question'} 
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results State */}
        {gameState === 'results' && attemptResult && (
          <div className="w-full max-w-3xl">
            <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-white/10 text-center mb-6 relative overflow-hidden">
              
              {isSubmitting && (
                <div className="absolute inset-0 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <div className="animate-spin w-12 h-12 border-4 border-[#5a32fa] border-t-transparent rounded-full mb-4"></div>
                  <div className="font-bold text-gray-900 dark:text-white">Calculating Score...</div>
                </div>
              )}

              <div className="w-24 h-24 bg-gradient-to-br from-[#5a32fa] to-[#ff2a5f] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Trophy size={48} />
              </div>
              
              <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Quiz Completed!</h2>
              <p className="text-gray-500 mb-8">You've finished the {quiz.title} quiz.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                  <div className="text-gray-500 font-bold mb-2">Your Score</div>
                  <div className="text-4xl font-black text-gray-900 dark:text-white">
                    {attemptResult.score}<span className="text-xl text-gray-400">/{attemptResult.max_score}</span>
                  </div>
                  <div className="text-sm font-medium mt-2 text-[#5a32fa]">
                    {Math.round((attemptResult.score / attemptResult.max_score) * 100)}% Accuracy
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                  <div className="text-gray-500 font-bold mb-2">XP Earned</div>
                  <div className="text-4xl font-black text-[#5a32fa]">
                    +{attemptResult.xp_earned}
                  </div>
                  <div className="text-sm font-medium mt-2 text-gray-500">
                    Added to profile
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                  <div className="text-gray-500 font-bold mb-2">Time Taken</div>
                  <div className="text-4xl font-black text-gray-900 dark:text-white">
                    {formatTime(attemptResult.time_taken_seconds || 0)}
                  </div>
                  <div className="text-sm font-medium mt-2 text-gray-500">
                    Out of {formatTime(quiz.time_limit_seconds)}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setGameState('review')}
                  className="bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-8 py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                  <BarChart3 size={20} /> Review Answers
                </button>
                <Link 
                  href="/platform/quizzes"
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center transition-colors"
                >
                  Back to Quizzes
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Review State */}
        {gameState === 'review' && attemptResult && (
          <div className="w-full max-w-4xl space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <BarChart3 className="text-[#5a32fa]" /> Review Answers
              </h2>
              <button 
                onClick={() => setGameState('results')}
                className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Back to Results
              </button>
            </div>

            {questions.map((q, idx) => {
              const userAnswer = attemptResult.answers?.[idx];
              const isCorrect = userAnswer === q.correct_option;
              
              return (
                <div key={q.id} className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-white/10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${isCorrect ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                      {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-400 mb-1">Question {idx + 1}</div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {q.question_text}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pl-12 mb-6">
                    {(q.options as string[]).map((option, optIdx) => {
                      const isThisUserAnswer = userAnswer === optIdx;
                      const isThisCorrectAnswer = q.correct_option === optIdx;
                      
                      let bgClass = "bg-gray-50 dark:bg-black/20 border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400";
                      let icon = null;
                      
                      if (isThisCorrectAnswer) {
                        bgClass = "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-800 dark:text-green-400 font-bold";
                        icon = <CheckCircle size={18} className="text-green-500" />;
                      } else if (isThisUserAnswer && !isThisCorrectAnswer) {
                        bgClass = "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-400 font-bold";
                        icon = <XCircle size={18} className="text-red-500" />;
                      }
                      
                      return (
                        <div key={optIdx} className={`p-4 rounded-xl border flex items-center justify-between ${bgClass}`}>
                          <div className="flex items-center gap-3">
                            <div className="font-bold opacity-50">{String.fromCharCode(65 + optIdx)}</div>
                            {option}
                          </div>
                          {icon}
                        </div>
                      );
                    })}
                  </div>
                  
                  {q.explanation && (
                    <div className="pl-12">
                      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-4 flex gap-3 text-blue-800 dark:text-blue-300">
                        <AlertCircle size={20} className="shrink-0 text-blue-500 mt-0.5" />
                        <div>
                          <div className="font-bold mb-1">Explanation</div>
                          <div className="text-sm">{q.explanation}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

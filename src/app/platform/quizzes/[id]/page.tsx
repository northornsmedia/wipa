'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, PlayCircle, RotateCcw, Clock, Award, CheckCircle, XCircle, Trophy, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function QuizTakingPage({ params }: { params: { id: string } }) {
  const { user } = useAppStore();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [earnedXP, setEarnedXP] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      setIsLoading(true);
      const { data: quizData } = await supabase.from('quizzes').select('*').eq('id', params.id).single();
      if (quizData) {
        setQuiz(quizData);
        setTimeLeft(quizData.time_limit_seconds || 300);
        
        const { data: qData } = await supabase.from('quiz_questions').select('*').eq('quiz_id', params.id).order('order_index');
        if (qData) setQuestions(qData);
      }
      setIsLoading(false);
    };
    fetchQuiz();
  }, [params.id]);

  useEffect(() => {
    let timer: any;
    if (isStarted && !isCompleted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (isStarted && timeLeft === 0 && !isCompleted) {
      submitQuiz(true);
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft, isCompleted]);

  const startQuiz = () => {
    setSelectedOptions({});
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsStarted(true);
    setIsCompleted(false);
    setTimeLeft(quiz.time_limit_seconds || 300);
  };

  const submitQuiz = async (isTimeUp = false) => {
    setIsCompleted(true);
    let finalScore = 0;
    
    questions.forEach((q, idx) => {
      if (selectedOptions[idx] === q.correct_option) finalScore++;
    });
    setScore(finalScore);

    if (finalScore === questions.length) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    if (user?.id) {
      const percentage = finalScore / questions.length;
      let xpEarned = 0;
      if (percentage >= 0.8) xpEarned = quiz.xp_reward;
      else if (percentage >= 0.5) xpEarned = Math.floor(quiz.xp_reward / 2);
      setEarnedXP(xpEarned);

      await supabase.from('quiz_attempts').insert({
        quiz_id: quiz.id,
        user_id: user.id,
        score: finalScore,
        max_score: questions.length,
        xp_earned: xpEarned,
        time_taken_seconds: (quiz.time_limit_seconds || 300) - timeLeft,
        answers: selectedOptions
      });

      if (xpEarned > 0) {
        await supabase.from('xp_transactions').insert({
          user_id: user.id,
          xp_amount: xpEarned,
          reason: `Completed Quiz: ${quiz.title}`,
          reference_id: quiz.id
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#0f172a]">
        <div className="animate-spin w-16 h-16 border-4 border-[#5a32fa] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] p-8 flex items-center justify-center">
        <div className="bg-white dark:bg-[#1e293b] p-12 rounded-[2.5rem] shadow-xl text-center max-w-lg border border-gray-100 dark:border-white/10">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Quiz Not Found</h1>
          <p className="text-gray-500 font-medium mb-8">This quiz might have been deleted or has no questions yet.</p>
          <Link href="/platform/quizzes" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-xl font-black inline-block transition-transform hover:scale-105">
            Back to Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] flex flex-col relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#5a32fa]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      
      {/* Quiz Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/platform/quizzes" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </Link>
          <div className="font-black text-lg text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-md">
            {quiz.title}
          </div>
        </div>
        
        {isStarted && !isCompleted && (
          <div className={`flex items-center gap-2 font-black px-4 py-2 rounded-full border-2 ${timeLeft < 60 ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-500/10' : 'border-[#5a32fa] text-[#5a32fa] bg-indigo-50 dark:bg-indigo-500/10'}`}>
            <Clock size={18} /> {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="flex-1 flex justify-center p-4 md:p-8">
        {!isStarted ? (
          /* Start Screen */
          <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-xl p-8 md:p-12 w-full max-w-2xl text-center self-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-gradient-to-br from-[#5a32fa] to-[#ff90e8] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#5a32fa]/30 mx-auto mb-8 rotate-3">
              <BrainCircuit size={48} className="text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
              {quiz.title}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-10 max-w-lg mx-auto">
              {quiz.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-gray-50 dark:bg-[#0f172a] p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Level</span>
                <span className="font-black text-gray-900 dark:text-white">{quiz.difficulty}</span>
              </div>
              <div className="bg-gray-50 dark:bg-[#0f172a] p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Questions</span>
                <span className="font-black text-gray-900 dark:text-white">{questions.length}</span>
              </div>
              <div className="bg-gray-50 dark:bg-[#0f172a] p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time Limit</span>
                <span className="font-black text-gray-900 dark:text-white">{Math.round((quiz.time_limit_seconds || 300)/60)}m</span>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                <span className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Reward</span>
                <span className="font-black text-[#5a32fa]">{quiz.xp_reward} XP</span>
              </div>
            </div>

            <button 
              onClick={startQuiz}
              className="w-full bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] hover:opacity-90 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#5a32fa]/30 hover:-translate-y-1"
            >
              Start Challenge <PlayCircle size={24} />
            </button>
          </div>
        ) : !isCompleted ? (
          /* Question Screen */
          <div className="w-full max-w-3xl flex flex-col pt-8">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-white/10 h-3 rounded-full mb-8 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#5a32fa] to-[#ff90e8] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-end mb-6">
              <span className="text-[#5a32fa] font-black tracking-widest uppercase text-sm">Question {currentQuestionIndex + 1} of {questions.length}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-10 leading-tight">
              {questions[currentQuestionIndex].question_text}
            </h2>

            <div className="space-y-4 mb-10">
              {questions[currentQuestionIndex].options.map((opt: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOptions(prev => ({...prev, [currentQuestionIndex]: idx}))}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 text-lg font-bold flex items-center gap-4 ${
                    selectedOptions[currentQuestionIndex] === idx 
                      ? 'border-[#5a32fa] bg-indigo-50 dark:bg-indigo-500/10 text-[#5a32fa]' 
                      : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-white/30'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedOptions[currentQuestionIndex] === idx 
                      ? 'border-[#5a32fa] bg-[#5a32fa] text-white' 
                      : 'border-gray-300 dark:border-white/20'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-auto pb-8">
              <button
                onClick={() => {
                  if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1);
                  else submitQuiz();
                }}
                disabled={selectedOptions[currentQuestionIndex] === undefined}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed px-10 py-4 rounded-xl font-black text-lg transition-transform hover:scale-105"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish & Submit' : 'Next Question'} 
              </button>
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="w-full max-w-4xl py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-xl p-8 md:p-12 mb-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#5a32fa] to-[#ff90e8]" />
              
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Challenge Completed!</h2>
              <p className="text-gray-500 font-medium mb-12">Here is how you performed on {quiz.title}.</p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 mb-12">
                <div className="relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="88" className="stroke-gray-100 dark:stroke-white/5" strokeWidth="16" fill="none" />
                    <circle cx="96" cy="96" r="88" className="stroke-[#5a32fa]" strokeWidth="16" fill="none" strokeDasharray="552.92" strokeDashoffset={552.92 - (552.92 * (score / questions.length))} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-gray-900 dark:text-white">{Math.round((score / questions.length) * 100)}%</span>
                  </div>
                </div>

                <div className="flex flex-col gap-6 text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-0.5">Correct</p>
                      <p className="text-2xl font-black text-gray-900 dark:text-white">{score}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                      <XCircle size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-0.5">Incorrect</p>
                      <p className="text-2xl font-black text-gray-900 dark:text-white">{questions.length - score}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-0.5">XP Earned</p>
                      <p className="text-2xl font-black text-[#5a32fa]">+{earnedXP}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={startQuiz} className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-colors">
                  <RotateCcw size={20} /> Retake
                </button>
                <Link href="/platform/quizzes" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-xl font-black flex items-center justify-center transition-transform hover:scale-105">
                  Back to Hub
                </Link>
              </div>
            </div>

            {/* Answer Review Section */}
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Review Answers</h3>
            <div className="space-y-6">
              {questions.map((q, idx) => {
                const isCorrect = selectedOptions[idx] === q.correct_option;
                
                return (
                  <div key={idx} className={`bg-white dark:bg-[#1e293b] rounded-3xl border-2 overflow-hidden shadow-sm ${isCorrect ? 'border-green-100 dark:border-green-500/20' : 'border-red-100 dark:border-red-500/20'}`}>
                    <div className="p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-6">
                        {isCorrect ? (
                          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-1"><CheckCircle size={18}/></div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-1"><XCircle size={18}/></div>
                        )}
                        <h4 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                          {q.question_text}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pl-12">
                        {q.options.map((opt: string, optIdx: number) => {
                          let optClass = "border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 opacity-50";
                          let dotClass = "border-gray-300 dark:border-white/20";
                          
                          if (optIdx === q.correct_option) {
                            optClass = "border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 opacity-100";
                            dotClass = "bg-green-500 border-green-500 text-white";
                          } else if (optIdx === selectedOptions[idx] && !isCorrect) {
                            optClass = "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 opacity-100";
                            dotClass = "bg-red-500 border-red-500 text-white";
                          }

                          return (
                            <div key={optIdx} className={`flex items-center gap-3 p-4 rounded-xl border-2 font-bold text-sm ${optClass}`}>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs shrink-0 ${dotClass}`}>
                                {String.fromCharCode(65 + optIdx)}
                              </div>
                              {opt}
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div className="ml-12 p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                          <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1 flex items-center gap-2">
                            <BrainCircuit size={16} /> Explanation
                          </p>
                          <p className="text-sm font-medium text-indigo-700 dark:text-indigo-200">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Plus, Loader2, BookOpen } from 'lucide-react';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'resources' | 'quizzes'>('resources');
  const [resources, setResources] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      const { data: resData } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
      if (resData) setResources(resData);
      
      const { data: quizData } = await supabase.from('quizzes').select('*, questions:quiz_questions(count)').order('created_at', { ascending: false });
      if (quizData) setQuizzes(quizData);
      
      setLoading(false);
    };
    fetchResources();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          {activeTab === 'resources' ? <FileText className="text-[#5a32fa]" /> : <BookOpen className="text-[#5a32fa]" />} 
          Manage {activeTab === 'resources' ? 'Resources' : 'Quizzes'}
        </h1>
        <button className="bg-[#5a32fa] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4a24db] transition-colors">
          <Plus size={18} /> Add {activeTab === 'resources' ? 'Resource' : 'Quiz'}
        </button>
      </div>

      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-2">
        <button 
          onClick={() => setActiveTab('resources')}
          className={`font-bold px-4 py-2 border-b-2 transition-colors ${activeTab === 'resources' ? 'border-[#5a32fa] text-[#5a32fa]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          All Resources
        </button>
        <button 
          onClick={() => setActiveTab('quizzes')}
          className={`font-bold px-4 py-2 border-b-2 transition-colors ${activeTab === 'quizzes' ? 'border-[#5a32fa] text-[#5a32fa]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Quizzes
        </button>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {activeTab === 'resources' ? (
                <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Title</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Category</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Uploaded</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">Actions</th>
                </tr>
              ) : (
                <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Title</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Category / Difficulty</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Questions</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10">Status</th>
                  <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">Actions</th>
                </tr>
              )}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center"><Loader2 size={32} className="mx-auto animate-spin text-[#5a32fa]" /></td>
                </tr>
              ) : activeTab === 'resources' ? (
                resources.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No resources found.</td>
                  </tr>
                ) : (
                  resources.map(resource => (
                    <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 font-bold text-gray-900 dark:text-white">
                        {resource.title}
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 font-medium text-gray-600 dark:text-gray-400">
                        {resource.category}
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 text-sm text-gray-500">
                        {new Date(resource.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 text-right">
                        <button className="text-sm font-bold text-[#5a32fa] hover:underline">Edit</button>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                quizzes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">No quizzes found.</td>
                  </tr>
                ) : (
                  quizzes.map(quiz => (
                    <tr key={quiz.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 font-bold text-gray-900 dark:text-white">
                        {quiz.title}
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 font-medium text-gray-600 dark:text-gray-400">
                        {quiz.category} <span className="text-gray-400 px-2">•</span> {quiz.difficulty}
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 font-medium text-gray-600 dark:text-gray-400">
                        {quiz.questions?.[0]?.count || 0} Questions
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${quiz.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {quiz.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-white/5 text-right">
                        <button className="text-sm font-bold text-[#5a32fa] hover:underline mr-4">Edit</button>
                        <button className="text-sm font-bold text-red-500 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

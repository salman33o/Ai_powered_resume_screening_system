import React, { useState } from 'react';
import { StructuredResume, JobRequirement, InterviewQuestionItem } from '../../types';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Filter,
  Layers,
  HelpCircle,
  Zap
} from 'lucide-react';
import { generateInterviewQuestionsApi } from '../../services/apiClient';
import { SAMPLE_INTERVIEW_QUESTIONS } from '../../lib/mockData';

interface AIInterviewPrepProps {
  resume: StructuredResume;
  job: JobRequirement;
}

export const AIInterviewPrep: React.FC<AIInterviewPrepProps> = ({
  resume,
  job
}) => {
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>(SAMPLE_INTERVIEW_QUESTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(SAMPLE_INTERVIEW_QUESTIONS[0]?.id || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const result = await generateInterviewQuestionsApi(resume, job);
      if (result && result.length > 0) {
        setQuestions([...result, ...SAMPLE_INTERVIEW_QUESTIONS]);
        setExpandedId(result[0].id);
      }
    } catch (e) {
      console.error('Failed to generate AI questions:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter questions based on category, difficulty and search query
  const filteredQuestions = questions.filter(q => {
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'technical' && q.category === 'technical') ||
      (selectedCategory === 'project' && q.category === 'project_deep_dive') ||
      (selectedCategory === 'behavioral' && q.category === 'behavioral') ||
      (selectedCategory === 'eee' && (q.question.toLowerCase().includes('power') || q.question.toLowerCase().includes('circuit') || q.question.toLowerCase().includes('pcb') || q.question.toLowerCase().includes('embedded') || q.question.toLowerCase().includes('etap'))) ||
      (selectedCategory === 'agri' && (q.question.toLowerCase().includes('crop') || q.question.toLowerCase().includes('agri') || q.question.toLowerCase().includes('soil') || q.question.toLowerCase().includes('ndvi') || q.question.toLowerCase().includes('drone'))) ||
      (selectedCategory === 'art' && (q.question.toLowerCase().includes('typography') || q.question.toLowerCase().includes('brand') || q.question.toLowerCase().includes('3d') || q.question.toLowerCase().includes('animation') || q.question.toLowerCase().includes('figma')));

    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    
    const matchesSearch = !searchQuery || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.contextWhyAsked.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.candidateBackgroundEvidence?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Question Simulation Bank</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0E1A29] text-teal-300 border border-[#223348]">
              {filteredQuestions.length} Questions Cataloged
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
            Role & Background-Grounded Interview Preparation (50+ Spec)
          </h2>
          <p className="text-xs text-[#8A97A8] mt-0.5">
            Technical, architectural, domain, and behavioral questions tailored to <span className="font-semibold text-[#E6EAF0]">{resume.fullName}</span> and <span className="font-semibold text-teal-300">{job.title}</span>.
          </p>
        </div>

        <button
          onClick={fetchQuestions}
          disabled={isLoading}
          className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-950 rounded text-xs font-bold font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Synthesizing...' : 'Synthesize AI Questions'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#131F30] rounded-lg p-3 border border-[#223348] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-[10px] text-[#8A97A8] font-bold uppercase flex items-center space-x-1 mr-1">
            <Filter className="w-3 h-3 text-teal-400" />
            <span>Category:</span>
          </span>
          {[
            { id: 'all', label: 'All Domains (50+)' },
            { id: 'technical', label: 'Technical Core' },
            { id: 'eee', label: 'Electrical / EEE' },
            { id: 'agri', label: 'Agriculture / Agri' },
            { id: 'art', label: 'Art & Design' },
            { id: 'project', label: 'Project Deep-Dive' },
            { id: 'behavioral', label: 'Behavioral' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-slate-950 font-bold'
                  : 'bg-[#0E1A29] text-[#8A97A8] hover:text-[#E6EAF0] border border-[#223348]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#8A97A8] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0E1A29] pl-8 pr-2.5 py-1.5 rounded border border-[#223348] text-[#E6EAF0] text-xs focus:outline-none focus:border-teal-500 font-sans"
          />
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-3 font-mono">
        {filteredQuestions.length === 0 ? (
          <div className="bg-[#131F30] rounded-lg p-6 border border-[#223348] text-center space-y-2">
            <HelpCircle className="w-6 h-6 text-teal-400 mx-auto" />
            <p className="text-xs text-[#8A97A8]">No questions found matching your filter criteria.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-3 py-1 bg-[#0E1A29] border border-[#223348] text-teal-300 text-xs rounded hover:bg-[#17263B]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isExpanded = expandedId === q.id;
            return (
              <div 
                key={q.id || idx}
                className="bg-[#131F30] rounded-lg border border-[#223348] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="w-full p-3.5 text-left flex items-start justify-between gap-3 hover:bg-[#17263B] transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded bg-[#0E1A29] border border-[#223348] text-teal-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
                          {q.category?.replace('_', ' ')}
                        </span>
                        {q.difficulty && (
                          <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                            q.difficulty === 'Senior' || q.difficulty === 'Lead'
                              ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                              : 'bg-teal-950/40 text-teal-300 border border-teal-800/40'
                          }`}>
                            {q.difficulty} Level
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-[#E6EAF0] mt-1 leading-snug font-sans">
                        {q.question}
                      </h4>
                    </div>
                  </div>

                  <div className="text-[#8A97A8] shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-teal-400" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-[#223348] bg-[#0E1A29] space-y-3 text-xs animate-in fade-in duration-100">
                    
                    {/* Why Asked */}
                    <div>
                      <span className="font-bold text-teal-400 uppercase text-[9px] tracking-wider block">
                        Interviewer Intent & Objective
                      </span>
                      <p className="text-[#A2B1C2] font-sans text-xs mt-0.5 leading-relaxed">{q.contextWhyAsked}</p>
                    </div>

                    {/* Resume Evidence */}
                    {q.candidateBackgroundEvidence && (
                      <div>
                        <span className="font-bold text-teal-300 uppercase text-[9px] tracking-wider block">
                          Candidate Background Anchor
                        </span>
                        <p className="text-[#A2B1C2] font-sans italic text-xs mt-0.5">{q.candidateBackgroundEvidence}</p>
                      </div>
                    )}

                    {/* Expected Key Points */}
                    {q.expectedKeyPoints && q.expectedKeyPoints.length > 0 && (
                      <div>
                        <span className="font-bold text-emerald-400 uppercase text-[9px] tracking-wider block">
                          Key Technical Points to Address in Response
                        </span>
                        <ul className="mt-1.5 space-y-1">
                          {q.expectedKeyPoints.map((pt: string, pIdx: number) => (
                            <li key={pIdx} className="flex items-start space-x-1.5 text-[#E6EAF0] font-sans">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="text-xs">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

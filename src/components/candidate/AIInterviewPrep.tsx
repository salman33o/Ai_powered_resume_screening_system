import React, { useState } from 'react';
import { StructuredResume, JobRequirement } from '../../types';
import { 
  Bot, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  Code,
  Compass,
  MessageSquareQuote
} from 'lucide-react';
import { generateInterviewQuestionsApi } from '../../services/apiClient';

interface AIInterviewPrepProps {
  resume: StructuredResume;
  job: JobRequirement;
}

export const AIInterviewPrep: React.FC<AIInterviewPrepProps> = ({
  resume,
  job
}) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const result = await generateInterviewQuestionsApi(resume, job);
      setQuestions(result);
      if (result.length > 0) {
        setExpandedId(result[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Interview Intelligence</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Grounded AI Questions
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Role & Background-Grounded Interview Preparation
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real questions recruiters and engineering hiring managers will ask based on <span className="font-semibold text-white">{resume.fullName}&apos;s</span> CV and <span className="font-semibold text-indigo-300">{job.title}</span> expectations.
          </p>
        </div>

        <button
          onClick={fetchQuestions}
          disabled={isLoading}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-purple-500/20"
        >
          <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Synthesizing Questions...' : 'Generate Practice Questions'}</span>
        </button>
      </div>

      {/* Questions list */}
      {questions.length === 0 && !isLoading ? (
        <div className="bg-slate-900/60 rounded-2xl p-10 border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No Interview Questions Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click the &quot;Generate Practice Questions&quot; button above to synthesize role-grounded technical and behavioral questions tailored to your profile.
          </p>
          <button
            onClick={fetchQuestions}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all"
          >
            Generate Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const isExpanded = expandedId === q.id;
            return (
              <div 
                key={q.id || idx}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-md transition-all"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {q.category?.replace('_', ' ')}
                        </span>
                        {q.difficulty && (
                          <span className="text-[10px] text-amber-400 font-semibold">
                            {q.difficulty} Level
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-white mt-1.5 leading-snug">
                        {q.question}
                      </h4>
                    </div>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 bg-slate-950/50 space-y-3 text-xs">
                    
                    {/* Why Asked */}
                    <div>
                      <span className="font-bold text-indigo-400 uppercase text-[10px] tracking-wider">
                        Why the Recruiter is Asking This
                      </span>
                      <p className="text-slate-300 mt-0.5">{q.contextWhyAsked}</p>
                    </div>

                    {/* Resume Evidence */}
                    <div>
                      <span className="font-bold text-cyan-400 uppercase text-[10px] tracking-wider">
                        Grounded in Your Background
                      </span>
                      <p className="text-slate-400 italic mt-0.5">{q.candidateBackgroundEvidence}</p>
                    </div>

                    {/* Expected Key Points */}
                    {q.expectedKeyPoints && q.expectedKeyPoints.length > 0 && (
                      <div>
                        <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">
                          Key Evaluation Criteria to Hit
                        </span>
                        <ul className="mt-1 space-y-1">
                          {q.expectedKeyPoints.map((pt: string, pIdx: number) => (
                            <li key={pIdx} className="flex items-center space-x-1.5 text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

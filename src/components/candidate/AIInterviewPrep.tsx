import React, { useState } from 'react';
import { StructuredResume, JobRequirement } from '../../types';
import { 
  Bot, 
  Sparkles, 
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
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Technical Preparation</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1A29] text-teal-300 border border-[#223348]">
              Grounded Question Simulation
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
            Role & Background-Grounded Interview Preparation
          </h2>
          <p className="text-xs text-[#8A97A8] mt-0.5">
            Technical and architectural questions based on <span className="font-semibold text-[#E6EAF0]">{resume.fullName}&apos;s</span> CV and <span className="font-semibold text-teal-300">{job.title}</span> specifications.
          </p>
        </div>

        <button
          onClick={fetchQuestions}
          disabled={isLoading}
          className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-950 rounded text-xs font-bold font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Synthesizing...' : 'Generate Practice Matrix'}</span>
        </button>
      </div>

      {/* Questions list */}
      {questions.length === 0 && !isLoading ? (
        <div className="bg-[#131F30] rounded-lg p-8 border border-[#223348] text-center space-y-2.5">
          <div className="w-10 h-10 rounded bg-[#0E1A29] border border-[#223348] text-teal-400 flex items-center justify-center mx-auto">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold text-[#E6EAF0] font-display">No Practice Questions Generated Yet</h3>
          <p className="text-xs text-[#8A97A8] max-w-md mx-auto">
            Click the button above to synthesize role-grounded technical and architectural questions tailored to your profile and target role.
          </p>
          <button
            onClick={fetchQuestions}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 text-xs font-bold font-mono rounded transition-colors cursor-pointer"
          >
            Generate Questions
          </button>
        </div>
      ) : (
        <div className="space-y-3 font-mono">
          {questions.map((q, idx) => {
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
                    <span className="w-5 h-5 rounded bg-[#0E1A29] border border-[#223348] text-teal-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
                          {q.category?.replace('_', ' ')}
                        </span>
                        {q.difficulty && (
                          <span className="text-[9px] text-amber-300 font-semibold">
                            {q.difficulty}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-[#E6EAF0] mt-1 leading-snug font-sans">
                        {q.question}
                      </h4>
                    </div>
                  </div>

                  <div className="text-[#8A97A8]">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-[#223348] bg-[#0E1A29] space-y-2.5 text-xs">
                    
                    {/* Why Asked */}
                    <div>
                      <span className="font-bold text-teal-400 uppercase text-[9px] tracking-wider block">
                        Interviewer Intent & Context
                      </span>
                      <p className="text-[#8A97A8] font-sans text-xs mt-0.5">{q.contextWhyAsked}</p>
                    </div>

                    {/* Resume Evidence */}
                    <div>
                      <span className="font-bold text-teal-300 uppercase text-[9px] tracking-wider block">
                        Candidate Background Anchor
                      </span>
                      <p className="text-[#8A97A8] font-sans italic text-xs mt-0.5">{q.candidateBackgroundEvidence}</p>
                    </div>

                    {/* Expected Key Points */}
                    {q.expectedKeyPoints && q.expectedKeyPoints.length > 0 && (
                      <div>
                        <span className="font-bold text-emerald-400 uppercase text-[9px] tracking-wider block">
                          Key Technical Deliverables to Cover
                        </span>
                        <ul className="mt-1 space-y-1">
                          {q.expectedKeyPoints.map((pt: string, pIdx: number) => (
                            <li key={pIdx} className="flex items-center space-x-1.5 text-[#E6EAF0] font-sans">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
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

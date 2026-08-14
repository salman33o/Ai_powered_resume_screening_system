import React, { useState } from 'react';
import { 
  PipelineCandidate, 
  PipelineStage, 
  JobRequirement 
} from '../../types';
import { 
  Briefcase, 
  Star, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  CheckCircle2, 
  XCircle,
  Tag
} from 'lucide-react';

interface CandidatePipelineProps {
  candidates: PipelineCandidate[];
  setCandidates: React.Dispatch<React.SetStateAction<PipelineCandidate[]>>;
  activeJob: JobRequirement;
  onSelectCandidate: (candidate: PipelineCandidate) => void;
}

const STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'applied', label: 'Applied', color: 'border-slate-700 bg-slate-900/60' },
  { id: 'screening', label: 'Screening', color: 'border-blue-500/30 bg-blue-950/20' },
  { id: 'shortlisted', label: 'Shortlisted', color: 'border-indigo-500/30 bg-indigo-950/20' },
  { id: 'interview', label: 'Interview', color: 'border-purple-500/30 bg-purple-950/20' },
  { id: 'selected', label: 'Offer / Selected', color: 'border-emerald-500/30 bg-emerald-950/20' },
  { id: 'rejected', label: 'Archived / Rejected', color: 'border-rose-500/20 bg-rose-950/10' },
];

export const CandidatePipeline: React.FC<CandidatePipelineProps> = ({
  candidates,
  setCandidates,
  activeJob,
  onSelectCandidate
}) => {
  const [activeNoteModalCandidate, setActiveNoteModalCandidate] = useState<PipelineCandidate | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  const moveCandidate = (candidateId: string, direction: 'next' | 'prev') => {
    const stageIds: PipelineStage[] = ['applied', 'screening', 'shortlisted', 'interview', 'selected'];
    setCandidates(prev => prev.map(c => {
      if (c.id !== candidateId) return c;
      const currentIdx = stageIds.indexOf(c.stage);
      if (currentIdx === -1) return c;
      const nextIdx = direction === 'next' ? Math.min(stageIds.length - 1, currentIdx + 1) : Math.max(0, currentIdx - 1);
      return { ...c, stage: stageIds[nextIdx] };
    }));
  };

  const setCandidateStageDirect = (candidateId: string, stage: PipelineStage) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage } : c));
  };

  const handleAddNote = () => {
    if (!activeNoteModalCandidate || !newNoteText.trim()) return;
    const noteObj = {
      id: `note-${Date.now()}`,
      author: 'Senior Recruiter',
      content: newNoteText,
      createdAt: new Date().toISOString()
    };
    setCandidates(prev => prev.map(c => {
      if (c.id !== activeNoteModalCandidate.id) return c;
      return { ...c, notes: [...c.notes, noteObj] };
    }));
    setNewNoteText('');
    setActiveNoteModalCandidate(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Hiring Stages</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {candidates.length} Applicants in Pipeline
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Recruitment Kanban Pipeline for {activeJob.title}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Advance candidates, schedule interviews, and log private hiring committee notes.
          </p>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
        {STAGES.map((col) => {
          const colCandidates = candidates.filter(c => c.stage === col.id);

          return (
            <div 
              key={col.id}
              className={`rounded-2xl border p-3 flex flex-col justify-between min-w-[200px] ${col.color}`}
            >
              {/* Column Header */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="text-xs font-bold text-white tracking-wide uppercase">
                    {col.label}
                  </span>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {colCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards List */}
                <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1 custom-scrollbar">
                  {colCandidates.map((c) => (
                    <div 
                      key={c.id}
                      className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-indigo-500/50 shadow-sm space-y-2 text-xs transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p 
                            onClick={() => onSelectCandidate(c)}
                            className="font-bold text-white hover:text-indigo-400 cursor-pointer text-xs"
                          >
                            {c.resume.fullName}
                          </p>
                          <p className="text-[10px] text-slate-400">{c.resume.experience[0]?.company || 'Applicant'}</p>
                        </div>
                        <span className={`text-[11px] font-black ${
                          c.atsScore.overallScore >= 80 ? 'text-emerald-400' : 'text-blue-400'
                        }`}>
                          {c.atsScore.overallScore}%
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {c.tags.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Notes indicator */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px] text-slate-400">
                        <button
                          onClick={() => setActiveNoteModalCandidate(c)}
                          className="flex items-center space-x-1 hover:text-slate-200"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>{c.notes.length} notes</span>
                        </button>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => moveCandidate(c.id, 'prev')}
                            title="Move back"
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveCandidate(c.id, 'next')}
                            title="Advance stage"
                            className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {colCandidates.length === 0 && (
                    <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                      No candidates
                    </div>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Recruiter Note Modal */}
      {activeNoteModalCandidate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                Hiring Committee Notes for {activeNoteModalCandidate.resume.fullName}
              </h3>
              <button 
                onClick={() => setActiveNoteModalCandidate(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
              {activeNoteModalCandidate.notes.length === 0 ? (
                <p className="text-slate-500 italic">No notes logged yet.</p>
              ) : (
                activeNoteModalCandidate.notes.map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-semibold text-indigo-400">{n.author}</span>
                      <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-200">{n.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2">
              <textarea
                rows={3}
                placeholder="Log structured evaluation notes, candidate demeanor, or salary expectations..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setActiveNoteModalCandidate(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Save Note
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

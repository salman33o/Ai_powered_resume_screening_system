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
  Tag,
  Calendar,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Clock,
  UserCheck,
  Send,
  Video,
  GripVertical
} from 'lucide-react';

interface CandidatePipelineProps {
  candidates: PipelineCandidate[];
  setCandidates: React.Dispatch<React.SetStateAction<PipelineCandidate[]>>;
  activeJob: JobRequirement;
  onSelectCandidate: (candidate: PipelineCandidate) => void;
  onOpenMessageModal?: (candidate: PipelineCandidate) => void;
}

const STAGES: { id: PipelineStage; label: string; color: string; badge: string }[] = [
  { id: 'applied', label: 'Applied', color: 'border-slate-700 bg-slate-900/60', badge: 'bg-slate-800 text-slate-300' },
  { id: 'screening', label: 'Screening', color: 'border-blue-500/30 bg-blue-950/20', badge: 'bg-blue-900/50 text-blue-300' },
  { id: 'shortlisted', label: 'Shortlisted', color: 'border-indigo-500/30 bg-indigo-950/20', badge: 'bg-indigo-900/50 text-indigo-300' },
  { id: 'interview', label: 'Interview', color: 'border-purple-500/30 bg-purple-950/20', badge: 'bg-purple-900/50 text-purple-300' },
  { id: 'selected', label: 'Offer / Selected', color: 'border-emerald-500/30 bg-emerald-950/20', badge: 'bg-emerald-900/50 text-emerald-300' },
  { id: 'rejected', label: 'Archived / Rejected', color: 'border-rose-500/20 bg-rose-950/10', badge: 'bg-rose-900/50 text-rose-300' },
];

export const CandidatePipeline: React.FC<CandidatePipelineProps> = ({
  candidates,
  setCandidates,
  activeJob,
  onSelectCandidate,
  onOpenMessageModal
}) => {
  const [activeNoteModalCandidate, setActiveNoteModalCandidate] = useState<PipelineCandidate | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  
  // Interview scheduling modal state
  const [activeInterviewCandidate, setActiveInterviewCandidate] = useState<PipelineCandidate | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-08-20');
  const [interviewTime, setInterviewTime] = useState('10:30');
  const [interviewType, setInterviewType] = useState('Technical Screening (Google Meet)');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

  // Move candidate one step
  const moveCandidate = (candidateId: string, direction: 'next' | 'prev') => {
    const stageIds: PipelineStage[] = ['applied', 'screening', 'shortlisted', 'interview', 'selected'];
    setCandidates(prev => prev.map(c => {
      if (c.id !== candidateId) return c;
      const currentIdx = stageIds.indexOf(c.stage);
      if (currentIdx === -1) {
        return { ...c, stage: 'applied' };
      }
      const nextIdx = direction === 'next' ? Math.min(stageIds.length - 1, currentIdx + 1) : Math.max(0, currentIdx - 1);
      return { ...c, stage: stageIds[nextIdx] };
    }));
  };

  // Direct set candidate stage
  const setCandidateStageDirect = (candidateId: string, stage: PipelineStage) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage } : c));
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, candidateId: string) => {
    e.dataTransfer.setData('text/plain', candidateId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stageId: PipelineStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = (stageId: PipelineStage) => {
    if (dragOverStage === stageId) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const candidateId = e.dataTransfer.getData('text/plain');
    if (candidateId) {
      setCandidateStageDirect(candidateId, targetStage);
    }
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
      return { ...c, notes: [...(c.notes || []), noteObj] };
    }));
    setNewNoteText('');
    setActiveNoteModalCandidate(null);
  };

  const handleScheduleInterview = () => {
    if (!activeInterviewCandidate) return;
    const formattedSchedule = `${interviewDate} at ${interviewTime} • ${interviewType}`;
    setCandidates(prev => prev.map(c => {
      if (c.id !== activeInterviewCandidate.id) return c;
      return { 
        ...c, 
        stage: 'interview',
        interviewScheduledDate: formattedSchedule,
        tags: Array.from(new Set([...c.tags, 'Interview Scheduled']))
      };
    }));
    setActiveInterviewCandidate(null);
  };

  // Filter candidates
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = 
      c.resume.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.resume.skills.technical.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesScore = (c.atsScore?.overallScore || 0) >= minScoreFilter;
    return matchesSearch && matchesScore;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Interactive Kanban Workflow</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {candidates.length} Total in Pipeline
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Recruitment Kanban Pipeline for {activeJob.title}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Drag & drop candidates between hiring stages, schedule video interviews, record committee notes, or message applicants directly.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate, skill, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 sm:w-60"
              />
            </div>

            <div className="flex items-center space-x-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Min Score:</span>
              <select
                value={minScoreFilter}
                onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value={0} className="bg-slate-900">All Scores</option>
                <option value={60} className="bg-slate-900">60%+ Match</option>
                <option value={75} className="bg-slate-900">75%+ Match</option>
                <option value={85} className="bg-slate-900">85%+ High Match</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
        {STAGES.map((col) => {
          const colCandidates = filteredCandidates.filter(c => c.stage === col.id);
          const isOver = dragOverStage === col.id;

          return (
            <div 
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={() => handleDragLeave(col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-2xl border p-3 flex flex-col justify-between min-w-[220px] transition-all ${col.color} ${
                isOver ? 'ring-2 ring-indigo-400 bg-indigo-950/40 scale-[1.01]' : ''
              }`}
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-white tracking-wide uppercase">
                      {col.label}
                    </span>
                  </div>
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${col.badge}`}>
                    {colCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards List */}
                <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1 custom-scrollbar">
                  {colCandidates.map((c) => {
                    const score = c.atsScore?.overallScore || 0;
                    return (
                      <div 
                        key={c.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, c.id)}
                        className="p-3 rounded-2xl bg-slate-950/95 border border-slate-800/90 hover:border-indigo-500/60 shadow-md space-y-2.5 text-xs transition-all group cursor-grab active:cursor-grabbing hover:-translate-y-0.5"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-1.5">
                            <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 mt-0.5 shrink-0" />
                            <div>
                              <p 
                                onClick={() => onSelectCandidate(c)}
                                className="font-bold text-white hover:text-indigo-400 cursor-pointer text-xs"
                              >
                                {c.resume.fullName}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {c.resume.experience[0]?.company || 'Candidate Profile'}
                              </p>
                            </div>
                          </div>
                          <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-lg ${
                            score >= 80 ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30' : 'text-blue-400 bg-blue-950/60 border border-blue-500/30'
                          }`}>
                            {score}%
                          </span>
                        </div>

                        {/* Interview Scheduled Badge if present */}
                        {c.interviewScheduledDate && (
                          <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center space-x-1.5 text-[10px] text-purple-300">
                            <Calendar className="w-3 h-3 shrink-0 text-purple-400" />
                            <span className="truncate">{c.interviewScheduledDate}</span>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {c.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Quick Card Action Buttons */}
                        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
                          
                          <div className="flex items-center space-x-2">
                            {/* Notes Button */}
                            <button
                              onClick={() => setActiveNoteModalCandidate(c)}
                              title="Committee Notes"
                              className="flex items-center space-x-1 hover:text-slate-200 cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>{(c.notes || []).length}</span>
                            </button>

                            {/* Schedule Interview Button */}
                            <button
                              onClick={() => setActiveInterviewCandidate(c)}
                              title="Schedule Interview"
                              className="flex items-center space-x-1 hover:text-purple-300 text-purple-400 cursor-pointer"
                            >
                              <Video className="w-3 h-3" />
                            </button>

                            {/* Message Candidate */}
                            {onOpenMessageModal && (
                              <button
                                onClick={() => onOpenMessageModal(c)}
                                title="Message Candidate"
                                className="flex items-center space-x-1 hover:text-emerald-300 text-emerald-400 cursor-pointer"
                              >
                                <Send className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Move arrows */}
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => moveCandidate(c.id, 'prev')}
                              title="Move back stage"
                              className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 cursor-pointer"
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => moveCandidate(c.id, 'next')}
                              title="Advance next stage"
                              className="p-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>

                        </div>

                      </div>
                    );
                  })}

                  {colCandidates.length === 0 && (
                    <div className="p-5 rounded-2xl border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                      Drop candidate card here
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
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                Hiring Committee Notes for {activeNoteModalCandidate.resume.fullName}
              </h3>
              <button 
                onClick={() => setActiveNoteModalCandidate(null)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto text-xs custom-scrollbar">
              {(activeNoteModalCandidate.notes || []).length === 0 ? (
                <p className="text-slate-500 italic">No committee notes logged yet.</p>
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
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {activeInterviewCandidate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">
                  Schedule Interview: {activeInterviewCandidate.resume.fullName}
                </h3>
              </div>
              <button 
                onClick={() => setActiveInterviewCandidate(null)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Interview Date</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Time Slot</label>
                <input
                  type="time"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Interview Format & Platform</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="Technical Screening (Google Meet)">Technical Screening (Google Meet)</option>
                  <option value="System Design Round (Zoom)">System Design Round (Zoom)</option>
                  <option value="Executive / Behavioral Chat (Teams)">Executive / Behavioral Chat (Teams)</option>
                  <option value="On-Site Panel Interview">On-Site Panel Interview</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setActiveInterviewCandidate(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleInterview}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Advance to Interview</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

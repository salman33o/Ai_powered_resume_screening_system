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
  Calendar, 
  Search, 
  Filter, 
  Send, 
  Video, 
  GripVertical,
  X
} from 'lucide-react';

interface CandidatePipelineProps {
  candidates: PipelineCandidate[];
  setCandidates: React.Dispatch<React.SetStateAction<PipelineCandidate[]>>;
  activeJob: JobRequirement;
  onSelectCandidate: (candidate: PipelineCandidate) => void;
  onOpenMessageModal?: (candidate: PipelineCandidate) => void;
}

const STAGES: { id: PipelineStage; label: string; color: string; badge: string }[] = [
  { id: 'applied', label: 'Applied', color: 'border-[#223348] bg-[#0E1A29]', badge: 'bg-[#131F30] text-[#8A97A8]' },
  { id: 'screening', label: 'Screening', color: 'border-[#223348] bg-[#0E1A29]', badge: 'bg-[#131F30] text-teal-300' },
  { id: 'shortlisted', label: 'Shortlisted', color: 'border-[#223348] bg-[#0E1A29]', badge: 'bg-[#131F30] text-teal-400' },
  { id: 'interview', label: 'Interview', color: 'border-[#223348] bg-[#0E1A29]', badge: 'bg-[#131F30] text-amber-300' },
  { id: 'selected', label: 'Selected', color: 'border-[#223348] bg-[#0E1A29]', badge: 'bg-[#131F30] text-emerald-300' },
  { id: 'rejected', label: 'Archived', color: 'border-[#223348] bg-[#0E1A29]', badge: 'bg-[#131F30] text-rose-300' },
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

  const setCandidateStageDirect = (candidateId: string, stage: PipelineStage) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage } : c));
  };

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
      author: 'Recruiter Assessment',
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

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = 
      c.resume.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.resume.skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesScore = (c.atsScore?.overallScore || 0) >= minScoreFilter;
    return matchesSearch && matchesScore;
  });

  return (
    <div className="space-y-4">
      
      {/* Header & Controls */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Workflow Pipeline</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
                {candidates.length} In Flow
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
              Hiring Pipeline for {activeJob.title}
            </h2>
            <p className="text-xs text-[#8A97A8] mt-0.5">
              Drag candidates across qualification stages, coordinate interviews, log notes, and message applicants.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 font-mono">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8A97A8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate, skill, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#0E1A29] rounded border border-[#223348] text-xs text-[#E6EAF0] placeholder-[#5B6B80] focus:outline-none focus:border-teal-500 w-44 sm:w-56"
              />
            </div>

            <div className="flex items-center space-x-1.5 bg-[#0E1A29] px-2.5 py-1.5 rounded border border-[#223348] text-xs text-[#8A97A8]">
              <Filter className="w-3 h-3 text-teal-400" />
              <span>Min:</span>
              <select
                value={minScoreFilter}
                onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                className="bg-transparent text-[#E6EAF0] font-bold focus:outline-none cursor-pointer"
              >
                <option value={0} className="bg-[#131F30]">All</option>
                <option value={60} className="bg-[#131F30]">60%+</option>
                <option value={75} className="bg-[#131F30]">75%+</option>
                <option value={85} className="bg-[#131F30]">85%+</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 overflow-x-auto pb-3">
        {STAGES.map((col) => {
          const colCandidates = filteredCandidates.filter(c => c.stage === col.id);
          const isOver = dragOverStage === col.id;

          return (
            <div 
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={() => handleDragLeave(col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-lg border p-2.5 flex flex-col justify-between min-w-[210px] transition-colors ${col.color} ${
                isOver ? 'border-teal-500 bg-[#17263B]' : ''
              }`}
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-[#223348] pb-2 mb-2.5 font-mono">
                  <span className="text-[11px] font-bold text-[#E6EAF0] uppercase tracking-wider">
                    {col.label}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border border-[#223348] ${col.badge}`}>
                    {colCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards List */}
                <div className="space-y-2 max-h-[640px] overflow-y-auto pr-0.5">
                  {colCandidates.map((c) => {
                    const score = c.atsScore?.overallScore || 0;
                    return (
                      <div 
                        key={c.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, c.id)}
                        className="p-2.5 rounded bg-[#131F30] border border-[#223348] hover:border-[#334A66] space-y-2 text-xs transition-colors group cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-1.5 overflow-hidden">
                            <GripVertical className="w-3 h-3 text-[#5B6B80] group-hover:text-[#8A97A8] mt-0.5 shrink-0" />
                            <div className="overflow-hidden">
                              <p 
                                onClick={() => onSelectCandidate(c)}
                                className="font-bold text-[#E6EAF0] hover:text-teal-300 cursor-pointer text-xs truncate"
                              >
                                {c.resume.fullName}
                              </p>
                              <p className="text-[10px] text-[#8A97A8] font-mono truncate">
                                {c.resume.experience[0]?.company || 'Candidate Profile'}
                              </p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                            score >= 80 ? 'text-emerald-400 bg-[#0E1A29] border-emerald-500/30' : 'text-teal-400 bg-[#0E1A29] border-teal-500/30'
                          }`}>
                            {score}%
                          </span>
                        </div>

                        {/* Interview Scheduled Badge if present */}
                        {c.interviewScheduledDate && (
                          <div className="p-1 rounded bg-[#0E1A29] border border-teal-500/30 flex items-center space-x-1 text-[9px] font-mono text-teal-300">
                            <Calendar className="w-2.5 h-2.5 shrink-0 text-teal-400" />
                            <span className="truncate">{c.interviewScheduledDate}</span>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 font-mono">
                          {c.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="text-[9px] px-1 py-0.2 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Quick Card Action Buttons */}
                        <div className="pt-1.5 border-t border-[#223348] flex items-center justify-between text-[10px] font-mono text-[#8A97A8]">
                          
                          <div className="flex items-center space-x-2">
                            {/* Notes Button */}
                            <button
                              onClick={() => setActiveNoteModalCandidate(c)}
                              title="Committee Notes"
                              className="flex items-center space-x-1 hover:text-[#E6EAF0] cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3 text-[#8A97A8]" />
                              <span>{(c.notes || []).length}</span>
                            </button>

                            {/* Schedule Interview Button */}
                            <button
                              onClick={() => setActiveInterviewCandidate(c)}
                              title="Schedule Interview"
                              className="flex items-center space-x-1 hover:text-teal-300 text-teal-400 cursor-pointer"
                            >
                              <Video className="w-3 h-3" />
                            </button>

                            {/* Message Candidate */}
                            {onOpenMessageModal && (
                              <button
                                onClick={() => onOpenMessageModal(c)}
                                title="Message Candidate"
                                className="flex items-center space-x-1 hover:text-teal-300 text-[#8A97A8] cursor-pointer"
                              >
                                <Send className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Move arrows */}
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => moveCandidate(c.id, 'prev')}
                              title="Move back"
                              className="p-1 rounded bg-[#0E1A29] hover:bg-[#17263B] text-[#8A97A8] hover:text-[#E6EAF0] border border-[#223348] cursor-pointer"
                            >
                              <ChevronLeft className="w-2.5 h-2.5" />
                            </button>
                            <button
                              onClick={() => moveCandidate(c.id, 'next')}
                              title="Advance stage"
                              className="p-1 rounded bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold cursor-pointer"
                            >
                              <ChevronRight className="w-2.5 h-2.5" />
                            </button>
                          </div>

                        </div>

                      </div>
                    );
                  })}

                  {colCandidates.length === 0 && (
                    <div className="p-4 rounded border border-dashed border-[#223348] text-center text-[#5B6B80] text-xs font-mono">
                      No candidates in stage
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
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#131F30] rounded-lg border border-[#223348] p-4 max-w-md w-full shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-[#223348] pb-2.5">
              <h3 className="text-xs font-bold text-[#E6EAF0] font-display">
                Evaluation Notes: {activeNoteModalCandidate.resume.fullName}
              </h3>
              <button 
                onClick={() => setActiveNoteModalCandidate(null)}
                className="text-[#8A97A8] hover:text-[#E6EAF0]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto text-xs font-mono">
              {(activeNoteModalCandidate.notes || []).length === 0 ? (
                <p className="text-[#8A97A8] text-center py-2">No notes logged yet.</p>
              ) : (
                activeNoteModalCandidate.notes.map(n => (
                  <div key={n.id} className="p-2 rounded bg-[#0E1A29] border border-[#223348] text-xs">
                    <div className="flex justify-between text-[10px] text-[#8A97A8] mb-1">
                      <span className="font-semibold text-teal-400">{n.author}</span>
                      <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[#E6EAF0] font-sans text-xs">{n.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2">
              <textarea
                rows={3}
                placeholder="Log structured evaluation criteria..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full bg-[#0E1A29] p-2.5 rounded border border-[#223348] text-xs text-[#E6EAF0] placeholder-[#5B6B80] focus:outline-none focus:border-teal-500 resize-none font-sans"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setActiveNoteModalCandidate(null)}
                  className="px-3 py-1 rounded text-xs font-semibold text-[#8A97A8] hover:text-[#E6EAF0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-3.5 py-1 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded text-xs font-bold transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#131F30] rounded-lg border border-[#223348] p-4 max-w-md w-full shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-[#223348] pb-2.5">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold text-[#E6EAF0] font-display">
                  Schedule Interview: {activeInterviewCandidate.resume.fullName}
                </h3>
              </div>
              <button 
                onClick={() => setActiveInterviewCandidate(null)}
                className="text-[#8A97A8] hover:text-[#E6EAF0]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div>
                <label className="text-[10px] text-[#8A97A8] block mb-1">Interview Date</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-xs text-[#E6EAF0] focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8A97A8] block mb-1">Time Slot</label>
                <input
                  type="time"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-xs text-[#E6EAF0] focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8A97A8] block mb-1">Format & Session Protocol</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-xs text-[#E6EAF0] focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="Technical Screening (Google Meet)">Technical Screening (Google Meet)</option>
                  <option value="System Design Round (Zoom)">System Design Round (Zoom)</option>
                  <option value="Executive Chat (Teams)">Executive Chat (Teams)</option>
                  <option value="On-Site Panel Interview">On-Site Panel Interview</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2.5 border-t border-[#223348]">
              <button
                onClick={() => setActiveInterviewCandidate(null)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-[#8A97A8] hover:text-[#E6EAF0] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleInterview}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Advance</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

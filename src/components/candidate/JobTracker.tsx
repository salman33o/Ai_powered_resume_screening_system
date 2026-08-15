import React, { useState } from 'react';
import { JobRequirement, StructuredResume } from '../../types';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Building2, 
  Calendar,
  Layers,
  MessageSquare,
  Send,
  Sparkles,
  MapPin,
  DollarSign,
  Search,
  Filter
} from 'lucide-react';
import { evaluateResumeAgainstJob } from '../../lib/atsEngine';

interface JobTrackerProps {
  jobs: JobRequirement[];
  resume: StructuredResume;
  onSelectJob: (job: JobRequirement) => void;
  setActiveView: (view: string) => void;
  onOpenMessageModal?: (job: JobRequirement) => void;
  onApplyJob?: (job: JobRequirement) => void;
}

export const JobTracker: React.FC<JobTrackerProps> = ({
  jobs,
  resume,
  onSelectJob,
  setActiveView,
  onOpenMessageModal,
  onApplyJob
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(['job-data-analyst']);

  const handleApply = (job: JobRequirement) => {
    if (!appliedJobIds.includes(job.id)) {
      setAppliedJobIds(prev => [...prev, job.id]);
    }
    if (onApplyJob) {
      onApplyJob(job);
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Live Hiring Board & Openings</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {jobs.length} Active Positions
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Job Openings & Direct Company Messaging
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Discover roles posted by verified companies, audit your ATS match score, and send instant messages directly to hiring managers.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles, companies, tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Tracked Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map((job) => {
          const scoreBreakdown = evaluateResumeAgainstJob(resume, job);
          const score = scoreBreakdown.overallScore;
          const isApplied = appliedJobIds.includes(job.id);

          return (
            <div 
              key={job.id} 
              className="bg-slate-900/95 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col justify-between hover:border-indigo-500/50 transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">{job.company}</span>
                    <h3 className="font-bold text-white text-base mt-0.5">{job.title}</h3>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-xl font-extrabold border ${
                    score >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                  }`}>
                    {score}% Match
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{job.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-300 font-semibold">{job.salaryRange || 'Competitive'}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {job.summary}
                </p>

                {/* Key specs */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Min Seniority:</span>
                    <span className="font-semibold text-white">{job.minExperienceYears}+ Years Experience</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Employment Type:</span>
                    <span className="font-semibold text-white">{job.type}</span>
                  </div>
                </div>

                {/* Matched Skills preview */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {job.requiredSkills.slice(0, 3).map((sk, sIdx) => (
                    <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono">
                      {sk}
                    </span>
                  ))}
                  {job.requiredSkills.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-slate-500">
                      +{job.requiredSkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Message Company + Analyze & Apply */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                
                <div className="grid grid-cols-2 gap-2">
                  {/* Direct Message Company Button */}
                  <button
                    onClick={() => {
                      if (onOpenMessageModal) onOpenMessageModal(job);
                    }}
                    className="py-2.5 px-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-indigo-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Message Company</span>
                  </button>

                  {/* One-click apply / state */}
                  <button
                    onClick={() => handleApply(job)}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      isApplied 
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Applied</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-slate-400" />
                        <span>One-Click Apply</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Primary ATS Deep Audit */}
                <button
                  onClick={() => {
                    onSelectJob(job);
                    setActiveView('resume-analyzer');
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl text-xs font-bold transition-all text-center shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Deep ATS Audit & Optimize</span>
                </button>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

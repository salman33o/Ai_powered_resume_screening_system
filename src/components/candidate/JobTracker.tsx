import React, { useState } from 'react';
import { JobRequirement, StructuredResume } from '../../types';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  DollarSign, 
  Search, 
  MessageSquare, 
  Send, 
  ArrowRight 
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
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Position Directory</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
              {jobs.length} Active Listings
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
            Verified Position Directory & Direct Applications
          </h2>
          <p className="text-xs text-[#8A97A8] mt-0.5">
            Evaluate positions posted by verified organizations, inspect ATS match breakdowns, and dispatch applications.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#8A97A8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search title, tech, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-[#0E1A29] rounded border border-[#223348] text-xs text-[#E6EAF0] placeholder-[#5B6B80] focus:outline-none focus:border-teal-500 w-full sm:w-60 font-mono"
          />
        </div>
      </div>

      {/* Tracked Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredJobs.map((job) => {
          const scoreBreakdown = evaluateResumeAgainstJob(resume, job);
          const score = scoreBreakdown.overallScore;
          const isApplied = appliedJobIds.includes(job.id);

          return (
            <div 
              key={job.id} 
              className="bg-[#131F30] rounded-lg border border-[#223348] p-4 space-y-3 flex flex-col justify-between hover:border-[#334A66] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider">{job.company}</span>
                    <h3 className="font-bold text-[#E6EAF0] text-sm mt-0.5 font-display">{job.title}</h3>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold border ${
                    score >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-[#0E1A29]' : 'text-teal-400 border-teal-500/30 bg-[#0E1A29]'
                  }`}>
                    {score}% Match
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-[#8A97A8] mt-1.5">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-[#5B6B80]" />
                    <span>{job.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3 text-teal-400" />
                    <span className="text-[#E6EAF0] font-semibold">{job.salaryRange || 'Competitive'}</span>
                  </span>
                </div>

                <p className="text-xs text-[#8A97A8] mt-2 line-clamp-2 leading-relaxed">
                  {job.summary}
                </p>

                {/* Key specs */}
                <div className="mt-3 pt-2.5 border-t border-[#223348] text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-[#8A97A8]">
                    <span>Seniority Requirement:</span>
                    <span className="font-semibold text-[#E6EAF0]">{job.minExperienceYears}+ Yrs</span>
                  </div>
                  <div className="flex justify-between text-[#8A97A8]">
                    <span>Contract Type:</span>
                    <span className="font-semibold text-[#E6EAF0]">{job.type}</span>
                  </div>
                </div>

                {/* Matched Skills preview */}
                <div className="flex flex-wrap gap-1 mt-2.5 font-mono">
                  {job.requiredSkills.slice(0, 3).map((sk, sIdx) => (
                    <span key={sIdx} className="text-[9px] px-1.5 py-0.2 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
                      {sk}
                    </span>
                  ))}
                  {job.requiredSkills.length > 3 && (
                    <span className="text-[9px] px-1 py-0.2 text-[#8A97A8]">
                      +{job.requiredSkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Message Company + Analyze & Apply */}
              <div className="pt-3 border-t border-[#223348] space-y-1.5 font-mono">
                
                <div className="grid grid-cols-2 gap-1.5">
                  {/* Direct Message Company Button */}
                  <button
                    onClick={() => {
                      if (onOpenMessageModal) onOpenMessageModal(job);
                    }}
                    className="py-1.5 px-2.5 rounded bg-[#0E1A29] hover:bg-[#17263B] border border-[#223348] text-[#8A97A8] hover:text-[#E6EAF0] text-xs font-medium transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3 text-teal-400" />
                    <span>Message</span>
                  </button>

                  {/* One-click apply / state */}
                  <button
                    onClick={() => handleApply(job)}
                    className={`py-1.5 px-2.5 rounded text-xs font-medium transition-colors flex items-center justify-center space-x-1 cursor-pointer border ${
                      isApplied 
                        ? 'bg-[#0E1A29] text-emerald-400 border-emerald-500/30' 
                        : 'bg-[#0E1A29] hover:bg-[#17263B] border-[#223348] text-[#E6EAF0]'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Applied</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3 text-[#8A97A8]" />
                        <span>Apply</span>
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
                  className="w-full py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded text-xs font-bold transition-colors text-center cursor-pointer flex items-center justify-center space-x-1"
                >
                  <span>Evaluate ATS Spec</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { JobRequirement, StructuredResume } from '../../types';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Search, 
  MessageSquare, 
  Send, 
  ArrowRight,
  Filter,
  CheckCircle2
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
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(['job-data-analyst']);

  const handleApply = (job: JobRequirement) => {
    if (!appliedJobIds.includes(job.id)) {
      setAppliedJobIds(prev => [...prev, job.id]);
    }
    if (onApplyJob) {
      onApplyJob(job);
    }
  };

  const domainCategories = [
    { id: 'all', label: 'All Fields' },
    { id: 'it', label: 'IT & Data' },
    { id: 'eee', label: 'Electrical (EEE)' },
    { id: 'agri', label: 'Agriculture (Agri)' },
    { id: 'art', label: 'Art & Design' },
    { id: 'mech', label: 'Mech & Civil' },
    { id: 'health', label: 'Healthcare' }
  ];

  const filteredJobs = jobs.filter(j => {
    const domainMatch = selectedDomain === 'all' ||
      (selectedDomain === 'it' && (j.department?.includes('Technology') || j.department?.includes('Data') || j.id.includes('data') || j.id.includes('ml') || j.id.includes('fullstack') || j.id.includes('devops') || j.id.includes('cyber'))) ||
      (selectedDomain === 'eee' && (j.department?.includes('Electrical') || j.id.includes('eee'))) ||
      (selectedDomain === 'agri' && (j.department?.includes('Agriculture') || j.id.includes('agri'))) ||
      (selectedDomain === 'art' && (j.department?.includes('Art') || j.id.includes('art'))) ||
      (selectedDomain === 'mech' && (j.department?.includes('Mechanical') || j.id.includes('mech') || j.id.includes('civil'))) ||
      (selectedDomain === 'health' && (j.department?.includes('Healthcare') || j.id.includes('biomed')));

    const searchMatch = !searchQuery || 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return domainMatch && searchMatch;
  });

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Position Directory</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
              {jobs.length} Active Openings
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
            Multi-Domain Position Directory & Direct Applications
          </h2>
          <p className="text-xs text-[#8A97A8] mt-0.5">
            Browse requisitions across IT, Electrical (EEE), Agriculture (Agri), Arts, Mechanical, and Healthcare.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#8A97A8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search role, stack, field..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-[#0E1A29] rounded border border-[#223348] text-xs text-[#E6EAF0] placeholder-[#5B6B80] focus:outline-none focus:border-teal-500 w-full sm:w-64 font-mono"
          />
        </div>
      </div>

      {/* Domain Filters */}
      <div className="bg-[#131F30] rounded-lg p-2.5 border border-[#223348] flex flex-wrap items-center gap-1.5 font-mono text-xs">
        <span className="text-[10px] font-bold text-[#8A97A8] uppercase flex items-center space-x-1 mr-1">
          <Filter className="w-3 h-3 text-teal-400" />
          <span>Industry Sector:</span>
        </span>
        {domainCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedDomain(cat.id)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              selectedDomain === cat.id
                ? 'bg-teal-600 text-slate-950 font-bold'
                : 'bg-[#0E1A29] text-[#8A97A8] hover:text-[#E6EAF0] border border-[#223348]'
            }`}
          >
            {cat.label}
          </button>
        ))}
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
                    <span className="text-[10px] font-mono text-[#8A97A8]">{job.department}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold border shrink-0 ${
                    score >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-[#0E1A29]' : 'text-teal-400 border-teal-500/30 bg-[#0E1A29]'
                  }`}>
                    {score}% Match
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-[#8A97A8] mt-2">
                  <span className="flex items-center space-x-1 truncate">
                    <MapPin className="w-3 h-3 text-[#5B6B80]" />
                    <span>{job.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 shrink-0">
                    <DollarSign className="w-3 h-3 text-teal-400" />
                    <span className="text-[#E6EAF0] font-semibold">{job.salaryRange || 'Competitive'}</span>
                  </span>
                </div>

                <p className="text-xs text-[#8A97A8] mt-2 line-clamp-2 leading-relaxed font-sans">
                  {job.summary}
                </p>

                {/* Key specs */}
                <div className="mt-3 pt-2.5 border-t border-[#223348] text-xs font-mono space-y-1">
                  <div className="flex justify-between text-[#8A97A8]">
                    <span>Seniority / Exp:</span>
                    <span className="font-semibold text-[#E6EAF0]">{job.minExperienceYears}+ Yrs ({job.seniority})</span>
                  </div>
                  <div className="flex justify-between text-[#8A97A8]">
                    <span>Contract Type:</span>
                    <span className="font-semibold text-[#E6EAF0]">{job.type}</span>
                  </div>
                </div>

                {/* Matched Skills preview */}
                <div className="flex flex-wrap gap-1 mt-2.5 font-mono">
                  {job.requiredSkills.slice(0, 3).map((sk, sIdx) => (
                    <span key={sIdx} className="text-[9px] px-1.5 py-0.2 rounded bg-[#0E1A29] text-teal-300 border border-[#223348]">
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

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#223348] flex items-center justify-between gap-2 font-mono">
                <button
                  onClick={() => {
                    onSelectJob(job);
                    setActiveView('resume-analyzer');
                  }}
                  className="px-2.5 py-1.5 bg-[#0E1A29] hover:bg-[#17263B] text-[#E6EAF0] border border-[#223348] rounded text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <span>Inspect ATS</span>
                  <ArrowRight className="w-3 h-3 text-teal-400" />
                </button>

                <div className="flex items-center space-x-1.5">
                  {onOpenMessageModal && (
                    <button
                      onClick={() => onOpenMessageModal(job)}
                      title="Direct Recruiter Message"
                      className="p-1.5 bg-[#0E1A29] hover:bg-[#17263B] border border-[#223348] text-teal-400 rounded transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleApply(job)}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 ${
                      isApplied
                        ? 'bg-[#0E1A29] text-emerald-400 border border-emerald-500/40'
                        : 'bg-teal-600 hover:bg-teal-500 text-slate-950'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Applied</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

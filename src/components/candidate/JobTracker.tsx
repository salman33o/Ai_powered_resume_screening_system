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
  CheckCircle2,
  Layers,
  ChevronDown
} from 'lucide-react';
import { evaluateResumeAgainstJob } from '../../lib/atsEngine';
import { INDUSTRY_SECTOR_TAXONOMY } from '../../lib/mockData';

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
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(['job-data-analyst']);

  const handleApply = (job: JobRequirement) => {
    if (!appliedJobIds.includes(job.id)) {
      setAppliedJobIds(prev => [...prev, job.id]);
    }
    if (onApplyJob) {
      onApplyJob(job);
    }
  };

  const activeSectorRoles = selectedSector !== 'all' 
    ? (INDUSTRY_SECTOR_TAXONOMY.find(s => s.id === selectedSector)?.roles || [])
    : [];

  const filteredJobs = jobs.filter(j => {
    const sectorObj = INDUSTRY_SECTOR_TAXONOMY.find(s => s.id === selectedSector);
    
    const sectorMatch = selectedSector === 'all' || 
      (j.sector && j.sector.toLowerCase() === sectorObj?.sector.toLowerCase()) ||
      (j.department && j.department.toLowerCase().includes(sectorObj?.sector.toLowerCase() || '')) ||
      (sectorObj?.roles.some(r => j.title.toLowerCase().includes(r.toLowerCase()))) ||
      (selectedSector === 'it-software' && (j.title.includes('Software') || j.title.includes('Developer') || j.title.includes('Full-Stack'))) ||
      (selectedSector === 'data-ai' && (j.title.includes('Data') || j.title.includes('Machine Learning') || j.title.includes('AI'))) ||
      (selectedSector === 'cybersecurity' && (j.title.includes('Cybersecurity') || j.title.includes('Security') || j.title.includes('SOC'))) ||
      (selectedSector === 'cloud-devops' && (j.title.includes('DevOps') || j.title.includes('Cloud'))) ||
      (selectedSector === 'engineering' && (j.title.includes('Electrical') || j.title.includes('Mechanical') || j.title.includes('Civil'))) ||
      (selectedSector === 'healthcare' && (j.title.includes('Biomedical') || j.title.includes('Clinical') || j.title.includes('Healthcare'))) ||
      (selectedSector === 'media' && (j.title.includes('Art') || j.title.includes('3D') || j.title.includes('Design')));

    const roleMatch = selectedRoleFilter === 'all' || j.title.toLowerCase().includes(selectedRoleFilter.toLowerCase());

    const searchMatch = !searchQuery || 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return sectorMatch && roleMatch && searchMatch;
  });

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Universal Position Directory</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0E1A29] text-teal-300 border border-[#223348]">
              {INDUSTRY_SECTOR_TAXONOMY.length} Industry Sectors • 80+ Specialized Roles
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
            Cross-Domain Job Openings & ATS Match Engine
          </h2>
          <p className="text-xs text-[#8A97A8] mt-0.5">
            Evaluate positions across IT, Data, Engineering, Healthcare, Automobile, Finance, Textile, Logistics, Media, Sales, and Research.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#8A97A8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search any sector or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-[#0E1A29] rounded border border-[#223348] text-xs text-[#E6EAF0] placeholder-[#5B6B80] focus:outline-none focus:border-teal-500 w-full sm:w-64 font-mono"
          />
        </div>
      </div>

      {/* Sector Dropdown / Filter Bar */}
      <div className="bg-[#131F30] rounded-lg p-3 border border-[#223348] space-y-2.5 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#223348]">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-[10.5px] font-bold text-[#8A97A8] uppercase">Industry Sector Filter:</span>
            <select
              value={selectedSector}
              onChange={(e) => {
                setSelectedSector(e.target.value);
                setSelectedRoleFilter('all');
              }}
              className="bg-[#0E1A29] border border-[#223348] rounded px-2.5 py-1 text-xs text-teal-300 font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="all">All 20 Industry Sectors</option>
              {INDUSTRY_SECTOR_TAXONOMY.map(s => (
                <option key={s.id} value={s.id}>{s.sector} ({s.roles.length} roles)</option>
              ))}
            </select>
          </div>

          {activeSectorRoles.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-[#8A97A8] uppercase font-bold">Role:</span>
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="bg-[#0E1A29] border border-[#223348] rounded px-2.5 py-1 text-xs text-[#E6EAF0] focus:outline-none focus:border-teal-500 cursor-pointer max-w-[200px] truncate"
              >
                <option value="all">All Roles in Sector</option>
                {activeSectorRoles.map((r, rIdx) => (
                  <option key={rIdx} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Quick Sector Tags */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => { setSelectedSector('all'); setSelectedRoleFilter('all'); }}
            className={`px-2 py-0.5 rounded text-[10.5px] transition-colors cursor-pointer ${
              selectedSector === 'all'
                ? 'bg-teal-600 text-slate-950 font-bold'
                : 'bg-[#0E1A29] text-[#8A97A8] hover:text-[#E6EAF0] border border-[#223348]'
            }`}
          >
            All (20)
          </button>
          {INDUSTRY_SECTOR_TAXONOMY.slice(0, 10).map(s => (
            <button
              key={s.id}
              onClick={() => { setSelectedSector(s.id); setSelectedRoleFilter('all'); }}
              className={`px-2 py-0.5 rounded text-[10.5px] transition-colors cursor-pointer ${
                selectedSector === s.id
                  ? 'bg-teal-600 text-slate-950 font-bold'
                  : 'bg-[#0E1A29] text-[#8A97A8] hover:text-[#E6EAF0] border border-[#223348]'
              }`}
            >
              {s.sector}
            </button>
          ))}
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
                    <span className="text-[10px] font-mono text-[#8A97A8]">{job.department || job.sector}</span>
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

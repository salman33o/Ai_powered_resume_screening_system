import React from 'react';
import { 
  JobRequirement, 
  PipelineCandidate, 
  StructuredResume 
} from '../../types';
import { 
  Users, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  BarChart3, 
  ArrowRight, 
  Briefcase
} from 'lucide-react';

interface RecruiterDashboardProps {
  candidates: PipelineCandidate[];
  activeJob: JobRequirement;
  setActiveView: (view: string) => void;
  onSelectCandidate: (candidate: PipelineCandidate) => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  candidates,
  activeJob,
  setActiveView,
  onSelectCandidate
}) => {
  const total = candidates.length;
  const shortlisted = candidates.filter(c => c.stage === 'shortlisted').length;
  const interviewing = candidates.filter(c => c.stage === 'interview').length;
  const avgScore = Math.round(candidates.reduce((acc, c) => acc + c.atsScore.overallScore, 0) / (total || 1));
  const highFitCount = candidates.filter(c => c.atsScore.overallScore >= 80).length;

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Recruiter Console</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
              Target: {activeJob.title}
            </span>
          </div>
          <h1 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
            Recruitment Screening & Pipeline Console
          </h1>
          <p className="text-xs text-[#8A97A8] mt-0.5 max-w-2xl">
            Deterministic ATS scoring evaluates candidates across 7 explainable dimensions. Review candidate scorecards and advance verified profiles.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveView('recruiter-bulk')}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Launch Bulk Screen</span>
          </button>
          <button
            onClick={() => setActiveView('candidate-ranking')}
            className="px-3.5 py-1.5 bg-[#0E1A29] hover:bg-[#17263B] text-[#E6EAF0] rounded text-xs font-medium border border-[#223348] flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span>Ranked Matrix</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* Total Applicants */}
        <div className="bg-[#131F30] rounded-lg p-3.5 border border-[#223348] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-[#8A97A8] uppercase">Applicant Pool</span>
            <Users className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="my-1.5">
            <p className="text-2xl font-mono font-bold text-[#E6EAF0]">{total}</p>
            <p className="text-[10px] text-[#8A97A8] font-mono mt-0.5">Indexed candidate profiles</p>
          </div>
          <div className="text-[10px] font-mono text-teal-400 pt-1 border-t border-[#223348]">
            100% Screened
          </div>
        </div>

        {/* Avg Match Score */}
        <div className="bg-[#131F30] rounded-lg p-3.5 border border-[#223348] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-[#8A97A8] uppercase">Average Match</span>
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="my-1.5">
            <p className="text-2xl font-mono font-bold text-teal-400">{avgScore}%</p>
            <p className="text-[10px] text-[#8A97A8] font-mono mt-0.5">Confidence: 94%</p>
          </div>
          <div className="text-[10px] font-mono text-[#8A97A8] pt-1 border-t border-[#223348]">
            7 Evaluated Dimensions
          </div>
        </div>

        {/* High Fit Candidates */}
        <div className="bg-[#131F30] rounded-lg p-3.5 border border-[#223348] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-[#8A97A8] uppercase">High Fit (80%+)</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-1.5">
            <p className="text-2xl font-mono font-bold text-emerald-400">{highFitCount}</p>
            <p className="text-[10px] text-[#8A97A8] font-mono mt-0.5">Recommended for review</p>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 pt-1 border-t border-[#223348]">
            Priority Fast-Track
          </div>
        </div>

        {/* Pipeline In-Progress */}
        <div className="bg-[#131F30] rounded-lg p-3.5 border border-[#223348] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-[#8A97A8] uppercase">In Pipeline</span>
            <Briefcase className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="my-1.5">
            <p className="text-2xl font-mono font-bold text-[#E6EAF0]">{shortlisted + interviewing}</p>
            <p className="text-[10px] text-[#8A97A8] font-mono mt-0.5">Shortlisted + Interview</p>
          </div>
          <div className="text-[10px] font-mono text-[#8A97A8] pt-1 border-t border-[#223348]">
            {interviewing} Active in Stage
          </div>
        </div>

      </div>

      {/* Top Ranked Candidates Table Preview */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E6EAF0]">
              Candidate Evaluation Summary — {activeJob.title}
            </h3>
          </div>
          <button
            onClick={() => setActiveView('candidate-ranking')}
            className="text-xs font-mono text-teal-400 hover:text-teal-300 font-semibold flex items-center space-x-1 cursor-pointer"
          >
            <span>Full Matrix Directory</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#223348] text-[#8A97A8] uppercase text-[10px] tracking-wider">
                <th className="pb-2.5 font-semibold">Candidate Profile</th>
                <th className="pb-2.5 font-semibold">ATS Score</th>
                <th className="pb-2.5 font-semibold">Skills Coverage</th>
                <th className="pb-2.5 font-semibold">Experience</th>
                <th className="pb-2.5 font-semibold">Status</th>
                <th className="pb-2.5 font-semibold text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#192738]">
              {candidates.slice(0, 5).map((c) => (
                <tr key={c.id} className="hover:bg-[#0E1A29] transition-colors">
                  <td className="py-2.5 font-sans">
                    <p className="font-bold text-[#E6EAF0]">{c.resume.fullName}</p>
                    <p className="text-[10px] font-mono text-[#8A97A8]">{c.resume.email}</p>
                  </td>
                  <td className="py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold border ${
                      c.atsScore.overallScore >= 80 
                        ? 'text-emerald-400 border-emerald-500/30 bg-[#0E1A29]' 
                        : 'text-teal-400 border-teal-500/30 bg-[#0E1A29]'
                    }`}>
                      {c.atsScore.overallScore}%
                    </span>
                  </td>
                  <td className="py-2.5 text-[#8A97A8]">
                    {c.atsScore.components.skillsMatch.matched.length}/{activeJob.requiredSkills.length} matched
                  </td>
                  <td className="py-2.5 text-[#8A97A8]">
                    {c.atsScore.components.experienceMatch.candidateYears} yrs ({c.atsScore.components.experienceMatch.titleAlignment})
                  </td>
                  <td className="py-2.5">
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
                      {c.stage}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => {
                        onSelectCandidate(c);
                        setActiveView('candidate-ranking');
                      }}
                      className="px-2.5 py-1 bg-[#0E1A29] hover:bg-[#17263B] text-[#E6EAF0] rounded text-xs font-semibold border border-[#223348] transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

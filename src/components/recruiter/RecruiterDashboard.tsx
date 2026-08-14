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
  Clock, 
  BarChart3, 
  ArrowRight, 
  Sparkles,
  Filter,
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
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 rounded-2xl p-5 border border-emerald-500/20 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Recruiter Operations Hub</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Active Job: {activeJob.title}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Recruitment Screening & Pipeline Console
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Deterministic ATS scoring processes incoming applicants in milliseconds. Review evidence-backed scores and advance candidates across the hiring pipeline.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveView('recruiter-bulk')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Launch Bulk Screening</span>
          </button>
          <button
            onClick={() => setActiveView('candidate-ranking')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-slate-700 transition-all"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ranked Directory</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Applicants */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Applicant Pool</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-white">{total}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Profiles indexed</p>
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold pt-1 border-t border-slate-800/80">
            100% Screened via Hybrid ATS
          </div>
        </div>

        {/* Avg Match Score */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Avg Match Score</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-cyan-400">{avgScore}%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Confidence: 94%</p>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            7 Weighted Dimensions
          </div>
        </div>

        {/* High Fit Candidates */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">High Fit (80%+)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-emerald-400">{highFitCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Top-tier recommendations</p>
          </div>
          <div className="text-[11px] text-indigo-300 font-semibold pt-1 border-t border-slate-800/80">
            Ready for Fast-Track
          </div>
        </div>

        {/* Pipeline In-Progress */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">In Pipeline</span>
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-black text-purple-400">{shortlisted + interviewing}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Shortlisted + Interview</p>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            {interviewing} in Active Rounds
          </div>
        </div>

      </div>

      {/* Top Ranked Candidates Table Preview */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Top Ranked Applicants for {activeJob.title}
            </h3>
          </div>
          <button
            onClick={() => setActiveView('candidate-ranking')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Candidate</th>
                <th className="pb-3 font-semibold">Overall ATS Score</th>
                <th className="pb-3 font-semibold">Skills Match</th>
                <th className="pb-3 font-semibold">Experience</th>
                <th className="pb-3 font-semibold">Pipeline Stage</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {candidates.slice(0, 5).map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3">
                    <p className="font-bold text-white">{c.resume.fullName}</p>
                    <p className="text-[11px] text-slate-400">{c.resume.email}</p>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                      c.atsScore.overallScore >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                    }`}>
                      {c.atsScore.overallScore}%
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">
                    {c.atsScore.components.skillsMatch.matched.length} of {activeJob.requiredSkills.length} matched
                  </td>
                  <td className="py-3 text-slate-300">
                    ~{c.atsScore.components.experienceMatch.candidateYears} yrs ({c.atsScore.components.experienceMatch.titleAlignment})
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {c.stage}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        onSelectCandidate(c);
                        setActiveView('candidate-ranking');
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      Audit Score
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

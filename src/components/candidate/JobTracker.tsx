import React from 'react';
import { JobRequirement, StructuredResume } from '../../types';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Building2, 
  Calendar,
  Layers
} from 'lucide-react';
import { evaluateResumeAgainstJob } from '../../lib/atsEngine';

interface JobTrackerProps {
  jobs: JobRequirement[];
  resume: StructuredResume;
  onSelectJob: (job: JobRequirement) => void;
  setActiveView: (view: string) => void;
}

export const JobTracker: React.FC<JobTrackerProps> = ({
  jobs,
  resume,
  onSelectJob,
  setActiveView
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Application Pipeline</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {jobs.length} Tracked Roles
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">
          Job Target Match & Application Tracker
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          Track and compare your ATS match percentage across various open positions in the ecosystem.
        </p>
      </div>

      {/* Tracked Job Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job, idx) => {
          const scoreBreakdown = evaluateResumeAgainstJob(resume, job);
          const score = scoreBreakdown.overallScore;

          return (
            <div 
              key={job.id} 
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{job.company}</span>
                    <h3 className="font-bold text-white text-sm mt-0.5">{job.title}</h3>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                    score >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                  }`}>
                    {score}% Match
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{job.description}</p>

                <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-300">
                    <span>Required Experience:</span>
                    <span className="font-semibold text-white">{job.minExperienceYears}+ Years</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Salary Benchmark:</span>
                    <span className="font-semibold text-white">{job.salaryRange}</span>
                  </div>
                </div>

                {/* Matched Skills preview */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {job.requiredSkills.slice(0, 3).map((sk, sIdx) => (
                    <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center space-x-2">
                <button
                  onClick={() => {
                    onSelectJob(job);
                    setActiveView('resume-analyzer');
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors text-center"
                >
                  Analyze Fit & Audit
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

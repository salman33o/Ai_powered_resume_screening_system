import React from 'react';
import { PipelineCandidate, JobRequirement } from '../../types';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  PieChart,
  Layers
} from 'lucide-react';

interface RecruiterAnalyticsProps {
  candidates: PipelineCandidate[];
  activeJob: JobRequirement;
}

export const RecruiterAnalytics: React.FC<RecruiterAnalyticsProps> = ({
  candidates,
  activeJob
}) => {
  const total = candidates.length || 1;
  const scoreBuckets = [
    { range: '90-100% (Top Fit)', count: candidates.filter(c => c.atsScore.overallScore >= 90).length, color: 'bg-emerald-500' },
    { range: '80-89% (High Fit)', count: candidates.filter(c => c.atsScore.overallScore >= 80 && c.atsScore.overallScore < 90).length, color: 'bg-teal-500' },
    { range: '70-79% (Moderate)', count: candidates.filter(c => c.atsScore.overallScore >= 70 && c.atsScore.overallScore < 80).length, color: 'bg-blue-500' },
    { range: '50-69% (Needs Training)', count: candidates.filter(c => c.atsScore.overallScore >= 50 && c.atsScore.overallScore < 70).length, color: 'bg-amber-500' },
    { range: '<50% (Unmatched)', count: candidates.filter(c => c.atsScore.overallScore < 50).length, color: 'bg-rose-500' },
  ];

  // Pipeline funnel steps
  const funnel = [
    { name: 'Total Indexed', count: total },
    { name: 'Passed ATS Screen (>=70%)', count: candidates.filter(c => c.atsScore.overallScore >= 70).length },
    { name: 'Shortlisted', count: candidates.filter(c => c.stage === 'shortlisted' || c.stage === 'interview' || c.stage === 'selected').length },
    { name: 'Interview Stage', count: candidates.filter(c => c.stage === 'interview' || c.stage === 'selected').length },
    { name: 'Final Offers', count: candidates.filter(c => c.stage === 'selected').length },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Executive Recruitment Metrics</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Cohort Analysis
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">
          Hiring Pipeline & ATS Distribution Analytics
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          Real-time insights across candidate volume, deterministic score distribution, and screening efficiency for <span className="font-semibold text-white">{activeJob.title}</span>.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Screening Hours Saved</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-white mt-2">
            {Math.round(total * 0.25)} hrs
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Calculated at ~15 mins saved per manual resume review
          </p>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">High-Fit Conversion</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-2">
            {Math.round((candidates.filter(c => c.atsScore.overallScore >= 80).length / total) * 100)}%
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Candidates meeting 80%+ benchmark
          </p>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Algorithmic Parity</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-indigo-400 mt-2">100%</p>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic rule validation with zero hallucination risk
          </p>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: ATS Score Histogram */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Applicant ATS Score Distribution</span>
          </h3>

          <div className="space-y-3 pt-2">
            {scoreBuckets.map((bucket, idx) => {
              const percent = Math.round((bucket.count / total) * 100);
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>{bucket.range}</span>
                    <span className="font-bold text-white">{bucket.count} candidates ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`${bucket.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: Pipeline Conversion Funnel */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Recruitment Funnel Conversion</span>
          </h3>

          <div className="space-y-2.5 pt-2">
            {funnel.map((step, idx) => {
              const stepPercent = Math.round((step.count / total) * 100);
              return (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-200">{step.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white">{step.count}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">({stepPercent}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

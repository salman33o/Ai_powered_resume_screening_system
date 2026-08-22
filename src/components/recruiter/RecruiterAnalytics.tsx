import React from 'react';
import { PipelineCandidate, JobRequirement } from '../../types';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
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
    { range: '70-79% (Moderate)', count: candidates.filter(c => c.atsScore.overallScore >= 70 && c.atsScore.overallScore < 80).length, color: 'bg-teal-700' },
    { range: '50-69% (Needs Training)', count: candidates.filter(c => c.atsScore.overallScore >= 50 && c.atsScore.overallScore < 70).length, color: 'bg-amber-600' },
    { range: '<50% (Unmatched)', count: candidates.filter(c => c.atsScore.overallScore < 50).length, color: 'bg-rose-600' },
  ];

  const funnel = [
    { name: 'Total Indexed Profiles', count: total },
    { name: 'Threshold Passed (>=70%)', count: candidates.filter(c => c.atsScore.overallScore >= 70).length },
    { name: 'Shortlisted Stage', count: candidates.filter(c => c.stage === 'shortlisted' || c.stage === 'interview' || c.stage === 'selected').length },
    { name: 'Interview Evaluation', count: candidates.filter(c => c.stage === 'interview' || c.stage === 'selected').length },
    { name: 'Final Offers / Hired', count: candidates.filter(c => c.stage === 'selected').length },
  ];

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348]">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Executive Telemetry</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
            Cohort Analysis
          </span>
        </div>
        <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
          Hiring Pipeline & ATS Distribution Analytics
        </h2>
        <p className="text-xs text-[#8A97A8] mt-0.5">
          Quantitative telemetry across candidate volume, deterministic score distribution, and screening efficiency for <span className="font-semibold text-[#E6EAF0]">{activeJob.title}</span>.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        <div className="bg-[#131F30] rounded-lg p-3.5 border border-[#223348]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-[#8A97A8] uppercase">Review Time Saved</span>
            <Clock className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#E6EAF0] mt-1.5">
            {Math.round(total * 0.25)} hrs
          </p>
          <p className="text-[10px] font-mono text-[#8A97A8] mt-0.5">
            ~15 mins saved per manual resume audit
          </p>
        </div>

        <div className="bg-[#131F30] rounded-lg p-3.5 border border-[#223348]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-[#8A97A8] uppercase">High-Fit Conversion</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-emerald-400 mt-1.5">
            {Math.round((candidates.filter(c => c.atsScore.overallScore >= 80).length / total) * 100)}%
          </p>
          <p className="text-[10px] font-mono text-[#8A97A8] mt-0.5">
            Profiles meeting 80%+ threshold
          </p>
        </div>

        <div className="bg-[#131F30] rounded-lg p-3.5 border border-[#223348]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-[#8A97A8] uppercase">Audit Parity</span>
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-teal-400 mt-1.5">100%</p>
          <p className="text-[10px] font-mono text-[#8A97A8] mt-0.5">
            Deterministic explainable calculations
          </p>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 font-mono">
        
        {/* Left 6 Cols: ATS Score Histogram */}
        <div className="lg:col-span-6 bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#E6EAF0] flex items-center space-x-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
            <span>Applicant ATS Score Distribution</span>
          </h3>

          <div className="space-y-2.5 pt-1">
            {scoreBuckets.map((bucket, idx) => {
              const percent = Math.round((bucket.count / total) * 100);
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#8A97A8]">
                    <span>{bucket.range}</span>
                    <span className="font-bold text-[#E6EAF0]">{bucket.count} ({percent}%)</span>
                  </div>
                  <div className="instrument-gauge">
                    <div 
                      className={`h-full ${bucket.color} transition-all duration-300`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: Pipeline Conversion Funnel */}
        <div className="lg:col-span-6 bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#E6EAF0] flex items-center space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
            <span>Pipeline Funnel Transition</span>
          </h3>

          <div className="space-y-2 pt-1">
            {funnel.map((step, idx) => {
              const stepPercent = Math.round((step.count / total) * 100);
              return (
                <div key={idx} className="p-2.5 rounded bg-[#0E1A29] border border-[#223348] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded bg-[#131F30] text-[#8A97A8] font-bold flex items-center justify-center text-[10px] border border-[#223348]">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-[#E6EAF0]">{step.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-teal-400">{step.count}</span>
                    <span className="text-[10px] text-[#8A97A8] ml-1">({stepPercent}%)</span>
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

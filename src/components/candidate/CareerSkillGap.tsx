import React from 'react';
import { StructuredResume, JobRequirement, ATSScoreBreakdown } from '../../types';
import { 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  Award, 
  Zap 
} from 'lucide-react';

interface CareerSkillGapProps {
  resume: StructuredResume;
  job: JobRequirement;
  analysis: ATSScoreBreakdown;
  setActiveView: (view: string) => void;
}

export const CareerSkillGap: React.FC<CareerSkillGapProps> = ({
  resume,
  job,
  analysis,
  setActiveView
}) => {
  const missingSkills = analysis.components.skillsMatch.missingRequired;
  const preferredMissing = analysis.components.skillsMatch.missingPreferred;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Career Trajectory</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
            Skill-Gap Analysis
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">
          Career Competency & Skill Gap Roadmap
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          Strategic curriculum and practical projects to close detected skill gaps for <span className="font-semibold text-white">{job.title}</span>.
        </p>
      </div>

      {/* Grid: Gap Overview vs Learning Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Detected Skill Gaps */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
              <XCircle className="w-4 h-4" />
              <span>Mandatory Role Gaps ({missingSkills.length})</span>
            </h3>

            {missingSkills.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All mandatory job requirements are covered in your CV!</span>
              </div>
            ) : (
              <div className="space-y-2">
                {missingSkills.map((sk, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{sk}</p>
                      <p className="text-[11px] text-slate-400">High priority for ATS pass rate</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      Tier 1 Priority
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Skill Gaps */}
          {preferredMissing.length > 0 && (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Bonus / Preferred Skills ({preferredMissing.length})
              </h3>
              <div className="space-y-2">
                {preferredMissing.map((sk, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{sk}</span>
                    <span className="text-[10px] text-slate-400">Differentiator</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right 7 Cols: Recommended Step-by-Step Learning Path */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Personalized Bridging Roadmap for {job.title}</span>
            </h3>

            <div className="space-y-3">
              
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-indigo-400 font-bold">
                  <BookOpen className="w-4 h-4" />
                  <span>Phase 1: Practical Stack Upskilling</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Focus on mastering <span className="text-white font-semibold">{missingSkills.slice(0, 2).join(' & ') || 'cloud platforms and dbt'}</span> through hands-on portfolio builds.
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1">
                  <span>Estimated commitment: 2-3 weeks</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                  <Zap className="w-4 h-4" />
                  <span>Phase 2: Verifiable Project Demonstration</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Publish an open-source GitHub repository integrating <span className="text-white font-semibold">{job.requiredSkills.slice(0, 2).join(', ')}</span> with full README documentation and live deployment.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <Award className="w-4 h-4" />
                  <span>Phase 3: Industry Certification Target</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Target industry-standard credentials such as <span className="text-white font-semibold">{job.requiredCertifications[0] || 'Cloud Associate / Data Professional Certification'}</span>.
                </p>
              </div>

            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveView('resume-optimizer')}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
              >
                <span>Incorporate Existing Related Skills into Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

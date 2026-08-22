import React from 'react';
import { StructuredResume, JobRequirement, ATSScoreBreakdown } from '../../types';
import { 
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
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348]">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Trajectory Analysis</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1A29] text-teal-300 border border-[#223348]">
            Skill-Gap Matrix
          </span>
        </div>
        <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
          Competency & Skill Gap Roadmap
        </h2>
        <p className="text-xs text-[#8A97A8] mt-0.5">
          Actionable upskilling paths and portfolio artifacts to close detected competency gaps for <span className="font-semibold text-[#E6EAF0]">{job.title}</span>.
        </p>
      </div>

      {/* Grid: Gap Overview vs Learning Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 5 Cols: Detected Skill Gaps */}
        <div className="lg:col-span-5 space-y-3">
          
          <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>Mandatory Requirements Missing ({missingSkills.length})</span>
            </h3>

            {missingSkills.length === 0 ? (
              <div className="p-3 rounded bg-[#0E1A29] border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>All mandatory competencies verified in candidate profile.</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                {missingSkills.map((sk, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-[#0E1A29] border border-[#223348] flex items-center justify-between text-xs font-mono">
                    <div>
                      <p className="font-bold text-[#E6EAF0]">{sk}</p>
                      <p className="text-[10px] text-[#8A97A8]">Essential for passing ATS filters</p>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#131F30] text-rose-300 border border-rose-500/30">
                      Tier 1
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Skill Gaps */}
          {preferredMissing.length > 0 && (
            <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-2.5 font-mono">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Preferred Differentiators ({preferredMissing.length})
              </h3>
              <div className="space-y-1.5">
                {preferredMissing.map((sk, idx) => (
                  <div key={idx} className="p-2 rounded bg-[#0E1A29] border border-[#223348] flex items-center justify-between text-xs">
                    <span className="text-[#8A97A8] font-medium">{sk}</span>
                    <span className="text-[9px] text-[#5B6B80]">Optional</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right 7 Cols: Recommended Step-by-Step Learning Path */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E6EAF0] flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-teal-400" />
              <span>Competency Bridging Roadmap — {job.title}</span>
            </h3>

            <div className="space-y-2.5">
              
              {/* Step 1 */}
              <div className="p-3 rounded bg-[#0E1A29] border border-[#223348] space-y-1 text-xs">
                <div className="flex items-center space-x-1.5 text-teal-400 font-mono font-bold text-[11px]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Phase 1: Practical Stack Upskilling</span>
                </div>
                <p className="text-[#8A97A8] leading-relaxed">
                  Focus on mastering <span className="text-[#E6EAF0] font-semibold">{missingSkills.slice(0, 2).join(' & ') || 'cloud platforms and dbt'}</span> through hands-on portfolio builds.
                </p>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-[#5B6B80] pt-0.5">
                  <span>Estimated commitment: 2-3 weeks</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3 rounded bg-[#0E1A29] border border-[#223348] space-y-1 text-xs">
                <div className="flex items-center space-x-1.5 text-teal-300 font-mono font-bold text-[11px]">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Phase 2: Verifiable Project Demonstration</span>
                </div>
                <p className="text-[#8A97A8] leading-relaxed">
                  Publish an open-source repository integrating <span className="text-[#E6EAF0] font-semibold">{job.requiredSkills.slice(0, 2).join(', ')}</span> with full README documentation and test coverage.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3 rounded bg-[#0E1A29] border border-[#223348] space-y-1 text-xs">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-mono font-bold text-[11px]">
                  <Award className="w-3.5 h-3.5" />
                  <span>Phase 3: Certification Target</span>
                </div>
                <p className="text-[#8A97A8] leading-relaxed">
                  Target industry-standard credentials such as <span className="text-[#E6EAF0] font-semibold">{job.requiredCertifications[0] || 'Cloud Associate / Data Engineering Professional'}</span>.
                </p>
              </div>

            </div>

            <div className="pt-2 border-t border-[#223348]">
              <button
                onClick={() => setActiveView('resume-optimizer')}
                className="w-full py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded text-xs font-bold font-mono flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Incorporate Related Skills into CV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

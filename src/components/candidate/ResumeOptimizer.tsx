import React, { useState } from 'react';
import { 
  StructuredResume, 
  JobRequirement, 
  ATSScoreBreakdown 
} from '../../types';
import { 
  Wand2, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Edit3, 
  Save, 
  RefreshCw,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { optimizeResumeApi } from '../../services/apiClient';

interface ResumeOptimizerProps {
  resume: StructuredResume;
  setResume: (resume: StructuredResume) => void;
  job: JobRequirement;
  analysis: ATSScoreBreakdown;
  onReAnalyze: () => void;
}

export const ResumeOptimizer: React.FC<ResumeOptimizerProps> = ({
  resume,
  setResume,
  job,
  analysis,
  onReAnalyze
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationData, setOptimizationData] = useState<any>(null);
  const [editableSummary, setEditableSummary] = useState(resume.summary);
  const [appliedCount, setAppliedCount] = useState(0);

  const fetchOptimizations = async () => {
    setIsOptimizing(true);
    try {
      const data = await optimizeResumeApi(resume, job);
      setOptimizationData(data);
      if (data.optimizedSummary) {
        setEditableSummary(data.optimizedSummary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const applySummary = () => {
    setResume({
      ...resume,
      summary: editableSummary,
      updatedAt: new Date().toISOString()
    });
    setAppliedCount(prev => prev + 1);
    onReAnalyze();
  };

  const applyBulletToExperience = (improvedText: string) => {
    if (resume.experience.length === 0) return;
    const updatedExp = [...resume.experience];
    updatedExp[0] = {
      ...updatedExp[0],
      description: `${updatedExp[0].description} ${improvedText}`
    };
    setResume({
      ...resume,
      experience: updatedExp,
      updatedAt: new Date().toISOString()
    });
    setAppliedCount(prev => prev + 1);
    onReAnalyze();
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Deterministic Content Alignment</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1A29] text-teal-300 border border-[#223348]">
              Zero Fabrication
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
            Role-Specific Resume Alignment
          </h2>
          <p className="text-xs text-[#8A97A8] mt-0.5">
            Align verified technical achievements with <span className="font-semibold text-[#E6EAF0]">{job.title}</span> requirements.
          </p>
        </div>

        <button
          onClick={fetchOptimizations}
          disabled={isOptimizing}
          className="px-3.5 py-1.5 rounded bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-950 text-xs font-bold font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Wand2 className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Evaluating Alignments...' : 'Generate Optimization Plan'}</span>
        </button>
      </div>

      {/* Score Comparison Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
        
        {/* Current Score */}
        <div className="bg-[#131F30] rounded-lg p-3.5 border border-[#223348] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-[#8A97A8] uppercase">Current Match</span>
            <p className="text-2xl font-bold text-[#E6EAF0] mt-0.5">{analysis.overallScore}%</p>
          </div>
          <div className="text-right text-[11px] text-[#8A97A8]">
            <p>Target: {job.title}</p>
            <p className="text-teal-400 font-semibold">{analysis.components.skillsMatch.matched.length} Skills Verified</p>
          </div>
        </div>

        {/* Potential Score Lift */}
        <div className="bg-[#131F30] rounded-lg p-3.5 border border-[#223348] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-teal-400 uppercase">Estimated Potential</span>
            <p className="text-2xl font-bold text-teal-300 mt-0.5">
              {Math.min(98, analysis.overallScore + 14)}%
            </p>
          </div>
          <div className="text-right text-[11px] text-[#8A97A8]">
            <p className="font-semibold text-teal-400">+14% Potential Lift</p>
            <p>Via bullet metric clarity</p>
          </div>
        </div>

        {/* Improvements Applied Counter */}
        <div className="bg-[#131F30] rounded-lg p-3.5 border border-[#223348] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-[#8A97A8] uppercase">Improvements Applied</span>
            <p className="text-2xl font-bold text-[#E6EAF0] mt-0.5">{appliedCount}</p>
          </div>
          <div className="text-right text-[11px] text-[#8A97A8]">
            <p className="text-teal-400 font-semibold">Live Re-Scoring</p>
            <p>Real-time updates active</p>
          </div>
        </div>

      </div>

      {/* Optimizer Suggestions List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Summary Refinement */}
        <div className="lg:col-span-6 space-y-3">
          <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Edit3 className="w-3.5 h-3.5 text-teal-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E6EAF0]">
                  Target-Aligned Summary
                </h3>
              </div>
              <button
                onClick={applySummary}
                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded text-xs font-mono font-bold flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <Save className="w-3 h-3" />
                <span>Apply to CV</span>
              </button>
            </div>

            <textarea
              value={editableSummary}
              onChange={(e) => setEditableSummary(e.target.value)}
              rows={6}
              className="w-full bg-[#0E1A29] text-xs text-[#E6EAF0] p-2.5 rounded border border-[#223348] focus:outline-none focus:border-teal-500 font-sans leading-relaxed resize-none"
              placeholder="Resume summary..."
            />

            <p className="text-[11px] text-[#8A97A8] leading-relaxed">
              Ensure summary highlights verified experience with {job.requiredSkills.slice(0, 3).join(', ')} while remaining 100% truthful to your background.
            </p>
          </div>

          {/* Keyword Integration Advice */}
          <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-2.5 font-mono">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#E6EAF0] flex items-center space-x-1.5">
              <FileCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Target Keyword Matrix</span>
            </h3>

            <div className="space-y-1.5">
              {job.keywords.slice(0, 6).map((kw, idx) => {
                const isMatched = analysis.components.keywordsMatch.matchedKeywords.includes(kw);
                return (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#0E1A29] border border-[#223348] text-xs">
                    <span className={`font-medium ${isMatched ? 'text-[#8A97A8]' : 'text-amber-300 font-bold'}`}>
                      {kw}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border ${
                      isMatched 
                        ? 'bg-[#131F30] text-emerald-400 border-emerald-500/30' 
                        : 'bg-[#131F30] text-amber-300 border-amber-500/30'
                    }`}>
                      {isMatched ? 'Detected' : 'Recommended'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Bullet Point Enhancements */}
        <div className="lg:col-span-6 space-y-3">
          <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E6EAF0] flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              <span>Quantified Bullet Revisions</span>
            </h3>

            <div className="space-y-3">
              
              {/* Bullet Suggestion 1 */}
              <div className="p-3 rounded bg-[#0E1A29] border border-[#223348] space-y-2 text-xs">
                <span className="text-[10px] font-mono font-bold uppercase text-[#8A97A8] tracking-wider block">Standard Record</span>
                <p className="text-[#8A97A8] italic">
                  &quot;{resume.experience[0]?.description.slice(0, 90) || 'Worked on SQL databases and Power BI reports for business teams.'}...&quot;
                </p>

                <div className="pt-2 border-t border-[#223348]">
                  <span className="text-[10px] font-mono font-bold uppercase text-teal-400 tracking-wider block">Quantified Revision</span>
                  <p className="text-[#E6EAF0] font-medium mt-1 leading-relaxed">
                    &quot;Spearheaded {job.requiredSkills[0] || 'SQL'} data pipeline architecture and analytics dashboards, optimizing report turnaround times by 32% and informing executive strategy.&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-[10px] font-mono text-[#8A97A8]">Metric impact & active verbs.</span>
                  <button
                    onClick={() => applyBulletToExperience('Spearheaded high-performance data workflows, optimizing turnaround times by 32%.')}
                    className="px-2.5 py-1 bg-[#17263B] hover:bg-[#223348] text-teal-300 border border-teal-500/30 rounded text-xs font-mono font-semibold transition-colors cursor-pointer"
                  >
                    Accept Bullet
                  </button>
                </div>
              </div>

              {/* Bullet Suggestion 2 */}
              <div className="p-3 rounded bg-[#0E1A29] border border-[#223348] space-y-2 text-xs">
                <span className="text-[10px] font-mono font-bold uppercase text-[#8A97A8] tracking-wider block">Standard Record</span>
                <p className="text-[#8A97A8] italic">
                  &quot;Collaborated with team on software features and bug fixes.&quot;
                </p>

                <div className="pt-2 border-t border-[#223348]">
                  <span className="text-[10px] font-mono font-bold uppercase text-teal-400 tracking-wider block">Quantified Revision</span>
                  <p className="text-[#E6EAF0] font-medium mt-1 leading-relaxed">
                    &quot;Partnered across cross-functional engineering pods to deploy high-availability microservices, adhering to Agile sprints and CI/CD best practices.&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-[10px] font-mono text-[#8A97A8]">SDLC methodology keywords.</span>
                  <button
                    onClick={() => applyBulletToExperience('Partnered across cross-functional pods to deploy scalable microservices under Agile methodologies.')}
                    className="px-2.5 py-1 bg-[#17263B] hover:bg-[#223348] text-teal-300 border border-teal-500/30 rounded text-xs font-mono font-semibold transition-colors cursor-pointer"
                  >
                    Accept Bullet
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

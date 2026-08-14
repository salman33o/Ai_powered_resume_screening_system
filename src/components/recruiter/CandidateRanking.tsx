import React, { useState, useMemo } from 'react';
import { 
  PipelineCandidate, 
  JobRequirement, 
  ScoringWeights 
} from '../../types';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  CheckCircle2, 
  Users, 
  Eye, 
  Layers, 
  Filter, 
  TrendingUp, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { evaluateResumeAgainstJob } from '../../lib/atsEngine';

interface CandidateRankingProps {
  candidates: PipelineCandidate[];
  activeJob: JobRequirement;
  onSelectCandidate: (candidate: PipelineCandidate) => void;
  onOpenComparison: (selected: PipelineCandidate[]) => void;
  onOpenAudit: () => void;
}

export const CandidateRanking: React.FC<CandidateRankingProps> = ({
  candidates,
  activeJob,
  onSelectCandidate,
  onOpenComparison,
  onOpenAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(0);
  const [showSliders, setShowSliders] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Recruiter Custom Weight Adjustments
  const [customWeights, setCustomWeights] = useState<ScoringWeights>({
    skillsMatch: 35,
    experienceMatch: 20,
    responsibilitiesMatch: 15,
    projectsMatch: 12,
    educationMatch: 8,
    keywordsMatch: 6,
    certificationsMatch: 4,
  });

  const resetWeights = () => {
    setCustomWeights({
      skillsMatch: 35,
      experienceMatch: 20,
      responsibilitiesMatch: 15,
      projectsMatch: 12,
      educationMatch: 8,
      keywordsMatch: 6,
      certificationsMatch: 4,
    });
  };

  // Dynamically recompute scores and re-rank candidates based on active recruiter sliders!
  const rankedCandidates = useMemo(() => {
    const scored = candidates.map(c => {
      const liveATS = evaluateResumeAgainstJob(c.resume, activeJob, customWeights);
      return {
        ...c,
        atsScore: liveATS,
      };
    });

    return scored
      .filter(c => {
        const matchesSearch = c.resume.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.resume.skills.technical.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStage = selectedStage === 'all' || c.stage === selectedStage;
        const matchesScore = c.atsScore.overallScore >= minScore;
        return matchesSearch && matchesStage && matchesScore;
      })
      .sort((a, b) => b.atsScore.overallScore - a.atsScore.overallScore);
  }, [candidates, activeJob, customWeights, searchTerm, selectedStage, minScore]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length >= 4) return;
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleLaunchComparison = () => {
    const list = rankedCandidates.filter(c => selectedIds.includes(c.id));
    onOpenComparison(list);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Candidate Ranking Matrix</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {rankedCandidates.length} Matched Profiles
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Dynamic Candidate Ranking for {activeJob.title}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time multi-dimensional scoring. Adjust weights below to re-rank candidate pool instantly based on team hiring priorities.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowSliders(!showSliders)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 border transition-all ${
              showSliders
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showSliders ? 'Hide Weight Sliders' : 'Adjust Scoring Weights'}</span>
          </button>

          {selectedIds.length >= 2 && (
            <button
              onClick={handleLaunchComparison}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-cyan-600/20"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Compare ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Recruiter Weight Customizer Sliders Panel */}
      {showSliders && (
        <div className="bg-slate-900/95 rounded-2xl p-5 border border-indigo-500/30 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Live Re-Ranking Weight Coefficients
              </h3>
            </div>
            <button
              onClick={resetWeights}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            
            {/* Skills */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex justify-between font-semibold text-slate-300 mb-1.5">
                <span>Skills Match</span>
                <span className="text-indigo-400 font-bold">{customWeights.skillsMatch}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                value={customWeights.skillsMatch}
                onChange={(e) => setCustomWeights({ ...customWeights, skillsMatch: Number(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Experience */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex justify-between font-semibold text-slate-300 mb-1.5">
                <span>Experience Match</span>
                <span className="text-blue-400 font-bold">{customWeights.experienceMatch}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={customWeights.experienceMatch}
                onChange={(e) => setCustomWeights({ ...customWeights, experienceMatch: Number(e.target.value) })}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Responsibilities */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex justify-between font-semibold text-slate-300 mb-1.5">
                <span>Responsibilities</span>
                <span className="text-cyan-400 font-bold">{customWeights.responsibilitiesMatch}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={customWeights.responsibilitiesMatch}
                onChange={(e) => setCustomWeights({ ...customWeights, responsibilitiesMatch: Number(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Projects */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex justify-between font-semibold text-slate-300 mb-1.5">
                <span>Projects Portfolio</span>
                <span className="text-purple-400 font-bold">{customWeights.projectsMatch}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={customWeights.projectsMatch}
                onChange={(e) => setCustomWeights({ ...customWeights, projectsMatch: Number(e.target.value) })}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate by name or skill (e.g. SQL, Python, Tableau)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            aria-label="Filter by Pipeline Stage"
            className="bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none"
          >
            <option value="all">All Stages</option>
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
          </select>

          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            aria-label="Filter by Minimum ATS Score"
            className="bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none"
          >
            <option value={0}>Any Score</option>
            <option value={70}>70%+ Match</option>
            <option value={80}>80%+ High Fit</option>
            <option value={90}>90%+ Top Tier</option>
          </select>
        </div>
      </div>

      {/* Ranked Candidate Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5 w-10 text-center">Select</th>
                <th className="p-3.5 font-semibold">Rank & Candidate</th>
                <th className="p-3.5 font-semibold">Overall ATS</th>
                <th className="p-3.5 font-semibold">Skills ({customWeights.skillsMatch}%)</th>
                <th className="p-3.5 font-semibold">Experience ({customWeights.experienceMatch}%)</th>
                <th className="p-3.5 font-semibold">Confidence</th>
                <th className="p-3.5 font-semibold">Stage</th>
                <th className="p-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rankedCandidates.map((c, idx) => {
                const isChecked = selectedIds.includes(c.id);
                return (
                  <tr 
                    key={c.id} 
                    className={`hover:bg-slate-800/30 transition-colors ${isChecked ? 'bg-indigo-950/20' : ''}`}
                  >
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(c.id)}
                        className="rounded accent-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-extrabold text-slate-400 text-xs w-6">#{idx + 1}</span>
                        <div>
                          <p className="font-bold text-white text-xs">{c.resume.fullName}</p>
                          <p className="text-[11px] text-slate-400">{c.resume.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                        c.atsScore.overallScore >= 80 
                          ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' 
                          : 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                      }`}>
                        {c.atsScore.overallScore}%
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {c.atsScore.components.skillsMatch.score}% ({c.atsScore.components.skillsMatch.matched.length} matched)
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {c.atsScore.components.experienceMatch.score}% (~{c.atsScore.components.experienceMatch.candidateYears} yrs)
                    </td>
                    <td className="p-3.5 text-cyan-400 font-semibold">
                      {c.atsScore.confidenceScore}%
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {c.stage}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => onSelectCandidate(c)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        Inspect Audit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

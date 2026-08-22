import React, { useState, useMemo } from 'react';
import { 
  JobRequirement, 
  PipelineCandidate, 
  StructuredResume 
} from '../../types';
import { 
  Users, 
  SlidersHorizontal, 
  RotateCcw, 
  Search, 
  ArrowUpDown, 
  ChevronRight, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';

interface CandidateRankingProps {
  candidates: PipelineCandidate[];
  activeJob: JobRequirement;
  onSelectCandidate: (candidate: PipelineCandidate) => void;
  onOpenComparison?: (candidates: PipelineCandidate[]) => void;
  onOpenAudit?: () => void;
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

  // Recruiter customizable scoring weights
  const [customWeights, setCustomWeights] = useState({
    skillsMatch: 35,
    experienceMatch: 25,
    responsibilitiesMatch: 15,
    projectsMatch: 15,
    educationMatch: 10
  });

  const resetWeights = () => {
    setCustomWeights({
      skillsMatch: 35,
      experienceMatch: 25,
      responsibilitiesMatch: 15,
      projectsMatch: 15,
      educationMatch: 10
    });
  };

  // Re-calculate weighted score dynamically
  const rankedCandidates = useMemo(() => {
    const totalWeight = 
      customWeights.skillsMatch + 
      customWeights.experienceMatch + 
      customWeights.responsibilitiesMatch + 
      customWeights.projectsMatch + 
      customWeights.educationMatch || 100;

    return candidates
      .map(c => {
        const comps = c.atsScore.components;
        const dynamicScore = Math.round(
          (comps.skillsMatch.score * customWeights.skillsMatch +
           comps.experienceMatch.score * customWeights.experienceMatch +
           comps.responsibilitiesMatch.score * customWeights.responsibilitiesMatch +
           comps.projectsMatch.score * customWeights.projectsMatch +
           comps.educationMatch.score * customWeights.educationMatch) / totalWeight
        );

        return {
          ...c,
          dynamicScore
        };
      })
      .filter(c => {
        const matchSearch = 
          c.resume.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.resume.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchStage = selectedStage === 'all' || c.stage === selectedStage;
        const matchScore = c.dynamicScore >= minScore;

        return matchSearch && matchStage && matchScore;
      })
      .sort((a, b) => b.dynamicScore - a.dynamicScore);
  }, [candidates, customWeights, searchTerm, selectedStage, minScore]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleLaunchComparison = () => {
    if (!onOpenComparison) return;
    const selected = candidates.filter(c => selectedIds.includes(c.id));
    onOpenComparison(selected);
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Ranking Matrix</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
              {rankedCandidates.length} Candidates Evaluated
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
            Dynamic Candidate Ranking Matrix — {activeJob.title}
          </h2>
          <p className="text-xs text-[#8A97A8] mt-0.5">
            Multi-dimensional scoring index. Adjust coefficient sliders to re-calculate rank order in real time.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSliders(!showSliders)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center space-x-1.5 border transition-colors cursor-pointer ${
              showSliders
                ? 'bg-[#17263B] border-teal-500/40 text-teal-300'
                : 'bg-[#0E1A29] border-[#223348] text-[#8A97A8] hover:text-[#E6EAF0]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
            <span>{showSliders ? 'Hide Weights' : 'Adjust Weights'}</span>
          </button>

          {selectedIds.length >= 2 && (
            <button
              onClick={handleLaunchComparison}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded text-xs font-bold font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Compare ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Recruiter Weight Customizer Sliders Panel */}
      {showSliders && (
        <div className="bg-[#131F30] rounded-lg p-4 border border-teal-500/30 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-[#223348] pb-2">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#E6EAF0]">
                Deterministic Formula Weight Coefficients
              </h3>
            </div>
            <button
              onClick={resetWeights}
              className="text-[10px] text-[#8A97A8] hover:text-[#E6EAF0] flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
            
            {/* Skills */}
            <div className="p-2.5 bg-[#0E1A29] rounded border border-[#223348]">
              <div className="flex justify-between font-semibold text-[#8A97A8] mb-1">
                <span>Skills Match</span>
                <span className="text-teal-400 font-bold">{customWeights.skillsMatch}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                value={customWeights.skillsMatch}
                onChange={(e) => setCustomWeights({ ...customWeights, skillsMatch: Number(e.target.value) })}
                className="w-full accent-teal-500 cursor-pointer h-1.5 bg-[#131F30]"
              />
            </div>

            {/* Experience */}
            <div className="p-2.5 bg-[#0E1A29] rounded border border-[#223348]">
              <div className="flex justify-between font-semibold text-[#8A97A8] mb-1">
                <span>Experience</span>
                <span className="text-teal-400 font-bold">{customWeights.experienceMatch}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={customWeights.experienceMatch}
                onChange={(e) => setCustomWeights({ ...customWeights, experienceMatch: Number(e.target.value) })}
                className="w-full accent-teal-500 cursor-pointer h-1.5 bg-[#131F30]"
              />
            </div>

            {/* Responsibilities */}
            <div className="p-2.5 bg-[#0E1A29] rounded border border-[#223348]">
              <div className="flex justify-between font-semibold text-[#8A97A8] mb-1">
                <span>Responsibilities</span>
                <span className="text-teal-400 font-bold">{customWeights.responsibilitiesMatch}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={customWeights.responsibilitiesMatch}
                onChange={(e) => setCustomWeights({ ...customWeights, responsibilitiesMatch: Number(e.target.value) })}
                className="w-full accent-teal-500 cursor-pointer h-1.5 bg-[#131F30]"
              />
            </div>

            {/* Projects */}
            <div className="p-2.5 bg-[#0E1A29] rounded border border-[#223348]">
              <div className="flex justify-between font-semibold text-[#8A97A8] mb-1">
                <span>Projects Portfolio</span>
                <span className="text-teal-400 font-bold">{customWeights.projectsMatch}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={customWeights.projectsMatch}
                onChange={(e) => setCustomWeights({ ...customWeights, projectsMatch: Number(e.target.value) })}
                className="w-full accent-teal-500 cursor-pointer h-1.5 bg-[#131F30]"
              />
            </div>

          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-[#8A97A8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter candidates by name or technical keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0E1A29] rounded border border-[#223348] text-xs text-[#E6EAF0] placeholder-[#5B6B80] focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto font-mono">
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            aria-label="Filter by Pipeline Stage"
            className="bg-[#0E1A29] text-xs text-[#E6EAF0] px-2.5 py-1.5 rounded border border-[#223348] focus:outline-none focus:border-teal-500 cursor-pointer"
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
            className="bg-[#0E1A29] text-xs text-[#E6EAF0] px-2.5 py-1.5 rounded border border-[#223348] focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value={0}>Any Score</option>
            <option value={70}>70%+ Match</option>
            <option value={80}>80%+ High Fit</option>
            <option value={90}>90%+ Top Tier</option>
          </select>
        </div>
      </div>

      {/* Ranked Candidate Table */}
      <div className="bg-[#131F30] rounded-lg border border-[#223348] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0E1A29] border-b border-[#223348] text-[#8A97A8] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3 w-10 text-center">Sel</th>
                <th className="p-3 font-semibold">Rank & Candidate</th>
                <th className="p-3 font-semibold">Weighted Score</th>
                <th className="p-3 font-semibold">Skills ({customWeights.skillsMatch}%)</th>
                <th className="p-3 font-semibold">Exp ({customWeights.experienceMatch}%)</th>
                <th className="p-3 font-semibold">Confidence</th>
                <th className="p-3 font-semibold">Stage</th>
                <th className="p-3 font-semibold text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#192738]">
              {rankedCandidates.map((c, idx) => {
                const isChecked = selectedIds.includes(c.id);
                return (
                  <tr 
                    key={c.id} 
                    className={`hover:bg-[#0E1A29] transition-colors ${isChecked ? 'bg-[#17263B]' : ''}`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(c.id)}
                        className="rounded accent-teal-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-sans">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[#8A97A8] text-xs w-6">#{idx + 1}</span>
                        <div>
                          <p className="font-bold text-[#E6EAF0] text-xs">{c.resume.fullName}</p>
                          <p className="text-[10px] font-mono text-[#8A97A8]">{c.resume.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-bold border ${
                        c.dynamicScore >= 80 
                          ? 'text-emerald-400 border-emerald-500/30 bg-[#0E1A29]' 
                          : 'text-teal-400 border-teal-500/30 bg-[#0E1A29]'
                      }`}>
                        {c.dynamicScore}%
                      </span>
                    </td>
                    <td className="p-3 text-[#8A97A8]">
                      {c.atsScore.components.skillsMatch.score}% ({c.atsScore.components.skillsMatch.matched.length} matched)
                    </td>
                    <td className="p-3 text-[#8A97A8]">
                      {c.atsScore.components.experienceMatch.score}% (~{c.atsScore.components.experienceMatch.candidateYears} yrs)
                    </td>
                    <td className="p-3 text-teal-300 font-semibold">
                      {c.atsScore.confidenceScore}%
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
                        {c.stage}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectCandidate(c)}
                        className="px-2.5 py-1 bg-[#0E1A29] hover:bg-[#17263B] text-[#E6EAF0] rounded text-xs font-medium border border-[#223348] transition-colors cursor-pointer"
                      >
                        Inspect
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

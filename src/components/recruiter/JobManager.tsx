import React, { useState } from 'react';
import { JobRequirement } from '../../types';
import { 
  Briefcase, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Save, 
  DollarSign, 
  MapPin, 
  Clock, 
  Layers,
  GraduationCap,
  Award,
  Sliders,
  ListChecks,
  Tag
} from 'lucide-react';

interface JobManagerProps {
  jobs: JobRequirement[];
  setJobs: React.Dispatch<React.SetStateAction<JobRequirement[]>>;
  selectedJob: JobRequirement;
  setSelectedJob: (job: JobRequirement) => void;
  onJobChanged: () => void;
}

export const JobManager: React.FC<JobManagerProps> = ({
  jobs,
  setJobs,
  selectedJob,
  setSelectedJob,
  onJobChanged
}) => {
  const [editJob, setEditJob] = useState<JobRequirement>(selectedJob);
  const [newRequiredSkill, setNewRequiredSkill] = useState('');
  const [newPreferredSkill, setNewPreferredSkill] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newCert, setNewCert] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'competencies' | 'responsibilities' | 'weights'>('overview');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setJobs(prev => prev.map(j => j.id === editJob.id ? editJob : j));
    setSelectedJob(editJob);
    setSavedSuccess(true);
    onJobChanged();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateNewJob = () => {
    const newJ: JobRequirement = {
      id: `job-${Date.now()}`,
      title: 'New Position Architect Requisition',
      company: 'Enterprise Dynamics Inc',
      department: 'Engineering & Technology',
      location: 'San Francisco, CA (Hybrid)',
      type: 'Full-time',
      seniority: 'Mid',
      minExperienceYears: 3,
      salaryRange: '$120,000 - $155,000',
      summary: 'Define high-level position objectives, required engineering standards, and team deliverables.',
      responsibilities: [
        'Drive architectural design and development of scalable systems',
        'Collaborate with cross-functional product and operations stakeholders',
        'Maintain high test coverage, code documentation, and CI/CD releases'
      ],
      requiredSkills: ['Core Competency 1', 'Core Competency 2', 'Problem Solving'],
      preferredSkills: ['Secondary Tool 1', 'Secondary Tool 2'],
      educationRequirement: "Bachelor's degree in relevant discipline or equivalent experience",
      requiredCertifications: [],
      keywords: ['Core Skill', 'Architecture', 'Teamwork', 'Agile'],
      scoringWeights: {
        skillsMatch: 35,
        experienceMatch: 25,
        responsibilitiesMatch: 20,
        projectsMatch: 10,
        educationMatch: 5,
        keywordsMatch: 3,
        certificationsMatch: 2
      },
      published: true,
      createdAt: new Date().toISOString(),
      applicationsCount: 0
    };
    setJobs([newJ, ...jobs]);
    setSelectedJob(newJ);
    setEditJob(newJ);
  };

  const weightsSum = Object.values(editJob.scoringWeights || {}).reduce((a: number, b) => a + Number(b || 0), 0);

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Position Architecture & Criteria</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
              {jobs.length} Active Positions
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
            Job Requisition Architect & ATS Screening Rules
          </h2>
          <p className="text-xs text-[#8A97A8] mt-0.5">
            Configure full requisition specifications, mandatory technical competencies, education thresholds, and deterministic ATS weighting coefficients.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreateNewJob}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded text-xs font-bold font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Requisition</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-2.5 rounded bg-[#0E1A29] border border-teal-500/40 text-xs font-mono text-teal-300 flex items-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
          <span>Position specifications and ATS scoring rules saved successfully.</span>
        </div>
      )}

      {/* Main Grid: Job Catalog vs Deep Requisition Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 4 Cols: Openings Selector */}
        <div className="lg:col-span-4 space-y-2.5">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A97A8]">Position Catalog</h3>
          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {jobs.map((job) => {
              const isSelected = job.id === editJob.id;
              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setEditJob(job);
                    onJobChanged();
                  }}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-[#17263B] border-teal-500/50' 
                      : 'bg-[#131F30] border-[#223348] hover:border-[#334A66]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#E6EAF0] text-xs font-display">{job.title}</span>
                    {isSelected && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#0E1A29] text-teal-400 border border-teal-500/30">
                        Editing
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-[#8A97A8] mt-0.5">{job.company} • {job.department || 'General'}</p>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-teal-400 mt-1">
                    <span>{job.minExperienceYears}+ Yrs</span>
                    <span>•</span>
                    <span>{job.salaryRange}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5 font-mono">
                    {job.requiredSkills.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
                        {s}
                      </span>
                    ))}
                    {job.requiredSkills.length > 3 && (
                      <span className="text-[9px] text-[#8A97A8]">+{job.requiredSkills.length - 3}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Job Editor Form */}
        <div className="lg:col-span-8">
          <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3.5 text-xs">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#223348] pb-3 gap-2">
              <div>
                <h3 className="font-bold text-[#E6EAF0] text-sm font-display">{editJob.title}</h3>
                <p className="text-[#8A97A8] font-mono text-[11px]">{editJob.company} • {editJob.department}</p>
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold font-mono rounded flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Requisition Specs</span>
              </button>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#0E1A29] rounded border border-[#223348] font-mono">
              {[
                { id: 'overview', label: 'Overview & Comp', icon: Briefcase },
                { id: 'competencies', label: 'Competencies', icon: Layers },
                { id: 'responsibilities', label: 'Responsibilities', icon: ListChecks },
                { id: 'weights', label: 'ATS Weights', icon: Sliders },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-2 py-1.5 rounded text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-teal-600 text-slate-950 font-bold'
                        : 'text-[#8A97A8] hover:text-[#E6EAF0]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: OVERVIEW & COMPENSATION */}
            {activeTab === 'overview' && (
              <div className="space-y-3 font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[#8A97A8] text-[10px] mb-1 font-bold">Position Title *</label>
                    <input
                      type="text"
                      value={editJob.title}
                      onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                      className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 font-sans text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8A97A8] text-[10px] mb-1 font-bold">Hiring Company / Entity *</label>
                    <input
                      type="text"
                      value={editJob.company}
                      onChange={(e) => setEditJob({ ...editJob, company: e.target.value })}
                      className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 font-sans text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[#8A97A8] text-[10px] mb-1 font-bold">Industry Sector / Dept</label>
                    <input
                      type="text"
                      value={editJob.department || ''}
                      onChange={(e) => setEditJob({ ...editJob, department: e.target.value })}
                      placeholder="e.g. Electrical & Power / AgTech / AI"
                      className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8A97A8] text-[10px] mb-1 font-bold">Seniority Level</label>
                    <select
                      value={editJob.seniority}
                      onChange={(e) => setEditJob({ ...editJob, seniority: e.target.value as any })}
                      className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 text-xs cursor-pointer"
                    >
                      <option value="Entry">Entry Level</option>
                      <option value="Mid">Mid Level</option>
                      <option value="Senior">Senior Level</option>
                      <option value="Lead">Lead / Principal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#8A97A8] text-[10px] mb-1 font-bold">Min Experience (Yrs)</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={editJob.minExperienceYears}
                      onChange={(e) => setEditJob({ ...editJob, minExperienceYears: Number(e.target.value) })}
                      className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[#8A97A8] text-[10px] mb-1 font-bold">Location & Work Model</label>
                    <input
                      type="text"
                      value={editJob.location}
                      onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA (Hybrid)"
                      className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8A97A8] text-[10px] mb-1 font-bold">Salary Range / Compensation</label>
                    <input
                      type="text"
                      value={editJob.salaryRange}
                      onChange={(e) => setEditJob({ ...editJob, salaryRange: e.target.value })}
                      placeholder="e.g. $135,000 - $165,000"
                      className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#8A97A8] text-[10px] mb-1 font-bold">Executive Role Summary</label>
                  <textarea
                    rows={3}
                    value={editJob.summary}
                    onChange={(e) => setEditJob({ ...editJob, summary: e.target.value })}
                    placeholder="Provide a concise description of the team mission and core deliverables..."
                    className="w-full bg-[#0E1A29] p-2.5 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 resize-none text-xs font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[#8A97A8] text-[10px] mb-1 font-bold">Minimum Education Requirement</label>
                  <input
                    type="text"
                    value={editJob.educationRequirement}
                    onChange={(e) => setEditJob({ ...editJob, educationRequirement: e.target.value })}
                    placeholder="e.g. Bachelor's in Engineering, Computer Science, or Agronomy"
                    className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 text-xs font-sans"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: COMPETENCIES & CERTIFICATIONS */}
            {activeTab === 'competencies' && (
              <div className="space-y-4 font-mono">
                {/* Mandatory Skills */}
                <div className="space-y-1.5">
                  <label className="block text-[#8A97A8] text-[10px] font-bold">
                    Mandatory Required Skills (Evaluated under Skills Match) *
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-[#0E1A29] rounded border border-[#223348] min-h-[42px]">
                    {editJob.requiredSkills.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#131F30] border border-teal-500/40 text-teal-300 flex items-center space-x-1 text-[11px]">
                        <span>{sk}</span>
                        <button
                          onClick={() => setEditJob({
                            ...editJob,
                            requiredSkills: editJob.requiredSkills.filter((_, i) => i !== idx)
                          })}
                          className="text-rose-400 hover:text-rose-300 font-bold ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add mandatory skill (e.g. SQL, MATLAB, Power Systems)..."
                      value={newRequiredSkill}
                      onChange={(e) => setNewRequiredSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newRequiredSkill.trim()) {
                          e.preventDefault();
                          setEditJob({
                            ...editJob,
                            requiredSkills: [...editJob.requiredSkills, newRequiredSkill.trim()]
                          });
                          setNewRequiredSkill('');
                        }
                      }}
                      className="flex-1 bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] text-xs font-sans"
                    />
                    <button
                      onClick={() => {
                        if (newRequiredSkill.trim()) {
                          setEditJob({
                            ...editJob,
                            requiredSkills: [...editJob.requiredSkills, newRequiredSkill.trim()]
                          });
                          setNewRequiredSkill('');
                        }
                      }}
                      className="px-3.5 py-2 bg-teal-600 text-slate-950 font-bold rounded text-xs cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Preferred Secondary Skills */}
                <div className="space-y-1.5">
                  <label className="block text-[#8A97A8] text-[10px] font-bold">
                    Preferred Secondary Skills & Frameworks
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-[#0E1A29] rounded border border-[#223348] min-h-[42px]">
                    {editJob.preferredSkills.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#131F30] border border-[#223348] text-[#A2B1C2] flex items-center space-x-1 text-[11px]">
                        <span>{sk}</span>
                        <button
                          onClick={() => setEditJob({
                            ...editJob,
                            preferredSkills: editJob.preferredSkills.filter((_, i) => i !== idx)
                          })}
                          className="text-rose-400 hover:text-rose-300 font-bold ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add preferred skill (e.g. Docker, QGIS, Altium)..."
                      value={newPreferredSkill}
                      onChange={(e) => setNewPreferredSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newPreferredSkill.trim()) {
                          e.preventDefault();
                          setEditJob({
                            ...editJob,
                            preferredSkills: [...editJob.preferredSkills, newPreferredSkill.trim()]
                          });
                          setNewPreferredSkill('');
                        }
                      }}
                      className="flex-1 bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] text-xs font-sans"
                    />
                    <button
                      onClick={() => {
                        if (newPreferredSkill.trim()) {
                          setEditJob({
                            ...editJob,
                            preferredSkills: [...editJob.preferredSkills, newPreferredSkill.trim()]
                          });
                          setNewPreferredSkill('');
                        }
                      }}
                      className="px-3.5 py-2 bg-[#17263B] text-[#E6EAF0] border border-[#223348] font-bold rounded text-xs cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Required Certifications */}
                <div className="space-y-1.5">
                  <label className="block text-[#8A97A8] text-[10px] font-bold">
                    Required Professional Certifications & Accreditations
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-[#0E1A29] rounded border border-[#223348] min-h-[42px]">
                    {editJob.requiredCertifications.map((cert, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#131F30] border border-amber-500/40 text-amber-300 flex items-center space-x-1 text-[11px]">
                        <span>{cert}</span>
                        <button
                          onClick={() => setEditJob({
                            ...editJob,
                            requiredCertifications: editJob.requiredCertifications.filter((_, i) => i !== idx)
                          })}
                          className="text-rose-400 hover:text-rose-300 font-bold ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add certification (e.g. Certified Crop Adviser, PE License, AWS Pro)..."
                      value={newCert}
                      onChange={(e) => setNewCert(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newCert.trim()) {
                          e.preventDefault();
                          setEditJob({
                            ...editJob,
                            requiredCertifications: [...editJob.requiredCertifications, newCert.trim()]
                          });
                          setNewCert('');
                        }
                      }}
                      className="flex-1 bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] text-xs font-sans"
                    />
                    <button
                      onClick={() => {
                        if (newCert.trim()) {
                          setEditJob({
                            ...editJob,
                            requiredCertifications: [...editJob.requiredCertifications, newCert.trim()]
                          });
                          setNewCert('');
                        }
                      }}
                      className="px-3.5 py-2 bg-[#17263B] text-amber-300 border border-amber-600/40 font-bold rounded text-xs cursor-pointer"
                    >
                      Add Cert
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: RESPONSIBILITIES */}
            {activeTab === 'responsibilities' && (
              <div className="space-y-3 font-mono">
                <label className="block text-[#8A97A8] text-[10px] font-bold">
                  Core Role Responsibilities & Deliverables ({editJob.responsibilities.length})
                </label>
                <div className="space-y-2">
                  {editJob.responsibilities.map((resp, idx) => (
                    <div key={idx} className="p-2.5 bg-[#0E1A29] rounded border border-[#223348] flex items-start justify-between gap-2">
                      <div className="flex items-start space-x-2">
                        <span className="text-teal-400 font-bold text-xs">{idx + 1}.</span>
                        <p className="text-xs text-[#E6EAF0] font-sans leading-relaxed">{resp}</p>
                      </div>
                      <button
                        onClick={() => setEditJob({
                          ...editJob,
                          responsibilities: editJob.responsibilities.filter((_, i) => i !== idx)
                        })}
                        className="text-rose-400 hover:text-rose-300 shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add detailed responsibility..."
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newResponsibility.trim()) {
                        e.preventDefault();
                        setEditJob({
                          ...editJob,
                          responsibilities: [...editJob.responsibilities, newResponsibility.trim()]
                        });
                        setNewResponsibility('');
                      }
                    }}
                    className="flex-1 bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] text-xs font-sans"
                  />
                  <button
                    onClick={() => {
                      if (newResponsibility.trim()) {
                        setEditJob({
                          ...editJob,
                          responsibilities: [...editJob.responsibilities, newResponsibility.trim()]
                        });
                        setNewResponsibility('');
                      }
                    }}
                    className="px-3.5 py-2 bg-teal-600 text-slate-950 font-bold rounded text-xs cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: DETERMINISTIC ATS WEIGHTS */}
            {activeTab === 'weights' && (
              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-[#223348]">
                  <span className="text-[10px] text-[#8A97A8] font-bold uppercase">7-Factor ATS Weight Allocation</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    weightsSum === 100 
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-amber-950/40 text-amber-300 border border-amber-500/40'
                  }`}>
                    Total: {weightsSum}% (Target: 100%)
                  </span>
                </div>

                {[
                  { key: 'skillsMatch', label: 'Technical Skills Match', desc: 'Direct keyword overlap and mandatory stack verification' },
                  { key: 'experienceMatch', label: 'Experience Depth Match', desc: 'Candidate career years vs minimum experience specification' },
                  { key: 'responsibilitiesMatch', label: 'Responsibilities Context', desc: 'Semantic role alignment and accomplishment density' },
                  { key: 'projectsMatch', label: 'Project Evidence', desc: 'Real-world project artifacts and architecture portfolios' },
                  { key: 'educationMatch', label: 'Education Qualification', desc: 'Degree level and relevant academic field match' },
                  { key: 'keywordsMatch', label: 'Domain Keyword Density', desc: 'Industry terminology and specialized nomenclature' },
                  { key: 'certificationsMatch', label: 'Certifications & Accreditations', desc: 'Active professional licenses and verified credentials' },
                ].map(item => {
                  const val = (editJob.scoringWeights as any)[item.key] || 0;
                  return (
                    <div key={item.key} className="p-2.5 bg-[#0E1A29] rounded border border-[#223348] space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#E6EAF0]">{item.label}</span>
                        <span className="font-bold text-teal-400">{val}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={60}
                        value={val}
                        onChange={(e) => {
                          const updatedWeights = {
                            ...editJob.scoringWeights,
                            [item.key]: Number(e.target.value)
                          };
                          setEditJob({ ...editJob, scoringWeights: updatedWeights as any });
                        }}
                        className="w-full h-1.5 bg-[#17263B] rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                      <p className="text-[10px] text-[#8A97A8]">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

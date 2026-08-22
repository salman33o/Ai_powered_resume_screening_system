import React, { useState } from 'react';
import { JobRequirement } from '../../types';
import { 
  Briefcase, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Edit, 
  Save, 
  DollarSign, 
  MapPin, 
  Clock, 
  Layers 
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
  const [isEditing, setIsEditing] = useState(false);
  const [editJob, setEditJob] = useState<JobRequirement>(selectedJob);
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleSave = () => {
    setJobs(prev => prev.map(j => j.id === editJob.id ? editJob : j));
    setSelectedJob(editJob);
    setIsEditing(false);
    onJobChanged();
  };

  const handleCreateNewJob = () => {
    const newJ: JobRequirement = {
      id: `job-${Date.now()}`,
      title: 'Full Stack AI Engineer',
      company: 'TechCorp Labs',
      department: 'Engineering',
      location: 'San Francisco, CA (Hybrid)',
      type: 'Full-time',
      seniority: 'Mid',
      minExperienceYears: 3,
      salaryRange: '$130,000 - $175,000',
      summary: 'Looking for an AI-native full stack developer with strong React, Node.js, and GenAI integration experience.',
      responsibilities: [
        'Architect high-throughput AI agent microservices',
        'Develop responsive web interfaces with modern TypeScript',
        'Optimize database queries and background job workers'
      ],
      requiredSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Python'],
      preferredSkills: ['Docker', 'Tailwind CSS', 'FastAPI'],
      educationRequirement: "Bachelor's in Computer Science or equivalent",
      requiredCertifications: [],
      keywords: ['full stack', 'react', 'node.js', 'typescript', 'gemini', 'postgres'],
      scoringWeights: {
        skillsMatch: 35,
        experienceMatch: 20,
        responsibilitiesMatch: 15,
        projectsMatch: 12,
        educationMatch: 8,
        keywordsMatch: 6,
        certificationsMatch: 4
      },
      published: true,
      createdAt: new Date().toISOString(),
      applicationsCount: 0
    };
    setJobs([newJ, ...jobs]);
    setSelectedJob(newJ);
    setEditJob(newJ);
    setIsEditing(true);
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Position Architecture</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
              {jobs.length} Active Positions
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
            Job Requisitions & Evaluation Criteria
          </h2>
          <p className="text-xs text-[#8A97A8] mt-0.5">
            Define mandatory competencies, responsibilities, and deterministic weighting rules for automated screening.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreateNewJob}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded text-xs font-bold font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Position</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Job Cards vs Active Job Detail Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 4 Cols: Openings Selector */}
        <div className="lg:col-span-4 space-y-2.5">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A97A8]">Position Catalog</h3>
          {jobs.map((job) => {
            const isSelected = job.id === selectedJob.id;
            return (
              <div
                key={job.id}
                onClick={() => {
                  setSelectedJob(job);
                  setEditJob(job);
                  setIsEditing(false);
                  onJobChanged();
                }}
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  isSelected 
                    ? 'bg-[#17263B] border-teal-500/40' 
                    : 'bg-[#131F30] border-[#223348] hover:border-[#334A66]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#E6EAF0] text-xs font-display">{job.title}</span>
                  {isSelected && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#0E1A29] text-teal-400 border border-teal-500/30">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-mono text-[#8A97A8] mt-0.5">{job.company} • {job.location}</p>
                <div className="flex flex-wrap gap-1 mt-1.5 font-mono">
                  {job.requiredSkills.slice(0, 3).map((s, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 8 Cols: Job Editor Form */}
        <div className="lg:col-span-8">
          <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-[#223348] pb-2.5">
              <div>
                <h3 className="font-bold text-[#E6EAF0] text-sm font-display">{editJob.title}</h3>
                <p className="text-[#8A97A8] font-mono text-[11px]">{editJob.company} • {editJob.department}</p>
              </div>
              <button
                onClick={handleSave}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold font-mono rounded flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Criteria</span>
              </button>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-2 gap-2.5 font-mono">
              <div>
                <label className="block text-[#8A97A8] text-[10px] mb-1">Position Title</label>
                <input
                  type="text"
                  value={editJob.title}
                  onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                  className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 font-sans text-xs"
                />
              </div>
              <div>
                <label className="block text-[#8A97A8] text-[10px] mb-1">Company Legal Entity</label>
                <input
                  type="text"
                  value={editJob.company}
                  onChange={(e) => setEditJob({ ...editJob, company: e.target.value })}
                  className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 font-sans text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 font-mono">
              <div>
                <label className="block text-[#8A97A8] text-[10px] mb-1">Min Experience (Yrs)</label>
                <input
                  type="number"
                  value={editJob.minExperienceYears}
                  onChange={(e) => setEditJob({ ...editJob, minExperienceYears: Number(e.target.value) })}
                  className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[#8A97A8] text-[10px] mb-1">Salary Range</label>
                <input
                  type="text"
                  value={editJob.salaryRange}
                  onChange={(e) => setEditJob({ ...editJob, salaryRange: e.target.value })}
                  className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-[#8A97A8] text-[10px] mb-1">Location</label>
                <input
                  type="text"
                  value={editJob.location}
                  onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
                  className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 text-xs"
                />
              </div>
            </div>

            {/* Mandatory Required Skills */}
            <div className="space-y-1.5 font-mono">
              <label className="block text-[#8A97A8] text-[10px]">
                Mandatory Required Skills (Evaluated under Skills Match)
              </label>
              <div className="flex flex-wrap gap-1">
                {editJob.requiredSkills.map((sk, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#0E1A29] border border-[#223348] text-teal-300 flex items-center space-x-1 text-[11px]">
                    <span>{sk}</span>
                    <button
                      onClick={() => setEditJob({
                        ...editJob,
                        requiredSkills: editJob.requiredSkills.filter((_, i) => i !== idx)
                      })}
                      className="text-rose-400 hover:text-rose-300 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Add skill (e.g. AWS, Snowflake, Python)..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newSkillInput.trim()) {
                      e.preventDefault();
                      setEditJob({
                        ...editJob,
                        requiredSkills: [...editJob.requiredSkills, newSkillInput.trim()]
                      });
                      setNewSkillInput('');
                    }
                  }}
                  className="flex-1 bg-[#0E1A29] p-1.5 rounded border border-[#223348] text-[#E6EAF0] placeholder-[#5B6B80] focus:outline-none text-xs"
                />
                <button
                  onClick={() => {
                    if (newSkillInput.trim()) {
                      setEditJob({
                        ...editJob,
                        requiredSkills: [...editJob.requiredSkills, newSkillInput.trim()]
                      });
                      setNewSkillInput('');
                    }
                  }}
                  className="px-3 py-1.5 bg-[#0E1A29] hover:bg-[#17263B] text-[#E6EAF0] rounded font-semibold border border-[#223348]"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Job Description Text */}
            <div>
              <label className="block text-[#8A97A8] text-[10px] font-mono mb-1">Job Specification Overview</label>
              <textarea
                rows={3}
                value={editJob.summary}
                onChange={(e) => setEditJob({ ...editJob, summary: e.target.value })}
                className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 resize-none text-xs leading-relaxed"
              />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

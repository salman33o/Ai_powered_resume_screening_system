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
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Position Architect</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {jobs.length} Active Openings
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Job Requisitions & ATS Scoring Criteria
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Configure required competencies, responsibilities, and deterministic weighting rules for automated screening.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleCreateNewJob}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Job Post</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Job Cards vs Active Job Detail Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Openings Selector */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Requisitions</h3>
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
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{job.title}</span>
                  {isSelected && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Active Target
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{job.company} • {job.location}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {job.requiredSkills.slice(0, 3).map((s, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
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
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-md text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm">{editJob.title}</h3>
                <p className="text-slate-400 text-[11px]">{editJob.company} • {editJob.department}</p>
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Job Profile</span>
              </button>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Position Title</label>
                <input
                  type="text"
                  value={editJob.title}
                  onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                  className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Company Name</label>
                <input
                  type="text"
                  value={editJob.company}
                  onChange={(e) => setEditJob({ ...editJob, company: e.target.value })}
                  className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Min Experience (Years)</label>
                <input
                  type="number"
                  value={editJob.minExperienceYears}
                  onChange={(e) => setEditJob({ ...editJob, minExperienceYears: Number(e.target.value) })}
                  className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Salary Range</label>
                <input
                  type="text"
                  value={editJob.salaryRange}
                  onChange={(e) => setEditJob({ ...editJob, salaryRange: e.target.value })}
                  className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Location</label>
                <input
                  type="text"
                  value={editJob.location}
                  onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
                  className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Mandatory Required Skills */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Mandatory Required Skills (Evaluated under Skills Match)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {editJob.requiredSkills.map((sk, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 flex items-center space-x-1.5">
                    <span>{sk}</span>
                    <button
                      onClick={() => setEditJob({
                        ...editJob,
                        requiredSkills: editJob.requiredSkills.filter((_, i) => i !== idx)
                      })}
                      className="text-rose-400 hover:text-rose-300 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add required skill (e.g. AWS, Snowflake, Tableau)..."
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
                  className="flex-1 bg-slate-950 p-2 rounded-lg border border-slate-800 text-white focus:outline-none"
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
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold border border-slate-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Job Description Text */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Full Job Overview</label>
              <textarea
                rows={3}
                value={editJob.summary}
                onChange={(e) => setEditJob({ ...editJob, summary: e.target.value })}
                className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white focus:outline-none resize-none leading-relaxed"
              />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

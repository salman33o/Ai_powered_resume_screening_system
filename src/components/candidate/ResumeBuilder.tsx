import React, { useState } from 'react';
import { StructuredResume, JobRequirement } from '../../types';
import { 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  FileText, 
  Save, 
  CheckCircle2, 
  Layers, 
  Briefcase, 
  GraduationCap, 
  Award,
  FolderGit2
} from 'lucide-react';
import { exportResumePDF } from '../../lib/pdfExport';

interface ResumeBuilderProps {
  resume: StructuredResume;
  setResume: (resume: StructuredResume) => void;
  targetJob: JobRequirement;
  onReAnalyze: () => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  resume,
  setResume,
  targetJob,
  onReAnalyze
}) => {
  const [activeSection, setActiveSection] = useState<'personal' | 'experience' | 'skills' | 'education' | 'projects' | 'certifications'>('personal');
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'minimalist' | 'executive'>('modern');
  const [savedNotice, setSavedNotice] = useState(false);

  const updateField = (field: keyof StructuredResume, value: any) => {
    const updated = { ...resume, [field]: value, updatedAt: new Date().toISOString() };
    setResume(updated);
  };

  const handleSave = () => {
    setSavedNotice(true);
    onReAnalyze();
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // Helper to add new experience
  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: 'New Company',
      jobTitle: 'Job Title',
      startDate: '2023-01',
      endDate: '2026-08',
      isCurrent: true,
      description: 'Describe core achievements, technologies utilized, and quantified business impact.',
      technologies: ['SQL', 'Python']
    };
    updateField('experience', [newExp, ...resume.experience]);
  };

  // Helper to add new project
  const addProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: 'New Key Project',
      description: 'End-to-end architecture and implementation details demonstrating relevant stack proficiency.',
      technologies: ['React', 'Node.js', 'PostgreSQL']
    };
    updateField('projects', [newProj, ...resume.projects]);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">ATS-Optimized Builder</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Template: {selectedTemplate.toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Professional Resume Builder & Exporter
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Craft high-fidelity, ATS-parseable resumes designed to pass multi-column OCR extraction filters.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Re-Score</span>
          </button>

          <button
            onClick={() => exportResumePDF(resume)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Resume saved successfully! Deterministic scoring recomputed.</span>
        </div>
      )}

      {/* Builder Layout: Left Form Editors vs Right Live ATS Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Columns: Form Editors */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Section Selector Pills */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-900 rounded-xl border border-slate-800">
            {[
              { id: 'personal', label: 'Contact', icon: FileText },
              { id: 'experience', label: 'Experience', icon: Briefcase },
              { id: 'skills', label: 'Skills', icon: Layers },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'projects', label: 'Projects', icon: FolderGit2 },
              { id: 'certifications', label: 'Certs', icon: Award },
            ].map(sec => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors ${
                    activeSection === sec.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section 1: Contact Details */}
          {activeSection === 'personal' && (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3.5 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-xs">Personal & Contact Info</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={resume.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={resume.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Phone Number</label>
                  <input
                    type="text"
                    value={resume.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Location</label>
                  <input
                    type="text"
                    value={resume.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Executive Summary</label>
                <textarea
                  rows={4}
                  value={resume.summary}
                  onChange={(e) => updateField('summary', e.target.value)}
                  className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Section 2: Work Experience */}
          {activeSection === 'experience' && (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white uppercase tracking-wider text-xs">Work History ({resume.experience.length})</h3>
                <button
                  onClick={addExperience}
                  className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-4">
                {resume.experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">Position #{idx + 1}</span>
                      <button
                        onClick={() => {
                          const updated = resume.experience.filter((_, i) => i !== idx);
                          updateField('experience', updated);
                        }}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.jobTitle}
                        onChange={(e) => {
                          const list = [...resume.experience];
                          list[idx].jobTitle = e.target.value;
                          updateField('experience', list);
                        }}
                        className="bg-slate-900 p-2 rounded border border-slate-800 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => {
                          const list = [...resume.experience];
                          list[idx].company = e.target.value;
                          updateField('experience', list);
                        }}
                        className="bg-slate-900 p-2 rounded border border-slate-800 text-white"
                      />
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Bullet points & measurable outcomes..."
                      value={exp.description}
                      onChange={(e) => {
                        const list = [...resume.experience];
                        list[idx].description = e.target.value;
                        updateField('experience', list);
                      }}
                      className="w-full bg-slate-900 p-2 rounded border border-slate-800 text-white resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Technical Skills */}
          {activeSection === 'skills' && (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-xs">Skills & Competencies</h3>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Technical Skills (Comma separated)</label>
                <input
                  type="text"
                  value={resume.skills.technical.join(', ')}
                  onChange={(e) => {
                    const skillsArr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    updateField('skills', { ...resume.skills, technical: skillsArr });
                  }}
                  className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Tools & Cloud Frameworks</label>
                <input
                  type="text"
                  value={resume.skills.tools.join(', ')}
                  onChange={(e) => {
                    const toolsArr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    updateField('skills', { ...resume.skills, tools: toolsArr });
                  }}
                  className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white"
                />
              </div>
            </div>
          )}

          {/* Section 4: Projects */}
          {activeSection === 'projects' && (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white uppercase tracking-wider text-xs">Project Portfolio ({resume.projects.length})</h3>
                <button
                  onClick={addProject}
                  className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {resume.projects.map((proj, idx) => (
                <div key={proj.id || idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) => {
                        const list = [...resume.projects];
                        list[idx].title = e.target.value;
                        updateField('projects', list);
                      }}
                      className="bg-slate-900 p-2 rounded border border-slate-800 text-white font-bold w-3/4"
                    />
                    <button
                      onClick={() => {
                        const list = resume.projects.filter((_, i) => i !== idx);
                        updateField('projects', list);
                      }}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Project description and tech stack..."
                    value={proj.description}
                    onChange={(e) => {
                      const list = [...resume.projects];
                      list[idx].description = e.target.value;
                      updateField('projects', list);
                    }}
                    className="w-full bg-slate-900 p-2 rounded border border-slate-800 text-white resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Education & Certs */}
          {(activeSection === 'education' || activeSection === 'certifications') && (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-xs">
                {activeSection === 'education' ? 'Academic History' : 'Certifications'}
              </h3>
              <p className="text-slate-400">
                Education and certified credentials directly substantiate keyword density and scoring filters.
              </p>
            </div>
          )}

        </div>

        {/* Right 6 Columns: Clean ATS Document Preview (White Sheet Look) */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-slate-200">ATS Parsing Viewport</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Standard Single-Column Flow
                </span>
              </div>
            </div>

            {/* Document Paper Canvas */}
            <div className="bg-white text-slate-900 p-6 rounded-xl shadow-2xl font-sans min-h-[580px] text-[11px] leading-relaxed select-text border border-slate-200">
              
              {/* Header */}
              <div className="border-b border-slate-300 pb-3 mb-3 text-center">
                <h1 className="text-base font-bold tracking-tight text-slate-950 uppercase">{resume.fullName}</h1>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  {resume.email} • {resume.phone} • {resume.location}
                </p>
                {resume.linkedin && <p className="text-[9px] text-blue-700">{resume.linkedin}</p>}
              </div>

              {/* Summary */}
              <div className="mb-3">
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                  Professional Summary
                </h2>
                <p className="text-slate-700 leading-normal">{resume.summary}</p>
              </div>

              {/* Technical Skills */}
              <div className="mb-3">
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                  Technical Competencies
                </h2>
                <p className="text-slate-700">
                  <span className="font-semibold">Core:</span> {resume.skills.technical.join(', ')}
                </p>
                {resume.skills.tools.length > 0 && (
                  <p className="text-slate-700">
                    <span className="font-semibold">Tools/Cloud:</span> {resume.skills.tools.join(', ')}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div className="mb-3">
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                  Work Experience
                </h2>
                <div className="space-y-2">
                  {resume.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between font-bold text-slate-900 text-[10.5px]">
                        <span>{exp.jobTitle} — {exp.company}</span>
                        <span className="text-slate-500 font-normal text-[9.5px]">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                      </div>
                      <p className="text-slate-700 mt-0.5">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              {resume.projects.length > 0 && (
                <div className="mb-3">
                  <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                    Projects & Systems
                  </h2>
                  <div className="space-y-1.5">
                    {resume.projects.map((proj, idx) => (
                      <div key={idx}>
                        <span className="font-bold text-slate-900">{proj.title}</span>
                        <p className="text-slate-700">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resume.education.length > 0 && (
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                    Education
                  </h2>
                  {resume.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between text-slate-700">
                      <span>{edu.degree} in {edu.fieldOfStudy}, {edu.institution}</span>
                      <span className="text-slate-500 text-[9.5px]">{edu.graduationYear}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

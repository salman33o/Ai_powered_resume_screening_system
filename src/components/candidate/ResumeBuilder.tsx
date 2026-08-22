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

  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: 'Enterprise Org',
      jobTitle: 'Senior Specialist',
      startDate: '2023-01',
      endDate: '2026-08',
      isCurrent: true,
      description: 'Describe core responsibilities, technologies utilized, and quantified business impact.',
      technologies: ['SQL', 'Python']
    };
    updateField('experience', [newExp, ...resume.experience]);
  };

  const addProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: 'Distributed Analytics Pipeline',
      description: 'End-to-end architecture and implementation details demonstrating relevant stack proficiency.',
      technologies: ['React', 'Node.js', 'PostgreSQL']
    };
    updateField('projects', [newProj, ...resume.projects]);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Spec-Compliant Builder</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
              Schema: {selectedTemplate.toUpperCase()}
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
            Structured Resume Builder & Exporter
          </h2>
          <p className="text-xs text-[#8A97A8] mt-0.5">
            Construct high-fidelity, machine-parseable resumes designed to pass single-column OCR extraction filters.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono">
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded bg-teal-600 hover:bg-teal-500 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Re-Score</span>
          </button>

          <button
            onClick={() => exportResumePDF(resume)}
            className="px-3.5 py-1.5 rounded bg-[#0E1A29] hover:bg-[#17263B] text-[#E6EAF0] text-xs font-medium flex items-center space-x-1.5 border border-[#223348] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-2.5 rounded bg-[#0E1A29] border border-teal-500/40 text-xs font-mono text-teal-300 flex items-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
          <span>Resume saved successfully. Deterministic scoring recomputed.</span>
        </div>
      )}

      {/* Builder Layout: Left Form Editors vs Right Live ATS Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 6 Columns: Form Editors */}
        <div className="lg:col-span-6 space-y-3">
          
          {/* Section Selector Pills */}
          <div className="flex flex-wrap gap-1 p-1 bg-[#131F30] rounded border border-[#223348] font-mono">
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
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    activeSection === sec.id
                      ? 'bg-teal-600 text-slate-950 font-bold'
                      : 'text-[#8A97A8] hover:text-[#E6EAF0]'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section 1: Contact Details */}
          {activeSection === 'personal' && (
            <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3 text-xs font-mono">
              <h3 className="font-bold text-[#E6EAF0] uppercase tracking-wider text-[10px]">Contact Credentials</h3>
              
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#8A97A8] text-[10px] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 font-sans text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#8A97A8] text-[10px] mb-1">Email</label>
                  <input
                    type="email"
                    value={resume.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#8A97A8] text-[10px] mb-1">Phone</label>
                  <input
                    type="text"
                    value={resume.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#8A97A8] text-[10px] mb-1">Location</label>
                  <input
                    type="text"
                    value={resume.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8A97A8] text-[10px] mb-1">Executive Summary</label>
                <textarea
                  rows={4}
                  value={resume.summary}
                  onChange={(e) => updateField('summary', e.target.value)}
                  className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] focus:outline-none focus:border-teal-500 resize-none leading-relaxed font-sans text-xs"
                />
              </div>
            </div>
          )}

          {/* Section 2: Work Experience */}
          {activeSection === 'experience' && (
            <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#E6EAF0] uppercase tracking-wider text-[10px] font-mono">Work History ({resume.experience.length})</h3>
                <button
                  onClick={addExperience}
                  className="px-2 py-0.5 bg-[#0E1A29] hover:bg-[#17263B] text-teal-300 border border-teal-500/30 rounded text-xs font-mono font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-2.5 font-mono">
                {resume.experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="p-3 rounded bg-[#0E1A29] border border-[#223348] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#8A97A8] text-xs">Role #{idx + 1}</span>
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
                        className="bg-[#131F30] p-1.5 rounded border border-[#223348] text-[#E6EAF0] text-xs font-sans"
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
                        className="bg-[#131F30] p-1.5 rounded border border-[#223348] text-[#E6EAF0] text-xs font-sans"
                      />
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Bullet points & quantified achievements..."
                      value={exp.description}
                      onChange={(e) => {
                        const list = [...resume.experience];
                        list[idx].description = e.target.value;
                        updateField('experience', list);
                      }}
                      className="w-full bg-[#131F30] p-1.5 rounded border border-[#223348] text-[#E6EAF0] resize-none text-xs font-sans leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Technical Skills */}
          {activeSection === 'skills' && (
            <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3 text-xs font-mono">
              <h3 className="font-bold text-[#E6EAF0] uppercase tracking-wider text-[10px]">Competencies Matrix</h3>

              <div>
                <label className="block text-[#8A97A8] text-[10px] mb-1">Technical Skills (Comma separated)</label>
                <input
                  type="text"
                  value={resume.skills.technical.join(', ')}
                  onChange={(e) => {
                    const skillsArr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    updateField('skills', { ...resume.skills, technical: skillsArr });
                  }}
                  className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] text-xs"
                />
              </div>

              <div>
                <label className="block text-[#8A97A8] text-[10px] mb-1">Tools & Cloud Frameworks</label>
                <input
                  type="text"
                  value={resume.skills.tools.join(', ')}
                  onChange={(e) => {
                    const toolsArr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    updateField('skills', { ...resume.skills, tools: toolsArr });
                  }}
                  className="w-full bg-[#0E1A29] p-2 rounded border border-[#223348] text-[#E6EAF0] text-xs"
                />
              </div>
            </div>
          )}

          {/* Section 4: Projects */}
          {activeSection === 'projects' && (
            <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#E6EAF0] uppercase tracking-wider text-[10px] font-mono">Projects ({resume.projects.length})</h3>
                <button
                  onClick={addProject}
                  className="px-2 py-0.5 bg-[#0E1A29] hover:bg-[#17263B] text-teal-300 border border-teal-500/30 rounded text-xs font-mono font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-2.5 font-mono">
                {resume.projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="p-3 rounded bg-[#0E1A29] border border-[#223348] space-y-2">
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
                        className="bg-[#131F30] p-1.5 rounded border border-[#223348] text-[#E6EAF0] font-bold w-3/4 text-xs font-sans"
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
                      placeholder="Architecture description..."
                      value={proj.description}
                      onChange={(e) => {
                        const list = [...resume.projects];
                        list[idx].description = e.target.value;
                        updateField('projects', list);
                      }}
                      className="w-full bg-[#131F30] p-1.5 rounded border border-[#223348] text-[#E6EAF0] resize-none text-xs font-sans leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Certs */}
          {(activeSection === 'education' || activeSection === 'certifications') && (
            <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-2 text-xs font-mono">
              <h3 className="font-bold text-[#E6EAF0] uppercase tracking-wider text-[10px]">
                {activeSection === 'education' ? 'Academic History' : 'Certifications'}
              </h3>
              <p className="text-[#8A97A8]">
                Education and certified credentials directly substantiate keyword density and scoring filters.
              </p>
            </div>
          )}

        </div>

        {/* Right 6 Columns: Clean ATS Document Preview (White Sheet Look) */}
        <div className="lg:col-span-6">
          <div className="bg-[#131F30] rounded-lg p-3.5 border border-[#223348] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#8A97A8] font-mono">
              <div className="flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-bold text-[#E6EAF0]">ATS Parsing Viewport</span>
              </div>
              <span className="text-[10px] text-teal-400 px-1.5 py-0.2 rounded bg-[#0E1A29] border border-teal-500/30">
                Single-Column Standard
              </span>
            </div>

            {/* Document Paper Canvas */}
            <div className="bg-white text-slate-900 p-5 rounded border border-slate-300 font-sans min-h-[560px] text-[11px] leading-relaxed select-text shadow-sm">
              
              {/* Header */}
              <div className="border-b border-slate-300 pb-2.5 mb-2.5 text-center">
                <h1 className="text-base font-bold tracking-tight text-slate-950 uppercase">{resume.fullName}</h1>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  {resume.email} • {resume.phone} • {resume.location}
                </p>
                {resume.linkedin && <p className="text-[9px] text-teal-700">{resume.linkedin}</p>}
              </div>

              {/* Summary */}
              <div className="mb-2.5">
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                  Professional Summary
                </h2>
                <p className="text-slate-700 leading-normal">{resume.summary}</p>
              </div>

              {/* Technical Skills */}
              <div className="mb-2.5">
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
              <div className="mb-2.5">
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                  Work Experience
                </h2>
                <div className="space-y-1.5">
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
                <div className="mb-2.5">
                  <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                    Projects & Systems
                  </h2>
                  <div className="space-y-1">
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

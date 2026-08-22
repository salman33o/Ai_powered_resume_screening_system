import React, { useState, useMemo } from 'react';
import { StructuredResume, JobRequirement, InterviewQuestionItem } from '../../types';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  HelpCircle, 
  UserCheck, 
  Target, 
  Briefcase,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { generateInterviewQuestionsApi } from '../../services/apiClient';
import { SAMPLE_INTERVIEW_QUESTIONS } from '../../lib/mockData';

interface AIInterviewPrepProps {
  resume: StructuredResume;
  job: JobRequirement;
}

export const AIInterviewPrep: React.FC<AIInterviewPrepProps> = ({
  resume,
  job
}) => {
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>(SAMPLE_INTERVIEW_QUESTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(SAMPLE_INTERVIEW_QUESTIONS[0]?.id || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyMatchingCandidate, setOnlyMatchingCandidate] = useState<boolean>(false);

  // Synthesize questions tailored specifically to this active candidate and job
  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const result = await generateInterviewQuestionsApi(resume, job);
      if (result && result.length > 0) {
        setQuestions([...result, ...SAMPLE_INTERVIEW_QUESTIONS]);
        setExpandedId(result[0].id);
      }
    } catch (e) {
      console.error('Failed to generate AI questions:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute personalized dynamic grounding for each question against active candidate & target job
  const personalizedQuestions = useMemo(() => {
    const candidateSkillsLower = resume.skills.technical.map(s => s.toLowerCase());

    return questions.map((q) => {
      const qText = `${q.question} ${q.contextWhyAsked} ${q.candidateBackgroundEvidence || ''}`.toLowerCase();
      
      // Calculate skill overlap
      const matchedSkills = candidateSkillsLower.filter(sk => qText.includes(sk));
      
      // Determine if question has direct candidate background evidence
      const hasDirectSkillOverlap = matchedSkills.length > 0;
      const hasDomainOverlap = 
        (resume.fullName.toLowerCase().includes('marcus') && (qText.includes('solidworks') || qText.includes('cad') || qText.includes('thermal') || qText.includes('fea') || qText.includes('mechanic') || qText.includes('battery'))) ||
        (resume.fullName.toLowerCase().includes('alex') && (qText.includes('sql') || qText.includes('power bi') || qText.includes('churn') || qText.includes('analyst') || qText.includes('pipeline'))) ||
        (resume.fullName.toLowerCase().includes('sophia') && (qText.includes('pytorch') || qText.includes('transformer') || qText.includes('sentence-bert') || qText.includes('embedding') || qText.includes('ml'))) ||
        (resume.fullName.toLowerCase().includes('karthik') && (qText.includes('power') || qText.includes('etap') || qText.includes('substation') || qText.includes('scada') || qText.includes('circuit'))) ||
        (resume.fullName.toLowerCase().includes('elena') && (qText.includes('agri') || qText.includes('crop') || qText.includes('gis') || qText.includes('drone') || qText.includes('soil'))) ||
        (resume.fullName.toLowerCase().includes('maya') && (qText.includes('brand') || qText.includes('typography') || qText.includes('art') || qText.includes('design') || qText.includes('figma')));

      // Candidate tailored anchor evidence string
      let personalizedAnchor = q.candidateBackgroundEvidence;
      if (!personalizedAnchor || hasDomainOverlap) {
        if (matchedSkills.length > 0) {
          personalizedAnchor = `Direct CV Anchor: ${resume.fullName} lists verified proficiency in ${matchedSkills.slice(0, 3).join(', ')} (${resume.experience[0]?.company || 'Recent Role'}).`;
        } else {
          personalizedAnchor = `Grounded Anchor: Evaluates ${resume.fullName}'s background (${resume.experience[0]?.jobTitle || 'Recent Experience'}) against ${job.title} evaluation criteria.`;
        }
      }

      const matchConfidence = hasDomainOverlap ? 98 : hasDirectSkillOverlap ? 92 : q.category === 'behavioral' ? 88 : 75;

      return {
        ...q,
        candidateBackgroundEvidence: personalizedAnchor,
        matchConfidence,
        isDirectProfileMatch: hasDomainOverlap || hasDirectSkillOverlap || q.category === 'behavioral'
      };
    });
  }, [questions, resume, job]);

  // Filter questions based on category, difficulty, search query, and candidate profile match toggle
  const filteredQuestions = useMemo(() => {
    return personalizedQuestions.filter(q => {
      if (onlyMatchingCandidate && !q.isDirectProfileMatch) return false;

      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'technical' && q.category === 'technical') ||
        (selectedCategory === 'project' && q.category === 'project_deep_dive') ||
        (selectedCategory === 'behavioral' && q.category === 'behavioral') ||
        (selectedCategory === 'eee' && (q.question.toLowerCase().includes('power') || q.question.toLowerCase().includes('circuit') || q.question.toLowerCase().includes('pcb') || q.question.toLowerCase().includes('embedded') || q.question.toLowerCase().includes('etap'))) ||
        (selectedCategory === 'agri' && (q.question.toLowerCase().includes('crop') || q.question.toLowerCase().includes('agri') || q.question.toLowerCase().includes('soil') || q.question.toLowerCase().includes('ndvi') || q.question.toLowerCase().includes('drone'))) ||
        (selectedCategory === 'art' && (q.question.toLowerCase().includes('typography') || q.question.toLowerCase().includes('brand') || q.question.toLowerCase().includes('3d') || q.question.toLowerCase().includes('animation') || q.question.toLowerCase().includes('figma'))) ||
        (selectedCategory === 'mech' && (q.question.toLowerCase().includes('solidworks') || q.question.toLowerCase().includes('ansys') || q.question.toLowerCase().includes('fea') || q.question.toLowerCase().includes('cad') || q.question.toLowerCase().includes('gd&t') || q.question.toLowerCase().includes('thermal')));

      const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      
      const matchesSearch = !searchQuery || 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.contextWhyAsked.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.candidateBackgroundEvidence?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [personalizedQuestions, selectedCategory, selectedDifficulty, searchQuery, onlyMatchingCandidate]);

  const directMatchCount = personalizedQuestions.filter(q => q.isDirectProfileMatch).length;

  return (
    <div className="space-y-4">
      
      {/* 01. Top Header */}
      <div className="surface-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
              Grounded Question Matrix
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded surface-subtle text-[var(--text-secondary)] border border-[var(--border)]">
              {filteredQuestions.length} Questions Cataloged
            </span>
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] font-display mt-0.5 tracking-tight">
            Role & Background-Grounded Interview Preparation (50+ Spec)
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Technical, architectural, and behavioral simulations tailored to <strong className="text-[var(--text-primary)]">{resume.fullName}</strong> and target role <strong className="text-[var(--accent)]">{job.title}</strong>.
          </p>
        </div>

        <button
          onClick={fetchQuestions}
          disabled={isLoading}
          className="btn-primary text-xs"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Synthesizing Spec...' : 'Synthesize AI Questions'}</span>
        </button>
      </div>

      {/* 02. Candidate Profile Context Banner */}
      <div className="surface-panel p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-mono text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded surface-subtle border border-[var(--border-strong)] text-[var(--accent)] font-bold flex items-center justify-center text-xs">
            {resume.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[var(--text-primary)]">{resume.fullName}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded surface-subtle text-[var(--text-secondary)] border border-[var(--border)]">
                {resume.experience.length} Roles • {resume.skills.technical.length} Skills
              </span>
            </div>
            <p className="text-[10.5px] text-[var(--text-muted)] truncate max-w-md">
              Specialties: {resume.skills.technical.slice(0, 4).join(', ')}
            </p>
          </div>
        </div>

        {/* Toggle matching only */}
        <button
          onClick={() => setOnlyMatchingCandidate(!onlyMatchingCandidate)}
          className={`px-3 py-1.5 rounded text-[11px] font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0 ${
            onlyMatchingCandidate
              ? 'btn-primary text-xs'
              : 'btn-secondary text-xs'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Show Profile Matches Only ({directMatchCount})</span>
        </button>
      </div>

      {/* 03. Filter and Search Bar */}
      <div className="surface-panel p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase flex items-center space-x-1 mr-1">
            <Filter className="w-3 h-3 text-[var(--accent)]" />
            <span>Category:</span>
          </span>
          {[
            { id: 'all', label: 'All 50+' },
            { id: 'technical', label: 'Technical' },
            { id: 'mech', label: 'Mechanical / CAD' },
            { id: 'eee', label: 'Electrical / EEE' },
            { id: 'agri', label: 'Agri / AgTech' },
            { id: 'art', label: 'Art & Design' },
            { id: 'project', label: 'Projects' },
            { id: 'behavioral', label: 'Behavioral' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[var(--accent)] text-[#0B1420] font-bold'
                  : 'surface-subtle text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${resume.fullName.split(' ')[0]}'s questions...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--surface-subtle)] pl-8 pr-2.5 py-1.5 rounded border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--focus)] font-sans"
          />
        </div>
      </div>

      {/* 04. Questions list */}
      <div className="space-y-2.5 font-mono">
        {filteredQuestions.length === 0 ? (
          <div className="surface-panel p-6 text-center space-y-2">
            <HelpCircle className="w-6 h-6 text-[var(--text-muted)] mx-auto" />
            <p className="text-xs text-[var(--text-secondary)]">No questions found matching your filter criteria.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setOnlyMatchingCandidate(false); }}
              className="btn-secondary text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isExpanded = expandedId === q.id;
            return (
              <div 
                key={q.id || idx}
                className="surface-panel overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="w-full p-3.5 text-left flex items-start justify-between gap-3 hover:bg-[var(--surface-raised)] transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded surface-subtle border border-[var(--border)] text-[var(--accent)] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[9.5px] font-bold uppercase px-1.5 py-0.2 rounded surface-subtle text-[var(--text-muted)] border border-[var(--border)]">
                          {q.category?.replace('_', ' ')}
                        </span>

                        {q.isDirectProfileMatch && (
                          <span className="text-[9.5px] font-bold uppercase px-1.5 py-0.2 rounded surface-subtle text-[var(--accent)] border border-[var(--border-strong)] flex items-center space-x-1">
                            <Target className="w-2.5 h-2.5 text-[var(--accent)]" />
                            <span>Anchor: {resume.fullName.split(' ')[0]}</span>
                          </span>
                        )}

                        {q.difficulty && (
                          <span className={`text-[9.5px] font-semibold px-1.5 py-0.2 rounded ${
                            q.difficulty === 'Senior' || q.difficulty === 'Lead'
                              ? 'text-[var(--warning)] surface-subtle border border-[var(--border)]'
                              : 'text-[var(--text-muted)] surface-subtle border border-[var(--border)]'
                          }`}>
                            {q.difficulty}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-xs text-[var(--text-primary)] mt-1 leading-snug font-sans">
                        {q.question}
                      </h4>
                    </div>
                  </div>

                  <div className="text-[var(--text-muted)] shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[var(--accent)]" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-[var(--border)] surface-subtle space-y-3 text-xs">
                    
                    {/* Why Asked */}
                    <div>
                      <span className="font-bold text-[var(--accent)] uppercase text-[9px] tracking-wider block">
                        Interviewer Intent & Evaluation Strategy
                      </span>
                      <p className="text-[var(--text-secondary)] font-sans text-xs mt-0.5 leading-relaxed">{q.contextWhyAsked}</p>
                    </div>

                    {/* Resume Evidence */}
                    {q.candidateBackgroundEvidence && (
                      <div className="surface-panel p-2.5 rounded border border-[var(--border)]">
                        <span className="font-bold text-[var(--text-primary)] uppercase text-[9px] tracking-wider block">
                          Resume Anchor & Grounding Citation
                        </span>
                        <p className="text-[var(--text-secondary)] font-sans text-xs mt-0.5 leading-relaxed">
                          {q.candidateBackgroundEvidence}
                        </p>
                      </div>
                    )}

                    {/* Expected Key Points */}
                    {q.expectedKeyPoints && q.expectedKeyPoints.length > 0 && (
                      <div>
                        <span className="font-bold text-[var(--success)] uppercase text-[9px] tracking-wider block">
                          Key Deliverables to Address (STAR Method)
                        </span>
                        <ul className="mt-1.5 space-y-1">
                          {q.expectedKeyPoints.map((pt: string, pIdx: number) => (
                            <li key={pIdx} className="flex items-start space-x-1.5 text-[var(--text-primary)] font-sans">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0 mt-0.5" />
                              <span className="text-xs">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

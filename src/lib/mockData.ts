import { JobRequirement, StructuredResume, CandidateApplication, ATSAuditRecord } from '../types';
import { evaluateResumeAgainstJob } from './atsEngine';

export const SAMPLE_JOBS: JobRequirement[] = [
  {
    id: 'job-data-analyst',
    title: 'Senior Data Analyst',
    company: 'Apex Analytics & FinTech',
    department: 'Business Intelligence',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 4,
    salaryRange: '$135,000 - $165,000',
    summary: 'Lead exploratory data analysis, build executive Power BI and SQL data pipelines, deliver business forecasts, and optimize revenue metrics for our tier-1 financial platform.',
    requiredSkills: ['SQL', 'Python', 'Power BI', 'Data Analysis', 'Tableau', 'Excel'],
    preferredSkills: ['Snowflake', 'dbt', 'Statistics', 'A/B Testing', 'FastAPI'],
    responsibilities: [
      'Architect and maintain high-performance SQL data pipelines across multi-terabyte financial datasets',
      'Design interactive Power BI and Tableau dashboards for C-suite executive decision-making',
      'Perform exploratory data analysis and predictive revenue modeling using Python (Pandas, NumPy)',
      'Conduct rigorous A/B testing on user checkout funnels and present statistically sound recommendations',
      'Collaborate with product managers and backend engineers to standardize data schemas'
    ],
    educationRequirement: "Bachelor's or Master's in Data Science, Computer Science, Statistics, or related STEM field",
    requiredCertifications: ['Microsoft Certified: Power BI Data Analyst Associate (or equivalent)'],
    keywords: ['SQL', 'Python', 'Power BI', 'EDA', 'Tableau', 'Snowflake', 'Data Warehousing', 'KPI Dashboards', 'A/B Testing'],
    published: true,
    createdAt: '2026-08-01T10:00:00Z',
    applicationsCount: 42,
    scoringWeights: {
      skillsMatch: 30,
      experienceMatch: 25,
      responsibilitiesMatch: 20,
      projectsMatch: 10,
      educationMatch: 5,
      keywordsMatch: 5,
      certificationsMatch: 5
    }
  },
  {
    id: 'job-ml-engineer',
    title: 'Machine Learning Engineer',
    company: 'NeuralFlow AI',
    department: 'Applied AI & Core Models',
    location: 'Remote (US/EU)',
    type: 'Full-time',
    seniority: 'Mid',
    minExperienceYears: 3,
    salaryRange: '$150,000 - $185,000',
    summary: 'Build and deploy scalable deep learning, NLP, and LLM inference pipelines with PyTorch, Sentence-BERT, FastAPI, and Docker in AWS cloud environments.',
    requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'Natural Language Processing', 'FastAPI', 'Docker'],
    preferredSkills: ['Transformers', 'Vector Databases', 'Sentence-BERT', 'Kubernetes', 'MLflow', 'AWS'],
    responsibilities: [
      'Develop and fine-tune transformer models for semantic search and resume document classification',
      'Build high-throughput REST APIs with FastAPI and Docker for sub-100ms model inference latency',
      'Implement vector retrieval architectures using sentence embeddings and cosine indexing',
      'Collaborate with MLOps to monitor model drift, evaluation metrics, and automated retraining workflows'
    ],
    educationRequirement: "Bachelor's or Master's in Computer Science, Artificial Intelligence, or Mathematics",
    requiredCertifications: ['AWS Certified Machine Learning - Specialty (Preferred)'],
    keywords: ['Machine Learning', 'Deep Learning', 'PyTorch', 'FastAPI', 'Docker', 'NLP', 'Embeddings', 'Transformers', 'MLOps'],
    published: true,
    createdAt: '2026-08-05T09:30:00Z',
    applicationsCount: 68,
    scoringWeights: {
      skillsMatch: 35,
      experienceMatch: 20,
      responsibilitiesMatch: 20,
      projectsMatch: 15,
      educationMatch: 5,
      keywordsMatch: 3,
      certificationsMatch: 2
    }
  },
  {
    id: 'job-fullstack',
    title: 'Senior Full-Stack Engineer',
    company: 'CloudScale Technologies',
    department: 'Core Product Engineering',
    location: 'Austin, TX (Remote Available)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 5,
    salaryRange: '$140,000 - $175,000',
    summary: 'Lead frontend & backend architecture using React, TypeScript, Node.js/Express, PostgreSQL, and modern Tailwind UI systems for our enterprise recruitment engine.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git'],
    preferredSkills: ['Flutter', 'Docker', 'AWS', 'GraphQL', 'Jest', 'CI/CD'],
    responsibilities: [
      'Build modular, responsive web and mobile application interfaces with React and Tailwind',
      'Design robust relational PostgreSQL databases and RESTful/Express microservice endpoints',
      'Implement real-time WebSocket state synchronizations and background task worker queues',
      'Mentor junior software engineers and conduct thorough code reviews'
    ],
    educationRequirement: "Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience",
    requiredCertifications: [],
    keywords: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Full-Stack', 'REST APIs', 'Tailwind', 'Microservices'],
    published: true,
    createdAt: '2026-08-08T14:15:00Z',
    applicationsCount: 89,
    scoringWeights: {
      skillsMatch: 30,
      experienceMatch: 25,
      responsibilitiesMatch: 20,
      projectsMatch: 10,
      educationMatch: 5,
      keywordsMatch: 5,
      certificationsMatch: 5
    }
  }
];

export const SAMPLE_CANDIDATE_RESUMES: StructuredResume[] = [
  {
    id: 'resume-alex-rivera',
    versionName: 'Resume v2 — Data Analyst Focus',
    createdAt: '2026-08-10T12:00:00Z',
    updatedAt: '2026-08-12T16:30:00Z',
    fullName: 'Alex Rivera',
    email: 'alex.rivera.analyst@example.com',
    phone: '+1 (555) 234-8901',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alex-rivera-data',
    github: 'github.com/alexrivera-data',
    portfolio: 'alexrivera-portfolio.dev',
    summary: 'Results-driven Senior Data Analyst with 4.5+ years of experience designing scalable SQL data pipelines, executive Power BI dashboards, and statistical models that optimized $12M+ in recurring revenue. Proven expertise in Python (Pandas, Scikit-learn), exploratory data analysis, and cross-functional leadership.',
    skills: {
      technical: ['SQL', 'PostgreSQL', 'Python', 'Power BI', 'Tableau', 'Data Analysis', 'Exploratory Data Analysis', 'Snowflake', 'Excel'],
      soft: ['Cross-functional Collaboration', 'Executive Presentation', 'Critical Thinking', 'Agile Methodology'],
      tools: ['Git', 'dbt', 'Jupyter', 'Jira', 'Docker']
    },
    experience: [
      {
        id: 'exp-1',
        company: 'FinVanguard Solutions',
        jobTitle: 'Data Analyst & BI Lead',
        startDate: '2022-03',
        endDate: '2026-08',
        isCurrent: true,
        location: 'San Francisco, CA',
        description: 'Engineered 14+ automated SQL data pipelines processing 2.5M daily transaction logs. Built executive Power BI dashboards used by senior VPs to track customer lifetime value and churn trends. Conducted A/B tests on landing checkout funnels yielding a 14.8% conversion lift.',
        technologies: ['SQL', 'Power BI', 'Python', 'PostgreSQL', 'Snowflake', 'Excel']
      },
      {
        id: 'exp-2',
        company: 'MetroMetrics Inc',
        jobTitle: 'Junior Data Analyst',
        startDate: '2020-06',
        endDate: '2022-02',
        isCurrent: false,
        location: 'Oakland, CA',
        description: 'Created weekly financial summary reports using Tableau and advanced Excel models. Optimized existing database query runtime by 38% through indexing and query refactoring.',
        technologies: ['SQL', 'Tableau', 'Excel', 'Python']
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Data Science & Applied Statistics',
        graduationYear: '2020',
        gpa: '3.82'
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Customer Churn Predictor & Real-Time Dashboard',
        description: 'Constructed an end-to-end churn prediction pipeline using Python, Scikit-learn, and Power BI. Deployed interactive KPI visualization monitoring $4M annual customer accounts.',
        technologies: ['Python', 'SQL', 'Power BI', 'Scikit-learn', 'Docker'],
        link: 'github.com/alexrivera-data/churn-analytics',
        metrics: '91.4% ROC-AUC accuracy; reduced churn risk by 18%'
      },
      {
        id: 'proj-2',
        title: 'Automated Financial Reconciliation Engine',
        description: 'Created a automated Python + PostgreSQL data verification tool that reconciled 50,000+ daily bank ledger records.',
        technologies: ['Python', 'PostgreSQL', 'SQL', 'Pandas'],
        link: 'github.com/alexrivera-data/reconcile-engine'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Microsoft Certified: Power BI Data Analyst Associate',
        issuer: 'Microsoft',
        issueDate: '2023-11',
        credentialId: 'MS-89421-PBI'
      }
    ],
    extractionQuality: 'high',
    extractionNotes: ['Clean text formatting', 'All dates, metrics, and degrees successfully parsed and validated']
  },
  {
    id: 'resume-sophia-zhang',
    versionName: 'Resume v1 — Machine Learning Engineer',
    createdAt: '2026-08-08T10:00:00Z',
    updatedAt: '2026-08-11T14:00:00Z',
    fullName: 'Sophia Zhang',
    email: 'sophia.zhang.ai@example.com',
    phone: '+1 (555) 789-3210',
    location: 'Seattle, WA',
    linkedin: 'linkedin.com/in/sophia-zhang-ml',
    github: 'github.com/sophiazhang-ai',
    portfolio: 'sophiazhang.dev',
    summary: 'Machine Learning Engineer with 3.5+ years of experience specializing in NLP, transformers, vector retrieval, and production API serving using FastAPI, PyTorch, and Docker.',
    skills: {
      technical: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'Natural Language Processing', 'Sentence-BERT', 'FastAPI', 'Docker', 'Transformers', 'SQL'],
      soft: ['Research & Development', 'Problem Solving', 'Technical Documentation'],
      tools: ['Git', 'MLflow', 'Kubernetes', 'HuggingFace', 'AWS']
    },
    experience: [
      {
        id: 'exp-sz-1',
        company: 'OmniAI Labs',
        jobTitle: 'ML Engineer',
        startDate: '2023-01',
        endDate: '2026-08',
        isCurrent: true,
        location: 'Seattle, WA',
        description: 'Architected and deployed semantic search microservices serving 4M requests/day using Sentence-BERT embeddings and FastAPI. Reduced model inference latency from 240ms to 65ms.',
        technologies: ['Python', 'PyTorch', 'Sentence-BERT', 'FastAPI', 'Docker', 'AWS']
      },
      {
        id: 'exp-sz-2',
        company: 'DataCore Intelligence',
        jobTitle: 'Associate Data Scientist',
        startDate: '2021-06',
        endDate: '2022-12',
        isCurrent: false,
        location: 'San Jose, CA',
        description: 'Trained text categorization models using PyTorch and scikit-learn. Built REST API wrappers and automated evaluation pipelines.',
        technologies: ['Python', 'Machine Learning', 'PyTorch', 'SQL']
      }
    ],
    education: [
      {
        id: 'edu-sz-1',
        institution: 'University of Washington',
        degree: 'Master of Science',
        fieldOfStudy: 'Computer Science (AI/ML Focus)',
        graduationYear: '2021'
      }
    ],
    projects: [
      {
        id: 'proj-sz-1',
        title: 'Scalable Neural Resume Matcher',
        description: 'Open-source semantic parsing and matching framework comparing unstructured CV text against job descriptions using dense vector representations.',
        technologies: ['PyTorch', 'Transformers', 'FastAPI', 'Docker'],
        link: 'github.com/sophiazhang-ai/neural-matcher'
      }
    ],
    certifications: [
      {
        id: 'cert-sz-1',
        name: 'AWS Certified Machine Learning - Specialty',
        issuer: 'Amazon Web Services',
        issueDate: '2024-04'
      }
    ],
    extractionQuality: 'high'
  },
  {
    id: 'resume-marcus-chen',
    versionName: 'Resume v3 — Senior Full Stack',
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-10T19:00:00Z',
    fullName: 'Marcus Chen',
    email: 'marcus.chen.dev@example.com',
    phone: '+1 (555) 456-1122',
    location: 'Austin, TX',
    linkedin: 'linkedin.com/in/marcuschen-fullstack',
    github: 'github.com/marcuschen-dev',
    summary: 'Full-Stack Software Engineer with 6 years experience building scalable enterprise cloud applications with React, TypeScript, Node.js, and PostgreSQL.',
    skills: {
      technical: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Express', 'JavaScript', 'HTML/CSS', 'Git', 'SQL'],
      soft: ['Team Mentorship', 'System Architecture', 'Agile Delivery'],
      tools: ['Docker', 'AWS', 'Jest', 'Webpack', 'Vite']
    },
    experience: [
      {
        id: 'exp-mc-1',
        company: 'SaaSVelocity Inc',
        jobTitle: 'Senior Full Stack Developer',
        startDate: '2022-01',
        endDate: '2026-08',
        isCurrent: true,
        location: 'Austin, TX',
        description: 'Led a team of 5 engineers building enterprise dashboard apps using React 19, TypeScript, and Node.js microservices. Improved Lighthouse performance scores from 54 to 98.',
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS']
      },
      {
        id: 'exp-mc-2',
        company: 'DevForge Systems',
        jobTitle: 'Software Engineer',
        startDate: '2019-06',
        endDate: '2021-12',
        isCurrent: false,
        location: 'Austin, TX',
        description: 'Developed REST APIs in Express and integrated responsive frontend views. Designed database schema migrations in PostgreSQL.',
        technologies: ['JavaScript', 'Node.js', 'PostgreSQL', 'React']
      }
    ],
    education: [
      {
        id: 'edu-mc-1',
        institution: 'University of Texas at Austin',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        graduationYear: '2019'
      }
    ],
    projects: [
      {
        id: 'proj-mc-1',
        title: 'Real-Time Collaborative Workspace',
        description: 'Engineered high-concurrency web workspace with WebSocket live sync and PostgreSQL persistence.',
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS']
      }
    ],
    certifications: [],
    extractionQuality: 'high'
  }
];

/**
 * Initial candidate pipeline applications
 */
export function generateInitialCandidateApplications(): CandidateApplication[] {
  const defaultJob = SAMPLE_JOBS[0]; // Senior Data Analyst

  const candidatesMeta = [
    {
      resume: SAMPLE_CANDIDATE_RESUMES[0],
      stage: 'shortlisted' as const,
      tags: ['Top Match', 'Power BI Certified', 'UC Berkeley'],
      rating: 5,
      appliedDate: '2026-08-10T14:22:00Z',
      notes: ['Exemplary domain knowledge in SQL & Power BI. Recommended for technical phone screen.']
    },
    {
      resume: SAMPLE_CANDIDATE_RESUMES[1],
      stage: 'screening' as const,
      tags: ['Strong ML', 'FastAPI'],
      rating: 4,
      appliedDate: '2026-08-11T09:15:00Z',
      notes: ['Deep technical skills, but slightly more focused on ML than standard BI pipelines.']
    },
    {
      resume: SAMPLE_CANDIDATE_RESUMES[2],
      stage: 'applied' as const,
      tags: ['Full Stack Dev', 'TypeScript'],
      rating: 3,
      appliedDate: '2026-08-12T11:40:00Z',
      notes: ['Full-stack engineer applying to analytics position. Assess data query depth.']
    },
    {
      resume: {
        id: 'resume-david-kim',
        versionName: 'David Kim - BI Specialist',
        createdAt: '2026-08-09T08:00:00Z',
        updatedAt: '2026-08-09T08:00:00Z',
        fullName: 'David Kim',
        email: 'david.kim.analytics@example.com',
        phone: '+1 (555) 345-6789',
        location: 'San Francisco, CA',
        summary: 'Data Analyst with 5 years experience in SQL, Tableau, Power BI, Excel, and Snowflake data modeling.',
        skills: {
          technical: ['SQL', 'Tableau', 'Power BI', 'Excel', 'Snowflake', 'Data Analysis', 'Python'],
          soft: ['Problem Solving', 'Communication'],
          tools: ['Git', 'dbt', 'Jira']
        },
        experience: [
          {
            id: 'exp-dk-1',
            company: 'PayStream Corp',
            jobTitle: 'Senior Data Analyst',
            startDate: '2021-04',
            endDate: '2026-08',
            isCurrent: true,
            description: 'Designed enterprise KPI dashboards in Power BI and SQL for financial compliance.',
            technologies: ['SQL', 'Power BI', 'Tableau', 'Snowflake']
          }
        ],
        education: [
          {
            id: 'edu-dk-1',
            institution: 'San Jose State University',
            degree: 'BS',
            fieldOfStudy: 'Applied Economics & Analytics',
            graduationYear: '2020'
          }
        ],
        projects: [
          {
            id: 'proj-dk-1',
            title: 'Revenue Analytics Platform',
            description: 'Snowflake + Power BI pipeline providing real-time financial summaries.',
            technologies: ['Snowflake', 'Power BI', 'SQL']
          }
        ],
        certifications: [
          {
            id: 'cert-dk-1',
            name: 'Tableau Desktop Certified Associate',
            issuer: 'Tableau',
            issueDate: '2022-05'
          }
        ],
        extractionQuality: 'high' as const
      },
      stage: 'interview' as const,
      tags: ['Interview Scheduled', 'Snowflake Specialist'],
      rating: 5,
      appliedDate: '2026-08-08T18:00:00Z',
      interviewScheduledDate: '2026-08-16T15:00:00Z',
      notes: ['Technical round 1 passed with flying colors. Panel interview scheduled.']
    },
    {
      resume: {
        id: 'resume-priya-patel',
        versionName: 'Priya Patel - Junior Analyst',
        createdAt: '2026-08-12T10:00:00Z',
        updatedAt: '2026-08-12T10:00:00Z',
        fullName: 'Priya Patel',
        email: 'priya.patel@example.com',
        phone: '+1 (555) 901-2345',
        location: 'Remote, US',
        summary: 'Recent Graduate with strong academic foundation in SQL, Python, and Statistics. Eager to contribute to high-growth data teams.',
        skills: {
          technical: ['SQL', 'Python', 'Excel', 'Data Analysis'],
          soft: ['Fast Learner', 'Collaboration'],
          tools: ['Jupyter', 'Git']
        },
        experience: [
          {
            id: 'exp-pp-1',
            company: 'StatSolutions Lab',
            jobTitle: 'Data Analyst Intern',
            startDate: '2025-06',
            endDate: '2025-12',
            isCurrent: false,
            description: 'Assisted in preparing monthly revenue reports and cleaning raw survey data in Python.',
            technologies: ['Python', 'SQL', 'Excel']
          }
        ],
        education: [
          {
            id: 'edu-pp-1',
            institution: 'University of Illinois',
            degree: 'BS',
            fieldOfStudy: 'Statistics',
            graduationYear: '2025'
          }
        ],
        projects: [],
        certifications: [],
        extractionQuality: 'high' as const
      },
      stage: 'on_hold' as const,
      tags: ['Junior Profile', 'Good Potential'],
      rating: 3,
      appliedDate: '2026-08-12T15:30:00Z',
      notes: ['High potential candidate for junior roles; currently under seniority baseline for Senior role.']
    }
  ];

  return candidatesMeta.map((cand, idx) => {
    const analysis = evaluateResumeAgainstJob(cand.resume, defaultJob);
    return {
      id: `app-${idx + 1}`,
      candidateId: cand.resume.id,
      candidateName: cand.resume.fullName,
      candidateEmail: cand.resume.email,
      candidatePhone: cand.resume.phone,
      jobId: defaultJob.id,
      jobTitle: defaultJob.title,
      companyName: defaultJob.company,
      appliedDate: cand.appliedDate,
      stage: cand.stage,
      resume: cand.resume,
      atsAnalysis: analysis,
      recruiterNotes: cand.notes,
      tags: cand.tags,
      recruiterRating: cand.rating,
      interviewScheduledDate: cand.interviewScheduledDate
    };
  });
}

/**
 * Generator for bulk resumes simulation
 */
export function generateBulkResumes(count: number): StructuredResume[] {
  const names = [
    'Liam Smith', 'Olivia Johnson', 'Noah Williams', 'Emma Brown', 'James Jones', 'Ava Garcia',
    'William Miller', 'Sophia Davis', 'Benjamin Rodriguez', 'Isabella Martinez', 'Lucas Hernandez',
    'Mia Lopez', 'Henry Gonzalez', 'Evelyn Wilson', 'Alexander Anderson', 'Harper Thomas',
    'Sebastian Taylor', 'Camila Moore', 'Jack Jackson', 'Gianna Martin', 'Samuel Lee',
    'Abigail Perez', 'Matthew Thompson', 'Emily White', 'Daniel Harris', 'Elizabeth Sanchez',
    'Michael Clark', 'Avery Ramirez', 'Ethan Lewis', 'Sofia Robinson', 'Logan Walker',
    'Ella Young', 'Jackson Allen', 'Madison King', 'Aiden Wright', 'Scarlett Scott',
    'Oliver Torres', 'Victoria Nguyen', 'Elijah Hill', 'Aria Flores', 'Jacob Green'
  ];

  const colleges = ['UC Berkeley', 'Stanford University', 'MIT', 'Georgia Tech', 'UT Austin', 'Univ of Washington', 'UIUC', 'NYU', 'Carnegie Mellon', 'UCLA'];
  const skillPool = ['SQL', 'Python', 'Power BI', 'Tableau', 'Excel', 'Snowflake', 'dbt', 'Pandas', 'FastAPI', 'Docker', 'AWS', 'PostgreSQL', 'Spark', 'A/B Testing', 'Statistics'];

  const results: StructuredResume[] = [];

  for (let i = 0; i < count; i++) {
    const name = `${names[i % names.length]} ${i >= names.length ? `#${Math.floor(i / names.length) + 1}` : ''}`.trim();
    const email = `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`;
    const yearsExp = Math.round((2 + (i % 8) * 1.2 + (Math.random() * 2)) * 10) / 10;
    
    const randSkillCount = 4 + (i % 7);
    const candidateSkills: string[] = [];
    for (let s = 0; s < randSkillCount; s++) {
      const sk = skillPool[(i * 3 + s) % skillPool.length];
      if (!candidateSkills.includes(sk)) candidateSkills.push(sk);
    }

    const extractionQuality: 'high' | 'medium' | 'low' = i % 15 === 0 ? 'low' : i % 6 === 0 ? 'medium' : 'high';

    results.push({
      id: `bulk-resume-${i + 1}`,
      versionName: `${name} - Resume`,
      createdAt: new Date(Date.now() - (count - i) * 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
      fullName: name,
      email,
      phone: `+1 (555) ${100 + (i % 900)}-${1000 + (i % 9000)}`,
      location: i % 3 === 0 ? 'San Francisco, CA' : i % 2 === 0 ? 'Remote' : 'Austin, TX',
      summary: `Experienced analytical professional with ${yearsExp} years specializing in ${candidateSkills.slice(0, 3).join(', ')} and database analytics.`,
      skills: {
        technical: candidateSkills,
        soft: ['Communication', 'Analytical Thinking', 'Teamwork'],
        tools: ['Git', 'Excel', 'Docker']
      },
      experience: [
        {
          id: `exp-${i}-1`,
          company: `Tech Enterprise ${((i % 10) + 1)}`,
          jobTitle: yearsExp >= 4 ? 'Senior Data Specialist' : 'Data Analyst',
          startDate: `${2026 - Math.floor(yearsExp)}-01`,
          endDate: '2026-08',
          isCurrent: true,
          description: `Managed data reporting pipelines, executed SQL queries, and generated business intelligence metrics using ${candidateSkills.slice(0, 2).join(' and ')}.`,
          technologies: candidateSkills.slice(0, 4)
        }
      ],
      education: [
        {
          id: `edu-${i}`,
          institution: colleges[i % colleges.length],
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science / Analytics',
          graduationYear: `${2026 - Math.floor(yearsExp) - 1}`
        }
      ],
      projects: [
        {
          id: `proj-${i}`,
          title: `Analytics & Reporting Hub`,
          description: `Built automated dashboards tracking business performance using ${candidateSkills.slice(0, 2).join(', ')}.`,
          technologies: candidateSkills.slice(0, 3)
        }
      ],
      certifications: i % 3 === 0 ? [{ id: `c-${i}`, name: 'Microsoft Certified: Power BI Associate', issuer: 'Microsoft', issueDate: '2024-01' }] : [],
      extractionQuality
    });
  }

  return results;
}

/**
 * Generator for bulk processing simulation (up to 400 realistic candidates)
 */
export function generateBulkCandidatePool(count: number, targetJob: JobRequirement): CandidateApplication[] {
  const names = [
    'Liam Smith', 'Olivia Johnson', 'Noah Williams', 'Emma Brown', 'James Jones', 'Ava Garcia',
    'William Miller', 'Sophia Davis', 'Benjamin Rodriguez', 'Isabella Martinez', 'Lucas Hernandez',
    'Mia Lopez', 'Henry Gonzalez', 'Evelyn Wilson', 'Alexander Anderson', 'Harper Thomas',
    'Sebastian Taylor', 'Camila Moore', 'Jack Jackson', 'Gianna Martin', 'Samuel Lee',
    'Abigail Perez', 'Matthew Thompson', 'Emily White', 'Daniel Harris', 'Elizabeth Sanchez',
    'Michael Clark', 'Avery Ramirez', 'Ethan Lewis', 'Sofia Robinson', 'Logan Walker',
    'Ella Young', 'Jackson Allen', 'Madison King', 'Aiden Wright', 'Scarlett Scott',
    'Oliver Torres', 'Victoria Nguyen', 'Elijah Hill', 'Aria Flores', 'Jacob Green'
  ];

  const colleges = ['UC Berkeley', 'Stanford University', 'MIT', 'Georgia Tech', 'UT Austin', 'Univ of Washington', 'UIUC', 'NYU', 'Carnegie Mellon', 'UCLA'];
  const skillPool = ['SQL', 'Python', 'Power BI', 'Tableau', 'Excel', 'Snowflake', 'dbt', 'Pandas', 'FastAPI', 'Docker', 'AWS', 'PostgreSQL', 'Spark', 'A/B Testing', 'Statistics'];

  const results: CandidateApplication[] = [];

  for (let i = 0; i < count; i++) {
    const name = `${names[i % names.length]} ${i >= names.length ? `#${Math.floor(i / names.length) + 1}` : ''}`.trim();
    const email = `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`;
    const yearsExp = Math.round((2 + (i % 8) * 1.2 + (Math.random() * 2)) * 10) / 10;
    
    // Pick random subset of skills
    const randSkillCount = 4 + (i % 7);
    const candidateSkills: string[] = [];
    for (let s = 0; s < randSkillCount; s++) {
      const sk = skillPool[(i * 3 + s) % skillPool.length];
      if (!candidateSkills.includes(sk)) candidateSkills.push(sk);
    }

    const extractionQuality: 'high' | 'medium' | 'low' = i % 15 === 0 ? 'low' : i % 6 === 0 ? 'medium' : 'high';

    const resume: StructuredResume = {
      id: `bulk-resume-${i + 1}`,
      versionName: `${name} - Resume`,
      createdAt: new Date(Date.now() - (count - i) * 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
      fullName: name,
      email,
      phone: `+1 (555) ${100 + (i % 900)}-${1000 + (i % 9000)}`,
      location: i % 3 === 0 ? 'San Francisco, CA' : i % 2 === 0 ? 'Remote' : 'Austin, TX',
      summary: `Experienced analytical professional with ${yearsExp} years specializing in ${candidateSkills.slice(0, 3).join(', ')} and database analytics.`,
      skills: {
        technical: candidateSkills,
        soft: ['Communication', 'Analytical Thinking', 'Teamwork'],
        tools: ['Git', 'Excel', 'Docker']
      },
      experience: [
        {
          id: `exp-${i}-1`,
          company: `Tech Enterprise ${((i % 10) + 1)}`,
          jobTitle: yearsExp >= 4 ? 'Senior Data Specialist' : 'Data Analyst',
          startDate: `${2026 - Math.floor(yearsExp)}-01`,
          endDate: '2026-08',
          isCurrent: true,
          description: `Managed data reporting pipelines, executed SQL queries, and generated business intelligence metrics using ${candidateSkills.slice(0, 2).join(' and ')}.`,
          technologies: candidateSkills.slice(0, 4)
        }
      ],
      education: [
        {
          id: `edu-${i}`,
          institution: colleges[i % colleges.length],
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science / Analytics',
          graduationYear: `${2026 - Math.floor(yearsExp) - 1}`
        }
      ],
      projects: [
        {
          id: `proj-${i}`,
          title: `Analytics & Reporting Hub`,
          description: `Built automated dashboards tracking business performance using ${candidateSkills.slice(0, 2).join(', ')}.`,
          technologies: candidateSkills.slice(0, 3)
        }
      ],
      certifications: i % 3 === 0 ? [{ id: `c-${i}`, name: 'Microsoft Certified: Power BI Associate', issuer: 'Microsoft', issueDate: '2024-01' }] : [],
      extractionQuality
    };

    const atsAnalysis = evaluateResumeAgainstJob(resume, targetJob);

    results.push({
      id: `bulk-app-${i + 1}`,
      candidateId: resume.id,
      candidateName: resume.fullName,
      candidateEmail: resume.email,
      candidatePhone: resume.phone,
      jobId: targetJob.id,
      jobTitle: targetJob.title,
      companyName: targetJob.company,
      appliedDate: new Date(Date.now() - (count - i) * 1800000).toISOString(),
      stage: atsAnalysis.overallScore >= 85 ? 'shortlisted' : atsAnalysis.overallScore >= 70 ? 'screening' : 'applied',
      resume,
      atsAnalysis,
      recruiterNotes: [],
      tags: [
        atsAnalysis.overallScore >= 85 ? 'Top Match' : 'Processed',
        `${yearsExp} Yrs Exp`,
        resume.extractionQuality !== 'high' ? 'Review OCR' : 'Verified'
      ],
      recruiterRating: atsAnalysis.overallScore >= 85 ? 5 : atsAnalysis.overallScore >= 75 ? 4 : 3
    });
  }

  return results;
}

export const INITIAL_AUDIT_LOGS: ATSAuditRecord[] = [
  {
    id: 'audit-001',
    candidateName: 'Alex Rivera',
    jobTitle: 'Senior Data Analyst',
    overallScore: 89,
    confidenceScore: 94,
    breakdown: {
      skills: 92,
      experience: 95,
      responsibilities: 86,
      projects: 90,
      education: 95
    },
    modelVersion: 'ATS-Hybrid-v2.6',
    scoringVersion: 'Deterministic-Evidence-v1.4',
    timestamp: '2026-08-12T14:30:00Z',
    extractionQuality: 'high (100% text fidelity)',
    reviewerDecision: 'Shortlisted for Phone Screen',
    reviewerNotes: 'Verified Power BI certification and SQL pipeline depth.'
  },
  {
    id: 'audit-002',
    candidateName: 'David Kim',
    jobTitle: 'Senior Data Analyst',
    overallScore: 87,
    confidenceScore: 92,
    breakdown: {
      skills: 90,
      experience: 95,
      responsibilities: 84,
      projects: 85,
      education: 85
    },
    modelVersion: 'ATS-Hybrid-v2.6',
    scoringVersion: 'Deterministic-Evidence-v1.4',
    timestamp: '2026-08-11T16:15:00Z',
    extractionQuality: 'high (Clean format)',
    reviewerDecision: 'Technical Interview Passed',
    reviewerNotes: 'Strong Snowflake architecture knowledge.'
  },
  {
    id: 'audit-003',
    candidateName: 'Sophia Zhang',
    jobTitle: 'Machine Learning Engineer',
    overallScore: 93,
    confidenceScore: 96,
    breakdown: {
      skills: 95,
      experience: 90,
      responsibilities: 92,
      projects: 95,
      education: 95
    },
    modelVersion: 'ATS-Hybrid-v2.6',
    scoringVersion: 'Deterministic-Evidence-v1.4',
    timestamp: '2026-08-11T11:20:00Z',
    extractionQuality: 'high (Structured LaTeX CV)',
    reviewerDecision: 'Shortlisted for Deep AI Round',
    reviewerNotes: 'Direct match for PyTorch and Sentence-BERT transformers.'
  }
];

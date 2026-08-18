import { JobRequirement, StructuredResume, CandidateApplication, ATSAuditRecord } from '../types';
import { evaluateResumeAgainstJob } from './atsEngine';

export const SAMPLE_JOBS: JobRequirement[] = [
  // --- ENGINEERING & TECH ---
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
  },
  {
    id: 'job-frontend-assoc',
    title: 'Associate Frontend Developer',
    company: 'Veloce Digital Interfaces',
    department: 'Web Engineering',
    location: 'Chicago, IL (Hybrid)',
    type: 'Full-time',
    seniority: 'Entry',
    minExperienceYears: 1,
    salaryRange: '$80,000 - $105,000',
    summary: 'Develop interactive client-side web applications using React, TypeScript, and responsive CSS for high-traffic customer portals.',
    requiredSkills: ['React', 'JavaScript', 'HTML/CSS', 'TypeScript', 'Git'],
    preferredSkills: ['Next.js', 'Tailwind CSS', 'Redux', 'Jest', 'Figma'],
    responsibilities: [
      'Implement responsive UI components adhering to strict accessibility and design specifications',
      'Integrate frontend views with RESTful backend APIs and manage local client state',
      'Write unit tests for UI components to maintain high test coverage and zero regressions'
    ],
    educationRequirement: "Bachelor's degree in Computer Science, Web Development, or equivalent bootcamp certification",
    requiredCertifications: [],
    keywords: ['Frontend', 'React', 'JavaScript', 'TypeScript', 'CSS', 'UI Components', 'Responsive Design'],
    published: true,
    createdAt: '2026-08-11T08:00:00Z',
    applicationsCount: 54,
    scoringWeights: {
      skillsMatch: 35,
      experienceMatch: 15,
      responsibilitiesMatch: 25,
      projectsMatch: 15,
      educationMatch: 5,
      keywordsMatch: 3,
      certificationsMatch: 2
    }
  },
  {
    id: 'job-backend-sr',
    title: 'Senior Backend Engineer',
    company: 'Vanguard Systems',
    department: 'Distributed Platform Services',
    location: 'Seattle, WA (Remote)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 5,
    salaryRange: '$155,000 - $190,000',
    summary: 'Architect high-throughput microservices and distributed transaction engines utilizing Golang, Python, PostgreSQL, and Kafka.',
    requiredSkills: ['Golang', 'Python', 'PostgreSQL', 'Docker', 'Git', 'Cloud Architecture'],
    preferredSkills: ['Kubernetes', 'gRPC', 'Kafka', 'Redis', 'AWS'],
    responsibilities: [
      'Design fault-tolerant distributed services handling millions of concurrent financial transactions',
      'Optimize database query execution and data partitioning schemes for high concurrency',
      'Implement CI/CD pipeline automation and infrastructure as code'
    ],
    educationRequirement: "Bachelor's or Master's in Computer Science or Software Engineering",
    requiredCertifications: ['AWS Certified Solutions Architect (Preferred)'],
    keywords: ['Backend', 'Golang', 'Python', 'Microservices', 'PostgreSQL', 'Distributed Systems', 'Kafka'],
    published: true,
    createdAt: '2026-08-03T11:20:00Z',
    applicationsCount: 71,
    scoringWeights: {
      skillsMatch: 30,
      experienceMatch: 25,
      responsibilitiesMatch: 20,
      projectsMatch: 15,
      educationMatch: 5,
      keywordsMatch: 3,
      certificationsMatch: 2
    }
  },
  {
    id: 'job-devops-sr',
    title: 'Lead DevOps & Cloud Engineer',
    company: 'Aether Cloud Infrastructure',
    department: 'Site Reliability & Infrastructure',
    location: 'Denver, CO (Remote)',
    type: 'Full-time',
    seniority: 'Lead',
    minExperienceYears: 6,
    salaryRange: '$165,000 - $205,000',
    summary: 'Lead enterprise multi-cloud infrastructure automation, Kubernetes orchestration, CI/CD pipelines, and zero-trust security postures.',
    requiredSkills: ['AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Git', 'Cloud Architecture'],
    preferredSkills: ['Terraform', 'Helm', 'Prometheus', 'Golang', 'Linux'],
    responsibilities: [
      'Architect and oversee multi-region Kubernetes clusters across AWS and GCP environments',
      'Standardize infrastructure-as-code automation and automated vulnerability scanning pipelines',
      'Ensure 99.99% system availability through proactive telemetry, SLOs, and incident response automation'
    ],
    educationRequirement: "Bachelor's degree in Computer Science, Information Technology, or relevant domain",
    requiredCertifications: ['Certified Kubernetes Administrator (CKA)', 'AWS Solutions Architect Professional'],
    keywords: ['DevOps', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Cloud Architecture', 'Infrastructure'],
    published: true,
    createdAt: '2026-08-04T13:00:00Z',
    applicationsCount: 39,
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
    id: 'job-data-scientist',
    title: 'Senior Data Scientist',
    company: 'Quantis Predictive Labs',
    department: 'Statistical Research',
    location: 'Boston, MA (Hybrid)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 4,
    salaryRange: '$145,000 - $180,000',
    summary: 'Develop statistical learning models, predictive customer lifetime value algorithms, and causal inference experiments.',
    requiredSkills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Deep Learning'],
    preferredSkills: ['PyTorch', 'R', 'A/B Testing', 'Snowflake', 'Scikit-Learn'],
    responsibilities: [
      'Build end-to-end predictive machine learning models to forecast operational churn and revenue trends',
      'Formulate and analyze large-scale multi-variate randomized experiments',
      'Translate complex statistical models into actionable executive leadership recommendations'
    ],
    educationRequirement: "Master's or Ph.D. in Statistics, Mathematics, Data Science, or Computer Science",
    requiredCertifications: [],
    keywords: ['Data Science', 'Machine Learning', 'Python', 'Statistics', 'SQL', 'Predictive Modeling'],
    published: true,
    createdAt: '2026-08-06T15:30:00Z',
    applicationsCount: 63,
    scoringWeights: {
      skillsMatch: 35,
      experienceMatch: 25,
      responsibilitiesMatch: 20,
      projectsMatch: 10,
      educationMatch: 5,
      keywordsMatch: 3,
      certificationsMatch: 2
    }
  },
  {
    id: 'job-data-engineer',
    title: 'Data Platform Engineer',
    company: 'Nexus Stream Data',
    department: 'Data Platform',
    location: 'New York, NY (Hybrid)',
    type: 'Full-time',
    seniority: 'Mid',
    minExperienceYears: 3,
    salaryRange: '$130,000 - $160,000',
    summary: 'Build robust real-time ETL/ELT pipelines and scalable data lakehouse infrastructure utilizing Apache Spark, SQL, and Python.',
    requiredSkills: ['Python', 'SQL', 'Big Data', 'PostgreSQL', 'Docker'],
    preferredSkills: ['Spark', 'Snowflake', 'dbt', 'Airflow', 'Kafka'],
    responsibilities: [
      'Design, build, and optimize automated streaming and batch pipelines ingestion systems',
      'Enforce data governance, schema migrations, and real-time data quality monitoring suites',
      'Scale centralized data warehouse schemas for performant analytical querying'
    ],
    educationRequirement: "Bachelor's degree in Computer Science, Information Systems, or related quantitative field",
    requiredCertifications: ['Databricks Certified Data Engineer (Preferred)'],
    keywords: ['Data Engineering', 'SQL', 'Python', 'Spark', 'ETL', 'Pipelines', 'Snowflake'],
    published: true,
    createdAt: '2026-08-07T10:15:00Z',
    applicationsCount: 47,
    scoringWeights: {
      skillsMatch: 30,
      experienceMatch: 25,
      responsibilitiesMatch: 25,
      projectsMatch: 10,
      educationMatch: 5,
      keywordsMatch: 3,
      certificationsMatch: 2
    }
  },
  {
    id: 'job-sdet-qa',
    title: 'SDET & QA Automation Engineer',
    company: 'Precision Quality Labs',
    department: 'Quality Engineering',
    location: 'Remote (US)',
    type: 'Full-time',
    seniority: 'Mid',
    minExperienceYears: 3,
    salaryRange: '$110,000 - $140,000',
    summary: 'Develop automated test frameworks for web, API, and mobile applications to ensure zero-defect software deployments.',
    requiredSkills: ['JavaScript', 'TypeScript', 'Python', 'Git', 'CI/CD'],
    preferredSkills: ['Playwright', 'Cypress', 'Selenium', 'Postman', 'Docker'],
    responsibilities: [
      'Architect robust end-to-end automation test suites using Playwright and TypeScript',
      'Implement API contract tests and performance load testing pipelines in CI/CD',
      'Partner with software engineers to define test plans and triage defect reports'
    ],
    educationRequirement: "Bachelor's degree in Computer Science, Software Engineering, or equivalent experience",
    requiredCertifications: ['ISTQB Certified Tester (Preferred)'],
    keywords: ['QA', 'SDET', 'Automation', 'TypeScript', 'Playwright', 'Testing', 'CI/CD'],
    published: true,
    createdAt: '2026-08-09T09:00:00Z',
    applicationsCount: 31,
    scoringWeights: {
      skillsMatch: 35,
      experienceMatch: 20,
      responsibilitiesMatch: 25,
      projectsMatch: 10,
      educationMatch: 5,
      keywordsMatch: 3,
      certificationsMatch: 2
    }
  },
  {
    id: 'job-mobile-engineer',
    title: 'Mobile Engineer (Flutter & Android)',
    company: 'Apex Mobile Interactive',
    department: 'Client Engineering',
    location: 'Atlanta, GA (Hybrid)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 4,
    salaryRange: '$135,000 - $170,000',
    summary: 'Engineer smooth, 60fps cross-platform mobile applications with Flutter and native Android integrations.',
    requiredSkills: ['Flutter', 'Android', 'JavaScript', 'Git', 'HTML/CSS'],
    preferredSkills: ['Dart', 'Kotlin', 'Firebase', 'State Management', 'REST APIs'],
    responsibilities: [
      'Architect cross-platform client mobile apps using Flutter and modern declarative UI standards',
      'Integrate push notifications, background sync workers, and local SQLite data caching',
      'Publish and maintain releases on Google Play Store and Apple App Store'
    ],
    educationRequirement: "Bachelor's in Computer Science, Software Engineering, or equivalent experience",
    requiredCertifications: [],
    keywords: ['Mobile', 'Flutter', 'Android', 'Dart', 'Kotlin', 'Cross-Platform', 'Mobile App'],
    published: true,
    createdAt: '2026-08-10T14:40:00Z',
    applicationsCount: 45,
    scoringWeights: {
      skillsMatch: 35,
      experienceMatch: 25,
      responsibilitiesMatch: 20,
      projectsMatch: 10,
      educationMatch: 5,
      keywordsMatch: 3,
      certificationsMatch: 2
    }
  },
  {
    id: 'job-cloud-architect',
    title: 'Cloud Solutions Architect',
    company: 'Horizon Cloud Advisors',
    department: 'Enterprise Architecture',
    location: 'San Jose, CA (Remote)',
    type: 'Full-time',
    seniority: 'Lead',
    minExperienceYears: 7,
    salaryRange: '$180,000 - $225,000',
    summary: 'Lead cloud transformation, governance, enterprise security architecture, and disaster recovery strategies for Fortune 500 clients.',
    requiredSkills: ['Cloud Architecture', 'AWS', 'Docker', 'Kubernetes', 'Problem Solving', 'Leadership'],
    preferredSkills: ['Azure', 'GCP', 'Terraform', 'Security Architecture', 'Microservices'],
    responsibilities: [
      'Design high-availability, multi-region enterprise cloud landing zones and governance models',
      'Guide executive stakeholders through legacy application modernization and cloud migrations',
      'Establish enterprise architectural standards, cost optimization protocols, and compliance guardrails'
    ],
    educationRequirement: "Bachelor's or Master's degree in Computer Science, Information Systems, or Engineering",
    requiredCertifications: ['AWS Certified Solutions Architect Professional', 'CISSP (Preferred)'],
    keywords: ['Cloud Architect', 'AWS', 'Architecture', 'Enterprise', 'Cloud Migration', 'Security'],
    published: true,
    createdAt: '2026-08-02T16:00:00Z',
    applicationsCount: 28,
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
    id: 'job-cybersecurity-analyst',
    title: 'Cybersecurity & SOC Analyst',
    company: 'Sentinel Defense Network',
    department: 'Information Security',
    location: 'Washington, DC (Hybrid)',
    type: 'Full-time',
    seniority: 'Mid',
    minExperienceYears: 3,
    salaryRange: '$115,000 - $145,000',
    summary: 'Monitor threat vectors, analyze SIEM telemetry, manage incident response protocols, and enforce security controls.',
    requiredSkills: ['Problem Solving', 'Communication', 'Git', 'Cloud Architecture', 'Python'],
    preferredSkills: ['SIEM', 'Splunk', 'Wireshark', 'Incident Response', 'Vulnerability Assessment'],
    responsibilities: [
      'Monitor and investigate security alerts across network perimeter and cloud endpoints',
      'Conduct vulnerability scans, threat modeling exercises, and remediation tracking',
      'Author formal incident post-mortems and refine defensive automation runbooks'
    ],
    educationRequirement: "Bachelor's degree in Cybersecurity, Information Assurance, Computer Science, or equivalent",
    requiredCertifications: ['CompTIA Security+', 'Certified Information Systems Security Professional (CISSP)'],
    keywords: ['Cybersecurity', 'SOC', 'Security', 'Incident Response', 'SIEM', 'Vulnerability Analysis'],
    published: true,
    createdAt: '2026-08-06T11:00:00Z',
    applicationsCount: 35,
    scoringWeights: {
      skillsMatch: 30,
      experienceMatch: 25,
      responsibilitiesMatch: 25,
      projectsMatch: 10,
      educationMatch: 5,
      keywordsMatch: 2,
      certificationsMatch: 3
    }
  },

  // --- PRODUCT & DESIGN ---
  {
    id: 'job-product-manager-assoc',
    title: 'Associate Product Manager',
    company: 'Pulse Digital Labs',
    department: 'Product Management',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    seniority: 'Entry',
    minExperienceYears: 1,
    salaryRange: '$95,000 - $120,000',
    summary: 'Drive product requirement documentation, user feedback synthesis, and agile sprint delivery for growth-oriented SaaS features.',
    requiredSkills: ['Agile', 'Communication', 'Problem Solving', 'Data Analysis', 'Leadership'],
    preferredSkills: ['Jira', 'SQL', 'User Research', 'Figma', 'A/B Testing'],
    responsibilities: [
      'Gather and analyze user feedback to write crisp Product Requirement Documents (PRDs)',
      'Partner closely with design and engineering teams through sprint planning and daily standups',
      'Track feature adoption metrics and present experiment findings to product leadership'
    ],
    educationRequirement: "Bachelor's degree in Business, Computer Science, Economics, or related discipline",
    requiredCertifications: [],
    keywords: ['Product Manager', 'APM', 'Agile', 'PRD', 'Product Strategy', 'Scrum', 'Data Analysis'],
    published: true,
    createdAt: '2026-08-11T12:00:00Z',
    applicationsCount: 82,
    scoringWeights: {
      skillsMatch: 30,
      experienceMatch: 20,
      responsibilitiesMatch: 25,
      projectsMatch: 15,
      educationMatch: 5,
      keywordsMatch: 3,
      certificationsMatch: 2
    }
  },
  {
    id: 'job-product-manager-lead',
    title: 'Principal Product Manager',
    company: 'Stratos Enterprise Software',
    department: 'Product Leadership',
    location: 'San Francisco, CA (Remote)',
    type: 'Full-time',
    seniority: 'Lead',
    minExperienceYears: 7,
    salaryRange: '$180,000 - $225,000',
    summary: 'Define strategic multi-year product vision, align executive roadmaps, and lead cross-functional squads to drive enterprise ARR.',
    requiredSkills: ['Leadership', 'Agile', 'Communication', 'Problem Solving', 'Data Analysis'],
    preferredSkills: ['Roadmapping', 'SaaS Pricing', 'Executive Presentation', 'Customer Discovery'],
    responsibilities: [
      'Establish unified multi-year product strategy for core enterprise B2B platform products',
      'Lead cross-functional teams of engineering managers, designers, and go-to-market teams',
      'Drive customer Advisory Boards and negotiate high-impact strategic partnership integrations'
    ],
    educationRequirement: "Bachelor's or Master's degree (MBA preferred) in Business or Engineering",
    requiredCertifications: [],
    keywords: ['Product Management', 'Principal PM', 'Product Strategy', 'Roadmap', 'B2B SaaS', 'Leadership'],
    published: true,
    createdAt: '2026-08-01T15:00:00Z',
    applicationsCount: 46,
    scoringWeights: {
      skillsMatch: 30,
      experienceMatch: 30,
      responsibilitiesMatch: 20,
      projectsMatch: 10,
      educationMatch: 5,
      keywordsMatch: 3,
      certificationsMatch: 2
    }
  },
  {
    id: 'job-ux-ui-designer',
    title: 'UI/UX Product Designer',
    company: 'Canvas Craft Studios',
    department: 'Design Systems & UX',
    location: 'Los Angeles, CA (Hybrid)',
    type: 'Full-time',
    seniority: 'Mid',
    minExperienceYears: 3,
    salaryRange: '$115,000 - $145,000',
    summary: 'Create intuitive user journeys, wireframes, interactive prototypes, and design system components for complex web and mobile workflows.',
    requiredSkills: ['HTML/CSS', 'Problem Solving', 'Communication', 'Agile'],
    preferredSkills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Usability Testing'],
    responsibilities: [
      'Conduct user interviews, usability tests, and synthesize behavioral research into actionable flows',
      'Produce high-fidelity interactive Figma prototypes and scalable component design systems',
      'Collaborate with frontend developers to ensure design fidelity and micro-interaction polish'
    ],
    educationRequirement: "Bachelor's degree in Human-Computer Interaction (HCI), Graphic Design, or equivalent portfolio",
    requiredCertifications: [],
    keywords: ['UX Designer', 'UI Designer', 'Figma', 'Design System', 'Wireframing', 'User Research'],
    published: true,
    createdAt: '2026-08-07T13:30:00Z',
    applicationsCount: 75,
    scoringWeights: {
      skillsMatch: 35,
      experienceMatch: 20,
      responsibilitiesMatch: 25,
      projectsMatch: 15,
      educationMatch: 3,
      keywordsMatch: 2,
      certificationsMatch: 0
    }
  },

  // --- BUSINESS & OPERATIONS ---
  {
    id: 'job-business-analyst',
    title: 'Senior Business Systems Analyst',
    company: 'Apex Enterprise Consulting',
    department: 'Business Strategy',
    location: 'Chicago, IL (Hybrid)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 4,
    salaryRange: '$120,000 - $150,000',
    summary: 'Translate complex business requirements into technical system specifications, optimize ERP/CRM workflows, and lead process audits.',
    requiredSkills: ['SQL', 'Data Analysis', 'Communication', 'Problem Solving', 'Agile'],
    preferredSkills: ['Business Intelligence', 'Tableau', 'Visio', 'Process Mapping', 'Excel Modeling'],
    responsibilities: [
      'Bridge the gap between executive business stakeholders and technical software engineering squads',
      'Document detailed business requirements (BRD), user stories, and acceptance criteria',
      'Perform data validation queries in SQL and model financial process improvements'
    ],
    educationRequirement: "Bachelor's degree in Business Administration, Information Systems, or Finance",
    requiredCertifications: ['CBAP (Certified Business Analysis Professional) (Preferred)'],
    keywords: ['Business Analyst', 'Requirements Gathering', 'SQL', 'BRD', 'Process Optimization', 'Agile'],
    published: true,
    createdAt: '2026-08-04T10:00:00Z',
    applicationsCount: 52,
    scoringWeights: {
      skillsMatch: 30,
      experienceMatch: 25,
      responsibilitiesMatch: 25,
      projectsMatch: 10,
      educationMatch: 5,
      keywordsMatch: 3,
      certificationsMatch: 2
    }
  },
  {
    id: 'job-project-manager',
    title: 'Technical Project Manager',
    company: 'CoreWave Solutions',
    department: 'Program Management Office',
    location: 'Dallas, TX (Remote)',
    type: 'Full-time',
    seniority: 'Mid',
    minExperienceYears: 4,
    salaryRange: '$125,000 - $155,000',
    summary: 'Manage software delivery milestones, cross-functional dependencies, project budgets, and risk mitigation across multi-team programs.',
    requiredSkills: ['Agile', 'Leadership', 'Communication', 'Problem Solving'],
    preferredSkills: ['PMP', 'Jira', 'Scrum Master', 'Risk Management', 'Budget Tracking'],
    responsibilities: [
      'Lead agile release planning, track sprint velocity, and unblock cross-functional engineering teams',
      'Manage scope, schedule, and stakeholder communication for complex multi-quarter programs',
      'Identify operational bottlenecks, mitigate project risks, and deliver status reports to leadership'
    ],
    educationRequirement: "Bachelor's degree in Business, Computer Science, or Management",
    requiredCertifications: ['Project Management Professional (PMP)', 'Certified ScrumMaster (CSM)'],
    keywords: ['Project Manager', 'PMP', 'Scrum', 'Agile', 'Program Management', 'Risk Management'],
    published: true,
    createdAt: '2026-08-08T11:00:00Z',
    applicationsCount: 48,
    scoringWeights: {
      skillsMatch: 30,
      experienceMatch: 25,
      responsibilitiesMatch: 25,
      projectsMatch: 10,
      educationMatch: 5,
      keywordsMatch: 2,
      certificationsMatch: 3
    }
  },

  // --- MARKETING & SALES ---
  {
    id: 'job-digital-marketing',
    title: 'Digital Marketing & Growth Specialist',
    company: 'OmniReach Growth Agency',
    department: 'Growth Marketing',
    location: 'Miami, FL (Remote)',
    type: 'Full-time',
    seniority: 'Mid',
    minExperienceYears: 3,
    salaryRange: '$90,000 - $120,000',
    summary: 'Design and execute multi-channel paid acquisition campaigns, manage ad budgets across Google & Meta, and optimize conversion funnels.',
    requiredSkills: ['Data Analysis', 'Communication', 'Problem Solving'],
    preferredSkills: ['Google Ads', 'Meta Ads Manager', 'SEO', 'Google Analytics 4', 'A/B Testing', 'HubSpot'],
    responsibilities: [
      'Manage performance marketing campaigns across Google Ads, LinkedIn, and Meta to drive qualified MQLs',
      'Perform continuous landing page A/B testing and attribution analysis to lower CAC by 20%+',
      'Build automated analytics reporting funnels to calculate customer lifetime value and ROAS'
    ],
    educationRequirement: "Bachelor's degree in Marketing, Communications, Business, or related discipline",
    requiredCertifications: ['Google Ads Certified', 'HubSpot Inbound Marketing'],
    keywords: ['Digital Marketing', 'Paid Media', 'Google Ads', 'SEO', 'Growth Marketing', 'CAC', 'ROAS'],
    published: true,
    createdAt: '2026-08-09T16:00:00Z',
    applicationsCount: 65,
    scoringWeights: {
      skillsMatch: 30,
      experienceMatch: 25,
      responsibilitiesMatch: 25,
      projectsMatch: 10,
      educationMatch: 5,
      keywordsMatch: 3,
      certificationsMatch: 2
    }
  },
  {
    id: 'job-account-executive',
    title: 'Enterprise Account Executive',
    company: 'CloudGate SaaS Platforms',
    department: 'Enterprise Sales',
    location: 'New York, NY (Hybrid)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 5,
    salaryRange: '$140,000 - $260,000 (OTE)',
    summary: 'Drive full-cycle enterprise B2B sales cycles from discovery to contract negotiation, closing $100K+ ACV deals with C-level executives.',
    requiredSkills: ['Communication', 'Leadership', 'Problem Solving'],
    preferredSkills: ['MEDDPICC', 'Salesforce', 'Enterprise Sales', 'Contract Negotiation', 'Cold Outreach'],
    responsibilities: [
      'Execute enterprise sales strategies targeting Fortune 1000 technical decision makers',
      'Manage complex multi-stakeholder procurement and legal contract negotiation cycles',
      'Consistently exceed quarterly quota quotas through disciplined pipeline generation and MEDDPICC qualification'
    ],
    educationRequirement: "Bachelor's degree in Business, Communications, or equivalent sales track record",
    requiredCertifications: [],
    keywords: ['Account Executive', 'Enterprise Sales', 'B2B SaaS', 'MEDDPICC', 'Closing', 'Quota'],
    published: true,
    createdAt: '2026-08-05T14:00:00Z',
    applicationsCount: 41,
    scoringWeights: {
      skillsMatch: 25,
      experienceMatch: 35,
      responsibilitiesMatch: 25,
      projectsMatch: 5,
      educationMatch: 5,
      keywordsMatch: 5,
      certificationsMatch: 0
    }
  },

  // --- FINANCE & HR ---
  {
    id: 'job-financial-analyst',
    title: 'Senior Financial Analyst',
    company: 'Capital Peak Advisory',
    department: 'Corporate FP&A',
    location: 'Charlotte, NC (Hybrid)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 4,
    salaryRange: '$115,000 - $145,000',
    summary: 'Build complex financial forecasting models, variance analyses, and annual operating budget presentations for executive leadership.',
    requiredSkills: ['SQL', 'Data Analysis', 'Communication', 'Problem Solving'],
    preferredSkills: ['Financial Modeling', 'Excel VBA', 'Power BI', 'DCF Valuation', 'Budgeting'],
    responsibilities: [
      'Develop three-statement financial forecasting models and capital expenditure forecasts',
      'Analyze monthly budget-to-actual variances and provide strategic cost optimization recommendations',
      'Prepare quarterly board presentation decks with clean financial KPI visualizations'
    ],
    educationRequirement: "Bachelor's in Finance, Accounting, Economics, or MBA",
    requiredCertifications: ['CFA (Chartered Financial Analyst) Level 1+ or CPA (Preferred)'],
    keywords: ['Financial Analyst', 'FP&A', 'Financial Modeling', 'Budgeting', 'Forecasting', 'Excel', 'CFA'],
    published: true,
    createdAt: '2026-08-03T14:30:00Z',
    applicationsCount: 59,
    scoringWeights: {
      skillsMatch: 30,
      experienceMatch: 25,
      responsibilitiesMatch: 25,
      projectsMatch: 10,
      educationMatch: 5,
      keywordsMatch: 3,
      certificationsMatch: 2
    }
  },
  {
    id: 'job-recruiter-ta',
    title: 'Senior Technical Recruiter',
    company: 'TalentScale Partners',
    department: 'Talent Acquisition',
    location: 'Seattle, WA (Remote)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 4,
    salaryRange: '$110,000 - $140,000',
    summary: 'Lead full-cycle technical recruiting for specialized engineering, AI/ML, and product leadership roles in high-growth technology environments.',
    requiredSkills: ['Communication', 'Leadership', 'Problem Solving'],
    preferredSkills: ['ATS Management', 'Technical Sourcing', 'LinkedIn Recruiter', 'Offer Negotiation', 'Diversity Hiring'],
    responsibilities: [
      'Partner with engineering VPs and hiring managers to calibrate candidate scorecards and hiring standards',
      'Build active candidate sourcing pipelines for niche software, ML, and distributed systems talent',
      'Deliver world-class candidate experience and negotiate closing offer packages'
    ],
    educationRequirement: "Bachelor's degree in Human Resources, Communications, Business, or equivalent",
    requiredCertifications: ['AIRS Certified Internet Recruiter (CIR) (Preferred)'],
    keywords: ['Technical Recruiter', 'Talent Acquisition', 'Sourcing', 'ATS', 'Full-Cycle Recruiting', 'Hiring'],
    published: true,
    createdAt: '2026-08-07T11:00:00Z',
    applicationsCount: 38,
    scoringWeights: {
      skillsMatch: 25,
      experienceMatch: 30,
      responsibilitiesMatch: 30,
      projectsMatch: 5,
      educationMatch: 5,
      keywordsMatch: 3,
      certificationsMatch: 2
    }
  },

  // --- HEALTHCARE & CLINICAL ---
  {
    id: 'job-registered-nurse',
    title: 'Clinical Nurse Specialist & Informatics',
    company: 'Providence Health Systems',
    department: 'Clinical Quality & Informatics',
    location: 'Portland, OR (On-site)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 4,
    salaryRange: '$105,000 - $135,000',
    summary: 'Provide patient care expertise while optimizing electronic health records (EHR) workflows, clinical documentation, and hospital quality standards.',
    requiredSkills: ['Communication', 'Problem Solving', 'Leadership'],
    preferredSkills: ['EHR', 'Epic Systems', 'Clinical Informatics', 'Patient Care', 'Healthcare Compliance'],
    responsibilities: [
      'Deliver evidence-based clinical protocols and mentor nursing staff on critical care workflows',
      'Collaborate with health IT analysts to refine Epic EHR clinical documentation templates',
      'Monitor hospital quality metrics and ensure strict adherence to Joint Commission and HIPAA standards'
    ],
    educationRequirement: "Bachelor of Science in Nursing (BSN) or Master's in Nursing Informatics (MSN)",
    requiredCertifications: ['Registered Nurse (RN) License', 'Informatics Nursing Certification (RN-BC) (Preferred)'],
    keywords: ['Nurse', 'RN', 'Clinical Informatics', 'Epic', 'Healthcare', 'Patient Care', 'EHR'],
    published: true,
    createdAt: '2026-08-02T09:00:00Z',
    applicationsCount: 22,
    scoringWeights: {
      skillsMatch: 25,
      experienceMatch: 30,
      responsibilitiesMatch: 25,
      projectsMatch: 5,
      educationMatch: 5,
      keywordsMatch: 5,
      certificationsMatch: 5
    }
  },
  {
    id: 'job-clinical-data-coord',
    title: 'Clinical Data Management Coordinator',
    company: 'BioVance Clinical Trials',
    department: 'Biometrics & Clinical Research',
    location: 'Raleigh, NC (Hybrid)',
    type: 'Full-time',
    seniority: 'Mid',
    minExperienceYears: 3,
    salaryRange: '$85,000 - $115,000',
    summary: 'Coordinate clinical trial electronic data capture (EDC), manage query resolution workflows, and validate data integrity for FDA regulatory submissions.',
    requiredSkills: ['Data Analysis', 'SQL', 'Problem Solving', 'Communication'],
    preferredSkills: ['EDC', 'Medidata Rave', 'GCP Compliance', 'CDISC SDTM', 'Clinical Trials'],
    responsibilities: [
      'Design and validate Electronic Case Report Forms (eCRF) in compliance with clinical trial protocols',
      'Execute automated data discrepancy checks and manage clinical investigator site queries',
      'Prepare clean, locked clinical databases ready for statistical analysis and FDA submission'
    ],
    educationRequirement: "Bachelor's degree in Life Sciences, Health Informatics, Statistics, or related discipline",
    requiredCertifications: ['Certified Clinical Data Manager (CCDM) (Preferred)'],
    keywords: ['Clinical Data', 'EDC', 'Clinical Trials', 'GCP', 'Medidata Rave', 'Data Management', 'FDA'],
    published: true,
    createdAt: '2026-08-06T13:00:00Z',
    applicationsCount: 29,
    scoringWeights: {
      skillsMatch: 30,
      experienceMatch: 25,
      responsibilitiesMatch: 25,
      projectsMatch: 10,
      educationMatch: 5,
      keywordsMatch: 3,
      certificationsMatch: 2
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

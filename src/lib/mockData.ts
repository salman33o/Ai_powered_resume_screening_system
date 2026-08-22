import { JobRequirement, StructuredResume, CandidateApplication, ATSAuditRecord, InterviewQuestionItem } from '../types';
import { evaluateResumeAgainstJob } from './atsEngine';

export interface SectorTaxonomy {
  sector: string;
  id: string;
  roles: string[];
}

export const INDUSTRY_SECTOR_TAXONOMY: SectorTaxonomy[] = [
  {
    sector: 'IT & Software',
    id: 'it-software',
    roles: ['Software Developer', 'Software Engineer', 'Python Developer', 'Java Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer']
  },
  {
    sector: 'Data & AI',
    id: 'data-ai',
    roles: ['Data Analyst', 'Data Scientist', 'Data Engineer', 'AI Engineer', 'Machine Learning Engineer', 'BI Analyst', 'BI Developer']
  },
  {
    sector: 'Cybersecurity',
    id: 'cybersecurity',
    roles: ['Cybersecurity Analyst', 'Security Engineer', 'SOC Analyst', 'Ethical Hacker', 'Penetration Tester']
  },
  {
    sector: 'Cloud & DevOps',
    id: 'cloud-devops',
    roles: ['Cloud Engineer', 'DevOps Engineer', 'AWS Engineer', 'Azure Engineer', 'SRE']
  },
  {
    sector: 'Business & Management',
    id: 'business-management',
    roles: ['Business Analyst', 'Management Consultant', 'Project Coordinator', 'Project Manager', 'Operations Analyst']
  },
  {
    sector: 'Finance',
    id: 'finance',
    roles: ['Financial Analyst', 'Investment Analyst', 'Credit Analyst', 'Risk Analyst', 'Accountant', 'Banking Officer']
  },
  {
    sector: 'Marketing',
    id: 'marketing',
    roles: ['Digital Marketing Executive', 'SEO Specialist', 'Marketing Analyst', 'Social Media Manager', 'Brand Manager']
  },
  {
    sector: 'HR',
    id: 'hr',
    roles: ['HR Executive', 'HR Analyst', 'Recruiter', 'Talent Acquisition Specialist', 'HR Business Partner']
  },
  {
    sector: 'Engineering',
    id: 'engineering',
    roles: ['Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer', 'Electronics Engineer', 'Manufacturing Engineer']
  },
  {
    sector: 'Healthcare',
    id: 'healthcare',
    roles: ['Healthcare Data Analyst', 'Clinical Research Associate', 'Medical Coder', 'Hospital Administrator']
  },
  {
    sector: 'Manufacturing',
    id: 'manufacturing',
    roles: ['Production Engineer', 'Quality Engineer', 'Process Engineer', 'Industrial Engineer']
  },
  {
    sector: 'Automobile',
    id: 'automobile',
    roles: ['Automotive Engineer', 'EV Engineer', 'Automotive Software Engineer', 'Automotive Test Engineer']
  },
  {
    sector: 'Textile',
    id: 'textile',
    roles: ['Textile Engineer', 'Fashion Designer', 'Merchandiser', 'Garment Technologist', 'Textile Quality Analyst']
  },
  {
    sector: 'Construction',
    id: 'construction',
    roles: ['Civil Engineer', 'Site Engineer', 'Structural Engineer', 'Planning Engineer', 'Quantity Surveyor']
  },
  {
    sector: 'Logistics',
    id: 'logistics',
    roles: ['Supply Chain Analyst', 'Logistics Executive', 'Procurement Executive', 'Operations Analyst']
  },
  {
    sector: 'E-commerce',
    id: 'ecommerce',
    roles: ['E-commerce Executive', 'E-commerce Analyst', 'Marketplace Manager', 'Catalog Specialist']
  },
  {
    sector: 'Media',
    id: 'media',
    roles: ['Content Writer', 'Graphic Designer', 'Video Editor', 'UI/UX Designer', 'Journalist']
  },
  {
    sector: 'Sales',
    id: 'sales',
    roles: ['Sales Executive', 'Business Development Executive', 'Account Executive', 'Sales Engineer']
  },
  {
    sector: 'Education',
    id: 'education',
    roles: ['Teacher', 'Lecturer', 'Academic Counselor', 'Instructional Designer']
  },
  {
    sector: 'Research',
    id: 'research',
    roles: ['Research Assistant', 'Research Associate', 'Research Scientist', 'R&D Engineer']
  }
];

export const SAMPLE_JOBS: JobRequirement[] = [
  // ==========================================
  // 1. INFORMATION TECHNOLOGY & AI (IT / AI)
  // ==========================================
  {
    id: 'job-data-analyst',
    title: 'Senior Data Analyst',
    company: 'Apex Analytics & FinTech',
    department: 'Information Technology & Data',
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
    department: 'Information Technology & Data',
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
    department: 'Information Technology & Data',
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
    id: 'job-devops-sr',
    title: 'Lead DevOps & Cloud Engineer',
    company: 'Aether Cloud Infrastructure',
    department: 'Information Technology & Data',
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
    id: 'job-cybersecurity-analyst',
    title: 'Cybersecurity & SOC Analyst',
    company: 'Sentinel Defense Network',
    department: 'Information Technology & Data',
    location: 'Washington, DC (Hybrid)',
    type: 'Full-time',
    seniority: 'Mid',
    minExperienceYears: 3,
    salaryRange: '$115,000 - $145,000',
    summary: 'Monitor threat vectors, analyze SIEM telemetry, manage incident response protocols, and enforce security controls.',
    requiredSkills: ['Cybersecurity', 'SIEM', 'Python', 'Incident Response', 'Network Security', 'Firewalls'],
    preferredSkills: ['Splunk', 'Wireshark', 'Vulnerability Assessment', 'Linux', 'Ethical Hacking'],
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

  // ==========================================
  // 2. ELECTRICAL & ELECTRONICS (EEE / ECE)
  // ==========================================
  {
    id: 'job-eee-power-systems',
    title: 'Electrical Power Systems Engineer',
    company: 'GridVolt Energy Systems',
    department: 'Electrical & Electronics (EEE)',
    location: 'Houston, TX (Hybrid)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 5,
    salaryRange: '$125,000 - $160,000',
    summary: 'Design high-voltage substation distributions, perform electrical load calculations in ETAP/MATLAB, configure SCADA telemetry, and oversee power quality compliance.',
    requiredSkills: ['Power Systems', 'Circuit Design', 'MATLAB/Simulink', 'ETAP', 'PLC/SCADA', 'AutoCAD Electrical'],
    preferredSkills: ['High Voltage Systems', 'Protection Relays', 'Renewable Energy Integration', 'Substation Design', 'IEEE Standards'],
    responsibilities: [
      'Perform electrical load flow, short circuit, and protection coordination studies using ETAP and MATLAB',
      'Design medium to high voltage power distribution schematics and single-line diagrams (SLDs)',
      'Program and integrate PLC/SCADA industrial controllers for remote substation monitoring',
      'Ensure all electrical installations comply strictly with NEC, NESC, and IEEE safety codes'
    ],
    educationRequirement: "Bachelor's or Master's in Electrical Engineering (EEE / Power Systems)",
    requiredCertifications: ['Professional Engineer (PE) License or EIT Certification (Preferred)'],
    keywords: ['Electrical Engineering', 'Power Systems', 'ETAP', 'MATLAB', 'Circuit Design', 'Substations', 'SCADA', 'PLC', 'High Voltage'],
    published: true,
    createdAt: '2026-08-10T11:00:00Z',
    applicationsCount: 29,
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
    id: 'job-eee-embedded-firmware',
    title: 'Embedded Systems & Firmware Engineer',
    company: 'OptiChip Microelectronics',
    department: 'Electrical & Electronics (EEE)',
    location: 'Boston, MA (On-site)',
    type: 'Full-time',
    seniority: 'Mid',
    minExperienceYears: 3,
    salaryRange: '$120,000 - $155,000',
    summary: 'Develop low-level C/C++ bare-metal firmware, RTOS drivers, PCB schematics, and IoT hardware sensor interfaces for smart electronics.',
    requiredSkills: ['Embedded C', 'C++', 'ARM Cortex Microcontrollers', 'PCB Design', 'RTOS', 'SPI/I2C/UART Protocols'],
    preferredSkills: ['Altium Designer', 'KiCAD', 'Oscilloscopes & Logic Analyzers', 'BLE/Zigbee', 'Firmware Debugging'],
    responsibilities: [
      'Develop deterministic low-power embedded firmware in C and C++ for ARM microcontrollers',
      'Design multi-layer PCB hardware layouts and circuit schematics in Altium Designer',
      'Validate hardware-software integration using logic analyzers, digital oscilloscopes, and spectrum analyzers',
      'Implement communication bus protocols including I2C, SPI, CAN bus, and UART'
    ],
    educationRequirement: "Bachelor's in Electrical & Electronics Engineering, Electronics & Communication (ECE), or Computer Engineering",
    requiredCertifications: [],
    keywords: ['Embedded Systems', 'Firmware', 'C/C++', 'ARM Cortex', 'Altium', 'PCB Design', 'RTOS', 'Microcontrollers', 'I2C/SPI'],
    published: true,
    createdAt: '2026-08-09T14:30:00Z',
    applicationsCount: 38,
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

  // ==========================================
  // 3. AGRICULTURE & AGTECH (AGRI)
  // ==========================================
  {
    id: 'job-agri-precision-spec',
    title: 'Precision Agriculture & AgTech Specialist',
    company: 'TerraCrop Precision Ag',
    department: 'Agriculture & Smart AgTech',
    location: 'Des Moines, IA (Hybrid)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 4,
    salaryRange: '$110,000 - $145,000',
    summary: 'Leverage GIS satellite imagery, IoT soil sensor telemetry, drone crop analytics, and yield predictive models to optimize sustainable crop production.',
    requiredSkills: ['Precision Agriculture', 'GIS Mapping & Spatial Analysis', 'Soil Science & Agronomy', 'Drone Crop Analytics', 'Data Analysis', 'IoT Sensors'],
    preferredSkills: ['Python for Geospatial Data', 'QGIS / ArcGIS', 'Variable Rate Technology (VRT)', 'Yield Modeling', 'GPS Guidance Systems'],
    responsibilities: [
      'Analyze multi-spectral drone imagery and satellite NDVI index maps to detect crop stress and nutrient deficiencies',
      'Calibrate and configure variable-rate fertilizer (VRT) prescriptions and automated GPS tractor guidance',
      'Manage telemetry streams from IoT moisture sensors and automated irrigation controllers across 20,000+ acres',
      'Deliver data-backed agronomic crop advisory reports to commercial farm operators'
    ],
    educationRequirement: "Bachelor's or Master's in Agronomy, Agricultural Engineering, Crop Science, or Precision AgTech",
    requiredCertifications: ['Certified Crop Adviser (CCA) or FAA Part 107 Drone Pilot License (Preferred)'],
    keywords: ['Agriculture', 'Precision Ag', 'Agronomy', 'GIS', 'ArcGIS', 'Crop Science', 'IoT Sensors', 'Drone Analytics', 'Yield Optimization'],
    published: true,
    createdAt: '2026-08-08T09:00:00Z',
    applicationsCount: 22,
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
    id: 'job-agri-food-supply',
    title: 'Agronomist & Food Quality Supply Manager',
    company: 'Verdant Harvest Organics',
    department: 'Agriculture & Smart AgTech',
    location: 'Sacramento, CA (On-site)',
    type: 'Full-time',
    seniority: 'Mid',
    minExperienceYears: 3,
    salaryRange: '$95,000 - $125,000',
    summary: 'Oversee sustainable crop cultivation, organic soil health audits, post-harvest cold chain logistics, and USDA organic regulatory certifications.',
    requiredSkills: ['Agronomy', 'Soil Fertility Management', 'Pest Management (IPM)', 'Food Safety & HACCP', 'Crop Rotation Planning'],
    preferredSkills: ['Organic Certification Standards', 'Cold Chain Logistics', 'Supply Chain Tracking', 'Crop Scouting', 'Farm ERP Software'],
    responsibilities: [
      'Develop integrated pest management (IPM) and biological soil nutrition protocols across organic orchards and fields',
      'Conduct regular field scouting, disease diagnostic tests, and soil chemical composition audits',
      'Ensure strict adherence to USDA Organic, GAP, and FSMA food safety quality guidelines',
      'Coordinate post-harvest transport and temperature-controlled cold chain distribution'
    ],
    educationRequirement: "Bachelor's in Agriculture, Horticulture, Plant Pathology, or Food Science",
    requiredCertifications: ['Certified Crop Adviser (CCA) or HACCP Certification'],
    keywords: ['Agronomy', 'Soil Management', 'Food Safety', 'Organic', 'Crop Science', 'HACCP', 'Horticulture', 'Harvest'],
    published: true,
    createdAt: '2026-08-07T12:00:00Z',
    applicationsCount: 19,
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

  // ==========================================
  // 4. ARTS, DESIGN & MEDIA (ART / CREATIVE)
  // ==========================================
  {
    id: 'job-art-creative-director',
    title: 'Creative Art Director & Brand Designer',
    company: 'Prism & Canvas Creative Agency',
    department: 'Arts, Design & Media',
    location: 'New York, NY (Hybrid)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 6,
    salaryRange: '$130,000 - $170,000',
    summary: 'Lead multi-channel visual brand identity, typography systems, editorial layouts, motion design guidelines, and creative campaign art direction.',
    requiredSkills: ['Visual Brand Identity', 'Typography', 'Adobe Creative Suite (Photoshop, Illustrator, InDesign)', 'Art Direction', 'Creative Campaign Strategy'],
    preferredSkills: ['Figma', 'After Effects', 'Design Systems', '3D Asset Creation', 'Editorial Design', 'Color Theory'],
    responsibilities: [
      'Direct overarching visual identity systems, typography guidelines, and brand design standards',
      'Lead a team of graphic artists, motion designers, and copywriters on global marketing campaigns',
      'Review and critique design deliverables for aesthetic harmony, composition balance, and publication quality',
      'Collaborate with executive clients to translate brand visions into striking print and digital experiences'
    ],
    educationRequirement: "Bachelor's in Fine Arts (BFA), Graphic Design, Visual Communication, or equivalent stellar portfolio",
    requiredCertifications: [],
    keywords: ['Art Director', 'Brand Design', 'Typography', 'Adobe Illustrator', 'Photoshop', 'Visual Identity', 'Graphic Design', 'Editorial'],
    published: true,
    createdAt: '2026-08-06T15:00:00Z',
    applicationsCount: 47,
    scoringWeights: {
      skillsMatch: 35,
      experienceMatch: 25,
      responsibilitiesMatch: 20,
      projectsMatch: 15,
      educationMatch: 3,
      keywordsMatch: 2,
      certificationsMatch: 0
    }
  },
  {
    id: 'job-art-3d-animator',
    title: '3D Animator & Visual Effects Designer',
    company: 'Starlight Motion Studios',
    department: 'Arts, Design & Media',
    location: 'Los Angeles, CA (Remote)',
    type: 'Full-time',
    seniority: 'Mid',
    minExperienceYears: 3,
    salaryRange: '$105,000 - $140,000',
    summary: 'Create stylized 3D character animations, mechanical rigs, shader materials, lighting setups, and motion graphics for cinematic games and commercials.',
    requiredSkills: ['3D Animation', 'Blender', 'Maya', 'Character Rigging', 'Texturing & Shading', 'Motion Graphics'],
    preferredSkills: ['Cinema 4D', 'Unreal Engine 5', 'Substance Painter', 'After Effects', 'Lighting & Rendering'],
    responsibilities: [
      'Animate expressive 3D character movements, facial dynamics, and realistic physical simulations',
      'Build clean character skeletal rigs and inverse kinematic (IK/FK) controllers in Maya and Blender',
      'Develop PBR material textures and lighting setups for high-resolution rendering engines',
      'Collaborate with technical directors to optimize asset polygon counts and frame rate performance'
    ],
    educationRequirement: "Bachelor's in Animation, Digital Media, Computer Graphics, or equivalent portfolio demonstration",
    requiredCertifications: [],
    keywords: ['3D Animation', 'Blender', 'Maya', 'Rigging', 'Unreal Engine', 'CGI', 'Motion Design', 'Visual Effects', 'Texturing'],
    published: true,
    createdAt: '2026-08-05T16:30:00Z',
    applicationsCount: 36,
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

  // ==========================================
  // 5. MECHANICAL & CIVIL ENGINEERING
  // ==========================================
  {
    id: 'job-mech-cad-engineer',
    title: 'Mechanical Design & Thermal Engineer',
    company: 'Vanguard Dynamics Engineering',
    department: 'Mechanical & Civil Engineering',
    location: 'Detroit, MI (On-site)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 5,
    salaryRange: '$120,000 - $155,000',
    summary: 'Design mechanical component assemblies in SolidWorks, execute FEA structural and thermal simulations in ANSYS, and oversee precision CNC manufacturing.',
    requiredSkills: ['Mechanical Design', 'SolidWorks / CATIA', 'FEA Simulation (ANSYS)', 'GD&T (Geometric Dimensioning)', 'Thermal Dynamics', 'DFM / DFA Principles'],
    preferredSkills: ['Injection Molding Design', 'CNC Machining Processes', 'Rapid Prototyping', 'Materials Selection', 'Fluid Dynamics (CFD)'],
    responsibilities: [
      'Create parametric 3D CAD assemblies and comprehensive 2D manufacturing drawings with strict GD&T tolerances',
      'Perform finite element stress (FEA) and computational fluid/thermal dynamics (CFD) analysis in ANSYS',
      'Prototype and physically validate structural load limits in mechanical testing laboratories',
      'Collaborate with manufacturing vendors to ensure design for manufacturability (DFM) standards'
    ],
    educationRequirement: "Bachelor's or Master's degree in Mechanical Engineering or Aerospace Engineering",
    requiredCertifications: ['Certified SolidWorks Professional (CSWP) (Preferred)'],
    keywords: ['Mechanical Engineering', 'SolidWorks', 'ANSYS', 'FEA', 'CAD', 'GD&T', 'Thermal Dynamics', 'DFM', 'Manufacturing'],
    published: true,
    createdAt: '2026-08-04T14:00:00Z',
    applicationsCount: 33,
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
    id: 'job-civil-structural',
    title: 'Structural & Civil Infrastructure Engineer',
    company: 'Apex Infrastructure & Bridge Labs',
    department: 'Mechanical & Civil Engineering',
    location: 'Chicago, IL (Hybrid)',
    type: 'Full-time',
    seniority: 'Senior',
    minExperienceYears: 5,
    salaryRange: '$125,000 - $160,000',
    summary: 'Conduct structural analysis on reinforced concrete and steel infrastructure, draft BIM models in Revit/AutoCAD, and manage on-site building compliance.',
    requiredSkills: ['Structural Engineering', 'AutoCAD Civil 3D', 'Revit / BIM', 'Structural Analysis (SAP2000 / ETABS)', 'Reinforced Concrete & Steel Design', 'Building Codes (IBC / ASCE 7)'],
    preferredSkills: ['Foundation Design', 'Seismic Analysis', 'Site Inspection', 'Cost Estimation', 'Environmental Impact Assessment'],
    responsibilities: [
      'Calculate structural load paths, seismic shear forces, and wind load reactions using SAP2000 and ETABS',
      'Produce structural construction blueprints and 3D Building Information Models (BIM) in Revit',
      'Conduct periodic on-site structural inspections to certify construction adherence to architectural plans',
      'Ensure strict compliance with international building codes (IBC) and municipal safety standards'
    ],
    educationRequirement: "Bachelor's or Master's degree in Civil or Structural Engineering",
    requiredCertifications: ['Professional Engineer (PE) License or EIT'],
    keywords: ['Civil Engineering', 'Structural Engineering', 'Revit', 'AutoCAD', 'ETABS', 'SAP2000', 'BIM', 'Concrete Design', 'Building Codes'],
    published: true,
    createdAt: '2026-08-03T10:00:00Z',
    applicationsCount: 26,
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

  // ==========================================
  // 6. HEALTHCARE & BIOTECH
  // ==========================================
  {
    id: 'job-biomed-clinical',
    title: 'Biomedical Specialist & Clinical Research Coordinator',
    company: 'BioVanguard Life Sciences',
    department: 'Healthcare & Biomedical Sciences',
    location: 'Philadelphia, PA (Hybrid)',
    type: 'Full-time',
    seniority: 'Mid',
    minExperienceYears: 3,
    salaryRange: '$105,000 - $138,000',
    summary: 'Coordinate clinical trial protocols, analyze patient health telemetry, validate medical diagnostic equipment, and ensure FDA/GCP regulatory compliance.',
    requiredSkills: ['Clinical Trials & Protocol Management', 'Medical Data Analysis', 'FDA Regulatory Standards (GCP/GLP)', 'HIPAA Compliance', 'Biomedical Instrumentation'],
    preferredSkills: ['Electronic Data Capture (EDC)', 'Statistical Analysis (SAS/SPSS/R)', 'Patient Telemetry', 'Clinical Trial Documentation', 'Bio-Informatics'],
    responsibilities: [
      'Administer Phase II/III clinical trial protocols adhering strictly to FDA, GCP, and Institutional Review Board (IRB) mandates',
      'Manage electronic data capture (EDC) systems tracking patient biomarkers and therapeutic efficacy',
      'Validate diagnostic medical instrumentation and ensure calibration compliance across clinical sites',
      'Author clinical research summary reports and present adverse event telemetry to trial sponsors'
    ],
    educationRequirement: "Bachelor's or Master's in Biomedical Science, Biotechnology, Nursing, or Health Sciences",
    requiredCertifications: ['Certified Clinical Research Coordinator (CCRC) or SOCRA CCRP (Preferred)'],
    keywords: ['Biomedical', 'Clinical Research', 'GCP', 'FDA', 'Medical Data', 'Clinical Trials', 'HIPAA', 'Healthcare', 'Biotechnology'],
    published: true,
    createdAt: '2026-08-02T13:00:00Z',
    applicationsCount: 31,
    scoringWeights: {
      skillsMatch: 30,
      experienceMatch: 25,
      responsibilitiesMatch: 25,
      projectsMatch: 10,
      educationMatch: 5,
      keywordsMatch: 2,
      certificationsMatch: 3
    }
  }
];

// ============================================================================
// DIVERSE CANDIDATE PROFILES FOR EACH DOMAIN
// ============================================================================
export const SAMPLE_CANDIDATE_RESUMES: StructuredResume[] = [
  // 1. Alex Rivera (IT & Data Analysis)
  {
    id: 'resume-alex-rivera',
    versionName: 'Alex Rivera — Data Analytics Focus (IT)',
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
    extractionQuality: 'high'
  },

  // 2. Sophia Zhang (Machine Learning & AI)
  {
    id: 'resume-sophia-zhang',
    versionName: 'Sophia Zhang — Machine Learning & AI (IT)',
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

  // 3. Karthik Subramanian (Electrical & Power Systems - EEE)
  {
    id: 'resume-karthik-eee',
    versionName: 'Karthik S. — Electrical & Power Systems (EEE)',
    createdAt: '2026-08-05T09:00:00Z',
    updatedAt: '2026-08-11T12:00:00Z',
    fullName: 'Karthik Subramanian',
    email: 'karthik.eee.power@example.com',
    phone: '+1 (555) 678-4321',
    location: 'Houston, TX',
    linkedin: 'linkedin.com/in/karthik-power-eee',
    portfolio: 'karthik-electrical.tech',
    summary: 'Lead Electrical Power Systems Engineer with 5.5+ years of expertise in high-voltage substation automation, electrical circuit design, ETAP load flow simulations, and industrial SCADA controllers.',
    skills: {
      technical: ['Power Systems', 'Circuit Design', 'MATLAB/Simulink', 'ETAP', 'PLC/SCADA', 'AutoCAD Electrical', 'High Voltage Systems', 'Protection Relays'],
      soft: ['Project Leadership', 'Industrial Safety Compliance', 'Root-Cause Problem Solving'],
      tools: ['ETAP', 'MATLAB', 'AutoCAD Electrical', 'Simulink', 'Siemens TIA Portal', 'RSLogix']
    },
    experience: [
      {
        id: 'exp-ks-1',
        company: 'Texas Grid Power & Energy',
        jobTitle: 'Senior Electrical Engineer',
        startDate: '2021-04',
        endDate: '2026-08',
        isCurrent: true,
        location: 'Houston, TX',
        description: 'Conducted short-circuit, harmonic, and arc flash analysis across 220kV substations using ETAP. Configured Siemens PLC and SCADA industrial telemetries reducing unplanned downtime by 24%.',
        technologies: ['ETAP', 'MATLAB/Simulink', 'PLC/SCADA', 'Circuit Design', 'AutoCAD Electrical']
      }
    ],
    education: [
      {
        id: 'edu-ks-1',
        institution: 'Texas A&M University',
        degree: 'Bachelor of Engineering (B.E.)',
        fieldOfStudy: 'Electrical & Electronics Engineering (EEE)',
        graduationYear: '2020',
        gpa: '3.88'
      }
    ],
    projects: [
      {
        id: 'proj-ks-1',
        title: 'Microgrid Solar-Storage Substation Simulation',
        description: 'Simulated a 10MW renewable hybrid substation load response in MATLAB/Simulink with automatic islanding protection relays.',
        technologies: ['MATLAB/Simulink', 'ETAP', 'Circuit Design', 'Power Systems']
      }
    ],
    certifications: [
      {
        id: 'cert-ks-1',
        name: 'Engineer in Training (EIT) / FE Electrical Certification',
        issuer: 'NCEES',
        issueDate: '2020-08',
        credentialId: 'EIT-TX-78921'
      }
    ],
    extractionQuality: 'high'
  },

  // 4. Elena Ramos (Precision Agriculture & Smart Farming - Agri)
  {
    id: 'resume-elena-agri',
    versionName: 'Elena Ramos — Precision Agriculture Specialist (Agri)',
    createdAt: '2026-08-04T10:00:00Z',
    updatedAt: '2026-08-10T15:00:00Z',
    fullName: 'Elena Ramos',
    email: 'elena.ramos.agri@example.com',
    phone: '+1 (555) 432-8765',
    location: 'Des Moines, IA',
    linkedin: 'linkedin.com/in/elena-ramos-agtech',
    portfolio: 'elena-agritech.org',
    summary: 'Precision Agriculture Specialist and Agronomist with 4.5+ years experience in geospatial GIS mapping, multi-spectral drone imagery crop analytics, IoT soil moisture telemetry, and yield prediction algorithms.',
    skills: {
      technical: ['Precision Agriculture', 'GIS Mapping & Spatial Analysis', 'Soil Science & Agronomy', 'Drone Crop Analytics', 'Data Analysis', 'IoT Sensors', 'Variable Rate Technology (VRT)'],
      soft: ['Field Diagnostics', 'Farmer Advisory Consultation', 'Sustainable Resource Optimization'],
      tools: ['QGIS', 'ArcGIS Pro', 'Pix4Dfields', 'John Deere Operations Center', 'Python (GeoPandas)', 'Excel']
    },
    experience: [
      {
        id: 'exp-er-1',
        company: 'Midwest AgTech Innovations',
        jobTitle: 'Precision Agronomist & Field Lead',
        startDate: '2022-02',
        endDate: '2026-08',
        isCurrent: true,
        location: 'Des Moines, IA',
        description: 'Managed 35,000+ acres of corn and soybean variable-rate fertilizer (VRT) prescriptions using GIS spatial layers and multispectral drone NDVI analytics, increasing average crop yield by 11.2%.',
        technologies: ['Precision Agriculture', 'GIS Mapping & Spatial Analysis', 'IoT Sensors', 'QGIS', 'Drone Crop Analytics']
      }
    ],
    education: [
      {
        id: 'edu-er-1',
        institution: 'Iowa State University',
        degree: 'Bachelor of Science (B.S.)',
        fieldOfStudy: 'Agronomy & Precision Agriculture',
        graduationYear: '2021',
        gpa: '3.79'
      }
    ],
    projects: [
      {
        id: 'proj-er-1',
        title: 'IoT Soil Nitrate & Moisture Real-time Grid',
        description: 'Installed and networked 80+ solar-powered IoT soil telemetry probes feeding real-time irrigation advice to mobile farm dashboards.',
        technologies: ['IoT Sensors', 'Precision Agriculture', 'Python', 'GIS']
      }
    ],
    certifications: [
      {
        id: 'cert-er-1',
        name: 'Certified Crop Adviser (CCA)',
        issuer: 'American Society of Agronomy',
        issueDate: '2022-05',
        credentialId: 'CCA-94810-MW'
      },
      {
        id: 'cert-er-2',
        name: 'FAA Part 107 Remote Pilot Certification (Commercial Drone)',
        issuer: 'FAA',
        issueDate: '2021-10',
        credentialId: 'FAA-DRONE-83921'
      }
    ],
    extractionQuality: 'high'
  },

  // 5. Maya Lin (Creative Art Director & Brand Design - Art)
  {
    id: 'resume-maya-art',
    versionName: 'Maya Lin — Creative Art Director (Art & Design)',
    createdAt: '2026-08-03T11:00:00Z',
    updatedAt: '2026-08-09T18:00:00Z',
    fullName: 'Maya Lin',
    email: 'maya.lin.creative@example.com',
    phone: '+1 (555) 901-2345',
    location: 'New York, NY',
    linkedin: 'linkedin.com/in/mayalin-artdirector',
    portfolio: 'mayalin-portfolio.design',
    summary: 'Award-winning Creative Art Director and Brand Designer with 6+ years experience crafting comprehensive visual brand identities, typography guidelines, editorial publication layouts, and multi-channel creative campaign strategies.',
    skills: {
      technical: ['Visual Brand Identity', 'Typography', 'Adobe Creative Suite (Photoshop, Illustrator, InDesign)', 'Art Direction', 'Creative Campaign Strategy', 'Design Systems', 'Color Theory'],
      soft: ['Creative Leadership', 'Visual Storytelling', 'Client Direction & Pitching'],
      tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'Figma', 'After Effects', 'Cinema 4D']
    },
    experience: [
      {
        id: 'exp-ml-1',
        company: 'Verve Studio New York',
        jobTitle: 'Senior Art Director',
        startDate: '2021-08',
        endDate: '2026-08',
        isCurrent: true,
        location: 'New York, NY',
        description: 'Led visual brand overhauls for 18+ high-growth fashion, lifestyle, and corporate clients. Directed photography shoots, bespoke typography systems, and print/digital assets recognized in AIGA Design Archives.',
        technologies: ['Adobe Creative Suite (Photoshop, Illustrator, InDesign)', 'Typography', 'Visual Brand Identity', 'Art Direction']
      }
    ],
    education: [
      {
        id: 'edu-ml-1',
        institution: 'Rhode Island School of Design (RISD)',
        degree: 'Bachelor of Fine Arts (BFA)',
        fieldOfStudy: 'Graphic Design & Visual Arts',
        graduationYear: '2019',
        gpa: '3.91'
      }
    ],
    projects: [
      {
        id: 'proj-ml-1',
        title: 'Global Monolith Brand Identity & Typography Specimen',
        description: 'Created a bespoke variable font and complete multi-format brand guidelines used across 45 countries.',
        technologies: ['Typography', 'Adobe Illustrator', 'InDesign', 'Visual Brand Identity']
      }
    ],
    certifications: [
      {
        id: 'cert-ml-1',
        name: 'AIGA Professional Member & Typography Guild Honors',
        issuer: 'AIGA',
        issueDate: '2022-01'
      }
    ],
    extractionQuality: 'high'
  },

  // 6. Marcus Chen (Mechanical & CAD Design - Mech)
  {
    id: 'resume-marcus-mech',
    versionName: 'Marcus Chen — Mechanical CAD & Thermal Design (Mech)',
    createdAt: '2026-08-02T14:00:00Z',
    updatedAt: '2026-08-08T17:00:00Z',
    fullName: 'Marcus Chen',
    email: 'marcus.chen.mech@example.com',
    phone: '+1 (555) 890-5678',
    location: 'Detroit, MI',
    linkedin: 'linkedin.com/in/marcuschen-mechanical',
    portfolio: 'marcuschen-cad.engineering',
    summary: 'Senior Mechanical Design Engineer with 5+ years of experience in parametric 3D CAD modeling (SolidWorks, CATIA), FEA structural & thermal simulation in ANSYS, GD&T tolerancing, and Design for Manufacturability (DFM).',
    skills: {
      technical: ['Mechanical Design', 'SolidWorks / CATIA', 'FEA Simulation (ANSYS)', 'GD&T (Geometric Dimensioning)', 'Thermal Dynamics', 'DFM / DFA Principles', 'CAD Modeling'],
      soft: ['Cross-functional Engineering', 'Precision Quality Control', 'Vendor Collaboration'],
      tools: ['SolidWorks', 'ANSYS Workbench', 'CATIA V5', 'AutoCAD', 'KeyShot', 'MATLAB']
    },
    experience: [
      {
        id: 'exp-mc-mech-1',
        company: 'AeroDrive Propulsion Systems',
        jobTitle: 'Senior Mechanical Design Engineer',
        startDate: '2021-03',
        endDate: '2026-08',
        isCurrent: true,
        location: 'Detroit, MI',
        description: 'Designed die-cast aluminum enclosures and thermal cooling fins for electric vehicle power inverters. Validated structural integrity under 50G shock loads using ANSYS FEA.',
        technologies: ['Mechanical Design', 'SolidWorks / CATIA', 'FEA Simulation (ANSYS)', 'GD&T (Geometric Dimensioning)', 'Thermal Dynamics']
      }
    ],
    education: [
      {
        id: 'edu-mc-mech-1',
        institution: 'University of Michigan, Ann Arbor',
        degree: 'Bachelor of Science (B.S.)',
        fieldOfStudy: 'Mechanical Engineering',
        graduationYear: '2020',
        gpa: '3.84'
      }
    ],
    projects: [
      {
        id: 'proj-mc-mech-1',
        title: 'High-Efficiency Liquid Cold Plate for EV Batteries',
        description: 'Engineered micro-channel liquid cold plate reducing battery cell thermal variance by 4.2°C.',
        technologies: ['SolidWorks / CATIA', 'FEA Simulation (ANSYS)', 'Thermal Dynamics', 'DFM / DFA Principles']
      }
    ],
    certifications: [
      {
        id: 'cert-mc-mech-1',
        name: 'Certified SolidWorks Professional (CSWP)',
        issuer: 'Dassault Systèmes',
        issueDate: '2021-06',
        credentialId: 'CSWP-78210-MC'
      }
    ],
    extractionQuality: 'high'
  }
];

// ============================================================================
// EXTENSIVE 50+ ROLE & GROUNDED INTERVIEW QUESTION BANK
// ============================================================================
export const SAMPLE_INTERVIEW_QUESTIONS: InterviewQuestionItem[] = [
  // --- IT, DATA & AI (Questions 1-12) ---
  {
    id: 'q-data-1',
    category: 'technical',
    question: 'How do you optimize complex multi-table SQL queries with billions of rows to prevent full table scans and memory spills?',
    contextWhyAsked: 'Tests database indexing strategies, query execution plans, partitioning, and deep SQL performance engineering.',
    expectedKeyPoints: ['Clustered vs non-clustered indexes', 'EXPLAIN ANALYZE execution plan review', 'Partition pruning and materialized views'],
    candidateBackgroundEvidence: 'Candidate lists 4+ years of SQL data pipeline architecture and database query tuning on large transaction datasets.',
    difficulty: 'Senior'
  },
  {
    id: 'q-data-2',
    category: 'technical',
    question: 'What is the mathematical and operational difference between DAX calculated columns and measures in Power BI, and when does each impact memory?',
    contextWhyAsked: 'Evaluates VertiPaq engine understanding, filter context, row context, and dashboard latency optimization.',
    expectedKeyPoints: ['Row context vs filter context', 'In-memory compression in VertiPaq', 'Measures computed on query time vs calculated column RAM overhead'],
    candidateBackgroundEvidence: 'Candidate holds Power BI certification and built executive KPI dashboards.',
    difficulty: 'Mid'
  },
  {
    id: 'q-ai-3',
    category: 'technical',
    question: 'How do you prevent catastrophic forgetting and token degradation when fine-tuning transformer models on domain-specific corpora?',
    contextWhyAsked: 'Assesses practical deep learning knowledge, LoRA / PEFT adapters, and learning rate scheduling.',
    expectedKeyPoints: ['Parameter-Efficient Fine-Tuning (LoRA/QLoRA)', 'Replay buffer validation', 'Learning rate warmups and weight decay'],
    candidateBackgroundEvidence: 'Candidate built Sentence-BERT transformer pipelines and fine-tuned embeddings.',
    difficulty: 'Senior'
  },
  {
    id: 'q-ai-4',
    category: 'project_deep_dive',
    question: 'Can you walk us through the vector retrieval architecture you used for semantic indexing and how you handled latency bottlenecks?',
    contextWhyAsked: 'Tests RAG architecture, vector distance metrics (Cosine/HNSW), and embedding caching.',
    expectedKeyPoints: ['HNSW index quantization', 'Embedding batching', 'Sub-100ms API response caching'],
    candidateBackgroundEvidence: 'Candidate deployed vector retrieval microservices in FastAPI.',
    difficulty: 'Senior'
  },
  {
    id: 'q-dev-5',
    category: 'technical',
    question: 'How do you structure React state management in high-throughput enterprise apps to prevent unnecessary component re-renders?',
    contextWhyAsked: 'Evaluates modern React 19 / TypeScript architecture, state colocation, context splitting, and memoization.',
    expectedKeyPoints: ['Context splitting', 'useMemo and useCallback boundaries', 'Immutable state updates and selectors'],
    candidateBackgroundEvidence: 'Candidate built enterprise UI dashboards with React and TypeScript.',
    difficulty: 'Mid'
  },
  {
    id: 'q-devops-6',
    category: 'technical',
    question: 'How do you design a zero-downtime blue/green Kubernetes deployment strategy with automated canary rollback on error spike?',
    contextWhyAsked: 'Tests Kubernetes ingress routing, readiness probes, Prometheus metrics, and automated deployment automation.',
    expectedKeyPoints: ['Canary traffic split (Argo Rollouts/Flagger)', 'Readiness/Liveness probe thresholds', 'Automated metrics rollback'],
    candidateBackgroundEvidence: 'Candidate engineered Kubernetes clusters and automated CI/CD pipelines.',
    difficulty: 'Senior'
  },
  {
    id: 'q-sec-7',
    category: 'technical',
    question: 'If you identify an anomalous outbound DNS tunneling request in your SIEM telemetry, what are your immediate triage and containment steps?',
    contextWhyAsked: 'Assesses real-time cybersecurity incident response protocol and threat isolation speed.',
    expectedKeyPoints: ['Host network isolation', 'DNS sinkholing and IP blacklisting', 'Forensic memory dump and root-cause analysis'],
    candidateBackgroundEvidence: 'Candidate lists SIEM monitoring and incident response experience.',
    difficulty: 'Mid'
  },
  {
    id: 'q-data-8',
    category: 'technical',
    question: 'How do you handle schema evolution and data quality verification in real-time streaming pipelines without pipeline downtime?',
    contextWhyAsked: 'Measures data engineering maturity with Avro/Protobuf schema registries and dbt assertions.',
    expectedKeyPoints: ['Schema Registry compatibility modes (Backward/Full)', 'Dead-letter queues for malformed payloads', 'Automated data contract validation'],
    candidateBackgroundEvidence: 'Candidate built automated data verification pipelines and ETL models.',
    difficulty: 'Senior'
  },
  {
    id: 'q-ai-9',
    category: 'technical',
    question: 'How do you quantitatively measure hallucination rates and factual grounding in production GenAI applications?',
    contextWhyAsked: 'Tests LLM evaluation benchmarks (RAGAS, G-Eval, BLEU/ROUGE) and guardrail systems.',
    expectedKeyPoints: ['RAGAS faithfulness metrics', 'Semantic similarity benchmarking', 'Deterministic fallback validation'],
    candidateBackgroundEvidence: 'Candidate implemented deterministic ATS scoring and AI explanation engines.',
    difficulty: 'Senior'
  },
  {
    id: 'q-dev-10',
    category: 'technical',
    question: 'Explain the ACID properties in PostgreSQL and how isolation levels prevent dirty reads, non-repeatable reads, and phantom reads.',
    contextWhyAsked: 'Assesses relational database consistency, concurrency locks, and transaction isolation.',
    expectedKeyPoints: ['Read Committed vs Repeatable Read vs Serializable', 'Multi-Version Concurrency Control (MVCC)', 'Write-Ahead Logging (WAL)'],
    candidateBackgroundEvidence: 'Candidate designed relational database schemas in PostgreSQL.',
    difficulty: 'Mid'
  },
  {
    id: 'q-dev-11',
    category: 'behavioral',
    question: 'Describe a situation where you had to push back on a stakeholder request due to technical debt or scalability constraints.',
    contextWhyAsked: 'Evaluates diplomatic communication, risk justification, and engineering integrity.',
    expectedKeyPoints: ['STAR format (Situation, Task, Action, Result)', 'Data-backed tradeoff explanation', 'Constructive alternative roadmap'],
    candidateBackgroundEvidence: 'Candidate lists cross-functional team leadership and executive presentations.',
    difficulty: 'Mid'
  },
  {
    id: 'q-data-12',
    category: 'technical',
    question: 'How do you design an A/B testing experiment to ensure sample size sufficiency and prevent false positives from multiple testing (p-hacking)?',
    contextWhyAsked: 'Tests statistical rigor, power analysis, minimum detectable effect (MDE), and Bonferroni corrections.',
    expectedKeyPoints: ['Power calculation for sample size', 'Bonferroni / Benjamini-Hochberg p-value corrections', 'Guardrail metric monitoring'],
    candidateBackgroundEvidence: 'Candidate conducted A/B tests yielding conversion optimization.',
    difficulty: 'Mid'
  },

  // --- ELECTRICAL & ELECTRONICS (EEE / ECE) (Questions 13-22) ---
  {
    id: 'q-eee-13',
    category: 'technical',
    question: 'How do you perform short-circuit fault calculations on a 3-phase power distribution system using symmetrical components in ETAP?',
    contextWhyAsked: 'Tests core electrical power engineering principles, positive/negative/zero sequence networks, and breaker sizing.',
    expectedKeyPoints: ['Symmetrical components transformation', 'Zero sequence impedance modeling in transformers', 'Interrupting capacity rating of circuit breakers'],
    candidateBackgroundEvidence: 'Candidate lists ETAP load flow and short-circuit analysis across high-voltage substations.',
    difficulty: 'Senior'
  },
  {
    id: 'q-eee-14',
    category: 'technical',
    question: 'What methods do you use to mitigate harmonic distortion and power factor lag in industrial electrical networks with non-linear VFD loads?',
    contextWhyAsked: 'Assesses power quality standards (IEEE 519), active power filters, and capacitor bank design.',
    expectedKeyPoints: ['Active vs passive harmonic harmonic filters', 'Total Harmonic Distortion (THD) limits under IEEE 519', 'Detuned capacitor banks to avoid resonance'],
    candidateBackgroundEvidence: 'Candidate engineered power distribution and substation harmonic studies.',
    difficulty: 'Senior'
  },
  {
    id: 'q-eee-15',
    category: 'technical',
    question: 'How do you design protection relay coordination curves (TCC) to ensure selective tripping between upstream and downstream breakers?',
    contextWhyAsked: 'Evaluates electrical safety, overcurrent time-dial settings, and arc-flash hazard reduction.',
    expectedKeyPoints: ['Time-Current Characteristic (TCC) coordination margins', 'Instantaneous vs time-delay pickup settings', 'Differential and distance protection principles'],
    candidateBackgroundEvidence: 'Candidate configured electrical protection relays in industrial facilities.',
    difficulty: 'Senior'
  },
  {
    id: 'q-eee-16',
    category: 'technical',
    question: 'In high-speed PCB design, how do you control differential pair trace impedance and prevent electromagnetic interference (EMI) cross-talk?',
    contextWhyAsked: 'Tests PCB layout physics, stripline vs microstrip impedance calculation, ground return paths, and decoupling capacitor placement.',
    expectedKeyPoints: ['Controlled trace width and dielectric spacing', 'Continuous ground reference planes without split voids', 'Proper termination resistors and length matching'],
    candidateBackgroundEvidence: 'Candidate designed multi-layer PCB hardware and circuit layouts in Altium.',
    difficulty: 'Mid'
  },
  {
    id: 'q-eee-17',
    category: 'technical',
    question: 'How do you handle interrupt latency, race conditions, and critical sections in bare-metal embedded C programming on ARM Cortex-M microcontrollers?',
    contextWhyAsked: 'Tests low-level embedded software principles, volatile keyword usage, atomic operations, and priority grouping.',
    expectedKeyPoints: ['Volatile keyword for shared memory registers', 'Disabling interrupts or using mutexes in critical sections', 'Nested Vectored Interrupt Controller (NVIC) priority grouping'],
    candidateBackgroundEvidence: 'Candidate programmed ARM Cortex C/C++ firmware and RTOS device drivers.',
    difficulty: 'Senior'
  },
  {
    id: 'q-eee-18',
    category: 'project_deep_dive',
    question: 'Walk us through an electrical hardware failure or grounding issue you diagnosed using an oscilloscope, and how you resolved the root cause.',
    contextWhyAsked: 'Measures hands-on laboratory troubleshooting and diagnostic methodologies.',
    expectedKeyPoints: ['Signal capture with digital oscilloscope', 'Ground loop or ground bounce diagnosis', 'Hardware filter or PCB trace redesign'],
    candidateBackgroundEvidence: 'Candidate validated embedded hardware using oscilloscopes and logic analyzers.',
    difficulty: 'Mid'
  },
  {
    id: 'q-eee-19',
    category: 'technical',
    question: 'What are the main communication tradeoffs between SPI, I2C, and CAN bus protocols for automotive or industrial embedded sensor networks?',
    contextWhyAsked: 'Assesses hardware communication bus architectures, multi-master arbitration, speed, and wire count.',
    expectedKeyPoints: ['SPI: full duplex, fast, high pin count', 'I2C: 2-wire, addressable, slower', 'CAN bus: differential signaling, noise immune, collision arbitration'],
    candidateBackgroundEvidence: 'Candidate implemented I2C, SPI, and CAN communication bus interfaces.',
    difficulty: 'Mid'
  },
  {
    id: 'q-eee-20',
    category: 'technical',
    question: 'How does SCADA integrate with remote terminal units (RTUs) and PLCs over Modbus/DNP3 protocols for electrical grid telemetry?',
    contextWhyAsked: 'Evaluates industrial automation protocols, polling cycles, and substation remote monitoring.',
    expectedKeyPoints: ['Modbus TCP/RTU register mapping', 'DNP3 timestamped event reporting', 'HMI alarm thresholds and remote breaker actuation'],
    candidateBackgroundEvidence: 'Candidate integrated Siemens PLC and SCADA telemetry systems.',
    difficulty: 'Mid'
  },
  {
    id: 'q-eee-21',
    category: 'technical',
    question: 'Explain the working principle and thermal considerations of modern SiC (Silicon Carbide) MOSFETs compared to traditional Silicon IGBTs in power inverters.',
    contextWhyAsked: 'Tests modern power electronics, switching frequency, gate drive design, and thermal dissipation.',
    expectedKeyPoints: ['Wide bandgap advantages (higher breakdown voltage, lower Rds(on))', 'Higher switching frequencies reducing passive component size', 'Thermal conductivity and gate driver dv/dt transient management'],
    candidateBackgroundEvidence: 'Candidate worked on power electronics and high-voltage circuit design.',
    difficulty: 'Senior'
  },
  {
    id: 'q-eee-22',
    category: 'behavioral',
    question: 'How do you ensure strict adherence to electrical safety protocols (e.g. Lockout/Tagout, arc flash PPE) when working on live high-voltage equipment?',
    contextWhyAsked: 'Tests commitment to life safety, NFPA 70E compliance, and job safety analysis (JSA).',
    expectedKeyPoints: ['LOTO (Lockout/Tagout) verification steps', 'Arc flash boundary calculation and PPE ratings', 'Zero-energy verification with calibrated meters'],
    candidateBackgroundEvidence: 'Candidate conducted substation installations adhering to safety codes.',
    difficulty: 'Mid'
  },

  // --- AGRICULTURE & AGTECH (AGRI) (Questions 23-32) ---
  {
    id: 'q-agri-23',
    category: 'technical',
    question: 'How do you interpret multi-spectral NDVI (Normalized Difference Vegetation Index) drone imagery to differentiate between nitrogen deficiency and fungal disease in field crops?',
    contextWhyAsked: 'Tests precision agriculture remote sensing physics, near-infrared reflectance, and agronomic field validation.',
    expectedKeyPoints: ['NDVI formula (NIR - Red) / (NIR + Red)', 'Spatial pattern analysis (broad uniform trends vs localized circular pathogen clusters)', 'Ground-truth soil/tissue sampling to verify canopy spectral data'],
    candidateBackgroundEvidence: 'Candidate analyzed multi-spectral drone imagery and NDVI maps across 35,000+ crop acres.',
    difficulty: 'Senior'
  },
  {
    id: 'q-agri-24',
    category: 'technical',
    question: 'What are the steps to build a prescription map for Variable Rate Technology (VRT) fertilizer application using GIS soil sampling and historical yield data?',
    contextWhyAsked: 'Evaluates geospatial analysis in agriculture, management zone creation, and tractor controller integration.',
    expectedKeyPoints: ['Delineation of management zones via historical yield overlays and soil CEC/pH grids', 'Agronomic yield response curves for nitrogen/potassium', 'Exporting ISOXML / shapefiles to precision tractor controllers'],
    candidateBackgroundEvidence: 'Candidate created variable-rate fertilizer (VRT) prescriptions using GIS spatial layers.',
    difficulty: 'Senior'
  },
  {
    id: 'q-agri-25',
    category: 'technical',
    question: 'How do you interpret a comprehensive soil test report (pH, Cation Exchange Capacity (CEC), Base Saturation, organic matter) to prescribe lime and nutrient amendments?',
    contextWhyAsked: 'Tests soil chemistry fundamentals, nutrient availability across pH scales, and buffer pH calculations.',
    expectedKeyPoints: ['Buffer pH used to calculate lime requirement to raise soil pH', 'CEC determining nutrient holding capacity and leaching vulnerability', 'Base saturation balance of Calcium, Magnesium, and Potassium'],
    candidateBackgroundEvidence: 'Candidate conducted soil fertility audits and chemical composition analysis.',
    difficulty: 'Mid'
  },
  {
    id: 'q-agri-26',
    category: 'technical',
    question: 'How do IoT soil moisture sensors (capacitance vs tensiometer probes) guide automated precision irrigation scheduling to prevent both crop drought stress and root anaerobic conditions?',
    contextWhyAsked: 'Tests agricultural IoT telemetry, field capacity vs permanent wilting point, and volumetric water content (VWC).',
    expectedKeyPoints: ['Field Capacity (FC) vs Permanent Wilting Point (PWP)', 'Multi-depth probe telemetry tracking active root-zone absorption', 'Automated threshold triggers for solenoid valve irrigation actuation'],
    candidateBackgroundEvidence: 'Candidate installed and networked 80+ IoT soil telemetry probes.',
    difficulty: 'Mid'
  },
  {
    id: 'q-agri-27',
    category: 'technical',
    question: 'What are the core principles of Integrated Pest Management (IPM), and how do you calculate economic injury levels (EIL) before recommending chemical or biological interventions?',
    contextWhyAsked: 'Assesses sustainable crop protection, beneficial insect preservation, and economic threshold modeling.',
    expectedKeyPoints: ['Economic Threshold (ET) vs Economic Injury Level (EIL)', 'Cultural, physical, biological controls before chemical application', 'Rotating pesticide Modes of Action (MOA/IRAC) to avoid pest resistance'],
    candidateBackgroundEvidence: 'Candidate developed integrated pest management (IPM) protocols for commercial crops.',
    difficulty: 'Mid'
  },
  {
    id: 'q-agri-28',
    category: 'project_deep_dive',
    question: 'Describe an agricultural technology or farm data project where your recommendations measurably increased crop yield or reduced fertilizer runoff.',
    contextWhyAsked: 'Measures practical agronomic impact, ROI calculation, and environmental stewardship.',
    expectedKeyPoints: ['Baseline input and yield comparison', 'Specific tech or agronomic intervention applied', 'Measurable metric outcomes (bushels/acre lift, input cost reduction %)'],
    candidateBackgroundEvidence: 'Candidate documented an 11.2% crop yield lift across commercial farm operations.',
    difficulty: 'Senior'
  },
  {
    id: 'q-agri-29',
    category: 'technical',
    question: 'How do you calibrate autonomous agricultural machinery guidance systems (RTK-GPS) to achieve sub-inch repeatable pass-to-pass accuracy?',
    contextWhyAsked: 'Tests precision tractor autosteer hardware, RTK base station correction signals, and terrain compensation.',
    expectedKeyPoints: ['Real-Time Kinematic (RTK) differential correction radio/cellular feeds', 'Terrain Compensation Module (TCM) roll and yaw calibration', 'Implement drift compensation in strip-till or planting operations'],
    candidateBackgroundEvidence: 'Candidate calibrated precision GPS guidance and tractor controllers.',
    difficulty: 'Mid'
  },
  {
    id: 'q-agri-30',
    category: 'technical',
    question: 'What quality control and cold chain management protocols are critical to maintain post-harvest shelf life and prevent bacterial contamination (e.g. Listeria, E. coli) in organic produce?',
    contextWhyAsked: 'Assesses post-harvest physiology, rapid pre-cooling, sanitization, and FSMA food safety rules.',
    expectedKeyPoints: ['Hydro-cooling / forced-air pre-cooling to remove field heat within hours', 'Continuous temperature monitoring and data logging during transit', 'HACCP critical control points and organic-approved sanitizers'],
    candidateBackgroundEvidence: 'Candidate managed post-harvest cold chain logistics under USDA Organic guidelines.',
    difficulty: 'Mid'
  },
  {
    id: 'q-agri-31',
    category: 'technical',
    question: 'How do cover crops (e.g. legumes, cereal rye) improve soil microbial biodiversity, carbon sequestration, and weed suppression between main crop rotations?',
    contextWhyAsked: 'Tests regenerative agriculture science, nitrogen fixation by Rhizobium bacteria, and soil aggregate stability.',
    expectedKeyPoints: ['Atmospheric nitrogen fixation by legume root nodules', 'Mycorrhizal fungal network promotion and organic matter building', 'Biomass mulch reducing soil erosion and shading weed seeds'],
    candidateBackgroundEvidence: 'Candidate managed biological soil nutrition and crop rotation planning.',
    difficulty: 'Mid'
  },
  {
    id: 'q-agri-32',
    category: 'behavioral',
    question: 'How do you communicate complex AgTech data and spatial maps to traditional farmers who may be skeptical of automated digital recommendations?',
    contextWhyAsked: 'Evaluates empathy, practical communication, trust-building, and agronomic advisory skills.',
    expectedKeyPoints: ['Listening to grower field history first', 'Showing clear side-by-side test strip ROI proofs', 'Simplifying software interfaces into clear actionable steps'],
    candidateBackgroundEvidence: 'Candidate provided agronomic crop advisory to commercial farm operators.',
    difficulty: 'Mid'
  },

  // --- ARTS, DESIGN & MEDIA (ART / CREATIVE) (Questions 33-42) ---
  {
    id: 'q-art-33',
    category: 'technical',
    question: 'How do you establish a cohesive typography hierarchy, optical kerning, and grid system across both responsive web interfaces and large-format print publications?',
    contextWhyAsked: 'Tests typographic fundamentals, modular scale ratios, baseline grids, x-height, and multi-format brand design.',
    expectedKeyPoints: ['Modular type scale (e.g. Major Third 1.25 or Golden Ratio 1.618)', 'Baseline vertical rhythm alignment', 'Optical vs metric kerning adjustments for headlines vs body text'],
    candidateBackgroundEvidence: 'Candidate designed typography systems and editorial brand guidelines recognized in design archives.',
    difficulty: 'Senior'
  },
  {
    id: 'q-art-34',
    category: 'technical',
    question: 'How do you maintain color accuracy and consistency across different color spaces (sRGB, Display P3, CMYK, and Pantone spot colors)?',
    contextWhyAsked: 'Evaluates color theory physics, gamut clipping, rendering intents, and print production prepress.',
    expectedKeyPoints: ['Color gamut differences between RGB additive and CMYK subtractive models', 'ICC profile management and soft-proofing in Photoshop/InDesign', 'Assigning Pantone spot colors for packaging and brand identity fidelity'],
    candidateBackgroundEvidence: 'Candidate managed global visual brand identities and print/digital assets.',
    difficulty: 'Senior'
  },
  {
    id: 'q-art-35',
    category: 'project_deep_dive',
    question: 'Walk us through your creative direction process when rebranding an established company with legacy customer attachments.',
    contextWhyAsked: 'Measures brand strategy, stakeholder alignment, creative brief formulation, and evolutionary vs revolutionary design.',
    expectedKeyPoints: ['Brand audit and discovery research', 'Moodboarding and concept divergence/convergence', 'Testing visual systems across real-world collateral touchpoints'],
    candidateBackgroundEvidence: 'Candidate led visual brand overhauls for 18+ corporate and lifestyle clients.',
    difficulty: 'Senior'
  },
  {
    id: 'q-art-36',
    category: 'technical',
    question: 'In 3D animation, how do you apply the classic 12 Principles of Animation (e.g. Squash & Stretch, Anticipation, Follow-Through) to convey weight and personality in stylized character rigs?',
    contextWhyAsked: 'Tests character animation fundamentals, timing, spatial arcs, and keyframe curve editing.',
    expectedKeyPoints: ['Squash and stretch preserving object volume', 'Anticipation preparing the audience for rapid action', 'Graph editor curve smoothing for natural momentum deceleration'],
    candidateBackgroundEvidence: 'Candidate animated character movements and facial dynamics in Maya and Blender.',
    difficulty: 'Mid'
  },
  {
    id: 'q-art-37',
    category: 'technical',
    question: 'How do you design a robust character skeletal rig in Maya or Blender with seamless IK/FK switching and proper vertex skinning weight distribution?',
    contextWhyAsked: 'Tests 3D rigging mechanics, joint orientation, deformation correction, and skinning brush tools.',
    expectedKeyPoints: ['Inverse Kinematics (IK) for ground contact vs Forward Kinematics (FK) for fluid arcs', 'Pole vector constraints to avoid knee/elbow flipping', 'Dual quaternion skinning to eliminate joint volume pinching'],
    candidateBackgroundEvidence: 'Candidate built character skeletal rigs and IK/FK controllers in Maya.',
    difficulty: 'Senior'
  },
  {
    id: 'q-art-38',
    category: 'technical',
    question: 'What is the difference between Physically Based Rendering (PBR) Metallic/Roughness workflow versus Specular/Glossiness in 3D shading engines?',
    contextWhyAsked: 'Evaluates 3D texturing physics, energy conservation laws, and material channel authoring in Substance Painter.',
    expectedKeyPoints: ['Energy conservation (reflected light cannot exceed incident light)', 'Base Color / Metallic / Roughness map channel definitions', 'Normal maps vs height displacement maps in real-time rendering'],
    candidateBackgroundEvidence: 'Candidate developed PBR material textures and lighting setups in Blender and Maya.',
    difficulty: 'Mid'
  },
  {
    id: 'q-art-39',
    category: 'technical',
    question: 'How do you construct a design token architecture in Figma that synchronizes smoothly with frontend CSS custom properties for dark/light themes?',
    contextWhyAsked: 'Assesses modern design system engineering, token hierarchy (Global, Semantic, Component), and developer handoff.',
    expectedKeyPoints: ['Token naming conventions (color.surface.primary, space.md)', 'Figma variable modes mapped to CSS custom properties', 'Enforcing accessibility WCAG contrast ratios through semantic tokens'],
    candidateBackgroundEvidence: 'Candidate created scalable component design systems in Figma.',
    difficulty: 'Senior'
  },
  {
    id: 'q-art-40',
    category: 'technical',
    question: 'How do you composite 3D render passes (Beauty, Cryptomatte, Ambient Occlusion, Depth Z-Pass) in After Effects or Nuke to achieve cinematic depth of field and color grading?',
    contextWhyAsked: 'Tests visual effects post-production, multi-pass EXR rendering, and optical camera lens simulation.',
    expectedKeyPoints: ['Linear 32-bit color space compositing', 'Using Depth Z-pass for optical camera depth-of-field blurring', 'Ambient occlusion multiplication for contact shadows'],
    candidateBackgroundEvidence: 'Candidate composited visual effects and motion graphics.',
    difficulty: 'Mid'
  },
  {
    id: 'q-art-41',
    category: 'behavioral',
    question: 'How do you handle severe creative differences with an executive client who insists on an aesthetic direction that violates design best practices?',
    contextWhyAsked: 'Evaluates creative diplomacy, objective design rationale, user testing data justification, and leadership.',
    expectedKeyPoints: ['Framing critiques around target audience goals rather than personal subjective taste', 'Presenting A/B visual mockups highlighting readability/conversion differences', 'Finding collaborative compromise while preserving brand integrity'],
    candidateBackgroundEvidence: 'Candidate pitched and led creative direction with senior executive clients.',
    difficulty: 'Senior'
  },
  {
    id: 'q-art-42',
    category: 'technical',
    question: 'How do you optimize 3D asset geometry, texture atlasing, and draw calls for real-time interactive experiences in Unreal Engine 5 or WebGL?',
    contextWhyAsked: 'Tests technical art optimization, LOD (Level of Detail) generation, UV packing, and Nanite geometry mesh rules.',
    expectedKeyPoints: ['Quad/Tri topology flow without non-manifold geometry', 'UV texture atlasing reducing material draw calls', 'Level of Detail (LOD) distance scaling or Nanite virtualized geometry'],
    candidateBackgroundEvidence: 'Candidate optimized 3D polygon counts and real-time render performance.',
    difficulty: 'Mid'
  },

  // --- MECHANICAL & CIVIL ENGINEERING (Questions 43-48) ---
  {
    id: 'q-mech-43',
    category: 'technical',
    question: 'How do you determine appropriate Geometric Dimensioning and Tolerancing (GD&T) datum references and Maximum Material Condition (MMC) modifiers in SolidWorks manufacturing drawings?',
    contextWhyAsked: 'Tests mechanical drafting standards (ASME Y14.5), tolerance stack-up analysis, and assembly fit interchangeability.',
    expectedKeyPoints: ['Datum reference frame (Primary, Secondary, Tertiary)', 'True position tolerance calculation at MMC (Bonus tolerance)', 'Runout, flatness, and perpendicularity inspection verification'],
    candidateBackgroundEvidence: 'Candidate created parametric 3D CAD assemblies and 2D drawings with GD&T tolerances.',
    difficulty: 'Senior'
  },
  {
    id: 'q-mech-44',
    category: 'technical',
    question: 'In FEA structural simulation in ANSYS, how do you verify mesh convergence and choose appropriate boundary condition constraints to avoid artificial stress singularities?',
    contextWhyAsked: 'Assesses finite element analysis accuracy, mesh refinement studies, element types (Tetrahedral vs Hexahedral), and Saint-Venant’s Principle.',
    expectedKeyPoints: ['Mesh refinement at high-stress gradient fillets until stress asymptotes (<5% change)', 'Identifying point loads or sharp re-entrant corners causing infinite stress singularities', 'Applying realistic distributed face loads and frictionless/fixed support boundaries'],
    candidateBackgroundEvidence: 'Candidate validated structural integrity and thermal dissipation in ANSYS FEA.',
    difficulty: 'Senior'
  },
  {
    id: 'q-civil-45',
    category: 'technical',
    question: 'How do you design a reinforced concrete beam for both ultimate flexural limit state (bending) and serviceability limit state (deflection/crack control) under ACI 318 building codes?',
    contextWhyAsked: 'Evaluates structural concrete engineering, tension rebar area calculation, neutral axis depth, and shear stirrup spacing.',
    expectedKeyPoints: ['Whitney stress block for moment capacity (Mn = As * fy * (d - a/2))', 'Under-reinforced design ensuring ductile tension steel yielding before concrete crushing', 'Shear reinforcement spacing (Vu <= phi * (Vc + Vs)) and crack control bar distribution'],
    candidateBackgroundEvidence: 'Candidate conducted structural analysis and concrete design in civil engineering.',
    difficulty: 'Senior'
  },
  {
    id: 'q-civil-46',
    category: 'technical',
    question: 'How do you calculate seismic equivalent lateral base shear forces on multi-story building frames following ASCE 7-16 and IBC codes?',
    contextWhyAsked: 'Tests earthquake engineering, spectral response acceleration parameters (Ss, S1), seismic design category (SDC), and structural fundamental period (T).',
    expectedKeyPoints: ['Seismic Base Shear formula V = Cs * W', 'Fundamental natural period calculation (T = Ct * hn^x)', 'Response modification coefficient (R) reflecting structural ductility and energy dissipation'],
    candidateBackgroundEvidence: 'Candidate calculated structural load paths and seismic shear forces in ETABS/SAP2000.',
    difficulty: 'Senior'
  },
  {
    id: 'q-mech-47',
    category: 'technical',
    question: 'What are the main Design for Manufacturability (DFM) guidelines for plastic injection molded parts regarding uniform wall thickness, draft angles, and rib-to-wall ratios?',
    contextWhyAsked: 'Tests manufacturing engineering physics, sink mark prevention, mold ejection, and weld line mitigation.',
    expectedKeyPoints: ['Uniform wall thickness to avoid differential cooling shrinkage and warping', '0.5° to 2° minimum draft angle for clean core/cavity mold release', 'Rib thickness limited to 50-60% of nominal wall to prevent surface sink marks'],
    candidateBackgroundEvidence: 'Candidate designed mechanical component assemblies under DFM/DFA principles.',
    difficulty: 'Mid'
  },
  {
    id: 'q-mech-48',
    category: 'project_deep_dive',
    question: 'Walk us through a physical mechanical prototype failure during thermal or shock testing, and what engineering modifications you made to pass validation.',
    contextWhyAsked: 'Evaluates experimental validation methodology, root-cause thermal/mechanical analysis, and iterative redesign.',
    expectedKeyPoints: ['Test parameters (temperature cycling range, vibration spectrum)', 'Failure mode identification (fatigue crack, thermal throttling, plastic deformation)', 'Design modification (heat pipe integration, material change, gusset reinforcement) and verified re-test'],
    candidateBackgroundEvidence: 'Candidate designed aluminum enclosures validated under 50G shock loads.',
    difficulty: 'Senior'
  },

  // --- HEALTHCARE & GENERAL EXECUTIVE (Questions 49-50) ---
  {
    id: 'q-health-49',
    category: 'technical',
    question: 'How do you ensure strict FDA Good Clinical Practice (GCP) and 21 CFR Part 11 electronic records compliance during patient telemetry data capture in multi-site clinical trials?',
    contextWhyAsked: 'Tests biomedical research compliance, electronic audit trails, patient privacy (HIPAA), and adverse event reporting workflows.',
    expectedKeyPoints: ['Immutable electronic signature audit trails under 21 CFR Part 11', 'Informed consent documentation and patient de-identification', 'Standardized reporting of Serious Adverse Events (SAEs) within mandated 24-48h windows'],
    candidateBackgroundEvidence: 'Candidate managed clinical trial protocols and medical diagnostic telemetry.',
    difficulty: 'Senior'
  },
  {
    id: 'q-lead-50',
    category: 'behavioral',
    question: 'How do you prioritize competing deadlines across multiple cross-functional projects when business goals and technical constraints change simultaneously?',
    contextWhyAsked: 'Tests executive composure, agile backlog prioritization, impact matrix analysis, and transparent communication.',
    expectedKeyPoints: ['Eisenhower / Value-vs-Effort matrix triage', 'Transparent dependency mapping and early stakeholder re-alignment', 'Focusing team velocity on mission-critical deliverables'],
    candidateBackgroundEvidence: 'Candidate led cross-functional teams and managed high-concurrency production workflows.',
    difficulty: 'Senior'
  }
];

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
    candidateName: 'Karthik Subramanian',
    jobTitle: 'Electrical Power Systems Engineer',
    overallScore: 91,
    confidenceScore: 95,
    breakdown: {
      skills: 94,
      experience: 90,
      responsibilities: 92,
      projects: 88,
      education: 95
    },
    modelVersion: 'ATS-Hybrid-v2.6',
    scoringVersion: 'Deterministic-Evidence-v1.4',
    timestamp: '2026-08-11T16:15:00Z',
    extractionQuality: 'high (Clean format)',
    reviewerDecision: 'Technical Interview Passed',
    reviewerNotes: 'Strong ETAP and high-voltage substation experience.'
  },
  {
    id: 'audit-003',
    candidateName: 'Elena Ramos',
    jobTitle: 'Precision Agriculture & AgTech Specialist',
    overallScore: 88,
    confidenceScore: 93,
    breakdown: {
      skills: 90,
      experience: 92,
      responsibilities: 88,
      projects: 85,
      education: 90
    },
    modelVersion: 'ATS-Hybrid-v2.6',
    scoringVersion: 'Deterministic-Evidence-v1.4',
    timestamp: '2026-08-11T11:20:00Z',
    extractionQuality: 'high (Structured Agronomy CV)',
    reviewerDecision: 'Shortlisted for Field AgTech Lead',
    reviewerNotes: 'Verified CCA license and drone GIS analytics background.'
  }
];

export function generateInitialCandidateApplications(): CandidateApplication[] {
  const defaultJob = SAMPLE_JOBS[0];

  return [
    {
      id: 'app-alex',
      candidateId: SAMPLE_CANDIDATE_RESUMES[0].id,
      candidateName: SAMPLE_CANDIDATE_RESUMES[0].fullName,
      candidateEmail: SAMPLE_CANDIDATE_RESUMES[0].email,
      candidatePhone: SAMPLE_CANDIDATE_RESUMES[0].phone,
      jobId: defaultJob.id,
      jobTitle: defaultJob.title,
      companyName: defaultJob.company,
      appliedDate: '2026-08-10T14:22:00Z',
      stage: 'shortlisted',
      resume: SAMPLE_CANDIDATE_RESUMES[0],
      atsAnalysis: evaluateResumeAgainstJob(SAMPLE_CANDIDATE_RESUMES[0], defaultJob),
      recruiterNotes: ['Exemplary domain knowledge in SQL & Power BI. Recommended for technical phone screen.'],
      tags: ['Top Match', 'Power BI Certified', 'UC Berkeley'],
      recruiterRating: 5
    },
    {
      id: 'app-sophia',
      candidateId: SAMPLE_CANDIDATE_RESUMES[1].id,
      candidateName: SAMPLE_CANDIDATE_RESUMES[1].fullName,
      candidateEmail: SAMPLE_CANDIDATE_RESUMES[1].email,
      candidatePhone: SAMPLE_CANDIDATE_RESUMES[1].phone,
      jobId: defaultJob.id,
      jobTitle: defaultJob.title,
      companyName: defaultJob.company,
      appliedDate: '2026-08-11T09:15:00Z',
      stage: 'screening',
      resume: SAMPLE_CANDIDATE_RESUMES[1],
      atsAnalysis: evaluateResumeAgainstJob(SAMPLE_CANDIDATE_RESUMES[1], defaultJob),
      recruiterNotes: ['Deep technical skills, but slightly more focused on ML than standard BI pipelines.'],
      tags: ['Strong ML', 'FastAPI'],
      recruiterRating: 4
    },
    {
      id: 'app-karthik',
      candidateId: SAMPLE_CANDIDATE_RESUMES[2].id,
      candidateName: SAMPLE_CANDIDATE_RESUMES[2].fullName,
      candidateEmail: SAMPLE_CANDIDATE_RESUMES[2].email,
      candidatePhone: SAMPLE_CANDIDATE_RESUMES[2].phone,
      jobId: defaultJob.id,
      jobTitle: defaultJob.title,
      companyName: defaultJob.company,
      appliedDate: '2026-08-11T15:30:00Z',
      stage: 'screening',
      resume: SAMPLE_CANDIDATE_RESUMES[2],
      atsAnalysis: evaluateResumeAgainstJob(SAMPLE_CANDIDATE_RESUMES[2], defaultJob),
      recruiterNotes: ['Electrical engineering background. Strong quantitative modeling.'],
      tags: ['EEE Specialist', 'ETAP / Power'],
      recruiterRating: 4
    },
    {
      id: 'app-elena',
      candidateId: SAMPLE_CANDIDATE_RESUMES[3].id,
      candidateName: SAMPLE_CANDIDATE_RESUMES[3].fullName,
      candidateEmail: SAMPLE_CANDIDATE_RESUMES[3].email,
      candidatePhone: SAMPLE_CANDIDATE_RESUMES[3].phone,
      jobId: defaultJob.id,
      jobTitle: defaultJob.title,
      companyName: defaultJob.company,
      appliedDate: '2026-08-12T08:45:00Z',
      stage: 'applied',
      resume: SAMPLE_CANDIDATE_RESUMES[3],
      atsAnalysis: evaluateResumeAgainstJob(SAMPLE_CANDIDATE_RESUMES[3], defaultJob),
      recruiterNotes: ['Agronomy specialist. Review analytical and GIS skills transfer.'],
      tags: ['Agri / GIS', 'Drone Certified'],
      recruiterRating: 3
    }
  ];
}

export function generateBulkResumes(count: number = 50, targetJob: JobRequirement): CandidateApplication[] {
  const firstNames = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Lucas', 'Mia', 'Oliver', 'Charlotte', 'Elijah', 'Amelia', 'Aiden', 'Harper', 'Karthik', 'Elena', 'Maya', 'Marcus', 'Priya', 'Rohan', 'Chen', 'Fatima', 'Tariq', 'Sora', 'Lukas', 'Ananya'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];
  const colleges = ['UC Berkeley', 'MIT', 'Stanford University', 'Texas A&M', 'Iowa State', 'RISD', 'University of Washington', 'Carnegie Mellon', 'Georgia Tech', 'UT Austin', 'Univ of Michigan', 'Cornell University'];

  const results: CandidateApplication[] = [];
  const skillPool = targetJob.requiredSkills.concat(targetJob.preferredSkills || ['SQL', 'Python', 'Problem Solving', 'Communication', 'Git']);

  for (let i = 0; i < count; i++) {
    const fName = firstNames[i % firstNames.length];
    const lName = lastNames[(i * 3 + 7) % lastNames.length];
    const name = `${fName} ${lName}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i + 1}@example.com`;
    const yearsExp = Math.max(1, Math.round(((i * 7) % 9 + 1) * 10) / 10);

    const candidateSkills: string[] = [];
    const skillCount = 3 + (i % 6);
    for (let s = 0; s < skillCount; s++) {
      const sk = skillPool[(i * 3 + s) % skillPool.length];
      if (sk && !candidateSkills.includes(sk)) candidateSkills.push(sk);
    }

    const extractionQuality: 'high' | 'medium' | 'low' = i % 15 === 0 ? 'low' : i % 6 === 0 ? 'medium' : 'high';

    const resume: StructuredResume = {
      id: `bulk-resume-${i + 1}`,
      versionName: `${name} - Professional CV`,
      createdAt: new Date(Date.now() - (count - i) * 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
      fullName: name,
      email,
      phone: `+1 (555) ${100 + (i % 900)}-${1000 + (i % 9000)}`,
      location: i % 3 === 0 ? 'San Francisco, CA' : i % 2 === 0 ? 'Remote' : 'Austin, TX',
      summary: `Experienced professional with ${yearsExp} years of background specializing in ${candidateSkills.slice(0, 3).join(', ')}.`,
      skills: {
        technical: candidateSkills,
        soft: ['Communication', 'Analytical Thinking', 'Teamwork'],
        tools: ['Git', 'Excel', 'Docker']
      },
      experience: [
        {
          id: `exp-${i}-1`,
          company: `Enterprise Org ${((i % 10) + 1)}`,
          jobTitle: yearsExp >= 4 ? `Senior ${targetJob.title.split(' ')[0]}` : targetJob.title,
          startDate: `${2026 - Math.floor(yearsExp)}-01`,
          endDate: '2026-08',
          isCurrent: true,
          description: `Managed deliverables, executed projects, and optimized workflows using ${candidateSkills.slice(0, 2).join(' and ')}.`,
          technologies: candidateSkills.slice(0, 4)
        }
      ],
      education: [
        {
          id: `edu-${i}`,
          institution: colleges[i % colleges.length],
          degree: 'Bachelor of Science',
          fieldOfStudy: targetJob.department || 'Relevant Discipline',
          graduationYear: `${2026 - Math.floor(yearsExp) - 1}`
        }
      ],
      projects: [
        {
          id: `proj-${i}`,
          title: `${targetJob.title.split(' ')[0]} Production System`,
          description: `Designed and built solutions utilizing ${candidateSkills.slice(0, 2).join(', ')}.`,
          technologies: candidateSkills.slice(0, 3)
        }
      ],
      certifications: i % 3 === 0 ? [{ id: `c-${i}`, name: targetJob.requiredCertifications?.[0] || 'Professional Certified Associate', issuer: 'Accredited Authority', issueDate: '2024-01' }] : [],
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


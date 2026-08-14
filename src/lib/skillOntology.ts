// Skill normalization and ontology aliases mapping
export const SKILL_ONTOLOGY: Record<string, string[]> = {
  // AI / ML / Data Science
  'machine learning': ['ml', 'machine learning algorithms', 'scikit-learn', 'sklearn', 'predictive modeling', 'statistical modeling'],
  'deep learning': ['dl', 'neural networks', 'cnn', 'rnn', 'lstm', 'transformers', 'pytorch', 'tensorflow', 'keras'],
  'natural language processing': ['nlp', 'text mining', 'sentiment analysis', 'tokenization', 'spacy', 'nltk', 'bert', 'sentence-bert', 'llm', 'large language models', 'langchain', 'huggingface'],
  'computer vision': ['cv', 'opencv', 'object detection', 'image segmentation', 'yolo'],
  'generative ai': ['genai', 'llm', 'prompt engineering', 'rag', 'vector database', 'embeddings', 'gemini', 'gpt-4', 'claude'],
  'python': ['python3', 'py', 'pyspark', 'jupyter', 'pandas', 'numpy', 'scipy'],
  'data analysis': ['data analytics', 'eda', 'exploratory data analysis', 'statistical analysis', 'data storytelling', 'data visualization'],
  'sql': ['structured query language', 'postgresql', 'postgres', 'mysql', 'sqlite', 'oracle sql', 'ms sql', 't-sql', 'plsql'],
  'business intelligence': ['bi', 'power bi', 'powerbi', 'dax', 'tableau', 'looker', 'metabase', 'qlik'],
  'big data': ['spark', 'apache spark', 'hadoop', 'hive', 'kafka', 'flink', 'databricks', 'snowflake', 'bigquery'],

  // Software Development / Frontend / Backend
  'react': ['reactjs', 'react.js', 'react native', 'next.js', 'nextjs', 'redux', 'zustand'],
  'typescript': ['ts', 'typescript 5', 'typed javascript'],
  'javascript': ['js', 'es6', 'es2022', 'vanilla js'],
  'node.js': ['nodejs', 'node', 'express', 'express.js', 'nest.js', 'nestjs', 'fastify'],
  'fastapi': ['fast api', 'starlette', 'uvicorn', 'python backend', 'rest api', 'pydantic'],
  'flutter': ['flutter framework', 'dart', 'cross-platform mobile', 'material design'],
  'android': ['android sdk', 'kotlin', 'jetpack compose', 'android studio', 'google play'],
  'golang': ['go', 'golang microservices', 'goroutines', 'gin'],
  'java': ['java 17', 'java 21', 'spring boot', 'spring framework', 'hibernate'],
  'c++': ['cpp', 'c/c++', 'stl', 'embedded c++'],
  'c#': ['csharp', '.net', '.net core', 'asp.net'],
  'html/css': ['html5', 'css3', 'tailwind css', 'tailwindcss', 'sass', 'responsive design'],

  // Cloud & DevOps
  'aws': ['amazon web services', 'ec2', 's3', 'lambda', 'ecs', 'eks', 'rds', 'cloudwatch'],
  'docker': ['containerization', 'dockerfile', 'docker-compose', 'containers'],
  'kubernetes': ['k8s', 'helm', 'kubectl', 'cluster management'],
  'ci/cd': ['github actions', 'gitlab ci', 'jenkins', 'argo cd', 'automated testing', 'devops'],
  'git': ['github', 'gitlab', 'version control', 'git branching'],
  'cloud architecture': ['microservices', 'serverless', 'restful apis', 'graphql', 'grpc'],

  // Methodologies & Soft Skills
  'agile': ['scrum', 'kanban', 'sprint planning', 'jira', 'confluence'],
  'problem solving': ['analytical thinking', 'troubleshooting', 'debugging', 'critical thinking'],
  'communication': ['stakeholder management', 'technical writing', 'presentation skills', 'cross-functional collaboration'],
  'leadership': ['mentorship', 'team lead', 'project management', 'code reviews', 'architectural direction']
};

/**
 * Normalize skill string
 */
export function normalizeSkillName(raw: string): string {
  return raw.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ');
}

/**
 * Check if candidate skill matches required skill (exact, alias, or ontology overlap)
 */
export function isSkillMatch(candidateSkill: string, targetSkill: string): { matched: boolean; matchType: 'exact' | 'alias' | 'semantic'; canonical: string } {
  const normCandidate = normalizeSkillName(candidateSkill);
  const normTarget = normalizeSkillName(targetSkill);

  if (normCandidate === normTarget) {
    return { matched: true, matchType: 'exact', canonical: targetSkill };
  }

  // Check in canonical keys
  for (const [canonical, aliases] of Object.entries(SKILL_ONTOLOGY)) {
    const normCanonical = normalizeSkillName(canonical);
    const normAliases = aliases.map(normalizeSkillName);

    const candidateMatchesGroup = normCandidate === normCanonical || normAliases.some(a => normCandidate.includes(a) || a.includes(normCandidate));
    const targetMatchesGroup = normTarget === normCanonical || normAliases.some(a => normTarget.includes(a) || a.includes(normTarget));

    if (candidateMatchesGroup && targetMatchesGroup) {
      return { matched: true, matchType: 'alias', canonical };
    }
  }

  // Partial substring check
  if (normCandidate.length > 3 && normTarget.length > 3) {
    if (normCandidate.includes(normTarget) || normTarget.includes(normCandidate)) {
      return { matched: true, matchType: 'semantic', canonical: targetSkill };
    }
  }

  return { matched: false, matchType: 'exact', canonical: targetSkill };
}

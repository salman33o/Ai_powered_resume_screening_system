import ky from 'ky';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = ky.create({
  prefixUrl: API_URL,
  timeout: 30000, // Extend timeout for LLM generation
});

export async function loginUser(username: string, password: string): Promise<any> {
  return apiClient.post('auth/login', { json: { username, password } }).json();
}

export async function registerUser(userData: Record<string, unknown>): Promise<any> {
  return apiClient.post('auth/register', { json: userData }).json();
}

export async function uploadResume(userId: number, file: File): Promise<any> {
  const formData = new FormData();
  formData.append('user_id', userId.toString());
  formData.append('file', file);

  return apiClient.post('candidate/resume/upload', { body: formData }).json();
}

export async function fetchJobPostings(status: string = 'Published'): Promise<Array<any>> {
  return apiClient.get('jobs', { searchParams: { status } }).json();
}

export async function fetchJobPosting(postingId: number): Promise<any> {
  return apiClient.get(`jobs/${postingId}`).json();
}

export async function scoreResumeAgainstJob(postingId: number, candidateData: any): Promise<any> {
  return apiClient
    .post(`jobs/${postingId}/score`, {
      json: { candidate_data: candidateData },
    })
    .json();
}

export async function applyToJob(postingId: number, applicationData: any): Promise<any> {
  return apiClient.post(`jobs/${postingId}/apply`, { json: applicationData }).json();
}

export async function generateCoverLetter(candidateData: any, jobPostingId: number): Promise<{ cover_letter: string }> {
  const formData = new FormData();
  formData.append('candidate_data_json', JSON.stringify(candidateData));
  formData.append('job_posting_id', jobPostingId.toString());

  return apiClient.post('ai/generate/cover-letter', { body: formData }).json();
}

export async function generateResumeSummary(resumeText: string): Promise<{ summary: string }> {
  const formData = new FormData();
  formData.append('resume_text', resumeText);

  return apiClient.post('ai/generate/summary', { body: formData }).json();
}

export async function generateSuggestions(resumeText: string, preferredRole: string): Promise<any> {
  return apiClient.post('ai/generate/suggestions', {
    json: { resume_text: resumeText, preferred_role: preferredRole }
  }).json();
}

export async function generateInterviewQuestions(candidateData: any, jobPostingId: number, numQuestions: number = 5): Promise<{ questions: string[] }> {
  return apiClient.post('ai/generate/interview-questions', {
    json: { candidate_data: candidateData, job_posting_id: jobPostingId, num_questions: numQuestions }
  }).json();
}

export async function fetchRecruiterAnalytics(): Promise<any> {
  return apiClient.get('recruiter/dashboard/analytics').json();
}

import 'package:flutter/material.dart';
import 'resume_analyzer_screen.dart';
import 'skill_gap_screen.dart';
import 'interview_prep_screen.dart';
import '../services/api_service.dart';
import 'login_screen.dart';

class CandidateDashboard extends StatelessWidget {
  const CandidateDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Candidate Portal'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
            onPressed: () async {
              await ApiService.logout();
              if (context.mounted) {
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                );
              }
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              color: const Color(0xFF1E88E5),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      'AI Resume Optimizer & ATS Analyzer',
                      style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Analyze your resume against job postings with deterministic hybrid scoring & Gemini explainability.',
                      style: TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Candidate Features',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              children: [
                _buildActionCard(
                  context,
                  title: 'Analyze Resume',
                  icon: Icons.analytics_outlined,
                  color: Colors.blue.shade100,
                  iconColor: Colors.blue.shade800,
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const ResumeAnalyzerScreen()),
                    );
                  },
                ),
                _buildActionCard(
                  context,
                  title: 'Skill Gap Analysis',
                  icon: Icons.checklist_rtl_outlined,
                  color: Colors.green.shade100,
                  iconColor: Colors.green.shade800,
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const SkillGapScreen()),
                    );
                  },
                ),
                _buildActionCard(
                  context,
                  title: 'Resume Optimizer',
                  icon: Icons.auto_awesome_outlined,
                  color: Colors.amber.shade100,
                  iconColor: Colors.amber.shade800,
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const ResumeAnalyzerScreen()),
                    );
                  },
                ),
                _buildActionCard(
                  context,
                  title: 'AI Interview Q&A',
                  icon: Icons.record_voice_over_outlined,
                  color: Colors.purple.shade100,
                  iconColor: Colors.purple.shade800,
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const InterviewPrepScreen()),
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40, color: iconColor),
            const SizedBox(height: 12),
            Text(
              title,
              textAlign: TextAlign.center,
              style: TextStyle(fontWeight: FontWeight.bold, color: iconColor),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import '../services/api_service.dart';

class InterviewPrepScreen extends StatefulWidget {
  const InterviewPrepScreen({super.key});

  @override
  State<InterviewPrepScreen> createState() => _InterviewPrepScreenState();
}

class _InterviewPrepScreenState extends State<InterviewPrepScreen> {
  final _resumeController = TextEditingController();
  final _jdController = TextEditingController();

  bool _isLoading = false;
  List<dynamic>? _questions;

  Future<void> _generateQuestions() async {
    if (_resumeController.text.trim().isEmpty || _jdController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter Resume text and Job Description.')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _questions = null;
    });

    final res = await ApiService.getInterviewQuestions(
      resumeText: _resumeController.text.trim(),
      jdText: _jdController.text.trim(),
    );

    setState(() {
      _isLoading = false;
    });

    if (res["success"] == true && res["data"] != null) {
      setState(() {
        _questions = res["data"]["questions"];
      });
    } else {
      // Local fallback questions if offline
      setState(() {
        _questions = [
          {"question": "Can you explain how you designed your microservices API handling high concurrency?", "category": "Technical Architecture"},
          {"question": "What strategies do you use for query optimization in SQL and database indexing?", "category": "Database Performance"},
          {"question": "Describe a scenario where a deployment failed and how you resolved it in production.", "category": "Behavioral & Incident Handling"}
        ];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Interview Prep Q&A'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _resumeController,
              maxLines: 4,
              decoration: const InputDecoration(
                labelText: 'Your Resume Highlights / Experience',
                alignLabelWithHint: true,
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _jdController,
              maxLines: 4,
              decoration: const InputDecoration(
                labelText: 'Target Job Description (JD)',
                alignLabelWithHint: true,
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _isLoading ? null : _generateQuestions,
              icon: const Icon(Icons.record_voice_over),
              label: const Text('Generate Tailored Interview Questions', style: TextStyle(fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.purple.shade700,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.all(16),
              ),
            ),
            if (_isLoading) ...[
              const SizedBox(height: 24),
              const Center(child: CircularProgressIndicator()),
            ],
            if (_questions != null) ...[
              const SizedBox(height: 24),
              const Text(
                'AI-Generated Questions & Key Focus Areas',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              ...List.generate(_questions!.length, (index) {
                final q = _questions![index];
                final qText = q is Map ? q['question'] ?? q.toString() : q.toString();
                final cat = q is Map ? (q['category'] ?? 'Tailored') : 'Tailored';

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Chip(
                              label: Text(cat, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                              backgroundColor: Colors.purple.shade100,
                            ),
                            const SizedBox(width: 8),
                            Text('Question #${index + 1}', style: const TextStyle(color: Colors.grey)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          qText,
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                );
              }),
            ]
          ],
        ),
      ),
    );
  }
}

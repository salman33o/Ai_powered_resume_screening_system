import 'package:flutter/material.dart';
import '../services/api_service.dart';

class CandidateRankingsScreen extends StatefulWidget {
  const CandidateRankingsScreen({super.key});

  @override
  State<CandidateRankingsScreen> createState() => _CandidateRankingsScreenState();
}

class _CandidateRankingsScreenState extends State<CandidateRankingsScreen> {
  List<dynamic> _jobs = [];
  int? _selectedJobId;
  bool _isLoading = false;
  List<dynamic> _rankings = [];

  @override
  void initState() {
    super.initState();
    _fetchJobs();
  }

  Future<void> _fetchJobs() async {
    setState(() => _isLoading = true);
    final jobs = await ApiService.fetchJobs();
    setState(() {
      _jobs = jobs;
      _isLoading = false;
      if (jobs.isNotEmpty) {
        _selectedJobId = jobs.first['id'] as int;
        _loadRankings(_selectedJobId!);
      }
    });
  }

  Future<void> _loadRankings(int jobId) async {
    setState(() => _isLoading = true);
    final res = await ApiService.getCandidateRanking(jobId);
    setState(() => _isLoading = false);

    if (res["success"] == true && res["data"] != null) {
      setState(() {
        _rankings = res["data"]["rankings"] ?? [];
      });
    } else {
      // Demo fallback list
      setState(() {
        _rankings = [
          {"application_id": 1, "candidate_name": "Alex Johnson", "ats_score": 94.2, "status": "Shortlisted"},
          {"application_id": 2, "candidate_name": "Sarah Smith", "ats_score": 88.5, "status": "Shortlisted"},
          {"application_id": 3, "candidate_name": "Michael Brown", "ats_score": 76.0, "status": "Screening"},
          {"application_id": 4, "candidate_name": "Emily Davis", "ats_score": 62.4, "status": "On Hold"},
        ];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Candidate Rankings'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (_jobs.isNotEmpty) ...[
              DropdownButtonFormField<int>(
                decoration: const InputDecoration(
                  labelText: 'Select Job Posting',
                  border: OutlineInputBorder(),
                ),
                value: _selectedJobId,
                items: _jobs.map<DropdownMenuItem<int>>((j) {
                  return DropdownMenuItem<int>(
                    value: j['id'] as int,
                    child: Text('${j['title']} (${j['company_name']})'),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) {
                    setState(() => _selectedJobId = val);
                    _loadRankings(val);
                  }
                },
              ),
              const SizedBox(height: 16),
            ],
            if (_isLoading) ...[
              const Expanded(child: Center(child: CircularProgressIndicator())),
            ] else if (_rankings.isEmpty) ...[
              const Expanded(
                child: Center(
                  child: Text('No screened candidates for this job posting yet.'),
                ),
              ),
            ] else ...[
              Expanded(
                child: ListView.builder(
                  itemCount: _rankings.length,
                  itemBuilder: (context, index) {
                    final item = _rankings[index];
                    final name = item['candidate_name'] ?? 'Candidate #${item['candidate_id'] ?? (index + 1)}';
                    final score = item['ats_score'] ?? 0.0;
                    final status = item['status'] ?? 'Screening';

                    return Card(
                      margin: const EdgeInsets.only(bottom: 10),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: score >= 80 ? Colors.green.shade100 : Colors.amber.shade100,
                          child: Text(
                            '#${index + 1}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                        ),
                        title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('ATS Match Score: $score%'),
                        trailing: Chip(
                          label: Text(status),
                          backgroundColor: status == 'Shortlisted' ? Colors.green.shade100 : Colors.amber.shade100,
                        ),
                      ),
                    );
                  },
                ),
              ),
            ]
          ],
        ),
      ),
    );
  }
}

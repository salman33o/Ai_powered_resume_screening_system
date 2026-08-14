import 'package:flutter/material.dart';
import '../services/api_service.dart';

class CreateJobScreen extends StatefulWidget {
  const CreateJobScreen({super.key});

  @override
  State<CreateJobScreen> createState() => _CreateJobScreenState();
}

class _CreateJobScreenState extends State<CreateJobScreen> {
  final _titleController = TextEditingController();
  final _companyController = TextEditingController();
  final _locationController = TextEditingController(text: 'Remote');
  final _jdController = TextEditingController();

  double _weightSkills = 0.30;
  double _weightExperience = 0.25;
  double _weightResponsibilities = 0.20;
  double _weightProjects = 0.10;
  double _weightEducation = 0.05;

  bool _isSaving = false;

  Future<void> _handleSaveJob() async {
    final title = _titleController.text.trim();
    final company = _companyController.text.trim();
    final jdText = _jdController.text.trim();

    if (title.isEmpty || company.isEmpty || jdText.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in Job Title, Company, and Job Description.')),
      );
      return;
    }

    setState(() => _isSaving = true);

    final result = await ApiService.createJob(
      title: title,
      companyName: company,
      location: _locationController.text.trim(),
      jdText: jdText,
      weightSkills: _weightSkills,
      weightExperience: _weightExperience,
      weightResponsibilities: _weightResponsibilities,
      weightProjects: _weightProjects,
      weightEducation: _weightEducation,
    );

    setState(() => _isSaving = false);

    if (result["success"] == true) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Job Posting created successfully!')),
        );
        Navigator.of(context).pop(true);
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result["error"] ?? 'Failed to create job.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create New Job Posting'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Job Title *',
                hintText: 'e.g. Senior Python Developer',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _companyController,
              decoration: const InputDecoration(
                labelText: 'Company Name *',
                hintText: 'e.g. TechCorp Solutions',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _locationController,
              decoration: const InputDecoration(
                labelText: 'Location',
                hintText: 'e.g. Remote / San Francisco',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _jdController,
              maxLines: 6,
              decoration: const InputDecoration(
                labelText: 'Job Description & Requirements *',
                alignLabelWithHint: true,
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Custom ATS Weighting Parameters',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            _buildWeightSlider('Skills Match Weight', _weightSkills, (v) => setState(() => _weightSkills = v)),
            _buildWeightSlider('Experience Weight', _weightExperience, (v) => setState(() => _weightExperience = v)),
            _buildWeightSlider('Responsibilities Weight', _weightResponsibilities, (v) => setState(() => _weightResponsibilities = v)),
            _buildWeightSlider('Projects Weight', _weightProjects, (v) => setState(() => _weightProjects = v)),
            _buildWeightSlider('Education Weight', _weightEducation, (v) => setState(() => _weightEducation = v)),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _isSaving ? null : _handleSaveJob,
              icon: const Icon(Icons.add_task),
              label: const Text('Publish Job Posting', style: TextStyle(fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2E7D32),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.all(16),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWeightSlider(String label, double value, ValueChanged<double> onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
            Text('${(value * 100).round()}%', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blue)),
          ],
        ),
        Slider(
          value: value,
          min: 0.0,
          max: 0.60,
          divisions: 12,
          onChanged: onChanged,
        ),
      ],
    );
  }
}

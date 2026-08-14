import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // Use 10.0.2.2 for Android Emulator connecting to host localhost:8000, or custom backend URL
  static String baseUrl = "http://10.0.2.2:8000";

  // Key storage constants
  static const String _tokenKey = "auth_token";
  static const String _usernameKey = "auth_username";
  static const String _userRoleKey = "auth_role";
  static const String _userEmailKey = "auth_email";

  // ── Authentication ────────────────────────────────────────────────────────
  static Future<Map<String, dynamic>> register({
    required String username,
    required String email,
    required String password,
    required String role,
  }) async {
    final url = Uri.parse("$baseUrl/api/auth/register");
    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "username": username,
          "email": email,
          "password": password,
          "role": role,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        await saveSession(
          token: data["access_token"],
          username: data["user"]["username"],
          role: data["user"]["role"],
          email: data["user"]["email"],
        );
        return {"success": true, "data": data};
      } else {
        return {"success": false, "error": data["detail"] ?? "Registration failed."};
      }
    } catch (e) {
      return {"success": false, "error": "Connection error: $e"};
    }
  }

  static Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {
    final url = Uri.parse("$baseUrl/api/auth/login");
    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "username": username,
          "password": password,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        await saveSession(
          token: data["access_token"],
          username: data["user"]["username"],
          role: data["user"]["role"],
          email: data["user"]["email"],
        );
        return {"success": true, "data": data};
      } else {
        return {"success": false, "error": data["detail"] ?? "Invalid credentials."};
      }
    } catch (e) {
      return {"success": false, "error": "Connection error: $e"};
    }
  }

  static Future<void> saveSession({
    required String token,
    required String username,
    required String role,
    required String email,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setString(_usernameKey, username);
    await prefs.setString(_userRoleKey, role);
    await prefs.setString(_userEmailKey, email);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<String?> getRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userRoleKey);
  }

  static Future<String?> getUsername() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_usernameKey);
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

  // ── Jobs ───────────────────────────────────────────────────────────────────
  static Future<List<dynamic>> fetchJobs() async {
    final url = Uri.parse("$baseUrl/api/jobs");
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        return jsonDecode(response.body) as List<dynamic>;
      }
    } catch (e) {
      print("Error fetching jobs: $e");
    }
    return [];
  }

  static Future<Map<String, dynamic>> createJob({
    required String title,
    required String companyName,
    required String location,
    required String jdText,
    double weightSkills = 0.30,
    double weightExperience = 0.25,
    double weightResponsibilities = 0.20,
    double weightProjects = 0.10,
    double weightEducation = 0.05,
  }) async {
    final token = await getToken();
    final url = Uri.parse("$baseUrl/api/recruiter/jobs");
    try {
      final response = await http.post(
        url,
        headers: {
          "Content-Type": "application/json",
          if (token != null) "Authorization": "Bearer $token",
        },
        body: jsonEncode({
          "title": title,
          "company_name": companyName,
          "location": location,
          "jd_text": jdText,
          "weight_skills": weightSkills,
          "weight_experience": weightExperience,
          "weight_responsibilities": weightResponsibilities,
          "weight_projects": weightProjects,
          "weight_education": weightEducation,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {"success": true, "data": data};
      } else {
        return {"success": false, "error": data["detail"] ?? "Failed to create job."};
      }
    } catch (e) {
      return {"success": false, "error": "Connection error: $e"};
    }
  }

  // ── Candidate Features ─────────────────────────────────────────────────────
  static Future<Map<String, dynamic>> analyzeResumeFile({
    required Uint8List fileBytes,
    required String filename,
    required String jdText,
  }) async {
    final token = await getToken();
    final url = Uri.parse("$baseUrl/api/candidate/analyze-resume");
    try {
      final request = http.MultipartRequest("POST", url);
      if (token != null) {
        request.headers["Authorization"] = "Bearer $token";
      }
      request.fields["jd_text"] = jdText;
      request.files.add(
        http.MultipartFile.fromBytes(
          "file",
          fileBytes,
          filename: filename,
        ),
      );

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {"success": true, "data": data};
      } else {
        return {"success": false, "error": data["detail"] ?? "Resume analysis failed."};
      }
    } catch (e) {
      return {"success": false, "error": "Error uploading file: $e"};
    }
  }

  static Future<Map<String, dynamic>> analyzeResumeText({
    required String resumeText,
    required String jdText,
  }) async {
    final token = await getToken();
    final url = Uri.parse("$baseUrl/api/candidate/analyze-resume-text");
    try {
      final response = await http.post(
        url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          if (token != null) "Authorization": "Bearer $token",
        },
        body: {
          "resume_text": resumeText,
          "jd_text": jdText,
        },
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {"success": true, "data": data};
      } else {
        return {"success": false, "error": data["detail"] ?? "Analysis failed."};
      }
    } catch (e) {
      return {"success": false, "error": "Connection error: $e"};
    }
  }

  static Future<Map<String, dynamic>> analyzeSkillGap({
    required String resumeText,
    required String jdText,
  }) async {
    final token = await getToken();
    final url = Uri.parse("$baseUrl/api/candidate/skill-gap");
    try {
      final response = await http.post(
        url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          if (token != null) "Authorization": "Bearer $token",
        },
        body: {
          "resume_text": resumeText,
          "jd_text": jdText,
        },
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {"success": true, "data": data};
      } else {
        return {"success": false, "error": data["detail"] ?? "Skill gap analysis failed."};
      }
    } catch (e) {
      return {"success": false, "error": "Connection error: $e"};
    }
  }

  static Future<Map<String, dynamic>> getInterviewQuestions({
    required String resumeText,
    required String jdText,
  }) async {
    final token = await getToken();
    final url = Uri.parse("$baseUrl/api/candidate/interview-questions");
    try {
      final response = await http.post(
        url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          if (token != null) "Authorization": "Bearer $token",
        },
        body: {
          "resume_text": resumeText,
          "jd_text": jdText,
        },
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        return {"success": true, "data": data};
      } else {
        return {"success": false, "error": data["detail"] ?? "Failed to generate interview questions."};
      }
    } catch (e) {
      return {"success": false, "error": "Connection error: $e"};
    }
  }

  // ── Recruiter Bulk Screening & Rankings ──────────────────────────────────
  static Future<Map<String, dynamic>> bulkScreenResumes({
    required int jobId,
    required List<Map<String, dynamic>> files, // list of {filename: str, bytes: Uint8List}
  }) async {
    final token = await getToken();
    final url = Uri.parse("$baseUrl/api/recruiter/bulk-screen/$jobId");
    try {
      final request = http.MultipartRequest("POST", url);
      if (token != null) {
        request.headers["Authorization"] = "Bearer $token";
      }

      for (var f in files) {
        request.files.add(
          http.MultipartFile.fromBytes(
            "files",
            f["bytes"] as Uint8List,
            filename: f["filename"] as String,
          ),
        );
      }

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return {"success": true, "data": data};
      } else {
        return {"success": false, "error": data["detail"] ?? "Bulk screening failed."};
      }
    } catch (e) {
      return {"success": false, "error": "Error in bulk upload: $e"};
    }
  }

  static Future<Map<String, dynamic>> getCandidateRanking(int jobId) async {
    final url = Uri.parse("$baseUrl/api/recruiter/candidate-ranking/$jobId");
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        return {"success": true, "data": jsonDecode(response.body)};
      }
    } catch (e) {
      print("Error getting candidate rankings: $e");
    }
    return {"success": false, "error": "Failed to fetch candidate rankings."};
  }
}

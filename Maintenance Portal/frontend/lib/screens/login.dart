import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dashboard.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _engineerIdController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _isLoading = false;
  String? _error;

  // ✅ CHANGE ONLY IF YOUR PORT IS DIFFERENT
  static const String _baseUrl = 'http://localhost:3000';

  Future<void> _login() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    final engineerId = _engineerIdController.text.trim();
    final password = _passwordController.text.trim();

    if (engineerId.isEmpty || password.isEmpty) {
      setState(() {
        _error = 'Engineer ID and Password required';
        _isLoading = false;
      });
      return;
    }

    try {
      final uri = Uri.parse('$_baseUrl/api/login');

      final response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'engineerId': engineerId,
          'password': password,
        }),
      );

      final Map<String, dynamic> body = jsonDecode(response.body);

      if (body['success'] != true) {
        setState(() {
          _error = body['error'] ?? 'Login failed';
        });
      } else {
        final data = body['data'];
        final status = data['Status'];

        if (status == 'S') {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (_) =>
                  DashboardScreen(engineerId: data['EngineerId']),
            ),
          );
        } else {
          setState(() {
            _error = data['StatusMsg'];
          });
        }
      }
    } catch (e) {
      setState(() {
        _error = 'Server Error: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _engineerIdController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          width: 420,
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            boxShadow: [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 20,
                offset: Offset(0, 6),
              )
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.engineering, size: 70, color: Colors.blue),
              const SizedBox(height: 20),
              const Text(
                'Maintenance Login',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 30),

              TextField(
                controller: _engineerIdController,
                decoration: InputDecoration(
                  labelText: 'Engineer ID',
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10)),
                  prefixIcon: const Icon(Icons.badge),
                ),
              ),
              const SizedBox(height: 18),

              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10)),
                  prefixIcon: const Icon(Icons.lock),
                ),
              ),
              const SizedBox(height: 20),

              if (_error != null)
                Text(
                  _error!,
                  style: const TextStyle(color: Colors.red),
                ),

              const SizedBox(height: 20),

              _isLoading
                  ? const CircularProgressIndicator()
                  : SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _login,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10)),
                        ),
                        child: const Text(
                          'LOGIN',
                          style: TextStyle(fontSize: 16),
                        ),
                      ),
                    ),
            ],
          ),
        ),
      ),
    );
  }
}

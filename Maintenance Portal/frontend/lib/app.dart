import 'package:flutter/material.dart';
import 'screens/login.dart';

class MaintenanceApp extends StatelessWidget {
  const MaintenanceApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Maintenance Portal',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF1E3A8A),
        scaffoldBackgroundColor: const Color(0xFFF5F7FB),
        fontFamily: 'Roboto',
      ),
      home: const LoginScreen(),
    );
  }
}

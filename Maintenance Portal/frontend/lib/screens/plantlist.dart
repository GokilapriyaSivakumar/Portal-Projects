import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class PlantListScreen extends StatefulWidget {
  const PlantListScreen({Key? key}) : super(key: key);

  @override
  State<PlantListScreen> createState() => _PlantListScreenState();
}

class _PlantListScreenState extends State<PlantListScreen> {
  List<dynamic> plants = [];
  bool isLoading = true;
  String? error;

  final Color primaryBlue = const Color(0xFF1E88E5);
  final Color bgColor = const Color(0xFFF4F8FF);

  @override
  void initState() {
    super.initState();
    fetchPlants();
  }

  Future<void> fetchPlants() async {
    try {
      final response =
          await http.get(Uri.parse('http://localhost:3000/api/plantlist'));

      if (response.statusCode != 200) {
        setState(() {
          error = 'Server Error: ${response.statusCode}';
          isLoading = false;
        });
        return;
      }

      final jsonResp = jsonDecode(response.body);

      if (jsonResp['success'] == true && jsonResp['data'] != null) {
        setState(() {
          plants = jsonResp['data'];
          isLoading = false;
        });
      } else {
        setState(() {
          error = jsonResp['error'] ?? 'No plants found';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Network Error: $e';
        isLoading = false;
      });
    }
  }

  Widget infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(
            flex: 4,
            child: Text(label,
                style:
                    const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
          ),
          Expanded(
              flex: 6,
              child: Text(value.isEmpty ? '-' : value,
                  style: const TextStyle(fontSize: 14))),
        ],
      ),
    );
  }

  Widget plantCard(Map<String, dynamic> p) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border(left: BorderSide(color: primaryBlue, width: 5)),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 8)
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            p['Name1'] ?? '',
            style: TextStyle(
                fontSize: 18, fontWeight: FontWeight.bold, color: primaryBlue),
          ),
          const SizedBox(height: 10),
          infoRow("Plant Code", p['Werks'] ?? ''),
          infoRow("Engineer", p['MaintenanceEngineer'] ?? ''),
          infoRow("Street", p['Stras'] ?? ''),
          infoRow("City", p['Ort01'] ?? ''),
          infoRow("Country", p['Land1'] ?? ''),
          infoRow("Region", p['Regio'] ?? ''),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        title: const Text("Plant List"),
        backgroundColor: primaryBlue,
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator(color: primaryBlue))
          : error != null
              ? Center(child: Text(error!))
              : ListView.builder(
                  itemCount: plants.length,
                  itemBuilder: (context, index) {
                    return plantCard(plants[index]);
                  },
                ),
    );
  }
}

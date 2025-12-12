import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class WorkOrdersScreen extends StatefulWidget {
  final String sowrk;

  const WorkOrdersScreen({Key? key, required this.sowrk}) : super(key: key);

  @override
  State<WorkOrdersScreen> createState() => _WorkOrdersScreenState();
}

class _WorkOrdersScreenState extends State<WorkOrdersScreen> {
  List<dynamic> workorders = [];
  bool isLoading = true;
  String? error;

  final Color primaryBlue = const Color(0xFF1E88E5);
  final Color bgColor = const Color(0xFFF4F8FF);

  @override
  void initState() {
    super.initState();
    fetchWorkOrders();
  }

  Future<void> fetchWorkOrders() async {
    try {
      final url =
          'http://localhost:3000/api/workorder?sowrk=${widget.sowrk}';

      final response = await http.get(Uri.parse(url));

      if (response.statusCode != 200) {
        setState(() {
          error = 'Server Error: ${response.statusCode}';
          isLoading = false;
        });
        return;
      }

      final jsonResp = jsonDecode(response.body);

      if (jsonResp['success'] == true) {
        setState(() {
          workorders = jsonResp['data'];
          isLoading = false;
        });
      } else {
        setState(() {
          error = jsonResp['error'];
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = e.toString();
        isLoading = false;
      });
    }
  }

  String formatDate(String? value) {
    if (value == null || value.isEmpty) return '-';
    try {
      final dt = DateTime.parse(value);
      return "${dt.day}-${dt.month}-${dt.year}";
    } catch (_) {
      return value;
    }
  }

  Widget infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(
              flex: 4,
              child: Text(label,
                  style: const TextStyle(
                      fontWeight: FontWeight.w600, fontSize: 13))),
          Expanded(
              flex: 6,
              child: Text(value.isEmpty ? '-' : value,
                  style: const TextStyle(fontSize: 13))),
        ],
      ),
    );
  }

  /// ✅ EXPANDABLE CARD
  Widget workOrderCard(Map<String, dynamic> w) {
    bool isCompleted = w['Phas3'] == 'true';

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border(
          left: BorderSide(
              color: isCompleted ? Colors.green : Colors.orange, width: 5),
        ),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 8),
        ],
      ),
      child: Theme(
        data: ThemeData().copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          tilePadding:
              const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          childrenPadding:
              const EdgeInsets.symmetric(horizontal: 18, vertical: 12),

          /// ✅ CLOSED VIEW (DEFAULT)
          title: Text(
            w['Ktext'] ?? '',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.bold,
              color: primaryBlue,
            ),
          ),
          subtitle: Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Order No: ${w['Aufnr'] ?? '-'}",
                    style: const TextStyle(fontSize: 13)),
                const SizedBox(height: 4),
                Text("Order Type: ${w['Auart'] ?? '-'}",
                    style: const TextStyle(fontSize: 13)),
              ],
            ),
          ),

          /// ✅ EXPANDED VIEW (ALL DETAILS)
          children: [
            infoRow("Created Date", formatDate(w['Erdat'])),
            infoRow("Plant", w['Werks'] ?? ''),
            infoRow("Company Code", w['Bukrs'] ?? ''),
            infoRow("Work Center", w['Vaplz'] ?? ''),
            infoRow("Cost Center", w['Kostl'] ?? ''),
            infoRow("Application", w['Kappl'] ?? ''),
            infoRow("Status Profile", w['Kalsm'] ?? ''),
            infoRow("Phase 0", w['Phas0'] ?? ''),
            infoRow("Phase 1", w['Phas1'] ?? ''),
            infoRow("Phase 2", w['Phas2'] ?? ''),
            infoRow("Phase 3", w['Phas3'] ?? ''),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        title: const Text("Work Orders"),
        backgroundColor: primaryBlue,
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator(color: primaryBlue))
          : error != null
              ? Center(child: Text(error!))
              : ListView.builder(
                  itemCount: workorders.length,
                  itemBuilder: (context, index) {
                    return workOrderCard(workorders[index]);
                  },
                ),
    );
  }
}

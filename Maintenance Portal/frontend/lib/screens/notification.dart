import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class NotificationsScreen extends StatefulWidget {
  final String iwerk;

  const NotificationsScreen({Key? key, required this.iwerk})
      : super(key: key);

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<dynamic> notifications = [];
  bool isLoading = true;
  String? error;

  final Color primaryColor = const Color(0xFF2563EB);
  final Color backgroundColor = const Color(0xFFF1F5F9);

  @override
  void initState() {
    super.initState();
    fetchNotifications();
  }

  // ✅ FETCH FROM YOUR BACKEND
  Future<void> fetchNotifications() async {
    setState(() {
      isLoading = true;
      error = null;
    });

    try {
      final url =
          'http://localhost:3000/api/notifications?iwerk=${widget.iwerk}';

      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        final jsonResp = jsonDecode(response.body);

        if (jsonResp['success'] == true) {
          setState(() {
            notifications = jsonResp['data'];
            isLoading = false;
          });
        } else {
          setState(() {
            error = jsonResp['error'] ?? 'No notifications found';
            isLoading = false;
          });
        }
      } else {
        setState(() {
          error = 'Server Error: ${response.statusCode}';
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

  // ✅ SAP DATE FORMAT → DD-MM-YYYY
  String formatSapDate(String? sapDate) {
    if (sapDate == null || sapDate.isEmpty) return '-';
    final match = RegExp(r"\d+").firstMatch(sapDate);
    if (match == null) return '-';

    final dt = DateTime.fromMillisecondsSinceEpoch(
        int.parse(match.group(0)!));

    return "${dt.day.toString().padLeft(2, '0')}-"
        "${dt.month.toString().padLeft(2, '0')}-"
        "${dt.year}";
  }

  // ✅ PRIORITY BADGE
  Widget priorityBadge(String? priok) {
    Color color = Colors.grey;
    String label = 'N/A';

    if (priok == '1') {
      color = Colors.red;
      label = 'HIGH';
    } else if (priok == '2') {
      color = Colors.orange;
      label = 'MEDIUM';
    } else if (priok == '3') {
      color = Colors.green;
      label = 'LOW';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color),
      ),
      child: Text(
        label,
        style: TextStyle(
            fontSize: 12, fontWeight: FontWeight.bold, color: color),
      ),
    );
  }

  Widget infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(top: 6),
      child: Row(
        children: [
          Expanded(
            flex: 4,
            child: Text(label,
                style: const TextStyle(fontWeight: FontWeight.w600)),
          ),
          Expanded(
            flex: 6,
            child:
                Text(value, style: const TextStyle(color: Colors.black54)),
          ),
        ],
      ),
    );
  }

  // ✅ FULL DETAILS CARD
  Widget notificationCard(Map<String, dynamic> item) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 8),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: primaryColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(Icons.notifications, color: primaryColor),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  item['Qmtxt'] ?? 'No Description',
                  style: const TextStyle(
                      fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
              priorityBadge(item['Priok']),
            ],
          ),

          const SizedBox(height: 14),
          const Divider(),

          infoRow("Notification No", item['Qmnum']),
          infoRow("Order No", item['Aufnr']),
          infoRow("Plant", item['Iwerk']),
          infoRow("Work Center", item['Arbplwerk']),
          infoRow("Equipment", item['Equnr']),
          infoRow("Created On", formatSapDate(item['Erdat'])),
          infoRow("Start Date", formatSapDate(item['Strmn'])),
          infoRow("Breakdown", item['Abckz']),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        title: const Text("Notifications"),
        backgroundColor: primaryColor,
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator(color: primaryColor))
          : error != null
              ? Center(
                  child: Text(error!,
                      style: const TextStyle(
                          color: Colors.red, fontSize: 16)),
                )
              : notifications.isEmpty
                  ? const Center(
                      child: Text("No notifications found",
                          style: TextStyle(fontSize: 17)),
                    )
                  : ListView.builder(
                      physics: const BouncingScrollPhysics(),
                      itemCount: notifications.length,
                      itemBuilder: (context, index) {
                        return notificationCard(notifications[index]);
                      },
                    ),
    );
  }
}

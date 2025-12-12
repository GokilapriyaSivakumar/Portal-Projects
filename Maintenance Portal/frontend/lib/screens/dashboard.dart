import 'package:flutter/material.dart';
import 'login.dart';
import 'notification.dart';
import 'workorder.dart';
import 'plantlist.dart';

class DashboardScreen extends StatelessWidget {
  final String engineerId;

  const DashboardScreen({Key? key, required this.engineerId}) : super(key: key);

  void _logout(BuildContext context) {
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (route) => false,
    );
  }

  void _navigate(BuildContext context, Widget screen) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => screen));
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8)],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 26,
            backgroundColor: color.withOpacity(0.2),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(width: 14),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  style: const TextStyle(fontSize: 13, color: Colors.grey)),
              const SizedBox(height: 4),
              Text(value,
                  style: const TextStyle(
                      fontSize: 20, fontWeight: FontWeight.bold)),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildTile(
      BuildContext context, IconData icon, String title, Color color, Widget screen) {
    return InkWell(
      onTap: () => _navigate(context, screen),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8)],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 30,
              backgroundColor: color.withOpacity(0.2),
              child: Icon(icon, size: 32, color: color),
            ),
            const SizedBox(height: 16),
            Text(title,
                style:
                    const TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async => false,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Maintenance Dashboard'),
          backgroundColor: Colors.blue,
          actions: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Center(
                child: Text('Engineer: $engineerId'),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.logout),
              onPressed: () => _logout(context),
            )
          ],
        ),
        drawer: Drawer(
          child: Column(
            children: [
              UserAccountsDrawerHeader(
                decoration: const BoxDecoration(color: Colors.blue),
                accountName: const Text('Maintenance Engineer'),
                accountEmail: Text(engineerId),
                currentAccountPicture: const CircleAvatar(
                  backgroundColor: Colors.white,
                  child: Icon(Icons.engineering, size: 36),
                ),
              ),
              ListTile(
                leading: const Icon(Icons.notifications),
                title: const Text('Notifications'),
                onTap: () {
                  Navigator.pop(context);
                  _navigate(
                    context,
                    const NotificationsScreen(iwerk: '0001'),
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.work),
                title: const Text('Work Orders'),
                onTap: () {
                  Navigator.pop(context);
                  _navigate(
                    context,
                    const WorkOrdersScreen(sowrk: '1009'),
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.factory),
                title: const Text('Plant List'),
                onTap: () {
                  Navigator.pop(context);
                  _navigate(context, const PlantListScreen());
                },
              ),
              const Spacer(),
              ListTile(
                leading: const Icon(Icons.logout, color: Colors.red),
                title: const Text('Logout',
                    style: TextStyle(color: Colors.red)),
                onTap: () => _logout(context),
              )
            ],
          ),
        ),
        body: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            children: [
              // Row(
                
              const SizedBox(height: 40),
              Expanded(
                child: GridView.count(
                  crossAxisCount: 3,
                  crossAxisSpacing: 24,
                  mainAxisSpacing: 24,
                  children: [
                    _buildTile(
                      context,
                      Icons.notifications,
                      'Notifications',
                      Colors.orange,
                      NotificationsScreen(iwerk: '0001'),
                    ),
                    _buildTile(
                      context,
                      Icons.work,
                      'Work Orders',
                      Colors.green,
                      const WorkOrdersScreen(sowrk: '1009'),
                    ),
                    _buildTile(
                      context,
                      Icons.factory,
                      'Plant List',
                      Colors.blue,
                      const PlantListScreen(),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

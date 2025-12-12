const express = require('express');
const cors = require('cors');

const { validateLogin } = require('./login');
const notificationRoutes = require('./notification');
const { getPlantList } = require('./plantlist');
const workorderRoutes = require('./workorder');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// ✅ TEST ROUTE
app.get('/', (req, res) => {
  res.send("✅ Backend Server is Working");
});

// ✅ LOGIN API (POST)
app.post('/api/login', async (req, res) => {
  const { engineerId, password } = req.body;

  if (!engineerId || !password) {
    return res.status(400).json({
      success: false,
      error: "Engineer ID & Password are required"
    });
  }

  try {
    const result = await validateLogin(engineerId, password);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ✅ NOTIFICATION API (GET)
app.use('/api/notifications', notificationRoutes);

// ✅ PLANT LIST API (GET)
app.get('/api/plantlist', async (req, res) => {
  try {
    const result = await getPlantList();
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err
    });
  }
});

// ✅ WORKORDER API (GET)
app.use('/api/workorder', workorderRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const app = express();
const basicAuth = require("express-basic-auth");
const authenticateToken = require('./middleware/authenticateToken');

require('dotenv').config();

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/uprise-releases", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); // Restringir a frontend local

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Log all incoming requests and their headers
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization header' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  const users = { admin: "password" };
  if (users[username] && users[username] === password) {
    console.log('Login successful:', username);
    const user = {
      username,
      password,
      avatarUrl: 'https://robohash.org/f912301f0661f713ae213db0a078f642?set=set4&bgset=&size=400x400' // Default avatar URL
    };

    res.json({ message: 'Logged in successfully', success: true, user });
  } else {
    res.status(401).json({ message: 'Invalid credentials', success: false });
  }
});

// Protegemos solo las rutas de releases con autenticación básica
app.use("/api/releases", basicAuth({
  users: { [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASS },
  challenge: true,
}), require("./routes/releases"));

// Serve static files from client build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
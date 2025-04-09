const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const app = express();
const basicAuth = require("express-basic-auth");
const passport = require("passport");
const crypto = require("crypto");
const OpenIDConnectStrategy = require("passport-openidconnect").Strategy;

const session = require("express-session");
const cookieParser = require("cookie-parser");

require('dotenv').config();

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/uprise-releases")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL, // Allow requests from the frontend
  credentials: true, // Allow cookies to be sent
}));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(cookieParser());

app.use(
  session({
    secret: process.env.OIDC_CLIENT_SECRET, // Replace with a secure secret
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

passport.use(
  new OpenIDConnectStrategy(
    {
      issuer: process.env.OIDC_AUTHORITY,
      authorizationURL: `${process.env.OIDC_AUTHORITY}/connect/authorize`,
      tokenURL: `${process.env.OIDC_AUTHORITY}/connect/token`,
      userInfoURL: `${process.env.OIDC_AUTHORITY}/connect/userinfo`,
      clientID: process.env.OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_CLIENT_SECRET,
      callbackURL: process.env.OIDC_REDIRECT_URI,
      scope: "openid profile email",
    },
    (issuer, sub, profile, accessToken, refreshToken, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Log all incoming requests and their headers
// Uncomment when debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// OIDC Login Route
app.get("/auth/login", (req, res) => {
  const state = encodeURIComponent(
    crypto.randomBytes(16).toString("hex") // Generate a random state
  );

  const nonce = crypto.randomBytes(16).toString("hex"); // Generate a random nonce

  const identityServerUrl = `${process.env.OIDC_AUTHORITY}connect/authorize?` +
    `client_id=${process.env.OIDC_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.OIDC_REDIRECT_URI)}` +
    `&scope=${encodeURIComponent("offline_access openid profile vw VisionWeb.AppMessaging.Api AppMsg.VisionWeb.WS")}` +
    `&response_mode=form_post` +
    `&response_type=id_token+code` +
    `&nonce=${nonce}` +
    `&state=${state}`;

  // Set a cookie to store the state for validation later
  res.cookie(`Uprise.${state}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  });
  
  // Redirect to the identity server
  res.redirect(identityServerUrl);
});

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Generate a random state and nonce
  const state = encodeURIComponent(crypto.randomBytes(16).toString("hex"));
  const nonce = crypto.randomBytes(16).toString("hex");

  // Construct the OIDC authorization URL
  const identityServerUrl = `${process.env.OIDC_AUTHORITY}connect/authorize?` +
    `client_id=${process.env.OIDC_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.OIDC_REDIRECT_URI)}` +
    `&scope=${encodeURIComponent("offline_access openid profile vw VisionWeb.AppMessaging.Api AppMsg.VisionWeb.WS")}` +
    `&response_mode=form_post` +
    `&response_type=id_token+code` +
    `&nonce=${nonce}` +
    `&state=${state}`;

  // Store the username and password in the session for later use
  req.session.username = username;
  req.session.password = password;

  // Set a cookie to store the state for validation later
  res.cookie(`Uprise.${state}`, state, { httpOnly: true });

  // Send the redirect URL to the frontend
  res.json({ redirectUrl: identityServerUrl });
});

app.post("/Login/idcallback", async (req, res) => {
  const { id_token, code, state } = req.body;

  console.log("Received idcallback parameters:");
  console.log("id_token:", id_token);
  console.log("code:", code);
  console.log("state:", state);

  // Validate the state parameter
  const cookieName = `Uprise.${state}`;
  const storedState = req.cookies[cookieName];

  if (!storedState || storedState !== state) {
    console.error("State validation failed");
    return res.redirect(`${process.env.FRONTEND_URL}/error`);
  }

  // Clear the state cookie
  res.clearCookie(cookieName);

  // Exchange the code for tokens if necessary
  if (code) {
    try {
      const tokenResponse = await axios.post(
        `${process.env.OIDC_AUTHORITY}connect/token`,
        new URLSearchParams({
          client_id: process.env.OIDC_CLIENT_ID,
          client_secret: process.env.OIDC_CLIENT_SECRET,
          redirect_uri: process.env.OIDC_REDIRECT_URI,
          grant_type: "authorization_code",
          code,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      console.log("Token response:", tokenResponse.data);

      // Store tokens in the session
      req.session.accessToken = tokenResponse.data.access_token;
      req.session.refreshToken = tokenResponse.data.refresh_token;
    } catch (err) {
      console.error("Error exchanging code for tokens:", err);
      return res.redirect(`${process.env.FRONTEND_URL}/error`);
    }
  }

  // Store id_token in the session
  req.session.idToken = id_token;

  console.log("Session data:", req.session);

  // Redirect to the frontend after successful authentication
  res.redirect(`${process.env.FRONTEND_URL}/`);
});

// OIDC Logout Route
app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("https://QA4auth.visionweb.com/connect/endsession"); // Redirect to the OIDC logout endpoint
  });
});

app.get("/error", (req, res) => {
  res.status(400).send("An error occurred during login. Please try again.");
});



// Protegemos solo las rutas de releases con autenticación básica
app.use("/api/releases", basicAuth({
  users: { [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASS },
  challenge: false,
}), require("./routes/releases"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from client build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));
}

// Start Server
const PORT = process.env.PORT || 9011;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
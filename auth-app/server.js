const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS, images, etc.) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MitsuSQL5847",
  database: "auth_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// Route to serve the Sign-Up page when visiting the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'sign-up.html')); // Serve sign-up.html from the 'views' folder
});

app.get("/sign-up", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'sign-up.html'));
});

// Sign-Up Route
app.post("/sign-up", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, hashedPassword], (err, result) => {
    if (err) {
      res.status(500).send("Error signing up");
    } else {
      res.send("User registered successfully!");
    }
  });
});

// Route to serve the Sign-In page
app.get("/sign-in", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'sign-in.html')); // Serve sign-in.html
});

// Sign-In Route
app.post("/sign-in", async (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(sql, [username, username], async (err, results) => {
    if (err) return res.status(500).send("Server error");

    if (results.length === 0) return res.status(401).send("User not found");

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).send("Invalid credentials");
    } else {
      res.send("Sign-in successful!");
    }
  });
});

app.get("/forgot-pass", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'forgot-pass.html'));
});
// Forgot Password Route
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).send("Server error");

    if (results.length === 0) return res.status(404).send("Email not found");

    res.send("Password reset link has been sent to your email.");
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

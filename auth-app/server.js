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
  multipleStatements: true
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
  
  // Create tables if they don't exist
  const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  db.query(createUserTable, (err) => {
    if (err) {
      console.error("Error creating users table:", err);
    } else {
      console.log("Users table checked/created");
      
      // Load and execute the tasks schema
      const fs = require('fs');
      const path = require('path');
      const sqlFilePath = path.join(__dirname, 'public', 'database', 'tasks_schema.sql');
      
      fs.readFile(sqlFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading SQL file:', err);
          return;
        }
        
        db.query(data, (err) => {
          if (err) {
            console.error('Error executing SQL schema:', err);
          } else {
            console.log('Tasks tables checked/created');
          }
        });
      });
    }
  });
});

// Import task routes
const taskRoutes = require('./public/routes/tasks')(db);
app.use('/api', taskRoutes);

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
      res.redirect("/home");
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
      res.redirect("/home");
    }
  });
});

// API Login route for JSON response
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(sql, [username, username], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (results.length === 0) return res.status(401).json({ message: "User not found" });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid credentials" });
    } else {
      // Return user data without sensitive information
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email
      };
      res.status(200).json(userData);
    }
  });
});

// Route to serve the Forgot Password page
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

// Route to serve the Home page after sign-in
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home-page.html')); // Serve home.html
});

// Route to serve the Profile page
app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'profile.html')); // Serve profile.html
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

// Create database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MitsuSQL5847",
  database: "auth_db",
  multipleStatements: true // Enable running multiple SQL statements
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("MySQL Connected...");
  
  // Read and execute SQL file
  const sqlFilePath = path.join(__dirname, "tasks_schema.sql");
  fs.readFile(sqlFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading SQL file:", err);
      return;
    }
    
    db.query(data, (err, results) => {
      if (err) {
        console.error("Error executing SQL:", err);
        return;
      }
      console.log("Task tables created successfully!");
      db.end();
    });
  });
});

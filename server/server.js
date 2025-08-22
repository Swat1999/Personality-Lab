// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
require("dotenv").config();

const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/tests');

const app = express();
const PORT = 5001;


// Middleware
app.use(cors({
  origin: "http://localhost:3001",   // frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes); 
app.use('/api/tests', testRoutes);

// MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",      // MySQL host
  user: "root",           // your MySQL username
  password: "Sunshine@20019", // your MySQL password
  database: "future_rem_db" // database you created in Workbench
});

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "OOg8rrGEDQNPPq0fYxFD9809ux94OYM7BAyG5K844nPP9J6juFgGazcGS2+eWQ8wH3QJDWHDUUHRnyK5phYM4g==";

// ================= Signup =================
app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`;
    await pool.execute(query, [firstName, lastName, email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already registered" });
    }
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// ================= Signin =================
app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// ================= Protected Route Example =================
app.get("/api/profile", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await pool.execute("SELECT id, firstName, lastName, email FROM users WHERE id = ?", [decoded.id]);

    if (rows.length === 0) return res.status(404).json({ error: "User not found" });

    res.json({ profile: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: "Invalid token" });
  }
});

// ================= Server Start =================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
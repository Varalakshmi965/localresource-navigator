const express = require('express');
const path = require('path');
const admin = require('./firebase'); // Initialized Firebase admin
const bcrypt = require('bcrypt');

const app = express();
const db = admin.firestore();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes: Serve Pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "public", "signup.html")));

// -----------------------------
// 🔐 Signup Route
// -----------------------------
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).send('❌ Missing fields');
    }

    // Check if email is already used
    const existingUser = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return res.status(400).send('⚠ Email already registered.');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    await db.collection('users').add({
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).send('✅ Signup successful');
  } catch (err) {
    console.error('❌ Signup Error:', err);
    return res.status(500).send('❌ Signup failed');
  }
});

// -----------------------------
// 🔐 Login Route
// -----------------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('❌ Email and password required.');
  }

  try {
    const snapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).send('❌ User not found.');
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Compare hashed password
    const match = await bcrypt.compare(password, userData.password);
    if (!match) {
      return res.status(401).send('❌ Incorrect password.');
    }

    return res.status(200).send('✅ Login successful!');
  } catch (err) {
    console.error('❌ Login Error:', err);
    return res.status(500).send('❌ Server error during login.');
  }
});

// -----------------------------
// ✅ Start Server
// -----------------------------
const PORT = 2000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

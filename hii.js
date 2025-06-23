const express = require('express');
const path = require('path');
const admin = require('./firebase'); // Make sure this exports initialized admin
const app = express();

const db = admin.firestore();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route: Home Test

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "public", "signup.html")));
// Route: Serve Signup Page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Route: Handle Signup POST
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).send('❌ Missing fields');
    }

    // Optional: Check if user already exists
    const existingUser = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return res.status(400).send('⚠ Email already registered.');
    }

    await db.collection('users').add({
      name,
      email,
      password,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).send('✅ Signup successful');
  } catch (err) {
    console.error('❌ Signup Error:', err);
    res.status(500).send('❌ Signup failed');
  }
});

// Route: Handle Login POST
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('❌ Email and password required.');
  }

  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      return res.status(404).send('❌ User not found.');
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.password !== password) {
      return res.status(401).send('❌ Incorrect password.');
    }

    return res.send('✅ Login successful!');
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).send('❌ Server error during login.');
  }
});

// Start Server
const PORT = 2000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
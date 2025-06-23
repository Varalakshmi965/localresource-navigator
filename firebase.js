const admin = require('firebase-admin');

try {
  console.log('Trying to load firebase-admin.json...');
  const serviceAccount = require('./firebase-admin.json');
  console.log('firebase-admin.json loaded successfully');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://your-project-id.firebaseio.com" // Replace this with your actual URL
  });

  console.log('Firebase initialized');
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  process.exit(1);
}

module.exports = admin;

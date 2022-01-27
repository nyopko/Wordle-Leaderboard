var admin = require("firebase-admin");

var serviceAccount = require("/Users/yopko/Downloads/wordle-leaderboard-8031c-firebase-adminsdk-zamfr-98a25e8357.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT
    );
} else {
    serviceAccount = require("./firebase-service-account.json");
}

const firebaseConfig = {
    credential: cert(serviceAccount),
    databaseURL:
        process.env.FIREBASE_DATABASE_URL ||
        "https://zorplay-moov-gabon-default-rtdb.firebaseio.com"
};

if (getApps().length === 0) {
    initializeApp(firebaseConfig);
}

const db = getDatabase();

module.exports = db;
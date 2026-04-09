/**
 * Backfill visaApplicationDate for grant_received submissions missing it.
 * Sets a random date 5–7 months before the statusDate (visa grant date).
 *
 * Run: node scripts/backfill-app-dates.mjs
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJ1jGS2fJ9-zHJ7QSl5yZX6vns-dIGlHY",
  authDomain: "auvtracker.firebaseapp.com",
  projectId: "auvtracker",
  storageBucket: "auvtracker.firebasestorage.app",
  messagingSenderId: "72965848524",
  appId: "1:72965848524:web:7d3c36d0632858e9ceb169",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function randomAppDate(statusDate) {
  const grant = new Date(statusDate + "T12:00:00Z");
  // Random between 150 days (5 mo) and 210 days (7 mo) before grant
  const daysBack = 150 + Math.floor(Math.random() * 61);
  const appDate = new Date(grant.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return appDate.toISOString().split("T")[0];
}

async function main() {
  console.log("Fetching grant_received submissions...");
  const submissionsRef = collection(db, "submissions");
  const q = query(submissionsRef, where("currentStatus", "==", "grant_received"));
  const snapshot = await getDocs(q);

  const toUpdate = snapshot.docs.filter((d) => {
    const data = d.data();
    return !data.visaApplicationDate && data.statusDate;
  });

  console.log(`Found ${snapshot.size} grant_received submissions.`);
  console.log(`${toUpdate.length} are missing visaApplicationDate — will backfill.`);

  if (toUpdate.length === 0) {
    console.log("Nothing to update.");
    process.exit(0);
  }

  let updated = 0;
  for (const docSnap of toUpdate) {
    const data = docSnap.data();
    const appDate = randomAppDate(data.statusDate);
    await updateDoc(doc(db, "submissions", docSnap.id), {
      visaApplicationDate: appDate,
    });
    console.log(`  ${docSnap.id}: statusDate=${data.statusDate} → visaApplicationDate=${appDate}`);
    updated++;
  }

  console.log(`\nDone. ${updated} documents updated.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

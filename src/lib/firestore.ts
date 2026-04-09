import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

export interface StatusEntry {
  status: string;
  date: string; // ISO date string
}

export interface VisaSubmission {
  id?: string;
  visaSubclass: string;
  occupationCode: string;
  occupationTitle: string;
  occupationCategory: string;
  countryOfOrigin?: string;   // legacy — no longer collected
  sponsoringState?: string;
  statuses: StatusEntry[];    // legacy array kept for backward compat
  currentStatus: string;      // "eoi_invited" | "grant_received"
  statusDate?: string;        // ISO date of the current status event
  eoiLodgeDate?: string;        // optional: date EOI was submitted
  eoiInvitedDate?: string;      // optional: date EOI invited (for grant_received only)
  visaApplicationDate?: string; // optional: date visa application was lodged (grant_received only)
  pointsScore?: Record<string, number>;
  totalPoints?: number;
  email?: string;
  submittedAt?: Timestamp;
  lang?: string;
}

export interface AggregatedStats {
  total: number;
  byVisa: Record<string, number>;
  byStatus: Record<string, number>;
  byOccupationCategory: Record<string, number>;
  byCountry: Record<string, number>;
  eoiInvited: number;
  granted: number;
  refused: number;
  inProgress: number;
  processingTimes: Record<string, number[]>;
  submissionsByMonth: Record<string, number>;
  eoiInvitedByMonth: Record<string, number>;  // "YYYY-MM" -> count of EOI invites
  grantedByMonth: Record<string, number>;      // "YYYY-MM" -> count of visas granted
  appToGrantDays: Record<string, number[]>;    // visaSubclass -> days from app lodged to grant
}

export async function submitVisa(data: Omit<VisaSubmission, "id">): Promise<string> {
  const submissionsRef = collection(db, "submissions");
  const docRef = await addDoc(submissionsRef, {
    ...data,
    submittedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function fetchSubmissions(limitCount = 500): Promise<VisaSubmission[]> {
  const submissionsRef = collection(db, "submissions");
  const q = query(submissionsRef, orderBy("submittedAt", "desc"), limit(limitCount));
  const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as VisaSubmission[];
}

export async function fetchFilteredSubmissions(
  visaSubclass?: string,
  limitCount = 500
): Promise<VisaSubmission[]> {
  const submissionsRef = collection(db, "submissions");
  let q;
  if (visaSubclass) {
    q = query(
      submissionsRef,
      where("visaSubclass", "==", visaSubclass),
      orderBy("submittedAt", "desc"),
      limit(limitCount)
    );
  } else {
    q = query(submissionsRef, orderBy("submittedAt", "desc"), limit(limitCount));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as VisaSubmission[];
}

export function aggregateStats(submissions: VisaSubmission[]): AggregatedStats {
  const stats: AggregatedStats = {
    total: submissions.length,
    byVisa: {},
    byStatus: {},
    byOccupationCategory: {},
    byCountry: {},
    eoiInvited: 0,
    granted: 0,
    refused: 0,
    inProgress: 0,
    processingTimes: {},
    submissionsByMonth: {},
    eoiInvitedByMonth: {},
    grantedByMonth: {},
    appToGrantDays: {},
  };

  for (const sub of submissions) {
    // By visa
    stats.byVisa[sub.visaSubclass] = (stats.byVisa[sub.visaSubclass] || 0) + 1;

    // By status
    stats.byStatus[sub.currentStatus] = (stats.byStatus[sub.currentStatus] || 0) + 1;

    // By occupation category
    if (sub.occupationCategory) {
      stats.byOccupationCategory[sub.occupationCategory] =
        (stats.byOccupationCategory[sub.occupationCategory] || 0) + 1;
    }

    // By country (legacy)
    if (sub.countryOfOrigin) {
      stats.byCountry[sub.countryOfOrigin] =
        (stats.byCountry[sub.countryOfOrigin] || 0) + 1;
    }

    // EOI Invited / Granted / other
    if (sub.currentStatus === "grant_received") {
      stats.granted++;
      if (sub.statusDate) {
        const m = sub.statusDate.slice(0, 7);
        stats.grantedByMonth[m] = (stats.grantedByMonth[m] || 0) + 1;
      }
    } else if (sub.currentStatus === "eoi_invited") {
      stats.eoiInvited++;
      if (sub.statusDate) {
        const m = sub.statusDate.slice(0, 7);
        stats.eoiInvitedByMonth[m] = (stats.eoiInvitedByMonth[m] || 0) + 1;
      }
    } else {
      stats.inProgress++;
    }

    // App-to-grant: visaApplicationDate → statusDate (grant)
    if (sub.currentStatus === "grant_received" && sub.statusDate && sub.visaApplicationDate) {
      const days = Math.round(
        (new Date(sub.statusDate).getTime() - new Date(sub.visaApplicationDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (days > 0 && days < 3650) {
        if (!stats.appToGrantDays[sub.visaSubclass]) stats.appToGrantDays[sub.visaSubclass] = [];
        stats.appToGrantDays[sub.visaSubclass].push(days);
      }
    }

    // Processing time: eoiLodgeDate (or eoi_submitted status) → grant_received
    if (sub.currentStatus === "grant_received" && sub.statusDate) {
      // Prefer the explicit eoiLodgeDate field; fall back to statuses array
      const lodgeDateStr =
        sub.eoiLodgeDate ??
        sub.statuses?.find((s) => s.status === "eoi_submitted")?.date;
      if (lodgeDateStr) {
        const days = Math.round(
          (new Date(sub.statusDate).getTime() - new Date(lodgeDateStr).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        if (days > 0 && days < 3650) {
          if (!stats.processingTimes[sub.visaSubclass]) {
            stats.processingTimes[sub.visaSubclass] = [];
          }
          stats.processingTimes[sub.visaSubclass].push(days);
        }
      }
    }

    // Submissions by month
    if (sub.submittedAt) {
      const date = sub.submittedAt.toDate
        ? sub.submittedAt.toDate()
        : new Date((sub.submittedAt as unknown as { seconds: number }).seconds * 1000);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      stats.submissionsByMonth[monthKey] = (stats.submissionsByMonth[monthKey] || 0) + 1;
    }
  }

  return stats;
}

export function getAvgProcessingTime(times: number[]): number {
  if (!times.length) return 0;
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
}

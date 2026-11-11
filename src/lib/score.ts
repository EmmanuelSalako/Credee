import type { Application, Confidence, ScoreResult } from './types';

export const SCORE_MIN = 300;
export const SCORE_MAX = 850;

export type Band = { min: number; label: string; tone: 'good' | 'fair' | 'poor' };

export const BANDS: Band[] = [
  { min: 740, label: 'Excellent', tone: 'good' },
  { min: 670, label: 'Very good', tone: 'good' },
  { min: 600, label: 'Good', tone: 'good' },
  { min: 520, label: 'Fair', tone: 'fair' },
  { min: SCORE_MIN, label: 'Needs work', tone: 'poor' },
];

export function bandFor(score: number): Band {
  return BANDS.find((b) => score >= b.min) ?? BANDS[BANDS.length - 1];
}

export function clampScore(score: number): number {
  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, Math.round(score)));
}

/** More data sources mean more confidence, not necessarily a higher score. */
export function confidenceFor(app: Application): Confidence {
  let points = 0;
  if (app.statements.length >= 2) points += 2;
  else if (app.statements.length === 1) points += 1;
  if (app.consents.bureau && app.idKind === 'bvn') points += 2;
  if (app.consents.airtime) points += 1;
  if (app.consents.receipts) points += 1;
  if (points >= 5) return 'High';
  if (points >= 3) return 'Medium';
  return 'Low';
}

/**
 * MOCK scoring. Returns a believable, stable result for the prototype.
 * Replace with a call to the statement-analysis service when it exists.
 */
export async function scoreApplication(app: Application): Promise<ScoreResult> {
  await new Promise((r) => setTimeout(r, 300));

  // Stable per ID number so the same person sees the same score on reload.
  const seed = [...app.idNumber].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 997, 7);
  const base = 600 + (seed % 60);
  const score = clampScore(base + app.statements.length * 8 + (app.consents.airtime ? 6 : 0));
  const confidence = confidenceFor(app);

  const accounts = app.statements.length;
  const sources = [
    `6 months of statements from ${accounts} account${accounts === 1 ? '' : 's'}`,
    app.consents.bureau && app.idKind === 'bvn' ? '1 bureau record' : null,
  ].filter(Boolean);

  return {
    score,
    band: bandFor(score).label,
    confidence,
    basis: `Based on ${sources.join(' and ')}.`,
    reasons: [
      { code: 'INC_REGULAR', direction: 'up', text: 'Your salary arrives within 2 days of the 25th every month' },
      ...(app.consents.airtime
        ? [{ code: 'AIRTIME_STEADY', direction: 'up' as const, text: 'You recharge airtime and data steadily, with no gaps' }]
        : []),
      { code: 'LOW_BUFFER', direction: 'down', text: 'Your balance drops below ₦5,000 most months before payday' },
      { code: 'LATE_REPAY', direction: 'down', text: 'One loan app repayment in July was 9 days late' },
    ],
    tips: [
      { title: 'Keep a small buffer', body: 'Try to keep at least ₦10,000 in your account through the month.', points: [15, 25] },
      { title: 'Repay loan apps on time', body: 'Six months with no late repayments clears the July mark.', points: [10, 20] },
      accounts < 2
        ? { title: 'Add your wallet or second account', body: 'More accounts give us a fuller picture and raise confidence.', points: [5, 15] }
        : { title: 'Upload new statements monthly', body: 'Fresh data keeps your score current for lenders.', points: [0, 10] },
    ],
    updatedAt: new Date().toISOString(),
  };
}

/** Mock share code. The real one is issued by the backend and can be revoked. */
export function makeShareCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 4; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `CRD-${out}`;
}

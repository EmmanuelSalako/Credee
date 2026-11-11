export type IdKind = 'bvn' | 'nin';

export type ConsentKey = 'statements' | 'bureau' | 'airtime' | 'receipts';

export type StatementFile = {
  id: string;
  name: string;
  sizeBytes?: number;
  /** Set when the file came from the device picker; absent for sample files. */
  uri?: string;
};

/** Everything the user gives us during onboarding. */
export type Application = {
  phone: string;
  idKind: IdKind;
  idNumber: string;
  consents: Record<ConsentKey, boolean>;
  statements: StatementFile[];
};

export type Confidence = 'High' | 'Medium' | 'Low';

export type Reason = {
  code: string;
  text: string;
  direction: 'up' | 'down';
};

export type Tip = {
  title: string;
  body: string;
  /** Estimated points range, e.g. [15, 25]. */
  points: [number, number];
};

/**
 * The shape the real scoring API will return. The mock in mockScore.ts
 * produces the same shape so screens don't change when the backend lands.
 */
export type ScoreResult = {
  score: number; // 300 to 850
  band: string;
  confidence: Confidence;
  basis: string;
  reasons: Reason[];
  tips: Tip[];
  updatedAt: string; // ISO date
};

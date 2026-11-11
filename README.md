# Credee

Credee is a credit score for Nigerians, including people with no credit history. Instead of relying on bank APIs, it reads uploaded bank statements, combines them with credit bureau data (CRC and others) and alternative data such as airtime and data top-ups, and returns a score with plain-language reasons.

This repo holds the app: one React Native codebase (Expo) that runs on Android, iOS and the web.

## Status

This is the lightweight first version. The flow works end to end, but **the score is mocked**:

- The phone OTP accepts any 6 digits.
- BVN and NIN are only checked for length (11 digits).
- Statement PDFs are picked on the device but not uploaded or parsed.
- The score, reasons and share code come from `src/lib/score.ts`, which returns sample data in the same shape the real scoring service will return.

## The flow

1. Welcome
2. Phone number and SMS code
3. BVN (default, also unlocks bureau checks) or NIN
4. Consent, item by item: statements (required), credit bureau, airtime and data top-ups, rent and utility receipts
5. Upload 6 months of PDF statements, from one or more accounts or wallets
6. Analysing
7. Score from 300 to 850 with a band, a confidence level and the top reasons
8. Ways to improve, and a one-time share code for lenders

## Run it

Requires Node 20 or newer.

```bash
npm install
npm run web       # opens in the browser
npm start         # then scan the QR code with Expo Go on your phone
```

Other scripts:

```bash
npm run typecheck   # TypeScript
npm run build:web   # static web build in dist/
```

## Code layout

```
src/
  app/          screens, one file per route (Expo Router)
  components/   shared UI: buttons, fields, step header, score gauge, icons
  lib/          types, validation, mocked scoring
  state/        onboarding state shared across screens
  theme.ts      colours, fonts, radii
```

## Next steps

- Statement analysis service (Python, FastAPI) that parses PDFs and returns `ScoreResult` (see `src/lib/types.ts`). Swap `scoreApplication` in `src/lib/score.ts` for an API call.
- Real phone OTP and BVN/NIN verification through a KYC provider.
- Credit bureau lookups through an aggregator.
- Accounts, saved scores and revocable lender share codes on the backend.

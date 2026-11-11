import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Application, ConsentKey, IdKind, ScoreResult, StatementFile } from '../lib/types';

type Ctx = {
  app: Application;
  result: ScoreResult | null;
  setPhone: (phone: string) => void;
  setId: (kind: IdKind, number: string) => void;
  toggleConsent: (key: ConsentKey) => void;
  addStatement: (file: StatementFile) => void;
  removeStatement: (id: string) => void;
  setResult: (r: ScoreResult | null) => void;
};

const initial: Application = {
  phone: '',
  idKind: 'bvn',
  idNumber: '',
  consents: { statements: true, bureau: true, airtime: true, receipts: false },
  statements: [],
};

const ApplicationContext = createContext<Ctx | null>(null);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [app, setApp] = useState<Application>(initial);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const value = useMemo<Ctx>(
    () => ({
      app,
      result,
      setPhone: (phone) => setApp((a) => ({ ...a, phone })),
      setId: (idKind, idNumber) => setApp((a) => ({ ...a, idKind, idNumber })),
      toggleConsent: (key) =>
        setApp((a) =>
          key === 'statements' ? a : { ...a, consents: { ...a.consents, [key]: !a.consents[key] } },
        ),
      addStatement: (file) => setApp((a) => ({ ...a, statements: [...a.statements, file] })),
      removeStatement: (id) => setApp((a) => ({ ...a, statements: a.statements.filter((s) => s.id !== id) })),
      setResult,
    }),
    [app, result],
  );

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}

export function useApplication(): Ctx {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error('useApplication must be used inside ApplicationProvider');
  return ctx;
}

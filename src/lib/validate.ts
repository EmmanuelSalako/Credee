export const digitsOnly = (s: string) => s.replace(/\D/g, '');

/** Nigerian mobile number after +234, e.g. 803 123 4567 (10 digits, leading 0 dropped). */
export function normalisePhone(input: string): string {
  let d = digitsOnly(input);
  if (d.startsWith('234')) d = d.slice(3);
  if (d.startsWith('0')) d = d.slice(1);
  return d;
}

export function isValidPhone(input: string): boolean {
  return /^[789][01]\d{8}$/.test(normalisePhone(input));
}

/** BVN and NIN are both 11 digits. */
export function isValidIdNumber(input: string): boolean {
  return digitsOnly(input).length === 11;
}

export function formatPhone(d: string): string {
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6)].filter(Boolean).join(' ');
}

export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

/** Scores a password 0–4: length ≥ 8, upper+lower case, a digit, a special character. */
export function getPasswordStrength(password: string): StrengthLevel {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score as StrengthLevel;
}

export const strengthLabels: Record<StrengthLevel, string> = {
  0: "",
  1: "Yếu",
  2: "Trung bình",
  3: "Khá mạnh",
  4: "Rất mạnh",
};

export const PASSWORD_MIN_LENGTH = 8;

export type PasswordCheck = {
  ok: boolean;
  errors: string[];
};

/** Common SaaS rules: length + not only whitespace */
export function validatePassword(password: string): PasswordCheck {
  const errors: string[] = [];
  const trimmed = password.trim();

  if (trimmed.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Use at least ${PASSWORD_MIN_LENGTH} characters.`);
  }
  if (password !== trimmed) {
    errors.push("Password cannot start or end with spaces.");
  }
  if (trimmed.length >= PASSWORD_MIN_LENGTH) {
    if (!/[a-zA-Z]/.test(trimmed)) errors.push("Include at least one letter.");
    if (!/[0-9]/.test(trimmed)) errors.push("Include at least one number.");
  }

  return { ok: errors.length === 0, errors };
}

export function passwordsMatch(password: string, confirm: string): boolean {
  return password.length > 0 && password === confirm;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

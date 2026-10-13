const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const URL_PATTERN =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
const SPECIAL_CHARS = /[!@#$%^&*(),.?":{}|<>]/;

const MIN_PASSWORD_LENGTH = 8;
const MIN_USERNAME_LENGTH = 3;

export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (!email) {
    return 'Bitte gib eine E-Mail-Adresse ein';
  }
  return EMAIL_PATTERN.test(email) ? null : 'Bitte gib eine gültige E-Mail-Adresse ein';
}

export function validatePassword(value: string): string | null {
  if (!value) {
    return 'Bitte gib ein Passwort ein';
  }
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein`;
  }
  return null;
}

export function validatePasswordMatch(password: string, confirmation: string): string | null {
  if (!confirmation) {
    return 'Bitte bestätige dein Passwort';
  }
  return password === confirmation ? null : 'Passwörter stimmen nicht überein';
}

export function validateUsername(value: string): string | null {
  const name = value.trim();
  if (!name) {
    return 'Bitte gib einen Benutzernamen ein';
  }
  if (name.length < MIN_USERNAME_LENGTH) {
    return `Benutzername muss mindestens ${MIN_USERNAME_LENGTH} Zeichen lang sein`;
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    return 'Benutzername darf nur Buchstaben, Zahlen, _ und - enthalten';
  }
  return null;
}

export function validateUrl(value: string): string | null {
  const url = value.trim();
  if (!url) {
    return null;
  }
  return URL_PATTERN.test(url) ? null : 'Bitte gib eine gültige URL ein (z.B. https://example.com)';
}

/** Returns a score between 0 and 6. */
export function passwordStrength(password: string): number {
  const checks = [
    password.length >= 8,
    password.length >= 12,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    SPECIAL_CHARS.test(password),
  ];
  return checks.filter(Boolean).length;
}

export function passwordStrengthLabel(strength: number): string {
  if (strength <= 1) return 'Sehr schwach';
  if (strength === 2) return 'Schwach';
  if (strength === 3) return 'Mittel';
  if (strength === 4) return 'Gut';
  return 'Sehr gut';
}

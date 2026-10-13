import {
  passwordStrength,
  passwordStrengthLabel,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateUrl,
  validateUsername,
} from './validators';

describe('validators', () => {
  describe('validateEmail', () => {
    it('rejects empty and malformed addresses', () => {
      expect(validateEmail('  ')).toBe('Bitte gib eine E-Mail-Adresse ein');
      expect(validateEmail('niklas@')).toBe('Bitte gib eine gültige E-Mail-Adresse ein');
    });

    it('accepts a valid address with surrounding whitespace', () => {
      expect(validateEmail(' niklas@example.com ')).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('requires at least eight characters', () => {
      expect(validatePassword('')).toBe('Bitte gib ein Passwort ein');
      expect(validatePassword('1234567')).toBe('Passwort muss mindestens 8 Zeichen lang sein');
      expect(validatePassword('12345678')).toBeNull();
    });
  });

  describe('validatePasswordMatch', () => {
    it('requires a matching confirmation', () => {
      expect(validatePasswordMatch('secret123', '')).toBe('Bitte bestätige dein Passwort');
      expect(validatePasswordMatch('secret123', 'other')).toBe('Passwörter stimmen nicht überein');
      expect(validatePasswordMatch('secret123', 'secret123')).toBeNull();
    });
  });

  describe('validateUsername', () => {
    it('enforces length and allowed characters', () => {
      expect(validateUsername('ab')).toBe('Benutzername muss mindestens 3 Zeichen lang sein');
      expect(validateUsername('a b c')).toBe(
        'Benutzername darf nur Buchstaben, Zahlen, _ und - enthalten',
      );
      expect(validateUsername('niklas_z')).toBeNull();
    });
  });

  describe('validateUrl', () => {
    it('treats an empty value as valid because the link is optional', () => {
      expect(validateUrl('')).toBeNull();
    });

    it('only accepts http and https links', () => {
      expect(validateUrl('javascript:alert(1)')).not.toBeNull();
      expect(validateUrl('https://example.com/produkt?id=1')).toBeNull();
    });
  });

  describe('password strength', () => {
    it('scores longer, mixed passwords higher', () => {
      expect(passwordStrength('abc')).toBe(1);
      expect(passwordStrength('Abcdefg1!xyz')).toBe(6);
    });

    it('maps scores to labels', () => {
      expect(passwordStrengthLabel(0)).toBe('Sehr schwach');
      expect(passwordStrengthLabel(3)).toBe('Mittel');
      expect(passwordStrengthLabel(6)).toBe('Sehr gut');
    });
  });
});

import { Injectable, signal } from '@angular/core';
import {
  Hct,
  MaterialDynamicColors,
  SchemeTonalSpot,
  argbFromHex,
  hexFromArgb,
} from '@material/material-color-utilities';

const DEFAULT_SEED = '#05171f';
const STORAGE_KEY = 'seedColor';

const TOKENS = {
  primary: MaterialDynamicColors.primary,
  onPrimary: MaterialDynamicColors.onPrimary,
  primaryContainer: MaterialDynamicColors.primaryContainer,
  onPrimaryContainer: MaterialDynamicColors.onPrimaryContainer,
  tertiary: MaterialDynamicColors.tertiary,
  surface: MaterialDynamicColors.surface,
  onSurface: MaterialDynamicColors.onSurface,
  onSurfaceVariant: MaterialDynamicColors.onSurfaceVariant,
  surfaceContainerLow: MaterialDynamicColors.surfaceContainerLow,
  surfaceContainer: MaterialDynamicColors.surfaceContainer,
  surfaceContainerHighest: MaterialDynamicColors.surfaceContainerHighest,
  outline: MaterialDynamicColors.outline,
  error: MaterialDynamicColors.error,
  onError: MaterialDynamicColors.onError,
  errorContainer: MaterialDynamicColors.errorContainer,
  onErrorContainer: MaterialDynamicColors.onErrorContainer,
} as const;

type Variant = 'light' | 'dark';

/**
 * Material 3 colour scheme derived from a seed colour, mirroring Flutter's
 * ColorScheme.fromSeed. The tokens are published as CSS custom properties:
 * `--md-*` follows the system theme, `--md-light-*` / `--md-dark-*` are fixed
 * so that surfaces with a hard-coded brightness can pick the matching set.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly seedColor = signal(this.readStoredSeed());

  private readonly systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    this.systemDark.addEventListener('change', () => this.apply(this.seedColor()));
    this.apply(this.seedColor());
  }

  previewColor(hex: string): void {
    this.seedColor.set(hex);
    this.apply(hex);
  }

  saveColor(hex: string): void {
    this.previewColor(hex);
    try {
      localStorage.setItem(STORAGE_KEY, hex);
    } catch {
      // Persisting is best effort; the colour still applies for this session.
    }
  }

  restoreSavedColor(): void {
    this.previewColor(this.readStoredSeed());
  }

  private readStoredSeed(): string {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored && /^#[0-9a-fA-F]{6}$/.test(stored) ? stored : DEFAULT_SEED;
    } catch {
      return DEFAULT_SEED;
    }
  }

  private apply(seedHex: string): void {
    const root = document.documentElement.style;
    const light = this.buildScheme(seedHex, 'light');
    const dark = this.buildScheme(seedHex, 'dark');
    const system = this.systemDark.matches ? dark : light;

    for (const name of Object.keys(TOKENS)) {
      const cssName = name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
      root.setProperty(`--md-${cssName}`, system[name]);
      root.setProperty(`--md-light-${cssName}`, light[name]);
      root.setProperty(`--md-dark-${cssName}`, dark[name]);
    }
    root.setProperty('--seed-color', seedHex);
  }

  private buildScheme(seedHex: string, variant: Variant): Record<string, string> {
    const scheme = new SchemeTonalSpot(Hct.fromInt(argbFromHex(seedHex)), variant === 'dark', 0);
    const result: Record<string, string> = {};
    for (const [name, color] of Object.entries(TOKENS)) {
      result[name] = hexFromArgb(color.getArgb(scheme));
    }
    return result;
  }
}

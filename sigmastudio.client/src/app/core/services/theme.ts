import { effect, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeType = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'app-theme';
  private _currentTheme = signal<ThemeType>('light');

  public readonly currentTheme = this._currentTheme.asReadonly();

  constructor() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as ThemeType;
    const initialTheme = savedTheme || 'light';
    this.setTheme(initialTheme);

    effect(() => {
      const theme = this._currentTheme();

      document.body.classList.remove('light-theme', 'dark-theme');

      document.body.classList.add(`${theme}-theme`);

      localStorage.setItem(this.STORAGE_KEY, theme);

      console.log(`Theme changed to: ${theme}`);
    });
  }

  setTheme(theme: ThemeType): void {
    if (this.isValidTheme(theme)) {
      this._currentTheme.set(theme);
    } else {
      console.warn(`Invalid theme: ${theme}`);
    }
  }

  toggleTheme(): void {
    const current = this._currentTheme();
    const themes: ThemeType[] = ['light', 'dark'];
    const currentIndex = themes.indexOf(current);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  private isValidTheme(theme: string): theme is ThemeType {
    return ['light', 'dark', 'pink', 'green'].includes(theme);
  }
}

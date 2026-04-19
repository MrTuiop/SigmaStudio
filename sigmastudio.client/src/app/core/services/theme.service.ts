import { effect, Injectable, signal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type ThemeType = 'light' | 'dark' | 'gray';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  public readonly availableThemes: ThemeType[] = ['light', 'dark', 'gray'];

  private readonly STORAGE_KEY = 'app-theme';
  private document = inject(DOCUMENT);

  private _currentTheme = signal<ThemeType>('light');
  public readonly currentTheme = this._currentTheme.asReadonly();

  constructor() {
    // Безопасное чтение при загрузке (работает и в SSR, и в браузере)
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY) as ThemeType | null;
      const initial = this.isValidTheme(saved) ? saved! : 'light';
      this._currentTheme.set(initial);
    }

    effect(() => {
      const theme = this._currentTheme();
      const body = this.document.body;

      // Удаляем все классы тем и добавляем текущую
      this.availableThemes.forEach(t => body.classList.remove(`${t}-theme`));
      body.classList.add(`${theme}-theme`);

      // Сохраняем только в браузере
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, theme);
      }
    });
  }

  setTheme(theme: ThemeType): void {
    if (this.isValidTheme(theme)) {
      this._currentTheme.set(theme);
    }
  }

  private isValidTheme(theme: unknown): theme is ThemeType {
    return typeof theme === 'string' && ['light', 'dark', 'gray'].includes(theme);
  }
}

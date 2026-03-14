import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'app-theme';
  private _themeSubject = new BehaviorSubject<Theme>('light');
  public theme$ = this._themeSubject.asObservable();

  constructor() {
    // Загружаем тему из localStorage при старте
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme;
    const initialTheme = savedTheme || 'light';
    this.setTheme(initialTheme);
  }

  getTheme(): Theme {
    return this._themeSubject.getValue();
  }

  setTheme(theme: Theme): void {
    this._themeSubject.next(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);

    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  toggleTheme(): void {
    const current = this.getTheme();
    const newTheme = current === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

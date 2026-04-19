import { Component, inject } from '@angular/core';
import { ThemeService, ThemeType } from '../../../core/services/theme.service'

@Component({
  selector: 'app-theme-selector',
  standalone: false,
  templateUrl: './theme-selector.html',
  styleUrl: './theme-selector.css',
})
export class ThemeSelector {
  themeService = inject(ThemeService);
  themes = this.themeService.availableThemes;

  circleColors: Record<ThemeType, string> = {
    light: '#F8FAFC', // Цвет светлой темы
    dark: '#0F172A',  // Цвет темной темы
    gray: '#94A3B8'   // Цвет серой темы
  };
}

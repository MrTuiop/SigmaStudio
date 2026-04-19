import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const LANGUAGES = ['ru', 'en', 'de'] as const;
export type LanguageCode = typeof LANGUAGES[number];

@Component({
  selector: 'app-language-switcher',
  standalone: false,
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher implements OnInit {
  translate = inject(TranslateService);

  languages = LANGUAGES;

  languageLabels: Record<LanguageCode, string> = {
    ru: 'RU',
    en: 'EN',
    de: 'DE'
  };

  ngOnInit() {
    // Загружаем сохранённый язык при инициализации
    const savedLang = this.getSavedLanguage();
    if (savedLang && this.languages.includes(savedLang as LanguageCode)) {
      this.translate.use(savedLang);
    } else {
      // Пробуем определить язык браузера
      const browserLang = this.translate.getBrowserLang();
      if (browserLang && this.languages.includes(browserLang as LanguageCode)) {
        this.translate.use(browserLang);
      } else {
        // 3. Фоллбэк на язык по умолчанию
        this.translate.use('ru');
      }
    }
  }

  switchLanguage(lang: LanguageCode) {
    this.translate.use(lang);
    this.saveLanguage(lang);
  }

  private saveLanguage(lang: LanguageCode) {
    localStorage.setItem('app-language', lang);
  }

  private getSavedLanguage(): string | null {
    return localStorage.getItem('app-language');
  }

  isActive(lang: LanguageCode): boolean {
    return this.translate.currentLang === lang;
  }
}

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module'; // ← Проверь точку!
import { App } from './app';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { UserMenu } from './features/account/user-menu/user-menu';
import { LoginComponent } from './features/auth/components/login/login';
import { RegisterComponent } from './features/auth/components/register/register';

// Интерцептор
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
// Гард импортируем для использования в маршрутах, но НЕ в providers
import { authGuard } from './core/guards/auth.guard';

import { ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './pages/home/home'; // ← Добавь этот импорт

@NgModule({
  declarations: [App, Header, Footer, UserMenu, LoginComponent, RegisterComponent, HomePage],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, ReactiveFormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    // authGuard,  ← ❌ УДАЛИ ЭТУ СТРОКУ! Функциональные гарды не регистрируются здесь
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module'; // ← Проверь точку!
import { App } from './app';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { UserMenu } from './shared/components/user-menu/user-menu';
import { LoginComponent } from './features/auth/components/login/login';
import { RegisterComponent } from './features/auth/components/register/register';

// Интерцептор
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

import { ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './features/home/home';
import { ProjectsPage } from './features/projects/projects';
import { AboutPage } from './features/about/about';
import { ChatPage } from './features/chat/chat';
import { AdminPage } from './features/admin/admin';
import { CloudPage } from './features/cloud/cloud';
import {
  LucideAngularModule,
  User,
  LogIn,
  UserPlus,
  Settings,
  Moon,
  Sun,
  Globe,
  LogOut,
  Home,
  Folder,
  Info,
  MessageCircle,
  Send,
  Github,
  Mail,
  Palette,
  ArrowLeft,
  Pencil,
  Save,
  X,
  ImagePlus
} from 'lucide-angular';
import { AdminDashboardPage } from './features/admin/dashboard/dashboard';
import { AdminUsersPage } from './features/admin/users/users';
import { ProfileDashboardPage } from './features/profile/dashboard/dashboard';
import { ProfileSecurityPage } from './features/profile/security/security';

@NgModule({
  declarations: [
    App,
    Header,
    Footer,
    UserMenu,
    LoginComponent,
    RegisterComponent,
    HomePage,
    ProjectsPage,
    AboutPage,
    ChatPage,
    AdminPage,
    CloudPage,
    AdminDashboardPage,
    AdminUsersPage,
    ProfileDashboardPage,
    ProfileSecurityPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({
      User,
      LogIn,
      UserPlus,
      Settings,
      Moon,
      Sun,
      Globe,
      LogOut,
      Home,
      Folder,
      Info,
      MessageCircle,
      Send,
      Github,
      Mail,
      Palette,
      ArrowLeft,
      Pencil,
      Save,
      X,
      ImagePlus,
    }),
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}

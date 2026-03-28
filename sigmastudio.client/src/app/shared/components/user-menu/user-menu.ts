import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service'
import { ThemeService } from '../../../core/services/theme'
import { ProfileService } from '../../../features/profile/services/profile.service';

@Component({
  selector: 'app-user-menu',
  standalone: false,
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
})
export class UserMenu implements OnInit {
  isLoggedIn = false;
  isDarkTheme = false;
  isMenuOpen = false;

  defaultAvatarUrl = "assets/default-avatar.png";

  constructor(public authService: AuthService, public themeService: ThemeService, public profileService: ProfileService) { }

 

  get userAvatarUrl(): string {
    const path = this.profileService.profile()?.avatarUrl;
    return path && this.authService.isLoggedIn() ? path : this.defaultAvatarUrl;
  }

  get displayUserName(): string {
    return this.profileService.profile()?.userName || 'Пользователь';
  }

  get displayUserEmail(): string {
    return this.profileService.profile()?.email || '';
  }

  ngOnInit(): void {
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.closeMenu();
    }
  }
}

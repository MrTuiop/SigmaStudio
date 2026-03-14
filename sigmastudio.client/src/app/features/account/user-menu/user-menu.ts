import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service'
import { authGuard } from '../../../core/guards/auth.guard';
import { ThemeService } from '../../../core/services/theme'

@Component({
  selector: 'app-user-menu',
  standalone: false,
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
})
export class UserMenu {
  isLoggedIn = false;
  isDarkTheme = false;
  isMenuOpen = false;

  constructor(public authService: AuthService, public themeService: ThemeService) { }

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
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.closeMenu();
    }
  }
}

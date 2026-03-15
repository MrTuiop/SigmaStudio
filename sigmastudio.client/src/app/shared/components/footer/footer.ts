import { Component } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { ThemeService } from '../../../core/services/theme';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  constructor(public authService: AuthService, public themeService: ThemeService) { }
  currentYear = new Date().getFullYear();
}

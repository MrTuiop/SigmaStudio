import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    const userRoles = authService.userRoles();
    const hasAccess = allowedRoles.some(role => userRoles.includes(role));

    if (hasAccess) {
      return true;
    } else {
      router.navigate(['/forbidden']);
      return false;
    }
  };
};

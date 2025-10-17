// src/app/auth/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.hasValidToken()) {
      this.authService.clearToken();
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles: string[] = route.data['roles'] ?? [];
    if (allowedRoles.length === 0) return true;

    const userRole = this.authService.getUserRole();
    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    const has = allowedRoles.includes(userRole) || (allowedRoles.includes('ADMIN') && this.authService.isAdmin());
    if (!has) {
      this.router.navigate(['/home']); // ou /forbidden
    }
    return has;
  }
}

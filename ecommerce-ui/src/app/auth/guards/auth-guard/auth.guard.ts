import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const valid = this.authService.hasValidToken();
    if (valid) {
      return true;
    }
    this.authService.clearToken();
    return this.router.createUrlTree(['login']);
  }
}

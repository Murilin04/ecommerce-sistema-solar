// no-auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { AuthService } from '../../service/auth.service';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    // Se NÃO está autenticado -> pode acessar (true)
    if (!this.auth.isAuthenticatedValue()) {
      return true;
    }
    // Se está autenticado -> redireciona para home (ou perfil)
    return this.router.createUrlTree(['/home']);
  }
}

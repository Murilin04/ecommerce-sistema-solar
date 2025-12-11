import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { LoginComponent } from '../../../auth/login/login.component';
import { AuthService } from '../../../auth/service/auth.service';
import { MiniCartComponent } from '../../../features/products/mini-cart/mini-cart.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';


@Component({
  selector: 'app-menu',
  imports: [
    ClickOutsideDirective,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    CommonModule,
    RouterModule,
    LoginComponent,
    MiniCartComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit, OnDestroy {
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.authenticated-menu')) {
      this.menuOpen = false;
    }
  }
  showLogin = false;
  isAuthenticated$: Observable<boolean>;
  isAdmin = false;
  private sub?: Subscription;
  menuOpen = false;

  constructor(private router: Router, public auth: AuthService) {
    this.isAuthenticated$ = this.auth.isAuthenticated$;
  }

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin();

    this.sub = this.auth.roleChanged$.subscribe(() => {
      this.isAdmin = this.auth.isAdmin();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  navigateTo(subcategoria?: string, marca?: string, tipo?: string): void {
    const queryParams: any = {};

    if (subcategoria) queryParams.subcategoria = subcategoria;
    if (marca) queryParams.marca = marca;
    if (tipo) queryParams.tipo = tipo;

    this.router.navigate(['/produtos'], { queryParams });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  openLogin() {
    this.showLogin = !this.showLogin;
  }

  closeLogin() {
    this.showLogin = false;
  }

  logout() {
    this.auth.logout();
  }
}

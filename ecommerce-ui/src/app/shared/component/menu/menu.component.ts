import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { LoginComponent } from "../../../auth/login/login.component";
import { AuthService } from '../../../auth/service/auth.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-menu',
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    CommonModule,
    RouterModule,
    LoginComponent
],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{
  showLogin = false;
  isAuthenticated$: Observable<boolean>;

  constructor(private router: Router, public auth: AuthService) {
    this.isAuthenticated$ = this.auth.isAuthenticated$;
  }

  ngOnInit(): void {}

  navigateTo(path: string): void {
    this.router.navigate([path]);
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

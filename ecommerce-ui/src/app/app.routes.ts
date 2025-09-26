import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/guards/auth-guard/auth.guard';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './features/integrador/profile/profile.component';
import { NoAuthGuard } from './auth/guards/no-auth-guard/no-auth.guard';

export const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'cadastro', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
  // { path: '', redirectTo: '/login', pathMatch: 'full' }

];

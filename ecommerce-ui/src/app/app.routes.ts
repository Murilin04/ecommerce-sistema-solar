import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/guards/auth-guard/auth.guard';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './shared/component/home/home.component';
import { ProfileComponent } from './features/integrador/profile/profile.component';
import { NoAuthGuard } from './auth/guards/no-auth-guard/no-auth.guard';
import { EditProfileComponent } from './features/integrador/edit-profile/edit-profile.component';
import { ResetPasswordFormComponent } from './shared/component/reset-password-form/reset-password-form.component';
import { SendEmailFormComponent } from './shared/component/send-email-form/send-email-form.component';
import { RoleGuard } from './auth/guards/role-guard/role.guard';
import { AdminDashboardComponent } from './auth/admin/admin-dashboard/admin-dashboard.component';
import { AdminAddNewUsersComponent } from './auth/admin/admin-add-new-users/admin-add-new-users.component';
import { AdminEditUsersComponent } from './auth/admin/admin-edit-users/admin-edit-users.component';
import { ProductsComponent } from './features/products/products/products.component';

export const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'cadastro', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'produtos', component: ProductsComponent },
  { path: 'perfil', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'perfil-editar', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'alterar-senha', component: SendEmailFormComponent, canActivate: [NoAuthGuard] },
  {
    path: 'reset/:email/:token',
    component: ResetPasswordFormComponent,
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/editar/:id',
    component: AdminEditUsersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/novo',
    component: AdminAddNewUsersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }

];

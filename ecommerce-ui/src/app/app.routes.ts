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
import { CartComponent } from './features/products/cart/cart.component';
import { AdminProductsComponent } from './auth/admin/admin-products/admin-products.component';
import { CheckoutComponent } from './features/products/chekout/chekout.component';
import { OrderConfirmationComponent } from './features/products/order-comfirmation/order-comfirmation.component';
import { MyOrdersComponent } from './features/products/my-orders/my-orders.component';
import { AdminOrdersComponent } from './auth/admin/admin-orders/admin-orders.component';

export const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'cadastro', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'produtos', component: ProductsComponent },
  { path: 'carrinho', component: CartComponent, canActivate: [AuthGuard]},
  { path: 'perfil', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'perfil-editar', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'alterar-senha', component: SendEmailFormComponent, canActivate: [NoAuthGuard] },
  {
    path: 'reset/:email/:token',
    component: ResetPasswordFormComponent,
  },
  {
    path: 'meus-pedidos',
    component: MyOrdersComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'pedido/:id',
  //   component: OrderDetailComponent, // Criar depois se necessário
  //   canActivate: [AuthGuard]
  // },

  // Admin
  {
    path: 'admin/pedidos',
    component: AdminOrdersComponent,
    canActivate: [AuthGuard, RoleGuard]
  },
  // {
  //   path: 'admin/pedido/:id',
  //   component: AdminOrderDetailComponent, // Criar depois se necessário
  //   canActivate: [AuthGuard, RoleGuard]
  // }
    {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout/confirmacao',
    component: OrderConfirmationComponent,
    canActivate: [AuthGuard]
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
  {
    path: 'admin/produtos',
    component: AdminProductsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }

];

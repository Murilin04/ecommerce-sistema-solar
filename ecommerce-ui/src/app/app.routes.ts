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

  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./shared/component/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'alterar-senha',
    loadComponent: () => import('./shared/component/send-email-form/send-email-form.component').then(m => m.SendEmailFormComponent),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'reset/:email/:token',
    loadComponent: () => import('./shared/component/reset-password-form/reset-password-form.component').then(m => m.ResetPasswordFormComponent)
  },

  // Rotas de Produtos (LAZY LOAD)
  {
    path: 'produtos',
    loadComponent: () => import('./features/products/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./features/products/cart/cart.component').then(m => m.CartComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/products/chekout/chekout.component').then(m => m.CheckoutComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout/confirmacao',
    loadComponent: () => import('./features/products/order-comfirmation/order-comfirmation.component').then(m => m.OrderConfirmationComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'meus-pedidos',
    loadComponent: () => import('./features/products/my-orders/my-orders.component').then(m => m.MyOrdersComponent),
    canActivate: [AuthGuard]
  },

  // Rotas de Perfil (LAZY LOAD)
  {
    path: 'perfil',
    loadComponent: () => import('./features/integrador/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil-editar',
    loadComponent: () => import('./features/integrador/edit-profile/edit-profile.component').then(m => m.EditProfileComponent),
    canActivate: [AuthGuard]
  },

  // Rotas Admin (LAZY LOAD - crítico para performance)
  {
    path: 'admin',
    loadComponent: () => import('./auth/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/produtos',
    loadComponent: () => import('./auth/admin/admin-products/admin-products.component').then(m => m.AdminProductsComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/pedidos',
    loadComponent: () => import('./auth/admin/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/editar/:id',
    loadComponent: () => import('./auth/admin/admin-edit-users/admin-edit-users.component').then(m => m.AdminEditUsersComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'admin/novo',
    loadComponent: () => import('./auth/admin/admin-add-new-users/admin-add-new-users.component').then(m => m.AdminAddNewUsersComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },

  // Rota padrão
  { path: '', redirectTo: 'home', pathMatch: 'full' }
  // {
  //   path: 'pedido/:id',
  //   component: OrderDetailComponent,
  //   canActivate: [AuthGuard]
  // },

  // Admin

  // {
  //   path: 'admin/pedido/:id',
  //   component: AdminOrderDetailComponent, // Criar depois se necessário
  //   canActivate: [AuthGuard, RoleGuard]
  // }

];

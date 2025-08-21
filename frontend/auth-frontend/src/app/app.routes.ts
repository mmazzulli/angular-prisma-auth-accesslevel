import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Áreas públicas
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./auth/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
  },

  // =========================
  // 🔒 Dashboards protegidas
  // =========================
  {
    path: 'superadmin',
    canActivate: [AuthGuard],
    data: { roles: ['superadmin'] },
    loadComponent: () =>
      import('./dashboards/superadmin/superadmin.component').then(m => m.SuperadminComponent),
  },
  {
    path: 'empresa',
    canActivate: [AuthGuard],
    data: { roles: ['superadmin', 'empresa'] },
    loadComponent: () =>
      import('./dashboards/empresa/empresa.component').then(m => m.EmpresaComponent),
  },
  {
    path: 'funcionarios',
    canActivate: [AuthGuard],
    data: { roles: ['superadmin', 'empresa', 'funcionario'] },
    loadComponent: () =>
      import('./dashboards/funcionarios/funcionarios.component').then(m => m.FuncionariosComponent),
  },
  {
    path: 'clientes',
    canActivate: [AuthGuard],
    data: { roles: ['superadmin', 'empresa', 'funcionario', 'cliente'] },
    loadComponent: () =>
      import('./dashboards/clientes/clientes.component').then(m => m.ClientesComponent),
  },

  { path: '**', redirectTo: 'home' },
];

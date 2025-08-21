import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from './roles';

export const AuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1. Verifica se está logado
  if (!auth.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { redirectTo: state.url } });
    return false;
  }

  // 2. Verifica roles necessárias
  const requiredRoles = route.data?.['roles'] as Role[] | undefined;
  if (requiredRoles && !auth.hasAnyRole(requiredRoles)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  // 3. Libera acesso
  return true;
};

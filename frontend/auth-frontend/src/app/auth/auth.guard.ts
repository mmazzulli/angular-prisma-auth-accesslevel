import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from './roles';

export const AuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1) Bloqueia se não estiver logado
  if (!auth.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { redirectTo: state.url } });
    return false;
  }

  // 2) Se a rota exigir papéis específicos
  const requiredRoles = route.data?.['roles'] as Role[] | undefined;
  if (requiredRoles && !auth.hasAnyRole(requiredRoles)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
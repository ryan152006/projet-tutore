import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const requiredRoles = route.data['roles'] as string[];
  if (user && requiredRoles && requiredRoles.includes(user.role?.titre)) {
    return true;
  }
  // Redirection ou refus d'accès
  window.alert('Accès refusé.');
  return false;
};

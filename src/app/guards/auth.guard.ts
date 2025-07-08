import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (token) {
    return true;
  }
  // Redirige vers la page de connexion si non authentifié
  window.location.href = '/auth/login';
  return false;
}; 
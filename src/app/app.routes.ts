import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'clients',
        loadChildren: () => import('./pages/clients/clients.routes').then(m => m.CLIENTS_ROUTES)
      },
      {
        path: 'products',
        loadChildren: () => import('./pages/products/products.routes').then(m => m.PRODUCTS_ROUTES)
      },
      {
        path: 'sales',
        loadChildren: () => import('./pages/sales/sales.routes').then(m => m.SALES_ROUTES)
      },
      {
        path: 'suppliers',
        loadChildren: () => import('./pages/suppliers/suppliers.routes').then(m => m.SUPPLIERS_ROUTES)
      },
      {
        path: 'employees',
        loadChildren: () => import('./pages/employees/employees.routes').then(m => m.EMPLOYEES_ROUTES)
      },
      {
        path: 'finance',
        loadChildren: () => import('./pages/finance/finance.routes').then(m => m.FINANCE_ROUTES)
      },
      {
        path: 'reports',
        loadChildren: () => import('./pages/reports/reports.routes').then(m => m.REPORTS_ROUTES)
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.routes').then(m => m.SETTINGS_ROUTES)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

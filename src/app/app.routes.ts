import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth';
import { NotFound } from './feature/errors/pages/not-found/not-found';
import { SiteLayout } from './core/layout/site-layout/site-layout';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./feature/auth/pages/login/login').then((c) => c.Login),
      },
      {
        path: 'login-callback',
        loadComponent: () =>
          import('./feature/auth/pages/login-callback/login-callback').then((c) => c.LoginCallback),
      },
    ],
  },
  {
    path: 'dashboard',
    component: SiteLayout,
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./feature/report/pages/report-list/report-list').then((c) => c.ReportList),
      },
      {
        path: 'employee',
        loadComponent: () =>
          import('./feature/employee/pages/employee-list/employee-list').then(
            (c) => c.EmployeeList,
          ),
      },
      {
        path: 'product',
        loadComponent: () =>
          import('./feature/product/pages/product-list/product-list').then((c) => c.ProductList),
      },
      {
        path: 'branch',
        loadComponent: () =>
          import('./feature/branch/pages/branch-list/branch-list').then((c) => c.BranchList),
      },
    ],
  },
  {
    path: 'access',
    loadComponent: () => import('./feature/errors/pages/access/access').then((c) => c.Access),
  },
  {
    path: 'error',
    loadComponent: () => import('./feature/errors/pages/error/error').then((c) => c.Error),
  },
  {
    path: '**',
    component: NotFound,
  },
];

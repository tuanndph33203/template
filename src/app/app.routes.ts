import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./feature/auth/login/login').then((c) => c.Login),
      },
      {
        path: 'login-callback',
        loadComponent: () =>
          import('./feature/auth/login-callback/login-callback').then((c) => c.LoginCallback),
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./feature/site/site').then((c) => c.Site),
    children: [
      {
        path: '',
        loadComponent: () => import('./feature/site/report/report').then((c) => c.Report),
      },
    ],
  },
  {
    path: 'access',
    loadComponent: () => import('./feature/auth/access/access').then((c) => c.Access),
  },
  {
    path: 'error',
    loadComponent: () => import('./feature/auth/error/error').then((c) => c.Error),
  },
];

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
         path: 'register',
        loadComponent: () => import('./feature/auth/register/register').then((c) => c.Register),
      }
    ]
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
];

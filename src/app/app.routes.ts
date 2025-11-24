import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/auth/login/login').then((c) => c.Login),
  },
  {
    path: '',
    loadComponent: () => import('./feature/site/site').then((c) => c.Site),
    children: [
      {
        path: '',
        loadComponent: () => import('./feature/site/report/report').then((c) => c.Report),
      },
    ],
  },
];

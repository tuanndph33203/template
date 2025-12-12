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
        data: { title: 'Đăng nhập' },
        loadComponent: () => import('./feature/auth/pages/login/login').then((c) => c.Login),
      },
      {
        path: 'login-callback',
        data: { title: 'Callback' },
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
      // {
      //   path: '',
      //   data: { title: 'Bán hàng' },
      //   loadComponent: () =>
      //     import('./feature/sales/pages/sales-list/sales-list').then((c) => c.SalesList),
      // },
      {
        path: '',
        data: { title: 'Hóa đơn' },
        loadComponent: () =>
          import('./feature/report/pages/report-list/report-list').then((c) => c.ReportList),
      },
      {
        path: 'employee',
        data: { title: 'Nhân viên' },
        loadComponent: () =>
          import('./feature/employee/pages/employee-list/employee-list').then(
            (c) => c.EmployeeList,
          ),
      },
      {
        path: 'product',
        data: { title: 'Sản phẩm' },
        loadComponent: () =>
          import('./feature/product/pages/product-list/product-list').then((c) => c.ProductList),
      },
      {
        path: 'branch',
        data: { title: 'Chi nhánh' },
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

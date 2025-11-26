import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../auth/auth.store';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const token = authStore.getToken();
  const xKey = 'app_35316a.6A90C7DAE32759964A51DF56421427C689B808EFB418703BFAE8BFFBF4CE8F26';

  const headers: Record<string, string> = {
    'x-key': xKey,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const modifiedReq = req.clone({ setHeaders: headers });

  return next(modifiedReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        authStore.clear();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};

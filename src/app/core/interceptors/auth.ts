import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.getToken();

  const modifiedReq = req.clone({
    setHeaders: {
      'x-key': 'app_35316a.6A90C7DAE32759964A51DF56421427C689B808EFB418703BFAE8BFFBF4CE8F26',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigateByUrl('/access');
      }
      return throwError(() => error);
    }),
  );
};

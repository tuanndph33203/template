import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '../http/base-http.service';
import { AuthStore, AuthUser } from './auth.store';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(BaseHttpService);
  private authStore = inject(AuthStore);

  login(payload: { email: string; password: string }) {
    this.authStore.setLoading(true);
    return this.http.post<{ user: AuthUser; accessToken: string }>('/auth/login', payload).pipe(
      tap({
        next: (res) => {
          this.authStore.setAuth(res.user, res.accessToken);
          this.authStore.setLoading(false);
          // TODO: lưu token vào localStorage nếu cần
        },
        error: () => {
          this.authStore.setLoading(false);
        },
      }),
    );
  }

  logout() {
    this.authStore.clear();
    // TODO: xoá token localStorage, điều hướng về /login
  }
}

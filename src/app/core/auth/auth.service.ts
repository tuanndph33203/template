import { inject, Injectable } from '@angular/core';
import { AuthStore } from './auth.store';
import { tap, finalize, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStore = inject(AuthStore);
  private httpClient = inject(HttpClient);

  loginBySectionId(sessionId: string): Observable<any> {
    this.authStore.setLoading(true);
    return this.httpClient
      .get(`https://authentsv.trananh.org/api/authentication/issue-token?sectionId=${sessionId}`)
      .pipe(
        tap((res: any) => {
          this.authStore.setAuth(res.data);
        }),
        finalize(() => this.authStore.setLoading(false)),
      );
  }

  redirectMicrosoft() {
    window.location.href =
      'https://authentsv.trananh.org/api/authentication/login-microsoft?clientKey=B3394396-4970-4459-812C-3AFFFA51C7E0';
  }

  getToken() {
    return this.authStore.getToken();
  }
}

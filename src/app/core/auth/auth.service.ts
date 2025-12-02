import { inject, Injectable } from '@angular/core';
import { AuthStore } from './auth.store';
import { tap, finalize, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment.prod';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStore = inject(AuthStore);
  private httpClient = inject(HttpClient);
  private authUrl = environment.authencationUrl;

  loginBySectionId(sessionId: string): Observable<any> {
    return this.httpClient
      .get(`${this.authUrl}/authentication/issue-token?sectionId=${sessionId}`)
      .pipe(
        tap((res: any) => {
          this.authStore.setAuth(res);
        }),
      );
  }

  redirectMicrosoft() {
    window.location.href = `${this.authUrl}/authentication/login-microsoft?clientKey=B3394396-4970-4459-812C-3AFFFA51C7E0`;
  }
}

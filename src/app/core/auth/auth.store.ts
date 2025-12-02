import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthResponse, IUser } from '../model/auth';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private userSubject = new BehaviorSubject<IUser | null>(this.restoreUser());
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('authToken'));

  user$ = this.userSubject.asObservable();
  token$ = this.tokenSubject.asObservable();

  get user() {
    return this.userSubject.value;
  }
  get token() {
    return this.tokenSubject.value;
  }

  setAuth(res: AuthResponse | null) {
    if (!res) return this.clear();

    const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt, ...user } = res;
    this.userSubject.next(user);
    this.tokenSubject.next(accessToken);

    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  clear() {
    this.userSubject.next(null);
    this.tokenSubject.next(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getUser(): IUser | null {
    return this.userSubject.value;
  }

  private restoreUser(): IUser | null {
    try {
      return JSON.parse(localStorage.getItem('userInfo') ?? 'null');
    } catch {
      return null;
    }
  }
}

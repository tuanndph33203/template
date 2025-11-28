import { Injectable, computed, signal } from '@angular/core';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private _user = signal<AuthUser | null>(null);
  private _accessToken = signal<string | null>(localStorage.getItem('authToken'));
  private _loading = signal<boolean>(false);

  user = computed(() => this._user());
  isAuthenticated = computed(() => !!this._accessToken());
  loading = computed(() => this._loading());

  setAuth(token: string | null) {
    // this._user.set(user);
    this._accessToken.set(token);

    if (token) localStorage.setItem('authToken', token);
    else localStorage.removeItem('authToken');
  }

  setLoading(value: boolean) {
    this._loading.set(value);
  }

  clear() {
    this.setAuth(null);
  }

  getToken(): string | null {
    return this._accessToken();
  }
}

import { Injectable, computed, signal } from '@angular/core';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private _user = signal<AuthUser | null>(null);
  private _accessToken = signal<string | null>(null);
  private _loading = signal<boolean>(false);

  user = computed(() => this._user());
  isAuthenticated = computed(() => !!this._accessToken());
  roles = computed(() => this._user()?.roles ?? []);
  loading = computed(() => this._loading());

  setAuth(user: AuthUser, token: string) {
    this._user.set(user);
    this._accessToken.set(token);
  }

  setLoading(value: boolean) {
    this._loading.set(value);
  }

  clear() {
    this._user.set(null);
    this._accessToken.set(null);
  }

  getToken(): string | null {
    return this._accessToken();
  }
}

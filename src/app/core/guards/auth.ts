import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@app/feature/auth/services/auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const auth = {
    "accessToken": "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ0dWFubmRAdHJhbmFuaC5vcmciLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjAyZDRiNGRiLTEwZjctNGJlZS04NWVkLTM4YWQ1ZDdiZjA3NSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJOZ3V54buFbiDEkMOsbmggVHXDom4gIiwianRpIjoiMjY4NDg4NWEtMmQ0My00ZDgyLTg0ODktMDg2YWJiMTYyNDZlIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4gaOG7hyB0aOG7kW5nIiwiZXhwIjoxNzY0NzYzNzAxLCJpc3MiOiJodHRwczovL2F1dGhlbnRzdi50cmFuYW5oLm9yZyIsImF1ZCI6IlVzZXIifQ.7oV_LMNVQXoqQGGxE4xyyOvhcqnzayzE_2hv6pMy6puNh3s5YeAGO8BrGvxa4trd02qaM9S6Kmvcq022UFBW_w",
    "refreshToken": "lc8Qb5Ahy1HiHU6d60zjVYonvLJ1gJf5qW4eSt66t2I=",
    "accessTokenExpiresAt": "2025-12-03T12:08:21Z",
    "refreshTokenExpiresAt": "2025-12-10T09:08:21.3832416Z",
    "userId": "02d4b4db-10f7-4bee-85ed-38ad5d7bf075",
    "userName": "tuannd@trananh.org",
    "email": "tuannd@trananh.org",
    "role": "Admin hệ thống",
    "lastName": "",
    "firstName": "Nguyễn Đình Tuân",
    "isSuccess": true,
    "message": "Login successful"
  }
  authStore.setAuth(auth)


  if (authStore.getToken()) {
    return true;
  }

  router.navigate(['/access']);
  return false;
};

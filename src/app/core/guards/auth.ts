import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthStore } from '@app/feature/auth/services/auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  // const router = inject(Router);
  const auth = {
    accessToken:
      'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJkdW5nbnQxQHRyYW5hbmgub3JnIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIyMTVjNWY0Mi1lZGNlLTQyM2ItYmUxYS0yMTk1MWZiNjI2YjAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTmd1eeG7hW4gVGnhur9uIETFqW5nICAiLCJqdGkiOiI4ZWM1MDQ5Mi0wNWYzLTRmNjYtOWM5Ni01YzJiYmVmYzkxNTkiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiBo4buHIHRo4buRbmciLCJleHAiOjE3NjUyMTU4NzcsImlzcyI6Imh0dHBzOi8vYXV0aGVudHN2LnRyYW5hbmgub3JnIiwiYXVkIjoiVXNlciJ9.twUlDS642U9l1okqJHMCKh4EAUOaTS2ZGCwNBGu9P4mN9INIsh7dpzBnkB1BT76FhrnQywG51z0M7wTRZLPzOA',
    refreshToken: 'V92PIxsW7WpX097JVFRdhKGS22/dW1CXIcsAfxEeSiI=',
    accessTokenExpiresAt: '2025-12-08T17:44:37Z',
    refreshTokenExpiresAt: '2025-12-15T14:44:37.9264925Z',
    userId: '215c5f42-edce-423b-be1a-21951fb626b0',
    userName: 'dungnt1@trananh.org',
    email: 'dungnt1@trananh.org',
    role: 'Admin hệ thống',
    lastName: '',
    firstName: 'Nguyễn Tiến Dũng ',
    isSuccess: true,
    message: 'Login successful',
  };
  authStore.setAuth(auth);

  if (authStore.getToken()) {
    return true;
  }

  // router.navigate(['/access']);
  return true;
};

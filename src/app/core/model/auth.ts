export interface AuthResponse extends IUser {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}
export interface IUser {
  userId: string;
  userName: string;
  email: string;
  role: string;
  lastName: string;
  firstName: string;
  isSuccess: boolean;
  message: string;
}

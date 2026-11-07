// То, что мы зашиваем в токен при логине
export interface JwtPayload {
  sub: number; // ID пользователя
  email: string;
}

// То, что мы возвращаем из стратегии и достаем в контроллере
export interface AuthUser {
  userId: number;
  email: string;
}

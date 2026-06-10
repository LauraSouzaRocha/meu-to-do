export interface User {
  email: string;
  passwordHash: string;
}

// In‑memory user store – replace with real DB in production
export const users: User[] = [];

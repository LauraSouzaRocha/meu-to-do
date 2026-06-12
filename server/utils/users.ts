export interface User {
  email: string;
  passwordHash: string;
}

// In-memory user store
export const users: User[] = [];

export function findUser(email: string): User | undefined {
  return users.find((u) => u.email === email);
}

export function addUser(user: User): void {
  users.push(user);
}
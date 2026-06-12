export interface User {
  email: string;
  passwordHash: string;
}

const users: User[] = [];

export function findUser(email: string) {
  return users.find((u) => u.email === email);
}

export function addUser(user: User) {
  users.push(user);
}

export { users };
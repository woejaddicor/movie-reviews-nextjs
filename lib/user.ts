import db from "./db";
import type { User, SafeUser, UpdateProfileData } from "./types";

export function createUser(email: string, password: string): number | bigint {
  const result = db
    .prepare("INSERT INTO users (email, password) VALUES (?, ?)")
    .run(email, password);
  return result.lastInsertRowid;
}

export function getUserByEmail(email: string): User | undefined {
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as
    | User
    | undefined;
  return user;
}

export function getUserById(id: number | string): SafeUser | undefined {
  const userId = typeof id === "string" ? parseInt(id) : id;
  const user = db
    .prepare(
      "SELECT id, email, name, bio, avatar, created_at FROM users WHERE id = ?",
    )
    .get(userId) as SafeUser | undefined;
  return user;
}

export function updateUserProfile(
  id: number,
  { name, bio }: UpdateProfileData,
): boolean {
  const result = db
    .prepare("UPDATE users SET name = ?, bio = ? WHERE id = ?")
    .run(name, bio, id);
  return result.changes > 0;
}

export function updateUserEmail(id: number, email: string): boolean {
  const result = db
    .prepare("UPDATE users SET email = ? WHERE id = ?")
    .run(email, id);
  return result.changes > 0;
}

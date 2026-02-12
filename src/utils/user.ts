import type { User } from "../types";

export function getUserDisplayName(user: User) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;
  if (user.username) return user.username;
  return user.email;
}

export function getUserInitials(user: User) {
  const first = user.firstName?.[0] ?? user.username?.[0] ?? user.email?.[0];
  const last = user.lastName?.[0];
  return `${first ?? ""}${last ?? ""}`.toUpperCase() || "U";
}

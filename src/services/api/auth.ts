import type { Session, User } from "../../types";
import { withLatency } from "../../utils/latency";
import { readStorage, removeStorage, writeStorage } from "../storage/storage";
import { isStudentEmail } from "../../utils/email";

function getUsers() {
  return readStorage<User[]>("users", []);
}

function saveUsers(users: User[]) {
  writeStorage("users", users);
}

function createSession(userId: string): Session {
  return {
    token: `session_${Math.random().toString(36).slice(2)}`,
    userId,
    createdAt: new Date().toISOString(),
  };
}

export const authApi = {
  login: async (email: string, password: string) =>
    withLatency(() => {
      const users = getUsers();
      const user = users.find(
        (item) => item.email.toLowerCase() === email.toLowerCase()
      );
      if (!user || user.password !== password) {
        throw new Error("Invalid email or password");
      }
      const session = createSession(user.id);
      writeStorage("session", session);
      return { user, session };
    }),
  register: async (email: string, password: string) =>
    withLatency(() => {
      const users = getUsers();
      const exists = users.some(
        (item) => item.email.toLowerCase() === email.toLowerCase()
      );
      if (exists) {
        throw new Error("Email already registered");
      }
      const user: User = {
        id: `user_${Math.random().toString(36).slice(2)}`,
        email,
        password,
        role: "student_unverified",
        createdAt: new Date().toISOString(),
        verificationStatus: "unverified",
        savedDealIds: [],
      };
      if (isStudentEmail(email)) {
        user.verificationStatus = "unverified";
      }
      users.push(user);
      saveUsers(users);
      const session = createSession(user.id);
      writeStorage("session", session);
      return { user, session };
    }),
  logout: async () =>
    withLatency(() => {
      removeStorage("session");
      return true;
    }, 200),
  getMe: async () =>
    withLatency(() => {
      const session = readStorage<Session | null>("session", null);
      if (!session) return null;
      const users = getUsers();
      const user = users.find((item) => item.id === session.userId) ?? null;
      return user ? { user, session } : null;
    }, 200),
  updateUser: async (user: User) =>
    withLatency(() => {
      const users = getUsers();
      const index = users.findIndex((item) => item.id === user.id);
      if (index === -1) throw new Error("User not found");
      users[index] = user;
      saveUsers(users);
      return user;
    }, 200),
};

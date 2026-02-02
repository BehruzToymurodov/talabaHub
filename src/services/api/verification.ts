import type { User, VerificationRequest } from "../../types";
import { withLatency } from "../../utils/latency";
import { readStorage, writeStorage } from "../storage/storage";

function getUsers() {
  return readStorage<User[]>("users", []);
}

function saveUsers(users: User[]) {
  writeStorage("users", users);
}

export const verificationApi = {
  submit: async (userId: string, request: Omit<VerificationRequest, "status" | "submittedAt">) =>
    withLatency(() => {
      const users = getUsers();
      const index = users.findIndex((item) => item.id === userId);
      if (index === -1) throw new Error("User not found");
      const verification: VerificationRequest = {
        ...request,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };
      users[index] = {
        ...users[index],
        verificationStatus: "pending",
        verification,
      };
      saveUsers(users);
      return users[index];
    }, 500),
  listPending: async () =>
    withLatency(() => {
      return getUsers().filter((user) => user.verificationStatus === "pending");
    }, 300),
  approve: async (userId: string) =>
    withLatency(() => {
      const users = getUsers();
      const index = users.findIndex((item) => item.id === userId);
      if (index === -1) throw new Error("User not found");
      const current = users[index];
      users[index] = {
        ...current,
        role: "student_verified",
        verificationStatus: "verified",
        verification: current.verification
          ? {
              ...current.verification,
              status: "verified",
              reviewedAt: new Date().toISOString(),
            }
          : undefined,
      };
      saveUsers(users);
      return users[index];
    }, 400),
  reject: async (userId: string, reason: string) =>
    withLatency(() => {
      const users = getUsers();
      const index = users.findIndex((item) => item.id === userId);
      if (index === -1) throw new Error("User not found");
      const current = users[index];
      users[index] = {
        ...current,
        role: "student_unverified",
        verificationStatus: "rejected",
        verification: current.verification
          ? {
              ...current.verification,
              status: "rejected",
              reviewedAt: new Date().toISOString(),
              reviewReason: reason,
            }
          : undefined,
      };
      saveUsers(users);
      return users[index];
    }, 400),
};

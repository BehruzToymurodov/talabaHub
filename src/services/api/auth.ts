import type { Session, User, VerificationRequest } from "../../types";
import { apiRequest } from "./client";
import {
  clearStoredAuth,
  getStoredAuth,
  setAuthUser,
  setStoredAuth,
} from "./session";
import { readStorage, writeStorage } from "../storage/storage";
import { isStudentEmail } from "../../utils/email";

type RegisterPayload = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

type ApiUserResponse = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: "STUDENT" | "MODERATOR" | "ADMIN";
  studentStatusVerified?: boolean;
  createdDate?: string;
};

type AuthResponse = {
  token: string;
  user: ApiUserResponse;
};
type RegisterResponse = {
  message?: string;
};

type UserProfile = Pick<
  User,
  | "username"
  | "avatarUrl"
  | "savedDealIds"
  | "universityName"
  | "age"
  | "verificationStatus"
  | "verification"
>;

const profileKey = (userId: string) => `userProfile:${userId}`;

function readUserProfile(userId: string): UserProfile | null {
  return readStorage<UserProfile | null>(profileKey(userId), null);
}

function writeUserProfile(userId: string, profile: UserProfile) {
  writeStorage(profileKey(userId), profile);
}

function mapRole(role: ApiUserResponse["role"], verified?: boolean): User["role"] {
  if (role === "ADMIN" || role === "MODERATOR") return "admin";
  return verified ? "student_verified" : "student_unverified";
}

function mapVerificationStatus(
  role: ApiUserResponse["role"],
  verified?: boolean
): User["verificationStatus"] {
  if (role === "ADMIN" || role === "MODERATOR") return "verified";
  return verified ? "verified" : "unverified";
}

function mergeUser(apiUser: ApiUserResponse): User {
  const profile = readUserProfile(apiUser.id);
  const role = mapRole(apiUser.role, apiUser.studentStatusVerified);
  const baseVerificationStatus = mapVerificationStatus(
    apiUser.role,
    apiUser.studentStatusVerified
  );
  const verificationStatus = profile?.verificationStatus ?? baseVerificationStatus;
  const verification: VerificationRequest | undefined = profile?.verification;

  return {
    id: apiUser.id,
    email: apiUser.email,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    role,
    createdAt: apiUser.createdDate ?? new Date().toISOString(),
    verificationStatus,
    verification,
    username: profile?.username,
    avatarUrl: profile?.avatarUrl,
    universityName: profile?.universityName,
    age: profile?.age,
    savedDealIds: profile?.savedDealIds ?? [],
  };
}

function persistProfile(user: User) {
  writeUserProfile(user.id, {
    username: user.username,
    avatarUrl: user.avatarUrl,
    universityName: user.universityName,
    age: user.age,
    savedDealIds: user.savedDealIds,
    verificationStatus: user.verificationStatus,
    verification: user.verification,
  });
}

export const authApi = {
  login: async (emailOrUsername: string, password: string) => {
    const identifier = emailOrUsername.trim().toLowerCase();
    const response = await apiRequest<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: {
        email: identifier,
        password,
      },
    });

    const user = mergeUser(response.user);
    const session: Session = {
      token: response.token,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    persistProfile(user);
    setStoredAuth({ token: response.token, user, createdAt: session.createdAt });
    return { user, session };
  },
  register: async ({ email, password, first_name, last_name }: RegisterPayload) => {
    if (!isStudentEmail(email)) {
      throw new Error("Please use a student email address");
    }

    const response = await apiRequest<RegisterResponse>("/api/v1/auth/register", {
      method: "POST",
      body: {
        email,
        password,
        first_name,
        last_name,
      },
    });
    return { message: response?.message };
  },
  logout: async () => {
    clearStoredAuth();
    return true;
  },
  getMe: async () => {
    const stored = getStoredAuth();
    if (!stored) return null;
    return { user: stored.user, session: { token: stored.token, userId: stored.user.id, createdAt: stored.createdAt } };
  },
  updateUser: async (user: User) => {
    persistProfile(user);
    setAuthUser(user);
    return user;
  },
};

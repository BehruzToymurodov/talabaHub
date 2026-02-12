export type UserRole = "student_unverified" | "student_verified" | "admin";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export type User = {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  age?: number;
  universityName?: string;
  avatarUrl?: string;
  otp?: {
    code: string;
    sentAt: string;
  };
  role: UserRole;
  createdAt: string;
  verificationStatus: VerificationStatus;
  verification?: VerificationRequest;
  savedDealIds: string[];
};

export type VerificationRequest = {
  studentEmail: string;
  universityName: string;
  studentId: string;
  proofFilename?: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewReason?: string;
};

export type DealCategory =
  | "Food & Drink"
  | "Telecom"
  | "Ride/Delivery"
  | "Fashion"
  | "Books & Education"
  | "Fitness"
  | "Electronics"
  | "Travel";

export type Deal = {
  id: string;
  brand: string;
  category: DealCategory;
  title: string;
  titleI18n?: {
    uz: string;
    ru: string;
    en: string;
  };
  description: string;
  terms: string;
  code: string;
  expiresAt: string;
  verifiedOnly: boolean;
  featured: boolean;
  createdAt: string;
  redemptionUrl?: string;
  image?: string;
  bannerImage?: string;
  eligibleItems?: string;
  branches?: string;
};

export type Session = {
  token: string;
  userId: string;
  createdAt: string;
};

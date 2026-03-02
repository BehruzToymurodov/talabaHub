import type { VerificationApplication, VerificationRequest, VerificationStatus } from "../../types";
import { apiRequest } from "./client";

const statusMap: Record<string, VerificationStatus> = {
  PENDING: "pending",
  ACCEPTED: "verified",
  REJECTED: "rejected",
};

type ApplicationResponse = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdDate?: string;
  message?: string;
  rejectionReason?: string;
};

type ApplicationListItemResponse = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  rejectionReason?: string;
  createdDate?: string;
};

type ApplicationDetailResponse = {
  id: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  universityEmail: string;
  emailSupportedDomain?: boolean;
  studyStartDate: string;
  studyEndDate: string;
  attachments: string[];
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  rejectionReason?: string;
  createdDate?: string;
};

type PageableResponse<T> = {
  content: T[];
};

type SubmitPayload = {
  first_name: string;
  last_name: string;
  middle_name?: string;
  university_email: string;
  study_start_date: string;
  study_end_date: string;
  attachments?: string[];
};

function mapStatus(status: ApplicationResponse["status"]): VerificationStatus {
  return statusMap[status] ?? "pending";
}

function mapDetail(detail: ApplicationDetailResponse): VerificationApplication {
  return {
    id: detail.id,
    user: detail.user,
    universityEmail: detail.universityEmail,
    studyStartDate: detail.studyStartDate,
    studyEndDate: detail.studyEndDate,
    attachments: detail.attachments ?? [],
    status: mapStatus(detail.status),
    rejectionReason: detail.rejectionReason,
    createdAt: detail.createdDate ?? new Date().toISOString(),
  };
}

export const verificationApi = {
  submit: async (payload: SubmitPayload): Promise<VerificationRequest> => {
    const response = await apiRequest<ApplicationResponse>(
      "/api/v1/student/applications",
      {
        method: "POST",
        body: {
          first_name: payload.first_name,
          last_name: payload.last_name,
          middle_name: payload.middle_name,
          university_email: payload.university_email,
          study_start_date: payload.study_start_date,
          study_end_date: payload.study_end_date,
          attachments: payload.attachments ?? [],
        },
      }
    );

    return {
      universityEmail: payload.university_email,
      studyStartDate: payload.study_start_date,
      studyEndDate: payload.study_end_date,
      attachments: payload.attachments ?? [],
      status: mapStatus(response.status),
      submittedAt: response.createdDate ?? new Date().toISOString(),
      reviewReason: response.rejectionReason,
    };
  },
  listPending: async () => {
    const list = await apiRequest<PageableResponse<ApplicationListItemResponse>>(
      "/api/v1/management/applications",
      {
        query: { status: "PENDING", page: 0, size: 50 },
        auth: true,
      }
    );

    const details = await Promise.all(
      list.content.map((item) =>
        apiRequest<ApplicationDetailResponse>(
          `/api/v1/management/applications/${item.id}`,
          { auth: true }
        )
      )
    );

    return details.map(mapDetail);
  },
  approve: async (applicationId: string) => {
    await apiRequest<ApplicationResponse>(
      `/api/v1/management/applications/${applicationId}/status`,
      {
        method: "PUT",
        body: { status: "ACCEPTED" },
        auth: true,
      }
    );

    const detail = await apiRequest<ApplicationDetailResponse>(
      `/api/v1/management/applications/${applicationId}`,
      { auth: true }
    );

    return mapDetail(detail);
  },
  reject: async (applicationId: string, reason: string) => {
    await apiRequest<ApplicationResponse>(
      `/api/v1/management/applications/${applicationId}/status`,
      {
        method: "PUT",
        body: { status: "REJECTED", rejectionReason: reason },
        auth: true,
      }
    );

    const detail = await apiRequest<ApplicationDetailResponse>(
      `/api/v1/management/applications/${applicationId}`,
      { auth: true }
    );

    return mapDetail(detail);
  },
};

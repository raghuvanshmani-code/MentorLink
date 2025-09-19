
export enum SessionStatus {
  REQUESTED = 'requested',
  PAID = 'paid',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Mentor {
  id: string;
  name: string;
  bio: string;
  phone: string; // E.g., "+15551234567"
  avg_rating: number;
  rating_count: number;
  avatarUrl: string;
}

export interface Rating {
  id: string;
  sessionId: string;
  rating: number;
  feedback?: string;
}

export interface Session {
  id: string;
  mentorId: string;
  mentorName: string;
  userId: string;
  userName: string;
  status: SessionStatus;
  createdAt: string;
  rating?: Rating;
}

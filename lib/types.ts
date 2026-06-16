export interface User {
  id: number;
  email: string;
  password: string;
  name: string | null;
  bio: string | null;
  avatar: string | null;
  created_at: number;
}

export interface SafeUser {
  id: number;
  email: string;
  name: string | null;
  bio: string | null;
  avatar: string | null;
  created_at: number;
}

export interface Session {
  id: string;
  expires_at: number;
  user_id: string;
}

export interface AuthSession {
  user: {
    id: string;
  } | null;
  session: {
    id: string;
    expiresAt: Date;
    fresh: boolean;
    userId: string;
  } | null;
}

export interface UpdateProfileData {
  name: string;
  bio: string;
}

export interface MovieReview {
  id: number;
  user_id: number;
  movie_title: string;
  movie_year: number | null;
  movie_poster: string | null;
  rating: number;
  review_text: string;
  created_at: number;
  updated_at: number;
}

export interface MovieReviewWithUser extends MovieReview {
  user_name: string | null;
  user_email: string;
  user_avatar: string | null;
}

export interface Comment {
  id: number;
  review_id: number;
  user_id: number;
  comment_text: string;
  created_at: number;
}

export interface CommentWithUser extends Comment {
  user_name: string | null;
  user_email: string;
  user_avatar: string | null;
}

export interface CreateReviewData {
  movie_title: string;
  movie_year?: number;
  movie_poster?: string;
  rating: number;
  review_text: string;
}

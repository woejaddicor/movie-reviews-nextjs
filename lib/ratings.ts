import db from "./db";
import type { MovieReviewWithUser, UserRating } from "./types";

export function getUserRating(
  reviewId: number,
  userId: number,
): UserRating | null {
  const stmt = db.prepare(`SELECT * FROM user_ratings WHERE review_id = ? AND user_id = ?`);
  return stmt.get(reviewId, userId) as UserRating | null;
}

export function upsertUserRating(
  reviewId: number,
  userId: number,
  rating: number,
  ratingText?: string,
): UserRating {
  const stmt = db.prepare(`
    INSERT INTO user_ratings (review_id, user_id, rating, rating_text)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(review_id, user_id) DO UPDATE SET rating = excluded.rating, rating_text = excluded.rating_text, updated_at = strftime('%s', 'now')
  `);

  stmt.run(reviewId, userId, rating, ratingText ?? null);
  return getUserRating(reviewId, userId)!;
}

export function getAverageRating(reviewId: number): { average: number | null; count: number } {
  const stmt = db.prepare(`SELECT AVG(rating) as average, COUNT(*) as count FROM user_ratings WHERE review_id = ?`);
  return stmt.get(reviewId) as { average: number | null; count: number };
}

export function getUserRatingsByUserId(userId: number): UserRating[] {
  const stmt = db.prepare(`SELECT * FROM user_ratings WHERE user_id = ? ORDER BY updated_at DESC`);
  return stmt.all(userId) as UserRating[];
}

export function getRatedReviewsByUserId(userId: number): MovieReviewWithUser[] {
  const stmt = db.prepare(`
    SELECT
      r.id,
      r.user_id,
      r.movie_title,
      r.movie_year,
      r.movie_poster,
      ur.rating AS rating,
      COALESCE(ur.rating_text, '') AS review_text,
      ur.created_at AS created_at,
      ur.updated_at AS updated_at,
      u.name AS user_name,
      u.email AS user_email,
      u.avatar AS user_avatar
    FROM user_ratings ur
    JOIN movie_reviews r ON ur.review_id = r.id
    JOIN users u ON r.user_id = u.id
    WHERE ur.user_id = ?
    ORDER BY ur.updated_at DESC
  `);
  return stmt.all(userId) as MovieReviewWithUser[];
}

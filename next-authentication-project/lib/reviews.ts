import db from "./db";
import type { MovieReview, MovieReviewWithUser } from "./types";

export function createReview(
  userId: number,
  movieTitle: string,
  rating: number,
  reviewText: string,
  movieYear?: number,
  moviePoster?: string,
): MovieReview {
  const stmt = db.prepare(`
    INSERT INTO movie_reviews (user_id, movie_title, movie_year, movie_poster, rating, review_text)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    userId,
    movieTitle,
    movieYear,
    moviePoster,
    rating,
    reviewText,
  );

  return getReviewById(result.lastInsertRowid as number)!;
}

export function getReviewById(reviewId: number): MovieReview | null {
  const stmt = db.prepare(`
    SELECT * FROM movie_reviews WHERE id = ?
  `);

  return stmt.get(reviewId) as MovieReview | null;
}

export function getReviewWithUser(
  reviewId: number,
): MovieReviewWithUser | null {
  const stmt = db.prepare(`
    SELECT 
      r.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM movie_reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
  `);

  return stmt.get(reviewId) as MovieReviewWithUser | null;
}

export function getAllReviews(
  limit: number = 50,
  offset: number = 0,
): MovieReviewWithUser[] {
  const stmt = db.prepare(`
    SELECT 
      r.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM movie_reviews r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
    LIMIT ? OFFSET ?
  `);

  return stmt.all(limit, offset) as MovieReviewWithUser[];
}

export function getReviewsByUserId(userId: number): MovieReviewWithUser[] {
  const stmt = db.prepare(`
    SELECT 
      r.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM movie_reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `);

  return stmt.all(userId) as MovieReviewWithUser[];
}

export function updateReview(
  reviewId: number,
  userId: number,
  data: {
    movie_title?: string;
    movie_year?: number;
    movie_poster?: string;
    rating?: number;
    review_text?: string;
  },
): boolean {
  const updates: string[] = [];
  const values: any[] = [];

  if (data.movie_title !== undefined) {
    updates.push("movie_title = ?");
    values.push(data.movie_title);
  }
  if (data.movie_year !== undefined) {
    updates.push("movie_year = ?");
    values.push(data.movie_year);
  }
  if (data.movie_poster !== undefined) {
    updates.push("movie_poster = ?");
    values.push(data.movie_poster);
  }
  if (data.rating !== undefined) {
    updates.push("rating = ?");
    values.push(data.rating);
  }
  if (data.review_text !== undefined) {
    updates.push("review_text = ?");
    values.push(data.review_text);
  }

  if (updates.length === 0) return false;

  updates.push("updated_at = strftime('%s', 'now')");
  values.push(reviewId, userId);

  const stmt = db.prepare(`
    UPDATE movie_reviews
    SET ${updates.join(", ")}
    WHERE id = ? AND user_id = ?
  `);

  const result = stmt.run(...values);
  return result.changes > 0;
}

export function deleteReview(reviewId: number, userId: number): boolean {
  const stmt = db.prepare(`
    DELETE FROM movie_reviews
    WHERE id = ? AND user_id = ?
  `);

  const result = stmt.run(reviewId, userId);
  return result.changes > 0;
}

export function searchReviews(query: string): MovieReviewWithUser[] {
  const stmt = db.prepare(`
    SELECT 
      r.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM movie_reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.movie_title LIKE ? OR r.review_text LIKE ?
    ORDER BY r.created_at DESC
  `);

  const searchPattern = `%${query}%`;
  return stmt.all(searchPattern, searchPattern) as MovieReviewWithUser[];
}

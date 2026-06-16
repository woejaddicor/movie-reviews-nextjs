import db from "./db";
import type { Comment, CommentWithUser } from "./types";

export function createComment(
  reviewId: number,
  userId: number,
  commentText: string,
): Comment {
  const stmt = db.prepare(`
    INSERT INTO comments (review_id, user_id, comment_text)
    VALUES (?, ?, ?)
  `);

  const result = stmt.run(reviewId, userId, commentText);

  return getCommentById(result.lastInsertRowid as number)!;
}

export function getCommentById(commentId: number): Comment | null {
  const stmt = db.prepare(`
    SELECT * FROM comments WHERE id = ?
  `);

  return stmt.get(commentId) as Comment | null;
}

export function getCommentsByReviewId(reviewId: number): CommentWithUser[] {
  const stmt = db.prepare(`
    SELECT 
      c.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.review_id = ?
    ORDER BY c.created_at ASC
  `);

  return stmt.all(reviewId) as CommentWithUser[];
}

export function deleteComment(commentId: number, userId: number): boolean {
  const stmt = db.prepare(`
    DELETE FROM comments
    WHERE id = ? AND user_id = ?
  `);

  const result = stmt.run(commentId, userId);
  return result.changes > 0;
}

export function getCommentCountByReviewId(reviewId: number): number {
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM comments WHERE review_id = ?
  `);

  const result = stmt.get(reviewId) as { count: number };
  return result.count;
}

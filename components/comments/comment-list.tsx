"use client";

import { CommentWithUser } from "@/lib/types";
import CommentItem from "./comment-item";

interface CommentListProps {
  comments: CommentWithUser[];
  currentUserId: string;
  onDelete: (commentId: number) => void;
  deletingId: number | null;
}

export default function CommentList({
  comments,
  currentUserId,
  onDelete,
  deletingId,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-white/50 text-center py-8">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const isOwner = comment.user_id.toString() === currentUserId;
        const isDeleting = deletingId === comment.id;

        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            isOwner={isOwner}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        );
      })}
    </div>
  );
}

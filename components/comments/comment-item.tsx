"use client";

import { CommentWithUser } from "@/lib/types";
import UserAvatar from "@/components/ui/user-avatar";

interface CommentItemProps {
  comment: CommentWithUser;
  isOwner: boolean;
  onDelete: (commentId: number) => void;
  isDeleting: boolean;
}

export default function CommentItem({
  comment,
  isOwner,
  onDelete,
  isDeleting,
}: CommentItemProps) {
  return (
    <div className="card-hover p-6">
      <div className="flex items-start gap-4">
        <UserAvatar
          name={comment.user_name}
          email={comment.user_email}
          size="md"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold">
                {comment.user_name || "Anonymous"}
              </p>
              <p className="text-xs text-white/50">
                {new Date(comment.created_at * 1000).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </p>
            </div>

            {isOwner && (
              <button
                onClick={() => onDelete(comment.id)}
                disabled={isDeleting}
                className="text-red-400 hover:text-red-300 text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>

          <p className="text-white/90 whitespace-pre-wrap">
            {comment.comment_text}
          </p>
        </div>
      </div>
    </div>
  );
}

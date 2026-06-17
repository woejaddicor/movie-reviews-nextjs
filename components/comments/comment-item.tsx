"use client";

import { CommentWithUser } from "@/lib/types";
import UserAvatar from "@/components/ui/user-avatar";
import Link from "next/link";

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
        <Link href={`/users/${comment.user_id}`}>
          <UserAvatar
            name={comment.user_name}
            email={comment.user_email}
            size="md"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold">
                <Link href={`/profile/${comment.user_id}`} className="text-inherit no-underline">
                  {comment.user_name || "Anonymous"}
                </Link>
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
                className="btn-warning-sm"
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

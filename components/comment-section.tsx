"use client";

import { CommentWithUser } from "@/lib/types";
import { graphqlClient } from "@/components/graphql-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CommentForm from "@/components/comments/comment-form";
import CommentList from "@/components/comments/comment-list";

interface CommentSectionProps {
  reviewId: number;
  comments: CommentWithUser[];
  currentUserId: string;
}

export default function CommentSection({
  reviewId,
  comments,
  currentUserId,
}: CommentSectionProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsSubmitting(true);

    try {
      const form = Object.fromEntries(formData.entries()) as Record<string, string>;
      await graphqlClient(`mutation CreateComment($input: CreateCommentInput!) {
        createComment(input: $input) {
          id
        }
      }`, {
        input: {
          reviewId,
          commentText: form.comment_text,
        },
      });
      const result = { success: true };

      if (result.success) {
        // Clear the form
        const form = document.getElementById("comment-form") as HTMLFormElement;
        form?.reset();
        router.refresh();
      }
    } catch (e) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(commentId: number) {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setDeletingId(commentId);

    try {
      await graphqlClient(`mutation DeleteComment($id: Int!) {
        deleteComment(id: $id)
      }`, { id: commentId });
      const result = { success: true };

      if (result.success) {
        router.refresh();
      }
    } catch (e) {
      alert("An unexpected error occurred");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

      <CommentForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />

      <CommentList
        comments={comments}
        currentUserId={currentUserId}
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </div>
  );
}

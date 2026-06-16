"use server";

import { verifyAuthSession } from "@/lib/auth";
import { createComment, deleteComment } from "@/lib/comments";
import { revalidatePath } from "next/cache";

export async function createCommentAction(
  reviewId: number,
  formData: FormData,
) {
  const result = await verifyAuthSession();

  if (!result.user) {
    return { error: "Unauthorized" };
  }

  const commentText = formData.get("comment_text") as string;

  if (!commentText || commentText.trim().length === 0) {
    return { error: "Comment text is required" };
  }

  if (commentText.trim().length < 3) {
    return { error: "Comment must be at least 3 characters long" };
  }

  try {
    createComment(reviewId, parseInt(result.user.id), commentText.trim());

    revalidatePath(`/reviews/${reviewId}`);

    return { success: true };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { error: "Failed to create comment" };
  }
}

export async function deleteCommentAction(commentId: number, reviewId: number) {
  const result = await verifyAuthSession();

  if (!result.user) {
    return { error: "Unauthorized" };
  }

  try {
    const success = deleteComment(commentId, parseInt(result.user.id));

    if (!success) {
      return { error: "Failed to delete comment or unauthorized" };
    }

    revalidatePath(`/reviews/${reviewId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { error: "Failed to delete comment" };
  }
}

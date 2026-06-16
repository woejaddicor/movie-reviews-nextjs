"use client";

import { deleteReviewAction } from "@/actions/review-actions";
import { useState } from "react";

interface DeleteReviewButtonProps {
  reviewId: number;
}

export default function DeleteReviewButton({
  reviewId,
}: DeleteReviewButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (
      !confirm(
        "Are you sure you want to delete this review? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteReviewAction(reviewId);
    } catch (error) {
      alert("Failed to delete review");
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-sm [html[data-theme='light']_&]:shadow-md"
    >
      {isDeleting ? "Deleting..." : "Delete Review"}
    </button>
  );
}

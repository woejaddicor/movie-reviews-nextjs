"use server";

import { verifyAuthSession } from "@/lib/auth";
import {
  createReview,
  deleteReview,
  updateReview,
  getAllReviews,
  searchReviews,
} from "@/lib/reviews";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createReviewAction(formData: FormData) {
  const result = await verifyAuthSession();

  if (!result.user) {
    return { error: "Unauthorized" };
  }

  const movieTitle = formData.get("movie_title") as string;
  const movieYear = formData.get("movie_year") as string;
  const moviePoster = formData.get("movie_poster") as string;
  const rating = formData.get("rating") as string;
  const reviewText = formData.get("review_text") as string;

  // Validation
  if (!movieTitle || movieTitle.trim().length === 0) {
    return { error: "Movie title is required" };
  }

  if (!rating || isNaN(parseInt(rating))) {
    return { error: "Valid rating is required" };
  }

  const ratingNum = parseInt(rating);
  if (ratingNum < 1 || ratingNum > 10) {
    return { error: "Rating must be between 1 and 10" };
  }

  if (!reviewText || reviewText.trim().length < 10) {
    return { error: "Review must be at least 10 characters long" };
  }

  try {
    const review = createReview(
      parseInt(result.user.id),
      movieTitle.trim(),
      ratingNum,
      reviewText.trim(),
      movieYear ? parseInt(movieYear) : undefined,
      moviePoster?.trim() || undefined,
    );

    revalidatePath("/reviews");
    revalidatePath("/dashboard");
    redirect(`/reviews/${review.id}`);
  } catch (error) {
    // Don't catch redirect errors
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Error creating review:", error);
    return { error: "Failed to create review" };
  }
}

export async function updateReviewAction(reviewId: number, formData: FormData) {
  const result = await verifyAuthSession();

  if (!result.user) {
    return { error: "Unauthorized" };
  }

  const movieTitle = formData.get("movie_title") as string;
  const movieYear = formData.get("movie_year") as string;
  const moviePoster = formData.get("movie_poster") as string;
  const rating = formData.get("rating") as string;
  const reviewText = formData.get("review_text") as string;

  const updateData: any = {};

  if (movieTitle) updateData.movie_title = movieTitle.trim();
  if (movieYear) updateData.movie_year = parseInt(movieYear);
  if (moviePoster) updateData.movie_poster = moviePoster.trim();
  if (rating) {
    const ratingNum = parseInt(rating);
    if (ratingNum >= 1 && ratingNum <= 10) {
      updateData.rating = ratingNum;
    }
  }
  if (reviewText) updateData.review_text = reviewText.trim();

  try {
    const success = updateReview(
      reviewId,
      parseInt(result.user.id),
      updateData,
    );

    if (!success) {
      return { error: "Failed to update review or unauthorized" };
    }

    revalidatePath(`/reviews/${reviewId}`);
    revalidatePath("/reviews");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error updating review:", error);
    return { error: "Failed to update review" };
  }
}

export async function deleteReviewAction(reviewId: number) {
  const result = await verifyAuthSession();

  if (!result.user) {
    return { error: "Unauthorized" };
  }

  try {
    const success = deleteReview(reviewId, parseInt(result.user.id));

    if (!success) {
      return { error: "Failed to delete review or unauthorized" };
    }

    revalidatePath("/reviews");
    revalidatePath("/dashboard");
    redirect("/reviews");
  } catch (error) {
    // Don't catch redirect errors
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Error deleting review:", error);
    return { error: "Failed to delete review" };
  }
}

export async function searchReviewsAction(query: string) {
  if (!query || query.trim().length === 0) {
    return getAllReviews();
  }

  return searchReviews(query.trim());
}

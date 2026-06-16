"use client";
import {
  createReviewAction,
  updateReviewAction,
} from "@/actions/review-actions";
import { MovieReview } from "@/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReviewFormFields from "./review-form-fields";

interface ReviewFormProps {
  review?: MovieReview;
}

export default function ReviewForm({ review }: ReviewFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsSubmitting(true);

    try {
      let result;
      if (review) {
        result = await updateReviewAction(review.id, formData);
        if (result?.success) {
          router.push(`/reviews/${review.id}`);
          return;
        }
      } else {
        result = await createReviewAction(formData);
      }

      if (result?.error) {
        setError(result.error);
      }
    } catch (e) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <ReviewFormFields
        review={
          review
            ? {
                movie_title: review.movie_title,
                movie_year: review.movie_year ?? undefined,
                rating: review.rating,
                movie_poster: review.movie_poster ?? undefined,
                review_text: review.review_text,
              }
            : undefined
        }
        isSubmitting={isSubmitting}
        router={router}
      />
    </form>
  );
}

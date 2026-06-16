"use client";
import { graphqlClient } from "@/components/graphql-client";
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
      const form = Object.fromEntries(formData.entries()) as Record<string, string>;
      if (review) {
        await graphqlClient(`mutation UpdateReview($input: UpdateReviewInput!) {
          updateReview(input: $input)
        }`, {
          input: {
            id: review.id,
            movie_title: form.movie_title,
            movie_year: form.movie_year ? parseInt(form.movie_year) : undefined,
            movie_poster: form.movie_poster,
            rating: form.rating ? parseInt(form.rating) : undefined,
            review_text: form.review_text,
          },
        });
        router.push(`/reviews/${review.id}`);
        return;
      }

      const createData = await graphqlClient(`mutation CreateReview($input: CreateReviewInput!) {
        createReview(input: $input) {
          id
        }
      }`, {
        input: {
          movie_title: form.movie_title,
          movie_year: form.movie_year ? parseInt(form.movie_year) : undefined,
          movie_poster: form.movie_poster,
          rating: form.rating ? parseInt(form.rating) : undefined,
          review_text: form.review_text,
        },
      });
      router.push(`/reviews/${createData.createReview.id}`);
    } catch (e) {
      setError((e as Error).message || "An unexpected error occurred");
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

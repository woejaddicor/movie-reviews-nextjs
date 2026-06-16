import { verifyAuthSession } from "@/lib/auth";
import { serverGraphql } from "@/lib/graphql";
import { notFound, redirect } from "next/navigation";
import ReviewForm from "@/components/reviews/review-form";

export default async function EditReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const reviewId = parseInt(params.id);

  if (isNaN(reviewId)) {
    notFound();
  }

  const session = await verifyAuthSession();
  if (!session.user) {
    return redirect("/");
  }

  const data = await serverGraphql<{ review: {
    id: number;
    user_id: number;
    movie_title: string;
    movie_year: number | null;
    movie_poster: string | null;
    rating: number;
    review_text: string;
    created_at: number;
    updated_at: number;
  } | null }>(
    `query EditReview($id: Int!) {
      review(id: $id) {
        id
        user_id
        movie_title
        movie_year
        movie_poster
        rating
        review_text
        created_at
        updated_at
      }
    }`,
    { id: reviewId },
  );

  if (!data.review) {
    notFound();
  }

  if (parseInt(session.user.id) !== data.review.user_id) {
    return redirect(`/reviews/${reviewId}`);
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Edit Review</h1>
      <div className="card">
        <ReviewForm review={review} />
      </div>
    </div>
  );
}

import { getReviewWithUser } from "@/lib/reviews";
import { getCommentsByReviewId } from "@/lib/comments";
import { verifyAuthSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import CommentSection from "@/components/comment-section";
import MoviePoster from "@/components/ui/movie-poster";
import ReviewHeader from "@/components/reviews/review-header";
import ReviewActions from "@/components/reviews/review-actions";
import Link from "next/link";

export default async function ReviewDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const reviewId = parseInt(params.id);

  if (isNaN(reviewId)) {
    notFound();
  }

  const review = getReviewWithUser(reviewId);

  if (!review) {
    notFound();
  }

  const comments = getCommentsByReviewId(reviewId);
  const session = await verifyAuthSession();

  if (!session.user) {
    return redirect("/");
  }

  const isOwner = parseInt(session.user.id) === review.user_id;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <Link
        href="/reviews"
        className="inline-flex items-center text-green-400 [html[data-theme='light']_&]:text-green-600 hover:text-green-300 [html[data-theme='light']_&]:hover:text-green-700 mb-6 transition-colors font-medium"
      >
        ← Back to Reviews
      </Link>

      <div className="bg-black/40 [html[data-theme='light']_&]:bg-white border border-white/10 [html[data-theme='light']_&]:border-gray-200 rounded-2xl overflow-hidden mb-8 [html[data-theme='light']_&]:shadow-lg">
        {review.movie_poster && (
          <MoviePoster
            src={review.movie_poster}
            alt={review.movie_title}
            variant="hero"
          />
        )}

        <div className="p-8">
          <ReviewHeader
            movieTitle={review.movie_title}
            movieYear={review.movie_year ?? undefined}
            rating={review.rating}
            userName={review.user_name}
            userEmail={review.user_email}
            createdAt={review.created_at}
          />

          <div className="prose prose-invert [html[data-theme='light']_&]:prose-gray max-w-none">
            <p className="text-lg leading-relaxed whitespace-pre-wrap [html[data-theme='light']_&]:text-gray-800">
              {review.review_text}
            </p>
          </div>

          {isOwner && <ReviewActions reviewId={review.id} />}
        </div>
      </div>

      <CommentSection
        reviewId={reviewId}
        comments={comments}
        currentUserId={session.user.id}
      />
    </div>
  );
}

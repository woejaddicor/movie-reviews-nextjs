import { verifyAuthSession } from "@/lib/auth";
import { serverGraphql } from "@/lib/graphql";
import { notFound, redirect } from "next/navigation";
import CommentSection from "@/components/comment-section";
import MoviePoster from "@/components/ui/movie-poster";
import ReviewHeader from "@/components/reviews/review-header";
import ReviewActions from "@/components/reviews/review-actions";
import UserRatingPanel from "@/components/reviews/user-rating-panel";
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

  const session = await verifyAuthSession();
  if (!session.user) {
    return redirect("/");
  }

  const data = await serverGraphql<{
    review: {
      id: number;
      user_id: number;
      movie_title: string;
      movie_year: number | null;
      movie_poster: string | null;
      rating: number;
      review_text: string;
      created_at: number;
      updated_at: number;
      user_name: string | null;
      user_email: string;
      user_avatar: string | null;
    } | null;
    myUserRating: {
      id: number;
      review_id: number;
      user_id: number;
      rating: number;
      rating_text: string | null;
      created_at: number;
      updated_at: number;
    } | null;
    commentsByReview: Array<{
      id: number;
      review_id: number;
      user_id: number;
      comment_text: string;
      created_at: number;
      user_name: string | null;
      user_email: string;
      user_avatar: string | null;
    }>;
  }>(
    `query ReviewDetail($id: Int!, $reviewId: Int!) {
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
        user_name
        user_email
        user_avatar
      }
      myUserRating(reviewId: $id) {
        id
        review_id
        user_id
        rating
        rating_text
        created_at
        updated_at
      }
      commentsByReview(reviewId: $reviewId) {
        id
        review_id
        user_id
        comment_text
        created_at
        user_name
        user_email
        user_avatar
      }
    }`,
    { id: reviewId, reviewId },
  );

  if (!data.review) {
    notFound();
  }

  const review = data.review;
  const comments = data.commentsByReview;
  const personalRating = data.myUserRating;
  const isOwner = parseInt(session.user.id) === review.user_id;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <Link
        href="/community"
        className="inline-flex items-center text-green-400 [html[data-theme='light']_&]:text-green-600 hover:text-green-300 [html[data-theme='light']_&]:hover:text-green-700 mb-6 transition-colors font-medium"
      >
        ← Back to Community
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
            userId={review.user_id}
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

      {!isOwner && (
        <UserRatingPanel
          reviewId={reviewId}
          initialRating={personalRating?.rating ?? null}
          initialText={personalRating?.rating_text ?? null}
        />
      )}

      <CommentSection
        reviewId={reviewId}
        comments={comments}
        currentUserId={session.user.id}
      />
    </div>
  );
}

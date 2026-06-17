import Link from "next/link";
import { MovieReviewWithUser } from "@/lib/types";
import MoviePoster from "@/components/ui/movie-poster";
import RatingBadge from "@/components/ui/rating-badge";
import UserAvatar from "@/components/ui/user-avatar";
import { formatDateTimestamp } from "@/lib/format";

interface ReviewCardProps {
  review: MovieReviewWithUser;
  isOwner?: boolean;
}

export default function ReviewCard({ review, isOwner }: ReviewCardProps) {
  return (
    <Link
      href={`/reviews/${review.id}`}
      className="bg-black/40 [html[data-theme='light']_&]:bg-white border border-white/10 [html[data-theme='light']_&]:border-gray-200 rounded-2xl overflow-hidden hover:bg-black/60 [html[data-theme='light']_&]:hover:bg-gray-50 hover:border-green-600/50 [html[data-theme='light']_&]:hover:border-green-500 transition-all hover:scale-[1.02] [html[data-theme='light']_&]:shadow-md [html[data-theme='light']_&]:hover:shadow-lg group relative"
    >
      {isOwner && (
        <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold z-10 shadow-md">
          Your Review
        </div>
      )}

      {review.movie_poster && (
        <MoviePoster
          src={review.movie_poster}
          alt={review.movie_title}
          variant="card"
        />
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold flex-1 group-hover:text-green-400 [html[data-theme='light']_&]:text-gray-900 [html[data-theme='light']_&]:group-hover:text-green-600 transition-colors">
            {review.movie_title}
          </h2>
          <div className="ml-2">
            <RatingBadge rating={review.rating}  size="sm" />
          </div>
        </div>

        {review.movie_year && (
          <p className="text-white/50 [html[data-theme='light']_&]:text-gray-600 text-sm mb-3">
            {review.movie_year}
          </p>
        )}

        <p className="text-white/70 [html[data-theme='light']_&]:text-gray-700 text-sm mb-4 line-clamp-3">
          {review.review_text}
        </p>

        <div className="flex items-center gap-3 pt-4 border-t border-white/10 [html[data-theme='light']_&]:border-gray-200">
          <UserAvatar
            name={review.user_name}
            email={review.user_email}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate [html[data-theme='light']_&]:text-gray-900">
              {review.user_name || "Anonymous"}
            </p>
            <p className="text-xs text-white/50 [html[data-theme='light']_&]:text-gray-600">
              {formatDateTimestamp(review.created_at)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

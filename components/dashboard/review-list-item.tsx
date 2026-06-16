import Link from "next/link";
import { MovieReview } from "@/lib/types";
import RatingBadge from "@/components/ui/rating-badge";
import { formatDateTimestamp } from "@/lib/format";

interface ReviewListItemProps {
  review: MovieReview;
}

export default function ReviewListItem({ review }: ReviewListItemProps) {
  return (
    <Link
      href={`/reviews/${review.id}`}
      className="card-hover flex items-start gap-4 p-4 group"
    >
      {review.movie_poster && (
        <img
          src={review.movie_poster}
          alt={review.movie_title}
          className="w-16 h-24 object-cover rounded-lg [html[data-theme='light']_&]:shadow-sm"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold group-hover:text-green-400 [html[data-theme='light']_&]:text-gray-900 [html[data-theme='light']_&]:group-hover:text-green-600 transition-colors">
              {review.movie_title}
            </h3>
            {review.movie_year && (
              <p className="text-sm text-white/50 [html[data-theme='light']_&]:text-gray-600">
                {review.movie_year}
              </p>
            )}
          </div>
          <div className="ml-4">
            <RatingBadge rating={review.rating} size="sm" />
          </div>
        </div>
        <p className="text-white/70 [html[data-theme='light']_&]:text-gray-700 text-sm line-clamp-2 mb-2">
          {review.review_text}
        </p>
        <p className="text-xs text-white/50 [html[data-theme='light']_&]:text-gray-600">
          {formatDateTimestamp(review.created_at)}
        </p>
      </div>
    </Link>
  );
}

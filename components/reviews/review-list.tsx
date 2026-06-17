import { MovieReviewWithUser } from "@/lib/types";
import ReviewCard from "./review-card";

interface ReviewListProps {
  reviews: MovieReviewWithUser[];
  currentUserId?: string;
}

export default function ReviewList({
  reviews,
  currentUserId,
}: ReviewListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => {
        const isOwner = currentUserId
          ? parseInt(currentUserId) === review.user_id
          : false;

        return (
          <ReviewCard
            key={review.id}
            review={review}
            isOwner={isOwner}
            isRatedByCurrentUser={!isOwner && review.is_rated_by_current_user}
          />
        );
      })}
    </div>
  );
}

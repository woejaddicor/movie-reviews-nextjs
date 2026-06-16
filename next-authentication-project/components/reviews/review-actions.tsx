import Link from "next/link";
import DeleteReviewButton from "@/components/delete-review-button";

interface ReviewActionsProps {
  reviewId: number;
}

export default function ReviewActions({ reviewId }: ReviewActionsProps) {
  return (
    <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
      <Link href={`/reviews/${reviewId}/edit`} className="btn-primary-sm">
        Edit Review
      </Link>
      <DeleteReviewButton reviewId={reviewId} />
    </div>
  );
}

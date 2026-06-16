import { getAllReviews, getReviewsByUserId } from "@/lib/reviews";
import Link from "next/link";
import { verifyAuthSession } from "@/lib/auth";
import ReviewsFilter from "@/components/reviews-filter";

export default async function ReviewsPage() {
  const session = await verifyAuthSession();
  const allReviews = getAllReviews();
  const myReviews = session.user
    ? getReviewsByUserId(parseInt(session.user.id))
    : [];

  return (
    <ReviewsFilter
      allReviews={allReviews}
      myReviews={myReviews}
      currentUserId={session.user?.id}
    />
  );
}

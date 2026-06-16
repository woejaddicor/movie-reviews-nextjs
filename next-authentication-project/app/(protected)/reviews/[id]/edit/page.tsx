import { getReviewById } from "@/lib/reviews";
import { verifyAuthSession } from "@/lib/auth";
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

  const review = getReviewById(reviewId);

  if (!review) {
    notFound();
  }

  // Check if the user owns this review
  if (parseInt(session.user.id) !== review.user_id) {
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

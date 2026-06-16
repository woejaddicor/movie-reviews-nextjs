import { verifyAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ReviewForm from "@/components/reviews/review-form";

export default async function NewReviewPage() {
  const result = await verifyAuthSession();

  if (!result.user) {
    return redirect("/");
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Write a Movie Review</h1>
      <div className="card">
        <ReviewForm />
      </div>
    </div>
  );
}

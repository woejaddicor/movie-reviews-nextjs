import { verifyAuthSession } from "@/lib/auth";
import { serverGraphql } from "@/lib/graphql";
import { redirect } from "next/navigation";
import Link from "next/link";
import StatCard from "@/components/dashboard/stat-card";
import ReviewListItem from "@/components/dashboard/review-list-item";
import EmptyState from "@/components/ui/empty-state";
import { formatDateTimestamp } from "@/lib/format";

export default async function DashboardPage() {
  const result = await verifyAuthSession();

  if (!result.user) {
    return redirect("/");
  }

  const data = await serverGraphql<{ me: {
    id: number;
    email: string;
    name: string | null;
    bio: string | null;
    avatar: string | null;
    created_at: number;
  } | null }>(
    `query Me {
      me {
        id
        email
        name
        bio
        avatar
        created_at
      }
    }`,
  );

  if (!data.me) {
    return redirect("/");
  }

  const user = data.me;

  const reviewData = await serverGraphql<{
    reviewsByUser: Array<{
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
    }>;
  }>(
    `query ReviewsByUser($userId: Int!) {
      reviewsByUser(userId: $userId) {
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
    }`,
    { userId: parseInt(result.user.id) },
  );

  const userReviews = reviewData.reviewsByUser;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 [html[data-theme='light']_&]:text-gray-900">
          Welcome back, {user.name || user.email}!
        </h1>
        <p className="text-white/70 [html[data-theme='light']_&]:text-gray-600">
          Here's your movie review activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total Reviews"
          value={userReviews.length}
          variant="green"
        />
        <StatCard
          label="Average Rating"
          value={
            userReviews.length > 0
              ? (
                  userReviews.reduce((sum, r) => sum + r.rating, 0) /
                  userReviews.length
                ).toFixed(1)
              : "0.0"
          }
          variant="emerald"
        />
        <StatCard
          label="Latest Review"
          value={
            userReviews.length > 0
              ? formatDateTimestamp(userReviews[0].created_at)
              : "None yet"
          }
          variant="lime"
        />
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold [html[data-theme='light']_&]:text-gray-900">
            Your Reviews
          </h2>
          <Link href="/reviews/new" className="btn-primary-sm">
            Write New Review
          </Link>
        </div>

        {userReviews.length === 0 ? (
          <EmptyState
            title="No reviews yet"
            message="You haven't written any reviews yet."
            actionLabel="Write Your First Review"
            actionHref="/reviews/new"
          />
        ) : (
          <div className="space-y-4">
            {userReviews.map((review) => (
              <ReviewListItem key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

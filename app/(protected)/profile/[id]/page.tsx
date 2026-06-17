import { notFound } from "next/navigation";
import { getUserById } from "@/lib/user";
import { getReviewsByUserId } from "@/lib/reviews";
import ReviewList from "@/components/reviews/review-list";
import UserAvatar from "@/components/ui/user-avatar";
import { formatDateTimestamp } from "@/lib/format";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user = getUserById(params.id);
  if (!user) return notFound();

  const reviews = getReviewsByUserId(user.id);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8 bg-black/40 [html[data-theme='light']_&]:bg-white border border-white/10 [html[data-theme='light']_&]:border-gray-200 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <UserAvatar name={user.name ?? null} email={user.email} size="lg" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user.name || user.email}</h1>
            <p className="text-sm text-white/60 [html[data-theme='light']_&]:text-gray-600 mt-1">Joined: {formatDateTimestamp(user.created_at)}</p>
            {user.bio && <p className="mt-3 text-sm text-white/80 [html[data-theme='light']_&]:text-gray-700 max-w-2xl">{user.bio}</p>}
          </div>
          <div className="rounded-2xl bg-white/5 [html[data-theme='light']_&]:bg-gray-100 border border-white/10 [html[data-theme='light']_&]:border-gray-200 px-4 py-3 text-right">
            <div className="text-sm text-white/60 [html[data-theme='light']_&]:text-gray-600">Reviews</div>
            <div className="text-3xl font-semibold">{reviews.length}</div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Films reviewed</h2>
      <ReviewList reviews={reviews} />
    </div>
  );
}

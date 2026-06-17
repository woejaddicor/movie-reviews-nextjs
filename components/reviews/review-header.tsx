import UserAvatar from "@/components/ui/user-avatar";
import Link from "next/link";
import RatingBadge from "@/components/ui/rating-badge";

interface ReviewHeaderProps {
  movieTitle: string;
  movieYear?: number;
  rating: number;
  userName?: string | null;
  userId?: number;
  userEmail: string;
  createdAt: number;
}

export default function ReviewHeader({
  movieTitle,
  movieYear,
  rating,
  userName,
  userEmail,
  createdAt,
  userId,
}: ReviewHeaderProps) {
  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2 [html[data-theme='light']_&]:text-gray-900">
            {movieTitle}
          </h1>
          {movieYear && (
            <p className="text-white/70 [html[data-theme='light']_&]:text-gray-600 text-lg">
              {movieYear}
            </p>
          )}
        </div>
        <div className="ml-4 text-center">
          <RatingBadge rating={rating} size="lg" />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10 [html[data-theme='light']_&]:border-gray-200">
        <UserAvatar name={userName} email={userEmail} size="lg" />
        <div>
          <p className="font-semibold [html[data-theme='light']_&]:text-gray-900">
            {userId ? (
              <Link href={`/profile/${userId}`} className="text-inherit no-underline">
                {userName || "Anonymous"}
              </Link>
            ) : (
              (userName || "Anonymous")
            )}
          </p>
          <p className="text-sm text-white/50 [html[data-theme='light']_&]:text-gray-600">
            {new Date(createdAt * 1000).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </>
  );
}

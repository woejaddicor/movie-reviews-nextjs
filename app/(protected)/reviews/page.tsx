import { verifyAuthSession } from "@/lib/auth";
import { serverGraphql } from "@/lib/graphql";
import ReviewsFilter from "@/components/reviews-filter";

export default async function ReviewsPage() {
  const session = await verifyAuthSession();
  if (!session.user) {
    return null;
  }

  const allReviewsData = await serverGraphql<{
    reviews: Array<{
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
    `query Reviews($limit: Int, $offset: Int) {
      reviews(limit: $limit, offset: $offset) {
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
    { limit: 50, offset: 0 },
  );

  const myReviewsData = await serverGraphql<{
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
    { userId: parseInt(session.user.id) },
  );

  const allReviews = allReviewsData.reviews;
  const myReviews = myReviewsData.reviewsByUser;

  return (
    <ReviewsFilter
      allReviews={allReviews}
      myReviews={myReviews}
      currentUserId={session.user?.id}
    />
  );
}

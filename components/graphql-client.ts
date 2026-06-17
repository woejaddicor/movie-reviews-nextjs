export async function graphqlClient(query: string, variables?: Record<string, unknown>) {
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    const message = json.errors?.[0]?.message || "GraphQL request failed";
    throw new Error(message);
  }
  return json.data;
}

export async function upsertUserRating(reviewId: number, rating: number, ratingText?: string) {
  const query = `mutation UpsertUserRating($reviewId: Int!, $rating: Int!, $ratingText: String) { upsertUserRating(reviewId: $reviewId, rating: $rating, ratingText: $ratingText) { id review_id user_id rating rating_text created_at updated_at } }`;
  const data = await graphqlClient(query, { reviewId, rating, ratingText });
  return data.upsertUserRating as {
    id: number;
    review_id: number;
    user_id: number;
    rating: number;
    rating_text: string | null;
    created_at: number;
    updated_at: number;
  };
}

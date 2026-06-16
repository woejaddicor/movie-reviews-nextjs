import { graphql, buildSchema, GraphQLSchema } from "graphql";
import { verifyAuthSession } from "./auth";
import {
  getAllReviews,
  getReviewWithUser,
  getReviewsByUserId,
  searchReviews,
  createReview,
  updateReview,
  deleteReview,
} from "./reviews";
import {
  getCommentsByReviewId,
  createComment,
  deleteComment,
} from "./comments";
import { getUserById, updateUserProfile } from "./user";

export const schema: GraphQLSchema = buildSchema(`
  type User {
    id: Int!
    email: String!
    name: String
    bio: String
    avatar: String
    created_at: Int!
  }

  type MovieReview {
    id: Int!
    user_id: Int!
    movie_title: String!
    movie_year: Int
    movie_poster: String
    rating: Int!
    review_text: String!
    created_at: Int!
    updated_at: Int!
  }

  type MovieReviewWithUser {
    id: Int!
    user_id: Int!
    movie_title: String!
    movie_year: Int
    movie_poster: String
    rating: Int!
    review_text: String!
    created_at: Int!
    updated_at: Int!
    user_name: String
    user_email: String!
    user_avatar: String
  }

  type Comment {
    id: Int!
    review_id: Int!
    user_id: Int!
    comment_text: String!
    created_at: Int!
    user_name: String
    user_email: String!
    user_avatar: String
  }

  type Query {
    review(id: Int!): MovieReviewWithUser
    reviews(limit: Int, offset: Int): [MovieReviewWithUser!]!
    reviewsByUser(userId: Int!): [MovieReviewWithUser!]!
    searchReviews(query: String!): [MovieReviewWithUser!]!
    commentsByReview(reviewId: Int!): [Comment!]!
    me: User
  }

  input CreateReviewInput {
    movie_title: String!
    movie_year: Int
    movie_poster: String
    rating: Int!
    review_text: String!
  }

  input UpdateReviewInput {
    id: Int!
    movie_title: String
    movie_year: Int
    movie_poster: String
    rating: Int
    review_text: String
  }

  input CreateCommentInput {
    reviewId: Int!
    commentText: String!
  }

  input UpdateProfileInput {
    name: String!
    bio: String
  }

  type Mutation {
    createReview(input: CreateReviewInput!): MovieReviewWithUser!
    updateReview(input: UpdateReviewInput!): Boolean!
    deleteReview(id: Int!): Boolean!
    createComment(input: CreateCommentInput!): Comment!
    deleteComment(id: Int!): Boolean!
    updateProfile(input: UpdateProfileInput!): Boolean!
  }
`);

export const rootValue = {
  review: ({ id }: { id: number }) => getReviewWithUser(id),
  reviews: ({ limit, offset }: { limit?: number; offset?: number }) =>
    getAllReviews(limit ?? 50, offset ?? 0),
  reviewsByUser: ({ userId }: { userId: number }) => getReviewsByUserId(userId),
  searchReviews: ({ query }: { query: string }) => searchReviews(query),
  commentsByReview: ({ reviewId }: { reviewId: number }) =>
    getCommentsByReviewId(reviewId),
  me: async () => {
    const session = await verifyAuthSession();
    if (!session.user) return null;
    return getUserById(parseInt(session.user.id));
  },
  createReview: async ({ input }: any) => {
    const session = await verifyAuthSession();
    if (!session.user) throw new Error("Unauthorized");
    const review = createReview(
      parseInt(session.user.id),
      input.movie_title,
      input.rating,
      input.review_text,
      input.movie_year,
      input.movie_poster,
    );
    return getReviewWithUser(review.id)!;
  },
  updateReview: async ({ input }: any) => {
    const session = await verifyAuthSession();
    if (!session.user) throw new Error("Unauthorized");
    return updateReview(parseInt(input.id), parseInt(session.user.id), {
      movie_title: input.movie_title,
      movie_year: input.movie_year,
      movie_poster: input.movie_poster,
      rating: input.rating,
      review_text: input.review_text,
    });
  },
  deleteReview: async ({ id }: { id: number }) => {
    const session = await verifyAuthSession();
    if (!session.user) throw new Error("Unauthorized");
    return deleteReview(id, parseInt(session.user.id));
  },
  createComment: async ({ input }: any) => {
    const session = await verifyAuthSession();
    if (!session.user) throw new Error("Unauthorized");
    return createComment(
      input.reviewId,
      parseInt(session.user.id),
      input.commentText,
    );
  },
  deleteComment: async ({ id }: { id: number }) => {
    const session = await verifyAuthSession();
    if (!session.user) throw new Error("Unauthorized");
    return deleteComment(id, parseInt(session.user.id));
  },
  updateProfile: async ({ input }: any) => {
    const session = await verifyAuthSession();
    if (!session.user) throw new Error("Unauthorized");
    return updateUserProfile(parseInt(session.user.id), {
      name: input.name,
      bio: input.bio ?? "",
    });
  },
};

export async function serverGraphql<T = any>(query: string, variables?: Record<string, any>) {
  const result = await graphql({
    schema,
    source: query,
    rootValue,
    variableValues: variables,
  });

  if (result.errors && result.errors.length > 0) {
    const message = result.errors[0].message || "GraphQL execution failed";
    throw new Error(message);
  }

  // Normalize result.data to plain serializable objects for passing to Client Components
  function normalize(value: any): any {
    if (value === null || value === undefined) return value;
    const t = typeof value;
    if (t === "bigint") return Number(value);
    if (t === "function") return undefined;
    if (Buffer && Buffer.isBuffer && Buffer.isBuffer(value)) return value.toString();
    if (Array.isArray(value)) return value.map(normalize);
    if (t === "object") {
      const out: Record<string, any> = {};
      for (const key of Object.keys(value)) {
        out[key] = normalize((value as any)[key]);
      }
      return out;
    }
    return value;
  }

  return normalize(result.data) as T;
}

export async function clientGraphql<T = any>(query: string, variables?: Record<string, any>) {
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
  return json.data as T;
}

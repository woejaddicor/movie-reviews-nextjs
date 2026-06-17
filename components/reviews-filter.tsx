"use client";

import { MovieReviewWithUser } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";
import FilterTabs from "@/components/reviews/filter-tabs";
import ReviewList from "@/components/reviews/review-list";
import EmptyState from "@/components/ui/empty-state";

interface ReviewsFilterProps {
  allReviews: MovieReviewWithUser[];
  myReviews: MovieReviewWithUser[];
  currentUserId?: string;
}

export default function ReviewsFilter({
  allReviews,
  myReviews,
  currentUserId,
}: ReviewsFilterProps) {
  const [filter, setFilter] = useState<"all" | "mine">("all");

  const reviews = filter === "mine" ? myReviews : allReviews;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <h1 className="text-4xl font-bold [html[data-theme='light']_&]:text-gray-900">
          Movie Reviews
        </h1>
        <div className="flex gap-4">
          <FilterTabs
            activeFilter={filter}
            allCount={allReviews.length}
            mineCount={myReviews.length}
            onFilterChange={setFilter}
          />
          <Link href="/community/new" className="btn-primary">
            Write Review
          </Link>
        </div>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          title={filter === "mine" ? "No reviews yet" : "No reviews"}
          message={
            filter === "mine"
              ? "You haven't written any reviews yet."
              : "No reviews yet. Be the first to write one!"
          }
          actionLabel={
            filter === "mine" ? "Write Your First Review" : "Write First Review"
          }
          actionHref="/community/new"
        />
      ) : (
        <ReviewList reviews={reviews} currentUserId={currentUserId} />
      )}
    </div>
  );
}

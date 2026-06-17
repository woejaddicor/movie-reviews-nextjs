"use client";

import { useState } from "react";
import { MovieReviewWithUser } from "@/lib/types";
import EmptyState from "@/components/ui/empty-state";
import ReviewList from "@/components/reviews/review-list";

interface ProfileReviewTabsProps {
  reviewedReviews: MovieReviewWithUser[];
  ratedReviews: MovieReviewWithUser[];
}

export default function ProfileReviewTabs({
  reviewedReviews,
  ratedReviews,
}: ProfileReviewTabsProps) {
  const [activeTab, setActiveTab] = useState<"reviewed" | "rated">("reviewed");
  const activeReviews = activeTab === "reviewed" ? reviewedReviews : ratedReviews;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("reviewed")}
          className={`px-4 py-2 rounded-full font-semibold transition-all border ${
            activeTab === "reviewed"
              ? "bg-green-600 text-white border-green-600"
              : "bg-transparent text-white/70 border-white/20 [html[data-theme='light']_&]:text-gray-700 [html[data-theme='light']_&]:border-gray-200 hover:bg-white/10 [html[data-theme='light']_&]:hover:bg-gray-100"
          }`}
        >
          Films reviewed ({reviewedReviews.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("rated")}
          className={`px-4 py-2 rounded-full font-semibold transition-all border ${
            activeTab === "rated"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-transparent text-white/70 border-white/20 [html[data-theme='light']_&]:text-gray-700 [html[data-theme='light']_&]:border-gray-200 hover:bg-white/10 [html[data-theme='light']_&]:hover:bg-gray-100"
          }`}
        >
          Films rated ({ratedReviews.length})
        </button>
      </div>

      {activeReviews.length === 0 ? (
        <EmptyState
          title={
            activeTab === "reviewed"
              ? "No films reviewed yet"
              : "No films rated yet"
          }
          message={
            activeTab === "reviewed"
              ? "This user hasn't reviewed any films yet."
              : "This user hasn't rated any films yet."
          }
          actionLabel="Browse Community"
          actionHref="/community"
        />
      ) : (
        <ReviewList reviews={activeReviews} />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import RatingBadge from "@/components/ui/rating-badge";
import { upsertUserRating } from "@/components/graphql-client";

interface UserRatingPanelProps {
  reviewId: number;
  initialRating?: number | null;
  initialText?: string | null;
}

export default function UserRatingPanel({
  reviewId,
  initialRating,
  initialText,
}: UserRatingPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(initialRating ?? 1);
  const [text, setText] = useState(initialText ?? "");
  const [savedRating, setSavedRating] = useState<number | null>(initialRating ?? null);
  const [savedText, setSavedText] = useState<string | null>(initialText ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasSavedRating = savedRating !== null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (rating < 1 || rating > 10) {
      setError("Rating must be between 1 and 10.");
      return;
    }

    if (!text.trim()) {
      setError("A short description is required to save your rating.");
      return;
    }

    try {
      setIsSaving(true);
      const saved = await upsertUserRating(reviewId, rating, text.trim());
      setSavedRating(saved.rating);
      setSavedText(saved.rating_text ?? null);
      setIsEditing(false);
    } catch (err) {
      setError((err as Error).message || "Unable to save your rating.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-black/40 [html[data-theme='light']_&]:bg-white border border-white/10 [html[data-theme='light']_&]:border-gray-200 rounded-2xl p-6 mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-green-400 [html[data-theme='light']_&]:text-green-600 font-semibold mb-2">
            Your personal rating
          </p>
          {hasSavedRating ? (
            <div className="flex items-center gap-3">
              <RatingBadge rating={savedRating} size="md" />
              <span className="text-white/80 [html[data-theme='light']_&]:text-gray-700">
                {savedText ? savedText : "No description added yet."}
              </span>
            </div>
          ) : (
            <p className="text-white/70 [html[data-theme='light']_&]:text-gray-600">
              Save your own score and note for this movie.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsEditing((current) => !current)}
          className="btn-primary-sm self-start"
        >
          {hasSavedRating ? (isEditing ? "Cancel" : "Edit Rating") : "Add Rating"}
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500 text-red-500 px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold [html[data-theme='light']_&]:text-gray-700 text-white/80">
                Rating
              </span>
              <input
                type="number"
                min={1}
                max={10}
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                disabled={isSaving}
                className="mt-2 input w-full"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold [html[data-theme='light']_&]:text-gray-700 text-white/80">
                Description
              </span>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                disabled={isSaving}
                rows={4}
                className="textarea mt-2 w-full"
                placeholder="Your personal view on this movie..."
                required
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={isSaving} className="btn-primary-sm">
              {isSaving ? "Saving..." : "Save Rating"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

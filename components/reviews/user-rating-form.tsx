"use client";

import { useState } from "react";
import { upsertUserRating } from "@/components/graphql-client";

interface UserRatingFormProps {
  reviewId: number;
  initialRating?: number | null;
  initialText?: string | null;
  onSaved: (rating: number, text: string | null) => void;
}

export default function UserRatingForm({
  reviewId,
  initialRating,
  initialText,
  onSaved,
}: UserRatingFormProps) {
  const [rating, setRating] = useState(initialRating ?? 1);
  const [text, setText] = useState(initialText ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (rating < 1 || rating > 10) {
      setError("Rating must be between 1 and 10.");
      return;
    }

    try {
      setIsSaving(true);
      const saved = await upsertUserRating(reviewId, rating, text.trim() || undefined);
      onSaved(saved.rating, saved.rating_text);
    } catch (err) {
      setError((err as Error).message || "Unable to save rating.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 [html[data-theme='light']_&]:bg-gray-100 border border-white/10 [html[data-theme='light']_&]:border-gray-200 rounded-2xl p-5 shadow-sm">
      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500 text-red-500 px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold [html[data-theme='light']_&]:text-gray-700 text-white/80">
            Your rating
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

        <label className="block">
          <span className="text-sm font-semibold [html[data-theme='light']_&]:text-gray-700 text-white/80">
            Summary (optional)
          </span>
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={isSaving}
            placeholder="Add a short note..."
            className="mt-2 input w-full"
          />
        </label>
      </div>

      <button type="submit" disabled={isSaving} className="btn-primary-sm mt-4">
        {isSaving ? "Saving..." : "Save Your Rating"}
      </button>
    </form>
  );
}

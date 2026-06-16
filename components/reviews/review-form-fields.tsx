import React from "react";

interface ReviewFormFieldsProps {
  review?: {
    movie_title: string;
    movie_year?: number;
    rating: number;
    movie_poster?: string;
    review_text: string;
  };
  isSubmitting: boolean;
  router: {
    back: () => void;
  };
}

export default function ReviewFormFields({
  review,
  isSubmitting,
  router,
}: ReviewFormFieldsProps) {
  return (
    <>
      <div>
        <label
          htmlFor="movie_title"
          className="block text-sm font-semibold mb-2"
        >
          Movie Title *
        </label>
        <input
          type="text"
          id="movie_title"
          name="movie_title"
          defaultValue={review?.movie_title}
          required
          className="input"
          placeholder="Enter movie title"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="movie_year"
            className="block text-sm font-semibold mb-2"
          >
            Release Year
          </label>
          <input
            type="number"
            id="movie_year"
            name="movie_year"
            defaultValue={review?.movie_year || ""}
            min="1900"
            max={new Date().getFullYear() + 5}
            className="input"
            placeholder="2024"
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-semibold mb-2">
            Rating (1-10) *
          </label>
          <input
            type="number"
            id="rating"
            name="rating"
            defaultValue={review?.rating}
            required
            min="1"
            max="10"
            className="input"
            placeholder="8"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="movie_poster"
          className="block text-sm font-semibold mb-2"
        >
          Poster URL
        </label>
        <input
          type="url"
          id="movie_poster"
          name="movie_poster"
          defaultValue={review?.movie_poster || ""}
          className="input"
          placeholder="https://example.com/poster.jpg"
        />
        <p className="text-sm text-white/50 mt-1">
          Optional: Add a URL to the movie poster image
        </p>
      </div>

      <div>
        <label
          htmlFor="review_text"
          className="block text-sm font-semibold mb-2"
        >
          Your Review *
        </label>
        <textarea
          id="review_text"
          name="review_text"
          defaultValue={review?.review_text}
          required
          rows={10}
          className="textarea"
          placeholder="Share your thoughts about the movie..."
        />
        <p className="text-sm text-white/50 mt-1">Minimum 10 characters</p>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary-lg"
        >
          {isSubmitting
            ? "Saving..."
            : review
              ? "Update Review"
              : "Publish Review"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </>
  );
}

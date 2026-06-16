"use client";

interface CommentFormProps {
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
  error: string | null;
}

export default function CommentForm({
  onSubmit,
  isSubmitting,
  error,
}: CommentFormProps) {
  return (
    <form id="comment-form" action={onSubmit} className="mb-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <textarea
        name="comment_text"
        required
        rows={3}
        disabled={isSubmitting}
        className="textarea mb-4"
        placeholder="Share your thoughts..."
      />

      <button type="submit" disabled={isSubmitting} className="btn-primary-sm">
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}

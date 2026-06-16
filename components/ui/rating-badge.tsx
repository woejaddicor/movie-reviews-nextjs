interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

export default function RatingBadge({ rating, size = "md" }: RatingBadgeProps) {
  const sizeClasses = {
    sm: "text-sm px-3 py-1",
    md: "text-base px-4 py-2",
    lg: "text-3xl px-6 py-3",
  }[size];

  const getSentimentClass = (rating: number): string => {
    if (rating >= 7) {
      return "badge-rating-positive";
    } else if (rating >= 4) {
      return "badge-rating-medium";
    } else {
      return "badge-rating-negative";
    }
  };

  return (
    <div className={`${getSentimentClass(rating)} ${sizeClasses} rounded-xl`}>
      {rating}/10
    </div>
  );
}

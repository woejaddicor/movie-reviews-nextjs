import Link from "next/link";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel: string;
  actionHref: string;
}

export default function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="bg-black/20 [html[data-theme='light']_&]:bg-gray-50 border border-white/10 [html[data-theme='light']_&]:border-gray-200 rounded-2xl p-12 text-center [html[data-theme='light']_&]:shadow-sm">
      <p className="text-white/70 [html[data-theme='light']_&]:text-gray-600 text-lg mb-4">
        {message}
      </p>
      <Link href={actionHref} className="btn-primary inline-block">
        {actionLabel}
      </Link>
    </div>
  );
}

export function formatDateTimestamp(timestamp: number | null | undefined): string {
  if (!timestamp) return "";
  const d = new Date(timestamp * 1000);
  // Use an explicit, deterministic format to avoid server/client locale mismatches
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

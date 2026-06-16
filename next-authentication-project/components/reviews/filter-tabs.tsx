"use client";

interface FilterTabsProps {
  activeFilter: "all" | "mine";
  allCount: number;
  mineCount: number;
  onFilterChange: (filter: "all" | "mine") => void;
}

export default function FilterTabs({
  activeFilter,
  allCount,
  mineCount,
  onFilterChange,
}: FilterTabsProps) {
  return (
    <div className="flex bg-black/40 [html[data-theme='light']_&]:bg-white border border-white/10 [html[data-theme='light']_&]:border-gray-300 rounded-lg p-1 [html[data-theme='light']_&]:shadow-sm">
      <button
        onClick={() => onFilterChange("all")}
        className={`px-4 py-2 rounded-md font-semibold transition-all ${
          activeFilter === "all"
            ? "bg-green-600 text-white [html[data-theme='light']_&]:shadow-sm"
            : "text-white/70 [html[data-theme='light']_&]:text-gray-700 hover:text-white [html[data-theme='light']_&]:hover:text-gray-900 hover:bg-white/5 [html[data-theme='light']_&]:hover:bg-gray-100"
        }`}
      >
        All Reviews ({allCount})
      </button>
      <button
        onClick={() => onFilterChange("mine")}
        className={`px-4 py-2 rounded-md font-semibold transition-all ${
          activeFilter === "mine"
            ? "bg-green-600 text-white [html[data-theme='light']_&]:shadow-sm"
            : "text-white/70 [html[data-theme='light']_&]:text-gray-700 hover:text-white [html[data-theme='light']_&]:hover:text-gray-900 hover:bg-white/5 [html[data-theme='light']_&]:hover:bg-gray-100"
        }`}
      >
        Your Reviews ({mineCount})
      </button>
    </div>
  );
}

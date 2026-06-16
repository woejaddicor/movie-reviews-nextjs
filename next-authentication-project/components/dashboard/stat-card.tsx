interface StatCardProps {
  label: string;
  value: string | number;
  variant?: "green" | "emerald" | "lime";
}

export default function StatCard({
  label,
  value,
  variant = "green",
}: StatCardProps) {
  const variantClasses = {
    green: "from-green-600 to-green-700 border-green-500/20",
    emerald: "from-emerald-600 to-emerald-700 border-emerald-500/20",
    lime: "from-lime-600 to-lime-700 border-lime-500/20",
  }[variant];

  return (
    <div
      className={`bg-gradient-to-br ${variantClasses} rounded-2xl p-6 border`}
    >
      <p className="text-black/80 text-sm mb-2 font-semibold">{label}</p>
      <p className="text-4xl font-bold text-black">{value}</p>
    </div>
  );
}

interface MoviePosterProps {
  src: string;
  alt: string;
  variant?: "card" | "hero";
  className?: string;
}

export default function MoviePoster({
  src,
  alt,
  variant = "card",
  className = "",
}: MoviePosterProps) {
  if (variant === "hero") {
    return (
      <div className="w-full aspect-[21/9] overflow-hidden bg-gradient-to-b from-black/50 to-transparent relative">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover opacity-40 blur-sm"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={src} alt={alt} className="h-full object-contain" />
        </div>
      </div>
    );
  }

  return (
    <div className={`aspect-[2/3] overflow-hidden bg-black/20 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
}

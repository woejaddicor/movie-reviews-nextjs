interface UserAvatarProps {
  name?: string | null;
  email: string;
  size?: "sm" | "md" | "lg";
}

export default function UserAvatar({
  name,
  email,
  size = "md",
}: UserAvatarProps) {
  const initial = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase();

  const sizeClass = {
    sm: "avatar avatar-sm",
    md: "avatar avatar-md",
    lg: "avatar avatar-lg",
  }[size];

  return <div className={sizeClass}>{initial}</div>;
}

import { verifyAuthSession } from "@/lib/auth";
import { serverGraphql } from "@/lib/graphql";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile-form";
import { formatDateTimestamp } from "@/lib/format";

export default async function ProfilePage() {
  const result = await verifyAuthSession();

  if (!result.user) {
    return redirect("/");
  }

  const data = await serverGraphql<{ me: {
    id: number;
    email: string;
    name: string | null;
    bio: string | null;
    avatar: string | null;
    created_at: number;
  } | null }>(
    `query Me {
      me {
        id
        email
        name
        bio
        avatar
        created_at
      }
    }`,
  );

  if (!data.me) {
    return redirect("/");
  }

  const user = data.me;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="bg-white/5 rounded-2xl p-8 shadow-md">
        <div className="flex items-center gap-8 mb-8 pb-8 border-b border-white/10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl mb-2">{user.name || "No name set"}</h2>
            <p className="text-white/70 mb-1">{user.email}</p>
            <p className="text-white/50 text-sm">
              Member since {formatDateTimestamp(user.created_at)}
            </p>
          </div>
        </div>

        <ProfileForm user={user} />
      </div>
    </div>
  );
}

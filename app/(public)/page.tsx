import AuthForm from "../../components/auth-form";
import { verifyAuthSession } from "../../lib/auth";
import { redirect } from "next/navigation";

interface LoginPageProps {
  searchParams: {
    mode?: "login" | "signup";
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const result = await verifyAuthSession();
  if (result.user) {
    return redirect("/dashboard");
  }

  const formMode = searchParams.mode || "login";
  return <AuthForm mode={formMode} />;
}

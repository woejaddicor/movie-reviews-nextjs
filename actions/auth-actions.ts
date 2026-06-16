"use server";
import { hashUserPassword, verifyPassword } from "../lib/hash";
import { createUser, getUserByEmail } from "../lib/user";
import { redirect } from "next/navigation";
import { createAuthSession, destroySession } from "../lib/auth";

interface AuthFormState {
  errors?: {
    email?: string;
    password?: string;
  };
}

export async function signup(
  prevFormState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  let errors: { email?: string; password?: string } = {};

  if (!email || !email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password || password.length < 8) {
    errors.password = "Please enter a valid password (at least 8 characters).";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const hashedPassword = hashUserPassword(password);
  try {
    const id = createUser(email, hashedPassword);
    await createAuthSession(id.toString());
    redirect("/dashboard");
  } catch (error: any) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return { errors: { email: "This email address is already registered." } };
    }
    throw error;
  }
}

export async function login(
  prevState: AuthFormState,
  form: FormData,
): Promise<AuthFormState> {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const existingUser = getUserByEmail(email);
  if (!existingUser) {
    return { errors: { email: "No account found with this email address." } };
  }

  const existingPassword = verifyPassword(existingUser.password, password);
  if (!existingPassword) {
    return { errors: { password: "The password is incorrect." } };
  }

  await createAuthSession(existingUser.id.toString());
  redirect("/dashboard");
}

export async function auth(
  mode: string,
  prevFormState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (mode === "login") {
    return login(prevFormState, formData);
  }
  return signup(prevFormState, formData);
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/");
}

"use server";

import { verifyAuthSession } from "@/lib/auth";
import { updateUserProfile } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData) {
  const result = await verifyAuthSession();

  if (!result.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { name, bio } = formData;

  // Validation
  if (!name || name.trim().length === 0) {
    return { success: false, error: "Name is required" };
  }

  if (name.trim().length > 100) {
    return { success: false, error: "Name must be less than 100 characters" };
  }

  if (bio && bio.length > 500) {
    return { success: false, error: "Bio must be less than 500 characters" };
  }

  try {
    const updated = updateUserProfile(result.user.id, {
      name: name.trim(),
      bio: bio ? bio.trim() : "",
    });

    if (updated) {
      revalidatePath("/profile");
      return { success: true };
    } else {
      return { success: false, error: "Failed to update profile" };
    }
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      error: "An error occurred while updating profile",
    };
  }
}

"use client";

import { useState } from "react";
import { updateProfile } from "../actions/profile-actions";

interface User {
  name: string;
  email: string;
  bio: string;
}

export default function ProfileForm({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
  });

  interface EditEvent {
    preventDefault: () => void;
  }

  const handleEdit = (e: EditEvent): void => {
    e.preventDefault();
    setIsEditing(true);
  };

  interface CancelEvent {
    preventDefault: () => void;
  }

  const handleCancel = (e: CancelEvent): void => {
    e.preventDefault();
    setIsEditing(false);
    setFormData({ name: user.name || "", bio: user.bio || "" });
    setMessage(null);
  };

  interface SubmitEvent {
    preventDefault: () => void;
  }

  interface UpdateProfileResult {
    success: boolean;
    error?: string;
  }

  const handleSubmit = async (e: SubmitEvent): Promise<void> => {
    e.preventDefault();

    const result: UpdateProfileResult = await updateProfile(formData);

    if (result.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to update profile",
      });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div>
      {message && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/30 text-green-500"
              : "bg-red-500/10 border border-red-500/30 text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!isEditing}
            placeholder="Enter your name"
            className={`w-full px-3 py-2 rounded-lg border border-white/20 ${
              isEditing ? "bg-white/10" : "bg-white/5"
            } text-inherit text-base outline-none transition-all`}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/5 text-white/50 text-base cursor-not-allowed"
          />
          <p className="text-sm text-white/50 mt-2">Email cannot be changed</p>
        </div>

        <div className="mb-8">
          <label className="block mb-2 font-medium">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!isEditing}
            placeholder="Tell us about yourself"
            rows={4}
            className={`w-full px-3 py-2 rounded-lg border border-white/20 ${
              isEditing ? "bg-white/10" : "bg-white/5"
            } text-inherit text-base outline-none transition-all resize-y font-inherit`}
          />
        </div>

        <div className="flex gap-4">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleEdit}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white border-none rounded-lg text-base font-medium cursor-pointer transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white border-none rounded-lg text-base font-medium cursor-pointer transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-white/10 hover:bg-white/15 text-inherit border border-white/20 rounded-lg text-base font-medium cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

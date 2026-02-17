"use client";

import { useState, useTransition } from "react";
import { addBookmark } from "@/app/dashboard/actions";

export default function BookmarkForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setError(null);

    const url = formData.get("url") as string;

    try {
      new URL(url);
    } catch {
      setError("Invalid URL format");
      return;
    }

    startTransition(async () => {
      try {
        await addBookmark(formData);
      } catch (err: any) {
        setError(err.message);
      }
    });
  };

  return (
    <form action={handleSubmit} className="flex gap-2 mb-6">
      <input
        name="title"
        placeholder="Bookmark title"
        className="border p-2 rounded w-1/3"
        required
      />
      <input
        name="url"
        placeholder="https://example.com"
        className="border p-2 rounded flex-1"
        required
      />
      <button
        disabled={pending}
        className="bg-black text-white px-4 rounded disabled:opacity-50"
      >
        {pending ? "Adding..." : "Add"}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2 absolute">
          {error}
        </p>
      )}
    </form>
  );
}

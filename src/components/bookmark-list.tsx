"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { deleteBookmark } from "@/app/dashboard/actions";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
  user_id: string;
};

export default function BookmarkList({
  initialBookmarks,
  userId,
}: {
  initialBookmarks: Bookmark[];
  userId: string;
}) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);

useEffect(() => {
  const supabase = createClient();

  console.log("User ID for realtime:", userId);

  const channel = supabase
    .channel("bookmarks-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log("Realtime payload:", payload);

        if (payload.eventType === "INSERT") {
          setBookmarks((prev) => [
            payload.new as Bookmark,
            ...prev,
          ]);
        }

        if (payload.eventType === "DELETE") {
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe((status) => {
      console.log("Realtime status:", status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, [userId]);


  return (
    <div className="space-y-3">
      {bookmarks.length === 0 && (
        <div className="text-center py-12 border rounded bg-white">
          <p className="text-gray-500">No bookmarks yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Add your first bookmark above.
          </p>
        </div>
      )}

      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="flex justify-between items-center bg-white shadow-sm hover:shadow-md transition p-4 rounded-lg"
        >
          <div>
            <p className="font-semibold">{bookmark.title}</p>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm hover:underline break-all"
            >
              {bookmark.url}
            </a>
          </div>

          <form action={deleteBookmark.bind(null, bookmark.id)}>
            <button
              type="submit"
              className="text-red-500 hover:text-red-700 transition"
            >
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}

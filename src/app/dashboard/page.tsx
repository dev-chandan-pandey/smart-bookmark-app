import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { addBookmark, deleteBookmark } from "./actions";
import BookmarkList from "@/components/bookmark-list";
import BookmarkForm from "@/components/bookmark-form";
import LogoutButton from "@/components/logout-button";

export default async function DashboardPage() {
    const supabase = await createClient();


    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto p-8">

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">
                        Smart Bookmark
                    </h1>
                    <LogoutButton />
                </div>


                {/* Add Bookmark Form */}
                <BookmarkForm />


                {/* Bookmark List */}
                <BookmarkList
                    initialBookmarks={bookmarks || []}
                    userId={user.id}
                />
            </div>
        </div>
    );
}

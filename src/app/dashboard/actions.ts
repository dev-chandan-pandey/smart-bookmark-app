"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addBookmark(formData: FormData) {
  const supabase = await createClient();


  const title = formData.get("title") as string;
  const url = formData.get("url") as string;

  if (!title || !url) {
    throw new Error("Missing fields");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.from("bookmarks").insert({
    title,
    url,
    user_id: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}

export async function deleteBookmark(id: string) {
 const supabase = await createClient();


  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}

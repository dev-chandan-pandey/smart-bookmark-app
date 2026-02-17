"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    setLoading(false);
  };

  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80 text-center">
        <h1 className="text-2xl font-bold mb-6">Smart Bookmark</h1>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? "Redirecting..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}

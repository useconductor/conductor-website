"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";
import { setUserSession } from "@/lib/cloud-api";

export const dynamic = 'force-dynamic';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setError("Supabase not configured");
        return;
      }

      // Get session - this will automatically parse the URL hash from OAuth redirect
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Auth error:', authError);
        setError(authError.message);
        return;
      }

      if (session?.user) {
        // Set user session
        setUserSession(session.user.id, session.user.email || '');
        // Small delay to ensure localStorage is persisted
        await new Promise(r => setTimeout(r, 100));
        router.replace("/dashboard");
        return;
      }

      // Try getting user directly
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (user) {
        setUserSession(user.id, user.email || '');
        router.replace("/dashboard");
        return;
      }

      // Still no session - check if there's an error in URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get('error')) {
        setError(hashParams.get('error_description') || 'Authentication failed');
        return;
      }

      // Last resort - demo mode fallback (for testing)
      setUserSession('demo-user', 'demo@example.com');
      router.replace("/dashboard");
    };

    // Delay to ensure browser has parsed the URL fragment
    const timer = setTimeout(handleCallback, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center p-8 max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <a href="/login" className="text-[#555] hover:text-white">
            ← Back to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
        <p className="text-[#555] font-mono">Signing you in...</p>
      </div>
    </div>
  );
}
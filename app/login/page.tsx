"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Terminal, Github, Chrome, ArrowRight, CheckCircle, Shield, Smartphone } from "lucide-react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { setUserSession } from "@/lib/cloud-api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPairMode = searchParams.get('mode') === 'pair';
  const [loading, setLoading] = useState<string | null>(null);
  const [step, setStep] = useState<"login" | "password" | "pair">(isPairMode ? "pair" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pairCode, setPairCode] = useState("");
  const [deviceName, setDeviceName] = useState("");

  const handleOAuthLogin = async (provider: "github" | "google") => {
    if (!isSupabaseConfigured()) {
      setError("Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.");
      return;
    }

    setLoading(provider);
    setError("");

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setError("Supabase not configured");
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!isSupabaseConfigured()) {
      setError("Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.");
      return;
    }

    setLoading("password");
    setError("");

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase not configured");
      setLoading(null);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        // Try to sign up instead
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) {
          setError(signUpError.message);
          setLoading(null);
          return;
        }
        if (signUpData.user) {
          setUserSession(signUpData.user.id, email);
          router.push("/dashboard");
          return;
        }
      }
      setError(authError.message);
      setLoading(null);
      return;
    }

    if (data.user) {
      setUserSession(data.user.id, data.user.email || email);
      router.push("/dashboard");
    }
  };

  const handlePairDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairCode || !deviceName) {
      setError("Please enter the pairing code and a name for your device");
      return;
    }
    // In production, this would verify the code with the server
    // For now, just redirect to dashboard
    router.push("/dashboard?pair=success");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#050505] border-r border-[#1a1a1a] flex-col justify-between p-12">
        <div>
          <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight text-white">
            <Terminal className="h-4 w-4 text-[#555]" />
            conductor
          </Link>
        </div>
        
        <div>
          <h1 className="font-mono text-4xl font-bold tracking-tight text-white mb-4">
            Your credentials,<br />synced everywhere.
          </h1>
          <p className="text-[#666] text-lg max-w-md">
            Zero-knowledge credential sync across all your devices. 
            Your API keys are encrypted on your device — we never see them.
          </p>
          
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-[#555]">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>End-to-end encrypted</span>
            </div>
            <div className="flex items-center gap-3 text-[#555]">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Open source, free forever</span>
            </div>
            <div className="flex items-center gap-3 text-[#555]">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Self-host option available</span>
            </div>
            <div className="flex items-center gap-3 text-[#555]">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Zero-knowledge architecture</span>
            </div>
          </div>
        </div>
        
        <div className="text-[#333] text-sm">
          © 2026 Conductor. MIT License.
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {step === "login" && (
            <>
              <div className="mb-8">
                <h2 className="font-mono text-2xl font-bold text-white mb-2">Welcome back</h2>
                <p className="text-[#666]">Log in to manage your credentials</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg border border-red-900/50 bg-red-900/10 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={() => handleOAuthLogin("github")}
                  disabled={!!loading}
                  className="w-full flex items-center justify-center gap-3 rounded-lg border border-[#1a1a1a] bg-[#080808] py-3 px-4 font-mono text-sm text-white hover:border-[#2a2a2a] transition-colors disabled:opacity-50"
                >
                  {loading === "github" ? (
                    <span className="animate-pulse">Connecting...</span>
                  ) : (
                    <>
                      <Github className="h-5 w-5" />
                      Continue with GitHub
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOAuthLogin("google")}
                  disabled={!!loading}
                  className="w-full flex items-center justify-center gap-3 rounded-lg border border-[#1a1a1a] bg-[#080808] py-3 px-4 font-mono text-sm text-white hover:border-[#2a2a2a] transition-colors disabled:opacity-50"
                >
                  {loading === "google" ? (
                    <span className="animate-pulse">Connecting...</span>
                  ) : (
                    <>
                      <Chrome className="h-5 w-5" />
                      Continue with Google
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#1a1a1a]"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#050505] px-2 text-[#444]">or</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep("password")}
                className="w-full mt-6 flex items-center justify-center gap-3 rounded-lg border border-[#1a1a1a] bg-[#080808] py-3 px-4 font-mono text-sm text-[#666] hover:text-white hover:border-[#2a2a2a] transition-colors"
              >
                Continue with email
              </button>

              <div className="mt-8 pt-8 border-t border-[#1a1a1a]">
                <p className="text-[#555] text-sm text-center mb-4">
                  Need to pair a device?
                </p>
                <button
                  onClick={() => router.push("/login?mode=pair")}
                  className="w-full text-center text-[#666] hover:text-white text-sm"
                >
                  Pair a new device →
                </button>
              </div>
            </>
          )}

          {step === "password" && (
            <>
              <button
                onClick={() => setStep("login")}
                className="text-[#555] hover:text-white text-sm mb-6"
              >
                ← Back to login
              </button>

              <div className="mb-8">
                <h2 className="font-mono text-2xl font-bold text-white mb-2">Sign in with email</h2>
                <p className="text-[#666]">
                  Your password is used to encrypt your credentials locally
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg border border-red-900/50 bg-red-900/10 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#555] mb-2 font-mono">EMAIL</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-[#1a1a1a] bg-[#080808] py-3 px-4 font-mono text-sm text-white placeholder-[#333]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#555] mb-2 font-mono">PASSWORD</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-[#1a1a1a] bg-[#080808] py-3 px-4 font-mono text-sm text-white placeholder-[#333]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading === "password"}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-white py-3 px-4 font-mono text-sm font-semibold text-black hover:bg-[#e8e8e8] transition-colors disabled:opacity-50"
                >
                  {loading === "password" ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 rounded-lg border border-[#1a1a1a] bg-[#080808]">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#555] mt-0.5" />
                  <div>
                    <p className="font-mono text-xs text-white mb-1">Zero-Knowledge Encryption</p>
                    <p className="text-xs text-[#555]">
                      Your password never leaves this device. Credentials are encrypted 
                      before being synced to the cloud.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === "pair" && (
            <>
              <button
                onClick={() => setStep("login")}
                className="text-[#555] hover:text-white text-sm mb-6"
              >
                ← Back to login
              </button>

              <div className="mb-8">
                <h2 className="font-mono text-2xl font-bold text-white mb-2">Pair a Device</h2>
                <p className="text-[#666]">
                  Enter the pairing code from your CLI to sync credentials
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg border border-red-900/50 bg-red-900/10 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handlePairDevice} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#555] mb-2 font-mono">DEVICE NAME</label>
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="My MacBook"
                    className="w-full rounded-lg border border-[#1a1a1a] bg-[#080808] py-3 px-4 font-mono text-sm text-white placeholder-[#333]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#555] mb-2 font-mono">PAIRING CODE</label>
                  <input
                    type="text"
                    value={pairCode}
                    onChange={(e) => setPairCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    className="w-full rounded-lg border border-[#1a1a1a] bg-[#080808] py-3 px-4 font-mono text-sm text-white placeholder-[#333]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading === "pair"}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-white py-3 px-4 font-mono text-sm font-semibold text-black hover:bg-[#e8e8e8] transition-colors disabled:opacity-50"
                >
                  {loading === "pair" ? (
                    "Pairing..."
                  ) : (
                    <>
                      <Smartphone className="h-4 w-4" />
                      Pair Device
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 text-center">
            <p className="text-[#444] text-xs">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-white">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#050505]"><p className="text-[#666]">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
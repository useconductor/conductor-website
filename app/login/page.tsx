"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, Github, Chrome, ArrowRight, CheckCircle } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [step, setStep] = useState<"login" | "pairing" | "code">("login");
  const [pairingCode, setPairingCode] = useState("");
  const [deviceName, setDeviceName] = useState("");

  const handleOAuthLogin = async (provider: "github" | "google") => {
    setLoading(provider);
    
    // In production, this would redirect to OAuth
    // For now, simulate the flow
    setTimeout(() => {
      setLoading(null);
      router.push("/dashboard");
    }, 1000);
  };

  const handleDevicePairing = async () => {
    if (!pairingCode || !deviceName) return;
    setLoading("pairing");
    
    // Simulate device pairing
    setTimeout(() => {
      setLoading(null);
      router.push("/dashboard");
    }, 1500);
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
          </div>
        </div>
        
        <div className="text-[#333] text-sm">
          © 2024 Conductor. MIT License.
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

              <div className="space-y-4">
                <button
                  onClick={() => handleOAuthLogin("github")}
                  disabled={loading === "github"}
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
                  disabled={loading === "google"}
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

              <div className="mt-8 pt-8 border-t border-[#1a1a1a]">
                <p className="text-[#555] text-sm text-center mb-4">
                  Need to pair a device?
                </p>
                <button
                  onClick={() => setStep("pairing")}
                  className="w-full text-center text-[#666] hover:text-white text-sm"
                >
                  Pair a new device →
                </button>
              </div>
            </>
          )}

          {step === "pairing" && (
            <>
              <button
                onClick={() => setStep("login")}
                className="text-[#555] hover:text-white text-sm mb-6"
              >
                ← Back to login
              </button>

              <div className="mb-8">
                <h2 className="font-mono text-2xl font-bold text-white mb-2">Pair Device</h2>
                <p className="text-[#666]">
                  Enter the code from your CLI to pair this device
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#555] mb-2 font-mono">DEVICE NAME</label>
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="My Laptop"
                    className="w-full rounded-lg border border-[#1a1a1a] bg-[#080808] py-3 px-4 font-mono text-sm text-white placeholder-[#333]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#555] mb-2 font-mono">PAIRING CODE</label>
                  <input
                    type="text"
                    value={pairingCode}
                    onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    className="w-full rounded-lg border border-[#1a1a1a] bg-[#080808] py-3 px-4 font-mono text-lg text-white placeholder-[#333] text-center tracking-widest"
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={handleDevicePairing}
                  disabled={!pairingCode || !deviceName || loading === "pairing"}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-white py-3 px-4 font-mono text-sm font-semibold text-black hover:bg-[#e8e8e8] transition-colors disabled:opacity-50"
                >
                  {loading === "pairing" ? (
                    "Pairing..."
                  ) : (
                    <>
                      Pair Device
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          <div className="mt-8 text-center">
            <p className="text-[#444] text-xs">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
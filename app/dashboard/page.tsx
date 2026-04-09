"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Terminal, Plus, Trash2, RefreshCw, CheckCircle, 
  XCircle, Shield, Key, Cloud, ChevronRight, Eye, EyeOff
} from "lucide-react";
import { 
  isLoggedIn, getCurrentUser, logout, getDevices, revokeDevice,
  getCredentials, storeCredential, deleteCredential, syncCredentials 
} from "@/lib/cloud-api";
import { 
  encryptWithPassword, decryptWithPassword, 
  generateDeviceId, storeCredentialLocal, getCredentialLocal 
} from "@/lib/encryption";

// Available plugins that can be configured
const PLUGINS = [
  { id: "github", name: "GitHub", icon: "🐙", description: "Issues, PRs, repos" },
  { id: "slack", name: "Slack", icon: "💼", description: "Messages, channels" },
  { id: "gmail", name: "Gmail", icon: "📧", description: "Email, calendar" },
  { id: "notion", name: "Notion", icon: "📝", description: "Pages, databases" },
  { id: "stripe", name: "Stripe", icon: "💳", description: "Payments" },
  { id: "linear", name: "Linear", icon: "📈", description: "Issues, projects" },
  { id: "vercel", name: "Vercel", icon: "▲", description: "Deployments" },
  { id: "jira", name: "Jira", icon: "📋", description: "Issues, sprints" },
  { id: "aws", name: "AWS", icon: "☁️", description: "EC2, S3, Lambda" },
  { id: "gcp", name: "GCP", icon: "🌐", description: "Compute, Storage" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [connectedPlugins, setConnectedPlugins] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [encryptionPassword, setEncryptionPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    // Load connected plugins from local storage
    const stored = localStorage.getItem('conductor_credentials');
    if (stored) {
      const creds = JSON.parse(stored);
      setConnectedPlugins(new Set(Object.keys(creds)));
    }
  }, [router]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncCredentials();
      if (result.success && result.data) {
        // Update connected plugins
        const plugins = new Set(result.data.credentials.map(c => c.plugin));
        setConnectedPlugins(plugins);
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleAddCredential = async () => {
    if (!selectedPlugin || !apiKey || !encryptionPassword) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Encrypt with password and store locally
      await storeCredentialLocal(selectedPlugin, apiKey, encryptionPassword);
      
      // Also store via API (for cloud sync)
      const { encryptedData, iv, salt } = await encryptWithPassword(apiKey, encryptionPassword);
      await storeCredential(selectedPlugin, encryptedData, iv, salt);
      
      setConnectedPlugins(prev => new Set(Array.from(prev).concat([selectedPlugin])));
      setShowAddModal(false);
      setSelectedPlugin(null);
      setApiKey("");
      setEncryptionPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCredential = async (pluginId: string) => {
    if (!confirm(`Remove ${PLUGINS.find(p => p.id === pluginId)?.name} credentials?`)) {
      return;
    }

    await deleteCredential(pluginId);
    setConnectedPlugins(prev => {
      const next = new Set(prev);
      next.delete(pluginId);
      return next;
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const user = getCurrentUser();
  const connectedCount = connectedPlugins.size;

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] bg-[#080808] px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight text-white">
              <Terminal className="h-4 w-4 text-[#555]" />
              conductor
            </Link>
            <span className="text-[#333]">/</span>
            <span className="text-[#666] font-mono text-sm">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 text-sm text-[#666] hover:text-white disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync'}
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-[#666] hover:text-white"
            >
              Logout
            </button>
            <div className="h-8 w-8 rounded-full bg-[#1a1a1a] flex items-center justify-center font-mono text-xs text-[#666]">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Status Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-6">
            <div className="flex items-center gap-3 mb-2">
              <Cloud className="h-5 w-5 text-[#555]" />
              <span className="text-[#555] text-sm">Cloud Status</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-white font-mono">Connected</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-6">
            <div className="flex items-center gap-3 mb-2">
              <Key className="h-5 w-5 text-[#555]" />
              <span className="text-[#555] text-sm">Credentials</span>
            </div>
            <div className="text-white font-mono text-2xl">
              {connectedCount} <span className="text-[#444] text-base">/ {PLUGINS.length}</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-[#555]" />
              <span className="text-[#555] text-sm">Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-white font-mono">AES-256-GCM</span>
            </div>
          </div>
        </div>

        {/* Plugin Credentials */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-lg font-semibold text-white">Plugin Credentials</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-sm text-[#666] hover:text-white"
            >
              <Plus className="h-4 w-4" />
              Add Credential
            </button>
          </div>
          <div className="rounded-lg border border-[#1a1a1a] overflow-hidden">
            {PLUGINS.map((plugin, i) => {
              const isConnected = connectedPlugins.has(plugin.id);
              return (
                <div 
                  key={plugin.id}
                  className={`flex items-center justify-between p-4 ${i < PLUGINS.length - 1 ? 'border-b border-[#1a1a1a]' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{plugin.icon}</span>
                    <div>
                      <p className="font-mono text-sm text-white">{plugin.name}</p>
                      <p className="text-xs text-[#444]">{plugin.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {isConnected ? (
                      <>
                        <span className="flex items-center gap-1 text-xs text-green-500">
                          <CheckCircle className="h-3 w-3" />
                          Connected
                        </span>
                        <button 
                          onClick={() => handleDeleteCredential(plugin.id)}
                          className="text-[#444] hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 text-xs text-[#444]">
                          <XCircle className="h-3 w-3" />
                          Not connected
                        </span>
                        <button 
                          onClick={() => { setSelectedPlugin(plugin.id); setShowAddModal(true); }}
                          className="text-xs text-[#666] hover:text-white"
                        >
                          Configure
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Security Notice */}
        <div className="mt-8 p-4 rounded-lg border border-[#1a1a1a] bg-[#080808]">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-[#555] mt-0.5" />
            <div>
              <p className="font-mono text-sm text-white mb-1">Zero-Knowledge Security</p>
              <p className="text-xs text-[#555]">
                Your credentials are encrypted on your device before being synced. 
                Conductor Cloud never sees your API keys in plaintext.
                Your encryption password is never stored - it stays on your device.
              </p>
            </div>
          </div>
        </div>

        {/* Add Credential Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="rounded-xl border border-[#1a1a1a] bg-[#080808] p-6 w-full max-w-md">
              <h3 className="font-mono text-lg font-semibold text-white mb-4">
                Add {selectedPlugin ? PLUGINS.find(p => p.id === selectedPlugin)?.name : 'Plugin'} Credential
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#555] mb-2 font-mono">PLUGIN</label>
                  <select
                    value={selectedPlugin || ""}
                    onChange={(e) => setSelectedPlugin(e.target.value)}
                    className="w-full rounded-lg border border-[#1a1a1a] bg-[#050505] py-3 px-4 font-mono text-sm text-white"
                  >
                    <option value="">Select a plugin...</option>
                    {PLUGINS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#555] mb-2 font-mono">API KEY</label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full rounded-lg border border-[#1a1a1a] bg-[#050505] py-3 px-4 font-mono text-sm text-white placeholder-[#333]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#555] mb-2 font-mono">
                    ENCRYPTION PASSWORD
                    <span className="text-[#444] font-normal ml-2">(never stored)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={encryptionPassword}
                      onChange={(e) => setEncryptionPassword(e.target.value)}
                      placeholder="Your secret password"
                      className="w-full rounded-lg border border-[#1a1a1a] bg-[#050505] py-3 px-4 pr-12 font-mono text-sm text-white placeholder-[#333]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#444] mt-1">
                    Used to encrypt your key locally. Required to decrypt later.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => { setShowAddModal(false); setSelectedPlugin(null); setApiKey(""); setEncryptionPassword(""); }}
                    className="flex-1 rounded-lg border border-[#1a1a1a] py-3 px-4 font-mono text-sm text-[#666] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCredential}
                    disabled={loading || !selectedPlugin || !apiKey || !encryptionPassword}
                    className="flex-1 rounded-lg bg-white py-3 px-4 font-mono text-sm font-semibold text-black hover:bg-[#e8e8e8] disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save & Encrypt'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
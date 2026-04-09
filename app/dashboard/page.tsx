"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Terminal, Plus, Trash2, RefreshCw, CheckCircle, 
  XCircle, Shield, Key, Cloud, ChevronRight
} from "lucide-react";

const PLUGINS = [
  { id: "github", name: "GitHub", icon: "🐙", connected: true },
  { id: "slack", name: "Slack", icon: "💼", connected: true },
  { id: "gmail", name: "Gmail", icon: "📧", connected: false },
  { id: "notion", name: "Notion", icon: "📝", connected: true },
  { id: "stripe", name: "Stripe", icon: "💳", connected: false },
  { id: "linear", name: "Linear", icon: "📈", connected: false },
  { id: "vercel", name: "Vercel", icon: "▲", connected: true },
  { id: "jira", name: "Jira", icon: "📋", connected: false },
];

const DEVICES = [
  { id: "1", name: "MacBook Pro", lastSeen: "2 minutes ago", status: "connected" },
  { id: "2", name: "Desktop PC", lastSeen: "1 hour ago", status: "connected" },
];

export default function DashboardPage() {
  const [credentials, setCredentials] = useState(PLUGINS);
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await new Promise(r => setTimeout(r, 2000));
    setSyncing(false);
  };

  const connectedCount = credentials.filter(p => p.connected).length;

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
              className="flex items-center gap-2 text-sm text-[#666] hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
            <div className="h-8 w-8 rounded-full bg-[#1a1a1a] flex items-center justify-center font-mono text-xs text-[#666]">
              A
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
              {connectedCount} <span className="text-[#444] text-base">/ {credentials.length}</span>
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

        {/* Connected Devices */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-lg font-semibold text-white">Connected Devices</h2>
          </div>
          <div className="rounded-lg border border-[#1a1a1a] overflow-hidden">
            {DEVICES.map((device, i) => (
              <div 
                key={device.id}
                className={`flex items-center justify-between p-4 ${i < DEVICES.length - 1 ? 'border-b border-[#1a1a1a]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#111] flex items-center justify-center">
                    <Terminal className="h-5 w-5 text-[#555]" />
                  </div>
                  <div>
                    <p className="font-mono text-sm text-white">{device.name}</p>
                    <p className="text-xs text-[#444]">Last seen {device.lastSeen}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-xs text-green-500">
                    <CheckCircle className="h-3 w-3" />
                    Connected
                  </span>
                  <button className="text-[#444] hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Plugin Credentials */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-lg font-semibold text-white">Plugin Credentials</h2>
            <button className="flex items-center gap-2 text-sm text-[#666] hover:text-white">
              <Plus className="h-4 w-4" />
              Add Credential
            </button>
          </div>
          <div className="rounded-lg border border-[#1a1a1a] overflow-hidden">
            {credentials.map((plugin, i) => (
              <div 
                key={plugin.id}
                className={`flex items-center justify-between p-4 ${i < credentials.length - 1 ? 'border-b border-[#1a1a1a]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{plugin.icon}</span>
                  <div>
                    <p className="font-mono text-sm text-white">{plugin.name}</p>
                    <p className="text-xs text-[#444]">
                      {plugin.connected ? 'Credentials synced' : 'Not configured'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {plugin.connected ? (
                    <>
                      <span className="flex items-center gap-1 text-xs text-green-500">
                        <CheckCircle className="h-3 w-3" />
                        Connected
                      </span>
                      <button className="text-[#444] hover:text-white">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 text-xs text-[#444]">
                        <XCircle className="h-3 w-3" />
                        Not connected
                      </span>
                      <button className="text-xs text-[#666] hover:text-white">
                        Configure
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
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
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
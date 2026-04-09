"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Terminal, Plus, Trash2, RefreshCw, CheckCircle, 
  XCircle, Shield, Key, Cloud, ChevronRight, Eye, EyeOff,
  Github, MessageSquare, Mail, FileText, CreditCard, TrendingUp,
  Rocket, ClipboardList, Cloud as CloudIcon, Globe, 
  Smartphone, Download, Upload, Settings, LogOut, Copy
} from "lucide-react";
import { 
  isLoggedIn, getCurrentUser, logout, 
  getCredentials, storeCredential, deleteCredential, syncCredentials,
  getDevices
} from "@/lib/cloud-api";
import { 
  encryptWithPassword, decryptWithPassword, 
  generateDeviceId, storeCredentialLocal, getCredentialLocal, deleteCredentialLocal
} from "@/lib/encryption";

const PLUGINS = [
  { id: "github", name: "GitHub", icon: Github, description: "Issues, PRs, repos" },
  { id: "slack", name: "Slack", icon: MessageSquare, description: "Messages, channels" },
  { id: "gmail", name: "Gmail", icon: Mail, description: "Email, calendar" },
  { id: "notion", name: "Notion", icon: FileText, description: "Pages, databases" },
  { id: "stripe", name: "Stripe", icon: CreditCard, description: "Payments" },
  { id: "linear", name: "Linear", icon: TrendingUp, description: "Issues, projects" },
  { id: "vercel", name: "Vercel", icon: Rocket, description: "Deployments" },
  { id: "jira", name: "Jira", icon: ClipboardList, description: "Issues, sprints" },
  { id: "aws", name: "AWS", icon: CloudIcon, description: "EC2, S3, Lambda" },
  { id: "gcp", name: "GCP", icon: Globe, description: "Compute, Storage" },
];

export const dynamic = 'force-dynamic';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pairSuccess = searchParams.get('pair') === 'success';
  
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [connectedPlugins, setConnectedPlugins] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(null);
  const [editingPlugin, setEditingPlugin] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [encryptionPassword, setEncryptionPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [devices, setDevices] = useState<{id: string, name: string, lastSeen: string}[]>([]);
  const [showPairSuccess, setShowPairSuccess] = useState(pairSuccess);

  const user = getCurrentUser();
  const connectedCount = connectedPlugins.size;

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    const stored = localStorage.getItem('conductor_credentials');
    if (stored) {
      const creds = JSON.parse(stored);
      setConnectedPlugins(new Set(Object.keys(creds)));
    }

    // Load demo devices
    setDevices([
      { id: '1', name: 'This Device', lastSeen: new Date().toISOString() },
    ]);
  }, [router]);

  useEffect(() => {
    if (showPairSuccess) {
      const timer = setTimeout(() => setShowPairSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showPairSuccess]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncCredentials();
      if (result.success && result.data) {
        const plugins = new Set(result.data.credentials.map(c => c.plugin));
        setConnectedPlugins(plugins);
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleAddCredential = async () => {
    if (!selectedPlugin || !apiKey || !encryptionPassword) {
      return;
    }

    setLoading(true);
    try {
      await storeCredentialLocal(selectedPlugin, apiKey, encryptionPassword);
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

  const handleUpdateCredential = async () => {
    if (!editingPlugin || !apiKey || !encryptionPassword) {
      return;
    }

    setLoading(true);
    try {
      await storeCredentialLocal(editingPlugin, apiKey, encryptionPassword);
      const { encryptedData, iv, salt } = await encryptWithPassword(apiKey, encryptionPassword);
      await storeCredential(editingPlugin, encryptedData, iv, salt);
      setShowAddModal(false);
      setEditingPlugin(null);
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
    deleteCredentialLocal(pluginId);
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

  const handleExport = () => {
    const data = localStorage.getItem('cloud_credentials') || '{}';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conductor-credentials-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        localStorage.setItem('cloud_credentials', JSON.stringify(data));
        setConnectedPlugins(new Set(Object.keys(data)));
        alert('Credentials imported successfully!');
      } catch {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

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
              onClick={() => setShowDevicesModal(true)}
              className="flex items-center gap-2 text-sm text-[#666] hover:text-white"
            >
              <Smartphone className="h-4 w-4" />
              Devices
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-[#666] hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
            <div className="h-8 w-8 rounded-full bg-[#1a1a1a] flex items-center justify-center font-mono text-xs text-[#666]">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* Pair Success Banner */}
      {showPairSuccess && (
        <div className="bg-green-900/20 border-b border-green-900 px-6 py-3 flex items-center justify-center">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          <span className="text-green-400 text-sm">Device paired successfully!</span>
        </div>
      )}

      <main className="max-w-6xl mx-auto p-6">
        {/* Stats Cards */}
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
              <Smartphone className="h-5 w-5 text-[#555]" />
              <span className="text-[#555] text-sm">Devices</span>
            </div>
            <div className="text-white font-mono text-2xl">
              {devices.length}
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setSelectedPlugin(null); setEditingPlugin(null); setShowAddModal(true); }}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-mono text-sm font-semibold text-black hover:bg-[#e8e8e8]"
            >
              <Plus className="h-4 w-4" />
              Add Credential
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 rounded-lg border border-[#1a1a1a] px-4 py-2 font-mono text-sm text-[#666] hover:text-white"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
          <span className="text-[#444] text-sm font-mono">
            {connectedCount === 0 ? 'No credentials yet' : `${connectedCount} credential${connectedCount > 1 ? 's' : ''} configured`}
          </span>
        </div>

        {/* Plugins List */}
        <div className="rounded-lg border border-[#1a1a1a] bg-[#080808] overflow-hidden">
          {PLUGINS.map((plugin, i) => {
            const isConnected = connectedPlugins.has(plugin.id);
            return (
              <div 
                key={plugin.id}
                className={`flex items-center justify-between p-4 ${i < PLUGINS.length - 1 ? 'border-b border-[#1a1a1a]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <plugin.icon className="h-6 w-6 text-[#666]" />
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
                        onClick={() => { setEditingPlugin(plugin.id); setShowAddModal(true); }}
                        className="text-xs text-[#666] hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCredential(plugin.id)}
                        className="text-xs text-red-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { setSelectedPlugin(plugin.id); setEditingPlugin(null); setShowAddModal(true); }}
                      className="text-xs text-[#666] hover:text-white"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Start Guide */}
        {connectedCount === 0 && (
          <div className="mt-8 p-6 rounded-lg border border-[#1a1a1a] bg-[#080808]">
            <h3 className="font-mono text-lg font-bold text-white mb-4">Getting Started</h3>
            <ol className="space-y-3 text-[#666] text-sm">
              <li className="flex items-start gap-3">
                <span className="font-mono text-[#555]">1.</span>
                <span>Click "Add Credential" above to add your first API key</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono text-[#555]">2.</span>
                <span>Choose a plugin and enter your API key</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono text-[#555]">3.</span>
                <span>Set an encryption password to secure your credentials</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono text-[#555]">4.</span>
                <span>Run <code className="text-white">conductor cloud sync</code> to download credentials on other devices</span>
              </li>
            </ol>
          </div>
        )}
      </main>

      {/* Add/Edit Credential Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-lg border border-[#1a1a1a] bg-[#080808] p-6">
            <h3 className="font-mono text-xl font-bold text-white mb-4">
              {editingPlugin ? `Edit ${PLUGINS.find(p => p.id === editingPlugin)?.name}` : selectedPlugin ? `Add ${PLUGINS.find(p => p.id === selectedPlugin)?.name}` : 'Add Credential'}
            </h3>
            
            {!selectedPlugin && !editingPlugin ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {PLUGINS.map(plugin => (
                  <button
                    key={plugin.id}
                    onClick={() => setSelectedPlugin(plugin.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-[#1a1a1a] hover:border-[#2a2a2a] text-left"
                  >
                    <plugin.icon className="h-5 w-5 text-[#666]" />
                    <span className="text-white font-mono text-sm">{plugin.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#555] mb-2 font-mono">API KEY</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full rounded-lg border border-[#1a1a1a] bg-[#050505] py-3 px-4 font-mono text-sm text-white placeholder-[#333]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#555] mb-2 font-mono">ENCRYPTION PASSWORD</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={encryptionPassword}
                        onChange={(e) => setEncryptionPassword(e.target.value)}
                        placeholder="Enter a password to encrypt this key"
                        className="w-full rounded-lg border border-[#1a1a1a] bg-[#050505] py-3 px-4 pr-12 font-mono text-sm text-white placeholder-[#333]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => { setShowAddModal(false); setSelectedPlugin(null); setEditingPlugin(null); setApiKey(''); setEncryptionPassword(''); }}
                    className="flex-1 py-3 rounded-lg border border-[#1a1a1a] text-[#666] hover:text-white font-mono text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingPlugin ? handleUpdateCredential : handleAddCredential}
                    disabled={loading || !apiKey || !encryptionPassword}
                    className="flex-1 py-3 rounded-lg bg-white text-black font-mono text-sm font-semibold hover:bg-[#e8e8e8] disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingPlugin ? 'Update' : 'Save'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Devices Modal */}
      {showDevicesModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-lg border border-[#1a1a1a] bg-[#080808] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-mono text-xl font-bold text-white">Connected Devices</h3>
              <button onClick={() => setShowDevicesModal(false)} className="text-[#666] hover:text-white">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              {devices.map(device => (
                <div key={device.id} className="flex items-center justify-between p-4 rounded-lg border border-[#1a1a1a]">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-[#666]" />
                    <div>
                      <p className="text-white font-mono text-sm">{device.name}</p>
                      <p className="text-[#444] text-xs">Last seen: {new Date(device.lastSeen).toLocaleString()}</p>
                    </div>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/login?mode=pair')}
              className="w-full py-3 rounded-lg border border-[#1a1a1a] text-[#666] hover:text-white font-mono text-sm"
            >
              Pair New Device
            </button>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-lg border border-[#1a1a1a] bg-[#080808] p-6">
            <h3 className="font-mono text-xl font-bold text-white mb-4">Export / Import Credentials</h3>
            
            <div className="space-y-4">
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-[#1a1a1a] text-[#666] hover:text-white font-mono text-sm"
              >
                <Download className="h-4 w-4" />
                Export Encrypted Credentials
              </button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-[#1a1a1a] text-[#666] hover:text-white font-mono text-sm">
                  <Upload className="h-4 w-4" />
                  Import Credentials
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className="w-full mt-4 py-3 rounded-lg border border-[#1a1a1a] text-[#666] hover:text-white font-mono text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><p className="text-[#666] font-mono">Loading...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}
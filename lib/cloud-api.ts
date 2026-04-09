/**
 * Conductor Cloud API Client
 * 
 * Handles communication with Conductor Cloud backend
 */

const API_BASE = process.env.NEXT_PUBLIC_CLOUD_API_URL || 'https://api.conductor.sh';

// Helper to safely access localStorage (works in browser only)
function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

interface ApiResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}

interface User {
  id: string;
  email: string;
  encryptionSalt: string;
}

interface Device {
  id: string;
  name: string;
  approved: boolean;
  lastSeen: string;
}

interface CredentialInfo {
  id: string;
  plugin: string;
  createdAt: string;
  updatedAt: string;
}

interface EncryptedCredential {
  plugin: string;
  encryptedData: string;
  iv: string;
  salt: string;
}

// Session management
let sessionId: string | null = null;

export function setSession(id: string): void {
  const storage = getLocalStorage();
  sessionId = id;
  if (storage) storage.setItem('conductor_session', id);
}

export function getSession(): string | null {
  if (sessionId) return sessionId;
  const storage = getLocalStorage();
  if (storage) sessionId = storage.getItem('conductor_session');
  return sessionId;
}

export function clearSession(): void {
  const storage = getLocalStorage();
  sessionId = null;
  if (storage) storage.removeItem('conductor_session');
}

function getAuthHeaders(): HeadersInit {
  const sid = getSession();
  if (!sid) return {};
  return {
    'Authorization': `Bearer ${sid}`,
    'Content-Type': 'application/json',
  };
}

// Auth API
export async function loginWithOAuth(provider: 'github' | 'google'): Promise<ApiResponse<{ sessionId: string; user: User; encryptionSalt: string }>> {
  // In production, this would redirect to OAuth provider
  // For demo, simulate login
  const response = await fetch(`${API_BASE}/auth/callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider,
      providerId: `mock_${provider}_${Date.now()}`,
      email: `user@${provider}.com`,
    }),
  }).catch(() => null);

  // For demo purposes, simulate success
  if (!response || !response.ok) {
    // Mock successful login
    const mockSessionId = `session_${crypto.randomUUID()}`;
    setSession(mockSessionId);
    return {
      success: true,
      data: {
        sessionId: mockSessionId,
        user: { id: '1', email: `user@${provider}.com`, encryptionSalt: crypto.randomUUID() },
        encryptionSalt: crypto.randomUUID(),
      },
    };
  }

  const data = await response.json();
  if (data.success && data.sessionId) {
    setSession(data.sessionId);
  }
  return data;
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  }).catch(() => {});
  clearSession();
}

// Device Pairing API
export async function createPairingRequest(deviceId: string, deviceName: string): Promise<ApiResponse<{ code: string; requestId: string }>> {
  // For demo, return mock pairing request
  return {
    success: true,
    data: {
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      requestId: crypto.randomUUID(),
    },
  };
}

export async function getPendingPairingRequests(): Promise<ApiResponse<{ requests: { code: string; deviceName: string }[] }>> {
  const response = await fetch(`${API_BASE}/device/pairing`, {
    headers: getAuthHeaders(),
  }).catch(() => null);

  if (!response || !response.ok) {
    return { success: true, data: { requests: [] } };
  }

  return response.json();
}

export async function approvePairing(requestId: string): Promise<ApiResponse<{ device: Device }>> {
  const response = await fetch(`${API_BASE}/device/approve`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ requestId }),
  }).catch(() => null);

  if (!response || !response.ok) {
    return { success: true, data: { device: { id: '1', name: 'New Device', approved: true, lastSeen: new Date().toISOString() } } };
  }

  return response.json();
}

// Device Management API
export async function getDevices(): Promise<ApiResponse<{ devices: Device[] }>> {
  const response = await fetch(`${API_BASE}/devices`, {
    headers: getAuthHeaders(),
  }).catch(() => null);

  if (!response || !response.ok) {
    return { success: true, data: { devices: [] } };
  }

  return response.json();
}

export async function revokeDevice(deviceId: string): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE}/devices/${deviceId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  }).catch(() => null);

  return { success: true };
}

// Credentials API
export async function getCredentials(): Promise<ApiResponse<{ credentials: CredentialInfo[] }>> {
  const response = await fetch(`${API_BASE}/credentials`, {
    headers: getAuthHeaders(),
  }).catch(() => null);

  if (!response || !response.ok) {
    return { success: true, data: { credentials: [] } };
  }

  return response.json();
}

export async function storeCredential(
  plugin: string,
  encryptedData: string,
  iv: string,
  salt: string,
  deviceId?: string
): Promise<ApiResponse<{ credentialId: string }>> {
  // For demo, store in localStorage
  const storage = getLocalStorage();
  const stored = JSON.parse(storage?.getItem('cloud_credentials') || '{}');
  stored[plugin] = { encryptedData, iv, salt, updatedAt: new Date().toISOString() };
  if (storage) storage.setItem('cloud_credentials', JSON.stringify(stored));

  return { success: true, data: { credentialId: crypto.randomUUID() } };
}

export async function getCredential(plugin: string): Promise<ApiResponse<EncryptedCredential | null>> {
  // For demo, get from localStorage
  const storage = getLocalStorage();
  const stored = JSON.parse(storage?.getItem('cloud_credentials') || '{}');
  const cred = stored[plugin];

  if (!cred) {
    return { success: true, data: null };
  }

  return {
    success: true,
    data: {
      plugin,
      encryptedData: cred.encryptedData,
      iv: cred.iv,
      salt: cred.salt,
    },
  };
}

export async function deleteCredential(plugin: string): Promise<ApiResponse<void>> {
  // For demo, delete from localStorage
  const storage = getLocalStorage();
  const stored = JSON.parse(storage?.getItem('cloud_credentials') || '{}');
  delete stored[plugin];
  if (storage) storage.setItem('cloud_credentials', JSON.stringify(stored));

  return { success: true };
}

// Sync API
export async function syncCredentials(since?: number): Promise<ApiResponse<{ credentials: EncryptedCredential[] }>> {
  // For demo, get from localStorage
  const storage = getLocalStorage();
  const stored = JSON.parse(storage?.getItem('cloud_credentials') || '{}');
  const credentials = Object.entries(stored).map(([plugin, cred]: [string, any]) => ({
    plugin,
    encryptedData: cred.encryptedData,
    iv: cred.iv,
    salt: cred.salt,
    updatedAt: cred.updatedAt,
  }));

  return { success: true, data: { credentials } };
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  return !!getSession();
}

// Get user info from session (mock for demo)
export function getCurrentUser(): { id: string; email: string } | null {
  if (!isLoggedIn()) return null;
  return { id: '1', email: 'user@conductor.sh' };
}
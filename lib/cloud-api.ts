/**
 * Conductor Cloud API Client
 * 
 * Handles communication with Conductor Cloud backend
 * Uses Supabase for authentication
 */

import { getSupabaseClient } from "./supabase";

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

// Auth API - uses Supabase
export async function loginWithOAuth(provider: 'github' | 'google'): Promise<ApiResponse<{ sessionId: string; user: User; encryptionSalt: string }>> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // OAuth will redirect, so we return a placeholder
  return { success: true, data: { sessionId: 'pending', user: { id: '', email: '' }, encryptionSalt: '' } };
}

export async function logout(): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  const storage = getLocalStorage();
  if (storage) {
    storage.removeItem('conductor_session');
    storage.removeItem('conductor_user');
  }
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  const storage = getLocalStorage();
  return !!(storage?.getItem('conductor_session'));
}

// Get current user info
export function getCurrentUser(): { id: string; email: string } | null {
  const storage = getLocalStorage();
  const userStr = storage?.getItem('conductor_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setUserSession(userId: string, email: string): void {
  const storage = getLocalStorage();
  if (storage) {
    storage.setItem('conductor_session', userId);
    storage.setItem('conductor_user', JSON.stringify({ id: userId, email }));
  }
}

function getSession(): string | null {
  const storage = getLocalStorage();
  return storage?.getItem('conductor_session') || null;
}

export function setSession(id: string): void {
  const storage = getLocalStorage();
  if (storage) storage.setItem('conductor_session', id);
}

// Device Pairing API (mock for now)
export async function createPairingRequest(deviceId: string, deviceName: string): Promise<ApiResponse<{ code: string; requestId: string }>> {
  return {
    success: true,
    data: {
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      requestId: crypto.randomUUID(),
    },
  };
}

export async function getPendingPairingRequests(): Promise<ApiResponse<{ requests: { code: string; deviceName: string }[] }>> {
  return { success: true, data: { requests: [] } };
}

export async function approvePairing(requestId: string): Promise<ApiResponse<{ device: Device }>> {
  return { success: true, data: { device: { id: '1', name: 'New Device', approved: true, lastSeen: new Date().toISOString() } } };
}

// Device Management API
export async function getDevices(): Promise<ApiResponse<{ devices: Device[] }>> {
  return { success: true, data: { devices: [] } };
}

export async function revokeDevice(deviceId: string): Promise<ApiResponse<void>> {
  return { success: true };
}

// Credentials API
export async function getCredentials(): Promise<ApiResponse<{ credentials: CredentialInfo[] }>> {
  const storage = getLocalStorage();
  const stored = JSON.parse(storage?.getItem('cloud_credentials') || '{}');
  const credentials = Object.keys(stored).map(plugin => ({
    id: plugin,
    plugin,
    createdAt: stored[plugin]?.createdAt || new Date().toISOString(),
    updatedAt: stored[plugin]?.updatedAt || new Date().toISOString(),
  }));
  return { success: true, data: { credentials } };
}

export async function storeCredential(
  plugin: string,
  encryptedData: string,
  iv: string,
  salt: string,
  deviceId?: string
): Promise<ApiResponse<{ credentialId: string }>> {
  const storage = getLocalStorage();
  const stored = JSON.parse(storage?.getItem('cloud_credentials') || '{}');
  stored[plugin] = { encryptedData, iv, salt, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  if (storage) storage.setItem('cloud_credentials', JSON.stringify(stored));
  return { success: true, data: { credentialId: crypto.randomUUID() } };
}

export async function getCredential(plugin: string): Promise<ApiResponse<EncryptedCredential | null>> {
  const storage = getLocalStorage();
  const stored = JSON.parse(storage?.getItem('cloud_credentials') || '{}');
  const cred = stored[plugin];
  if (!cred) return { success: true, data: null };
  return { success: true, data: { plugin, encryptedData: cred.encryptedData, iv: cred.iv, salt: cred.salt } };
}

export async function deleteCredential(plugin: string): Promise<ApiResponse<void>> {
  const storage = getLocalStorage();
  const stored = JSON.parse(storage?.getItem('cloud_credentials') || '{}');
  delete stored[plugin];
  if (storage) storage.setItem('cloud_credentials', JSON.stringify(stored));
  return { success: true };
}

// Sync API
export async function syncCredentials(since?: number): Promise<ApiResponse<{ credentials: EncryptedCredential[] }>> {
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

// Device Pairing API with real server
const CLOUD_API_URL = process.env.NEXT_PUBLIC_CLOUD_API_URL || 'https://api.conductor.sh';

export async function checkPairingStatus(requestId: string): Promise<ApiResponse<{ approved: boolean; deviceId?: string; sessionId?: string }>> {
  try {
    const session = getSession();
    const response = await fetch(`${CLOUD_API_URL}/device/pairing?requestId=${requestId}`, {
      headers: session ? { 'Authorization': `Bearer ${session}` } : {},
    });
    const data = await response.json();
    return data;
  } catch {
    // For demo mode, simulate approval after a delay
    return { success: true, data: { approved: true, deviceId: 'demo-device', sessionId: 'demo-session' } };
  }
}

export async function approveDevice(requestId: string): Promise<ApiResponse<{ device: Device; sessionId: string }>> {
  try {
    const session = getSession();
    const response = await fetch(`${CLOUD_API_URL}/device/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session}`,
      },
      body: JSON.stringify({ requestId }),
    });
    const data = await response.json();
    if (data.success) {
      setSession(data.sessionId);
    }
    return data;
  } catch {
    // Demo mode
    return { success: true, data: { device: { id: 'demo-device', name: 'Demo Device', approved: true, lastSeen: new Date().toISOString() }, sessionId: 'demo-session' } };
  }
}
/**
 * Client-Side Encryption for Conductor Cloud
 * 
 * Simple base64 encoding for demo (not production secure)
 * In production, would use Web Crypto API with proper types
 */

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

export function generateDeviceId(): string {
  const storage = getLocalStorage();
  const stored = storage?.getItem('conductor_device_id');
  if (stored) return stored;
  
  const deviceId = crypto.randomUUID();
  if (storage) storage.setItem('conductor_device_id', deviceId);
  return deviceId;
}

// Simple XOR-based "encryption" for demo purposes
// WARNING: Not secure - just obfuscates for demo
function simpleEncrypt(data: string, password: string): string {
  const key = password.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 256;
  const encoded = [];
  for (let i = 0; i < data.length; i++) {
    encoded.push(data.charCodeAt(i) ^ key);
  }
  return btoa(String.fromCharCode(...encoded));
}

function simpleDecrypt(encrypted: string, password: string): string {
  const key = password.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 256;
  const data = atob(encrypted);
  const decoded = [];
  for (let i = 0; i < data.length; i++) {
    decoded.push(data.charCodeAt(i) ^ key);
  }
  return String.fromCharCode(...decoded);
}

export async function encryptWithPassword(
  data: string,
  password: string
): Promise<{ encrypted: string; iv: string; salt: string }> {
  const encrypted = simpleEncrypt(data, password);
  return {
    encrypted,
    iv: btoa(Date.now().toString()),
    salt: btoa(password.slice(0, 8)),
  };
}

export async function decryptWithPassword(
  encrypted: string,
  _iv: string,
  _salt: string,
  password: string
): Promise<string> {
  return simpleDecrypt(encrypted, password);
}

export async function storeCredentialLocal(
  plugin: string,
  credential: string,
  password: string
): Promise<void> {
  const storage = getLocalStorage();
  const { encrypted, iv, salt } = await encryptWithPassword(credential, password);
  
  const stored = JSON.parse(storage?.getItem('conductor_credentials') || '{}');
  stored[plugin] = { encrypted, iv, salt };
  if (storage) storage.setItem('conductor_credentials', JSON.stringify(stored));
}

export async function getCredentialLocal(
  plugin: string,
  password: string
): Promise<string | null> {
  const storage = getLocalStorage();
  const stored = JSON.parse(storage?.getItem('conductor_credentials') || '{}');
  const cred = stored[plugin];
  
  if (!cred) return null;
  
  try {
    return await decryptWithPassword(cred.encrypted, cred.iv, cred.salt, password);
  } catch {
    return null;
  }
}

export function listCredentialsLocal(): string[] {
  const storage = getLocalStorage();
  const stored = JSON.parse(storage?.getItem('conductor_credentials') || '{}');
  return Object.keys(stored);
}

export function deleteCredentialLocal(plugin: string): void {
  const storage = getLocalStorage();
  const stored = JSON.parse(storage?.getItem('conductor_credentials') || '{}');
  delete stored[plugin];
  if (storage) storage.setItem('conductor_credentials', JSON.stringify(stored));
}

export function clearAllCredentialsLocal(): void {
  const storage = getLocalStorage();
  if (storage) storage.removeItem('conductor_credentials');
}

export interface EncryptedCredential {
  encrypted: string;
  iv: string;
  salt: string;
}

export interface CredentialStorage {
  [plugin: string]: EncryptedCredential;
}
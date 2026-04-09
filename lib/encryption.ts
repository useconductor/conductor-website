/**
 * Client-Side Encryption for Conductor Cloud
 * 
 * Uses Web Crypto API with AES-256-GCM for proper zero-knowledge encryption.
 * The server never sees plaintext credentials - everything is encrypted client-side.
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

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptWithPassword(
  data: string,
  password: string
): Promise<{ encryptedData: string; iv: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encoder.encode(data)
  );
  
  const toBase64 = (arr: Uint8Array): string => {
    let binary = '';
    for (let i = 0; i < arr.length; i++) {
      binary += String.fromCharCode(arr[i]);
    }
    return btoa(binary);
  };
  
  return {
    encryptedData: toBase64(new Uint8Array(encrypted)),
    iv: toBase64(iv),
    salt: toBase64(salt),
  };
}

export async function decryptWithPassword(
  encryptedData: string,
  iv: string,
  salt: string,
  password: string
): Promise<string> {
  const saltBytes = new Uint8Array(salt.length);
  for (let i = 0; i < salt.length; i++) saltBytes[i] = salt.charCodeAt(i);
  const ivBytes = new Uint8Array(iv.length);
  for (let i = 0; i < iv.length; i++) ivBytes[i] = iv.charCodeAt(i);
  const encryptedBytes = new Uint8Array(encryptedData.length);
  for (let i = 0; i < encryptedData.length; i++) encryptedBytes[i] = encryptedData.charCodeAt(i);
  
  const key = await deriveKey(password, saltBytes);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes },
    key,
    encryptedBytes
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

export async function storeCredentialLocal(
  plugin: string,
  credential: string,
  password: string
): Promise<void> {
  const storage = getLocalStorage();
  const { encryptedData, iv, salt } = await encryptWithPassword(credential, password);
  
  const stored = JSON.parse(storage?.getItem('conductor_credentials') || '{}');
  stored[plugin] = { encryptedData, iv, salt };
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
    return await decryptWithPassword(cred.encryptedData, cred.iv, cred.salt, password);
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
  encryptedData: string;
  iv: string;
  salt: string;
}

export interface CredentialStorage {
  [plugin: string]: EncryptedCredential;
}

export function getSessionKey(): string | null {
  const storage = getLocalStorage();
  return storage?.getItem('conductor_session_key') || null;
}

export function setSessionKey(key: string): void {
  const storage = getLocalStorage();
  if (storage) storage.setItem('conductor_session_key', key);
}

export function clearSessionKey(): void {
  const storage = getLocalStorage();
  if (storage) storage.removeItem('conductor_session_key');
}
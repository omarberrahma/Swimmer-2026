const { webcrypto } = require('node:crypto');
const crypto = webcrypto;

const SALT = new TextEncoder().encode('bou-zadjar-salt-v1');
const ITERATIONS = 100000;

async function deriveKey(passcode) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passcode),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

async function encryptData(key, plaintext) {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return Buffer.from(combined).toString('base64');
}

async function decryptData(key, ciphertext) {
  try {
    const combined = new Uint8Array(Buffer.from(ciphertext, 'base64'));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (e) {
    throw new Error('Decryption failed. Incorrect key or corrupted data.');
  }
}

async function runTest() {
  try {
    const testPass = 'secure-password-123';
    const testData = JSON.stringify({ test: 'Hello Bou Zadjar' });
    const key = await deriveKey(testPass);
    const encrypted = await encryptData(key, testData);
    console.log('Encrypted:', encrypted);
    const decrypted = await decryptData(key, encrypted);
    console.log('Decrypted:', decrypted);
    if (JSON.parse(decrypted).test === 'Hello Bou Zadjar') {
      console.log('TEST PASSED');
    } else {
      console.log('TEST FAILED');
      process.exit(1);
    }
  } catch (err) {
    console.error('Crypto Test Failed:', err);
    process.exit(1);
  }
}

runTest();

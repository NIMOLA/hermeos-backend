import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// Ensure encryption key exists
if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable must be set');
}

const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

if (KEY.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
}

/**
 * Encrypts sensitive data using AES-256-GCM
 * @param text - Plain text to encrypt
 * @returns Encrypted string in format: iv:authTag:encrypted
 */
export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts data encrypted with encrypt()
 * @param encryptedData - Encrypted string in format: iv:authTag:encrypted
 * @returns Decrypted plain text
 */
export function decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');

    if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
    }

    const [ivHex, authTagHex, encrypted] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

/**
 * Hash sensitive data (one-way, for verification only)
 */
export function hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Generate secure random token
 */
export function generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
}

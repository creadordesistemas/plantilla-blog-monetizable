import crypto from 'crypto';

/**
 * Genera un hash seguro para una contraseña usando PBKDF2.
 * Retorna el resultado en formato salt:hash.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifica si una contraseña coincide con el hash almacenado.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  
  const [salt, originalHash] = parts;
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

const SESSION_SECRET = process.env.JWT_SECRET || 'fallback-inseguro-cambiar-en-produccion';

/**
 * Firma un payload con HMAC-SHA256.
 * Retorna el resultado en formato payload.firma (base64url).
 */
export function signSessionToken(payload: string): string {
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

/**
 * Verifica un token firmado. Retorna el payload original si la firma es válida, o null si no lo es.
 */
export function verifySessionToken(token: string): string | null {
  if (!token) return null;
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return null;

  const payload = token.substring(0, lastDot);
  const signature = token.substring(lastDot + 1);

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');

  // Comparación en tiempo constante para evitar timing attacks
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  return payload;
}

import crypto from 'node:crypto';

export const generateUUID = () => crypto.randomUUID();

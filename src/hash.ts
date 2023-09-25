import crypto from 'crypto';

export function hash(inputString: string) {
    const hash = crypto.createHash('sha256');
    hash.update(inputString);
    return hash.digest('hex');
}
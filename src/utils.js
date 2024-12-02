import { isPowerOfTwo } from './utils';

export function isPowerOfTwo(n) {
    return Math.log2(n) % 1 === 0;
} 
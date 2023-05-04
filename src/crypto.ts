// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// See utils.ts for details.
import * as nc from 'node:crypto';
export const crypto =
  nc && typeof nc === 'object' && 'webcrypto' in nc ? nc.webcrypto : undefined;

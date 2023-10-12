import assert from 'assert';
import { should } from 'micro-should';
import { sha256 } from '../esm/sha256.js';
import { sha512 } from '../esm/sha512.js';
import { hmac } from '../esm/hmac.js';
import { sha3_256, shake256 } from '../esm/sha3.js';
import { k12, kmac256 } from '../esm/sha3-addons.js';
import { ripemd160 } from '../esm/ripemd160.js';

// small -- minimal personalization options, big -- all personalization options
// test that clone works correctly if "to" is same class instance but with completely different personalization
const HASHES = {
  sha256: { small: () => sha256.create() },
  sha512: { small: () => sha512.create() },
  ripemd160: { small: () => ripemd160.create() },
  sha3: { small: () => sha3_256.create() },
  shake256: {
    small: () => shake256.create(),
    big: () => shake256.create({ dkLen: 256 }),
  },
  shake256: {
    small: () => shake256.create(),
    big: () => shake256.create({ dkLen: 256 }),
  },
  hmac: {
    small: () => hmac.create(sha256, new Uint8Array([5, 4, 3, 2, 1])),
    big: () => hmac.create(sha256, new Uint8Array([1, 2, 3, 4, 5])),
  },
  kmac: {
    small: () => kmac256.create(new Uint8Array([])),
    big: () =>
      kmac256.create(new Uint8Array([11, 22, 33]), {
        personalization: new Uint8Array([44, 55, 66]),
      }),
  },
  k12: {
    small: () => k12.create(new Uint8Array([])),
    big: () =>
      k12.create(new Uint8Array([11, 22, 33]), {
        personalization: new Uint8Array([44, 55, 66]),
        dkLen: 256,
      }),
  },
  // blake2s: {
  //   small: () => blake2s.create(),
  //   big: () =>
  //     blake2s.create({
  //       key: new Uint8Array([11, 22, 33]),
  //       salt: new Uint8Array([14, 15, 16, 17, 18, 19, 155, 144]),
  //       personalization: new Uint8Array([24, 25, 26, 27, 28, 29, 255, 244]),
  //       dkLen: 12,
  //     }),
  // },
  // blake2b: {
  //   small: () => blake2b.create(),
  //   big: () =>
  //     blake2b.create({
  //       key: new Uint8Array([11, 22, 33]),
  //       salt: new Uint8Array([14, 15, 16, 17, 18, 19, 155, 144, 144, 155, 19, 18, 17, 16, 15, 14]),
  //       personalization: new Uint8Array([
  //         24, 25, 26, 27, 28, 29, 255, 244, 244, 255, 29, 28, 27, 26, 25, 24,
  //       ]),
  //       dkLen: 12,
  //     }),
  // },
  // blake3: {
  //   small: () => blake3.create(),
  //   // derive has different IV
  //   big: () => blake3.create({ context: 'someContext', dkLen: 256 }),
  // },
};

for (let k in HASHES) {
  const small = HASHES[k].small;
  const big = HASHES[k].big || HASHES[k].small;
  const smallExp = small()
    .update(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
    .digest();
  const bigExp = big()
    .update(new Uint8Array([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]))
    .digest();

  should(`Clone ${k}: just clone small`, () => {
    const s1 = small().update(new Uint8Array([1, 2, 3, 4, 5]));
    const s2 = s1
      ._cloneInto()
      .update(new Uint8Array([6, 7, 8, 9, 10]))
      .digest();
    assert.deepStrictEqual(s2, smallExp, 's2 correct');
    // Original is not modified
    assert.deepStrictEqual(
      s1.digest(),
      small()
        .update(new Uint8Array([1, 2, 3, 4, 5]))
        .digest(),
      's1 same'
    );
  });
  should(`Clone ${k}: just clone big`, () => {
    const b1 = big().update(new Uint8Array([10, 9, 8, 7, 6]));
    const b2 = b1
      ._cloneInto()
      .update(new Uint8Array([5, 4, 3, 2, 1]))
      .digest();
    assert.deepStrictEqual(b2, bigExp, 'b2 correct');
    // Original is not modified
    assert.deepStrictEqual(
      b1.digest(),
      big()
        .update(new Uint8Array([10, 9, 8, 7, 6]))
        .digest(),
      'b1 same'
    );
  });
  should(`Clone ${k}: small<->big`, () => {
    const s1 = small().update(new Uint8Array([1, 2, 3, 4, 5]));
    const s2 = small().update(new Uint8Array([1, 2, 3, 4, 5]));
    const b1 = big().update(new Uint8Array([10, 9, 8, 7, 6]));
    const b2 = big().update(new Uint8Array([10, 9, 8, 7, 6]));
    b1._cloneInto(s2);
    assert.deepStrictEqual(b1, s2, 'b1===s2');
    s1._cloneInto(b2);
    assert.deepStrictEqual(s1, b2, 'b1===b2');
    assert.deepStrictEqual(s2.update(new Uint8Array([5, 4, 3, 2, 1])).digest(), bigExp, 's2===big');
    assert.deepStrictEqual(
      b2.update(new Uint8Array([6, 7, 8, 9, 10])).digest(),
      smallExp,
      'b2===small'
    );
    // Original is not modified
    assert.deepStrictEqual(
      b1.digest(),
      big()
        .update(new Uint8Array([10, 9, 8, 7, 6]))
        .digest(),
      'b1 same'
    );
    assert.deepStrictEqual(
      s1.digest(),
      small()
        .update(new Uint8Array([1, 2, 3, 4, 5]))
        .digest(),
      's1 same'
    );
  });
}

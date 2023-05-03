import assert from 'assert';
import { should } from 'micro-should';
import { BigInteger } from '../esm/biginteger/index.js';
import u64 from '../esm/_u64.js';

const n1 = BigInteger.new(1);
const n2 = BigInteger.new(2);
const n64 = BigInteger.new(64);

const U64_MASK = n2.leftShift( n64.dec() ).idec();
const U32_MASK = (2 ** 32 - 1) | 0;
// Convert [u32, u32] to BigInteger.new(u64)
const rotate_right = (word, shift) => word.rightShift(shift).ibitwiseOr( word.leftShift( n64.sub(shift) )).ibitwiseAnd(U64_MASK);
const rotate_left = (word, shift) => word.rightShift( n64.sub(shift) ).iadd( word.leftShift(shift) ).imod( n1.leftShift(n64) );

// Convert BigInteger.new(u64) -> [u32, u32]
const big = (n) => {
  return { h: n.rightShift(BigInteger.new(32)).bitwiseAnd(BigInteger.new(U32_MASK)).toNumber(), l: n.bitwiseAnd(BigInteger.new(U32_MASK)).toNumber() };
};

const equalBigInteger = (actual, expected) => actual.toString() === expected.toString();

should('shr_small', () => {
  const val = [0x01234567, 0x89abcdef];
  const big = u64.toBig(...val);
  for (let i = 0; i < 32; i++) {
    const h = u64.shrSH(val[0], val[1], i);
    const l = u64.shrSL(val[0], val[1], i);
    assert.ok(equalBigInteger((big.rightShift( BigInteger.new(i) )).ibitwiseAnd(U64_MASK), u64.toBig(h, l)));
  }
});

// should('shr_big', () => {
//   const val = [0x01234567, 0x89abcdef];
//   const big = u64.toBig(...val);
//   for (let i = 32; i < 64; i++) {
//     const h = u64.shrBH(val[0], val[1], i);
//     const l = u64.shrBL(val[0], val[1], i);
//     assert.deepStrictEqual((big >> BigInteger.new(i)) & U64_MASK, u64.toBig(h, l));
//   }
// });

should('rotr_small', () => {
  const val = [0x01234567, 0x89abcdef];
  const big = u64.toBig(...val);
  for (let i = 1; i < 32; i++) {
    const h = u64.rotrSH(val[0], val[1], i);
    const l = u64.rotrSL(val[0], val[1], i);
    assert.ok(equalBigInteger(rotate_right(big, BigInteger.new(i)), u64.toBig(h, l)));
  }
});

should('rotr32', () => {
  const val = [0x01234567, 0x89abcdef];
  const big = u64.toBig(...val);
  const h = u64.rotr32H(val[0], val[1], 32);
  const l = u64.rotr32L(val[0], val[1], 32);
  assert.ok(equalBigInteger(rotate_right(big, BigInteger.new(32)), u64.toBig(h, l)));
});

should('rotr_big', () => {
  const val = [0x01234567, 0x89abcdef];
  const big = u64.toBig(...val);
  for (let i = 33; i < 64; i++) {
    const h = u64.rotrBH(val[0], val[1], i);
    const l = u64.rotrBL(val[0], val[1], i);
    assert.ok(equalBigInteger(rotate_right(big, BigInteger.new(i)), u64.toBig(h, l)));
  }
});

should('rotl small', () => {
  const val = [0x01234567, 0x89abcdef];
  const big = u64.toBig(...val);
  for (let i = 1; i < 32; i++) {
    const h = u64.rotlSH(val[0], val[1], i);
    const l = u64.rotlSL(val[0], val[1], i);
    assert.ok(equalBigInteger(rotate_left(big, BigInteger.new(i)), u64.toBig(h, l), `rotl_big(${i})`));
  }
});

should('rotl big', () => {
  const val = [0x01234567, 0x89abcdef];
  const big = u64.toBig(...val);
  for (let i = 33; i < 64; i++) {
    const h = u64.rotlBH(val[0], val[1], i);
    const l = u64.rotlBL(val[0], val[1], i);
    assert.ok(equalBigInteger(rotate_left(big, BigInteger.new(i)), u64.toBig(h, l), `rotl_big(${i})`));
  }
});

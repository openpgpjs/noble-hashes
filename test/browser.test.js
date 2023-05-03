import { expect } from 'chai';
import { sha256 } from '../esm/sha256.js';
import { sha3_256 } from '../esm/sha3.js';
import { sha512 } from '../esm/sha512.js';
import { ripemd160 } from '../esm/ripemd160.js';

describe('Browser integration tests', () => {
  it('SHA256', () => {
    expect(arrayToHexString(sha256('abc'))).to.equal('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('SHA512', () => {
    expect(arrayToHexString(sha512('abc'))).to.equal('ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f');
  });

  it('SHA3-256', () => {
    expect(arrayToHexString(sha3_256('abc'))).to.equal('3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532');
  });

  it('ripemd160', () => {
    expect(arrayToHexString(ripemd160('abc'))).to.equal('8eb208f7e05d987a9b044a8e98c6b087f15a0bfc');
  })
})

const arrayToHexString = (bytes) => {
  const res = [];
  for (let c = 0; c < bytes.length; c++) {
      const hex = bytes[c].toString(16);
      res.push(hex.length < 2 ? '0' + hex : hex);
  }
  return res.join('');
};

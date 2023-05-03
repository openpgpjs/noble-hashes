
import { deepStrictEqual, throws, ok, strictEqual } from 'assert';
import { describe, should } from 'micro-should';
import NativeBigInteger from '../esm/biginteger/native.interface.js';
import BNBigInteger from '../esm/biginteger/bn.interface.js';
import BigInteger from '../esm/biginteger/index.js';
import BN  from 'bn.js';
import crypto from 'crypto';

async function getRandomBN(min, max) {
  if (max.cmp(min) <= 0) {
    throw new Error('Illegal parameter value: max <= min');
  }

  const modulus = max.sub(min);
  const bytes = modulus.byteLength()
  const r = new BN(crypto.getRandomValues(new Uint8Array(bytes + 8)));
  return r.mod(modulus).add(min);
}


describe('BigInteger', function() {
  const existingImplementation = BigInteger.Implementation;

  describe('Native implementation', function() {
    bigIntegerTests(NativeBigInteger);
  });

  describe('Fallback implementation (bn.js)', function() {
    bigIntegerTests(BNBigInteger);
  });

  BigInteger.setImplementation(existingImplementation, true)
})

function bigIntegerTests (implementation) {
  BigInteger.setImplementation(implementation, true);

  should('constructor throws on undefined input', function() {
    throws(() => BigInteger.new(), /Invalid BigInteger input/);
  });


  should('constructor supports strings', function() {
    const input = '417653931840771530406225971293556769925351769207235721650257629558293828796031115397206059067934284452829611906818956352854418342467914729341523414945427019410284762464062112274326172407819051167058569790660930309496043254270888417520676082271432948852231332576271876251597199882908964994070268531832274431027';
    const got = BigInteger.new(input);
    const expected = new BN(input);
    strictEqual(got.toString(), expected.toString());
  });

  should('constructor supports Uint8Arrays', function() {
    const expected = new BN('417653931840771530406225971293556769925351769207235721650257629558293828796031115397206059067934284452829611906818956352854418342467914729341523414945427019410284762464062112274326172407819051167058569790660930309496043254270888417520676082271432948852231332576271876251597199882908964994070268531832274431027');
    const input = expected.toArrayLike(Uint8Array);
    const got = BigInteger.new(input);
    strictEqual(got.toString(), expected.toString());
  });

  should('conditional operators are correct', function() {
    const a = BigInteger.new(12);
    const b = BigInteger.new(34);

    ok(a.equal(a) === true);
    ok(a.equal(b) === false);
    ok(a.gt(a) === a.lt(a));
    ok(a.gt(b) !== a.lt(b));
    ok(a.gte(a) === a.lte(a));

    const zero = BigInteger.new(0);
    const one = BigInteger.new(1);
    ok(zero.isZero() === true);
    ok(one.isZero() === false);

    ok(one.isOne() === true);
    ok(zero.isOne() === false);

    ok(zero.isEven() === true);
    ok(one.isEven() === false);

    ok(zero.isNegative() === false);
    ok(zero.dec().isNegative() === true);
  });

  should('bitLength is correct', function() {
    const n = BigInteger.new(127);
    let expected = 7;
    ok(n.bitLength() === expected);
    ok(n.inc().bitLength() === (++expected));
  });

  should('byteLength is correct', function() {
    const n = BigInteger.new(65535);
    let expected = 2;
    ok(n.byteLength() === expected);
    ok(n.inc().byteLength() === (++expected));
  });

  should('toUint8Array is correct', function() {
    const nString = '417653931840771530406225971293556769925351769207235721650257629558293828796031115397206059067934284452829611906818956352854418342467914729341523414945427019410284762464062112274326172407819051167058569790660930309496043254270888417520676082271432948852231332576271876251597199882908964994070268531832274431027';
    const n = BigInteger.new(nString);
    const paddedSize = Number(n.byteLength()) + 1;
    // big endian, unpadded
    let expected = new BN(nString).toArrayLike(Uint8Array);
    deepStrictEqual(n.toUint8Array(), expected);
    // big endian, padded
    expected = new BN(nString).toArrayLike(Uint8Array, 'be', paddedSize);
    deepStrictEqual(n.toUint8Array('be', paddedSize), expected);
    // little endian, unpadded
    expected = new BN(nString).toArrayLike(Uint8Array, 'le');
    deepStrictEqual(n.toUint8Array('le'), expected);
    //little endian, padded
    expected = new BN(nString).toArrayLike(Uint8Array, 'le', paddedSize);
    deepStrictEqual(n.toUint8Array('le', paddedSize), expected);
  });

  should('binary operators are consistent', function() {
    const a = BigInteger.new(12);
    const b = BigInteger.new(34);
    const ops = ['add', 'sub', 'mul', 'mod', 'leftShift', 'rightShift'];
    ops.forEach(op => {
      const iop = `i${op}`;
      ok(a[op](b).equal(a[iop](b)));
    });
  });

  should('unary operators are consistent', function() {
    const a = BigInteger.new(12);
    const one = BigInteger.new(1);
    ok(a.sub(one).equal(a.dec()));
    ok(a.add(one).equal(a.inc()));
  });

  should('modExp is correct (large values)', function() {
    const stringX = '417653931840771530406225971293556769925351769207235721650257629558293828796031115397206059067934284452829611906818956352854418342467914729341523414945427019410284762464062112274326172407819051167058569790660930309496043254270888417520676082271432948852231332576271876251597199882908964994070268531832274431027';
    const stringE = '21139356010872569239159922781526379521587348169074209285187910481667533072168468011617194695181255483288792585413365359733692097084373249198758148704369207793873998901870577262254971784191473102265830193058813215898765238784670469696574407580179153118937858890572095234316482449291777882525949871374961971753';
    const stringN = '129189808515414783602892982235788912674846062846614219472827821758734760420002631653235573915244294540972376140705505703576175711417114803419704967903726436285518767606681184247119430411311152556442947708732584954518890222684529678365388350886907287414896703685680210648760841628375425909680236584021041565183';
    const x = BigInteger.new(stringX);
    const e = BigInteger.new(stringE);
    const n = BigInteger.new(stringN);

    const got = x.modExp(e, n);
    const expected = new BN(stringX).toRed(BN.red(new BN(stringN))).redPow(new BN(stringE));
    // different formats, it's easier to compare strings
    strictEqual(got.toString(), expected.toString());
  });

  should('gcd is correct', async function() {
    const aBN = await getRandomBN(new BN(2), new BN(200));
    const bBN = await getRandomBN(new BN(2), new BN(200));
    if (aBN.isEven()) aBN.iaddn(1);
    const a = BigInteger.new(aBN.toString());
    const b = BigInteger.new(bBN.toString());
    const expected = aBN.gcd(bBN);
    strictEqual(a.gcd(b).toString(), expected.toString());
  });

  should('modular inversion is correct', async function() {
    const moduloBN = new BN(229); // this is a prime
    const baseBN = await getRandomBN(new BN(2), moduloBN);
    const a = BigInteger.new(baseBN.toString());
    const n = BigInteger.new(moduloBN.toString());
    const expected = baseBN.invm(moduloBN);
    strictEqual(a.modInv(n).toString(), expected.toString());
    throws(() => a.mul(n).modInv(n), /Inverse does not exist/);
  });

  should('getBit is correct', async function() {
    const i = 5;
    const nBN = await getRandomBN(new BN(2), new BN(200));
    const n = BigInteger.new(nBN.toString());
    const expected = nBN.testn(5) ? 1 : 0;
    strictEqual(n.getBit(i), expected);
  });
};

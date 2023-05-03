import BigInteger from './interface.js';
import NativeBigInteger from './native.interface.js';
import FallbackBigInteger from './bn.interface.js';

const detectBigInt = () => typeof BigInt !== 'undefined';

BigInteger.setImplementation(detectBigInt() ? NativeBigInteger : FallbackBigInteger);

export { BigInteger, BigInteger as default };

// About BigInteger interface and bigint replacement:
// - some functions get a bigint and change its value without reassingment (eg i++). Note that with BigIntegers, you must clone the value before doing so!!!

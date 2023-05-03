interface ConcreteBigInteger {
  /**
   * Get a BigInteger (input must be big endian for strings and arrays)
   * @param {Number|String|Uint8Array} n - Value to convert
   * @throws {Error} on null or undefined input
   */
  new (n: Uint8Array | string | number): BigInteger;
}

abstract class BigInteger {
  private static Implementation: ConcreteBigInteger;
  static setImplementation(Implementation: ConcreteBigInteger, replace = false) {
    if (BigInteger.Implementation && !replace) {
      throw new Error('Implementation already set');
    }
    BigInteger.Implementation = Implementation;
  }
  static new(n: Uint8Array | string | number): BigInteger {
    return new BigInteger.Implementation(n);
  }

  abstract clone(): BigInteger;

  /**
   * BigInteger increment in place
   */
  abstract iinc(): this;

  /**
   * BigInteger increment
   * @returns {BigInteger} this + 1.
   */
  abstract inc(): BigInteger;

  /**
   * BigInteger decrement in place
   */
  abstract idec(): this;

  /**
   * BigInteger decrement
   * @returns {BigInteger} this - 1.
   */
  abstract dec(): BigInteger;

  /**
   * BigInteger addition in place
   * @param {BigInteger} x - Value to add
   */
  abstract iadd(x: BigInteger): this;

  /**
   * BigInteger addition
   * @param {BigInteger} x - Value to add
   * @returns {BigInteger} this + x.
   */
  abstract add(x: BigInteger): BigInteger;

  /**
   * BigInteger subtraction in place
   * @param {BigInteger} x - Value to subtract
   */
  abstract isub(x: BigInteger): this;

  /**
   * BigInteger subtraction
   * @param {BigInteger} x - Value to subtract
   * @returns {BigInteger} this - x.
   */
  abstract sub(x: BigInteger): BigInteger;

  /**
   * BigInteger multiplication in place
   * @param {BigInteger} x - Value to multiply
   */
  abstract imul(x: BigInteger): this;

  /**
   * BigInteger multiplication
   * @param {BigInteger} x - Value to multiply
   * @returns {BigInteger} this * x.
   */
  abstract mul(x: BigInteger): BigInteger;

  /**
   * Compute value modulo m, in place
   * @param {BigInteger} m - Modulo
   */
  abstract imod(m: BigInteger): this;

  /**
   * Compute value modulo m
   * @param {BigInteger} m - Modulo
   * @returns {BigInteger} this mod m.
   */
  abstract mod(m: BigInteger): BigInteger;

  /**
   * Compute modular exponentiation using square and multiply
   * @param {BigInteger} e - Exponent
   * @param {BigInteger} n - Modulo
   * @returns {BigInteger} this ** e mod n.
   */
  abstract modExp(e: BigInteger, n: BigInteger): BigInteger;

  /**
   * Compute the inverse of this value modulo n
   * Note: this and and n must be relatively prime
   * @param {BigInteger} n - Modulo
   * @returns {BigInteger} x such that this*x = 1 mod n
   * @throws {Error} if the inverse does not exist
   */
  abstract modInv(n: BigInteger): BigInteger;
  
  /**
   * BigInteger division, in place
   * @param {BigInteger} n - Value to divide
   */
  abstract idiv(n: BigInteger): BigInteger;
  
  /**
   * BigInteger division
   * @param {BigInteger} n - Value to divide
   * @returns {BigInteger} this divded by n.
   */
  abstract div(n: BigInteger): BigInteger;

  /**
   * Compute greatest common divisor between this and n
   * @param {BigInteger} b - Operand
   * @returns {BigInteger} gcd
   */
  abstract gcd(b: BigInteger): BigInteger;

  /**
   * Shift this to the left by x, in place
   * @param {BigInteger} x - Shift value
   */
  abstract ileftShift(x: BigInteger): this;

  /**
   * Shift this to the left by x
   * @param {BigInteger} x - Shift value
   * @returns {BigInteger} this << x.
   */
  abstract leftShift(x: BigInteger): BigInteger;

  /**
   * Shift this to the right by x, in place
   * @param {BigInteger} x - Shift value
   * @param {Boolean} unsigned - Whether the shift should unsigned (>>>)
   */
  abstract irightShift(x: BigInteger, unsigned?: boolean): BigInteger;

  /**
   * Shift this to the right by x
   * @param {BigInteger} x - Shift value
   * @param {Boolean} unsigned - Whether the shift should unsigned (>>>)
   * @returns {BigInteger} this >> x.
   */
  abstract rightShift(x: BigInteger, unsigned?: boolean): BigInteger;

  /**
   * Whether this value is equal to x
   * @param {BigInteger} x
   * @returns {Boolean}
   */
  abstract equal(x: BigInteger): boolean;

  /**
   * Whether this value is less than x
   * @param {BigInteger} x
   * @returns {Boolean}
   */
  abstract lt(x: BigInteger): boolean;

  /**
   * Whether this value is less than or equal to x
   * @param {BigInteger} x
   * @returns {Boolean}
   */
  abstract lte(x: BigInteger): boolean;

  /**
   * Whether this value is greater than x
   * @param {BigInteger} x
   * @returns {Boolean}
   */
  abstract gt(x: BigInteger): boolean;

  /**
   * Whether this value is greater than or equal to x
   * @param {BigInteger} x
   * @returns {Boolean}
   */
  abstract gte(x: BigInteger): boolean;

  abstract isZero(): boolean;

  abstract isOne(): boolean;

  abstract isNegative(): boolean;

  abstract isEven(): boolean;

  abstract abs(): BigInteger;

  abstract negate(): BigInteger;

  /**
   * Get this value as a string
   * @returns {String} this value.
   */
  abstract toString(): string;

  /**
   * Get this value as an exact Number (max 53 bits)
   * Fails if this value is too large
   * @returns {Number}
   */
  abstract toNumber(): number;

  /**
   * Get value of i-th bit
   * @param {Number} i - Bit index
   * @returns {Number} Bit value.
   */
  abstract getBit(i: number): number;

  abstract ixor(x: BigInteger): this;
  abstract xor(x: BigInteger): BigInteger;
  abstract ibitwiseAnd(x: BigInteger): this;
  abstract bitwiseAnd(x: BigInteger): BigInteger;
  abstract ibitwiseOr(x: BigInteger): BigInteger;

  /**
   * Compute bit length
   * @returns {Number} Bit length.
   */
  abstract bitLength(): number;

  /**
   * Compute byte length
   * @returns {Number} Byte length.
   */
  abstract byteLength(): number;

  /**
   * Get Uint8Array representation of this number
   * @param {String} endian - Endianess of output array (defaults to 'be')
   * @param {Number} length - Of output array
   * @returns {Uint8Array}
   */
  abstract toUint8Array(endian?: string, length?: number): Uint8Array;
}

export { BigInteger, ConcreteBigInteger, BigInteger as default };

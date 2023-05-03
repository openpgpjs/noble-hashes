import { should } from 'micro-should';
// // Tests generated from rust
import './clone.test.js';
import './u64.test.js';
import './utils.test.js';
import './biginteger.test.js'
// Generic hash tests
import './hashes.test.js';
// Specific vectors for hash functions if available
import './keccak.test.js';

should.run();

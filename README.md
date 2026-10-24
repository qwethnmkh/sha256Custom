# sha256Custom
# Vanilla JavaScript SHA-256 Engine

A zero-dependency, first-principles implementation of the SHA-256 cryptographic hash algorithm written entirely in vanilla JavaScript. 

Designed for lightweight, self-contained environments where external cryptographic libraries are unnecessary or restricted.

## Architectural Overview

Unlike standard implementations that rely on native bitwise operators, this engine explicitly constructs the underlying binary mechanics:
- **Message Padding & Chunking:** Manually converts input strings into binary arrays, pads with the required `1` bit, and appends the 64-bit big-endian length.
- **Constants Generation:** Derives initial hash values from the square roots of the first 8 prime numbers and compression constants from the cube roots of the first 64 prime numbers.
- **Core Operations:** Implements explicit binary logic gates from scratch:
  - `choose` / `vote`: Majority and choice selection functions.
  - `slide`: Bitwise rotation mechanics.
  - `sumBits`: 32-bit modular addition with carry handling.
  - `collide`: XOR bit-clash operations.

## Usage

```javascript
const { digest } = require('./sha256.js'); // or your filename

const message = "Hello, World!";
const hash = digest(message);

console.log(hash); 
// Outputs the 256-bit hexadecimal/binary digest string

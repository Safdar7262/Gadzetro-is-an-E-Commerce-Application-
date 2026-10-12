// Small pure-JS SHA-256, used ONLY by the mock auth so no plaintext password is ever stored.
// This is NOT real security: the real backend will hash passwords with BCrypt on the server.
const K = []
const H0 = []
for (let n = 2, count = 0; count < 64; n += 1) {
  let prime = true
  for (let i = 2; i * i <= n; i += 1) if (n % i === 0) { prime = false; break }
  if (!prime) continue
  if (count < 8) H0[count] = (n ** 0.5 % 1) * 2 ** 32 | 0
  K[count] = (n ** (1 / 3) % 1) * 2 ** 32 | 0
  count += 1
}

export function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text)
  const words = []
  bytes.forEach((b, i) => { words[i >> 2] |= b << (24 - (i % 4) * 8) })
  const bitLength = bytes.length * 8
  words[bitLength >> 5] |= 0x80 << (24 - (bitLength % 32))
  words[(((bitLength + 64) >> 9) << 4) + 15] = bitLength
  const h = [...H0]
  const rotr = (x, n) => (x >>> n) | (x << (32 - n))
  for (let i = 0; i < words.length; i += 16) {
    const w = []
    for (let t = 0; t < 64; t += 1) {
      if (t < 16) w[t] = words[i + t] | 0
      else {
        const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3)
        const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10)
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0
      }
    }
    let [a, b, c, d, e, f, g, hh] = h
    for (let t = 0; t < 64; t += 1) {
      const t1 = (hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + w[t]) | 0
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0
      hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0
    }
    ;[a, b, c, d, e, f, g, hh].forEach((v, j) => { h[j] = (h[j] + v) | 0 })
  }
  return h.map((v) => (v >>> 0).toString(16).padStart(8, '0')).join('')
}

// Keyed by the stable user id (not the email), so changing the email never breaks the password.
export const hashPassword = (userId, password) => sha256Hex(`gadzetro-demo:${userId}:${password}`)

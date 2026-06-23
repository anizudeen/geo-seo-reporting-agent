// mulberry32 — deterministic 32-bit PRNG, seed=42 for demo stability
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(42);

export function rand(min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function randFloat(min: number, max: number, decimals = 2) {
  return parseFloat((rng() * (max - min) + min).toFixed(decimals));
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

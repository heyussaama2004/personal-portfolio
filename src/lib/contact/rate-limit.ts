export type RateLimit = {
  check: (key: string, now?: number) => boolean;
};

export function createRateLimit(limit = 5, windowMs = 60_000): RateLimit {
  const hits = new Map<string, number[]>();

  return {
    check(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      return true;
    },
  };
}

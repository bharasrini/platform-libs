function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function withRetry(fn, { retries = 3, baseMs = 300 } = {}) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try { return await fn(i); }
    catch (e) {
      lastErr = e;
      if (i === retries) break;
      await sleep(baseMs * (2 ** i));
    }
  }
  throw lastErr;
}

module.exports = { withRetry };


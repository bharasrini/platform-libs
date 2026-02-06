function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/*
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
*/




async function withRetry(fn, retries = 3, delayMs = 1000) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // 👇 This is critical
      const result = await fn();
      return result;
    } catch (err) {
      lastError = err;
      console.warn(`withRetry: attempt ${attempt + 1} failed:`, err.message);
      if (attempt < retries - 1) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
  }
  throw lastError;
}

module.exports = { withRetry };
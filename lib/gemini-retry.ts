/**
 * Calls a Gemini API function with automatic retry on 503 Service Unavailable.
 * Retries up to 3 times with exponential backoff (1s, 2s, 4s).
 */
export async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const is503 = err?.message?.includes("503") || err?.status === 503;
      const is429 = err?.message?.includes("429") || err?.status === 429;
      if ((is503 || is429) && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.warn(`Gemini ${is503 ? "503" : "429"} — retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

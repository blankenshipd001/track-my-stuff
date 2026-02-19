interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  skipRetryDuringBuild?: boolean; // Skip retries during build/prerendering
}

/**
 * Fetch with exponential backoff retry logic and rate limit handling
 * Compatible with Next.js fetch API and caching
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    backoffMultiplier = 2,
    skipRetryDuringBuild = true, // Default to skipping retries during build
  } = retryOptions;

  let lastError: Error | null = null;
  
  // During build/prerendering, skip retries to avoid hanging promises
  const effectiveMaxRetries = skipRetryDuringBuild && process.env.NODE_ENV === 'production' ? 1 : maxRetries;

  for (let attempt = 0; attempt < effectiveMaxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Check rate limit headers
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const resetTime = response.headers.get('X-RateLimit-Reset');

      if (remaining && parseInt(remaining, 10) < 10) {
        console.warn(`[Rate Limit] Only ${remaining} requests remaining until reset at ${resetTime}`);
      }

      // Don't retry on client errors (4xx) except 429
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return response;
      }

      // Retry on server errors (5xx) and rate limits (429)
      if (response.status >= 500 || response.status === 429) {
        if (attempt === effectiveMaxRetries - 1) {
          return response;
        }

        // Calculate backoff delay
        const delayMs = Math.min(
          initialDelayMs * Math.pow(backoffMultiplier, attempt),
          maxDelayMs
        );

        console.warn(
          `[Retry] Attempt ${attempt + 1}/${effectiveMaxRetries} failed with status ${response.status}. ` +
          `Retrying in ${delayMs}ms...`
        );

        // Only use setTimeout if not during build
        if (effectiveMaxRetries > 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
        continue;
      }

      return response;
    } catch (error) {
      lastError = error as Error;

      if (attempt === effectiveMaxRetries - 1) {
        throw error;
      }

      const delayMs = Math.min(
        initialDelayMs * Math.pow(backoffMultiplier, attempt),
        maxDelayMs
      );

      console.warn(
        `[Retry] Attempt ${attempt + 1}/${effectiveMaxRetries} failed with error: ${lastError.message}. ` +
        `Retrying in ${delayMs}ms...`
      );

      // Only use setTimeout if not during build
      if (effectiveMaxRetries > 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw new Error(`Failed after ${effectiveMaxRetries} attempts. Last error: ${lastError?.message}`);
}

/**
 * Wrapper for fetchWithRetry that automatically converts response to JSON
 */
export async function fetchJsonWithRetry<T>(
  url: string,
  options?: RequestInit,
  retryOptions?: RetryOptions
): Promise<T> {
  const response = await fetchWithRetry(url, options, retryOptions);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

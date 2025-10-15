/**
 * Connection utilities for resilient connectivity
 */

/**
 * Fetch with a single quick retry
 * Provides resilience without long delays
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 1,
  onRetry?: (attempt: number) => void
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < retries + 1; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })
      return response
    } catch (error) {
      lastError = error as Error

      // Don't retry on last attempt
      if (attempt === retries) {
        break
      }

      // Notify about retry
      if (onRetry) {
        onRetry(attempt + 1)
      }

      // Short delay before retry: just 500ms
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  throw lastError || new Error('Network request failed')
}

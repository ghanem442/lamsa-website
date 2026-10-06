/**
 * Prisma Retry Utility
 * Handles Neon serverless database cold starts and transient connection errors
 * 
 * Retries on Prisma error P1001 (Can't reach database server)
 * Common when Neon free tier suspends compute after 5 minutes idle
 */

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500; // 1.5 seconds between retries

/**
 * Sleep helper for retry delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if error is a transient Prisma connection error
 */
function isTransientError(error) {
  // P1001: Can't reach database server
  // P1008: Operations timed out
  // P1017: Server has closed the connection
  const transientCodes = ['P1001', 'P1008', 'P1017'];
  return error?.code && transientCodes.includes(error.code);
}

/**
 * Retry wrapper for Prisma database operations
 * 
 * Usage:
 *   const users = await withRetry(() => prisma.user.findMany());
 * 
 * @param {Function} operation - Async function that performs Prisma query
 * @param {number} maxRetries - Maximum retry attempts (default: 3)
 * @returns {Promise} - Result of the operation
 */
async function withRetry(operation, maxRetries = MAX_RETRIES) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Only retry on transient connection errors
      if (!isTransientError(error)) {
        throw error;
      }
      
      // Don't delay after last attempt
      if (attempt < maxRetries) {
        const delay = RETRY_DELAY_MS * attempt; // Exponential backoff
        console.warn(
          `[Prisma Retry] Attempt ${attempt}/${maxRetries} failed with ${error.code}. ` +
          `Retrying in ${delay}ms...`
        );
        await sleep(delay);
      }
    }
  }
  
  // All retries exhausted
  console.error(
    `[Prisma Retry] All ${maxRetries} attempts failed. Last error: ${lastError.code}`
  );
  throw lastError;
}

module.exports = { withRetry };

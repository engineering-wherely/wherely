export async function addToCart(
  count: number,
  { signal }: { signal: AbortSignal },
) {
  await delay(1000, signal);
  return count + 1;
}

export async function removeFromCart(
  count: number,
  { signal }: { signal: AbortSignal },
) {
  await delay(1000, signal);
  return count - 1;
}

function delay(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    // A queued Action may already be cancelled before it starts.
    signal.throwIfAborted();

    const timeout = setTimeout(() => {
      signal.removeEventListener("abort", handleAbort);
      resolve();
    }, milliseconds);

    function handleAbort() {
      clearTimeout(timeout);
      reject(signal.reason);
    }

    signal.addEventListener("abort", handleAbort, { once: true });
  });
}

import { shouldApply, sleep } from "./utils/chaos";

type ChaosOptions = {
  failRate?: number;
  delayMs?: number;
  include?: string[];
  exclude?: string[];
  mode?: "reject" | "http-500";
};

let originalFetch: typeof fetch | null = null;

export function enableChaos(opts: ChaosOptions = {}) {
  if (originalFetch) return;

  const {
    failRate = 0.2,
    delayMs = 0,
    include = [],
    exclude = [],
    mode = "reject",
  } = opts;

  originalFetch = window.fetch;

  window.fetch = async (input, init) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof Request
        ? input.url
        : input.toString();

    if (!shouldApply(url, include, exclude)) {
      return originalFetch!(input, init);
    }

    if (Math.random() < failRate) {
      if (delayMs) await sleep(delayMs);

      if (mode === "reject") {
        return Promise.reject(new TypeError("NetworkError: all i see is haze"));
      }

      return new Response(null, { status: 500 });
    }

    if (delayMs) await sleep(delayMs);

    return originalFetch!(input, init);
  };
}

export function disableChaos() {
  if (originalFetch) {
    window.fetch = originalFetch;
    originalFetch = null;
  }
}

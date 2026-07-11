import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

/**
 * Returns the current request origin (scheme + host), computed from the
 * incoming request headers. Used to build absolute canonical / og:url /
 * hreflang URLs at SSR time.
 */
export const getRequestOrigin = createServerFn({ method: "GET" }).handler(() => {
  try {
    const req = getRequest();
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    if (!host) return "";
    return `${proto}://${host}`;
  } catch {
    return "";
  }
});

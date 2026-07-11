import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { pickLocaleFromAcceptLanguage, type Locale } from "@/lib/i18n";

/**
 * Server-side locale detection based on the Accept-Language header of the
 * incoming SSR request. Called from `beforeLoad` on the public layout to
 * pick a preferred locale when the URL has no /ar or /en prefix.
 */
export const resolveLocale = createServerFn({ method: "GET" }).handler(async (): Promise<Locale> => {
  try {
    const req = getRequest();
    return pickLocaleFromAcceptLanguage(req?.headers.get("accept-language"));
  } catch {
    return "ar";
  }
});

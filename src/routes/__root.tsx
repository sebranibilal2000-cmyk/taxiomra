import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, createRootRouteWithContext, useRouter, useRouterState, HeadContent, Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { localeFromPath, DEFAULT_LOCALE } from "@/lib/i18n";

import appCss from "../styles.css?url";
import { reportLovableError, installGlobalErrorHandlers } from "../lib/lovable-error-reporting";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { errorToMessage } from "@/lib/errors";
import { SITE } from "@/lib/site-info";
import { HeadInjector } from "@/components/HeadInjector";
import { ContactInfoProvider } from "@/lib/contact-info";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">الصفحة غير موجودة / Page not found</p>
        <a href="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { console.error(error); reportLovableError(error, { boundary: "root" }); }, [error]);
  const friendly = errorToMessage(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">حدث خطأ / Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{friendly}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Try again</button>
          <a href="/" className="rounded-md border px-4 py-2 text-sm font-medium">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE.brand.en} | Jeddah Airport Taxi to Makkah` },
      { name: "description", content: "Book your Jeddah Airport to Makkah taxi with Omra Taxi. Fixed prices, professional drivers, modern vehicles and 24/7 airport transfer service." },
      { name: "theme-color", content: "#0d0d0d" },
      { property: "og:site_name", content: SITE.brand.en },
      { property: "og:title", content: `${SITE.brand.en} | Jeddah Airport Taxi to Makkah` },
      { property: "og:description", content: "Book your Jeddah Airport to Makkah taxi with Omra Taxi. Fixed prices, professional drivers, modern vehicles and 24/7 airport transfer service." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "تاكسي العمرة - تاكسي من مطار جدة إلى مكة المكرمة" },
      { property: "og:title", content: "تاكسي العمرة - تاكسي من مطار جدة إلى مكة المكرمة" },
      { name: "twitter:title", content: "تاكسي العمرة - تاكسي من مطار جدة إلى مكة المكرمة" },
      { name: "twitter:description", content: "Book your Jeddah Airport to Makkah taxi with Omra Taxi. Fixed prices, professional drivers, modern vehicles and 24/7 airport transfer service." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/yTgJBA4SfjVCi3apFH5XARkLEQi1/social-images/social-1783936969962-Gemini_Generated_Image_9nz6uv9nz6uv9nz6-removebg-preview.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/yTgJBA4SfjVCi3apFH5XARkLEQi1/social-images/social-1783936969962-Gemini_Generated_Image_9nz6uv9nz6uv9nz6-removebg-preview.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/x-icon", sizes: "32x32", href: "/favicon.ico" },
      { rel: "icon", type: "image/x-icon", sizes: "16x16", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // Resolve locale from the pathname so SSR emits the correct <html lang/dir>
  // for /ar/* vs /en/*. Falls back to the default when the prefix is absent.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = localeFromPath(pathname) ?? DEFAULT_LOCALE;
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => { installGlobalErrorHandlers(); }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <HeadInjector />
            <ContactInfoProvider>
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </ContactInfoProvider>
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

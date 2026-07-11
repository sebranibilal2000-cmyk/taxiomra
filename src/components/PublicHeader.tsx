import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { CarTaxiFront, Menu, X, Phone, MessageCircle, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";

export function PublicHeader() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);

  const nav = [
    { to: "/", label: locale === "ar" ? "الرئيسية" : "Home" },
    { to: "/about", label: locale === "ar" ? "من نحن" : "About" },
    { to: "/services", label: locale === "ar" ? "خدماتنا" : "Services" },
    { to: "/fleet", label: locale === "ar" ? "الأسطول" : "Fleet" },
    { to: "/pricing", label: locale === "ar" ? "الأسعار" : "Pricing" },
    { to: "/blog", label: locale === "ar" ? "المدونة" : "Blog" },
    { to: "/faq", label: locale === "ar" ? "الأسئلة الشائعة" : "FAQ" },
    { to: "/contact", label: locale === "ar" ? "تواصل" : "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CarTaxiFront className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline">{SITE.brand[locale]}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "px-3 py-2 text-sm font-semibold text-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            aria-label={t("toggle_lang")}
          >
            <Languages className="h-4 w-4" />
          </Button>
          <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
            <a href={telLink()} aria-label={locale === "ar" ? "اتصل بنا" : "Call us"}>
              <Phone className="h-4 w-4 me-2" /> {SITE.phone}
            </a>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex bg-green-600 hover:bg-green-700">
            <a href={waLink()} target="_blank" rel="noopener">
              <MessageCircle className="h-4 w-4 me-2" /> {locale === "ar" ? "واتساب" : "WhatsApp"}
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-background">
          <nav className="container mx-auto flex flex-col p-4 gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-2">
              <Button asChild variant="outline" className="flex-1">
                <a href={telLink()}><Phone className="h-4 w-4 me-2" /> {locale === "ar" ? "اتصل" : "Call"}</a>
              </Button>
              <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                <a href={waLink()} target="_blank" rel="noopener"><MessageCircle className="h-4 w-4 me-2" /> WhatsApp</a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

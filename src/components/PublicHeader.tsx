import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone, MessageCircle, Languages, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { SITE, waLink, telLink } from "@/lib/site-info";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const { locale, setLocale, t } = useI18n();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const nav = [
    { to: "/", label: locale === "ar" ? "الرئيسية" : "Home" },
    { to: "/services", label: locale === "ar" ? "الخدمات" : "Services" },
    { to: "/fleet", label: locale === "ar" ? "الأسطول" : "Fleet" },
    { to: "/pricing", label: locale === "ar" ? "الأسعار" : "Pricing" },
    { to: "/blog", label: locale === "ar" ? "المدونة" : "Journal" },
    { to: "/about", label: locale === "ar" ? "من نحن" : "About" },
    { to: "/contact", label: locale === "ar" ? "تواصل" : "Contact" },
  ] as const;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-xl shadow-elegant"
          : "bg-transparent"
      )}
    >
      <div className="container-tight flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group" aria-label={SITE.brand[locale]}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <span className="font-display text-xl leading-none">S</span>
            <span className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-background" />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-lg tracking-tight">{SITE.brand[locale]}</span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Chauffeur · 24/7</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "relative px-3 py-2 text-sm font-semibold text-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            aria-label={t("toggle_lang")}
            className="rounded-full"
          >
            <Languages className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="rounded-full">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button asChild size="sm" variant="ghost" className="hidden md:inline-flex rounded-full">
            <a href={telLink()} aria-label={locale === "ar" ? "اتصل بنا" : "Call us"}>
              <Phone className="h-4 w-4 me-2" /> {SITE.phone}
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden md:inline-flex rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant"
          >
            <a href={waLink()} target="_blank" rel="noopener">
              <MessageCircle className="h-4 w-4 me-2" /> {locale === "ar" ? "احجز الآن" : "Book now"}
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden rounded-full" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl animate-fade-in">
          <nav className="container-tight flex flex-col py-4 gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-3">
              <Button asChild variant="outline" className="flex-1 rounded-full">
                <a href={telLink()}><Phone className="h-4 w-4 me-2" /> {locale === "ar" ? "اتصل" : "Call"}</a>
              </Button>
              <Button asChild className="flex-1 rounded-full bg-primary text-primary-foreground">
                <a href={waLink()} target="_blank" rel="noopener"><MessageCircle className="h-4 w-4 me-2" /> WhatsApp</a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

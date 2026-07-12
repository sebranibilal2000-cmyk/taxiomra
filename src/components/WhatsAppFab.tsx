// Sticky floating action buttons: WhatsApp (primary) + Phone (secondary).
// Kept in this file / under this export name for backward compatibility —
// the public layout mounts `<WhatsAppFab />` sitewide.
import { MessageCircle, Phone } from "lucide-react";
import { waLink, telLink, SITE } from "@/lib/site-info";
import { useI18n } from "@/lib/i18n";

export function WhatsAppFab() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const waText = ar ? "أرغب بحجز تاكسي" : "I'd like to book a chauffeur";

  return (
    <div
      className="fixed bottom-6 end-6 z-50 flex flex-col items-end gap-3"
      role="group"
      aria-label={ar ? "أزرار الحجز السريع" : "Quick booking actions"}
    >
      {/* Phone — secondary sticky action (spec: sticky phone button required). */}
      <a
        href={telLink()}
        aria-label={ar ? `اتصل بنا ${SITE.phone}` : `Call us ${SITE.phone}`}
        className="group inline-flex items-center gap-2 rounded-full bg-background text-foreground pe-5 ps-2 py-2 shadow-lift ring-1 ring-gold/50 hover:ring-gold transition-all hover:-translate-y-0.5"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-primary">
          <Phone className="h-5 w-5" />
        </span>
        <span className="hidden sm:inline text-sm font-medium">
          {ar ? "اتصل الآن" : "Call now"}
        </span>
      </a>

      {/* WhatsApp — primary sticky action. */}
      <a
        href={waLink(waText)}
        target="_blank"
        rel="noopener"
        aria-label={ar ? "احجز عبر واتساب" : "Book via WhatsApp"}
        className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground pe-5 ps-2 py-2 shadow-lift ring-1 ring-gold/40 hover:ring-gold transition-all hover:-translate-y-0.5"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-primary">
          <MessageCircle className="h-5 w-5" />
        </span>
        <span className="hidden sm:inline text-sm font-medium">
          {ar ? "احجز عبر واتساب" : "Book via WhatsApp"}
        </span>
      </a>
    </div>
  );
}

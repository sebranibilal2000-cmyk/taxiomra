import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site-info";
import { useI18n } from "@/lib/i18n";

export function WhatsAppFab() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  return (
    <a
      href={waLink(ar ? "أرغب بحجز تاكسي" : "I'd like to book a chauffeur")}
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp"
      className="group fixed bottom-6 end-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground pe-5 ps-2 py-2 shadow-lift ring-1 ring-gold/40 hover:ring-gold transition-all hover:-translate-y-0.5"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-primary">
        <MessageCircle className="h-5 w-5" />
      </span>
      <span className="hidden sm:inline text-sm font-medium">
        {ar ? "احجز عبر واتساب" : "Book via WhatsApp"}
      </span>
    </a>
  );
}

import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site-info";
import { useI18n } from "@/lib/i18n";

export function WhatsAppFab() {
  const { locale } = useI18n();
  return (
    <a
      href={waLink(locale === "ar" ? "أرغب بحجز تاكسي" : "I'd like to book a taxi")}
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp"
      className="fixed bottom-6 end-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

// Sticky floating action buttons: WhatsApp (primary) + Phone (secondary).
// Reads WhatsApp number and default message from DB settings so admins can
// change them from /admin/settings without a rebuild.
import { MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { telLink, SITE } from "@/lib/site-info";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export function WhatsAppFab() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  const [waNumber, setWaNumber] = useState(SITE.whatsapp);
  const [waMessage, setWaMessage] = useState(ar ? "أرغب بحجز تاكسي" : "I'd like to book a chauffeur");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("settings")
        .select("key,value")
        .in("key", ["whatsapp_number", "whatsapp_default_message"]);
      const get = (k: string) => {
        const row = data?.find((r: any) => r.key === k);
        if (!row) return "";
        return typeof row.value === "string" ? row.value : (row.value?.value ?? "");
      };
      const n = get("whatsapp_number");
      const m = get("whatsapp_default_message");
      if (n) setWaNumber(String(n).replace(/[^\d]/g, ""));
      if (m) setWaMessage(String(m));
    })();
  }, []);

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div
      className="fixed bottom-6 end-6 z-50 flex flex-col items-end gap-3"
      role="group"
      aria-label={ar ? "أزرار الحجز السريع" : "Quick booking actions"}
    >
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
      <a
        href={waHref}
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

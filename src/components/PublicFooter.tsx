import { Link } from "@tanstack/react-router";
import { CarTaxiFront, Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE, waLink, telLink } from "@/lib/site-info";

export function PublicFooter() {
  const { locale } = useI18n();
  const ar = locale === "ar";
  return (
    <footer className="border-t bg-muted/40 mt-16">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CarTaxiFront className="h-5 w-5" />
            </div>
            {SITE.brand[locale]}
          </div>
          <p className="text-sm text-muted-foreground">{SITE.tagline[locale]}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">{ar ? "الخدمات" : "Services"}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/p/$slug" params={{ slug: "airport-transfer" }} className="hover:text-foreground">{ar ? "نقل المطار" : "Airport Transfer"}</Link></li>
            <li><Link to="/p/$slug" params={{ slug: "hotel-transfer" }} className="hover:text-foreground">{ar ? "نقل الفنادق" : "Hotel Transfers"}</Link></li>
            <li><Link to="/p/$slug" params={{ slug: "corporate" }} className="hover:text-foreground">{ar ? "نقل الشركات" : "Corporate"}</Link></li>
            <li><Link to="/fleet" className="hover:text-foreground">{ar ? "الأسطول" : "Fleet"}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">{ar ? "الشركة" : "Company"}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">{ar ? "من نحن" : "About"}</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">{ar ? "المدونة" : "Blog"}</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">{ar ? "الأسئلة الشائعة" : "FAQ"}</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground">{ar ? "سياسة الخصوصية" : "Privacy"}</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">{ar ? "الشروط والأحكام" : "Terms"}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">{ar ? "تواصل" : "Contact"}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /><a href={telLink()} className="hover:text-foreground">{SITE.phone}</a></li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /><a href={waLink()} target="_blank" rel="noopener" className="hover:text-foreground">WhatsApp</a></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /><a href={`mailto:${SITE.email}`} className="hover:text-foreground">{SITE.email}</a></li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" />{SITE.address[locale]}</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 py-4 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} {SITE.brand[locale]}. {ar ? "جميع الحقوق محفوظة." : "All rights reserved."}</span>
          <Link to="/auth" className="hover:text-foreground">{ar ? "دخول الموظفين" : "Staff sign in"}</Link>
        </div>
      </div>
    </footer>
  );
}

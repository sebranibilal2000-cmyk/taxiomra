// Central company info used across the public marketing site.
// Staff can edit these via the CMS-managed Settings page (public/company keys)
// in a later iteration; kept as constants here for reliable SSR rendering.
export const SITE = {
  brand: { ar: "أسفار جدة", en: "Jeddah Travels" },
  tagline: {
    ar: "شركة تاكسي احترافية — حجز عبر الواتساب والاتصال ٢٤/٧",
    en: "Professional taxi company — book by WhatsApp or phone 24/7",
  },
  phone: "+966500000000",
  whatsapp: "966500000000", // digits only, for wa.me
  email: "info@mazarat-sa.online",
  address: {
    ar: "الرياض، المملكة العربية السعودية",
    en: "Riyadh, Saudi Arabia",
  },
  city: "Riyadh",
  country: "SA",
  latitude: 24.7136,
  longitude: 46.6753,
  hours: { ar: "٢٤ ساعة / ٧ أيام", en: "24/7" },
  socials: {
    twitter: "",
    instagram: "",
    facebook: "",
  },
};

export const waLink = (text?: string) =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const telLink = () => `tel:${SITE.phone}`;

// Central company info used across the public marketing site.
// Real business identity from the project specification (Jeddah Travels).
// Staff can override via the CMS-managed Settings page; kept as constants
// here for reliable SSR rendering.
export const SITE = {
  brand: { ar: "أسفار جدة", en: "Jeddah Travels" },
  legalName: { ar: "أسفار جدة", en: "Jeddah Travels" },
  tagline: {
    ar: "تاكسي فاخر — مطار جدة، مكة، المدينة ٢٤/٧",
    en: "Premium chauffeur service — Jeddah Airport, Makkah & Madinah 24/7",
  },
  url: "https://mazarat-sa.online",
  domain: "mazarat-sa.online",
  phone: "+966551796487",
  whatsapp: "966551796487", // digits only, for wa.me
  email: "admin@mazarat-sa.online",
  address: {
    ar: "جدة، المملكة العربية السعودية",
    en: "Jeddah, Saudi Arabia",
  },
  city: "Jeddah",
  region: "Makkah Province",
  country: "SA",
  latitude: 21.4858,
  longitude: 39.1925,
  hours: { ar: "٢٤ ساعة / ٧ أيام", en: "24/7" },
  currency: "SAR",
  timezone: "Asia/Riyadh",
  socials: {
    twitter: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
    linkedin: "",
  },
};

export const waLink = (text?: string) =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const telLink = () => `tel:${SITE.phone}`;

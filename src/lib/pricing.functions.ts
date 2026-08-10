import { createServerFn } from "@tanstack/react-start";

export interface PricingRoute {
  id: string;
  from_ar: string;
  from_en: string;
  to_ar: string;
  to_en: string;
  economyPrice?: string; // starts from...
  suvPrice?: string;
  vipPrice?: string;
  category: "jeddah" | "makkah" | "madinah" | "taif" | "riyadh" | "dammam" | "airport" | "intercity";
}

export const PRICING_DATA: PricingRoute[] = [
  // --- Jeddah ---
  { id: "jed-to-jed-apt", from_ar: "جدة", from_en: "Jeddah", to_ar: "مطار جدة", to_en: "Jeddah Airport", economyPrice: "150", suvPrice: "250", vipPrice: "500", category: "jeddah" },
  { id: "jed-apt-to-jed", from_ar: "مطار جدة", from_en: "Jeddah Airport", to_ar: "جدة", to_en: "Jeddah", economyPrice: "150", suvPrice: "250", vipPrice: "500", category: "airport" },
  { id: "jed-to-makkah", from_ar: "جدة", from_en: "Jeddah", to_ar: "مكة المكرمة", to_en: "Makkah", economyPrice: "200", suvPrice: "350", vipPrice: "600", category: "jeddah" },
  { id: "makkah-to-jed", from_ar: "مكة المكرمة", from_en: "Makkah", to_ar: "جدة", to_en: "Jeddah", economyPrice: "190", suvPrice: "300", vipPrice: "500", category: "makkah" },
  { id: "jed-to-madinah", from_ar: "جدة", from_en: "Jeddah", to_ar: "المدينة المنورة", to_en: "Madinah", economyPrice: "500", suvPrice: "700", vipPrice: "1000", category: "jeddah" },
  { id: "mad-to-jed", from_ar: "المدينة المنورة", from_en: "Madinah", to_ar: "جدة", to_en: "Jeddah", economyPrice: "450", suvPrice: "700", vipPrice: "1000", category: "madinah" },
  { id: "jed-to-taif-rt", from_ar: "جدة", from_en: "Jeddah", to_ar: "الطائف (ذهاب وعودة)", to_en: "Taif (Round Trip)", economyPrice: "500", suvPrice: "700", vipPrice: "1000", category: "jeddah" },
  
  // --- Makkah ---
  { id: "makkah-apt-jed", from_ar: "مكة المكرمة", from_en: "Makkah", to_ar: "مطار جدة", to_en: "Jeddah Airport", economyPrice: "190", suvPrice: "300", vipPrice: "500", category: "makkah" },
  { id: "jed-apt-makkah", from_ar: "مطار جدة", from_en: "Jeddah Airport", to_ar: "مكة المكرمة", to_en: "Makkah", economyPrice: "200", suvPrice: "350", vipPrice: "500", category: "airport" },
  { id: "makkah-to-mad", from_ar: "مكة المكرمة", from_en: "Makkah", to_ar: "المدينة المنورة", to_en: "Madinah", economyPrice: "400", suvPrice: "600", vipPrice: "1000", category: "makkah" },
  { id: "mad-to-makkah", from_ar: "المدينة المنورة", from_en: "Madinah", to_ar: "مكة المكرمة", to_en: "Makkah", economyPrice: "400", suvPrice: "600", vipPrice: "800", category: "madinah" },
  { id: "makkah-train", from_ar: "مكة المكرمة", from_en: "Makkah", to_ar: "محطة قطار مكة", to_en: "Makkah Train Station", economyPrice: "100", suvPrice: "200", vipPrice: "300", category: "makkah" },
  { id: "makkah-taneem", from_ar: "مكة المكرمة", from_en: "Makkah", to_ar: "مسجد عائشة / التنعيم", to_en: "Masjid Aisha / Taneem", economyPrice: "90", suvPrice: "150", vipPrice: "300", category: "makkah" },
  { id: "makkah-jaaranah", from_ar: "مكة المكرمة", from_en: "Makkah", to_ar: "مسجد الجعرانة", to_en: "Masjid Jaaranah", economyPrice: "100", suvPrice: "200", vipPrice: "400", category: "makkah" },
  { id: "makkah-taif-rt", from_ar: "مكة المكرمة", from_en: "Makkah", to_ar: "الطائف (ذهاب وعودة)", to_en: "Taif (Round Trip)", economyPrice: "400", suvPrice: "600", vipPrice: "800", category: "makkah" },

  // --- Madinah ---
  { id: "med-apt-hotel", from_ar: "مطار المدينة", from_en: "Madinah Airport", to_ar: "فندق في المدينة", to_en: "Hotel in Madinah", economyPrice: "100", suvPrice: "200", vipPrice: "300", category: "airport" },
  { id: "hotel-med-apt", from_ar: "فندق في المدينة", from_en: "Hotel in Madinah", to_ar: "مطار المدينة", to_en: "Madinah Airport", economyPrice: "100", suvPrice: "200", vipPrice: "300", category: "airport" },
  { id: "med-train", from_ar: "المدينة المنورة", from_en: "Madinah", to_ar: "محطة قطار المدينة", to_en: "Madinah Train Station", economyPrice: "100", suvPrice: "150", vipPrice: "300", category: "madinah" },
  { id: "med-ziyarat", from_ar: "المدينة المنورة", from_en: "Madinah", to_ar: "مزارات المدينة + وادي الجن", to_en: "Madinah Ziyarat + Wadi Al-Jinn", economyPrice: "200", suvPrice: "350", vipPrice: "500", category: "madinah" },
];

export const getPricingData = createServerFn({ method: "GET" }).handler(async () => {
  return PRICING_DATA;
});

export const getPriceForRoute = (routeId: string, vehicleType: 'economyPrice' | 'suvPrice' | 'vipPrice' = 'economyPrice') => {
  const route = PRICING_DATA.find(r => r.id === routeId);
  if (!route) return null;
  return route[vehicleType] || "اطلب السعر";
};
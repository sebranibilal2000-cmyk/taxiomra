import { createServerFn } from "@tanstack/react-start";

export interface PricingRoute {
  id: string;
  from_ar: string;
  from_en: string;
  to_ar: string;
  to_en: string;
  sedan?: string;
  suv?: string;
  van?: string;
  vip?: string;
  category: "jeddah" | "makkah" | "madinah" | "taif" | "riyadh" | "dammam" | "airport" | "intercity";
}

export const PRICING_DATA: PricingRoute[] = [
  // --- Makkah to Jeddah (Specified: Starts from 190 SAR) ---
  {
    id: "makkah-jeddah",
    from_ar: "مكة المكرمة",
    from_en: "Makkah",
    to_ar: "جدة",
    to_en: "Jeddah",
    sedan: "190",
    suv: "اطلب السعر",
    van: "اطلب السعر",
    category: "makkah",
  },
  // --- Jeddah to Makkah ---
  {
    id: "jeddah-makkah",
    from_ar: "جدة",
    from_en: "Jeddah",
    to_ar: "مكة المكرمة",
    to_en: "Makkah",
    sedan: "250",
    suv: "اطلب السعر",
    van: "اطلب السعر",
    category: "jeddah",
  },
  // --- Jeddah Airport ---
  {
    id: "jeddah-apt-makkah",
    from_ar: "مطار جدة (JED)",
    from_en: "Jeddah Airport (JED)",
    to_ar: "مكة المكرمة",
    to_en: "Makkah",
    sedan: "250",
    suv: "400",
    van: "450",
    category: "airport",
  },
  {
    id: "jeddah-apt-madinah",
    from_ar: "مطار جدة (JED)",
    from_en: "Jeddah Airport (JED)",
    to_ar: "المدينة المنورة",
    to_en: "Madinah",
    sedan: "850",
    suv: "1200",
    van: "1300",
    category: "airport",
  },
  {
    id: "jeddah-apt-jeddah-city",
    from_ar: "مطار جدة (JED)",
    from_en: "Jeddah Airport (JED)",
    to_ar: "داخل جدة",
    to_en: "Within Jeddah",
    sedan: "120",
    suv: "200",
    van: "220",
    category: "airport",
  },
  // --- Makkah ---
  {
    id: "makkah-madinah",
    from_ar: "مكة المكرمة",
    from_en: "Makkah",
    to_ar: "المدينة المنورة",
    to_en: "Madinah",
    sedan: "850",
    suv: "1200",
    van: "1300",
    category: "makkah",
  },
  {
    id: "makkah-taif",
    from_ar: "مكة المكرمة",
    from_en: "Makkah",
    to_ar: "الطائف",
    to_en: "Taif",
    sedan: "اطلب السعر",
    category: "makkah",
  },
  // --- Madinah ---
  {
    id: "madinah-apt-city",
    from_ar: "مطار المدينة (MED)",
    from_en: "Madinah Airport (MED)",
    to_ar: "داخل المدينة",
    to_en: "Within Madinah",
    sedan: "اطلب السعر",
    category: "airport",
  },
  {
    id: "madinah-makkah",
    from_ar: "المدينة المنورة",
    from_en: "Madinah",
    to_ar: "مكة المكرمة",
    to_en: "Makkah",
    sedan: "850",
    category: "madinah",
  },
  // --- Riyadh ---
  {
    id: "riyadh-apt-city",
    from_ar: "مطار الرياض (RUH)",
    from_en: "Riyadh Airport (RUH)",
    to_ar: "داخل الرياض",
    to_en: "Within Riyadh",
    sedan: "اطلب السعر",
    category: "airport",
  },
  // --- Dammam ---
  {
    id: "dammam-apt-city",
    from_ar: "مطار الدمام (DMM)",
    from_en: "Dammam Airport (DMM)",
    to_ar: "داخل الدمام",
    to_en: "Within Dammam",
    sedan: "اطلب السعر",
    category: "airport",
  },
  // --- Taif ---
  {
    id: "taif-apt-city",
    from_ar: "مطار الطائف (TIF)",
    from_en: "Taif Airport (TIF)",
    to_ar: "داخل الطائف",
    to_en: "Within Taif",
    sedan: "اطلب السعر",
    category: "airport",
  },
];

export const getPricingData = createServerFn({ method: "GET" }).handler(async () => {
  return PRICING_DATA;
});

export const getPriceForRoute = (routeId: string, vehicleType: 'sedan' | 'suv' | 'van' | 'vip' = 'sedan') => {
  const route = PRICING_DATA.find(r => r.id === routeId);
  if (!route) return null;
  return route[vehicleType] || "اطلب السعر";
};

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "ar" | "en";

type Dict = Record<string, { ar: string; en: string }>;

const dict: Dict = {
  // nav
  dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  bookings: { ar: "الحجوزات", en: "Bookings" },
  customers: { ar: "العملاء", en: "Customers" },
  drivers: { ar: "السائقون", en: "Drivers" },
  fleet: { ar: "الأسطول", en: "Fleet" },
  categories: { ar: "فئات المركبات", en: "Vehicle Categories" },
  routes: { ar: "المسارات", en: "Routes" },
  pricing: { ar: "التسعير", en: "Pricing" },
  coupons: { ar: "الكوبونات", en: "Coupons" },
  payments: { ar: "المدفوعات", en: "Payments" },
  notifications: { ar: "الإشعارات", en: "Notifications" },
  reports: { ar: "التقارير", en: "Reports" },
  users: { ar: "المستخدمون", en: "Users" },
  roles: { ar: "الأدوار والصلاحيات", en: "Roles & Permissions" },
  settings: { ar: "الإعدادات", en: "Settings" },
  audit: { ar: "سجل التدقيق", en: "Audit Logs" },
  // widgets
  trips_today: { ar: "رحلات اليوم", en: "Trips Today" },
  revenue: { ar: "الإيرادات", en: "Revenue" },
  available_drivers: { ar: "سائقون متاحون", en: "Available Drivers" },
  active_trips: { ar: "رحلات نشطة", en: "Active Trips" },
  pending_bookings: { ar: "حجوزات معلقة", en: "Pending Bookings" },
  total_customers: { ar: "إجمالي العملاء", en: "Total Customers" },
  // common
  search: { ar: "بحث…", en: "Search…" },
  signout: { ar: "تسجيل الخروج", en: "Sign out" },
  signin: { ar: "تسجيل الدخول", en: "Sign in" },
  signup: { ar: "إنشاء حساب", en: "Sign up" },
  email: { ar: "البريد الإلكتروني", en: "Email" },
  password: { ar: "كلمة المرور", en: "Password" },
  fullname: { ar: "الاسم الكامل", en: "Full name" },
  new: { ar: "جديد", en: "New" },
  create: { ar: "إنشاء", en: "Create" },
  save: { ar: "حفظ", en: "Save" },
  cancel: { ar: "إلغاء", en: "Cancel" },
  edit: { ar: "تعديل", en: "Edit" },
  delete: { ar: "حذف", en: "Delete" },
  status: { ar: "الحالة", en: "Status" },
  actions: { ar: "إجراءات", en: "Actions" },
  loading: { ar: "جارٍ التحميل…", en: "Loading…" },
  no_data: { ar: "لا توجد بيانات", en: "No data" },
  code: { ar: "الرمز", en: "Code" },
  name: { ar: "الاسم", en: "Name" },
  phone: { ar: "الهاتف", en: "Phone" },
  total: { ar: "الإجمالي", en: "Total" },
  fare: { ar: "الأجرة", en: "Fare" },
  pickup: { ar: "نقطة الانطلاق", en: "Pickup" },
  dropoff: { ar: "الوجهة", en: "Destination" },
  category: { ar: "الفئة", en: "Category" },
  customer: { ar: "العميل", en: "Customer" },
  driver: { ar: "السائق", en: "Driver" },
  vehicle: { ar: "المركبة", en: "Vehicle" },
  plate: { ar: "رقم اللوحة", en: "Plate #" },
  seats: { ar: "المقاعد", en: "Seats" },
  brand: { ar: "سُرعة تاكسي", en: "Sur3a Taxi" },
  admin_panel: { ar: "لوحة الإدارة", en: "Admin Panel" },
  welcome: { ar: "مرحباً بك", en: "Welcome back" },
  auth_subtitle: { ar: "سجّل الدخول للوصول إلى لوحة الإدارة", en: "Sign in to access the admin panel" },
  toggle_lang: { ar: "English", en: "العربية" },
  toggle_theme: { ar: "الوضع", en: "Theme" },
  overview: { ar: "نظرة عامة", en: "Overview" },
  operations: { ar: "العمليات", en: "Operations" },
  catalog: { ar: "الكتالوج", en: "Catalog" },
  finance: { ar: "المالية", en: "Finance" },
  system: { ar: "النظام", en: "System" },
  book_now: { ar: "احجز الآن", en: "Book Now" },
  new_booking: { ar: "حجز جديد", en: "New Booking" },
  estimated_fare: { ar: "الأجرة المقدرة", en: "Estimated Fare" },
  assign_driver: { ar: "تعيين سائق", en: "Assign Driver" },
  distance_km: { ar: "المسافة (كم)", en: "Distance (km)" },
  duration_min: { ar: "المدة (دقيقة)", en: "Duration (min)" },
};

type Ctx = {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: (key: string) => string;
  setLocale: (l: Locale) => void;
};

const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "ar";
    return (localStorage.getItem("locale") as Locale) || "ar";
  });

  useEffect(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute("dir", dir);
    localStorage.setItem("locale", locale);
  }, [locale]);

  const t = (key: string) => dict[key]?.[locale] ?? key;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return <I18nCtx.Provider value={{ locale, dir, t, setLocale: setLocaleState }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n outside provider");
  return ctx;
}

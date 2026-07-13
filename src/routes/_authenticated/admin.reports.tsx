import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ExportMenu } from "@/components/ExportMenu";
import { useI18n } from "@/lib/i18n";
import { useHasPermission } from "@/lib/rbac";
import { rangeFromKey, num, money } from "@/lib/analytics";

export const Route = createFileRoute("/_authenticated/admin/reports")({ component: Reports });

type ReportDef = {
  key: string;
  label: string;
  category: string;
  table?: string;
  select?: string;
  dateColumn?: string;
  columns: { key: string; label: string; render?: (r: any) => string }[];
  extra?: (row: any) => Record<string, any>;
};

const REPORTS: ReportDef[] = [
  { key: "bookings", label: "Bookings", category: "Operations", table: "bookings",
    select: "code, status, pickup_at, pickup_location, dropoff_location, total_fare, source, customer:customers(full_name), driver:drivers(full_name)",
    dateColumn: "created_at",
    columns: [
      { key: "code", label: "Code" },
      { key: "status", label: "Status" },
      { key: "customer.full_name", label: "Customer" },
      { key: "driver.full_name", label: "Driver" },
      { key: "pickup_at", label: "Pickup" },
      { key: "pickup_location", label: "From" },
      { key: "dropoff_location", label: "To" },
      { key: "total_fare", label: "Fare" },
      { key: "source", label: "Source" },
    ]},
  { key: "customers", label: "Customers", category: "Operations", table: "customers",
    select: "full_name, phone_primary, email, status, city, total_trips, total_spent, last_booking_at",
    dateColumn: "created_at",
    columns: [
      { key: "full_name", label: "Name" }, { key: "phone_primary", label: "Phone" }, { key: "email", label: "Email" },
      { key: "status", label: "Status" }, { key: "city", label: "City" }, { key: "total_trips", label: "Trips" }, { key: "total_spent", label: "Spent" }, { key: "last_booking_at", label: "Last" },
    ]},
  { key: "drivers", label: "Drivers", category: "Operations", table: "drivers",
    select: "full_name, phone, status, total_trips, completed_trips, total_earnings, rating, license_expiry",
    dateColumn: "created_at",
    columns: [
      { key: "full_name", label: "Name" }, { key: "phone", label: "Phone" }, { key: "status", label: "Status" },
      { key: "total_trips", label: "Trips" }, { key: "completed_trips", label: "Completed" }, { key: "total_earnings", label: "Earnings" },
      { key: "rating", label: "Rating" }, { key: "license_expiry", label: "License Exp" },
    ]},
  { key: "fleet", label: "Fleet", category: "Operations", table: "vehicles",
    select: "plate_number, model, year, status, category:vehicle_categories(name), insurance_expiry, inspection_expiry, odometer",
    dateColumn: "created_at",
    columns: [
      { key: "plate_number", label: "Plate" }, { key: "model", label: "Model" }, { key: "year", label: "Year" }, { key: "status", label: "Status" },
      { key: "category.name", label: "Category" }, { key: "insurance_expiry", label: "Insurance" }, { key: "inspection_expiry", label: "Inspection" }, { key: "odometer", label: "Odometer" },
    ]},
  { key: "routes", label: "Routes", category: "Catalog", table: "routes",
    select: "name, slug, from_city, to_city, distance_km, base_price, is_active, is_featured",
    dateColumn: "created_at",
    columns: [
      { key: "name", label: "Route" }, { key: "slug", label: "Slug" }, { key: "from_city", label: "From" }, { key: "to_city", label: "To" },
      { key: "distance_km", label: "km" }, { key: "base_price", label: "Base" }, { key: "is_active", label: "Active" }, { key: "is_featured", label: "Featured" },
    ]},
  { key: "cities", label: "Cities", category: "CMS", table: "cms_pages", select: "slug, title_en, title_ar, status, published_at",
    dateColumn: "created_at",
    columns: [{ key: "slug", label: "Slug" }, { key: "title_en", label: "Title EN" }, { key: "title_ar", label: "Title AR" }, { key: "status", label: "Status" }] },
  { key: "airports", label: "Airports", category: "CMS", table: "cms_pages", select: "slug, title_en, title_ar, status, published_at",
    dateColumn: "created_at",
    columns: [{ key: "slug", label: "Slug" }, { key: "title_en", label: "Title EN" }, { key: "title_ar", label: "Title AR" }, { key: "status", label: "Status" }] },
  { key: "services", label: "Services", category: "CMS", table: "cms_pages", select: "slug, title_en, title_ar, status", dateColumn: "created_at",
    columns: [{ key: "slug", label: "Slug" }, { key: "title_en", label: "Title EN" }, { key: "title_ar", label: "Title AR" }, { key: "status", label: "Status" }] },

  { key: "finance", label: "Finance summary", category: "Finance", table: "invoices",
    select: "invoice_number, total_amount, paid_amount, status, issue_date, due_date, customer:customers(full_name)",
    dateColumn: "issue_date",
    columns: [
      { key: "invoice_number", label: "Invoice" }, { key: "customer.full_name", label: "Customer" }, { key: "total_amount", label: "Total" },
      { key: "paid_amount", label: "Paid" }, { key: "status", label: "Status" }, { key: "issue_date", label: "Issued" }, { key: "due_date", label: "Due" },
    ]},
  { key: "expenses", label: "Expenses", category: "Finance", table: "expenses",
    select: "reference, category, amount, supplier, expense_date, vehicle:vehicles(plate_number), driver:drivers(full_name)",
    dateColumn: "expense_date",
    columns: [
      { key: "reference", label: "Ref" }, { key: "category", label: "Category" }, { key: "amount", label: "Amount" }, { key: "supplier", label: "Supplier" },
      { key: "expense_date", label: "Date" }, { key: "vehicle.plate_number", label: "Vehicle" }, { key: "driver.full_name", label: "Driver" },
    ]},
  { key: "invoices", label: "Invoices", category: "Finance", table: "invoices",
    select: "invoice_number, total_amount, paid_amount, status, issue_date, due_date, customer:customers(full_name)",
    dateColumn: "issue_date",
    columns: [
      { key: "invoice_number", label: "Invoice" }, { key: "customer.full_name", label: "Customer" }, { key: "total_amount", label: "Total" },
      { key: "paid_amount", label: "Paid" }, { key: "status", label: "Status" }, { key: "issue_date", label: "Issued" }, { key: "due_date", label: "Due" },
    ]},
  { key: "payments", label: "Payments", category: "Finance", table: "payments",
    select: "payment_number, amount, method, status, paid_at, reference_number, customer:customers(full_name)",
    dateColumn: "created_at",
    columns: [
      { key: "payment_number", label: "Payment" }, { key: "customer.full_name", label: "Customer" }, { key: "amount", label: "Amount" },
      { key: "method", label: "Method" }, { key: "status", label: "Status" }, { key: "paid_at", label: "Paid" }, { key: "reference_number", label: "Ref" },
    ]},
  { key: "corporate", label: "Corporate accounts", category: "Finance", table: "corporate_accounts",
    select: "company_name, contact_email, credit_limit, current_balance, status, vat_number", dateColumn: "created_at",
    columns: [
      { key: "company_name", label: "Company" }, { key: "contact_email", label: "Email" }, { key: "credit_limit", label: "Credit" },
      { key: "current_balance", label: "Balance" }, { key: "status", label: "Status" }, { key: "vat_number", label: "VAT" },
    ]},

  { key: "marketing", label: "Marketing campaigns", category: "Marketing", table: "marketing_campaigns",
    select: "name, channel, status, start_date, end_date, budget, spent", dateColumn: "created_at",
    columns: [
      { key: "name", label: "Name" }, { key: "channel", label: "Channel" }, { key: "status", label: "Status" },
      { key: "start_date", label: "Start" }, { key: "end_date", label: "End" }, { key: "budget", label: "Budget" }, { key: "spent", label: "Spent" },
    ]},
  { key: "whatsapp", label: "WhatsApp messages", category: "Marketing", table: "whatsapp_messages",
    select: "direction, phone, template, status, sent_at, booking_id", dateColumn: "created_at",
    columns: [
      { key: "direction", label: "Direction" }, { key: "phone", label: "Phone" }, { key: "template", label: "Template" },
      { key: "status", label: "Status" }, { key: "sent_at", label: "Sent" }, { key: "booking_id", label: "Booking" },
    ]},
  { key: "contacts", label: "Contact requests", category: "Marketing", table: "contact_submissions",
    select: "name, email, phone, subject, status, priority, assigned_to", dateColumn: "created_at",
    columns: [
      { key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" },
      { key: "subject", label: "Subject" }, { key: "status", label: "Status" }, { key: "priority", label: "Priority" },
    ]},

  { key: "seo", label: "SEO audit", category: "SEO", table: "seo_meta",
    select: "path, title, description, canonical_url, robots, updated_at", dateColumn: "created_at",
    columns: [
      { key: "path", label: "Path" }, { key: "title", label: "Title" }, { key: "description", label: "Description" },
      { key: "canonical_url", label: "Canonical" }, { key: "robots", label: "Robots" },
    ]},
  { key: "cms", label: "CMS pages", category: "CMS", table: "cms_pages",
    select: "slug, page_type, title_en, title_ar, status, published_at", dateColumn: "created_at",
    columns: [
      { key: "slug", label: "Slug" }, { key: "page_type", label: "Type" }, { key: "title_en", label: "Title EN" },
      { key: "title_ar", label: "Title AR" }, { key: "status", label: "Status" }, { key: "published_at", label: "Published" },
    ]},

  { key: "users", label: "Users", category: "System", table: "profiles",
    select: "email, full_name, phone, created_at", dateColumn: "created_at",
    columns: [{ key: "email", label: "Email" }, { key: "full_name", label: "Name" }, { key: "phone", label: "Phone" }, { key: "created_at", label: "Joined" }] },
  { key: "activity", label: "Activity logs", category: "System", table: "activity_events",
    select: "entity_type, entity_id, event_type, from_value, to_value, message, actor_id", dateColumn: "created_at",
    columns: [
      { key: "created_at", label: "When" }, { key: "entity_type", label: "Entity" }, { key: "event_type", label: "Event" },
      { key: "from_value", label: "From" }, { key: "to_value", label: "To" }, { key: "message", label: "Message" },
    ]},
];

const CATEGORIES = Array.from(new Set(REPORTS.map((r) => r.category)));

const CAT_LABEL_AR: Record<string, string> = {
  Operations: "العمليات", Catalog: "الكتالوج", CMS: "المحتوى",
  Finance: "المالية", Marketing: "التسويق", SEO: "السيو", System: "النظام",
};

const getVal = (obj: any, path: string): any => path.split(".").reduce((v, k) => (v == null ? v : v[k]), obj);

function Reports() {
  const { locale } = useI18n();
  const ar = locale === "ar";

  const gate = useHasPermission("reports.view");
  const [selected, setSelected] = useState<string>("bookings");
  const [rangeKey, setRangeKey] = useState<"7d"|"30d"|"90d"|"365d"|"mtd"|"ytd">("30d");
  const [q, setQ] = useState("");
  const range = useMemo(() => rangeFromKey(rangeKey), [rangeKey]);
  const def = REPORTS.find((r) => r.key === selected)!;

  const query = useQuery({
    queryKey: ["report", selected, rangeKey],
    enabled: gate.allowed,
    queryFn: async () => {
      const b: any = (supabase.from as any)(def.table)
        .select(def.select ?? "*")
        .order(def.dateColumn ?? "created_at", { ascending: false })
        .limit(2000);
      if (def.dateColumn) {
        b.gte(def.dateColumn, range.start.toISOString());
        b.lte(def.dateColumn, range.end.toISOString());
      }
      const { data } = await b;
      return data ?? [];
    },
  });

  const rows = query.data ?? [];
  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter((r: any) => JSON.stringify(r).toLowerCase().includes(s));
  }, [rows, q]);

  const flatRows = filtered.map((r: any) => {
    const out: Record<string, any> = {};
    def.columns.forEach((c) => { out[c.key.replaceAll(".", "_")] = getVal(r, c.key); });
    return out;
  });
  const flatCols = def.columns.map((c) => ({ key: c.key.replaceAll(".", "_"), label: c.label }));

  if (!gate.loading && !gate.allowed) return <div className="p-8 text-center text-muted-foreground">Not authorized</div>;

  return (
    <div>
      <PageHeader
        title={locale === "ar" ? "التقارير" : "Reports"}
        description={locale === "ar" ? "تقارير مؤسسية قابلة للتصدير" : `${REPORTS.length} reports across ${CATEGORIES.length} categories`}
        actions={
          <div className="flex items-center gap-2">
            <Select value={rangeKey} onValueChange={(v: any) => setRangeKey(v)}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="mtd">Month to date</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
                <SelectItem value="365d">Last 365 days</SelectItem>
              </SelectContent>
            </Select>
            <ExportMenu module="reports" filename={`report-${selected}-${rangeKey}`} title={def.label} rows={flatRows} columns={flatCols} />
          </div>
        }
      />

      <Tabs value={CATEGORIES.find((c) => REPORTS.find((r) => r.key === selected && r.category === c))} onValueChange={() => {}}>
        <TabsList className="mb-4 flex-wrap h-auto">
          {CATEGORIES.map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
        </TabsList>
        {CATEGORIES.map((c) => (
          <TabsContent key={c} value={c}>
            <div className="flex flex-wrap gap-2 mb-4">
              {REPORTS.filter((r) => r.category === c).map((r) => (
                <button key={r.key} onClick={() => setSelected(r.key)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition ${selected === r.key ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-gold"}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>{def.label}</CardTitle>
            <div className="text-xs text-muted-foreground mt-1">{filtered.length} rows · {def.category}</div>
          </div>
          <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>{def.columns.map((c) => <TableHead key={c.key}>{c.label}</TableHead>)}</TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 500).map((r: any, i: number) => (
                <TableRow key={r.id ?? i}>
                  {def.columns.map((c) => {
                    const v = getVal(r, c.key);
                    return <TableCell key={c.key} className="max-w-[220px] truncate">
                      {typeof v === "boolean" ? <Badge variant="outline">{v ? "yes" : "no"}</Badge>
                        : typeof v === "number" && ["amount","total","fare","earnings","spent","paid","budget","credit","balance"].some((k) => c.key.toLowerCase().includes(k)) ? <span className="font-mono">{money(locale, v)}</span>
                        : v instanceof Date ? v.toLocaleString() : (v == null ? "—" : String(v))}
                    </TableCell>;
                  })}
                </TableRow>
              ))}
              {!filtered.length && <TableRow><TableCell colSpan={def.columns.length} className="text-center text-muted-foreground py-8">{query.isLoading ? "Loading…" : "No data"}</TableCell></TableRow>}
            </TableBody>
          </Table>
          {filtered.length > 500 && <div className="text-center text-xs text-muted-foreground py-3">Showing first 500 of {filtered.length}. Export for full dataset.</div>}
        </CardContent>
      </Card>
    </div>
  );
}

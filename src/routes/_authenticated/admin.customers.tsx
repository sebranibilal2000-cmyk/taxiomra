import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, ExternalLink, Crown, Building2, User, Ban, Download, Edit, Trash2 } from "lucide-react";
import { downloadCsv } from "@/lib/csv";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { CustomerTierBadge } from "@/components/CustomerTierBadge";

export const Route = createFileRoute("/_authenticated/admin/customers")({ component: CustomersPage });

const TIERS = ["all", "regular", "vip", "corporate", "blacklisted"] as const;
const TIER_ICONS: Record<string, any> = { all: User, regular: User, vip: Crown, corporate: Building2, blacklisted: Ban };

function CustomersPage() {
  const { t, locale } = useI18n();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState<string>("all");
  const [activity, setActivity] = useState<string>("any"); // any | active | inactive_30 | inactive_60 | inactive_90 | upcoming
  const [minRevenue, setMinRevenue] = useState<string>("");

  const q = useQuery({
    queryKey: ["customers"],
    queryFn: async () => (await supabase.from("customers").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const upcoming = useQuery({
    queryKey: ["customers-upcoming-ids"],
    queryFn: async () => {
      const { data } = await supabase.from("bookings").select("customer_id").gte("pickup_at", new Date().toISOString()).in("status", ["pending", "confirmed", "assigned", "en_route"]);
      return new Set((data ?? []).map((b: any) => b.customer_id));
    },
  });

  const filtered = useMemo(() => {
    const rows = q.data ?? [];
    const s = search.trim().toLowerCase();
    const now = Date.now();
    const minRev = Number(minRevenue) || 0;
    const daysAgo = (n: number) => now - n * 86400_000;
    return rows.filter((r: any) => {
      if (tier !== "all" && r.tier !== tier) return false;
      if (minRev && Number(r.total_spent) < minRev) return false;
      if (activity === "active" && (!r.last_booking_at || new Date(r.last_booking_at).getTime() < daysAgo(30))) return false;
      if (activity === "inactive_30" && (!r.last_booking_at || new Date(r.last_booking_at).getTime() >= daysAgo(30))) return false;
      if (activity === "inactive_60" && (!r.last_booking_at || new Date(r.last_booking_at).getTime() >= daysAgo(60))) return false;
      if (activity === "inactive_90" && (!r.last_booking_at || new Date(r.last_booking_at).getTime() >= daysAgo(90))) return false;
      if (activity === "upcoming" && !upcoming.data?.has(r.id)) return false;
      if (!s) return true;
      const hay = [r.full_name, r.phone, r.alt_phone, r.whatsapp, r.email, r.company, r.vat_number].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(s);
    });
  }, [q.data, search, tier, activity, minRevenue, upcoming.data]);

  const columns: Column<any>[] = [
    {
      key: "full_name", header: t("name"),
      render: (r) => (
        <div className="min-w-0">
          <Link to="/admin/customers/$id" params={{ id: r.id }} className="font-medium hover:text-gold flex items-center gap-1.5">
            {r.full_name} <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100" />
          </Link>
          {r.company && <div className="text-xs text-muted-foreground truncate">{r.company}</div>}
        </div>
      ),
    },
    { key: "tier", header: locale === "ar" ? "الفئة" : "Tier", render: (r) => <CustomerTierBadge value={r.tier} /> },
    { key: "phone", header: t("phone"), render: (r) => <span className="font-mono text-xs">{r.phone ?? "—"}</span> },
    { key: "email", header: t("email"), render: (r) => <span className="text-xs">{r.email ?? "—"}</span> },
    { key: "total_trips", header: locale === "ar" ? "الرحلات" : "Trips", render: (r) => r.total_trips },
    { key: "total_spent", header: locale === "ar" ? "الإنفاق" : "Revenue", render: (r) => <span className="font-medium">{Number(r.total_spent).toFixed(2)}</span> },
    {
      key: "last_booking_at", header: locale === "ar" ? "آخر حجز" : "Last booking",
      render: (r) => r.last_booking_at ? <span className="text-xs">{new Date(r.last_booking_at).toLocaleDateString()}</span> : <span className="text-xs text-muted-foreground">—</span>,
    },
    {
      key: "tags", header: locale === "ar" ? "الوسوم" : "Tags",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {(r.tags ?? []).slice(0, 3).map((tag: string) => <Badge key={tag} variant="outline" className="text-[10px] py-0 h-4">{tag}</Badge>)}
          {(r.tags ?? []).length > 3 && <span className="text-[10px] text-muted-foreground">+{r.tags.length - 3}</span>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={t("customers")}
        description={locale === "ar" ? "قاعدة بيانات العملاء الكاملة" : "Enterprise customer CRM"}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              downloadCsv(`customers-${new Date().toISOString().slice(0,10)}.csv`, filtered.map((r: any) => ({
                full_name: r.full_name, tier: r.tier, phone: r.phone, alt_phone: r.alt_phone, whatsapp: r.whatsapp, email: r.email,
                company: r.company, vat_number: r.vat_number, city: r.city, country: r.country,
                total_trips: r.total_trips, completed_trips: r.completed_trips, cancelled_trips: r.cancelled_trips,
                total_spent: r.total_spent, avg_booking_value: r.avg_booking_value,
                first_booking_at: r.first_booking_at, last_booking_at: r.last_booking_at,
                preferred_language: r.preferred_language, tags: (r.tags ?? []).join("|"), notes: r.notes,
              })));
              toast.success(locale === "ar" ? `${filtered.length} صف` : `${filtered.length} rows`);
            }}><Download className="h-4 w-4 me-1" />CSV</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4 me-1" />{t("new")}</Button></DialogTrigger>
              <NewCustomerDialog onDone={() => { setOpen(false); qc.invalidateQueries({ queryKey: ["customers"] }); }} />
            </Dialog>
          </div>
        }
      />

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] mb-4">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={locale === "ar" ? "بحث بالاسم، الهاتف، الشركة..." : "Search name, phone, email, company, VAT…"} value={search} onChange={(e) => setSearch(e.target.value)} className="ps-9" />
        </div>
        <Select value={tier} onValueChange={setTier}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {TIERS.map((v) => {
              const Icon = TIER_ICONS[v];
              const TIER_LABEL_AR: Record<string, string> = { regular: "عادي", vip: "VIP", corporate: "شركات", blacklisted: "محظور", all: "الكل" };
              const label = v === "all" ? (locale === "ar" ? "كل الفئات" : "All tiers") : (locale === "ar" ? TIER_LABEL_AR[v] : v);
              return <SelectItem key={v} value={v}><span className="inline-flex items-center gap-2"><Icon className="h-3.5 w-3.5" />{label}</span></SelectItem>;

            })}
          </SelectContent>
        </Select>
        <Select value={activity} onValueChange={setActivity}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{locale === "ar" ? "كل النشاط" : "Any activity"}</SelectItem>
            <SelectItem value="upcoming">{locale === "ar" ? "لديه حجز قادم" : "Has upcoming booking"}</SelectItem>
            <SelectItem value="active">{locale === "ar" ? "نشط (30 يوم)" : "Active (last 30d)"}</SelectItem>
            <SelectItem value="inactive_30">{locale === "ar" ? "خامل 30+ يوم" : "Inactive 30+ days"}</SelectItem>
            <SelectItem value="inactive_60">{locale === "ar" ? "خامل 60+ يوم" : "Inactive 60+ days"}</SelectItem>
            <SelectItem value="inactive_90">{locale === "ar" ? "خامل 90+ يوم" : "Inactive 90+ days"}</SelectItem>
          </SelectContent>
        </Select>
        <Input type="number" placeholder={locale === "ar" ? "حد أدنى للإنفاق" : "Min revenue"} value={minRevenue} onChange={(e) => setMinRevenue(e.target.value)} className="w-36" />
      </div>

      <div className="text-xs text-muted-foreground mb-2">{filtered.length} {locale === "ar" ? "عميل" : "customers"}</div>

      <DataTable data={filtered} columns={columns} loading={q.isLoading}
        actions={(r) => (
          <div className="flex items-center gap-1">
            <Link to="/admin/customers/$id" params={{ id: r.id }}>
              <Button variant="ghost" size="sm" title={locale === "ar" ? "تعديل" : "Edit"}><Edit className="h-4 w-4" /></Button>
            </Link>
            <Button variant="ghost" size="sm" title={locale === "ar" ? "حذف" : "Delete"} onClick={async () => {
              if (!confirm(locale === "ar" ? "حذف العميل؟" : "Delete customer?")) return;
              const { error } = await supabase.from("customers").delete().eq("id", r.id);
              if (error) toast.error(error.message);
              else { toast.success(locale === "ar" ? "تم الحذف" : "Deleted"); qc.invalidateQueries({ queryKey: ["customers"] }); }
            }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        )}
      />

    </div>
  );
}

function NewCustomerDialog({ onDone }: { onDone: () => void }) {
  const { t, locale } = useI18n();
  const [form, setForm] = useState({
    full_name: "", phone: "", alt_phone: "", whatsapp: "", email: "",
    company: "", vat_number: "", city: "", country: "",
    tier: "regular", preferred_language: "en", notes: "",
  });
  const save = useMutation({
    mutationFn: async () => {
      const payload: any = { ...form };
      Object.keys(payload).forEach((k) => { if (payload[k] === "") payload[k] = null; });
      const { error } = await supabase.from("customers").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => { toast.success(locale === "ar" ? "تم إنشاء العميل" : "Customer created"); onDone(); },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{t("new")} {t("customer")}</DialogTitle></DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2"><Label>{t("name")} *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
        <div><Label>{t("phone")}</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div><Label>Alt phone</Label><Input value={form.alt_phone} onChange={(e) => setForm({ ...form, alt_phone: e.target.value })} /></div>
        <div><Label>WhatsApp</Label><Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} /></div>
        <div><Label>{t("email")}</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
        <div><Label>VAT number</Label><Input value={form.vat_number} onChange={(e) => setForm({ ...form, vat_number: e.target.value })} /></div>
        <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
        <div><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
        <div>
          <Label>Tier</Label>
          <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="blacklisted">Blacklisted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Preferred language</Label>
          <Select value={form.preferred_language} onValueChange={(v) => setForm({ ...form, preferred_language: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="ar">العربية</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2"><Label>Notes</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onDone()}>{t("cancel")}</Button>
        <Button disabled={!form.full_name || save.isPending} onClick={() => save.mutate()}>{t("save")}</Button>
      </DialogFooter>
    </DialogContent>
  );
}

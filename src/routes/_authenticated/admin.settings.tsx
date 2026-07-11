import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/_authenticated/admin/settings")({ component: Settings });

function Settings() {
  const { t, locale } = useI18n();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["settings"], queryFn: async () => (await supabase.from("settings").select("*").order("key")).data ?? [] });
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (q.data) {
      const v: Record<string, string> = {};
      q.data.forEach((s) => { v[s.key] = typeof s.value === "string" ? s.value : JSON.stringify(s.value); });
      setValues(v);
    }
  }, [q.data]);

  const save = async (key: string) => {
    let value: any = values[key];
    try { value = JSON.parse(values[key]); } catch { /* keep as string */ }
    const { error } = await supabase.from("settings").update({ value }).eq("key", key);
    if (error) toast.error(error.message); else { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["settings"] }); }
  };

  return (
    <div>
      <PageHeader title={t("settings")} description={locale === "ar" ? "إعدادات النظام العامة" : "System-wide settings"} />
      <Card>
        <CardContent className="p-6 space-y-4">
          {(q.data ?? []).map((s) => (
            <div key={s.key} className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-3 items-center border-b pb-3 last:border-0">
              <div>
                <Label className="font-mono text-xs">{s.key}</Label>
                {s.description && <div className="text-xs text-muted-foreground mt-1">{s.description}</div>}
              </div>
              <Input value={values[s.key] ?? ""} onChange={(e) => setValues({ ...values, [s.key]: e.target.value })} />
              <Button size="sm" onClick={() => save(s.key)}>{t("save")}</Button>
            </div>
          ))}
          {(q.data ?? []).length === 0 && <div className="text-center py-6 text-muted-foreground">{t("no_data")}</div>}
        </CardContent>
      </Card>
    </div>
  );
}

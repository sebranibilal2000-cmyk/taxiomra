import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { exportAllData } from "@/lib/ops.functions";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Database, ShieldCheck, HardDrive, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/backup")({ component: BackupPage });

function BackupPage() {
  const fn = useServerFn(exportAllData);
  const exp = useMutation({
    mutationFn: () => fn({ data: undefined as unknown as void }),
    onSuccess: (res: any) => {
      const blob = new Blob([res.json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      a.href = url;
      a.download = `sur3a-backup-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded");
    },
    onError: (e: any) => toast.error(e?.message ?? "Export failed"),
  });

  return (
    <div>
      <PageHeader title="Backup & Recovery" description="On-demand data exports and information about the platform's continuous backup coverage." />

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="p-5">
          <Database className="h-6 w-6 text-emerald-600 mb-3" />
          <h3 className="font-semibold">Database</h3>
          <p className="text-sm text-muted-foreground mt-1">Automated daily point-in-time backups are managed by Lovable Cloud. Restore-to-point is available on request.</p>
        </Card>
        <Card className="p-5">
          <HardDrive className="h-6 w-6 text-emerald-600 mb-3" />
          <h3 className="font-semibold">Media storage</h3>
          <p className="text-sm text-muted-foreground mt-1">Uploaded documents and media are stored in encrypted buckets with redundant replicas.</p>
        </Card>
        <Card className="p-5">
          <ShieldCheck className="h-6 w-6 text-emerald-600 mb-3" />
          <h3 className="font-semibold">Access control</h3>
          <p className="text-sm text-muted-foreground mt-1">Row-Level Security ensures every read and write is scoped to authorized roles.</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="max-w-lg">
            <h3 className="font-semibold text-lg">Export all business data</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Downloads one JSON archive containing every operational table — bookings, customers, drivers, fleet, finance, CMS, and settings — up to 50,000 rows per table. Admin-only.
            </p>
          </div>
          <Button onClick={() => exp.mutate()} disabled={exp.isPending} size="lg" className="gap-2">
            {exp.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {exp.isPending ? "Preparing…" : "Download JSON"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

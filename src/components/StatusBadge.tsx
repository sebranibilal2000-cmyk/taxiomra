import { Badge } from "@/components/ui/badge";

const map: Record<string, { label: string; variant: any; className?: string }> = {
  pending: { label: "Pending", variant: "secondary", className: "bg-warning/20 text-warning-foreground border-warning/30" },
  assigned: { label: "Assigned", variant: "secondary", className: "bg-chart-2/20 text-chart-2 border-chart-2/30" },
  en_route: { label: "En route", variant: "secondary", className: "bg-chart-2/20 text-chart-2 border-chart-2/30" },
  on_trip: { label: "On trip", variant: "secondary", className: "bg-primary/20 text-primary border-primary/30" },
  completed: { label: "Completed", variant: "secondary", className: "bg-success/20 text-success border-success/30" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  no_show: { label: "No show", variant: "destructive" },
  available: { label: "Available", variant: "secondary", className: "bg-success/20 text-success border-success/30" },
  busy: { label: "Busy", variant: "secondary", className: "bg-primary/20 text-primary border-primary/30" },
  offline: { label: "Offline", variant: "secondary" },
  suspended: { label: "Suspended", variant: "destructive" },
  active: { label: "Active", variant: "secondary", className: "bg-success/20 text-success border-success/30" },
  maintenance: { label: "Maintenance", variant: "secondary", className: "bg-warning/20 text-warning-foreground border-warning/30" },
  inactive: { label: "Inactive", variant: "secondary" },
  paid: { label: "Paid", variant: "secondary", className: "bg-success/20 text-success border-success/30" },
  refunded: { label: "Refunded", variant: "secondary" },
  failed: { label: "Failed", variant: "destructive" },
};

export function StatusBadge({ value }: { value: string | null | undefined }) {
  if (!value) return <Badge variant="outline">—</Badge>;
  const m = map[value] ?? { label: value, variant: "secondary" };
  return <Badge variant={m.variant} className={m.className}>{m.label}</Badge>;
}
